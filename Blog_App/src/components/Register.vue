<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Username</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import AuthService from "../services/authService";

export default {
  name: "RegisterPage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        await AuthService.register({
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.$router.push("/login");
      } catch (error) {
        console.error("Registration failed", error);
      }
    },
  },
};
</script>
