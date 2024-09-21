<template>
  <div class="container" v-if="blog" style="width: 80%">
    <h1 class="" style="margin: auto; width: 55rem">{{ blog.title }}</h1>
    <div
      class="author-date d-flex justify-content-between"
      style="width: 59rem; margin-left: 9rem; font-size: 1em;"
    >
      <div>By: {{ blog.authorName }}</div>
      <div>{{ formatDate(blog.createdAt) }}</div>
    </div>
    <!-- Tags -->
    <div class="blogtags" style="width: 59rem; margin-left: 10rem">
      <span v-for="tag in blog.tags" :key="tag.id" class="badge bg-secondary">
        {{ tag.name }}
      </span>
    </div>
    <!-- Blog Image -->
    <div class="blogdetail-image">
      <img
        v-if="blog.featuredImagePath"
        :src="getImageUrl(blog.featuredImagePath)"
        alt="Blog Image"
      />
    </div>

    <!-- content section -->
    <div class="container" v-html="blog.content" style="width: 80%"></div>
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
