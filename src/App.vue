<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-blue-600 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold">Marketplace</router-link>
        <div>
          <router-link to="/" class="mr-4 hover:text-blue-200">Home</router-link>
          <router-link to="/tutorials" class="mr-4 hover:text-blue-200">Tutorials</router-link>
          <router-link v-if="isAuthenticated" to="/profile" class="hover:text-blue-200">Profile</router-link>
          <router-link v-else to="/signin" class="hover:text-blue-200">Sign In</router-link>
        </div>
      </nav>
    </header>

    <main class="flex-grow container mx-auto mt-8 px-4">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 text-white p-4 mt-8">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 Marketplace. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from './utils/supabase'

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(false)

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      isAuthenticated.value = !!session
    }

    onMounted(() => {
      checkAuth()
      supabase.auth.onAuthStateChange(() => {
        checkAuth()
      })
    })

    return {
      isAuthenticated
    }
  }
}
</script>