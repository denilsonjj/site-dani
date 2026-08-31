import { NextResponse } from "next/server";
import {
  getCheckoutProduct,
  markCheckoutSubmissionStarted,
  releaseCheckoutSeat,
  reserveCheckoutSeat,
  saveCheckoutSubmission,
  type IntakeField,
} from "@/lib/cms";
import { locales, type Locale } from "@/lib/content";
import { safeTimeZone } from "@/lib/scheduling";
import { siteConfig } from "@/lib/site";
import { getAppUrl, getStripe } from "@/lib/stripe";

type CheckoutPayload = {
  age?: string;
  email?: string;
  intake?: Record<string, unknown>;
  locale?: string;
  name?: string;
  policyAccepted?: boolean;
  productId?: string;
  timeZone?: string;
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsapp;

function normaliseLocale(locale?: string): Locale {
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return "pt";
}

function requiredField(field: IntakeField) {
  return {
    helpText: field.helpText,
    key: field.key,
    label: field.label,
    options: field.options,
    type: field.fieldType,
  };
}

const invalidDateCopy: Record<Locale, string> = {
  pt: "Selecione uma das datas disponíveis para este atendimento.",
  en: "Please choose one of the available dates for this session.",
  es: "Selecciona una de las fechas disponibles para esta sesión.",
  nl: "Kies een van de beschikbare data voor deze sessie.",
};

const noAvailabilityCopy: Record<Locale, string> = {
  pt: "Não há horários disponíveis para esta sessão neste momento.",
  en: "There are no available times for this session at the moment.",
  es: "No hay horarios disponibles para esta sesión en este momento.",
  nl: "Er zijn momenteel geen beschikbare tijden voor deze sessie.",
};

const invalidSlotCopy: Record<Locale, string> = {
  pt: "Este horário já não está disponível. Escolha outra opção.",
  en: "This time is no longer available. Please choose another option.",
  es: "Este horario ya no está disponible. Elige otra opción.",
  nl: "Dit tijdstip is niet meer beschikbaar. Kies een ander tijdstip.",
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const locale = normaliseLocale(payload?.locale);
  const customerTimeZone = safeTimeZone(payload?.timeZone);
  const product = payload?.productId ? await getCheckoutProduct(payload.productId, locale, customerTimeZone) : null;

  if (!payload || !product || !payload.productId) {
    return NextResponse.json({ error: "Produto invalido para checkout." }, { status: 400 });
  }

  const intakePayload: Record<string, unknown> = {
    ...(payload.intake || {}),
    ...(payload.name ? { name: payload.name } : {}),
    ...(payload.age ? { age: payload.age } : {}),
    ...(payload.email ? { email: payload.email } : {}),
  };
  const customerName = payload.name || String(intakePayload.full_name || intakePayload.name || "");
  const customerEmail = payload.email || String(intakePayload.email || "");
  const appointmentDate = String(intakePayload.appointment_date || "");
  const appointmentStart = String(intakePayload.appointment_start || "");
  const appointmentSlot = product.appointmentSlots.find((slot) => slot.start === appointmentStart);
  if (appointmentSlot) {
    intakePayload.appointment_end = appointmentSlot.end;
    intakePayload.appointment_time_zone = customerTimeZone;
  }
  const missingRequiredFields = product.intakeFields
    .filter((field) => field.required)
    .filter((field) => {
      const value = intakePayload[field.key];
      return value === undefined || value === null || value === "" || value === false;
    });

  if (product.scheduleEnabled && !product.appointmentSlots.length) {
    return NextResponse.json({ error: noAvailabilityCopy[locale] }, { status: 409 });
  }

  if (product.requiresIntake && missingRequiredFields.length > 0) {
    return NextResponse.json(
      {
        error: "Este serviço precisa de formulário obrigatório antes do pagamento.",
        policyRequired: product.requiresPolicyAcceptance,
        requiredFields: missingRequiredFields.map(requiredField),
      },
      { status: payload.intake ? 422 : 200 },
    );
  }

  if (product.availableDates.length && !product.availableDates.includes(appointmentDate)) {
    return NextResponse.json(
      {
        error: invalidDateCopy[locale],
        policyRequired: product.requiresPolicyAcceptance,
        requiredFields: product.intakeFields.map(requiredField),
      },
      { status: 422 },
    );
  }

  if (product.scheduleEnabled && !appointmentSlot) {
    return NextResponse.json(
      {
        error: invalidSlotCopy[locale],
        policyRequired: product.requiresPolicyAcceptance,
        requiredFields: product.intakeFields.map(requiredField),
      },
      { status: 422 },
    );
  }

  if (product.requiresIntake && product.requiresPolicyAcceptance && !payload.policyAccepted) {
    return NextResponse.json(
      {
        error: "Para continuar, é necessário aceitar o Termo de Conduta e a Política de Cancelamento.",
        policyRequired: true,
        requiredFields: product.intakeFields.map(requiredField),
      },
      { status: 422 },
    );
  }

  const priceId = product.stripePriceEnv ? process.env[product.stripePriceEnv] : undefined;
  const message = encodeURIComponent(
    `Ola, tenho interesse em ${product.name}.${customerName ? ` Nome: ${customerName}.` : ""}${
      payload.age ? ` Idade: ${payload.age}.` : ""
    }${customerEmail ? ` E-mail: ${customerEmail}.` : ""}${appointmentDate ? ` Data: ${appointmentDate}.` : ""}${
      appointmentStart ? ` Horário: ${appointmentStart}.` : ""
    }`,
  );

  if (!process.env.STRIPE_SECRET_KEY || (!priceId && !product.amountCents)) {
    await saveCheckoutSubmission({
      appointmentEnd: appointmentSlot?.end,
      appointmentStart: appointmentSlot?.start,
      customerEmail,
      customerName,
      customerTimeZone,
      locale,
      payload: intakePayload,
      policyAccepted: Boolean(payload.policyAccepted),
      productId: payload.productId,
      serviceId: product.serviceId,
      status: "manual_whatsapp",
    });

    return NextResponse.json({
      configured: false,
      message: "Pagamento Stripe ainda nao configurado. A solicitacao pode seguir por WhatsApp.",
      whatsappUrl: `https://wa.me/${whatsappNumber}?text=${message}`,
    });
  }

  const appUrl = getAppUrl();
  const submission = await saveCheckoutSubmission({
    appointmentEnd: appointmentSlot?.end,
    appointmentStart: appointmentSlot?.start,
    customerEmail,
    customerName,
    customerTimeZone,
    locale,
    payload: intakePayload,
    policyAccepted: Boolean(payload.policyAccepted),
    productId: payload.productId,
    serviceId: product.serviceId,
    status: "created",
  });

  if (!submission.id) {
    return NextResponse.json(
      { error: submission.appointmentConflict ? invalidSlotCopy[locale] : "Não foi possível guardar os dados do agendamento." },
      { status: submission.appointmentConflict ? 409 : 500 },
    );
  }

  if (submission.id) {
    const reservation = await reserveCheckoutSeat(submission.id);
    if (!reservation.ok) {
      await releaseCheckoutSeat(submission.id);
      return NextResponse.json(
        {
          error: "Este produto está sem vagas disponíveis no momento.",
          remainingSeats: reservation.remainingSeats,
        },
        { status: 409 },
      );
    }
  }

  let session;
  try {
    const lineItem = product.amountCents
      ? {
          price_data: {
            currency: (product.currency || "EUR").toLowerCase(),
            product_data: {
              name: product.name,
            },
            unit_amount: product.amountCents,
          },
          quantity: 1,
        }
      : { price: priceId, quantity: 1 };

    session = await getStripe().checkout.sessions.create({
      allow_promotion_codes: true,
      customer_email: customerEmail || undefined,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      line_items: [lineItem],
      metadata: {
        age: payload.age || "",
        appointmentDate,
        appointmentEnd: appointmentSlot?.end || "",
        appointmentStart: appointmentSlot?.start || "",
        customerTimeZone,
        locale,
        name: customerName || "",
        productId: payload.productId,
        submissionId: submission.id,
      },
      mode: "payment",
      success_url: `${appUrl}/${locale}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/pagamento/cancelado`,
    });
  } catch (error) {
    if (submission.id) {
      await releaseCheckoutSeat(submission.id);
    }

    throw error;
  }

  if (submission.id && session.id) {
    await markCheckoutSubmissionStarted(submission.id, session.id);
  }

  return NextResponse.json({
    configured: true,
    url: session.url,
  });
}
