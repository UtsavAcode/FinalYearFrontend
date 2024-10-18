<template>
  <div class="container" v-if="blog" style="width: 80%">
    <h1 class="" style="margin: auto; width: 55rem">{{ blog.title }}</h1>
    <div
      class="author-date d-flex justify-content-between"
      style="width: 59rem; margin-left: 4rem; font-size: 1em"
    >
      <div>By: {{ blog.authorName }}</div>
      <div>{{ formatDate(blog.createdAt) }}</div>
    </div>

    <!-- Tags -->
    <div class="blogtags" style="width: 59rem; margin-left: 5rem">
      <span v-for="tag in blog.tags" :key="tag.id" class="badge bg-secondary">
        {{ tag.name }}
      </span>
    </div>

    <div class="likes d-flex">
      <i
        :class="[hasLiked ? 'bi-heart-fill' : 'bi-heart']"
        @click="likeBlog"
      ></i>
      <span class="ms-2">{{ likesCount }} </span>
      <div class="bi bi-eye ms-4">
        <span class="p-2">{{ viewsCount }}</span>
      </div>
      <div
        class="total-comments ms-4 bi bi-chat"
        v-if="filteredComments.length"
      >
        <span class="ps-2">{{ filteredComments.length }}</span>
      </div>
    </div>

    <!-- Blog Image -->
    <div class="blogdetail-image">
      <img
        v-if="blog.featuredImagePath"
        :src="getImageUrl(blog.featuredImagePath)"
        alt="Blog Image"
      />
    </div>

    <!-- Content section -->
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

    <div v-if="isRegisteringView" class="view-registration-message">
      Registering view...
    </div>
    <!-- Loading indicator -->
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
      viewRegistered: false,
      isRegisteringView: false, // New flag for view registration loading state
      scrollThreshold: 0.2, // 30% of the page
      timeThreshold: 25000, // 25 seconds
      timer: null,
      hasScrolled: false,
      viewsCount: 0,
      readingTime: 0, // Time spent reading in seconds
      scrollPositions: [], // To track scroll positions
      scrollTrackingInterval: null,
      apiUrl: 'http://localhost:5254',
    };
  },
  async created() {
    try {
      console.log("API URL:", this.apiUrl);
      const response = await blogService.getBlogById(this.id);
      this.blog = response;

      await this.fetchLikesCount();
      await this.fetchComments();
      this.hasLiked = await blogService.checkIfUserLiked(this.blog.id);
      await this.fetchViews(this.blog.id);

      if (this.$route.query.fromHomePage && !this.viewRegistered) {
        this.startViewRegistration();
      }
    } catch (error) {
      console.log("Error fetching blog details:", error);
      this.error = error.message;
    }

    this.startReadingTimer();
    this.startScrollTracking();

    window.addEventListener("beforeunload", this.handleBeforeUnload);
    this.currentUserId = JSON.parse(authService.getId());
  },
  computed: {
    filteredComments() {
      return this.comments.filter(
        (comment) => comment.blogPostId == this.blog.id
      );
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    if (this.timer) clearTimeout(this.timer);
    clearInterval(this.scrollTrackingInterval);
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
        console.error("error editing comment", error);
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
      return this.currentUserId === commentUserId;
    },

    handleScroll() {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = scrollTop / (documentHeight - windowHeight);

      if (
        scrollPercent > this.scrollThreshold && // Check scroll threshold
        !this.hasScrolled &&
        !this.viewRegistered // Check if the view has already been registered
      ) {
        this.hasScrolled = true; // Set flag to true when user scrolls beyond threshold

        this.timer = setTimeout(() => {
          this.registerView();
        }, this.timeThreshold); // Register view after 25 seconds
      }
    },
    async registerView() {
      const blogId = this.blog.id;
      const userId = this.currentUserId;
      const ipAddress = window.location.hostname; // IP address (fetch this server-side if needed)
      const userAgent = navigator.userAgent;

      const payload = {
        blogPostId: blogId,
        userId: userId,
        ipAddress: ipAddress,
        userAgent: userAgent,
      };

      try {
        const response = await blogService.addView(payload);
        console.log("View registration response:", response);

        this.viewRegistered = true;

        // Stop the timer and scroll tracking after view is registered
        if (this.timer) clearTimeout(this.timer);
        window.removeEventListener("scroll", this.handleScroll);

        // Remove fromHomePage query to prevent re-registering on reload
        this.$router.replace({
          query: { ...this.$router.query, fromHomePage: null },
        });
      } catch (error) {
        console.error("Error registering view:", error);
      }
    },
    startViewRegistration() {
      // Reset flags and start tracking scroll and time
      this.hasScrolled = false;
      this.viewRegistered = false;
      if (this.$route.query.fromHomePage) {
        window.addEventListener("scroll", this.handleScroll);
      }
    },
    async fetchViews(blogPostId) {
      try {
        const viewData = await blogService.getViews(blogPostId);
        if (viewData && typeof viewData.totalViews === "number") {
          this.viewsCount = viewData.totalViews;
        } else {
          console.error("Unexpected views data format:", viewData);
          this.viewsCount = 0; // Set to 0 if data is not in expected format
        }
      } catch (error) {
        console.error("Error fetching the views", error);
        this.viewsCount = 0; // Set to 0 in case of error
      }
    },

    startReadingTimer() {
      this.readingTime = 0;
      setInterval(() => {
        this.readingTime += 1;
      }, 1000);
    },
    startScrollTracking() {
      this.scrollTrackingInterval = setInterval(() => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercent =
          (scrollTop / (documentHeight - windowHeight)) * 100;
        this.scrollPositions.push(parseFloat(scrollPercent.toFixed(2)));
      }, 1000);
    },
    handleBeforeUnload(event) {
      const payload = {
        blogPostId: this.blog.id,
        userId: this.currentUserId,
        readingTime: Math.round(this.readingTime),
        scrollPositions: this.scrollPositions,
      };

      // Use the sendBeacon API to send the data asynchronously
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });

      const url = `${this.apiUrl}/api/Blog/Send`;
      console.log("Sending data to:", url); // Debug log

      navigator.sendBeacon(url, blob);
    },

    // ... other methods ...
  },
};
</script>

<style scoped>
.view-registration-message {
  margin-top: 10px;
  color: blue; /* Add some style for visibility */
}
</style>
