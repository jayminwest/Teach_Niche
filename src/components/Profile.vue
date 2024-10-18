<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-3xl font-bold mb-6">User Profile</h2>
    
    <!-- Tabs -->
    <div class="mb-6 flex border-b">
      <button 
        v-for="tab in ['profile', 'tutorials', 'create']"
        :key="tab"
        @click="activeTab = tab" 
        :class="['px-4 py-2 font-medium', activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700']"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Profile Info Tab -->
    <div v-if="activeTab === 'profile'" class="space-y-4">
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label for="email" class="block mb-1">Email</label>
          <input v-model="profile.email" id="email" type="email" disabled class="w-full px-3 py-2 border rounded-lg bg-gray-100">
        </div>
        <div>
          <label for="username" class="block mb-1">Username</label>
          <input v-model="profile.username" id="username" type="text" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label for="bio" class="block mb-1">Bio</label>
          <textarea v-model="profile.bio" id="bio" class="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>
        <div>
          <label for="avatar_url" class="block mb-1">Avatar URL</label>
          <input v-model="profile.avatar_url" id="avatar_url" type="url" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div class="flex justify-between">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Update Profile
          </button>
          <button @click="signOut" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300">
            Sign Out
          </button>
        </div>
      </form>
      <div class="mt-6">
        <button v-if="!profile.stripe_account_id" @click="connectStripeAccount" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300">
          Connect Stripe Account
        </button>
        <p v-else class="text-green-600 font-semibold">Stripe account connected</p>
      </div>
      <StripeConnect />
    </div>

    <!-- My Tutorials Tab -->
    <div v-if="activeTab === 'tutorials'" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-4">Your Tutorials</h3>
      <div v-if="userTutorials.length === 0" class="text-gray-600 mb-4">
        You haven't created any tutorials yet.
      </div>
      <div v-else class="space-y-4">
        <div v-for="tutorial in userTutorials" :key="tutorial.id" class="border p-4 rounded-lg">
          <h4 class="text-xl font-semibold mb-2">{{ tutorial.title }}</h4>
          <p class="text-gray-600 mb-2">{{ tutorial.description }}</p>
          <p class="text-blue-600 font-semibold mb-4">Price: ${{ tutorial.price }}</p>
          <div class="flex space-x-4">
            <button @click="startEditTutorial(tutorial)" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
              Edit
            </button>
            <button @click="deleteTutorial(tutorial.id)" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Tutorial Tab -->
    <div v-if="activeTab === 'create'" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-4">{{ editingTutorial ? 'Edit Tutorial' : 'Create a New Tutorial' }}</h3>
      <div v-if="!profile.stripe_account_id" class="text-red-600 mb-4">
        You need to connect your Stripe account before creating tutorials. Please go to the Profile tab to connect your account.
      </div>
      <form v-else @submit.prevent="editingTutorial ? updateTutorial() : createTutorial()" class="space-y-4">
        <div>
          <label for="title" class="block mb-1">Title</label>
          <input v-model="newTutorial.title" id="title" type="text" required class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label for="description" class="block mb-1">Description</label>
          <textarea v-model="newTutorial.description" id="description" required class="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>
        <div>
          <label for="content" class="block mb-1">Content</label>
          <textarea v-model="newTutorial.content" id="content" required class="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>
        <div>
          <label for="price" class="block mb-1">Price</label>
          <input v-model.number="newTutorial.price" id="price" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-lg">
        </div>
        <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300">
          {{ editingTutorial ? 'Update Tutorial' : 'Create Tutorial' }}
        </button>
      </form>
    </div>

    <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification";
import StripeConnect from './StripeConnect.vue'

export default {
  name: 'Profile',
  components: {
    StripeConnect
  },
  setup() {
    const profile = ref({
      email: '',
      username: '',
      bio: '',
      avatar_url: '',
      stripe_account_id: null
    })
    const errorMessage = ref('')
    const router = useRouter()
    const userTutorials = ref([])
    const newTutorial = ref({
      title: '',
      description: '',
      content: '',
      price: null
    })
    const activeTab = ref('profile')
    const editingTutorial = ref(false)
    const toast = useToast();

    const updateProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user logged in')

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: profile.value.username,
            bio: profile.value.bio,
            avatar_url: profile.value.avatar_url,
            updated_at: new Date()
          })
        
        if (error) throw error
        console.log('Profile updated')
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error('Error updating profile:', error.message)
        toast.error(`Error updating profile: ${error.message}`);
      }
    }

    const readProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) throw error
        profile.value = { ...profile.value, ...data, email: user.email }
      } catch (error) {
        console.error('Error reading profile:', error.message)
        errorMessage.value = error.message
      }
    }

    const signOut = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        router.push('/signin')
      } catch (error) {
        console.error('Error signing out:', error.message)
        errorMessage.value = error.message
      }
    }

    const fetchUserTutorials = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('tutorials')
          .select('*')
          .eq('author_id', user.id)

        if (error) throw error
        userTutorials.value = data
      } catch (error) {
        console.error('Error fetching user tutorials:', error.message)
        errorMessage.value = error.message
      }
    }

    const createTutorial = async () => {
      if (!profile.value.stripe_account_id) {
        errorMessage.value = "You need to connect your Stripe account before creating tutorials."
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user logged in')

        const { data, error } = await supabase
          .from('tutorials')
          .insert([{ ...newTutorial.value, author_id: user.id }])

        if (error) throw error
        console.log('Tutorial created:', data)
        newTutorial.value = { title: '', description: '', content: '', price: null }
        fetchUserTutorials()
        activeTab.value = 'tutorials'
      } catch (error) {
        console.error('Error creating tutorial:', error.message)
        errorMessage.value = error.message
      }
    }

    const startEditTutorial = (tutorial) => {
      newTutorial.value = { ...tutorial }
      editingTutorial.value = true
      activeTab.value = 'create'
    }

    const updateTutorial = async () => {
      try {
        const { error } = await supabase
          .from('tutorials')
          .update(newTutorial.value)
          .eq('id', newTutorial.value.id)

        if (error) throw error
        console.log('Tutorial updated')
        newTutorial.value = { title: '', description: '', content: '', price: null }
        editingTutorial.value = false
        fetchUserTutorials()
        activeTab.value = 'tutorials'
      } catch (error) {
        console.error('Error updating tutorial:', error.message)
        errorMessage.value = error.message
      }
    }

    const deleteTutorial = async (tutorialId) => {
      try {
        const { error } = await supabase
          .from('tutorials')
          .delete()
          .eq('id', tutorialId)

        if (error) throw error
        console.log('Tutorial deleted')
        fetchUserTutorials()
      } catch (error) {
        console.error('Error deleting tutorial:', error.message)
        errorMessage.value = error.message
      }
    }

    const connectStripeAccount = async () => {
      try {
        const response = await fetch('/api/payments/create-connect-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error('Failed to create Stripe Connect account')
        }
      } catch (error) {
        console.error('Error creating Stripe Connect account:', error)
        alert('An error occurred while connecting your Stripe account. Please try again.')
      }
    }

    onMounted(async () => {
      await readProfile()
      await fetchUserTutorials()
    })

    return {
      profile,
      errorMessage,
      updateProfile,
      signOut,
      userTutorials,
      newTutorial,
      createTutorial,
      startEditTutorial,
      updateTutorial,
      deleteTutorial,
      activeTab,
      editingTutorial,
      connectStripeAccount
    }
  }
}
</script>
