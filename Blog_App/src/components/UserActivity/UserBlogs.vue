<template>
  <div>
    <div class="blog-list">
      <div
        v-for="blog in paginatedBlogs"
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
              <span
                class="badge bg-secondary ms-1"
                v-for="(tag, index) in blog.tags"
                :key="tag.id"
              >
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
          <RouterLink
            :to="`/userBlogPerformance/${blog.id}`"
            class="blog-utilities"
            title="statistics"
          >
            <i class="bi bi-clipboard2-data text-dark"></i>
          </RouterLink>
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
          <div class="blog-utilities confirmation-section mt-2" title="Publish">
            <label for="confirm-blog" class="form-check-label">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="blog.isConfirmed"
                @change="confirmBlog(blog)"
              />
            </label>
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

    <!-- Pagination Controls -->
    <div class="pagination mt-4">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </button>
      <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
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
      currentPage: 1, // Current page
      blogsPerPage: 10, // Number of blogs to display per page
    };
  },
  created() {
    this.fetchUserBlogs();
  },
  computed: {
    ...mapGetters("auth", ["id"]),
    userBlogs() {
      const userId = String(this.id).replace(/"/g, "").trim();

      return this.blogs.filter((blog) => {
        const blogAuthorId = String(blog.authorId).trim();
        return blogAuthorId === userId;
      });
    },
    paginatedBlogs() {
      // Calculate the start and end index for slicing the blogs array
      const start = (this.currentPage - 1) * this.blogsPerPage;
      const end = start + this.blogsPerPage;
      return this.userBlogs.slice(start, end); // Return only the sliced blogs
    },
    totalPages() {
      return Math.ceil(this.userBlogs.length / this.blogsPerPage); // Calculate total pages
    },
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
            const views = await blogService.getViews(blog.id);
            const comments = await blogService.getComments();
            const commentCount = comments.filter(
              (comment) => comment.blogPostId === blog.id
            ).length;

            // Ensure isConfirmed is properly initialized from the backend
            return {
              ...blog,
              likesCount: likes,
              viewsCount: views.totalViews || 0,
              commentCount: commentCount,
              isConfirmed: Boolean(blog.isConfirmed), // Explicitly convert to boolean
            };
          })
        );
      } catch (error) {
        console.error("Error fetching blogs:", error);
        this.$toastr.error("Failed to fetch blogs");
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
    async confirmBlog(blog) {
      try {
        const newStatus = !blog.isConfirmed;

        // Show loading state if you have one
        // this.$loading.show();

        // Make API call
        const response = await blogService.updateBlogConfirmation(
          blog.id,
          newStatus
        );

        // Update local state only if API call was successful
        if (response) {
          blog.isConfirmed = newStatus;
          this.$toastr.success(
            `Blog visibility ${newStatus ? "enabled" : "disabled"}`
          );

          // Optionally refresh the blogs list
          await this.fetchUserBlogs();
        }
      } catch (error) {
        console.error("Error updating blog confirmation:", error);
        this.$toastr.error("Failed to update blog visibility");

        // Revert checkbox state on error
        blog.isConfirmed = !blog.isConfirmed;
      } finally {
        // Hide loading state if you have one
        // this.$loading.hide();
      }
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
