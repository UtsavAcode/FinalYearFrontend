<template>
  <div>
    <h2>Admin Dashboard</h2>
    <!-- Add your admin components and functionality here -->
     <p>{{ user }}</p>
  </div>
</template>

<script>
import authService from "@/services/authService";
export default {
  name: "AdminDashboard",

  data() {
    return {
      user: [],
    };
  },

  methods: {
    getAll() {
      const users = authService.getAll();
      this.user = users.data;
    },
  },
};
</script>
