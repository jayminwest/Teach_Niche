<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="text-center">
      <p class="text-xl">Loading tutorial...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <p class="text-xl">{{ error }}</p>
    </div>
    <div v-else>
      <h1 class="text-3xl font-bold mb-4">{{ tutorial.title }}</h1>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div v-html="tutorial.content" class="prose max-w-none"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../utils/supabase'

export default {
  name: 'TutorialView',
  setup() {
    const route = useRoute()
    const tutorial = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchTutorial = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('tutorials')
          .select('*')
          .eq('id', route.params.id)
          .single()

        if (fetchError) throw fetchError

        tutorial.value = data
      } catch (err) {
        error.value = 'Failed to load tutorial. Please try again.'
        console.error('Error fetching tutorial:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchTutorial)

    return {
      tutorial,
      loading,
      error
    }
  }
}
</script>

