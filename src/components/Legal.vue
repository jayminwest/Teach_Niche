<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Legal Information</h1>
    
    <!-- Tabs -->
    <div class="mb-8 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button 
          v-for="tab in ['terms', 'privacy']"
          :key="tab"
          @click="activeTab = tab" 
          :class="[
            activeTab === tab
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          {{ tab === 'terms' ? 'Terms of Service' : 'Privacy Policy' }}
        </button>
      </nav>
    </div>

    <!-- Terms of Service -->
    <div v-if="activeTab === 'terms'" class="prose max-w-none">
      <h2>Terms of Service</h2>
      <p>
        Welcome to Teach Niche. By using our services, you agree to these terms. Please read them carefully.
      </p>
      <!-- Add more terms of service content here -->
    </div>

    <!-- Privacy Policy -->
    <div v-if="activeTab === 'privacy'" class="prose max-w-none">
      <h2>Privacy Policy</h2>
      <p>
        At Teach Niche, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
      </p>
      <!-- Add more privacy policy content here -->
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Legal',
  setup() {
    const activeTab = ref('terms')

    return {
      activeTab
    }
  }
}
</script>
