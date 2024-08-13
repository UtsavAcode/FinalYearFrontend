<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar: takes up 3 out of 12 columns -->
      <div class="col-md-3">
        <UserSidebar />
      </div>

      <!-- Main content: takes up the remaining 9 columns -->
      <div class="col-md-9">

        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import UserSidebar from "../components/UserActivity/UserSidebar.vue";

export default {
  name: "UserDashboard",

  components: {
    UserSidebar,
  },
};
</script>
