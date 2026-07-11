import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCheckoutReceipt, markCheckoutSubmissionPaid, releaseCheckoutSeat } from "@/lib/cms";
import { sendCheckoutReceiptEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

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
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { received: false, error: "Assinatura Stripe invalida." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const submissionId = session.metadata?.submissionId;

    if (submissionId) {
      await markCheckoutSubmissionPaid(submissionId, session.id);
      const receipt = await getCheckoutReceipt(submissionId, session.id);

      if (receipt) {
        try {
          const result = await sendCheckoutReceiptEmail(receipt);
          if (result.error) console.error("Resend checkout receipt error", result.error);
        } catch (error) {
          console.error("Checkout receipt email failed", error);
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const submissionId = session.metadata?.submissionId;

    if (submissionId) {
      await releaseCheckoutSeat(submissionId);
    }
  }

  return NextResponse.json({ received: true });
}
