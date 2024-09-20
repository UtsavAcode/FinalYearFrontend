<template>
  <div
    class="blogcontainer container p-2 m-1 mx-auto rounded d-flex justify-content-between border-bottom"
    v-for="blog in blogs"
    :key="blog.id"
  >
    <div class="blogsection">
      <h3 class="">{{ blog.title }}</h3>
      <div class="author-date d-flex justify-content-between">
        <span>{{ blog.authorName }}</span>
        <span class="me-4">{{ formatDate(blog.createdAt) }}</span>
      </div>
      <div class="blogtags container pb-2 d-flex flex-wrap">
        <span
          class="badge bg-secondary me-1"
          v-for="tag in blog.tags"
          :key="tag.id"
        >
          {{ tag.name }}
        </span>
      </div>
      <p>{{ blog.metaDescription }}</p>
    </div>
    <div class="imagesection rounded">
      <img
        v-if="blog.featuredImagePath"
        :src="getImageUrl(blog.featuredImagePath)"
        alt="Featured Image"
        class="rounded"
      />
    </div>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
export default {
  name: "Home",
  data() {
    return {
      blogs: [],
      tags: [],
    };
  },

  created() {
    this.getAllPosts();
    this.getAvailableTags();
  },

  methods: {
    async getAvailableTags() {
      try {
        const response = await blogService.getAll();
        this.getAvailableTags = response.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
      } catch (error) {
        console.error("Error Fetching the the tags");
      }
    },

    async getAllPosts() {
      try {
        const response = await blogService.getAllBlog(); // Ensure this method returns blog posts
        // Sort the blogs by createdAt in descending order
        this.blogs = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    getImageUrl(path) {
      return `http://localhost:5254${path}`;
    },
    formatTags(tags) {
      if (tags && Array.isArray(tags)) {
        return tags.map((tag) => tag.name).join(", ");
      }
      return "No tags";
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
};
</script>
