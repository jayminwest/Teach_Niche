<template>
  <div class="mt-6">
    <h3 class="text-xl font-semibold mb-4">Stripe Connect Status</h3>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <p>Account Status: {{ status ? 'Connected' : 'Not Connected' }}</p>
      <p v-if="status">Payouts Enabled: {{ status.payouts_enabled ? 'Yes' : 'No' }}</p>
      <button
        v-if="!status || !status.payouts_enabled"
        @click="startOnboarding"
        class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {{ status ? 'Complete Stripe Onboarding' : 'Connect Stripe Account' }}
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
        const { data: { session } } = await supabase.auth.getSession()
        const { data, error } = await supabase.functions.invoke('stripe-connect-status', {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        })
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
        const { data: { session } } = await supabase.auth.getSession()
        const { data, error } = await supabase.functions.invoke('stripe-connect-onboarding', {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        })
        if (error) throw error
        if (data && data.url) {
          window.location.href = data.url
        } else {
          throw new Error('No onboarding URL received')
        }
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
