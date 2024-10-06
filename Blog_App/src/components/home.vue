<template>
  <div>
    <!-- Display no result message -->
    <div v-if="filteredBlogs.length === 0" class="no-results">
      No blogs found for "{{ searchQuery }}".
    </div>

    <!-- Blog List -->
    <div
      v-else
      class="blogcontainer container p-2 m-1 mx-auto rounded d-flex justify-content-between border-bottom"
      v-for="blog in filteredBlogs"
      :key="blog.id"
    >
      <div class="blogsection">
        <h3>{{ blog.title }}</h3>
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
        <div style="height: 5rem">{{ blog.metaDescription }}</div>
        <div class="d-flex justify-content-between" style="margin-top: 1.5rem">
          <button
            class="btn btn-dark"
            @click="goToBlogDetail(blog)"
            style="width: 10rem"
          >
            Read
          </button>
          <div
            class="blog-stats d-flex justify-content-between"
            style="width: 10rem; margin-right: 6rem; font-size: 1.3em"
          >
            <div class="bi bi-heart">
              <span class="ps-2">{{ blog.likesCount }}</span>
            </div>
            <div class="bi bi-eye">
              <span class="ps-2">{{ blog.viewsCount }}</span>
            </div>
            <div class="bi bi-chat">
              <span class="ps-2">{{ blog.commentCount }}</span>
            </div>
          </div>
        </div>
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

    <!-- Pagination Controls -->
    <div class="pagination-controls" v-if="filteredBlogs.length > 0">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span class="page">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";

export default {
  name: "Home",
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      blogs: [],
      currentPage: 1,
      blogsPerPage: 10,
      likeCount: 0,
      commentCount: 0,
      viewsCOunt: 0,
    };
  },
  watch: {
    searchQuery(newQuery) {
      this.handleSearch(newQuery); // Filter blogs when search query changes
    },
  },
  created() {
    this.getAllPosts();
  },
  computed: {
    paginatedBlogs() {
      const start = (this.currentPage - 1) * this.blogsPerPage;
      const end = start + this.blogsPerPage;
      return this.blogs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.blogs.length / this.blogsPerPage);
    },
    filteredBlogs() {
      if (this.searchQuery) {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        return this.blogs.filter((blog) => {
          const titleMatch = blog.title.toLowerCase().includes(lowerCaseQuery);
          const authorMatch = blog.authorName
            .toLowerCase()
            .includes(lowerCaseQuery);

          // Check if any tag matches the query
          const tagsMatch = blog.tags.some((tag) =>
            tag.name.toLowerCase().includes(lowerCaseQuery)
          );

          return titleMatch || authorMatch || tagsMatch;
        });
      }
      return this.paginatedBlogs;
    },
  },
  methods: {
    async getAllPosts() {
      try {
        const response = await blogService.getAllBlog(); // Ensure this method returns blog posts
        this.blogs = await Promise.all(
          response.map(async (blog) => {
            const likes = await blogService.getLikesCount(blog.id);
            const viewResponse = await blogService.getViews(blog.id); // Fetch view data
            const totalViews = viewResponse.totalViews || 0; // Get total views, default to 0 if undefined
            const comments = await blogService.getComments(); // Fetch all comments
            const commentCount = comments.filter(
              (comment) => comment.blogPostId === blog.id
            ).length;

            return {
              ...blog,
              likesCount: likes,
              viewsCount: totalViews, // Only store the total views count
              commentCount: commentCount,
            };
          })
        );
        this.blogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // Sort by createdAt date
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    getImageUrl(path) {
      return `http://localhost:5254${path}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    handleSearch(query) {
      // Reset to first page after search
      this.currentPage = 1;
    },
    goToBlogDetail(blog) {
      this.$router.push(
        { path: `/userBlogDetail/${blog.id}` },
        { fromHomePage: true }
      );
    },
  },
};
</script>

<style>
.no-results {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: red;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
}

.pagination-controls button {
  margin: 0 5px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 0.5rem;
  background-color: black;
  color: white;
}

.page {
  margin: 10px 0 0 0;
}
</style>
