<!-- src/components/Register.vue -->

<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="name" placeholder="Name" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    ...mapActions("auth", ["register"]),
    async register() {
      try {
        const user = {
          name: this.name,
          email: this.email,
          password: this.password,
        };
        await this.register(user);
        this.$router.push("/login");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
