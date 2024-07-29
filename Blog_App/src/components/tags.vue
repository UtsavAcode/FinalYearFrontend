<template>
  <div class="w-50">
    <h1>Tags</h1>

    <form @submit.prevent="addTag">
      <div>
        <label for="name" class="font-weight-bold">Tag Name</label>
        <div class="form-inline">
          <input
            class="h-1 mb-2 w-50 form-control"
            type="text"
            v-model="tagName"
            required
          />
          <button class="btn btn-dark mx-2 mb-2">Add</button>
        </div>
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
          <tr v-for="tag in tags" :key="tag.id">
            <td>{{ tag.id }}</td>
            <td>{{ tag.name }}</td>

            <td>
              <button class="btn btn-dark" @click="showDialog(tag)">
                Edit
              </button>

              <Dialog
                v-model:visible="visible"
                header="Edit Tag"
                :style="{ width: '25rem' }"
              >
                <span class="text-surface-500 dark:text-surface-400 block mb-8">
                  Update the tag name.
                </span>

                <div class="flex items-center gap-4 mb-3">
                  <label for="name" class="font-semibold w-25">Name</label>
                  <InputText
                    id="name"
                    v-model="currentTag.name"
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
                  <Button
                    type="button"
                    label="Save"
                    @click="updateTag"
                  ></Button>
                </div>
              </Dialog>

              <button
                class="btn btn-danger px-1 ms-1"
                @click="deleteTag(tag.id)"
              >
                Delete
              </button>
            </td>
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
      blogPosts: [],
      tags: [], // Add an empty array to match the required structure
      visible: false,
      currentTag: {}, // Object to hold the current tag being edited
    };
  },

  created() {
    this.getAllTags();
  },
  methods: {
    async addTag() {
      try {
        const tag = {
          name: this.tagName,
          blogPosts: this.blogPosts, // Ensure this is sent with the request
        };
        const response = await blogService.addTag(tag);
        this.successMessage = response.message;
        this.error = null;
        this.tagName = "";
        this.blogPosts = [];
        this.getAllTags(); // Reset the blogPosts array if needed
      } catch (err) {
        console.error("Error adding tag:", err); // Log error details
        this.error = err.message || "An error occurred";
        this.successMessage = null;
      }
    },

    async getAllTags() {
      try {
        const response = await blogService.getAll();
        this.tags = response;
      } catch (error) {
        this.error = error;
      }
    },

    showDialog(tag) {
      this.currentTag = { ...tag }; // Set current tag for editing
      this.visible = true;
    },
    async deleteTag(id) {
      try {
        const response = await blogService.deleteTag(id);
        this.getAllTags(); // Reloading the tags again
      } catch (error) {
        console.error("Error deleting tag:", error);
        this.error = error.message || "An error occurred";
      }
    },

    async updateTag() {
      try {
        await blogService.updateTag(this.currentTag);
        this.visible = false;
        this.getAllTags();
      } catch (error) {
        console.error(error);
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
