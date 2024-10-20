<template>
  <div class="view">
   
    <canvas id="readingTimeChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import blogService from "@/services/BlogService";

Chart.register(...registerables);

export default {
  name: "UserBlogTime",
  data() {
    return {
      readingData: [],
      chart: null,
    };
  },
  async mounted() {
    await this.fetchReadingData();
    this.renderChart();
  },
  methods: {
    async fetchReadingData() {
      try {
        const blogId = this.$route.params.id;
        this.readingData = await blogService.getReadingData(blogId);
      } catch (error) {
        console.error("Error fetching reading data:", error);
      }
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById("readingTimeChart").getContext("2d");

      // Process data for the chart
      const processedData = this.processDataForChart();

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: processedData.labels,
          datasets: [
            {
              label: "Reading Time (seconds)",
              data: processedData.data,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Reading Time (seconds)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
          },
        },
      });
    },
    processDataForChart() {
      // Sort the data by date
      const sortedData = this.readingData.sort(
        (a, b) => new Date(a.dateSaved) - new Date(b.dateSaved)
      );

      // Extract labels (dates) and data (reading times)
      const labels = sortedData.map((item) =>
        new Date(item.dateSaved).toLocaleDateString()
      );
      const data = sortedData.map((item) => item.readingTime);

      return { labels, data };
    },
  },
};
</script>

<style scoped>
.view {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20rem;
}
</style>
