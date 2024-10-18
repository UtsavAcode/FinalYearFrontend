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
      const userId = authService.getId();
      const likeData = {
        UserId: userId,
      };

      const response = await apiClient.post(
        `/Blog/${blogPostId}/like`,
        likeData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
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
      const userId = authService.getId();
      const userName = authService.getName();
      const updatedCommentData = {
        ...commentData,
        userId: userId,
        userName: userName,
      };
      console.log("UserId:", userId, "UserName:", userName);
      console.log("Updated Comment Data:", updatedCommentData);

      // Make the API call to add the comment to the specified blog post
      const response = await apiClient.post(
        `/Blog/${blogPostId}/comments`,
        updatedCommentData
      );

      return response.data; // Return the API response data (e.g., the newly created comment)
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error.response?.data || error.message; // Proper error handling
    }
  },

  async updateComment(comment) {
    try {
      const response = await apiClient.put("/Blog/updateComment", comment);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await apiClient.delete(`/Blog/Delete/${commentId}`);
      return response.data;
    } catch (error) {
      return {
        message: error.response.data || error.message,
      };
    }
  },
  async getComments() {
    //Getting all comments for now
    try {
      const response = await apiClient.get(`/Blog/GetComments`);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  async addView(payload) {
    try {
      // Log the payload to confirm its structure
      console.log("Payload being sent:", payload);

      const response = await apiClient.post(
        `/Blog/${payload.blogPostId}/registerView`,
        {
          userId: payload.userId,
          ipAddress: payload.ipAddress,
          userAgent: payload.userAgent,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in addView:", error); // Log the error for debugging
      throw error.response?.data || error.message; // Return the error response or message
    }
  },
  async getViews(blogPostId) {
    try {
      const response = await apiClient.get(`/Blog/GetViews/${blogPostId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllViews(blogPostIds) {
    try {
      // Construct the query string for multiple IDs
      const params = blogPostIds.map((id) => `blogPostIds=${id}`).join("&");
      const response = await apiClient.get(`/Blog/GetAllViews?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async sendReadingData(payload) {
    try {
      // Format the payload to match the API expectations
      const formattedPayload = {
        blogPostId: payload.blogPostId,
        userId: payload.userId,
        readingTime: Math.round(payload.readingTime),
        scrollPositions: payload.scrollPositions.map((position) =>
          parseFloat(position.toFixed(2))
        ),
      };

      console.log("Sending Reading Data Payload:", formattedPayload);

      const response = await apiClient.post("/api/Blog/Send", formattedPayload);
      return response.data;
    } catch (error) {
      console.error("Error sending reading data:", error);
      throw error;
    }
  },
};

export default blogService;
