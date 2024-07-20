<template>
  <div>
    <h1>Welcome to the Blog</h1>
    <p>This is for authenticated users only.</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "HeroPage",
  setup() {
    const store = useStore();
    const router = useRouter();

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
