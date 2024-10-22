<template>
  <div>
    <div class="tag-filter-wrapper">
      <!-- Left arrow to scroll tags left -->
      <button class="scroll-btn left-btn" @click="scrollLeft">
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- Tag Filter Bar (scrollable container) -->
      <div
        class="tag-filter-bar container d-flex flex-nowrap align-items-center"
      >
        <button
          class="btn btn-outline-secondary me-2"
          :class="{ active: selectedTag === null }"
          @click="selectTag(null)"
        >
          All
        </button>
        <button
          class="tags-choose btn me-2"
          v-for="tag in allTags"
          :key="tag.id"
          :class="{ active: selectedTag === tag.name }"
          @click="selectTag(tag.name)"
        >
          {{ tag.name }}
        </button>
      </div>

      <!-- Right arrow to scroll tags right -->
      <button class="scroll-btn right-btn" @click="scrollRight">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <!-- Display Loading message while fetching blogs -->
    <div v-if="loading" class="loading-message">Loading...</div>

    <!-- Display no result message -->
    <div v-else-if="filteredBlogs.length === 0" class="no-results">
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
      allTags: [], // Store all tags
      selectedTag: null, // Store the selected tag
      currentPage: 1,
      blogsPerPage: 10,
      loading: true,
      likeCount: 0,
      commentCount: 0,
      viewsCount: 0,
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
      let filtered = this.blogs.filter((blog) => blog.isConfirmed);

      // Filter by search query
      if (this.searchQuery) {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        filtered = filtered.filter((blog) => {
          const titleMatch = blog.title.toLowerCase().includes(lowerCaseQuery);
          const authorMatch = blog.authorName
            .toLowerCase()
            .includes(lowerCaseQuery);
          const tagsMatch = blog.tags.some((tag) =>
            tag.name.toLowerCase().includes(lowerCaseQuery)
          );
          return titleMatch || authorMatch || tagsMatch;
        });
      }

      // Filter by selected tag
      if (this.selectedTag !== null) {
        filtered = filtered.filter((blog) =>
          blog.tags.some((tag) => tag.name === this.selectedTag)
        );
      }

      return filtered.slice(
        (this.currentPage - 1) * this.blogsPerPage,
        this.currentPage * this.blogsPerPage
      );
    },
  },
  methods: {
    async getAllPosts() {
      this.loading = true;
      try {
        const response = await blogService.getAllBlog();
        this.blogs = await Promise.all(
          response.map(async (blog) => {
            const likes = await blogService.getLikesCount(blog.id);
            const viewResponse = await blogService.getViews(blog.id);
            const totalViews = viewResponse.totalViews || 0;
            const comments = await blogService.getComments();
            const commentCount = comments.filter(
              (comment) => comment.blogPostId === blog.id
            ).length;

            return {
              ...blog,
              likesCount: likes,
              viewsCount: totalViews,
              commentCount: commentCount,
            };
          })
        );
        this.allTags = this.extractUniqueTags(this.blogs);
        this.blogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        this.loading = false;
      }
    },
    extractUniqueTags(blogs) {
      const tagMap = new Map();

      blogs.forEach((blog) => {
        blog.tags.forEach((tag) => {
          if (!tagMap.has(tag.name)) {
            tagMap.set(tag.name, tag); // Add the tag if it doesn't exist in the map
          }
        });
      });

      return Array.from(tagMap.values()); // Convert the map back to an array
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
      this.currentPage = 1;
    },
    goToBlogDetail(blog) {
      this.$router.push(
        { path: `/userBlogDetail/${blog.id}` },
        { fromHomePage: true }
      );
    },
    selectTag(tag) {
      this.selectedTag = tag;
      this.currentPage = 1; // Reset to the first page
    },
    scrollLeft() {
      const container = this.$refs.tagFilterBar;
      container.scrollBy({ left: -200, behavior: "smooth" });
    },
    scrollRight() {
      const container = this.$refs.tagFilterBar;
      container.scrollBy({ left: 200, behavior: "smooth" });
    },
  },
};
</script>

<style>
.loading-message {
  text-align: center;
  font-size: 1.5rem;
  padding: 20px;
  font-weight: bold;
}

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

.tag-filter-bar {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.tag-filter-bar .btn {
  margin: 0.2rem;
}

.tag-filter-bar .btn.active {
  background-color: #000;
  color: #fff;
}

.tag-filter-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.tag-filter-bar {
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  flex-grow: 1;
  max-width: 70%; /* Adjust width to fit page layout */
}

.scroll-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.scroll-btn.left-btn {
  position: absolute;
  left: 4rem;
}

.scroll-btn.right-btn {
  position: absolute;
  right: 5rem;
}
</style>
