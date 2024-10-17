<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">Tutorials</h2>
    <div v-if="tutorials.length === 0" class="text-center text-gray-600">
      No tutorials available.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tutorial in tutorials" :key="tutorial.id" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-2">{{ tutorial.title }}</h3>
        <p class="text-gray-600 mb-4">{{ tutorial.description }}</p>
        <p class="text-blue-600 font-semibold mb-4">Price: ${{ tutorial.price }}</p>
        <button 
          @click="purchaseTutorial(tutorial)"
          :disabled="!isAuthenticated || isOwnTutorial(tutorial)"
          :class="[
            'px-4 py-2 rounded-lg transition duration-300',
            isAuthenticated && !isOwnTutorial(tutorial)
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ getPurchaseButtonText(tutorial) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'

export default {
  name: 'Tutorials',
  setup() {
    const tutorials = ref([])
    const currentUser = ref(null)
    const router = useRouter()

    const isAuthenticated = computed(() => !!currentUser.value)

    const fetchTutorials = async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
      if (error) {
        console.error('Error fetching tutorials:', error)
      } else {
        tutorials.value = data
      }
    }

    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      currentUser.value = user
    }

    const isOwnTutorial = (tutorial) => {
      return currentUser.value && tutorial.author_id === currentUser.value.id
    }

    const getPurchaseButtonText = (tutorial) => {
      if (!isAuthenticated.value) return 'Sign in to purchase'
      if (isOwnTutorial(tutorial)) return 'Your tutorial'
      return 'Purchase'
    }

    const purchaseTutorial = async (tutorial) => {
      if (!isAuthenticated.value) {
        alert('Please sign in to purchase tutorials.')
        router.push('/signin')
        return
      }

      if (isOwnTutorial(tutorial)) {
        alert('You cannot purchase your own tutorial.')
        return
      }

      // This is a placeholder function for now
      console.log(`Purchasing tutorial with ID: ${tutorial.id}`)
      // Here you would typically:
      // 1. Initiate the Stripe payment process
      // 2. On successful payment, grant access to the tutorial
      alert('Purchase functionality will be implemented with Stripe integration.')
    }

    onMounted(async () => {
      await getCurrentUser()
      await fetchTutorials()
    })

    return {
      tutorials,
      isAuthenticated,
      isOwnTutorial,
      getPurchaseButtonText,
      purchaseTutorial
    }
  }
}
</script>