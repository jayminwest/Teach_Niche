<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h2>
      <p class="text-gray-600 mb-4">Your payment has been cancelled. No charges were made.</p>
      <router-link to="/" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
        Back to Tutorials
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CancelPage'
}
</script>
