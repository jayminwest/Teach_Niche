<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-8">Welcome to the Marketplace</h1>
    <p class="text-xl mb-8">Discover and share amazing tutorials!</p>
    <router-link to="/tutorials" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
      Browse Tutorials
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>