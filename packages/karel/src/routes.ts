import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/:exercise",
      name: "exercise",
      component: () => import("@/views/Exercise.vue"),
    },
  ],
});
