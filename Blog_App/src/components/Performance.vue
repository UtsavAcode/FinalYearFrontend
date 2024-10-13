<template>
  <div class="performance-container">
    <h2>Total Blogs and Users</h2>
    <div class="stats">
      <div class="stat-item">
        <p>Total Blogs</p>
        <h3>{{ totalBlogs }}</h3>
      </div>
      <div class="stat-item">
        <p>Total Users</p>
        <h3>{{ totalUsers }}</h3>
      </div>
    </div>

    <div class="charts">
      <div>
        <h3>Blog Statistics</h3>
        <canvas id="blogChart"></canvas>
      </div>
      <div>
        <h3>User Statistics</h3>
        <canvas id="userChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import blogService from "@/services/BlogService";
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Register all chart.js components

export default {
  name: "Performance",
  data() {
    return {
      totalBlogs: 0,
      totalUsers: 0,
      blogData: [], // For storing blog statistics data
      userData: [], // For storing user statistics data
    };
  },
  mounted() {
    this.fetchTotalBlogs();
    this.fetchTotalUsers();
    this.fetchBlogData();
    this.fetchUserData();
  },
  methods: {
    async fetchTotalBlogs() {
      try {
        const blogs = await blogService.getAllBlog();
        this.totalBlogs = blogs.length;
      } catch (error) {
        console.error("Error fetching total blogs:", error);
      }
    },
    async fetchTotalUsers() {
      try {
        const response = await axios.get(
          "http://localhost:5254/api/Auth/GetAll"
        );
        this.totalUsers = response.data.length; // Get the total number of users
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    },
    async fetchBlogData() {
      // This is a placeholder for actual data fetching logic
      // Replace this with your API call to get blog statistics
      this.blogData = [
        { day: "2024-10-01", count: 5 },
        { day: "2024-10-02", count: 3 },
        { day: "2024-10-03", count: 8 },
        { day: "2024-10-04", count: 2 },
        { day: "2024-10-05", count: 4 },
      ];
      this.renderBlogChart();
    },
    async fetchUserData() {
      // This is a placeholder for actual data fetching logic
      // Replace this with your API call to get user statistics
      this.userData = [
        { day: "2024-10-01", count: 10 },
        { day: "2024-10-02", count: 6 },
        { day: "2024-10-03", count: 12 },
        { day: "2024-10-04", count: 5 },
        { day: "2024-10-05", count: 9 },
      ];
      this.renderUserChart();
    },
    renderBlogChart() {
      const ctx = document.getElementById("blogChart").getContext("2d");
      const labels = this.blogData.map((data) => data.day);
      const dataCounts = this.blogData.map((data) => data.count);

      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Blogs Created",
              data: dataCounts,
              fill: false,
              borderColor: "blue",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    renderUserChart() {
      const ctx = document.getElementById("userChart").getContext("2d");
      const labels = this.userData.map((data) => data.day);
      const dataCounts = this.userData.map((data) => data.count);

      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Users Registered",
              data: dataCounts,
              fill: false,
              borderColor: "green",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.performance-container {
  padding: 20px;
}
.stats {
  display: flex;
  justify-content: space-between;
}
.stat-item {
  text-align: center;
}
.charts {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
canvas {
  max-width: 400px; /* Adjust width of the charts */
}
</style>
