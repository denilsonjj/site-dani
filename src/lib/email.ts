import { Resend } from "resend";
import type { CheckoutReceipt } from "./cms";
import type { Locale } from "./content";
import { safeTimeZone } from "./scheduling";
import { siteConfig } from "./site";

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const receiptCopy: Record<Locale, {
  appointment: string;
  appointmentAmsterdam: string;
  contact: string;
  contactEmail: string;
  contactWhatsapp: string;
  confirmed: string;
  cookies: string;
  courseTerms: string;
  details: string;
  duration: string;
  greeting: (name: string) => string;
  intro: string;
  legal: string;
  manageBooking: string;
  manageBookingMessage: (reference: string) => string;
  next: string;
  nextText: string;
  price: string;
  privacy: string;
  product: string;
  reference: string;
  subject: (product: string) => string;
  terms: string;
  thanks: string;
}> = {
  pt: {
    appointment: "Data e horário do atendimento",
    appointmentAmsterdam: "Horário em Amesterdão",
    contact: "Contacto e suporte",
    contactEmail: "Enviar e-mail",
    contactWhatsapp: "Falar pelo WhatsApp",
    confirmed: "Pagamento confirmado",
    cookies: "Política de Cookies",
    courseTerms: "Termos e Conduta do Curso",
    details: "Detalhes da compra",
    duration: "Duração",
    greeting: (name) => `Olá${name ? `, ${name}` : ""}.`,
    intro: "Recebemos a confirmação do seu pagamento. Abaixo estão os detalhes da sua compra.",
    legal: "Informações legais",
    manageBooking: "Cancelar ou reagendar",
    manageBookingMessage: (reference) => `Olá, preciso de ajuda para cancelar ou reagendar a compra com a referência ${reference}.`,
    next: "Próximos passos",
    nextText: "A Dani Therapies entrará em contacto com as orientações necessárias para o atendimento ou curso adquirido.",
    price: "Investimento",
    privacy: "Política de Privacidade",
    product: "Compra",
    reference: "Referência",
    subject: (product) => `Confirmação da sua compra: ${product}`,
    terms: "Termos e Condições",
    thanks: "Obrigada pela confiança.",
  },
  en: {
    appointment: "Session date and time",
    appointmentAmsterdam: "Amsterdam time",
    contact: "Contact and support",
    contactEmail: "Send an email",
    contactWhatsapp: "Contact us on WhatsApp",
    confirmed: "Payment confirmed",
    cookies: "Cookie Policy",
    courseTerms: "Course Terms and Conduct",
    details: "Purchase details",
    duration: "Duration",
    greeting: (name) => `Hello${name ? `, ${name}` : ""}.`,
    intro: "Your payment has been confirmed. You can find the details of your purchase below.",
    legal: "Legal information",
    manageBooking: "Cancel or reschedule",
    manageBookingMessage: (reference) => `Hello, I need help cancelling or rescheduling the purchase with reference ${reference}.`,
    next: "Next steps",
    nextText: "Dani Therapies will contact you with the guidance needed for the session or course you purchased.",
    price: "Investment",
    privacy: "Privacy Policy",
    product: "Purchase",
    reference: "Reference",
    subject: (product) => `Your purchase confirmation: ${product}`,
    terms: "Terms and Conditions",
    thanks: "Thank you for your trust.",
  },
  es: {
    appointment: "Fecha y hora de la sesión",
    appointmentAmsterdam: "Hora de Ámsterdam",
    contact: "Contacto y asistencia",
    contactEmail: "Enviar un correo electrónico",
    contactWhatsapp: "Contactar por WhatsApp",
    confirmed: "Pago confirmado",
    cookies: "Política de Cookies",
    courseTerms: "Términos y Conducta del Curso",
    details: "Detalles de la compra",
    duration: "Duración",
    greeting: (name) => `Hola${name ? `, ${name}` : ""}.`,
    intro: "Hemos recibido la confirmación de tu pago. A continuación encontrarás los detalles de tu compra.",
    legal: "Información legal",
    manageBooking: "Cancelar o reprogramar",
    manageBookingMessage: (reference) => `Hola, necesito ayuda para cancelar o reprogramar la compra con referencia ${reference}.`,
    next: "Próximos pasos",
    nextText: "Dani Therapies se pondrá en contacto contigo con las orientaciones necesarias para la sesión o el curso adquirido.",
    price: "Inversión",
    privacy: "Política de Privacidad",
    product: "Compra",
    reference: "Referencia",
    subject: (product) => `Confirmación de tu compra: ${product}`,
    terms: "Términos y Condiciones",
    thanks: "Gracias por tu confianza.",
  },
  nl: {
    appointment: "Datum en tijd van de sessie",
    appointmentAmsterdam: "Tijd in Amsterdam",
    contact: "Contact en ondersteuning",
    contactEmail: "Een e-mail sturen",
    contactWhatsapp: "Contact via WhatsApp",
    confirmed: "Betaling bevestigd",
    cookies: "Cookiebeleid",
    courseTerms: "Cursusvoorwaarden en Gedragscode",
    details: "Aankoopgegevens",
    duration: "Duur",
    greeting: (name) => `Hallo${name ? ` ${name}` : ""}.`,
    intro: "We hebben de bevestiging van je betaling ontvangen. Hieronder vind je de gegevens van je aankoop.",
    legal: "Juridische informatie",
    manageBooking: "Annuleren of verzetten",
    manageBookingMessage: (reference) => `Hallo, ik heb hulp nodig bij het annuleren of verzetten van de aankoop met referentie ${reference}.`,
    next: "Volgende stappen",
    nextText: "Dani Therapies neemt contact met je op met de nodige informatie voor de sessie of cursus die je hebt gekocht.",
    price: "Investering",
    privacy: "Privacybeleid",
    product: "Aankoop",
    reference: "Referentie",
    subject: (product) => `Bevestiging van je aankoop: ${product}`,
    terms: "Algemene Voorwaarden",
    thanks: "Dank je wel voor je vertrouwen.",
  },
};

