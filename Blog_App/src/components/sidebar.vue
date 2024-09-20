<template>
  <div class="container-fluid position-fixed  border-end" style="width: 17rem">
    <div class="row flex-wrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white">
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 dark min-vh-100"
        >
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
              <div class="info">
                <a href="#" class="admins_name">{{ name }}</a>
              </div>
            </div>

            <li>
              <a
                href="#submenu1"
                data-bs-toggle="collapse"
                class="nav-link px-0 align-middle text-dark"
              >
                <i class="fs-4 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">Dashboard</span>
              </a>
            </li>

            <li>
              <RouterLink class="nav-link px-0 align-middle text-dark" to="/">
                <i class="fs-4 bi-house"></i>
                <p class="ms-1 d-none d-sm-inline text-dark display-7">Home</p>
              </RouterLink>
            </li>

            <li>
              <RouterLink
                class="nav-link px-0 align-middle text-dark"
                to="/users"
              >
                <i class="fs-4 bi-person"></i>
                <p class="ms-1 d-none d-sm-inline text-dark display-7">Users</p>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="nav-link px-0 align-middle text-dark"
                to="/tags"
              >
                <i class="fs-4 bi-bookmark-check"></i>
                <p class="ms-1 d-none d-sm-inline text-dark display-7">Tags</p>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="nav-link px-0 align-middle text-dark"
                to="/getBlogsAdmin"
              >
                <i class="fs-4 bi-book"></i>
                <p class="ms-1 d-none d-sm-inline text-dark display-7">Blogs</p>
              </RouterLink>
            </li>

            <li>
              <RouterLink
                class="nav-link px-0 align-middle text-dark"
                to="/addBlog"
              >
                <i class="fs-4 bi-table"></i>
                <p class="ms-1 d-none d-sm-inline text-dark display-7">
                  AddBlogs
                </p>
              </RouterLink>
            </li>

            <li class="logout-item" v-if="isAuthenticated">
              <a @click="handleLogout" href="#" class="logout-link">
                <i class="fs bi-box-arrow-right pe-2"></i>
                <p>Logout</p>
              </a>
            </li>
          </ul>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Navbar",

  data() {
    return {
      user: {
        name: "",
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "roles", "name"]),
    userRole() {
      return this.roles.length > 0 ? this.roles[0] : ""; // Assuming the first role is the main role
    },
    firstLetter() {
      return this.name ? this.name.charAt(0).toUpperCase() : "";
    },
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    async handleLogout() {
      try {
        await this.logout(); // Call Vuex action to perform logout
        this.$router.push("/login"); // Redirect to login page after logout
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  },
};
</script>
