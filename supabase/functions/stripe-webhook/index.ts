import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<any> {
  if (!crypto || !crypto.subtle) {
    throw new Error("Crypto API is not available in this environment.");
  }

  const parts = sigHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatureParts = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestampPart) {
    throw new Error("Timestamp missing in Stripe signature.");
  }

  const timestamp = timestampPart.slice(2);

  if (!timestamp || !/^\d+$/.test(timestamp)) {
    throw new Error("Invalid timestamp in Stripe signature.");
  }

  if (signatureParts.length === 0) {
    throw new Error("No signatures found in Stripe signature.");
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signedPayload),
  );

  const computedSignature = arrayBufferToHex(signatureBuffer);

  const isValid = signatureParts.some(
    (sig) => sig === computedSignature,
  );

  if (!isValid) {
    throw new Error("Signature verification failed.");
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const tolerance = 300; // 5 minutes

  if (Math.abs(currentTimestamp - parseInt(timestamp)) > tolerance) {
    throw new Error("Timestamp outside the tolerance zone.");
  }

  return JSON.parse(payload);
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("Missing Stripe signature.");
    return new Response("Missing Stripe signature.", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("Event type:", event.type);
  
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Processing checkout.session.completed");
      console.log("Session details:", JSON.stringify(session, null, 2));
      await handleCheckoutSession(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

const handleCheckoutSession = async (session: Stripe.Checkout.Session) => {
  const tutorialId = session.metadata?.tutorialId;
  const userId = session.client_reference_id;

  console.log("Handling checkout session:", session.id);
  console.log("Extracted tutorial_id:", tutorialId);
  console.log("Extracted user_id:", userId);

  if (!tutorialId || !userId) {
    console.error("Missing tutorial_id or user_id in session metadata.");
    return;
  }

  const { data: existingPurchase, error: existingError } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("tutorial_id", tutorialId)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    console.error("Error checking existing purchase:", existingError.message);
    return;
  }

  if (existingPurchase) {
    console.log("Purchase already exists:", existingPurchase.id);
    return;
  }

  const { data, error } = await supabase
    .from("purchases")
    .insert([
      {
        user_id: userId,
        tutorial_id: tutorialId,
        amount: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        stripe_session_id: session.id,
        purchase_date: new Date().toISOString(), // Use ISO string for consistency
      },
    ]);

  if (error) {
    console.error("Error recording purchase:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
  } else {
    console.log("Purchase recorded successfully:", data[0].id);
  }
};
