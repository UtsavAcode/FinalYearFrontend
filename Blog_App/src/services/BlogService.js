// src/services/blogService.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5254/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
};

export default blogService;
