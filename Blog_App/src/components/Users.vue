<template>
  <div class="container">
    <table class="table table-striped table-hover text-center table-bordered">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th>Utility</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.userName }}</td>
          <!-- Use "name" as per the DTO -->
          <td>{{ user.email }}</td>
          <td>
            <button class="btn btn-dark" @click="showDialog(user)">Show</button>

            <Dialog
              v-model:visible="visible"
              header="Edit Profile"
              :style="{ width: '25rem' }"
            >
              <span class="text-surface-500 dark:text-surface-400 block mb-8">
                Update your information.
              </span>
              <div class="flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold w-25">Name</label>
                <InputText
                  id="userName"
                  v-model="selectedUser.userName"
                  class="flex-auto"
                  autocomplete="off"
                />
              </div>
              <div class="flex items-center gap-4 mb-3">
                <label for="email" class="font-semibold w-25">Email</label>
                <InputText
                  id="email"
                  v-model="selectedUser.email"
                  class="flex-auto"
                  autocomplete="off"
                />
              </div>
              <div class="d-flex justify-content-center align-center gap-2">
                <Button
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  @click="visible = false"
                ></Button>
                <Button type="button" label="Save" @click="saveUser"></Button>
              </div>
            </Dialog>

            <button
              class="btn btn-danger px-1 ms-1"
              @click="deleteUser(user.email)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  data() {
    return {
      users: [],
      visible: false,
      selectedUser: {},
    };
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get(
          "http://localhost:5254/api/Auth/GetAll"
        );
        this.users = response.data.map((user) => ({
          ...user,
          id: user.id.toString(),
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    showDialog(user) {
      this.selectedUser = { ...user };
      this.visible = true;
    },
    async saveUser() {
      try {
        // Sending Name and Email in the expected format for the DTO
        const response = await axios.put(
          "http://localhost:5254/api/Auth/Update",
          {
            name: this.selectedUser.userName, // Must match "Name" in DTO
            email: this.selectedUser.email, // Must match "Email" in DTO
          }
        );

        if (response.data.isSuccess) {
          console.log("User updated successfully");
          this.visible = false;
          await this.getUsers(); // Refresh the user list after successful update
        } else {
          console.error("Error updating user:", response.data.message);
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    async deleteUser(email) {
      try {
        const response = await axios.delete(
          `http://localhost:5254/api/Auth/Delete/${email}`
        );
        if (response.status === 200) {
          this.users = this.users.filter((user) => user.email !== email);
          alert("User deleted successfully.");
        } else {
          alert("Error deleting user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user.");
      }
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
