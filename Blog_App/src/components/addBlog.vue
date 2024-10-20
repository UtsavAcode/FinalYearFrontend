<template>
  <div class="add-blog-post">
    <form @submit.prevent="addBlogPost" style="width: 90%">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          v-model="Title"
          id="title"
          class="form-control"
          required
        />
        <div v-if="error?.Title" class="text-danger">
          {{ error.Title[0] }}
        </div>
      </div>

      <div class="form-group">
        <label for="metaDescription">Meta Description</label>
        <textarea
          v-model="MetaDescription"
          id="metaDescription"
          class="form-control"
          rows="3"
          maxlength="500"
        ></textarea>
        <div v-if="error?.MetaDescription" class="text-danger">
          {{ error.MetaDescription[0] }}
        </div>
        <div class="text-danger" v-if="metaDescriptionLengthExceeded">
          Meta description cannot exceed 500 characters. You have used
          {{ MetaDescription.length }} characters.
        </div>
      </div>

      <div id="app">
        <froala
          id="edit"
          :tag="'textarea'"
          :config="config"
          v-model:value="Content"
          style="height: 30rem"
        ></froala>
      </div>
      
      <div class="form-group">
        <div  v-if="imagePreview" class=" image-area mt-3">
          <img :src="imagePreview" alt="Image Preview" class="img-fluid" />
        </div>
        <div class="btn btn-dark btn-rounded mt-3">
          <label for="featuredImage">Featured Image</label>
          <input
            type="file"
            @change="handleImageUpload"
            id="featuredImage"
            class="form-control d-none"
            onchange="displaySelectedImage(event, 'selectedImage')"
          />
        </div>

      
      </div>

      <div class="form-group">
        <label for="tags">Tags</label>
        <MultiSelect
          v-model="selectedTags"
          :options="tags"
          optionLabel="name"
          placeholder="Select Tags"
          display="chip"
          class="form-control"
          filter
          filterPlaceholder="Search Tags"
          style="height: 3rem"
        />
      </div>

      <button
        type="submit"
        class="btn btn-dark"
        :disabled="metaDescriptionLengthExceeded"
      >
        Add Blog Post
      </button>
    </form>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
import { mapGetters } from "vuex";

export default {
  name: "AddBlog",
  data() {
    return {
      Title: "",
      MetaDescription: "",
      Content: "",
      imageFile: null,
      imagePreview: null,
      error: null,
      tags: [],
      selectedTags: [],
      config: {
        placeholderText: "Start typing your content here...",
        charCounterCount: true,
        heightMin: 300, // Minimum height in pixels
        heightMax: 600, // Maximum height in pixels (optional)
      },
    };
  },

  computed: {
    ...mapGetters("auth", ["name", "id"]),
    metaDescriptionLengthExceeded() {
      return this.MetaDescription.length > 500;
    },
  },

  watch: {
    MetaDescription(newValue) {
      if (newValue.length > 500) {
        this.error = {
          MetaDescription: ["Meta description cannot exceed 500 characters."],
        };
      } else {
        this.error = null; // Clear error if within limit
      }
    },
    selectedTags(newValue) {
      if (newValue.length > 5) {
        this.selectedTags.pop(); // Prevent adding more than 5 tags
        this.$toastr.warning("You can only select up to 5 tags", "Warning");
      }
    },
  },

  async created() {
    try {
      const response = await blogService.getAll();
      if (Array.isArray(response)) {
        this.tags = response;
      } else {
        console.error("Unexpected response format:", response);
        this.tags = [];
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
      this.tags = [];
    }
  },

  methods: {
    async addBlogPost() {
      if (this.metaDescriptionLengthExceeded) {
        return; // Prevent submission if validation fails
      }

      try {
        const tagIdsArray = this.selectedTags.map((tag) =>
          parseInt(tag.id, 10)
        );

        const blogPost = {
          Title: this.Title,
          MetaDescription: this.MetaDescription,
          Content: this.Content,
          AuthorId: this.id.replace(/"/g, ""),
          AuthorName: this.name,
          Image: this.imageFile,
          TagIds: tagIdsArray,
        };

        const response = await blogService.addBlogPost(blogPost);
        this.successMessage = response.message;
        this.error = null;

        // Use Toastr to show success message
        this.$toastr.success(response.message, "Success");
      } catch (err) {
        console.error("Error while adding blog:", err);
        this.error = err.response?.data?.errors || "An error occurred";

        // Use Toastr to show error message
        this.$toastr.error(this.error, "Error");
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    displaySelectedImage(event, elementId) {
      const selectedImage = document.getElementById(elementId);
      const fileInput = event.target;

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          selectedImage.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
      }
    },
  },
};
</script>

<style scoped>
.add-blog-post {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 90%;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.image-area{
  height:12rem;
  width:12rem;
}
</style>
