<template>
  <h1>User</h1>
  <p>Welcome,{{ user.name }}</p>

  <div>
    <a href="#" class="btn btn-dark" @click="logout">Logout</a>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  name: "user",
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
