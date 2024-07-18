<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
       <p v-if="error">{{ error }}</p>
</form>
 </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  computed: {
    ...mapGetters({
      error: 'auth/authError'
    })
  },
   methods: {
    ...mapActions({
      loginAction: 'auth/login'
    }),
    login() {
      this.loginAction({ email: this.email, password: this.password })
        .then(() => {
          if (this.$store.getters['auth/userRole'] === 'admin' || this.$store.getters['auth/userRole'] === 'superadmin') {
            this.$router.push('/admin');
          } else {
            this.$router.push('/');
          }
        });
    }
  }
};
</script>