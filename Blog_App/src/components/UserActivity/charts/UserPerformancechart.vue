<template>
  <div>
    <canvas id="performanceChart"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  props: {
    blogMetrics: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    blogMetrics: {
      handler() {
        this.renderChart();
      },
      deep: true,
    },
  },
  methods: {
    renderChart() {
      const labels = this.blogMetrics.map((metric) => metric.blogTitle);
      const likesData = this.blogMetrics.map((metric) => metric.likes);
      const viewsData = this.blogMetrics.map((metric) => metric.views);
      const commentsData = this.blogMetrics.map((metric) => metric.comments);

      // Destroy previous chart instance if exists
      if (this.chart) {
        this.chart.destroy();
      }

      // Create new chart
      const ctx = document.getElementById("performanceChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Likes",
              data: likesData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: "Views",
              data: viewsData,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Comments",
              data: commentsData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
  beforeUnmount() {
    // Destroy chart to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
