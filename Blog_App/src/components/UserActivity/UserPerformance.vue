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

    <!-- Chart and Unique Viewers -->
    <div class="d-flex justify-content-center align-items-center mt-4">
      <div>
        <canvas
          ref="lineChart"
          style="max-width: 600px; height: 300px"
        ></canvas>
      </div>
      <div class="unique-viewers ml-3">
        <i class="bi bi-person pe-2"></i>{{ uniqueViewers }} Unique Viewers This
        Month
      </div>
    </div>
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
      uniqueViewers: 0,
      timeRange: "month",
      chartInstance: null,
      userBlogs: [],
    };
  },
  async created() {
    await this.fetchUserBlogs();
    await this.calculateUserPerformance();
    const blogPostIds = this.userBlogs.map((blog) => blog.id);
    await this.fetchViews(blogPostIds);
  },
  mounted() {
    this.fetchChartData();
  },
  methods: {
    async fetchUserBlogs() {
      try {
        const response = await blogService.getAllBlog();
        console.log(response);
        const blogs = Array.isArray(response) ? response : [];
        const cleanUserId = String(this.id).replace(/['"]+/g, "").trim();
        this.userBlogs = blogs.filter(
          (blog) =>
            String(blog.authorId).trim().toLowerCase() ===
            cleanUserId.toLowerCase()
        );

        console.log("user blogs", this.userBlogs);
        const blogPostIds = this.userBlogs.map((blog) => blog.id);
        console.log("Blog Post IDs:", blogPostIds); // Debugging statement

        // Call fetchViews only if there are blog post IDs
        if (blogPostIds.length > 0) {
          await this.fetchViews(blogPostIds);
        } else {
          console.warn("No blog post IDs to fetch views for.");
        }

        // Fetch views for each blog
        for (let blog of this.userBlogs) {
          const viewResponse = await blogService.getViews(blog.id);
          blog.views = Array.isArray(viewResponse)
            ? viewResponse
            : [viewResponse];
        }

        if (this.userBlogs.length > 0) {
          const currentMonth = moment().month();
          this.uniqueViewers = this.userBlogs.reduce((acc, blog) => {
            const blogUniqueViewCount = blog.uniqueViewCount || 0;
            return (
              acc +
              (moment(blog.createdAt).month() === currentMonth
                ? blogUniqueViewCount
                : 0)
            );
          }, 0);
        }
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
      let startDate;

      switch (this.timeRange) {
        case "month":
          startDate = today.clone().subtract(11, "months").startOf("month");
          break;
        case "week":
          startDate = today.clone().subtract(11, "weeks").startOf("week");
          break;
        case "day":
          startDate = today.clone().subtract(29, "days");
          break;
      }

      // Initialize viewCounts
      let current = startDate.clone();
      while (current <= today) {
        const key = this.getDateKey(current);
        viewCounts[key] = 0;
        current.add(1, this.timeRange);
      }

      // Populate viewCounts with actual views
      this.userBlogs.forEach((blog) => {
        blog.views.forEach((view) => {
          if (view.viewAt) {
            const viewDate = moment(view.viewAt);
            if (viewDate >= startDate) {
              const key = this.getDateKey(viewDate);
              if (viewCounts.hasOwnProperty(key)) {
                viewCounts[key] += 1;
              }
            }
          }
        });
      });

      // Calculate daily differences and accumulate increases/decreases
      const increases = [];
      const decreases = [];
      const keys = Object.keys(viewCounts);
      let previousCount = 0;

      for (let i = 0; i < keys.length; i++) {
        const currentCount = viewCounts[keys[i]];
        if (i === 0) {
          increases.push(currentCount); // Start with the initial count
          decreases.push(0); // No decrease at the start
        } else {
          const difference = currentCount - previousCount;
          increases.push(difference >= 0 ? difference : 0);
          decreases.push(difference < 0 ? Math.abs(difference) : 0);
        }
        previousCount = currentCount; // Update previousCount for the next iteration
      }

      return { increases, decreases, keys };
    },
    getDateKey(date) {
      switch (this.timeRange) {
        case "month":
          return date.format("YYYY-MM");
        case "week":
          return date.format("YYYY-[W]WW");
        case "day":
          return date.format("YYYY-MM-DD");
      }
    },
    async fetchChartData() {
      try {
        const { increases, decreases, keys } = this.accumulateViewsByDate();
        const labels = keys;

        this.updateChart(labels, increases, decreases);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
    async fetchViews(blogPostIds) {
      try {
        const allViews = []; // Store all views
        for (const blogPostId of blogPostIds) {
          const views = await blogService.getAllViews(blogPostId);
          console.log(`Views for Blog ID ${blogPostId}:`, views);
          allViews.push(...views); // Combine views from each blog
        }
        return allViews; // Return combined views if needed
      } catch (error) {
        console.error("Error fetching all views", error);
      }
    },
    updateChart(labels, increases, decreases) {
      const ctx = this.$refs.lineChart;

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
              label: "Increase in Views",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              data: increases,
              fill: false,
            },
            {
              label: "Decrease in Views",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              data: decreases,
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
              text: `Views Increase/Decrease (${
                this.timeRange.charAt(0).toUpperCase() + this.timeRange.slice(1)
              })`,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Views",
              },
            },
            x: {
              title: {
                display: true,
                text:
                  this.timeRange.charAt(0).toUpperCase() +
                  this.timeRange.slice(1),
              },
            },
          },
        },
      });
    },
  },
  computed: {
    ...mapGetters("auth", ["id"]),
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped></style>
