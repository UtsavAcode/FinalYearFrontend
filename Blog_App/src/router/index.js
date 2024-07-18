import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Login from "../components/login.vue";
import HeroPage from "../components/HeroPage.vue";
import Register from "../components/register.vue";
import Home from "../components/home.vue";
import Profile from "../components/Profile.vue";
import Admin from "../components/admin.vue";

Vue.use(Router);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true, isAdmin: true },
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAdmin = to.matched.some((record) => record.meta.isAdmin);
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  const userRole = store.getters["auth/userRole"];

  if (requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (isAdmin && userRole !== "admin" && userRole !== "superadmin") {
    next("/");
  } else {
    next();
  }
});

export default router;
