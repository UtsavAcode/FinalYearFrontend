import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import login from "../components/login.vue";
import dashboard from "../components/dashboard.vue";
import Register from "../components/register.vue";
import Home from "../components/home.vue";
import User from "../components/user.vue";
import Admin from "../components/admin.vue";
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

    {
      path: "/user",
      component: User,
      meta: { requiresAuth: true, role: "user" },
    },

    {
      path: "/admin",
      component: Admin,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const roles = localStorage.getItem("roles")
    ? localStorage.getItem("roles").split(",")
    : [];

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next("/login");
    } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
        next();
      } else {
        next("/");
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
