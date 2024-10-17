<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-center">Sign In</h2>
    <form @submit.prevent="handleSignIn" class="space-y-4">
      <div>
        <label for="email" class="block mb-1">Email</label>
        <input v-model="email" id="email" type="email" required class="w-full px-3 py-2 border rounded-lg">
      </div>
      <div>
        <label for="password" class="block mb-1">Password</label>
        <input v-model="password" id="password" type="password" required class="w-full px-3 py-2 border rounded-lg">
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
        Sign In
      </button>
    </form>
    <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { useRouter } from 'vue-router'

export default {
  name: 'SignIn',
  setup() {
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const router = useRouter()

    const handleSignIn = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        })

        if (error) throw error

        router.push('/profile')
      } catch (error) {
        errorMessage.value = error.message
      }
    }

    return {
      email,
      password,
      errorMessage,
      handleSignIn
    }
  }
}
</script>