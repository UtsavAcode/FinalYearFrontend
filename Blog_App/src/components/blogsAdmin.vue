<template>
  <div class="container"> 
    <table class="table table-striped table-hover text-center table-bordered">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Title</th>
          <th>Meta</th>
          <th>Content</th>
          <th>Utility</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="blog in blogs" :key="blog.id">
          <td>{{ blog.id }}</td>
          <td>{{ blog.title }}</td>
          <td>{{ blog.metaDescription }}</td>
          <td>{{ blog.content }}</td>

          <td>
            <button class="btn btn-dark" @click="showDialog(blog)">Edit</button>

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
</template>

<script>
import blogService from "../services/BlogService";

export default {
  name: "AllBlogs",
  data() {
    return {
      blogs: [],
      visible: false,
      //currentBlog: {},
    };
  },

  created() {
    this.getAllPost();
  },

  methods: {
    async getAllPost() {
      try {
        const response = await blogService.getAllBlog();
        this.blogs = response;
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
  },
};
</script>
