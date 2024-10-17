<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="mt-6 text-6xl font-extrabold text-gray-900">404</h2>
        <h3 class="mt-2 text-3xl font-bold text-gray-900">Page not found</h3>
        <p class="mt-2 text-sm text-gray-600">Oops! The page you are looking for doesn't exist.</p>
      </div>
      <div class="mt-8">
        <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Go back home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
