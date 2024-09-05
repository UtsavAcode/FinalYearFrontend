<template>
  <div class="container">
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
            <th>Meta</th>
            <th>Content</th>
            <th>Date</th>
            <th>Tags</th>
            <th>AuthorName</th>
            <th>AuthorId</th>
            <th>Utility</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="blog in blogs" :key="blog.id">
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
            <td>{{ blog.metaDescription }}</td>
            <td>{{ truncateContent(blog.content) }}</td>
            <td>{{ formatDate(blog.createdAt) }}</td>
            <td>{{ formatTags(blog.tags) }}</td>
            <td>{{ blog.authorName }}</td>
            <td>{{ truncateId(blog.authorId) }}</td>
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
                <div class="containeer-edit">
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
                    <label for="editMetaDescription" class="font-semibold w-25"
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

                  <div class="d-flex justify-content-center align-center gap-2">
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
</template>

<script>
import blogService from "../services/BlogService";

export default {
  name: "AllBlogs",
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
      editImageFile: null,
      editImagePreview: null,
    };
  },

  created() {
    this.getAllPosts();
    this.getAvailableTags();
  },

  methods: {
    async getAvailableTags() {
      try {
        const response = await blogService.getAll(); // Adjust to the correct method to fetch tags
        this.availableTags = response.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
        console.log("Available Tags:", this.availableTags); // Debug output
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    },

    async getAllPosts() {
      try {
        const response = await blogService.getAllBlog(); // Ensure this method returns blog posts
        this.blogs = response;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },

    async deletePost(id) {
      try {
        await blogService.deleteBlog(id);
        this.getAllPosts(); // Refresh the list
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

        console.log("Updating Blog Post with Data:", updatedBlogPost); // Debug output

        await blogService.updateBlogPost(updatedBlogPost);
        this.getAllPosts(); // Refresh the list
        this.visible = false;
      } catch (error) {
        console.error("Error updating blog post:", error);
        this.error = error.response?.data?.errors || "An error occurred";
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

    truncateContent(content) {
      if (!content) {
        return "No content";
      }
      return content.length > 10 ? content.substring(0, 10) + "..." : content;
    },

    truncateId(id) {
      if (!id) {
        return "NoId";
      }
      return id.length > 10 ? id.substring(0, 10) + "..." : id;
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
    handleEditImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editImageFile = file;
        this.editImagePreview = URL.createObjectURL(file);
      }
    },
  },
};
</script>
