<template>
  <!-- /.navbar -->
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a class="brand-link">
      <RouterLink
        class="brand-text font-weight-light text-light mx-3 display-7"
        to="/"
        >Bloggy</RouterLink
      >
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="info">
          <a href="#" class="d-block">{{ name }}</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
        >
          <!-- Add icons to the links using the .nav-icon class
             with font-awesome or any other icon font library -->
          <li class="nav-item menu-open">
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <RouterLink to="/performance" href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Dashboard</p>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/users" href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Users</p>
                </RouterLink>
              </li>

              <li class="nav-item">
                <RouterLink to="/tags" href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Tags</p>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/getBlogsAdmin" href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>All Blogs</p>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/addBlog" href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Add Blog</p>
                </RouterLink>
              </li>

              <li class="nav-item" v-if="isAuthenticated">
                <a @click="handleLogout" href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Logout</p>
                </a>
              </li>
            </ul>
          </li>
          <!-- <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-th"></i>
              <p>
                Simple Link
                <span class="right badge badge-danger">New</span>
              </p>
            </a>
          </li> -->
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
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
