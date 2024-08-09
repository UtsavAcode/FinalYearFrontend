<template>
  <Navbar v-if="shownavbar" />

  <div class="content">
    <RouterView />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  computed: {
    shownavbar() {
      const hiddenRoutes = ["Users", "AdminDashboard", "Tags", "AllBlogs"];
      return !hiddenRoutes.includes(this.$route.name);
    },
  },
};
</script>

<style scoped></style>
