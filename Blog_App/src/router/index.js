import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/login.vue";
import HeroPage from "@/components/HeroPage.vue";
import Register from "@/components/Register.vue";
import Home from "@/components/home.vue";
import Profile from "@/components/Profile.vue";
import Admin from "@/components/admin.vue";
import authService from "@/services/auth.servics";
import store from "@/store"; // Import the Vuex store
import Users from "@/components/Users.vue";
import Tags from "@/components/tags.vue";
import AddBlog from "@/components/addBlog.vue";
import GetBlogs from "@/components/blogsAdmin.vue";
import UserDashboard from "@/components/userDashboard.vue";
import UserBlogs from "@/components/UserActivity/UserBlogs.vue";
import EditBlog from "@/components/UserActivity/UserBlogEdit.vue";
import Performance from "@/components/Performance.vue";
import UserBlogDetail from "@/components/UserActivity/UserBlogDetail.vue";
import UserPerformance from "@/components/UserActivity/UserPerformance.vue";
import UserBlogPerformance from "@/components/UserActivity/UserBlogPerformance.vue";

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
    path: "/addBlog",
    name: "AddBlog",
    component: AddBlog,
  },
  {
    path: "/userBlogDetail/:id",
    name: "UserBlogDetail",
    component: UserBlogDetail,
    props: true,
  },

  {
    path: "/userDashboard",
    name: "UserDashboard",
    component: UserDashboard,
    children: [
      {
        path: "/userBlogs",
        name: "UserBlogs",
        component: UserBlogs,
      },
      {
        path: "/userPerformance",
        name: "UserPerformance",
        component: UserPerformance,
      },
      {
        path: "/edit-blog/:id",
        name: "EditBlog",
        component: EditBlog,
        props: true,
      },
      {
        path: "/userBlogPerformance/:id",
        name: "UserBlogPerformance",
        component: UserBlogPerformance,
        props: true,
      },
    ],
  },

  {
    path: "/admin-dashboard",
    name: "AdminDashboard",
    component: Admin,
    meta: { requiresAuth: true, isAdmin: true },
    children: [
      {
        path: "/users",
        name: "Users",
        component: Users,
      },

      {
        path: "/tags",
        name: "Tags",
        component: Tags,
      },
      {
        path: "/getBlogsAdmin",
        name: "AllBlogs",
        component: GetBlogs,
      },
      {
        path: "/performance",
        name: "Performance",
        component: Performance,
      },
    ],
  },
  {
    path: "/hero",
    name: "HeroPage",
    component: HeroPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      next({ name: "Login" });
    } else {
      // Fetch user roles from Vuex store
      const roles = store.getters["auth/roles"];
      if (to.matched.some((record) => record.meta.isAdmin)) {
        if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
          next();
        } else {
          next({ name: "HeroPage" }); // Redirect to hero page if not an admin
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
