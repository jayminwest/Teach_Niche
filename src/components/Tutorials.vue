<template>
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-6">Tutorials</h2>
    <div v-if="tutorials.length === 0" class="text-center text-gray-600">
      No tutorials available.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tutorial in tutorials" :key="tutorial.id" class="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-xl">
        <h3 class="text-xl font-semibold mb-2">{{ tutorial.title }}</h3>
        <p class="text-gray-600 mb-4">{{ tutorial.description }}</p>
        <p class="text-blue-600 font-semibold mb-4">Price: ${{ tutorial.price }}</p>
        <button 
          @click="buyTutorial(tutorial)"
          :disabled="!isAuthenticated || isOwnTutorial(tutorial) || hasPurchased(tutorial)"
          :class="[
            'w-full px-4 py-2 rounded-lg transition duration-300',
            isAuthenticated && !isOwnTutorial(tutorial) && !hasPurchased(tutorial)
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ getBuyButtonText(tutorial) }}
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
    const userPurchases = ref([])

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

    const fetchUserPurchases = async () => {
      if (currentUser.value) {
        const { data, error } = await supabase
          .from('purchases')
          .select('tutorial_id')
          .eq('user_id', currentUser.value.id)
        if (error) {
          console.error('Error fetching user purchases:', error)
        } else {
          userPurchases.value = data.map(purchase => purchase.tutorial_id)
        }
      }
    }

    const isOwnTutorial = (tutorial) => {
      return currentUser.value && tutorial.author_id === currentUser.value.id
    }

    const hasPurchased = (tutorial) => {
      return userPurchases.value.includes(tutorial.id)
    }

    const getBuyButtonText = (tutorial) => {
      if (!isAuthenticated.value) return 'Sign in to buy'
      if (isOwnTutorial(tutorial)) return 'Your tutorial'
      if (hasPurchased(tutorial)) return 'Already purchased'
      return 'Buy Tutorial'
    }

    const buyTutorial = async (tutorial) => {
      if (!isAuthenticated.value) {
        alert('Please sign in to buy tutorials.')
        router.push('/signin')
        return
      }

      if (isOwnTutorial(tutorial)) {
        alert('You cannot buy your own tutorial.')
        return
      }

      if (hasPurchased(tutorial)) {
        alert('You have already purchased this tutorial.')
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Auth session:', session);
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            tutorialId: tutorial.id,
            price: tutorial.price,
            userId: currentUser.value.id,
          }),
          mode: 'cors',
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create checkout session')
        }

        window.location = responseData.url;
      } catch (error) {
        console.error('Error creating checkout session:', error)
        alert('Failed to create checkout session. Please try again later.')
      }
    }

    onMounted(async () => {
      await getCurrentUser()
      await fetchTutorials()
      await fetchUserPurchases()
    })

    return {
      tutorials,
      isAuthenticated,
      isOwnTutorial,
      hasPurchased,
      getBuyButtonText,
      buyTutorial
    }
  }
}
</script>
