import { Resend } from "resend";
import type { CheckoutReceipt } from "./cms";
import type { Locale } from "./content";
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
  confirmed: string;
  details: string;
  duration: string;
  greeting: (name: string) => string;
  intro: string;
  next: string;
  nextText: string;
  price: string;
  product: string;
  reference: string;
  subject: (product: string) => string;
  thanks: string;
}> = {
  pt: {
    confirmed: "Pagamento confirmado",
    details: "Detalhes da compra",
    duration: "Duração",
    greeting: (name) => `Olá${name ? `, ${name}` : ""}.`,
    intro: "Recebemos a confirmação do seu pagamento. Abaixo estão os detalhes da sua compra.",
    next: "Próximos passos",
    nextText: "A Dani Therapies entrará em contacto com as orientações necessárias para o atendimento ou curso adquirido.",
    price: "Investimento",
    product: "Compra",
    reference: "Referência",
    subject: (product) => `Confirmação da sua compra: ${product}`,
    thanks: "Obrigada pela confiança.",
  },
  en: {
    confirmed: "Payment confirmed",
    details: "Purchase details",
    duration: "Duration",
    greeting: (name) => `Hello${name ? `, ${name}` : ""}.`,
    intro: "Your payment has been confirmed. You can find the details of your purchase below.",
    next: "Next steps",
    nextText: "Dani Therapies will contact you with the guidance needed for the session or course you purchased.",
    price: "Investment",
    product: "Purchase",
    reference: "Reference",
    subject: (product) => `Your purchase confirmation: ${product}`,
    thanks: "Thank you for your trust.",
  },
  es: {
    confirmed: "Pago confirmado",
    details: "Detalles de la compra",
    duration: "Duración",
    greeting: (name) => `Hola${name ? `, ${name}` : ""}.`,
    intro: "Hemos recibido la confirmación de tu pago. A continuación encontrarás los detalles de tu compra.",
    next: "Próximos pasos",
    nextText: "Dani Therapies se pondrá en contacto contigo con las orientaciones necesarias para la sesión o el curso adquirido.",
    price: "Inversión",
    product: "Compra",
    reference: "Referencia",
    subject: (product) => `Confirmación de tu compra: ${product}`,
    thanks: "Gracias por tu confianza.",
  },
  nl: {
    confirmed: "Betaling bevestigd",
    details: "Aankoopgegevens",
    duration: "Duur",
    greeting: (name) => `Hallo${name ? ` ${name}` : ""}.`,
    intro: "We hebben de bevestiging van je betaling ontvangen. Hieronder vind je de gegevens van je aankoop.",
    next: "Volgende stappen",
    nextText: "Dani Therapies neemt contact met je op met de nodige informatie voor de sessie of cursus die je hebt gekocht.",
    price: "Investering",
    product: "Aankoop",
    reference: "Referentie",
    subject: (product) => `Bevestiging van je aankoop: ${product}`,
    thanks: "Dank je wel voor je vertrouwen.",
  },
};

function buildReceiptHtml(receipt: CheckoutReceipt) {
  const copy = receiptCopy[receipt.locale];
  const product = escapeHtml(receipt.productName);
  const customerName = escapeHtml(receipt.customerName);

  return `<!doctype html>
<html lang="${receipt.locale}">
  <body style="margin:0;background:#f8f5ec;color:#123c2d;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ec;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e7dfcf;">
            <tr>
              <td style="background:#123c2d;padding:28px 32px;color:#ffffff;">
                <p style="margin:0;color:#C9A227;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">Dani Therapies</p>
                <h1 style="margin:12px 0 0;font-size:30px;line-height:1.15;">${copy.confirmed}</h1>
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
                <p style="margin:28px 0 0;font-size:15px;line-height:1.7;color:#40564d;">${copy.thanks}</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#617268;font-size:12px;">${siteConfig.name}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendCheckoutReceiptEmail(receipt: CheckoutReceipt) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !from || !receipt.customerEmail) {
    return { sent: false, skipped: true };
  }

  const copy = receiptCopy[receipt.locale];
  const bcc = process.env.RESEND_TO_EMAIL || undefined;
  const { error } = await resend.emails.send(
    {
      bcc,
      from,
      html: buildReceiptHtml(receipt),
      subject: copy.subject(receipt.productName),
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
