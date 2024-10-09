<template>
  <div class="container">
    <!-- Search Bar -->
    <div class="mb-3">
      <input
        type="text"
        v-model="searchKeyword"
        @keyup.enter="filterBlogs"
        placeholder="Search by title or date (MM/DD/YYYY)"
        class="form-control"
      />
    </div>

    <div class="table-responsive">
      <table
        class="table table-striped table-hover text-center table-bordered"
        style="min-width: 1200px"
      >
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th>Image</th>
            <th scope="col">Title</th>
            <th>Date</th>
            <th>Tags</th>
            <th>Author Name</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Views</th>
            <th>Utility</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="blog in filteredBlogs" :key="blog.id">
            <td>{{ blog.id }}</td>
            <td>
              <img
                v-if="blog.featuredImagePath"
                :src="getImageUrl(blog.featuredImagePath)"
                alt="Featured Image"
                style="max-width: 100px"
              />
            </td>
            <td>{{ blog.title }}</td>
            <td>{{ formatDate(blog.createdAt) }}</td>
            <td>{{ formatTags(blog.tags) }}</td>
            <td>{{ blog.authorName }}</td>
            <td>{{ blog.likeCount }}</td>
            <td>{{ blog.commentCount }}</td>
            <td>{{ blog.viewCount }}</td>
            <td>
              <button class="btn btn-dark" @click="showDialog(blog)">
                Edit
              </button>
              <Dialog
                v-model:visible="visible"
                header="Edit Blog"
                :style="{ width: '60.5rem' }"
                class="container"
              >
                <div class="container-edit">
                  <!-- Edit form content omitted for brevity -->
                </div>
              </Dialog>
              <button
                class="btn btn-danger px-1 ms-1"
                @click="deletePost(blog.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import blogService from "../services/BlogService";

export default {
  name: "AllBlogs",
  data() {
    return {
      blogs: [],
      visible: false,
      searchKeyword: "", // Holds the search input
      currentBlog: {
        id: null,
        title: "",
        metaDescription: "",
        content: "",
        authorId: "",
        authorName: "",
        featuredImagePath: "",
        tags: [],
        likeCount: 0,
        commentCount: 0,
        viewCount: 0,
      },
      editImageFile: null,
      editImagePreview: null,
      availableTags: [],
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
        this.availableTags = response.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    },

    async getAllPosts() {
      try {
        const response = await blogService.getAllBlog();
        this.blogs = await Promise.all(
          response.map(async (blog) => {
            const likes = await blogService.getLikesCount(blog.id);
            const viewsResponse = await blogService.getViews(blog.id);
            const comments = await blogService.getComments();
            const commentCount = comments.filter(
              (comment) => comment.blogPostId === blog.id
            ).length;

            return {
              ...blog,
              likeCount: likes,
              viewCount: viewsResponse.totalViews,
              commentCount: commentCount,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },

    // Filter blogs based on the search keyword
    filterBlogs() {
      this.filteredBlogs = this.blogs.filter((blog) => {
        const formattedDate = this.formatDate(blog.createdAt);
        const searchLower = this.searchKeyword.toLowerCase();

        return (
          blog.title.toLowerCase().includes(searchLower) ||
          formattedDate.includes(searchLower)
        );
      });
    },

    async deletePost(id) {
      try {
        await blogService.deleteBlog(id);
        this.getAllPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },

    async updateBlogPost() {
      try {
        const tagIdsArray = this.currentBlog.tags.map((tag) =>
          parseInt(tag.id, 10)
        );

        const updatedBlogPost = {
          ...this.currentBlog,
          Image: this.editImageFile,
          TagIds: tagIdsArray,
        };

        await blogService.updateBlogPost(updatedBlogPost);
        this.getAllPosts();
        this.visible = false;
      } catch (error) {
        console.error("Error updating blog post:", error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },

    formatTags(tags) {
      if (tags && Array.isArray(tags)) {
        return tags.map((tag) => tag.name).join(", ");
      }
      return "No tags";
    },

    getImageUrl(path) {
      return `http://localhost:5254${path}`;
    },

    showDialog(blog) {
      this.currentBlog = { ...blog };
      this.editImageFile = null;
      this.editImagePreview = this.getImageUrl(blog.featuredImagePath);
      this.currentBlog.tags = blog.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));
      this.visible = true;
    },

    handleEditImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editImageFile = file;
        this.editImagePreview = URL.createObjectURL(file);
      }
    },
  },

  computed: {
    filteredBlogs() {
      if (!this.searchKeyword) {
        return this.blogs; // Return all blogs if there's no search keyword
      }
      return this.blogs.filter((blog) => {
        const formattedDate = this.formatDate(blog.createdAt);
        const searchLower = this.searchKeyword.toLowerCase();

        return (
          blog.title.toLowerCase().includes(searchLower) ||
          formattedDate.includes(searchLower)
        );
      });
    },
  },
};
</script>
