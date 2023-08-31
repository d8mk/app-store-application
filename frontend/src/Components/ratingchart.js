import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const RatingsChart = ({ ratings }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const currentChartRef = chartRef.current;

    if (!currentChartRef) return;

    if (currentChartRef.chart) {
      currentChartRef.chart.destroy();
    }

    const chartCanvas = currentChartRef.getContext("2d");

    try {
      const newChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: Object.keys(ratings.histogram),
          datasets: [
            {
              label: "Ratings",
              data: Object.values(ratings.histogram),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      currentChartRef.chart = newChart;
    } catch (error) {
      console.error("Error creating the chart:", error);
    }

    return () => {
      if (currentChartRef.chart) {
        currentChartRef.chart.destroy();
      }
    };
  }, [ratings]);

  return <canvas ref={chartRef} />;
};

export default RatingsChart;
