import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCheckoutReceipt, markCheckoutSubmissionPaid, releaseCheckoutSeat } from "@/lib/cms";
import { sendCheckoutReceiptEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const submissionId = session.metadata?.submissionId;

  if (!submissionId) return null;

  await markCheckoutSubmissionPaid(submissionId, session.id);
  const receipt = await getCheckoutReceipt(submissionId, session.id);

  if (!receipt) {
    return "Nao foi possivel preparar a confirmacao da compra.";
  }

  const result = await sendCheckoutReceiptEmail(receipt);

  if (!result.sent) {
    console.error(
      "Resend checkout receipt error",
      result.error || "Email configuration unavailable",
    );
    return "Nao foi possivel enviar a confirmacao da compra.";
  }

  return null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!webhookSecret || !signature) {
    return NextResponse.json(
      { received: false, error: "Webhook Stripe nao configurado." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    return NextResponse.json(
      { received: false, error: "Assinatura Stripe invalida." },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
        const error = await fulfillCheckoutSession(session);

        if (error) {
          return NextResponse.json({ received: false, error }, { status: 500 });
        }
      }
      break;
    }
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const error = await fulfillCheckoutSession(session);

      if (error) {
        return NextResponse.json({ received: false, error }, { status: 500 });
      }
      break;
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const submissionId = session.metadata?.submissionId;

      if (submissionId) {
        await releaseCheckoutSeat(submissionId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
