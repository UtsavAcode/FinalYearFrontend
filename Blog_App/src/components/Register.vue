
**`views/Register.vue`**

```vue
<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required>
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" required>
      </div>
      <button type="submit">Register</button>
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
      password: '',
      confirmPassword: ''
    };
  },
  computed: {
    ...mapGetters({
      error: 'auth/authError'
    })
  },
  methods: {
    ...mapActions({
      registerAction: 'auth/register'
    }),
    register() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match";
        return;
      }
      this.registerAction({ email: this.email, password: this.password })
        .then(() => {
          this.$router.push('/login');
        });
    }
  }
};
</script>
