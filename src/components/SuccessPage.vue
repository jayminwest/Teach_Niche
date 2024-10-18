<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
      <div v-if="sessionDetails">
        <p class="mb-2"><strong>Session ID:</strong> {{ sessionDetails.id }}</p>
        <p class="mb-2"><strong>Amount Paid:</strong> ${{ (sessionDetails.amount_total / 100).toFixed(2) }}</p>
        <p class="mb-2"><strong>Currency:</strong> {{ sessionDetails.currency.toUpperCase() }}</p>
        <p class="mb-2"><strong>Payment Status:</strong> {{ sessionDetails.payment_status }}</p>
        <p class="mb-2"><strong>Customer Email:</strong> {{ sessionDetails.customer_details.email }}</p>
      </div>
      <div v-else-if="error">
        <p class="text-red-600">Error: {{ error }}</p>
      </div>
      <div v-else>
        <p class="text-gray-600">Loading session details...</p>
      </div>
      <router-link to="/" class="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
        Back to Tutorials
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../utils/supabase'

export default {
  name: 'SuccessPage',
  setup() {
    const route = useRoute()
    const sessionDetails = ref(null)
    const error = ref(null)

    const fetchSessionDetails = async () => {
      const sessionId = route.query.session_id
      if (!sessionId) {
        error.value = 'No session ID provided'
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/get-session-details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch session details')
        }

        const data = await response.json()
        sessionDetails.value = data.session
      } catch (err) {
        console.error('Error fetching session details:', err)
        error.value = err.message
      }
    }

    onMounted(fetchSessionDetails)

    return {
      sessionDetails,
      error
    }
  }
}
</script>
