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

    <div class="charts">
      <div class="chart">
        <h3>Blogs</h3>
        <div class="download-buttons">
          <button
            @click="downloadBlogChartPDF"
            class="bi bi-file-pdf btn btn-danger fs-5"
            title="Downlaod Pdf"
          ></button>
          <button
            @click="downloadBlogChartWord"
            class="btn btn-primary bi bi-file-earmark-word fs-5"
            title="Download Word"
          ></button>
        </div>
        <canvas id="blogChart"></canvas>
      </div>
      <div class="chart" style="margin-top: 8rem">
        <h3>Users</h3>
        <div class="download-buttons">
          <button
            @click="downloadUserChartPDF"
            class="btn btn-danger bi bi-file-pdf fs-5"
            title="Download Pdf"
          ></button>
          <button
            @click="downloadUserChartWord"
            class="btn btn-primary bi bi-file-earmark-word fs-5"
            title="Download Word"
          ></button>
        </div>
        <canvas id="userChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import authService from "@/services/auth.servics";
import blogService from "@/services/BlogService";
import { Chart, registerables } from "chart.js";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

Chart.register(...registerables);

export default {
  name: "Performance",
  data() {
    return {
      totalBlogs: 0,
      totalUsers: 0,
      blogData: [],
      userData: [],
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
      const registrationsMap = {};
      userDetails.forEach((user) => {
        const registrationDate = moment(user.registeredAt).format("YYYY-MM-DD");
        registrationsMap[registrationDate] =
          (registrationsMap[registrationDate] || 0) + 1;
      });

      return Object.keys(registrationsMap)
        .sort()
        .map((date) => ({
          day: date,
          count: registrationsMap[date],
        }));
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
      const blogsMap = {};
      blogs.forEach((blog) => {
        const creationDate = moment(blog.createdAt).format("YYYY-MM-DD");
        blogsMap[creationDate] = (blogsMap[creationDate] || 0) + 1;
      });

      return Object.keys(blogsMap)
        .sort()
        .map((date) => ({
          day: date,
          count: blogsMap[date],
        }));
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
    async downloadBlogChartPDF() {
      const canvas = document.getElementById("blogChart");
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 10, 10);
      pdf.save("blog_chart.pdf");
    },
    async downloadUserChartPDF() {
      const canvas = document.getElementById("userChart");
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 10, 10);
      pdf.save("user_chart.pdf");
    },
    downloadBlogChartWord() {
      const canvas = document.getElementById("blogChart");
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "blog_chart.doc";
        link.click();
      }, "image/png");
    },
    downloadUserChartWord() {
      const canvas = document.getElementById("userChart");
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "user_chart.doc";
        link.click();
      }, "image/png");
    },
  },
};
</script>

<style scoped>
.performance-container {
  padding: 20px;
}
.stats {
  padding: 0rem;
  display: flex;
}
.stat-item {
  text-align: center;
  background-color: black;
  color: white;
  padding: 0rem;
  margin-right: 1rem;
  border-radius: 1rem;
  height: 4rem;
  width: 9rem;
  font-size: 1em;
}

.stat-text {
  margin-top: 1rem;
}
.charts {
  width: 100%;
  margin-top: 20px;
  height: 25rem;
}
.chart {
  height: 22rem;
}
canvas {
  height: 10rem;
}
.download-buttons {
  margin-top: 10px;
}
.download-buttons button {
  margin-right: 5px;
}
</style>
