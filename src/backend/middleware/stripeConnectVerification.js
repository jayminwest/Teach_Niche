import { stripe } from '../utils/stripe.js'
import { supabase } from '../utils/supabase.js'

export const checkStripeConnectVerification = async (c, next) => {
  const userId = c.get('userId') // Assume you've set this in your auth middleware
  
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    if (!profile.stripe_account_id) {
      return c.json({ error: 'Stripe Connect account not connected' }, 403)
    }

    const account = await stripe.accounts.retrieve(profile.stripe_account_id)
    
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