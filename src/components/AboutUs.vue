<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Hero Section -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">About Teach Niche</h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Built by Kendama Players, for Kendama Players
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Mission and Story -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p class="text-gray-600">
              At <strong>Teach Niche</strong>, our mission is to empower the
              kendama community by providing a platform where players of all
              levels can share knowledge, hone their skills, and support one
              another. We are dedicated to fostering growth, connection, and
              financial sustainability within the kendama world.
            </p>
          </div>
        </div>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p class="text-gray-600 mb-4">
              Hello! I'm <strong>Jaymin West</strong>, the founder of Teach
              Niche. I've been passionately playing kendama for over seven
              years. Throughout my journey, I've witnessed the incredible
              talent and dedication within our community.
            </p>
            <p class="text-gray-600">
              Teach Niche was born from a simple idea: to help kendama players
              make a living from what they love.
            </p>
          </div>
        </div>
      </div>

      <!-- Why Teach Niche -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Why Teach Niche?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, index) in ['Empowerment', 'Education', 'Community Growth', 'Connection']" :key="index" class="bg-blue-600 rounded-lg shadow-md p-6 text-white">
            <h3 class="text-xl font-semibold mb-2">{{ item }}</h3>
            <p>We believe in the power of {{ item.toLowerCase() }} within the kendama community.</p>
          </div>
        </div>
      </div>

      <!-- Our Values -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(value, index) in values" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ value.name }}</td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500">{{ value.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Join the Movement -->
      <div>
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Join the Movement</h2>
        <div class="flex flex-col md:flex-row gap-8 justify-center">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg flex-1">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-2">For Learners</h3>
              <p class="text-gray-600 mb-4">
                Access tutorials from some of the best kendama players in the
                world and take your skills to new heights.
              </p>
              <button @click="navigateTo('/tutorials')" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Lessons
              </button>
            </div>
          </div>
          <div class="bg-white shadow overflow-hidden sm:rounded-lg flex-1">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-2">For Teachers</h3>
              <p class="text-gray-600 mb-4">
                Share your expertise, connect with a global audience, and earn
                income doing what you love.
              </p>
              <button @click="handleTeachersClick" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Become a Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Contact Us</h2>
      <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" v-model="name" required class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
        </div>
        <div class="mb-4">
          <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" v-model="message" rows="4" required class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
        </div>
        <div>
          <button type="submit" class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit
          </button>
        </div>
      </form>
      <div v-if="formSubmitted" class="mt-4 text-center text-green-600">
        Thank you for your message. We'll get back to you soon!
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'AboutUs',
  setup() {
    const router = useRouter()
    const { user } = useAuth()

    const name = ref('')
    const email = ref('')
    const message = ref('')
    const formSubmitted = ref(false)

    const values = [
      { name: 'Community Collaboration', description: 'We thrive on the collective input and participation of kendama enthusiasts worldwide.' },
      { name: 'Growth and Learning', description: 'Committed to personal and communal development, we provide resources for players at every skill level.' },
      { name: 'Integrity and Fairness', description: 'Our commission structures and policies are designed to be transparent and fair, ensuring that creators are justly rewarded.' },
      { name: 'Sustainability', description: 'We aim to create a sustainable ecosystem where kendama can be a viable career path for dedicated players.' },
    ]

    const handleSubmit = () => {
      const formData = { name: name.value, email: email.value, message: message.value }
      console.log(JSON.stringify(formData))
      name.value = ''
      email.value = ''
      message.value = ''
      formSubmitted.value = true
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    const handleTeachersClick = () => {
      if (user.value) {
        router.push('/profile')
      } else {
        router.push('/signin')
      }
    }

    return {
      name,
      email,
      message,
      formSubmitted,
      values,
      handleSubmit,
      navigateTo,
      handleTeachersClick
    }
  }
}
</script>
