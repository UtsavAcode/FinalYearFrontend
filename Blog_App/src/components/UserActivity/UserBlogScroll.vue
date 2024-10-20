<template>
  <div class="view">
    <canvas
      class="chart-area"
      ref="scrollChart"
      v-if="scrollChartData"
    ></canvas>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import blogService from "@/services/BlogService";
import { Chart } from "chart.js/auto";

export default {
  name: "UserBlogScroll",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const readingData = ref(null);
    const scrollChartData = ref(null);
    const chartInstance = ref(null);
    const scrollChart = ref(null);

    const averageScrollPosition = computed(() => {
      if (!readingData.value) return 0;
      const totalScroll = readingData.value.reduce((acc, entry) => {
        return acc + Math.max(...entry.scrollPositions);
      }, 0);
      return totalScroll / readingData.value.length;
    });

    const averageReadingTime = computed(() => {
      if (!readingData.value) return 0;
      const totalTime = readingData.value.reduce(
        (acc, entry) => acc + entry.readingTime,
        0
      );
      return totalTime / readingData.value.length;
    });

    const fetchReadingData = async (blogPostId) => {
      try {
        const data = await blogService.getReadingData(blogPostId);
        readingData.value = data;
        console.log("Fetched Reading Data:", data);
        prepareChartData();
      } catch (error) {
        console.error("Error fetching reading data:", error);
      }
    };

    const prepareChartData = () => {
      if (!readingData.value) return;

      const dateData = readingData.value.reduce((acc, entry) => {
        const date = new Date(entry.dateSaved).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { totalScroll: 0, count: 0 };
        }
        acc[date].totalScroll += Math.max(...entry.scrollPositions);
        acc[date].count += 1;
        return acc;
      }, {});

      const dates = Object.keys(dateData).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const averageScrolls = dates.map((date) =>
        (dateData[date].totalScroll / dateData[date].count).toFixed(2)
      );

      scrollChartData.value = {
        labels: dates,
        datasets: [
          {
            label: "Average Scroll Percentage",
            data: averageScrolls,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      };
    };

    const renderChart = () => {
      if (!scrollChart.value || !scrollChartData.value) return;

      const ctx = scrollChart.value.getContext("2d");

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      chartInstance.value = new Chart(ctx, {
        type: "line",
        data: scrollChartData.value,
        options: {
          responsive: true,
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
                text: "Average Scroll Percentage",
              },
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Average Scroll: ${context.parsed.y}%`;
                },
              },
            },
          },
        },
      });
    };

    onMounted(() => {
      fetchReadingData(props.id);
    });

    return {
      readingData,
      scrollChartData,
      scrollChart,
      renderChart,
      averageScrollPosition,
      averageReadingTime,
    };
  },
  watch: {
    scrollChartData: {
      handler() {
        this.$nextTick(() => {
          this.renderChart();
        });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.view {
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  padding: 1rem;
  display:flex;
  justify-content: center;
  align-items: center;
  height: 20rem;
}

.chart-area {
  height: 19rem;
}
</style>
