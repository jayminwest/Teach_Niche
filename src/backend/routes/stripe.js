import { Hono } from 'hono'
import { stripe } from '../utils/stripe.js'
import { checkStripeConnectVerification } from '../middleware/stripeConnectVerification.js'

const stripeRoutes = new Hono()

stripeRoutes.post('/connect', async (c) => {
  const userId = c.get('userId')

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // or dynamically set based on user's country
      email: 'user@example.com', // Get this from your user data
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true},
      },
    })

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    })

    // Store the account ID in your database, associated with the user
    // ... (implement this part based on your database setup)

    return c.json({ url: accountLink.url })
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return c.json({ error: 'Error creating Stripe Connect account' }, 500)
  }
})

stripeRoutes.get('/status', checkStripeConnectVerification, async (c) => {
  const userId = c.get('userId')

  try {
    const account = await stripe.accounts.retrieve(userId)
    
    return c.json({
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    })
  } catch (error) {
    console.error('Error fetching Stripe Connect status:', error)
    return c.json({ error: 'Error fetching Stripe Connect status' }, 500)
  }
})

export { stripeRoutes }
