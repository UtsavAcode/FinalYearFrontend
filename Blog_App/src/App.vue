<template>
  <Navbar v-if="shownavbar" @search="handleSearch" />

  <div class="content">
    <RouterView :searchQuery="searchQuery" />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  computed: {
    shownavbar() {
      const hiddenRoutes = [
        "Users",
        "AdminDashboard",
        "Tags",
        "AllBlogs",
        "Performance",
      ];
      return !hiddenRoutes.includes(this.$route.name);
    },
  },
  methods: {
    handleSearch(query) {
      this.searchQuery = query; // Update the searchQuery
    },
  },
};
</script>

<style scoped></style>
