import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: defineAsyncComponent(() => import("@/views/Home.vue")),
    },
    {
      path: "/:exercise",
      name: "exercise",
      component: defineAsyncComponent(() => import("@/views/Exercise.vue")),
    },
  ],
});
