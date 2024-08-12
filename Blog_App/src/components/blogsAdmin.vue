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
            <td>{{ blog.authorId }}</td>
            <td>
              <button class="btn btn-dark" @click="showDialog(blog)">
                Edit
              </button>

              <Dialog
                v-model:visible="visible"
                header="Edit Blog"
                :style="{ width: '25rem' }"
              >
                <span class="text-surface-500 dark:text-surface-400 block mb-8">
                  Update the Blog.
                </span>

                <div class="flex items-center gap-4 mb-3">
                  <label for="name" class="font-semibold w-25">Title</label>
                  <InputText
                    id="name"
                    v-model="currentBlog.Title"
                    class="flex-auto"
                    autocomplete="off"
                  />
                </div>
                <div class="d-flex justify-content-center align-center gap-2">
                  <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="visible = false"
                  ></Button>
                  <Button type="button" label="Save" @click=""></Button>
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
      currentBlog: {}, // This should be initialized to an empty object or your default structure.
    };
  },

  created() {
    this.getAllPost();
  },

  methods: {
    async getAllPost() {
      try {
        const response = await blogService.getAllBlog();
        this.blogs = response.$values; // Correctly accessing the $values array in your response.
      } catch (error) {
        this.error = error;
      }
    },

    async deletePost(id) {
      try {
        const response = await blogService.deleteBlog(id);
        this.getAllPost();
      } catch (error) {
        this.error = error;
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
      if (tags && tags.$values) {
        return tags.$values.map((tag) => tag.name).join(", ");
      }
      return "No tags";
    },
    getImageUrl(path) {
      return `http://localhost:5254${path}`; // Ensure this URL matches your backend image URL.
    },
    truncateContent(content) {
      if (!content) {
        return "No content"; // Return a placeholder if content is undefined or empty
      }
      return content.length > 10 ? content.substring(0, 10) + "..." : content;
    },
    showDialog(blog) {
      this.currentBlog = { ...blog }; // Pass a copy of the blog to avoid unwanted mutations.
      this.visible = true;
    },
  },
};
</script>
