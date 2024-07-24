<template>
  <div class="container w-25">
    <h2 class="text-center p-2 mb-4">Login</h2>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email" class="font-weight-bold">Email:</label>
        <input
          class="h-1 mb-2 form-control"
          type="email"
          v-model="email"
          required
        />
      </div>
      <div>
        <label for="password" class="font-weight-bold">Password:</label>
        <input
          class="h-1 mb-3 form-control"
          type="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn-darkish">Login</button>
      <p class="text-center p-2 mx-auto">
        Don't have an account? Register here
      </p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "roles"]),
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async loginUser() {
      try {
        const response = await this.login({
          email: this.email,
          password: this.password,
        });
        if (response.isSuccess) {
          const roles = this.$store.getters["auth/roles"]; // Get roles from Vuex
          if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
            this.$router.push("/admin-dashboard"); // Redirect to admin dashboard
          } else {
            this.$router.push("/hero"); // Redirect to hero page
          }
        } else {
          this.errorMessage = response.message;
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = error.message; // Adjusted to use error.message
        }
      }
    },
  },
};
</script>
