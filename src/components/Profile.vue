<template>
  <div class="max-w-6xl mx-auto p-8 bg-gray-50 shadow-xl rounded-xl mb-16">
    <h2 class="text-4xl font-bold mb-8 text-gray-800">User Profile</h2>
    
    <!-- Tabs -->
    <div class="mb-8 flex border-b border-gray-200">
      <button 
        v-for="tab in ['profile', 'tutorials', 'create']"
        :key="tab"
        @click="activeTab = tab" 
        :class="['px-6 py-3 font-medium text-sm uppercase tracking-wider transition-colors duration-200', 
                 activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700']"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Profile Info Tab -->
    <div v-if="activeTab === 'profile'" class="space-y-6">
      <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="profile.email" id="email" type="email" disabled class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="space-y-2">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input v-model="profile.username" id="username" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="space-y-2 md:col-span-2">
          <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
          <textarea v-model="profile.bio" id="bio" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <div class="space-y-2 md:col-span-2">
          <label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar URL</label>
          <input v-model="profile.avatar_url" id="avatar_url" type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="md:col-span-2 flex justify-between items-center">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Update Profile
          </button>
          <button @click="signOut" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Sign Out
          </button>
        </div>
      </form>
      <div class="mt-8 border-t border-gray-200 pt-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Stripe Connection</h3>
        <button v-if="!profile.stripe_account_id" @click="connectStripeAccount" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Connect Stripe Account
        </button>
        <p v-else class="text-green-600 font-semibold">Stripe account connected</p>
        <StripeConnect class="mt-4" />
      </div>
    </div>

    <!-- My Tutorials Tab -->
    <div v-if="activeTab === 'tutorials'" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">Your Tutorials</h3>
      <div v-if="userTutorials.length === 0" class="text-gray-600 mb-4">
        You haven't created any tutorials yet.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="tutorial in userTutorials" :key="tutorial.id" class="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
          <h4 class="text-xl font-semibold mb-2 text-gray-800">{{ tutorial.title }}</h4>
          <p class="text-gray-600 mb-4">{{ tutorial.description }}</p>
          <p class="text-blue-600 font-semibold mb-4">Price: ${{ tutorial.price }}</p>
          <div class="flex space-x-4">
            <button @click="startEditTutorial(tutorial)" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              Edit
            </button>
            <button @click="deleteTutorial(tutorial.id)" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Tutorial Tab -->
    <div v-if="activeTab === 'create'" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">{{ editingTutorial ? 'Edit Tutorial' : 'Create a New Tutorial' }}</h3>
      <div v-if="!profile.stripe_account_id" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p class="font-bold">Stripe Account Required</p>
        <p>You need to connect your Stripe account before creating tutorials. Please go to the Profile tab to connect your account.</p>
      </div>
      <form v-else @submit.prevent="editingTutorial ? updateTutorial() : createTutorial()" class="space-y-6">
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="newTutorial.title" id="title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="space-y-2">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="newTutorial.description" id="description" required rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <div class="space-y-2">
          <label for="video" class="block text-sm font-medium text-gray-700">Video</label>
          <input type="file" id="video" @change="handleVideoUpload" accept="video/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <p v-if="newTutorial.video_url" class="text-sm text-green-600">Video uploaded: {{ newTutorial.video_url }}</p>
        </div>
        <div class="space-y-2">
          <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <editor-content :editor="editor" />
          </div>
        </div>
        <div class="space-y-2">
          <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
          <input v-model.number="newTutorial.price" id="price" type="number" step="0.01" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button type="submit" class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          {{ editingTutorial ? 'Update Tutorial' : 'Create Tutorial' }}
        </button>
      </form>
    </div>

    <p v-if="errorMessage" class="mt-6 text-red-600 bg-red-100 border border-red-400 rounded-lg p-4">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification";
import StripeConnect from './StripeConnect.vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
  name: 'Profile',
  components: {
    StripeConnect,
    EditorContent,
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
      price: null,
      video_url: null,
    })
    const activeTab = ref('profile')
    const editingTutorial = ref(false)
    const toast = useToast();

    const editor = new Editor({
      extensions: [
        StarterKit,
      ],
      content: '',
      onUpdate: ({ editor }) => {
        newTutorial.value.content = editor.getHTML()
      }
    })

    onBeforeUnmount(() => {
      editor.destroy()
    })

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

    const handleVideoUpload = async (event) => {
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `videos/${fileName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('tutorial-videos')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data, error: urlError } = supabase.storage
          .from('tutorial-videos')
          .getPublicUrl(filePath)

        if (urlError) throw urlError

        newTutorial.value.video_url = data.publicUrl
      } catch (error) {
        console.error('Error uploading video:', error.message)
        errorMessage.value = 'Error uploading video. Please try again.'
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
          .insert([{ 
            title: newTutorial.value.title,
            description: newTutorial.value.description,
            content: newTutorial.value.content,
            price: newTutorial.value.price,
            video_url: newTutorial.value.video_url,
            author_id: user.id 
          }])

        if (error) throw error
        console.log('Tutorial created:', data)
        newTutorial.value = { title: '', description: '', content: '', price: null, video_url: null }
        fetchUserTutorials()
        activeTab.value = 'tutorials'
      } catch (error) {
        console.error('Error creating tutorial:', error.message)
        errorMessage.value = error.message
      }
    }

    const startEditTutorial = (tutorial) => {
      newTutorial.value = { ...tutorial }
      editor.commands.setContent(tutorial.content)
      editingTutorial.value = true
      activeTab.value = 'create'
    }

    const updateTutorial = async () => {
      try {
        const { error } = await supabase
          .from('tutorials')
          .update({ 
            title: newTutorial.value.title,
            description: newTutorial.value.description,
            content: newTutorial.value.content,
            price: newTutorial.value.price,
            video_url: newTutorial.value.video_url
          })
          .eq('id', newTutorial.value.id)

        if (error) throw error
        console.log('Tutorial updated')
        newTutorial.value = { title: '', description: '', content: '', price: null, video_url: null }
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
      connectStripeAccount,
      editor,
      handleVideoUpload
    }
  }
}
</script>

<style>
/* Add some basic styling for the rich text editor */
.ProseMirror {
  padding: 1rem;
  min-height: 200px;
  outline: none;
}

.ProseMirror p {
  margin-bottom: 1em;
}
</style>
