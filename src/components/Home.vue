<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="relative bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span class="block">Welcome to</span>
                <span class="block text-blue-500">Teach Niche</span>
              </h1>
              <p class="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Empowering kendama players to share knowledge, hone skills, and support one another. Join our community of passionate learners and teachers.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <router-link to="/tutorials" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Explore Tutorials
                  </router-link>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <router-link to="/about" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                    Learn More
                  </router-link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1529519195486-16945f0fb37f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Kendama player">
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Mission</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Built by Kendama Players, for Kendama Players
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            At Teach Niche, we're dedicated to fostering growth, connection, and financial sustainability within the kendama world.
          </p>
        </div>

        <div class="mt-10">
          <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div v-for="feature in features" :key="feature.name" class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <AcademicCapIcon class="h-6 w-6 text-blue-500" />
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.name }}</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">{{ feature.description }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-blue-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to level up your kendama skills?</span>
          <span class="block">Start learning today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-blue-200">
          Join our community of passionate kendama players and take your skills to new heights.
        </p>
        <router-link to="/signin" class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
          Sign up for free
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { AcademicCapIcon, BookOpenIcon, UserGroupIcon, BoltIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Home',
  components: {
    AcademicCapIcon,
    BookOpenIcon,
    UserGroupIcon,
    BoltIcon
  },
  setup() {
    const features = [
      {
        name: 'Expert-led tutorials',
        description: 'Learn from some of the best kendama players in the world through our curated tutorials.',
        icon: AcademicCapIcon,
      },
      {
        name: 'Skill progression',
        description: 'Track your progress and unlock new challenges as you improve your kendama skills.',
        icon: BoltIcon,
      },
      {
        name: 'Supportive community',
        description: 'Connect with fellow kendama enthusiasts, share your achievements, and get inspired.',
        icon: UserGroupIcon,
      },
      {
        name: 'Earn while you teach',
        description: 'Share your expertise and earn income by creating and selling your own tutorials.',
        icon: BookOpenIcon,
      },
    ]

    return {
      features,
      BoltIcon
    }
  },
}
</script>
