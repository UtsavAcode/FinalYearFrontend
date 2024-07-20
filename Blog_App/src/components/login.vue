<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
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
