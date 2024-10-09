<template>
  <div class="container">
    <!-- Search Bar -->

    <div class="mb-3 p-2">
      <div class="filters d-flex gap-3 mb-3">
        <!-- Tags Filter -->
        <MultiSelect
          v-model="selectedTags"
          :options="availableTags"
          option-label="name"
          option-value="id"
          placeholder="Filter by Tags"
          display="chip"
          class="w-25"
        />

        <!-- Date Range Filter -->
        <div class="d-flex align-items-center gap-2">
          <span>From:</span>
          <Calendar
            v-model="fromDate"
            placeholder="Select Start Date"
            dateFormat="mm/dd/yy"
          />
        </div>
        <div class="d-flex align-items-center gap-2">
          <span>To:</span>
          <Calendar
            v-model="toDate"
            placeholder="Select End Date"
            dateFormat="mm/dd/yy"
          />
        </div>
        <input
          type="text"
          v-model="searchKeyword"
          @keyup.enter="filterBlogs"
          placeholder="Search"
          class="form-control w-25"
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
                    <span
                      class="text-surface-500 dark:text-surface-400 block mb-8"
                    >
                      Update the Blog.
                    </span>
                    <div class="flex items-center gap-4 mb-3">
                      <label for="editTitle" class="font-semibold w-25"
                        >Title</label
                      >
                      <InputText
                        id="editTitle"
                        v-model="currentBlog.title"
                        class="flex-auto"
                        autocomplete="off"
                        :style="{ width: '56.9rem' }"
                      />
                    </div>
                    <div class="flex items-center gap-4 mb-3">
                      <label
                        for="editMetaDescription"
                        class="font-semibold w-25"
                        >Meta Description</label
                      >
                      <textarea
                        id="editMetaDescription"
                        v-model="currentBlog.metaDescription"
                        class="flex-auto"
                        rows="3"
                        :style="{ width: '56.9rem' }"
                      ></textarea>
                    </div>
                    <div class="flex items-center gap-4 mb-3">
                      <label for="editContent" class="font-semibold w-25"
                        >Content</label
                      >
                      <textarea
                        id="editContent"
                        v-model="currentBlog.content"
                        class="flex-auto"
                        rows="5"
                        :style="{ width: '56.9rem' }"
                      ></textarea>
                    </div>
                    <div class="form-group mb-3">
                      <label for="editTags">Tags</label>
                      <MultiSelect
                        v-model="currentBlog.tags"
                        :options="availableTags"
                        option-label="name"
                        option-value="id"
                        placeholder="Select tags"
                        display="chip"
                        :style="{ width: '56.9rem' }"
                        class="w-full"
                        ref="multiSelect"
                      />
                    </div>
                    <div class="form-group">
                      <label for="editFeaturedImage">Featured Image</label>
                      <input
                        type="file"
                        @change="handleEditImageUpload"
                        id="editFeaturedImage"
                        class="form-control"
                      />
                      <div v-if="editImagePreview" class="mt-3">
                        <img
                          :src="editImagePreview"
                          alt="Image Preview"
                          class="img-fluid"
                        />
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-center align-center gap-2"
                    >
                      <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="visible = false"
                      ></Button>
                      <Button
                        type="button"
                        label="Save"
                        @click="updateBlogPost"
                      ></Button>
                    </div>
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
      selectedTags: [], // Holds the selected tags for filtering
      fromDate: null, // Holds the start date for filtering
      toDate: null,
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

    // Filter blogs based on the search keyword (title, date, authorName, or tags)
    filterBlogs() {
      this.filteredBlogs = this.blogs.filter((blog) => {
        const formattedDate = this.formatDate(blog.createdAt);
        const searchLower = this.searchKeyword.toLowerCase();
        const tagsString = blog.tags
          .map((tag) => tag.name.toLowerCase())
          .join(", ");

        const blogDate = new Date(blog.createdAt);
        const fromDate = this.fromDate ? new Date(this.fromDate) : null;
        const toDate = this.toDate ? new Date(this.toDate) : null;

        const matchesTags =
          this.selectedTags.length === 0 ||
          this.selectedTags.every((tagId) =>
            blog.tags.some((tag) => tag.id === tagId)
          );

        const matchesDateRange =
          (!fromDate || blogDate >= fromDate) &&
          (!toDate || blogDate <= toDate);

        return (
          (blog.title.toLowerCase().includes(searchLower) ||
            formattedDate.includes(searchLower) ||
            blog.authorName.toLowerCase().includes(searchLower) ||
            tagsString.includes(searchLower)) &&
          matchesTags &&
          matchesDateRange
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
      if (
        !this.searchKeyword &&
        !this.selectedTags.length &&
        !this.fromDate &&
        !this.toDate
      ) {
        return this.blogs; // Return all blogs if there's no search or filter criteria
      }
      return this.blogs.filter((blog) => {
        const formattedDate = this.formatDate(blog.createdAt);
        const searchLower = this.searchKeyword.toLowerCase();
        const tagsString = blog.tags
          .map((tag) => tag.name.toLowerCase())
          .join(", ");

        const blogDate = new Date(blog.createdAt);
        const fromDate = this.fromDate ? new Date(this.fromDate) : null;
        const toDate = this.toDate ? new Date(this.toDate) : null;

        const matchesTags =
          this.selectedTags.length === 0 ||
          this.selectedTags.every((tagId) =>
            blog.tags.some((tag) => tag.id === tagId)
          );

        const matchesDateRange =
          (!fromDate || blogDate >= fromDate) &&
          (!toDate || blogDate <= toDate);

        return (
          (blog.title.toLowerCase().includes(searchLower) ||
            formattedDate.includes(searchLower) ||
            blog.authorName.toLowerCase().includes(searchLower) ||
            tagsString.includes(searchLower)) &&
          matchesTags &&
          matchesDateRange
        );
      });
    },
  },
};
</script>
