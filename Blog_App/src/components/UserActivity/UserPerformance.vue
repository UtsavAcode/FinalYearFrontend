<template>
  <div>
    <h2>User Performance Overview</h2>
    <div>Total Blogs: {{ totalBlogs }}</div>
    <div>Total Likes: {{ totalLikes }}</div>
    <div>Total Views: {{ totalViews }}</div>
    <div>Total Comments: {{ totalComments }}</div>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
import { mapGetters } from "vuex";

export default {
  name: "UserPerformance",
  data() {
    return {
      totalBlogs: 0,
      totalLikes: 0,
      totalViews: 0,
      totalComments: 0,
    };
  },
  created() {
    this.calculateUserPerformance();
  },
  methods: {
    async calculateUserPerformance() {
      try {
        const response = await blogService.getAllBlog();
        console.log("Blogs fetched:", response);

        const blogs = Array.isArray(response) ? response : [];

        // Clean user ID
        const cleanUserId = String(this.id).replace(/['"]+/g, "").trim();
        console.log("Cleaned User ID:", cleanUserId); // Debugging: Log cleaned user ID

        // Log each blog's authorId for comparison
        blogs.forEach((blog) => {
          console.log(`Blog ${blog.id} authorId:`, blog.authorId);
          console.log("Comparing IDs:", {
            blogAuthorId: String(blog.authorId).trim(),
            userId: cleanUserId,
            match:
              String(blog.authorId).trim().toLowerCase() ===
              cleanUserId.toLowerCase(),
          });
        });

        const userBlogs = blogs.filter(
          (blog) =>
            String(blog.authorId).trim().toLowerCase() ===
            cleanUserId.toLowerCase()
        );

        console.log("Filtered blogs:", userBlogs); // Debugging: Ensure blogs are filtered correctly

        this.totalBlogs = userBlogs.length;

        let totalLikes = 0;
        let totalViews = 0;
        let totalComments = 0;

        for (const blog of userBlogs) {
          const likes = await blogService.getLikesCount(blog.id);
          const views = await blogService.getViews(blog.id);
          const comments = await blogService.getComments();
          const commentCount = comments.filter(
            (comment) => comment.blogPostId === blog.id
          ).length;

          totalLikes += likes;
          totalViews += views;
          totalComments += commentCount;
        }

        this.totalLikes = totalLikes;
        this.totalViews = totalViews;
        this.totalComments = totalComments;

        console.log("Performance calculated:", {
          totalLikes,
          totalViews,
          totalComments,
        });
      } catch (error) {
        console.error("Error calculating performance:", error);
      }
    },
  },

  computed: {
    ...mapGetters("auth", ["id"]),
  },
};
</script>
