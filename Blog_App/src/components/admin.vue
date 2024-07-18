<template>
  <div>
    <h1>Admin Dashboard</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Is Admin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.roles }}</td>
          <td>
            <input type="checkbox" :checked="user.roles.includes('admin')" @change="toggleAdmin(user)">
          </td>
          <td>
            <button @click="updateUser(user)">Update</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      users: 'users/users',
      error: 'users/usersError'
    })
  },
  methods: {
    ...mapActions({
      fetchUsers: 'users/fetchUsers',
      updateUser: 'users/updateUser',
      deleteUser: 'users/deleteUser'
    }),
    toggleAdmin(user) {
      user.roles = user.roles.includes('admin') ? user.roles.filter(role => role !== 'admin') : [...user.roles, 'admin'];
      this.updateUser(user);
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>
