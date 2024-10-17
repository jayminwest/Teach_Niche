<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-2xl font-bold text-blue-600">
              Teach Niche
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="(item, index) in navItems"
              :key="index"
              :to="item.path"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              :class="{ 'text-blue-600': $route.path === item.path }"
            >
              {{ item.name }}
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              v-if="user"
              @click="signOut"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Sign Out
            </button>
            <router-link
              v-else
              to="/signin"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Sign In
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-grow container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>

    <!-- Reverted Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-auto">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Teach Niche</h3>
            <p class="text-sm text-gray-400">Empowering kendama players to share knowledge and grow together.</p>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li v-for="item in navItems" :key="item.path">
                <router-link :to="item.path" class="text-sm text-gray-400 hover:text-white transition duration-150 ease-in-out">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-4">Legal</h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/legal" class="text-sm text-gray-400 hover:text-white transition duration-150 ease-in-out">Legal Information</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-4">Connect</h4>
            <ul class="space-y-2">
              <li>
                <a href="https://instagram.com/teachniche" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-400 hover:text-white transition duration-150 ease-in-out">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center">
          <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} Teach Niche. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './utils/supabase'

export default {
  name: 'App',
  setup() {
    const user = ref(null)
    const router = useRouter()

    const navItems = [
      { name: 'Home', path: '/' },
      { name: 'Tutorials', path: '/tutorials' },
      { name: 'About', path: '/about' },
      { name: 'Profile', path: '/profile' },
    ]

    onMounted(async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user.value = authUser
    })

    const signOut = async () => {
      await supabase.auth.signOut()
      user.value = null
      router.push('/')
    }

    return {
      user,
      navItems,
      signOut,
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
