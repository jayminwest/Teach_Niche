import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import AboutUs from '../components/AboutUs.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUs
  },
  // ... other existing routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
