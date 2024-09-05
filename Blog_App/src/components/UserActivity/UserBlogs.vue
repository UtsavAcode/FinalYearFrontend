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
          class="utilities-section me-5 d-flex align-items-center justify-content-between"
        >
          <div class="blog-utilities" @click="showDialog(blog)" title="View Blog"> 
            <i class="bi bi-eye" style="font-size: 1.5em"> </i>
          </div>
          <div class="blog-utilities" title="Edit" @click="editBlog(blog)">
            <i class="bi bi-pencil" style="font-size: 1.5em"></i>
          </div>
          <div class="blog-utilities" title="Delete">
            <i class="bi bi-trash3" style="font-size: 1.5em"></i>
          </div>
        </div>
      </div>
      <Dialog
        v-model:visible="visible"
        header=""
        :style="{ width: '60.5rem' }"
        class="container"
      >
        <div class="mb-3">
          <h1>{{ currentBlog.title }}</h1>
        </div>
        <div v-html="currentBlog.content"></div>
      </Dialog>
    </div>
  </div>


</template>

<script>
import blogService from "@/services/BlogService";
import { RouterLink } from "vue-router";
import { mapGetters } from "vuex";

export default {
  name: "UserBlogs",
  data() {
    return {
      blogs: [],
      visible: false,
      currentBlog: {
        id: null,
        title: "",
        metaDescription: "",
        content: "",
        authorId: "",
        authorName: "",
        featuredImagePath: "",
        tags: [],
      },
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
    editBlog(blog) {
      this.$router.push({ path: `/edit-blog/${blog.id}` });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getImageUrl(path) {
      return `http://localhost:5254${path}`;
    },
    showDialog(blog) {
      // Make sure to correctly copy the blog object
      this.currentBlog = { ...blog };
      this.editImageFile = null;
      this.editImagePreview = this.getImageUrl(blog.featuredImagePath);

      // Ensure `currentBlog.tags` is correctly formatted
      this.currentBlog.tags = blog.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));

      console.log("Selected Blog for Editing:", this.currentBlog); // Debug output

      this.visible = true;
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
