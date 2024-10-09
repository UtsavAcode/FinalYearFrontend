<template>
  <div>
    <!-- Performance Stats -->
    <div class="blog-performance container d-flex justify-content-center p-2">
      <div class="performance-block">
        <i class="bi bi-book pe-2"></i>{{ totalBlogs }}
      </div>
      <div class="performance-block">
        <i class="bi bi-heart pe-2"></i>{{ totalLikes }}
      </div>
      <div class="performance-block">
        <i class="bi bi-eye pe-2"></i>{{ totalViews }}
      </div>
      <div class="performance-block">
        <i class="bi bi-chat pe-2"></i>{{ totalComments }}
      </div>
    </div>

    <!-- Time Range Selection -->
    <div class="d-flex justify-content-center mt-4">
      <select v-model="timeRange" @change="fetchChartData">
        <option value="month">Monthly</option>
        <option value="week">Weekly</option>
        <option value="day">Daily</option>
      </select>
    </div>

    <!-- Chart -->
    <canvas id="lineChart"></canvas>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
import { mapGetters } from "vuex";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import moment from "moment";

// Register the necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default {
  name: "UserPerformance",
  data() {
    return {
      totalBlogs: 0,
      totalLikes: 0,
      totalViews: 0,
      totalComments: 0,
      timeRange: "month",
      chartInstance: null,
      userBlogs: [],
    };
  },
  async created() {
    await this.fetchUserBlogs();
    await this.calculateUserPerformance();
    this.fetchChartData();
  },
  methods: {
    async fetchUserBlogs() {
      try {
        const response = await blogService.getAllBlog();
        const blogs = Array.isArray(response) ? response : [];
        const cleanUserId = String(this.id).replace(/['"]+/g, "").trim();
        this.userBlogs = blogs.filter(
          (blog) =>
            String(blog.authorId).trim().toLowerCase() ===
            cleanUserId.toLowerCase()
        );
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      }
    },
    async calculateUserPerformance() {
      try {
        this.totalBlogs = this.userBlogs.length;

        let totalLikes = 0;
        let totalViews = 0;
        let totalComments = 0;

        for (const blog of this.userBlogs) {
          const likes = await blogService.getLikesCount(blog.id);
          const viewResponse = await blogService.getViews(blog.id);
          blog.views = Array.isArray(viewResponse)
            ? viewResponse
            : [viewResponse];

          blog.views.forEach((view) => {
            if (view.totalViews) {
              totalViews += view.totalViews;
            }
          });

          const comments = await blogService.getComments();
          const commentCount = comments.filter(
            (comment) => comment.blogPostId === blog.id
          ).length;

          totalLikes += likes;
          totalComments += commentCount;
        }

        this.totalLikes = totalLikes;
        this.totalViews = totalViews;
        this.totalComments = totalComments;
      } catch (error) {
        console.error("Error calculating performance:", error);
      }
    },
    accumulateViewsByDate() {
      const viewCounts = {};
      const today = moment().startOf("day");

      // Initialize viewCounts for the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = today.clone().subtract(i, "days").format("YYYY-MM-DD");
        viewCounts[date] = 0; // Start with 0 views
      }

      // Populate viewCounts with actual views
      this.userBlogs.forEach((blog) => {
        (blog.views || []).forEach((view) => {
          if (view.viewAt) {
            const viewDate = moment(view.viewAt).format("YYYY-MM-DD");
            if (viewCounts[viewDate] !== undefined) {
              viewCounts[viewDate] += view.totalViews || 0; // Accumulate views
            }
          }
        });
      });

      return viewCounts;
    },
    async fetchChartData() {
      try {
        const viewCounts = this.accumulateViewsByDate();
        const labels = Object.keys(viewCounts).reverse(); // Dates for X-axis
        const data = labels.map((date) => viewCounts[date]); // Corresponding view counts for Y-axis

        this.updateChart(labels, data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
    updateChart(labels, data) {
      const ctx = document.getElementById("lineChart");

      if (!ctx) {
        console.error("Canvas element not found");
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new ChartJS(ctx, {
        type: this.timeRange === "day" ? "bar" : "line", // Bar chart for daily, line chart for others
        data: {
          labels: labels,
          datasets: [
            {
              label: "Views",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              data: data,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Blog Views Over Time",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  computed: {
    ...mapGetters("auth", ["id"]),
  },
};
</script>
