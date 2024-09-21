<template>
  <div v-if="blog">
    <h1>{{ blog.title }}</h1>
    <div class="author-date">
      <span>By {{ blog.authorName }} on {{ formatDate(blog.createdAt) }}</span>
    </div>
    <!-- Blog Image -->
    <img
      v-if="blog.featuredImagePath"
      :src="getImageUrl(blog.featuredImagePath)"
      alt="Blog Image"
    />
    <p>{{ blog.content }}</p>

    <!-- Tags -->
    <div class="blogtags">
      <span v-for="tag in blog.tags" :key="tag.id" class="badge bg-secondary">
        {{ tag.name }}
      </span>
    </div>
  </div>
  <div v-else>Loading blog...</div>
</template>

<script>
import blogService from "@/services/BlogService";

export default {
  name: "UserBlogDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      blog: null,
      error: null,
    };
  },
  async created() {
    try {
      const response = await blogService.getBlogById(this.id);
      this.blog = response; // Assign the blog details
    } catch (error) {
      console.log("Error fetching blog details:", error);
      this.error = error.message;
    }
  },
  methods: {
    getImageUrl(path) {
      // Adjust to handle blogs without an image path
      return path ? `http://localhost:5254${path}` : "";
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

<style>
.author-date {
  margin-bottom: 10px;
}

.blogtags {
  margin-top: 20px;
}
</style>
