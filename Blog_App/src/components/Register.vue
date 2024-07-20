<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <!-- <div>
        <label for="username">Username:</label>
        <input type="text" v-model="user.username" required />
      </div> -->
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="user.email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="user.password" required />
      </div>
      <div>
        <label for="repeatPassword">Confirm Password:</label>
        <input type="password" v-model="user.repeatPassword" required />
      </div>
      <button type="submit">Register</button>
      <p v-if="error">{{ error }}</p>
      <p v-if="success">{{ success }}</p>
      <ul v-if="validationErrors.length">
        <li v-for="(err, index) in validationErrors" :key="index" class="error">
          {{ err }}
        </li>
      </ul>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      user: {
        email: "",
        password: "",
        repeatPassword: "",
      },
      error: "",
      success: "",
      validationErrors: [],
    };
  },
  methods: {
    async registerUser() {
      this.error = "";
      this.success = "";
      this.validationErrors = [];

      try {
        const response = await axios.post(
          "http://localhost:5254/api/Auth/Register",
          {
            email: this.user.email,
            password: this.user.password,
            confirmPassword: this.user.repeatPassword,
          }
        );
        if (response.data.isSuccess) {
          this.success = response.data.message;
        } else {
          this.error = response.data.message;
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          this.validationErrors = Object.values(errors).flat();
          console.log("Validation errors:", this.validationErrors); // Debug log
        } else {
          this.error = error.response.data.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: block;
  margin-top: 10px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  margin-top: 15px;
  padding: 10px 15px;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
