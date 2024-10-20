<template>
  <div class="bigbox">
    <h2 class="p-2 mb-3">Blog Analytics</h2>

    <h3 style="text-align: center">
      <strong>This Blog has reached</strong> {{ totalViews }}
      <strong>views since it was published</strong>
    </h3>

    <div class="overall-container d-flex justify-content-center">
      <div class="analysis-box">
        <div class="analytic-panels">
          <!-- Updated router-links to include dynamic :id for navigation -->
          <RouterLink
            :to="{ name: 'UserBlogView', params: { id: $route.params.id } }"
            class="panel"
          >
            <div class="title">Views</div>
            <div class="numbers">
              <h1>{{ monthlyViews }}</h1>
            </div>
          </RouterLink>
          <RouterLink
            :to="{ name: 'UserBlogScroll', params: { id: $route.params.id } }"
            class="panel"
          >
            <div class="title">Average Scroll Rate</div>
            <div class="numbers">
              <h1>
                {{
                  averageScrollRate !== undefined
                    ? averageScrollRate.toFixed(2)
                    : "0.00"
                }}%
              </h1>
            </div>
          </RouterLink>
          <RouterLink
            :to="{ name: 'UserBlogTime', params: { id: $route.params.id } }"
            class="panel"
          >
            <div class="title">Average Reading Time</div>
            <div class="numbers">
              <h1>
                {{
                  averageReadingTime !== undefined
                    ? (averageReadingTime / 60).toFixed(2)
                    : "0.00"
                }}
                minutes
              </h1>
            </div>
          </RouterLink>
        </div>
        <RouterView />
      </div>
      <!-- <div class="overview">
        <p><strong>Views This Month:</strong> {{ monthlyViews }}</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import blogService from "@/services/BlogService";
import { RouterLink } from "vue-router";

export default {
  name: "UserBlogPerformance",

  props: ["id"],

  data() {
    return {
      viewsData: [], // to store the fetched views
      blogPostIds: [],
      totalViews: 0, // total views across all time
      monthlyViews: 0, // total views for the current month
      chart: null, // to hold the Chart instance
      currentMonth: new Date().getMonth(),
      averageScrollRate: 0, // To hold average scroll rate
      averageReadingTime: 0, // To hold average reading time
      // Track the current month to reset views
    };
  },

  async created() {
    const blogId = this.id || this.$route.params.id;
    console.log("Blog ID:", blogId);

    // Set the blog ID to be fetched
    this.blogPostIds = [blogId];

    // Fetch the views data
    await this.fetchViews(this.blogPostIds);
    await this.fetchAverageScrollAndReadingTime(blogId);
    // Calculate the views totals
    this.calculateViewTotals();

    // After fetching the views, render the chart
    //this.renderChart();
  },

  methods: {
    async fetchViews(blogPostIds) {
      try {
        const views = await blogService.getAllViews(blogPostIds);
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

    // Calculate the total views and views for the current month
    calculateViewTotals() {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalViews = 0;
      let monthlyViews = 0;

      this.viewsData.forEach((view) => {
        totalViews++; // Increment total views count

        const viewDate = new Date(view.viewAt);
        const viewMonth = viewDate.getMonth();
        const viewYear = viewDate.getFullYear();

        // Increment monthly views if the view is in the current month and year
        if (viewMonth === currentMonth && viewYear === currentYear) {
          monthlyViews++;
        }
      });

      // Update the component's data
      this.totalViews = totalViews;
      this.monthlyViews = monthlyViews;
    },

    async fetchAverageScrollAndReadingTime(blogPostId) {
      try {
        const { averageScrollPosition, averageReadingTime } =
          await blogService.getAverageScrollAndReadingTime(blogPostId);
        this.averageScrollRate = averageScrollPosition; // Update this line to match the backend response
        this.averageReadingTime = averageReadingTime;
      } catch (error) {
        console.error("Error fetching average scroll and reading time:", error);
      }
    },

    // Render the views chart
    // renderChart() {
    //   if (!this.viewsData.length) {
    //     return; // No data yet
    //   }

    //   // Get the aggregated view counts by date
    //   const { dates, counts } = this.aggregateViewsByDate();

    //   // If the chart already exists, destroy it before rendering a new one
    //   if (this.chart) {
    //     this.chart.destroy();
    //   }

    //   // Create the chart
    //   const ctx = document.getElementById("viewsChart").getContext("2d");
    //   this.chart = new Chart(ctx, {
    //     type: "line", // 'line' type gives an area-like appearance when configured properly
    //     data: {
    //       labels: dates, // X-axis labels (dates)
    //       datasets: [
    //         {
    //           label: "Total Views Per Date",
    //           data: counts, // Y-axis data (total views per date)
    //           backgroundColor: "rgba(75, 192, 192, 0.2)", // Area color
    //           borderColor: "rgba(75, 192, 192, 1)", // Line color
    //           borderWidth: 1,
    //           fill: true, // Fills the area below the line
    //         },
    //       ],
    //     },
    //     options: {
    //       scales: {
    //         x: {
    //           title: {
    //             display: true,
    //             text: "Date",
    //           },
    //         },
    //         y: {
    //           title: {
    //             display: true,
    //             text: "Total Views",
    //           },
    //           beginAtZero: true,
    //         },
    //       },
    //       responsive: true,
    //       plugins: {
    //         legend: {
    //           display: true, // Display legend for the dataset
    //         },
    //       },
    //     },
    //   });
    // },
  },

  watch: {
    // Watch for changes in the current month to reset monthly views
    currentMonth(newMonth) {
      if (newMonth !== new Date().getMonth()) {
        this.currentMonth = new Date().getMonth();
        this.monthlyViews = 0; // Reset monthly views
        this.calculateViewTotals(); // Recalculate totals
      }
    },
  },
};
</script>

<style>
.chart-area {
  height: 16rem;
}

.analytic-panels {
  display: flex;
  justify-content: left;
  align-items: center;
}
.panel {
  width: 20rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1px;
  border-radius: 0.9rem 0 0 0;
  text-decoration: none;
  color: black;
}

.panel .title {
  color: #928f8f;
  padding: 0;
  margin: 0;
  font-size: 0.8em;
}

.panel .numbers h1 {
  font-size: 2em;
}

.panel:hover {
  cursor: pointer;
  background-color: rgb(231, 226, 226);
}

.panel:nth-child(2) {
  border-radius: 0 0 0 0;
}

.panel:nth-child(3) {
  border-radius: 0 0 0 0;
  border-top-right-radius: 0.9rem;
}
.analysis-box {
  border: 1px solid rgb(241, 237, 237);
  width: 80%;
  border-radius: 0.9rem;
}

.overall-container {
  display: flex;
}

.overview {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  padding: 1rem;

  width: 28rem;
  font-size: 0.9em;
  border-radius: 1rem;
}

.bigbox {
  width: 69rem;
}
.analytic-panels .panel:nth-child(1),
.analytic-panels .panel:nth-child(2) {
  border-right: 1.5px solid #eee;
}
</style>
