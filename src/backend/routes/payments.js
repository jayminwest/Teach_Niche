import { Hono } from "hono";
import { stripe } from "../utils/stripe.js";
import { supabase } from "../utils/supabase.js";
import dotenv from 'dotenv';

dotenv.config();

const paymentRoutes = new Hono();

paymentRoutes.post("/process", (c) => c.json({ message: "Process Payment" }));

paymentRoutes.post("/create-checkout-session", async (c) => {
  try {
    console.log("Received request for checkout session");
    const { tutorialId, price } = await c.req.json();
    console.log("Tutorial ID:", tutorialId, "Price:", price);

    const user = c.get('user');
    console.log("User:", user);

    if (!user) {
      console.log("User not authenticated");
      return c.json({ error: 'User not authenticated' }, 401);
    }

    // Hardcode the base URL for now
    const baseUrl = 'http://localhost:5173';
    console.log("Base URL:", baseUrl);

    console.log("Creating Stripe checkout session");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Tutorial',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/tutorials?success=true`,
      cancel_url: `${baseUrl}/tutorials?canceled=true`,
      metadata: {
        tutorialId,
        userId: user.id,
      },
    });

    console.log("Checkout session created:", session.id);
    return c.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return c.json({ error: 'Error creating checkout session', details: error.message }, 500);
  }
});

paymentRoutes.post("/create-connect-account", async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'User not authenticated' }, 401);
  }

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${c.req.url.origin}/profile`,
      return_url: `${c.req.url.origin}/profile`,
      type: 'account_onboarding',
    });

    // Store the Stripe account ID in the user's profile
    await supabase
      .from('profiles')
      .update({ stripe_account_id: account.id })
      .eq('id', user.id);

    return c.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    return c.json({ error: 'Error creating Stripe Connect account' }, 500);
  }
});

export { paymentRoutes };
