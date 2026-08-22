import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'HikingHome',
      component: () => import('@/views/HikingHomeView.vue'),
    },
    {
      path: '/mountain/:mountainName',
      name: 'MountainDetail',
      component: () => import('@/views/MountainDetailView.vue'),
    },
    {
      path: '/weather',
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
      path: '/practice',
      name: 'Practice',
      component: () => import('@/views/PracticeView.vue'),
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('@/views/WeatherAboutView.vue'),
    },
    {
      path: '/mountain-api-test',
      name: 'MountainApiTest',
      component: () => import('@/views/MountainApiTestView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return {
      top: 0,
      left: 0,
    }
  },
})

export default router
