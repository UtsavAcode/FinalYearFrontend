<template>
  <div>
    <h1>Edit Blog</h1>
    <form @submit.prevent="updateBlogPost" style="width: 90%">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          v-model="blog.title"
          id="title"
          class="form-control"
          required
        />
        <div v-if="error?.Title" class="text-danger">{{ error.Title[0] }}</div>
      </div>

      <div class="form-group mt-2">
        <label for="metaDescription">Meta Description</label>
        <textarea
          v-model="blog.metaDescription"
          id="metaDescription"
          class="form-control"
          rows="3"
        ></textarea>
        <div v-if="error?.MetaDescription" class="text-danger">
          {{ error.MetaDescription[0] }}
        </div>
      </div>

      <div id="app">
        <froala
          id="edit"
          :tag="'textarea'"
          :config="config"
          v-model:value="blog.content"
        ></froala>
      </div>

      <div class="form-group" style="height:20rem; width:20rem;">
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

      <div class="form-group mt-2">
        <label for="tags">Tags</label>
        <MultiSelect
          v-model="blog.selectedTags"
          :options="tags"
          optionLabel="name"
          placeholder="Select Tags"
          display="chip"
          class="form-control"
          filter
          filterPlaceholder="Search Tags"
        />
      </div>
      <button type="submit" class="btn btn-dark mt-3">Update</button>
    </form>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import blogService from "@/services/BlogService";
import toastr from "toastr"; // Import Toastr

export default {
  name: "EditBlog",
  data() {
    return {
      blog: {
        id: null,
        title: "",
        metaDescription: "",
        content: "",
        selectedTags: [],
        featuredImagePath: "",
      },
      tags: [],
      imageFile: null,
      imagePreview: null,
      error: null,
      successMessage: null,
    };
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    return { route, router };
  },
  async created() {
    const blogId = this.route.params.id;
    try {
      const response = await blogService.getBlogById(blogId);
      this.blog = response;
      this.blog.selectedTags = response.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));
      this.imagePreview = this.getImageUrl(response.featuredImagePath);
      this.tags = await blogService.getAll(); // Load tags
    } catch (error) {
      console.log("Error fetching blog details:", error);
      this.error = error.message;
    }
  },
  methods: {
    async updateBlogPost() {
      try {
        const tagIdsArray = this.blog.selectedTags.map((tag) => tag.id);

        const updatedBlogPost = {
          ...this.blog,
          featuredImagePath: this.imageFile, // Ensure correct property name
          TagIds: tagIdsArray,
        };

        await blogService.updateBlogPost(updatedBlogPost);
        toastr.success("Blog updated successfully!"); // Show success message
        // Optionally redirect or clear form after success
        // this.router.push('/path/to/redirect'); // Uncomment to redirect
      } catch (error) {
        console.error("Error updating blog post:", error);
        toastr.error(error.response?.data?.errors || "An error occurred"); // Show error message
        this.error = error.response?.data?.errors || "An error occurred";
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    getImageUrl(path) {
      return `http://localhost:5254${path}`;
    },
  },
};
</script>

<style>
/* You may need to add custom styles for Toastr */
</style>
