import { stripe } from '../utils/stripe.js'

export const checkStripeConnectVerification = async (c, next) => {
  const userId = c.get('userId') // Assume you've set this in your auth middleware
  
  try {
    const account = await stripe.accounts.retrieve(userId)
    
    if (account.charges_enabled && account.payouts_enabled) {
      // User is verified and can accept payments
      await next()
    } else {
      // User is not fully verified
      return c.json({ error: 'Stripe Connect account not fully verified' }, 403)
    }
  } catch (error) {
    console.error('Error checking Stripe Connect verification:', error)
    return c.json({ error: 'Error checking Stripe Connect verification' }, 500)
  }
}
