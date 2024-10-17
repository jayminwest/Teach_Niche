import { Hono } from "hono";
import { stripe } from "../utils/stripe.js";

const paymentRoutes = new Hono();

paymentRoutes.post("/process", (c) => c.json({ message: "Process Payment" }));

paymentRoutes.get("/connect-stripe", (c) => {
  const stripeConnectUrl =
    `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=YOUR_STRIPE_CLIENT_ID&scope=read_write&state=UNIQUE_STATE_PARAMETER`;

  return c.json({
    message: "Initiate Stripe Connect",
    redirectUrl: stripeConnectUrl,
  });
});

export { paymentRoutes };
