import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/views/HomePage.vue";
import MovieDetailsPage from "@/views/MovieDetailsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:"/",
      name:"Home",
      component:HomePage
    },
    {
      path:"/movie/:id",
      name:"MovieDetails",
      component: MovieDetailsPage
    }
  ],
})

export default router
