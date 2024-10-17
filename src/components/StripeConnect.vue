<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Stripe Connect Status</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p>Charges Enabled: {{ status.chargesEnabled ? 'Yes' : 'No' }}</p>
      <p>Payouts Enabled: {{ status.payoutsEnabled ? 'Yes' : 'No' }}</p>
      <p>Details Submitted: {{ status.detailsSubmitted ? 'Yes' : 'No' }}</p>
      <button
        v-if="!status.chargesEnabled || !status.payoutsEnabled"
        @click="startOnboarding"
        class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Stripe Connect Onboarding
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

export default {
  name: 'StripeConnect',
  setup() {
    const status = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stripe-status')
        if (error) throw error
        status.value = data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const startOnboarding = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stripe-connect')
        if (error) throw error
        window.location.href = data.url
      } catch (err) {
        error.value = err.message
      }
    }

    onMounted(fetchStatus)

    return {
      status,
      loading,
      error,
      startOnboarding
    }
  }
}
</script>
