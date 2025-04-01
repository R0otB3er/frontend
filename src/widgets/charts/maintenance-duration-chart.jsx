import { chartsConfig } from "@/configs";

const MaintenanceDurationChartConfig = ({ data = [], type = "bar" }) => {
  const categories = data.map(item => item.category);
  const durations = data.map(item => item.duration);

  return {
    type,
    height: 300,
    series: [
      {
        name: "Duration (hrs)",
        data: durations,
      },
    ],
    options: {
      ...chartsConfig,
      xaxis: {
        ...chartsConfig.xaxis,
        categories,
        title: {
          text: "Maintenance Category",
        },
      },
      yaxis: {
        title: {
          text: "Time (hrs)",
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 4,
        },
      },
      colors: ["#FB8C00"], // Orange
      dataLabels: {
        enabled: true,
      },
    },
  };
};

export default {
  getConfig: MaintenanceDurationChartConfig,
};
