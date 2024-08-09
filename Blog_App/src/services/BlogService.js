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
      const response = await apiClient.post("/Blog/AddBlogPost", blogPost);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
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
};

export default blogService;
