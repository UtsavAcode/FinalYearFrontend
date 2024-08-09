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

      <!-- <div class="form-group">
        <label for="slug">Slug</label>
        <input
          type="text"
          v-model="blogPost.Slug"
          id="slug"
          class="form-control"
          required
        />
      </div> -->

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

      <!-- <div class="form-group">
        <label for="keywords">Keywords</label>
        <input
          type="text"
          v-model="blogPost.Keywords"
          id="keywords"
          class="form-control"
        />
      </div> -->

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

      <!-- <div class="form-group">
        <label for="categories">Categories</label>
        <input
          type="text"
          v-model="blogPost.Categories"
          id="categories"
          class="form-control"
        />
      </div> -->

      <!-- <div class="form-group">
        <label for="visible">
          <input type="checkbox" v-model="blogPost.Visible" id="visible" />
          Make blog post visible
        </label>
      </div> -->
      <!-- 
      <div class="form-group">
        <label for="tags">Tags</label>
        <select
          multiple
          v-model="blogPost.TagIds"
          id="tags"
          class="form-control"
        >
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </div> -->
      <!-- 
      <div class="form-group">
        <label for="featuredImage">Featured Image</label>
        <input
          type="file"
          @change="handleImageUpload"
          id="featuredImage"
          class="form-control"
        />
      </div> -->

      <button type="submit" class="btn btn-primary">Add Blog Post</button>
    </form>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";

export default {
  name: "AddBlog",
  data() {
    return {
      Title: "",
      MetaDescription: "",
      Content: "",
      error: null,
      successMessage: null,
    };
  },

  methods: {
    async addBlogPost() {
      try {
        const blogPost = {
          Title: this.Title,
          MetaDescription: this.MetaDescription,
          Content: this.Content,
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