function buildReceiptHtml(receipt: CheckoutReceipt) {
  const copy = receiptCopy[receipt.locale];
  const product = escapeHtml(receipt.productName);
  const customerName = escapeHtml(receipt.customerName);
  const appointmentDate = String(receipt.payload.appointment_date || "");
  const appointmentStart = String(receipt.payload.appointment_start || "");
  const customerTimeZone = safeTimeZone(String(receipt.payload.appointment_time_zone || ""));
  const localeTag = { pt: "pt-PT", en: "en-US", es: "es-ES", nl: "nl-NL" }[receipt.locale];
  const formattedAppointmentDate = appointmentStart
    ? new Intl.DateTimeFormat(localeTag, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: customerTimeZone,
      }).format(new Date(appointmentStart))
    : appointmentDate
      ? new Intl.DateTimeFormat(localeTag, { dateStyle: "long" }).format(new Date(`${appointmentDate}T12:00:00Z`))
      : "";
  const formattedAmsterdamDate = appointmentStart && customerTimeZone !== "Europe/Amsterdam"
    ? new Intl.DateTimeFormat(localeTag, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Amsterdam",
      }).format(new Date(appointmentStart))
    : "";
  const siteUrl = siteConfig.domain.replace(/\/$/, "");
  const localeUrl = `${siteUrl}/${receipt.locale}`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}`;
  const manageBookingUrl = `${whatsappUrl}?text=${encodeURIComponent(copy.manageBookingMessage(receipt.submissionId))}`;
  const emailUrl = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`${copy.manageBooking} — ${receipt.submissionId}`)}`;
  const courseTermsUrl = receipt.locale === "en"
    ? `${siteUrl}/legal/terms-conduct-sensory-perception.pdf`
    : `${siteUrl}/legal/termos-conduta-curso-percepcao-sensorial.pdf`;
  const isCourse = receipt.productId.startsWith("online-course");

  return `<!doctype html>
<html lang="${receipt.locale}">
  <body style="margin:0;background:#f8f5ec;color:#123c2d;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ec;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e7dfcf;">
            <tr>
              <td align="center" style="background:#123c2d;padding:28px 32px;color:#ffffff;">
                <img src="${siteUrl}/dani-therapies-logo-cropped.webp" width="190" alt="Dani Therapies" style="display:block;width:190px;max-width:100%;height:auto;border:0;margin:0 auto;" />
                <p style="margin:12px 0 0;color:#C9A227;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Spiritual Noetic Curator</p>
                <h1 style="margin:16px 0 0;font-size:30px;line-height:1.15;">${copy.confirmed}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">${copy.greeting(customerName)}</p>
                <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#40564d;">${copy.intro}</p>
                <h2 style="margin:0 0 16px;font-size:20px;">${copy.details}</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;color:#617268;">${copy.product}</td>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;text-align:right;font-weight:700;">${product}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;color:#617268;">${copy.duration}</td>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;text-align:right;font-weight:700;">${escapeHtml(receipt.duration || "-")}</td>
                  </tr>
                  ${formattedAppointmentDate ? `<tr>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;color:#617268;">${copy.appointment}</td>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;text-align:right;font-weight:700;">${escapeHtml(formattedAppointmentDate)}</td>
                  </tr>` : ""}
                  ${formattedAmsterdamDate ? `<tr>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;color:#617268;">${copy.appointmentAmsterdam}</td>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;text-align:right;font-weight:700;">${escapeHtml(formattedAmsterdamDate)}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;color:#617268;">${copy.price}</td>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;text-align:right;font-weight:700;color:#C9A227;">${escapeHtml(receipt.price || "-")}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;color:#617268;">${copy.reference}</td>
                    <td style="padding:14px 0;border-top:1px solid #eee6d8;text-align:right;font-size:12px;color:#617268;">${escapeHtml(receipt.submissionId)}</td>
                  </tr>
                </table>
                <div style="margin-top:28px;padding:20px;border-radius:18px;background:#f8f5ec;">
                  <h3 style="margin:0 0 8px;font-size:17px;">${copy.next}</h3>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#40564d;">${copy.nextText}</p>
                </div>
                <h3 style="margin:28px 0 12px;font-size:17px;">${copy.contact}</h3>
                <p style="margin:0 0 18px;font-size:14px;line-height:1.8;">
                  <a href="${whatsappUrl}" style="color:#123c2d;font-weight:700;text-decoration:underline;">${copy.contactWhatsapp}</a>
                  <span style="color:#b8ad99;"> &nbsp;•&nbsp; </span>
                  <a href="${emailUrl}" style="color:#123c2d;font-weight:700;text-decoration:underline;">${copy.contactEmail}</a>
                  <span style="color:#b8ad99;"> &nbsp;•&nbsp; </span>
                  <a href="${manageBookingUrl}" style="color:#123c2d;font-weight:700;text-decoration:underline;">${copy.manageBooking}</a>
                </p>
                <h3 style="margin:24px 0 12px;font-size:17px;">${copy.legal}</h3>
                <p style="margin:0;font-size:13px;line-height:1.9;color:#617268;">
                  <a href="${localeUrl}/termos-e-condicoes" style="color:#617268;text-decoration:underline;">${copy.terms}</a>
                  <span> &nbsp;•&nbsp; </span>
                  <a href="${localeUrl}/politica-de-privacidade" style="color:#617268;text-decoration:underline;">${copy.privacy}</a>
                  <span> &nbsp;•&nbsp; </span>
                  <a href="${localeUrl}/politica-de-cookies" style="color:#617268;text-decoration:underline;">${copy.cookies}</a>
                  ${isCourse ? `<span> &nbsp;•&nbsp; </span><a href="${courseTermsUrl}" style="color:#617268;text-decoration:underline;">${copy.courseTerms}</a>` : ""}
                </p>
                <p style="margin:28px 0 0;font-size:15px;line-height:1.7;color:#40564d;">${copy.thanks}</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#617268;font-size:12px;">${siteConfig.name} · ${siteConfig.email}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildReceiptText(receipt: CheckoutReceipt) {
  const copy = receiptCopy[receipt.locale];
  const siteUrl = siteConfig.domain.replace(/\/$/, "");
  const localeUrl = `${siteUrl}/${receipt.locale}`;
  const appointmentDate = String(receipt.payload.appointment_date || "");
  const appointmentStart = String(receipt.payload.appointment_start || "");
  const customerTimeZone = safeTimeZone(String(receipt.payload.appointment_time_zone || ""));
  const localeTag = { pt: "pt-PT", en: "en-US", es: "es-ES", nl: "nl-NL" }[receipt.locale];
  const formattedAppointment = appointmentStart
    ? new Intl.DateTimeFormat(localeTag, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: customerTimeZone,
      }).format(new Date(appointmentStart))
    : appointmentDate
      ? new Intl.DateTimeFormat(localeTag, { dateStyle: "long" }).format(new Date(`${appointmentDate}T12:00:00Z`))
      : "";
  const manageBookingUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(copy.manageBookingMessage(receipt.submissionId))}`;
  const lines = [
    "Dani Therapies",
    "Spiritual Noetic Curator",
    "",
    copy.confirmed,
    copy.greeting(receipt.customerName),
    copy.intro,
    "",
    `${copy.product}: ${receipt.productName}`,
    `${copy.duration}: ${receipt.duration || "-"}`,
    ...(formattedAppointment ? [`${copy.appointment}: ${formattedAppointment}`] : []),
    `${copy.price}: ${receipt.price || "-"}`,
    `${copy.reference}: ${receipt.submissionId}`,
    "",
    `${copy.next}: ${copy.nextText}`,
    "",
    copy.contact,
    `${copy.contactWhatsapp}: https://wa.me/${siteConfig.whatsapp}`,
    `${copy.contactEmail}: mailto:${siteConfig.email}`,
    `${copy.manageBooking}: ${manageBookingUrl}`,
    "",
    copy.legal,
    `${copy.terms}: ${localeUrl}/termos-e-condicoes`,
    `${copy.privacy}: ${localeUrl}/politica-de-privacidade`,
    `${copy.cookies}: ${localeUrl}/politica-de-cookies`,
    ...(receipt.productId.startsWith("online-course")
      ? [`${copy.courseTerms}: ${siteUrl}/legal/${receipt.locale === "en" ? "terms-conduct-sensory-perception.pdf" : "termos-conduta-curso-percepcao-sensorial.pdf"}`]
      : []),
    "",
    copy.thanks,
  ];

  return lines.join("\n");
}

export async function sendCheckoutReceiptEmail(receipt: CheckoutReceipt) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !from || !receipt.customerEmail) {
    return { sent: false, skipped: true };
  }

  const copy = receiptCopy[receipt.locale];
  const bcc = process.env.RESEND_TO_EMAIL || siteConfig.email;
  const { error } = await resend.emails.send(
    {
      bcc,
      from,
      html: buildReceiptHtml(receipt),
      replyTo: siteConfig.email,
      subject: copy.subject(receipt.productName),
      text: buildReceiptText(receipt),
      to: receipt.customerEmail,
    },
    {
      headers: {
        "Idempotency-Key": `checkout-receipt-${receipt.submissionId}-${receipt.stripeCheckoutSessionId}`,
      },
    },
  );

  if (error) return { error, sent: false, skipped: false };
  return { sent: true, skipped: false };
}
