const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// You would typically load Stripe in your HTML file
// <script src="https://js.stripe.com/v3/"></script>

// Then you can use it like this:
// export const stripe = window.Stripe(stripePublishableKey)

// For now, we'll just export the key
export const stripeKey = stripePublishableKey