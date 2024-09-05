// src/services/blogService.js
import axios from "axios";
import authService from "./auth.servics";
import config from "primevue/config";

const apiClient = axios.create({
  baseURL: "http://localhost:5254/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const blogService = {
  async addTag(tag) {
    try {
      const response = await apiClient.post("/Tag/AddTag", tag);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get("/Tag/GetTags");
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async deleteTag(id) {
    try {
      const response = await apiClient.delete(`/Tag/Delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async updateTag(tag) {
    try {
      const response = await apiClient.put("/Tag/UpdateTag", tag);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async deleteBlog(id) {
    try {
      const response = await apiClient.delete(`/Blog/DeleteBlog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async addBlogPost(blogPost) {
    try {
      const formData = new FormData();
      formData.append("Title", blogPost.Title);
      formData.append("MetaDescription", blogPost.MetaDescription);
      formData.append("Content", blogPost.Content);
      formData.append("AuthorId", blogPost.AuthorId);
      formData.append("AuthorName", blogPost.AuthorName);

      if (blogPost.Image) {
        formData.append("Image", blogPost.Image);
      }
      if (blogPost.TagIds && blogPost.TagIds.length > 0) {
        blogPost.TagIds.forEach((tagId) => {
          formData.append("TagIds", tagId);
        });
      }
      const response = await apiClient.post("/Blog/AddBlogPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllBlog() {
    try {
      const response = await apiClient.get("/Blog/GetAllBlog");
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async uploadImage(formData) {
    try {
      const response = await apiClient.post("/Blog/UploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async updateBlogPost(blogPost) {
    try {
      const formData = new FormData();
      formData.append("Id", blogPost.id);
      formData.append("Title", blogPost.title); // Use `blogPost.title`
      formData.append("MetaDescription", blogPost.metaDescription); // Use `blogPost.metaDescription`
      formData.append("Content", blogPost.content); // Use `blogPost.content`
      formData.append("AuthorId", blogPost.authorId);
      formData.append("AuthorName", blogPost.authorName);

      if (blogPost.Image) {
        formData.append("Image", blogPost.Image);
      }

      blogPost.TagIds.forEach((tagId) => formData.append("TagIds", tagId)); // Handle multiple tags

      console.log("FormData Contents:", Array.from(formData.entries())); // Debug output

      const response = await apiClient.put(`/Blog/UpdateBlogPost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  async getBlogById(id) {
    try {
      const response = await apiClient.get(`/Blog/GetBlog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  
};

export default blogService;
