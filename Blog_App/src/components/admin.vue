<template>
  <div>
    <sidebar />
    <RouterView />
  </div>
</template>

<script>
import axios from "axios";
import sidebar from "../components/sidebar.vue";
import Users from "../components/Users.vue";
export default {
  name: "AdminDashboard",
  data() {
    return {
      users: [],
      visible: false,
      selectedUser: {},
    };
  },
  components: {
    sidebar,
    Users,
  },
};
</script>
