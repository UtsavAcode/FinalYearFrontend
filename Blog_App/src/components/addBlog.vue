<template>
  <div class="add-blog-post">
    <h2>Add New Blog Post</h2>

    <form @submit.prevent="addBlogPost">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          v-model="Title"
          id="title"
          class="form-control"
          required
        />
        <div v-if="error?.Title" class="text-danger">
          {{ error.Title[0] }}
        </div>
      </div>

      <div class="form-group">
        <label for="metaDescription">Meta Description</label>
        <textarea
          v-model="MetaDescription"
          id="metaDescription"
          class="form-control"
          rows="3"
        ></textarea>
        <div v-if="error?.MetaDescription" class="text-danger">
          {{ error.MetaDescription[0] }}
        </div>
      </div>

      <div class="form-group">
        <label for="content">Content</label>
        <textarea
          v-model="Content"
          id="content"
          class="form-control"
          rows="5"
          required
        ></textarea>
        <div v-if="error?.Content" class="text-danger">
          {{ error.Content[0] }}
        </div>
      </div>

      <div class="form-group">
        <label for="featuredImage">Featured Image</label>
        <input
          type="file"
          @change="handleImageUpload"
          id="featuredImage"
          class="form-control"
        />
        <div v-if="imagePreview" class="mt-3">
          <img :src="imagePreview" alt="Image Preview" class="img-fluid" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Add Blog Post</button>
    </form>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
import { mapGetters } from "vuex";

export default {
  name: "AddBlog",
  data() {
    return {
      Title: "",
      MetaDescription: "",
      Content: "",
      imageFile: null,
      imagePreview: null,
      error: null,
      successMessage: null,
    };
  },

  computed: {
    ...mapGetters("auth", ["name", "id"]),
  },

  methods: {
    async addBlogPost() {
      try {
        const blogPost = {
          Title: this.Title,
          MetaDescription: this.MetaDescription,
          Content: this.Content,
          AuthorId: this.id.replace(/"/g, ""), // Ensure UUID is correctly formatted
          AuthorName: this.name,
          Image: this.imageFile,
        };

        const response = await blogService.addBlogPost(blogPost);
        this.successMessage = response.message;
        this.error = null;
      } catch (err) {
        console.error("Error while adding blog:", err);
        this.error = err.response?.data?.errors || "An error occurred";
        this.successMessage = null;
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
  },
};
</script>

<style scoped>
.add-blog-post {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 15px;
}
</style>
