const { data: tutorial, error: tutorialError } = await supabase
  .from('tutorials')
  .select('author_id, price')
  .eq('id', tutorialId)
  .single()

if (tutorialError) throw tutorialError

const { data: author, error: authorError } = await supabase
  .from('profiles')
  .select('stripe_account_id')
  .eq('id', tutorial.author_id)
  .single()

if (authorError) throw authorError

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tutorial',
        },
        unit_amount: tutorial.price * 100,
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${frontendUrl}/cancel`,
  client_reference_id: userId,
  metadata: {
    tutorialId: tutorialId
  },
  payment_intent_data: {
    application_fee_amount: Math.round(tutorial.price * 100 * 0.1), // 10% platform fee
    transfer_data: {
      destination: author.stripe_account_id,
    },
  },
})