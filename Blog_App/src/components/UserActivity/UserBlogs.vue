<template>
  <div>
    <div class="blog-list">
      <div
        v-for="blog in userBlogs"
        :key="blog.id"
        class="blog-panel d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center">
          <div
            class="image-section"
            @click="goToBlogDetails(blog.id)"
            title="Goto the blog"
          >
            <img
              :src="getImageUrl(blog.featuredImagePath)"
              alt="featureimage"
            />
          </div>
          <div class="blog-info-section ms-3 mt-3">
            <div
              @click="goToBlogDetails(blog.id)"
              class="blog-title"
              title="Goto the blog"
            >
              {{ blog.title }}
            </div>
            <div class="tags">
              <span class="badge bg-secondary ms-1" v-for="(tag, index) in blog.tags" :key="tag.id">
                {{ tag.name.trim()
                }}<span v-if="index < blog.tags.length - 1">, </span>
              </span>
            </div>
            <div class="date">{{ formatDate(blog.createdAt) }}</div>
            <div class="blog-stats">
              <i class="bi bi-heart"></i>
              <span class="ms-2 me-2">{{ blog.likesCount }}</span>
              <i class="bi bi-eye"></i>
              <span class="ms-2 me-2">{{ blog.viewsCount }} </span>
              <i class="bi bi-chat"></i>
              <span class="ms-2 me-2">{{ blog.commentCount }}</span>
            </div>
          </div>
        </div>
        <div
          class="utilities-section me-5 d-flex align-items-center justify-content-between"
        >
          <div
            class="blog-utilities"
            @click="showDialog(blog)"
            title="View Blog"
          >
            <i class="bi bi-eye" style="font-size: 1em"> </i>
          </div>
          <div class="blog-utilities" title="Edit" @click="editBlog(blog)">
            <i class="bi bi-pencil" style="font-size: 1em"></i>
          </div>
          <div
            class="blog-utilities"
            title="Delete"
            @click="deletePost(blog.id)"
          >
            <i class="bi bi-trash3" style="font-size: 1em"></i>
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
        const blogs = Array.isArray(response) ? response : [];

        // Map to include likes, views, and comments count
        this.blogs = await Promise.all(
          blogs.map(async (blog) => {
            const likes = await blogService.getLikesCount(blog.id);
            const views = await blogService.getViews(blog.id); // Ensure this returns the total view count
            const comments = await blogService.getComments(); // Fetch all comments
            const commentCount = comments.filter(
              (comment) => comment.blogPostId === blog.id
            ).length;

            return {
              ...blog,
              likesCount: likes,
              viewsCount: views.totalViews || 0, // Assuming views returns an object with totalViews property
              commentCount: commentCount,
            };
          })
        );
      } catch (error) {
        console.log("User dash fetch error blogs:", error);
      }
    },
    editBlog(blog) {
      this.$router.push({ path: `/edit-blog/${blog.id}` });
    },
    async deletePost(id) {
      try {
        await blogService.deleteBlog(id);
        this.fetchUserBlogs(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    goToBlogDetails(blogId) {
      this.$router.push({ path: `/userBlogDetail/${blogId}` });
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
<style>
.blog-title {
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-style: normal;
  width: 38rem;
}

.date {
  font-size: 0.8em;
  font-style: italic;
}
</style>
