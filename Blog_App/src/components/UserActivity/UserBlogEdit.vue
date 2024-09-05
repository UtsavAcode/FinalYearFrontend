<template>
    <div>
      <h1>Edit Blog</h1>
      <form @submit.prevent="updateBlog">
        <div>
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="blog.title" required />
        </div>
        <div>
          <label for="content">Content:</label>
          <textarea id="content" v-model="blog.content" required></textarea>
        </div>
        <div>
          <label for="image">Image:</label>
          <input type="file" @change="handleImageUpload" />
          <img :src="imagePreview" v-if="imagePreview" alt="Blog Image Preview" />
        </div>
        <button type="submit">Update Blog</button>
      </form>
    </div>
  </template>
  
  <script>
  import { useRoute, useRouter } from 'vue-router';
  import blogService from '@/services/BlogService';
  
  export default {
    name: "EditBlog",
    data() {
      return {
        blog: {
          id: null,
          title: "",
          content: "",
          featuredImagePath: "",
        },
        imageFile: null,
        imagePreview: null,
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
        this.imagePreview = this.getImageUrl(response.featuredImagePath);
      } catch (error) {
        console.log("Error fetching blog details:", error);
      }
    },
    methods: {
      async updateBlog() {
        try {
          const formData = new FormData();
          formData.append('title', this.blog.title);
          formData.append('content', this.blog.content);
          if (this.imageFile) {
            formData.append('image', this.imageFile);
          }
  
          await blogService.updateBlog(this.blog.id, formData);
          this.$router.push('/user-blogs');
        } catch (error) {
          console.log("Error updating blog:", error);
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
  