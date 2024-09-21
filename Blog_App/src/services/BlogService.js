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
  },
  async addLike(blogPostId) {
    try {
      const userId = authService.getId(); // Fetch the user ID from authService
      const likeData = {
        UserId: userId, // Make sure this is the correct property name
      };

      const response = await apiClient.post(
        `/Blog/${blogPostId}/like`,
        likeData
      );
      return response.data; // Ensure you return the right response structure
    } catch (error) {
      throw error.response?.data || error.message; // Error handling
    }
  },

  async getLikesCount(blogPostId) {
    const response = await apiClient.get(`/Blog/${blogPostId}/likesCount`);
    return response.data.likesCount; // Adjust according to your API response structure
  },
  async checkIfUserLiked(blogPostId) {
    const response = await apiClient.get(`/Blog/${blogPostId}/hasLiked`);
    return response.data.hasLiked; // Adjust according to your API response
  },
  async removeLike(blogPostId) {
    const response = await apiClient.delete(`/Blog/${blogPostId}/like`);
    return response.data; // Adjust according to your API response
  },

  async addComment(blogPostId, commentData) {
    try {
      console.log("Comment Data:", commentData);
      const response = await apiClient.post(
        `/Blog/${blogPostId}/comments`,
        commentData
      );

      return response.data; // Handle the response as needed
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error; // Handle the error as needed
    }
  },

  async updateComment(commentId, content) {
    try {
      const response = await apiClient.put(`/Blog/UpdateComment/${commentId}`, {
        Content: content,
      });
      return { isSuccess: true };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response.data || error.message,
      };
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await apiClient.delete(
        `/Blog/DeleteComment/${commentId}`
      );
      return { isSuccess: true };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response.data || error.message,
      };
    }
  },
  async getComments(blogId) {
    try {
      const response = await apiClient.get(`/Blog/${blogId}/comments`);
      return response.data; // Ensure this returns the comments array
    } catch (error) {
      throw error.response.data || error.message; // Proper error handling
    }
  },
};

export default blogService;
