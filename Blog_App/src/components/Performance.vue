<template>
  <div class="performance-container">
 
    <div class="stats">
      <div class="stat-item">
        <h3 class="stat-text">
          <span class="bi bi-book pe-3"></span>{{ totalBlogs }}
        </h3>
      </div>
      <div class="stat-item">
        <h3 class="stat-text">
          <span class="bi bi-person-circle pe-3"></span>{{ totalUsers }}
        </h3>
      </div>
    </div>

    <div class="charts d-flex">
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
import authService from "@/services/auth.servics";
import blogService from "@/services/BlogService";
import { Chart, registerables } from "chart.js";
import moment from "moment"; // You can use moment.js to handle dates easily

Chart.register(...registerables); // Register all chart.js components

export default {
  name: "Performance",
  data() {
    return {
      totalBlogs: 0,
      totalUsers: 0,
      blogData: [],
      userData: [], // For storing processed user statistics data (daily counts)
    };
  },
  mounted() {
    this.fetchTotalBlogs();
    this.fetchAllUserData();
    this.fetchBlogData();
  },
  methods: {
    async fetchTotalBlogs() {
      try {
        const blogs = await blogService.getAllBlog();
        this.totalBlogs = blogs.length;
        console.log(blogs);
      } catch (error) {
        console.error("Error fetching total blogs:", error);
      }
    },
    async fetchAllUserData() {
      try {
        const details = await authService.AllUserDetails();

        // Process user registration data
        const userRegistrationsByDate =
          this.processUserRegistrationData(details);
        this.userData = userRegistrationsByDate;

        this.totalUsers = details.length;
        this.renderUserChart();
      } catch (error) {
        console.error("Error fetching the user details:", error);
      }
    },
    processUserRegistrationData(userDetails) {
      // Create a map to store the count of users registered on each day
      const registrationsMap = {};

      userDetails.forEach((user) => {
        const registrationDate = moment(user.registeredAt).format("YYYY-MM-DD");
        if (registrationsMap[registrationDate]) {
          registrationsMap[registrationDate]++;
        } else {
          registrationsMap[registrationDate] = 1;
        }
      });

      // Convert the map to an array of objects sorted by date
      const sortedRegistrationData = Object.keys(registrationsMap)
        .sort()
        .map((date) => ({
          day: date,
          count: registrationsMap[date],
        }));

      return sortedRegistrationData;
    },
    async fetchBlogData() {
      try {
        const blogs = await blogService.getAllBlog();
        const blogCreationData = this.processBlogCreationData(blogs);
        this.blogData = blogCreationData;
        this.renderBlogChart();
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    },
    processBlogCreationData(blogs) {
      // Create a map to store the count of blogs created on each day
      const blogsMap = {};

      blogs.forEach((blog) => {
        const creationDate = moment(blog.createdAt).format("YYYY-MM-DD");
        if (blogsMap[creationDate]) {
          blogsMap[creationDate]++;
        } else {
          blogsMap[creationDate] = 1;
        }
      });

      // Convert the map to an array of objects sorted by date
      const sortedBlogData = Object.keys(blogsMap)
        .sort()
        .map((date) => ({
          day: date,
          count: blogsMap[date],
        }));

      return sortedBlogData;
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
  padding: 1rem;
  display: flex;
}
.stat-item {
  text-align: center;
  background-color: black;
  color: white;
  padding: 1rem;
  margin-right: 1rem;
  border-radius: 1rem;
  height: 6rem;
  width: 9rem;
}

.stat-text {
  margin-top:1rem;
}
.charts {
  width: 100%;
  margin-top: 20px;
  height: 25rem;
}
canvas {
  width: 31rem;
}
</style>
