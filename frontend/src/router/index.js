import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LandingView.vue')
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: "/movie/:id-:slug",
      name: "MovieDetails",
      component: () => import("../views/MovieDetailsView.vue"),
    },
    {
      path: "/tv/:id-:slug",
      name: "tv",
      component: () => import("../views/MovieDetailsView.vue"),
    },
  ]
})

export default router
