import { chartsConfig } from "@/configs";

const MaintenanceCostChartConfig = ({ data = [], type = "line" }) => {
  const categories = data.map((item) => {
    const start = new Date(item.Start_Date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = new Date(item.End_Date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${start} – ${end}`;
  });

  return {
    type,
    height: 300,
    series: [
      {
        name: "Cost",
        data: data.map((item) => item.cost),
      },
    ],
    options: {
      ...chartsConfig,
      xaxis: {
        ...chartsConfig.xaxis,
        categories,
        title: {
          text: "Maintenance Duration",
        },
      },
      yaxis: {
        title: {
          text: "Cost ($)",
        },
      },
      colors: ["#4CAF50"], // Green for cost
      dataLabels: {
        enabled: true,
      },
    },
  };
};

export default {
  getConfig: MaintenanceCostChartConfig,
};
