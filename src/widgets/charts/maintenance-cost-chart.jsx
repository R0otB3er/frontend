import { chartsConfig } from "@/configs";

const MaintenanceCostChartConfig = ({ data = [], type = "line" }) => {
  const categories = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });

  return {
    type,
    height: 300,
    series: [
      {
        name: "Cost",
        data: data.map(item => item.cost),
      },
    ],
    options: {
      ...chartsConfig,
      xaxis: {
        ...chartsConfig.xaxis,
        categories,
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Cost ($)",
        },
      },
      colors: ["#4CAF50"], // Green color for cost
      dataLabels: {
        enabled: true,
      },
    },
  };
};

export default {
  getConfig: MaintenanceCostChartConfig,
};
