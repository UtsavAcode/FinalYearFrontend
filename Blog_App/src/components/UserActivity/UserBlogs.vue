<template>
  <div>
    User Blogs
    <div class="blog-list">
      <div
        v-for="blog in userBlogs"
        :key="blog.id"
        class="blog-panel d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center">
          <div class="image-section">
            <img :src="blog.featuredImagePath" alt="featureimage" />
          </div>
          <div class="blog-info-section ms-3 mt-3">
            <p>{{ blog.title }}</p>
            <p class="text-gray">{{ formatDate(blog.createdAt) }}</p>
          </div>
        </div>
        <div
          class="utilities-section me-5 d-flex align-items-center justify-content-between w-25"
        >
          <p>del</p>
          <p>view</p>
          <p>edit</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
import { mapGetters } from "vuex";

export default {
  name: "UserBlogs",
  data() {
    return {
      blogs: [],
    };
  },
  created() {
    this.fetchUserBlogs();
  },
  methods: {
    async fetchUserBlogs() {
      try {
        const response = await blogService.getAllBlog();
        this.blogs = Array.isArray(response) ? response : [];
        console.log("Blogs array after fetch:", this.blogs);

        // Optional: Check the structure of the first blog
        if (this.blogs.length > 0) {
          console.log("First blog object:", this.blogs[0]);
          console.log("First blog's authorId:", String(this.blogs[0].authorId));
        }
      } catch (error) {
        console.log("User dash fetch error blogs:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },

  computed: {
    ...mapGetters("auth", ["id"]),
    userBlogs() {
      const userId = String(this.id).replace(/"/g, "").trim(); // Ensure userId is a string
      console.log("User ID:", userId);

      // Log each blog's authorId to verify
      this.blogs.forEach((blog) => {
        console.log("Blog ID:", blog.id);
        console.log("Blog Author ID:", String(blog.authorId).trim()); // Ensure authorId is a string and remove extra spaces
      });

      // Filter blogs by authorId
      const filteredBlogs = this.blogs.filter((blog) => {
        const blogAuthorId = String(blog.authorId).trim(); // Convert authorId to a string and remove extra spaces
        return blogAuthorId === userId;
      });

      console.log("Filtered blogs", filteredBlogs);
      return filteredBlogs;
    },
  },
};
</script>
