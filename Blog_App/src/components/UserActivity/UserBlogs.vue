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
            <img
              :src="getImageUrl(blog.featuredImagePath)"
              alt="featureimage"
            />
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
      } catch (error) {
        console.log("User dash fetch error blogs:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getImageUrl(path) {
      return `http://localhost:5254${path}`;
    },
  },

  computed: {
    ...mapGetters("auth", ["id"]),
    userBlogs() {
      const userId = String(this.id).replace(/"/g, "").trim();

      const filteredBlogs = this.blogs.filter((blog) => {
        const blogAuthorId = String(blog.authorId).trim();
        return blogAuthorId === userId;
      });

      return filteredBlogs;
    },
  },
};
</script>
