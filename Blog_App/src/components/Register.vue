<template>
  <div class="container w-25">
    <h2 class="text-center p-2 mb-4">Sign up To Bloggy</h2>
    <form @submit.prevent="registerUser">
      <label for="username" class="font-weight-bold">Username:</label>
      <input
        type="text"
        class="h-1 form-control"
        v-model="user.name"
        required
      />

      <div>
        <label for="email" class="font-weight-bold">Email:</label>
        <input
          type="email"
          class="h-1 form-control"
          v-model="user.email"
          required
        />
      </div>
      <div>
        <label for="password" class="font-weight-bold">Password:</label>
        <input
          type="password"
          class="h-1 form-control"
          v-model="user.password"
          required
        />
      </div>
      <div>
        <label for="repeatPassword" class="font-weight-bold"
          >Confirm Password:</label
        >
        <input
          type="password"
          class="h-1 form-control"
          v-model="user.repeatPassword"
          required
        />
      </div>
      <button type="submit" class="btn-darkish">Create Account</button>
      <p class="text-center p-2 mx-auto">Already have an account? Sign in</p>
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
import toastr from "toastr"; // Import Toastr

export default {
  name: "Register",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
      },
      validationErrors: [],
    };
  },
  methods: {
    async registerUser() {
      this.validationErrors = [];

      try {
        const response = await axios.post(
          "http://localhost:5254/api/Auth/Register",
          {
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
            confirmPassword: this.user.repeatPassword,
          }
        );
        if (response.data.isSuccess) {
          toastr.success(response.data.message); // Display success message
        } else {
          toastr.error(response.data.message); // Display error message
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          this.validationErrors = Object.values(errors).flat();
          this.validationErrors.forEach((err) => toastr.error(err)); // Display validation errors
        } else {
          toastr.error(error.response.data.message); // Display error message
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
</style>
