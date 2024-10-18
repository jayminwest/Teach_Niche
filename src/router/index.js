import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Tutorials from '../components/Tutorials.vue'
import SuccessPage from '../components/SuccessPage.vue'
import CancelPage from '../components/CancelPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tutorials',
    name: 'Tutorials',
    component: Tutorials
  },
  {
    path: '/success',
    name: 'SuccessPage',
    component: SuccessPage
  },
  {
    path: '/cancel',
    name: 'CancelPage',
    component: CancelPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
