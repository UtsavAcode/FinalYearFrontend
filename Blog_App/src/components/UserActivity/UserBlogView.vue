<template>
  <div class="view">
    <!-- The area chart will render here -->

    <canvas class="chart-area" id="viewsChart"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import blogService from "@/services/BlogService"; // Ensure this service is available

export default {
  name: "UserBlogView",
  props: ["id"],

  data() {
    return {
      blogId: this.id || this.$route.params.id, // Getting the blog ID
      viewsData: [], // to store the fetched views
      totalViews: 0, // total views across all time
      monthlyViews: 0, // total views for the current month
      chart: null, // to hold the Chart instance
    };
  },

  async created() {
    console.log("Blog ID in UserBlogView:", this.blogId);

    // Fetch the views data using the blogId
    await this.fetchViews(this.blogId);

    // Render the chart after fetching the views
    this.renderChart();
  },

  methods: {
    async fetchViews(blogId) {
      try {
        // Fetch views for the specific blog ID
        const views = await blogService.getAllViews([blogId]);
        this.viewsData = views;
        console.log("Fetched Views Data:", views);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    },

    // Helper function to group views by date and count views per date
    aggregateViewsByDate() {
      const viewCounts = {};

      // Iterate over the views and aggregate them by date
      this.viewsData.forEach((view) => {
        const date = new Date(view.viewAt).toLocaleDateString(); // Extract just the date (ignoring time)

        // Increment the count for each date
        if (viewCounts[date]) {
          viewCounts[date]++;
        } else {
          viewCounts[date] = 1;
        }
      });

      // Convert the viewCounts object into two arrays: one for dates and one for view counts
      const dates = Object.keys(viewCounts);
      const counts = Object.values(viewCounts);

      return { dates, counts };
    },

    // Render the views chart
    renderChart() {
      if (!this.viewsData.length) {
        return; // No data yet
      }

      // Get the aggregated view counts by date
      const { dates, counts } = this.aggregateViewsByDate();

      // If the chart already exists, destroy it before rendering a new one
      if (this.chart) {
        this.chart.destroy();
      }

      // Create the chart
      const ctx = document.getElementById("viewsChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line", // 'line' type gives an area-like appearance when configured properly
        data: {
          labels: dates, // X-axis labels (dates)
          datasets: [
            {
              label: "Total Views Per Date",
              data: counts, // Y-axis data (total views per date)
              backgroundColor: "rgba(75, 192, 192, 0.2)", // Area color
              borderColor: "rgba(75, 192, 192, 1)", // Line color
              borderWidth: 1,
              fill: true, // Fills the area below the line
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Total Views",
              },
              beginAtZero: true,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: true, // Display legend for the dataset
            },
          },
        },
      });
    },
  },
};
</script>

<style>
.view {
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20rem;
}

.chart-area {
  height: 19rem;
}
</style>
