<template>
  <div>
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

    <div class="d-flex justify-content-center mt-4">
      <select v-model="timeRange" @change="fetchChartData">
        <option value="month">Monthly</option>
        <option value="week">Weekly</option>
        <option value="day">Daily</option>
      </select>
    </div>

    <!-- Line Chart -->
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
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import moment from "moment";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
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

        console.log("Total Likes:", totalLikes);
        console.log("Total Views:", totalViews);
        console.log("Total Comments:", totalComments);
      } catch (error) {
        console.error("Error calculating performance:", error);
      }
    },
    getAccumulatedViewsByDay() {
      const dailyViews = Array(2).fill(0); // Create an array for today and yesterday

      const today = moment().startOf('day'); // Get the start of today
      const yesterday = moment().subtract(1, 'days').startOf('day'); // Get the start of yesterday

      this.userBlogs.forEach((blog) => {
        (blog.views || []).forEach((view) => {
          if (view.viewAt && view.totalViews) {
            const viewDate = moment(view.viewAt).startOf('day'); // Get the view date normalized

            if (viewDate.isSame(today)) {
              dailyViews[0] += view.totalViews; // Accumulate views for today
            } else if (viewDate.isSame(yesterday)) {
              dailyViews[1] += view.totalViews; // Accumulate views for yesterday
            }
          }
        });
      });

      return dailyViews;
    },
    getAccumulatedViewsByMonth() {
      const monthlyViews = Array(12).fill(0); // Create an array for 12 months

      this.userBlogs.forEach((blog) => {
        (blog.views || []).forEach((view) => {
          if (view.viewAt && view.totalViews) {
            const month = moment(view.viewAt).month(); // Get the month from the view date
            monthlyViews[month] += view.totalViews; // Accumulate views per month
          }
        });
      });

      return monthlyViews;
    },
    getAccumulatedViewsByWeek() {
      const weeklyViews = Array(52).fill(0); // Create an array for 52 weeks

      this.userBlogs.forEach((blog) => {
        (blog.views || []).forEach((view) => {
          if (view.viewAt && view.totalViews) {
            const week = moment(view.viewAt).week() - 1; // Adjust to 0-based index
            weeklyViews[week] += view.totalViews; // Accumulate views per week
          }
        });
      });

      return weeklyViews;
    },
    async fetchChartData() {
      try {
        let labels = [];
        let data = [];

        if (this.timeRange === "month") {
          labels = moment.months();
          data = this.getAccumulatedViewsByMonth();
        } else if (this.timeRange === "week") {
          labels = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
          data = this.getAccumulatedViewsByWeek();
        } else if (this.timeRange === "day") {
          labels = ["Today", "Yesterday"]; // Updated labels for daily view
          data = this.getAccumulatedViewsByDay();
        }

        console.log("Chart Labels:", labels);
        console.log("Chart Data:", data);

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
        type: "line",
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

<style scoped>
/* Add any necessary styling */
</style>
