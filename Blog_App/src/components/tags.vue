<template>
  <div class="mx-8 w-50">
    <h1>tags</h1>

    <form @submit.prevent="addTag">
      <div>
        <label for="name" class="font-weight-bold">Tag Name</label>
        <input class="h-1 mb-2 w-50 form-control" type="text" v-model="tagName" required />
        <button class="btn btn-dark">Add</button>
      </div>
    </form>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <div>
      <table class="table table-striped table-hover text-center table-bordered">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th>Utility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <!-- <td>
              <button class="btn btn-dark" @click="showDialog()">
                Show
              </button>

              <Dialog
                v-model:visible="visible"
                header="Edit Profile"
                :style="{ width: '25rem' }"
              >
                <span class="text-surface-500 dark:text-surface-400 block mb-8"
                  >Update your information.</span
                >
               
                <div class="flex items-center gap-4 mb-3">
                  <label for="name" class="font-semibold w-25">Name</label>
                  <InputText
                    id="email"
                    
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
                  <Button type="button" label="Save" @click=""></Button>
                </div>
              </Dialog>

              <button
                class="btn btn-danger px-1 ms-1"
                @click=""
              >
                Delete
              </button>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import blogService from "../services/BlogService";

export default {
  name: "Tags",
  data() {
    return {
      tagName: "",
      error: null,
      successMessage: null,
      blogPosts: [], // Add an empty array to match the required structure
    };
  },
  methods: {
    async addTag() {
      try {
        const tag = { 
          name: this.tagName,
          blogPosts: this.blogPosts // Ensure this is sent with the request
        };
        const response = await blogService.addTag(tag);
        this.successMessage = "Tag added successfully";
        this.error = null;
        this.tagName = "";
        this.blogPosts = []; // Reset the blogPosts array if needed
      } catch (err) {
        console.error("Error adding tag:", err); // Log error details
        this.error = err.message || "An error occurred";
        this.successMessage = null;
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
