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

    <div class="container ms-6">
      <h2>Comments</h2>

      <form @submit.prevent="addComment">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          required
          rows="3"
          class="form-control w-50 mb-2 p-1"
        ></textarea>
        <button class="btn btn-dark" style="width: 10rem">Submit</button>
      </form>

      <div v-if="comments.length" class="mt-3 mb-3">
        <div
          class="mb-1 d-flex"
          v-for="comment in filteredComments"
          :key="comment.id"
          @mouseenter="setHoveredComment(comment.id, comment.userId)"
          @mouseleave="clearHoveredCommentId"
        >
          <div class="profile-con" style="background-color: black">
            <div class="profile-pic" style="color: white">
              {{ getFirstLetter(comment.userName) }}
              
            </div>
          </div>
          <div class="cover-utility">
            <div class="bubble">
              <div class="username-comment">{{ comment.userName }}</div>
              <p class="comment-content">{{ comment.content }}</p>
            </div>
            <div
              class="comment-utility"
              v-if="
                hoveredCommentId === comment.id &&
                isCommentAuthor(comment.userId)
              "
            >
              <div class="comment-utilities d-flex ms-5">
                <p
                  class="me-3 comment-utilities-single"
                  @click="showDialog(comment)"
                >
                  edit
                </p>
                <p
                  @click="deleteComment(comment.id)"
                  class="comment-utilities-single"
                >
                  delete
                </p>
              </div>
            </div>
          </div>
          <Dialog
            v-model:visible="visible"
            :style="{ width: '25rem' }"
            header="Edit Comment"
            class="container"
            :close-on-click-overlay="true"
          >
            <InputText
              v-model="currentComment.content"
              :style="{ width: '20rem' }"
            ></InputText>

            <div class="d-flex justify-content-center align-center gap-2">
              <Button
                type="button"
                label="Cancel"
                severity="secondary"
                @click="visible = false"
              ></Button>
              <Button type="button" label="Save" @click="editComment"></Button>
            </div>
          </Dialog>
        </div>
      </div>
      <p v-else>No comments yet.</p>
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
      currentComment: {},
      hoveredCommentId: null,
      currentUserId: null,
      visible: false,
    };
  },
  async created() {
    try {
      const response = await blogService.getBlogById(this.id);
      this.blog = response; // Assign the blog details
      await this.fetchLikesCount(); // Fetch likes count after blog is fetched
      await this.fetchComments(); // Fetch comments after blog is fetched
      this.hasLiked = await blogService.checkIfUserLiked(this.blog.id);
    } catch (error) {
      console.log("Error fetching blog details:", error);
      this.error = error.message;
    }
    await this.fetchLikesCount();
    await this.fetchComments();
    this.currentUserId = JSON.parse(authService.getId());
    console.log("loggedin user", this.currentUserId);
  },
  computed: {
    filteredComments() {
      return this.comments.filter(
        (comment) => comment.blogPostId == this.blog.id
      );
    },
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
        const response = await blogService.getComments();
        this.comments = Array.isArray(response) ? response : [];
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    },
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
      if (!this.newComment.trim()) return;

      const blogId = this.blog.id;
      try {
        const commentData = {
          content: this.newComment.trim(),
        };

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
      try {
        await blogService.updateComment(this.currentComment);
        this.visible = false;
        this.fetchComments();
      } catch (error) {
        console.error("error editing comment ", error);
      }
    },
    async deleteComment(commentId) {
      try {
        const response = await blogService.deleteComment(commentId);
        this.fetchComments();
      } catch (error) {
        console.error("Error deleting comments", error);
      }
    },

    showDialog(comment) {
      this.currentComment = { ...comment };
      this.visible = true;
    },
    getFirstLetter(userName) {
      return userName ? userName.charAt(0).toUpperCase() : "";
    },

    setHoveredComment(commentId, commentUserId) {
      if (this.currentUserId === commentUserId) {
        this.hoveredCommentId = commentId;
      }
    },
    clearHoveredCommentId() {
      this.hoveredCommentId = null;
    },
    isCommentAuthor(commentUserId) {
      return this.currentUserId == commentUserId;
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
