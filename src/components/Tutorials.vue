<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-6">Tutorials</h2>
    
    <!-- Tabs -->
    <div class="mb-6">
      <button 
        v-for="tab in ['available', 'purchased']" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 mr-2 rounded-lg',
          activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        ]"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }} Tutorials
      </button>
    </div>

    <!-- Available Tutorials Tab -->
    <div v-if="activeTab === 'available'">
      <div v-if="tutorials.length === 0" class="text-center text-gray-600">
        No tutorials available.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tutorial in tutorials" :key="tutorial.id" class="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition duration-300 hover:shadow-xl">
          <div>
            <h3 class="text-xl font-semibold mb-2">{{ tutorial.title }}</h3>
            <p class="text-gray-600 mb-4">{{ tutorial.description }}</p>
          </div>
          <div>
            <p class="text-blue-600 font-semibold mb-4">Price: ${{ tutorial.price.toFixed(2) }}</p>
            <button 
              @click="buyTutorial(tutorial)"
              :disabled="!currentUser || isOwnTutorial(tutorial) || hasPurchased(tutorial)"
              :class="[
                'w-full px-4 py-2 rounded-lg transition duration-300',
                currentUser && !isOwnTutorial(tutorial) && !hasPurchased(tutorial)
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ getBuyButtonText(tutorial) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchased Tutorials Tab -->
    <div v-if="activeTab === 'purchased'">
      <div v-if="purchasedTutorials.length === 0" class="text-center text-gray-600">
        You haven't purchased any tutorials yet.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tutorial in purchasedTutorials" :key="tutorial.id" class="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition duration-300 hover:shadow-xl">
          <div>
            <h3 class="text-xl font-semibold mb-2">{{ tutorial.title }}</h3>
            <p class="text-gray-600 mb-4">{{ tutorial.description }}</p>
          </div>
          <div>
            <router-link 
              :to="{ name: 'TutorialView', params: { id: tutorial.id } }"
              class="w-full px-4 py-2 rounded-lg transition duration-300 bg-blue-500 text-white hover:bg-blue-600 text-center block"
            >
              View Tutorial
            </router-link>
          </div>
        </div>
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
    const activeTab = ref('available')
    const tutorials = ref([])
    const userPurchases = ref([])
    const currentUser = ref(null)
    const router = useRouter()

    const purchasedTutorials = computed(() => 
      tutorials.value.filter(tutorial => userPurchases.value.includes(tutorial.id))
    )

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
      if (!currentUser.value) return 'Sign in to buy'
      if (isOwnTutorial(tutorial)) return 'Your tutorial'
      if (hasPurchased(tutorial)) return 'Already purchased'
      return 'Buy Tutorial'
    }

    const buyTutorial = async (tutorial) => {
      if (!currentUser.value) {
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
        const response = await fetch('/api/payments/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            tutorialId: tutorial.id,
            price: tutorial.price
          })
        })

        const { url } = await response.json()
        window.location = url
      } catch (error) {
        console.error('Error creating checkout session:', error)
        alert('There was an error processing your purchase. Please try again.')
      }
    }

    onMounted(async () => {
      await getCurrentUser()
      await fetchTutorials()
      await fetchUserPurchases()
    })

    return {
      activeTab,
      tutorials,
      purchasedTutorials,
      currentUser,
      isOwnTutorial,
      hasPurchased,
      getBuyButtonText,
      buyTutorial
    }
  }
}
</script>
