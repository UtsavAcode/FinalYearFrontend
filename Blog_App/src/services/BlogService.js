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
};

export default blogService;
