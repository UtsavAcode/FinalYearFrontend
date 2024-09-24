<template>
  <div class="container" v-if="blog" style="width: 80%">
    <h1 class="" style="margin: auto; width: 55rem">{{ blog.title }}</h1>
    <div
      class="author-date d-flex justify-content-between"
      style="width: 59rem; margin-left: 9rem; font-size: 1em"
    >
      <div>By: {{ blog.authorName }}</div>
      <div>{{ formatDate(blog.createdAt) }}</div>
    </div>
    <!-- Tags -->
    <div class="blogtags" style="width: 59rem; margin-left: 10rem">
      <span v-for="tag in blog.tags" :key="tag.id" class="badge bg-secondary">
        {{ tag.name }}
      </span>
    </div>
    <div class="likes">
      <i
        :class="[hasLiked ? 'bi-heart-fill' : 'bi-heart']"
        @click="likeBlog"
      ></i>
      <span class="ms-2">{{ likesCount }} Likes</span>
    </div>

    <!-- Blog Image -->
    <div class="blogdetail-image">
      <img
        v-if="blog.featuredImagePath"
        :src="getImageUrl(blog.featuredImagePath)"
        alt="Blog Image"
      />
    </div>

    <!-- content section -->
    <div class="container" v-html="blog.content" style="width: 80%"></div>

    <div>
      <h2>Comments</h2>
      <ul v-if="comments.length">
        <li v-for="comment in comments" :key="comment.id">
          <strong>{{ comment.userName }}:</strong> {{ comment.content }}
        </li>
      </ul>
      <p v-else>No comments yet.</p>
      <form @submit.prevent="addComment">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>

  <div v-else>Loading blog...</div>
</template>

<script>
import blogService from "@/services/BlogService";
import authService from "@/services/auth.servics";

export default {
  name: "UserBlogDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      blog: null,
      error: null,
      likesCount: 0,
      comments: [],
      newComment: "",
      hasLiked: false,
      editingCommentId: null,
    };
  },
  async created() {
    try {
      const response = await blogService.getBlogById(this.id);
      this.blog = response; // Assign the blog details
      await this.fetchLikesCount(); // Fetch likes count after blog is fetched
      await this.fetchComments(); // Fetch comments after blog is fetched
      this.hasLiked = await blogService.checkIfUserLiked(this.blog.id); // Check if the user has liked the post
    } catch (error) {
      console.log("Error fetching blog details:", error);
      this.error = error.message;
    }
    await this.fetchLikesCount();
    await this.fetchComments();
  },
  methods: {
    getImageUrl(path) {
      return path ? `http://localhost:5254${path}` : "";
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    async fetchLikesCount() {
      const blogId = this.blog.id;
      try {
        const count = await blogService.getLikesCount(blogId);
        console.log("Fetched likes count:", count); // Debugging line
        this.likesCount = count;
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    },

    async fetchComments() {
  try {
    if (!this.blog || !this.blog.id) {
      console.error("Blog ID is undefined.");
      return;
    }
    this.comments = await blogService.getComments(this.blog.id);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
}
,
    async likeBlog() {
      const blogId = this.blog.id;
      try {
        if (this.hasLiked) {
          // User has already liked, so remove the like
          const response = await blogService.removeLike(blogId); // Add this method in your blogService
          if (response.isSuccess) {
            this.likesCount--; // Decrement the count
            this.hasLiked = false; // Update the like status
          }
        } else {
          // User hasn't liked yet, so add the like
          const response = await blogService.addLike(blogId);
          if (response.isSuccess) {
            this.likesCount++; // Increment the count
            this.hasLiked = true; // Update the like status
          }
        }
      } catch (error) {
        console.error("Error liking blog:", error);
      }
    },
    // Method to add a comment
    async addComment() {
      if (!this.newComment.trim()) return; // Check if the comment is empty

      const blogId = this.blog.id;
      try {
        const commentData = {
          content: this.newComment.trim(),
        };

        // Call the addComment method from blogService
        const response = await blogService.addComment(blogId, commentData);

        if (response.isSuccess) {
          this.comments.push(response.comment); // Add the new comment to the list
          this.newComment = ""; // Clear the comment input field
        } else {
          alert(response.message || "Failed to add comment.");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment.");
      }
    },
    async editComment(comment) {
      const newContent = prompt("Edit your comment:", comment.content);
      if (newContent) {
        const response = await blogService.updateComment(
          comment.id,
          newContent
        );
        if (response.isSuccess) {
          const index = this.comments.findIndex((c) => c.id === comment.id);
          this.comments[index].content = newContent; // Update the comment in the list
        } else {
          alert(response.message);
        }
      }
    },
    async deleteComment(commentId) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this comment?"
      );
      if (confirmDelete) {
        const response = await blogService.deleteComment(commentId);
        if (response.isSuccess) {
          this.comments = this.comments.filter((c) => c.id !== commentId); // Remove the comment from the list
        } else {
          alert(response.message);
        }
      }
    },
    isCommentOwner(comment) {
      return comment.userId === authService.getId(); // Check if the logged-in user is the comment owner
    },
  },
};
</script>

<style>
.author-date {
  margin-bottom: 10px;
}

.blogtags {
  margin-top: 20px;
}
</style>
