<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Hero Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">About Teach Niche</h1>
          <p class="mt-6 max-w-md mx-auto text-xl text-gray-500 sm:text-2xl md:mt-8 md:max-w-3xl">
            Built by Kendama Players, for Kendama Players
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Mission and Story -->
      <div class="grid grid-cols-1 gap-12 mb-16">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="px-6 py-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
            <p class="text-lg text-gray-600 text-center">
              At <strong>Teach Niche</strong>, our mission is to empower the
              kendama community by providing a platform where players of all
              levels can share knowledge, hone their skills, and support one
              another. We are dedicated to fostering growth, connection, and
              financial sustainability within the kendama world.
            </p>
          </div>
        </div>
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="px-6 py-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <p class="text-lg text-gray-600 mb-4 text-center">
              Hello! I'm <strong>Jaymin West</strong>, the founder of Teach
              Niche. I've been passionately playing kendama for over seven
              years. Throughout my journey, I've witnessed the incredible
              talent and dedication within our community.
            </p>
            <p class="text-lg text-gray-600 text-center">
              Teach Niche was born from a simple idea: to help kendama players
              make a living from what they love.
            </p>
          </div>
        </div>
      </div>

      <!-- Why Teach Niche -->
      <div class="mb-16">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-10">Why Teach Niche?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(item, index) in ['Empowerment', 'Education', 'Community Growth', 'Connection']" :key="index" class="bg-blue-600 rounded-lg shadow-md p-8 text-white text-center">
            <h3 class="text-2xl font-semibold mb-4">{{ item }}</h3>
            <p class="text-lg">We believe in the power of {{ item.toLowerCase() }} within the kendama community.</p>
          </div>
        </div>
      </div>

      <!-- Our Values -->
      <div class="mb-16">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-10">Our Values</h2>
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div v-for="(value, index) in values" :key="index" class="text-center">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ value.name }}</h3>
              <p class="text-gray-600">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Join the Movement -->
      <div>
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-10">Join the Movement</h2>
        <div class="flex flex-col md:flex-row gap-8 justify-center">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden flex-1">
            <div class="px-6 py-8 text-center">
              <h3 class="text-2xl font-semibold text-gray-900 mb-4">For Learners</h3>
              <p class="text-lg text-gray-600 mb-6">
                Access tutorials from some of the best kendama players in the
                world and take your skills to new heights.
              </p>
              <button @click="navigateTo('/tutorials')" class="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Lessons
              </button>
            </div>
          </div>
          <div class="bg-white shadow-lg rounded-lg overflow-hidden flex-1">
            <div class="px-6 py-8 text-center">
              <h3 class="text-2xl font-semibold text-gray-900 mb-4">For Teachers</h3>
              <p class="text-lg text-gray-600 mb-6">
                Share your expertise, connect with a global audience, and earn
                income doing what you love.
              </p>
              <button @click="handleTeachersClick" class="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Become a Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'AboutUs',
  setup() {
    const router = useRouter()
    const { user } = useAuth()

    const values = [
      { name: 'Community Collaboration', description: 'We thrive on the collective input and participation of kendama enthusiasts worldwide.' },
      { name: 'Growth and Learning', description: 'Committed to personal and communal development, we provide resources for players at every skill level.' },
      { name: 'Integrity and Fairness', description: 'Our commission structures and policies are designed to be transparent and fair, ensuring that creators are justly rewarded.' },
      { name: 'Sustainability', description: 'We aim to create a sustainable ecosystem where kendama can be a viable career path for dedicated players.' },
    ]

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
      values,
      navigateTo,
      handleTeachersClick
    }
  }
}
</script>
