<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to the Marketplace</h1>
      <p class="text-xl mb-8">Discover and share amazing tutorials!</p>
      <router-link to="/tutorials" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
        Browse Tutorials
      </router-link>
    </section>

    <!-- Services Offered Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 text-center">Our Services</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">Learn</h3>
          <p>Access high-quality tutorials from experts in various fields.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">Teach</h3>
          <p>Share your knowledge and earn by creating your own tutorials.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">Connect</h3>
          <p>Join a community of learners and educators from around the world.</p>
        </div>
      </div>
    </section>

    <!-- Featured Lessons Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 text-center">Featured Lessons</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="lesson in featuredLessons" :key="lesson.id" class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">{{ lesson.title }}</h3>
          <p class="mb-4">{{ lesson.description }}</p>
          <router-link :to="'/tutorials/' + lesson.id" class="text-blue-600 hover:underline">Learn more</router-link>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="bg-blue-100 p-8 rounded-lg text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to start learning?</h2>
      <p class="text-xl mb-6">Join our community today and unlock a world of knowledge!</p>
      <router-link to="/signin" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
        Sign Up Now
      </router-link>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

export default {
  name: 'Home',
  setup() {
    const featuredLessons = ref([])

    const fetchFeaturedLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('tutorials')
          .select('id, title, description')
          .limit(3)
        
        if (error) throw error
        featuredLessons.value = data
      } catch (error) {
        console.error('Error fetching featured lessons:', error.message)
      }
    }

    onMounted(() => {
      fetchFeaturedLessons()
    })

    return {
      featuredLessons
    }
  }
}
</script>
