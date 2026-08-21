import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('@/views/WeatherHomeView.vue'),
    },

    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },

    {
      path: '/activity-guide',
      name: 'ActivityGuide',
      component: () => import('@/views/ActivityGuideView.vue'),
    },

    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('@/views/WeatherAboutView.vue'),
    },

    {
      path: '/practice',
      name: 'Practice',
      component: () => import('@/views/PracticeView.vue'),
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
