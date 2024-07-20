<template>
  <h1>This will be an admin panel..</h1>
  <button @click="handleLogout">Logout</button>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Admin-Dashboard",
  setup() {
    const router = useRouter();
    const store = useStore();

    const handleLogout = async () => {
      try {
        await store.dispatch("auth/logout"); // Call Vuex action to perform logout
        router.push("/login"); // Redirect to login page after logout
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    return { handleLogout };
  },
};
</script>
