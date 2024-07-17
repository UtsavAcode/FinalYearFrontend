<!-- src/components/AdminDashboard.vue -->

<template>
  <div>
    <h2>Admin Dashboard</h2>
    <div v-if="users">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(", ") }}</td>
            <td>
              <button @click="editUser(user)">Edit</button>
              <button @click="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading users...</div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      users: [],
    };
  },
  computed: {
    ...mapState("auth", ["roles"]),
  },
  methods: {
    ...mapActions("auth", ["fetchUsers", "updateUser", "deleteUser"]),
    async loadUsers() {
      try {
        this.users = await this.fetchUsers();
      } catch (error) {
        console.error(error);
      }
    },
    async editUser(user) {
      const newRole = prompt(
        "Enter new role (user/admin)",
        user.roles.join(", ")
      );
      if (newRole) {
        try {
          await this.updateUser({ ...user, roles: [newRole] });
          this.loadUsers();
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await this.deleteUser(userId);
          this.loadUsers();
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  created() {
    this.loadUsers();
  },
};
</script>
