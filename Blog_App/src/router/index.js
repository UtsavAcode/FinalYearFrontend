import { createRouter, createWebHistory } from "vue-router";

import login from "../components/login.vue";
import dashboard from "../components/dashboard.vue";
import Register from "../components/register.vue";
import Home from "../components/home.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/register",
      component: Register,
      name: "register",
    },
    {
      path: "/login",
      component: login,
      name: "login",
    },
    {
      path: "/dashboard",
      component: dashboard,
      name: "dashboard",
    },
  ],
});

export default router;
