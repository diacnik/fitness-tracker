import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/my-activity',
      name: 'my-activity',
      component: () => import('@/views/ActivityView.vue') // Lazy load the ActivityView component
    },
    {
      path: '/connections',
      name: 'connections',
      component: () => import('@/views/FriendView.vue') // Lazy load the ConnectionView component
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/AdminView.vue') // Lazy load the AdminView component
    }
  ],
})

export default router
