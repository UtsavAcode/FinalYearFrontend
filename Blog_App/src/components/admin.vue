<template>
  <div>
    <sidebar />
    <div class="mx-8">
      <h1>This is a freaking admin panel</h1>
      <RouterView />
    </div>
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
