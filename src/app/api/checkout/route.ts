import { NextResponse } from "next/server";
import {
  getCheckoutProduct,
  markCheckoutSubmissionStarted,
  releaseCheckoutSeat,
  reserveCheckoutSeat,
  saveCheckoutSubmission,
} from "@/lib/cms";
import { locales, type Locale } from "@/lib/content";
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
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsapp;

function normaliseLocale(locale?: string): Locale {
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return "pt";
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const locale = normaliseLocale(payload?.locale);
  const product = payload?.productId ? await getCheckoutProduct(payload.productId, locale) : null;

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
  const missingRequiredFields = product.intakeFields
    .filter((field) => field.required)
    .filter((field) => {
      const value = intakePayload[field.key];
      return value === undefined || value === null || value === "" || value === false;
    });

  if (product.requiresIntake && missingRequiredFields.length > 0) {
    return NextResponse.json(
      {
        error: "Este serviço precisa de formulário obrigatório antes do pagamento.",
        policyRequired: product.requiresPolicyAcceptance,
        requiredFields: missingRequiredFields.map((field) => ({
          helpText: field.helpText,
          key: field.key,
          label: field.label,
          type: field.fieldType,
        })),
      },
      { status: 422 },
    );
  }

  if (product.requiresIntake && product.requiresPolicyAcceptance && !payload.policyAccepted) {
    return NextResponse.json(
      {
        error: "Para continuar, é necessário aceitar o Termo de Conduta e a Política de Cancelamento.",
        policyRequired: true,
        requiredFields: product.intakeFields.map((field) => ({
          helpText: field.helpText,
          key: field.key,
          label: field.label,
          type: field.fieldType,
        })),
      },
      { status: 422 },
    );
  }

  const priceId = product.stripePriceEnv ? process.env[product.stripePriceEnv] : undefined;
  const message = encodeURIComponent(
    `Ola, tenho interesse em ${product.name}.${customerName ? ` Nome: ${customerName}.` : ""}${
      payload.age ? ` Idade: ${payload.age}.` : ""
    }${customerEmail ? ` E-mail: ${customerEmail}.` : ""}`,
  );

  if (!process.env.STRIPE_SECRET_KEY || (!priceId && !product.amountCents)) {
    await saveCheckoutSubmission({
      customerEmail,
      customerName,
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
    customerEmail,
    customerName,
    locale,
    payload: intakePayload,
    policyAccepted: Boolean(payload.policyAccepted),
    productId: payload.productId,
    serviceId: product.serviceId,
    status: "created",
  });

  if (submission?.id) {
    const reservation = await reserveCheckoutSeat(submission.id);
    if (!reservation.ok) {
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
      line_items: [lineItem],
      metadata: {
        age: payload.age || "",
        locale,
        name: customerName || "",
        productId: payload.productId,
        submissionId: submission?.id || "",
      },
      mode: "payment",
      success_url: `${appUrl}/${locale}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/pagamento/cancelado`,
    });
  } catch (error) {
    if (submission?.id) {
      await releaseCheckoutSeat(submission.id);
    }

    throw error;
  }

  if (submission?.id && session.id) {
    await markCheckoutSubmissionStarted(submission.id, session.id);
  }

  return NextResponse.json({
    configured: true,
    url: session.url,
  });
}
