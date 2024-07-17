<!-- src/components/Login.vue -->

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async login() {
      try {
        const user = {
          email: this.email,
          password: this.password,
        };
        await this.login(user);
        this.$router.push('/');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
