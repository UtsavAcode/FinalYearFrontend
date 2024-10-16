<template>
  <div>
    <!-- Performance Stats -->
    <div class="blog-performance container d-flex justify-content-center ">
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
    <div class="d-flex justify-content-center">
      <div class="d-flex justify-content-center mt-4 me-2">
        <select
          class="chart-option"
          v-model="timeRange"
          @change="fetchChartData"
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="week">Weekly</option>
        </select>
      </div>

      <div class="d-flex justify-content-center mt-4">
        <button
          @click="downloadPDF"
          class="file-option btn btn-danger me-2 bi bi-filetype-pdf fs-4"
          title="Download pdf"
        ></button>
        <button
          @click="downloadWord"
          class="file-option btn btn-primary fs-4 bi bi-file-earmark-word"
          title="Download word"
        ></button>
      </div>
    </div>

    <!-- Chart and Unique Viewers -->
    <div class="d-flex justify-content-center align-items-center mt-4">
      <div class="chart-container">
        <canvas ref="lineChart"></canvas>
      </div>
      <div class="blog-overview">
        <div class="unique-viewers ml-3">
          <i class="bi bi-person pe-2"></i>{{ uniqueViewers }} Unique Viewers
          This Month
        </div>
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

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

        const blogPostIds = this.userBlogs.map((blog) => blog.id);

        if (blogPostIds.length > 0) {
          await this.fetchViews(blogPostIds);
        } else {
          console.warn("No blog post IDs to fetch views for.");
        }

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

      let current = startDate.clone();
      while (current <= today) {
        const key = this.getDateKey(current);
        viewCounts[key] = 0;
        current.add(1, this.timeRange);
      }

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

      const keys = Object.keys(viewCounts);
      const totalViews = keys.map((key) => viewCounts[key]);

      return { totalViews, keys };
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
        const { totalViews, keys } = this.accumulateViewsByDate();
        const labels = keys;
        this.updateChart(labels, totalViews);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
    async fetchViews(blogPostIds) {
      try {
        if (blogPostIds && blogPostIds.length > 0) {
          const views = await blogService.getAllViews(blogPostIds);
          this.userBlogs.forEach((blog) => {
            blog.views = views.filter((view) => view.blogPostId === blog.id);
          });
        } else {
          console.warn("No blog post IDs provided for fetching views.");
        }
      } catch (error) {
        console.error("Error fetching all views", error);
      }
    },
    updateChart(labels, totalViews) {
      const ctx = this.$refs.lineChart;

      if (!ctx) {
        console.error("Canvas element not found");
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Get the month name for the current month
      const monthName = moment().format("MMMM");

      this.chartInstance = new ChartJS(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total Views",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              data: totalViews,
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
              text: `Total Views Accumulated for ${monthName} (${
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
    async downloadPDF() {
      const canvas = this.$refs.lineChart;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");

      pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
      pdf.save("chart.pdf");
    },
    async downloadWord() {
      try {
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "User Performance Report",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [new TextRun(`Total Blogs: ${this.totalBlogs}`)],
                }),
                new Paragraph({
                  children: [new TextRun(`Total Likes: ${this.totalLikes}`)],
                }),
                new Paragraph({
                  children: [new TextRun(`Total Views: ${this.totalViews}`)],
                }),
                new Paragraph({
                  children: [
                    new TextRun(`Total Comments: ${this.totalComments}`),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun(
                      `Unique Viewers This Month: ${this.uniqueViewers}`
                    ),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Chart Data",
                      bold: true,
                      size: 16,
                    }),
                  ],
                }),
                ...this.getChartDataForWord(),
              ],
            },
          ],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "user-performance-report.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading Word document:", error);
      }
    },
    getChartDataForWord() {
      const { totalViews, keys } = this.accumulateViewsByDate();
      return keys.map(
        (key, index) =>
          new Paragraph({
            children: [
              new TextRun(`Date: ${key}, Views: ${totalViews[index]}`),
            ],
          })
      );
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

<style scoped>
.chart-container {
  width: 80%;
  margin: 0 auto;
}

.unique-viewers {
  margin-left: 20px;
}

.chart-option {
  height: 1.6rem;
  margin-top: 1rem;
  border-radius: 5px;
}

.blog-overview {
  border: 1px solid black;
  border-radius: 0.8rem;
  height: 15rem;
  margin-left: 1rem;
  width: 15rem;
}

.file-option{
  height:3rem;
}
</style>
