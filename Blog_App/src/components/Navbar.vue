<template>
  <header class="container-fluid sticky-top bg-white">
    <nav class="navbar navbar-expand-lg p-2">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse">
          <ul
            class="navbar-nav mb-2 mb-lg-0 mx-2"
            style="justify-content: center"
          >
            <li class="nav-item">
              <RouterLink
                class="text-dark poppins"
                to="/"
                style="text-decoration: none"
                >Home</RouterLink
              >
            </li>
          </ul>
          <h1 class="cursive mx-7">
            <RouterLink
              class="text-dark"
              to="/"
              style="text-decoration: none"
              @click.native="reloadPage"
              >Bloggy</RouterLink
            >
          </h1>
          <form
            class="searchbar"
            role="search"
            @submit.prevent="emitSearchQuery"
          >
            <IconField>
              <InputIcon
                class="pi pi-search"
                type="button"
                @click="emitSearchQuery"
              />
              <InputText
                placeholder="Search"
                v-model="searchText"
                @keyup.enter="emitSearchQuery"
              />
            </IconField>
          </form>
          <div class="dropdown avatar-con" v-if="isAuthenticated">
            <p
              class="avatar"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ firstLetter }}
            </p>
            <div
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <!-- <li v-if="isAuthenticated">
                <router-link class="dropdown-item poppins" to="/profile"
                  >Profile</router-link
                >
              </li> -->

              <li v-if="isAuthenticated">
                <router-link class="dropdown-item poppins" to="/addBlog"
                  >Blog</router-link
                >
              </li>
              <li v-if="isAuthenticated">
                <router-link class="dropdown-item poppins" :to="dashBoard"
                  >Dashboard</router-link
                >
              </li>

              <li v-if="isAuthenticated">
                <a class="dropdown-item poppins" @click="handleLogout"
                  >Logout</a
                >
              </li>
            </div>
          </div>

          <div class="ms-5" v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="text-decoration-none poppins m-3 text-dark"
              >Log in</RouterLink
            >
            <RouterLink to="/register" class="btn btn-dark poppins mx-2 mb-1"
              >Sign Up</RouterLink
            >
          </div>
        </div>
      </div>
    </nav>
  </header>
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
      searchText: "",
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

    dashBoard() {
      if (this.roles.includes("SuperAdmin")) {
        return "/performance"; // Redirect to super admin dashboard
      } else if (this.roles.includes("Admin")) {
        return "/adminDashboard"; // Redirect to admin dashboard
      } else {
        return "/userPerformance"; // Redirect to user dashboard
      }
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
    emitSearchQuery() {
      if (this.searchText.trim() !== "") {
        this.$emit("search", this.searchText); // Emit the search query to parent
      } else {
        this.$emit("search", ""); // Emit an empty string to clear the search
      }
    },
    reloadPage() {
      window.location.href = "/"; // This will force a page reload when clicked
    },
  },
};
</script>
