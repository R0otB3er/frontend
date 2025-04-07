import { chartsConfig } from "@/configs";

const MaintenanceDurationChartConfig = ({ data = [], type = "bar" }) => {
  // No more rebucketing! Just use backend-provided data.
  const categories = data.map((d) => d.category);
  const counts = data.map((d) => d.duration);

  return {
    type,
    height: 300,
    series: [
      {
        name: "Number of Tasks",
        data: counts,
      },
    ],
    options: {
      ...chartsConfig,
      xaxis: {
        ...chartsConfig.xaxis,
        categories,
        title: { text: "Duration Ranges" },
      },
      yaxis: {
        title: { text: "Number of Maintenance Tasks" },
        allowDecimals: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 4,
        },
      },
      colors: ["#FB8C00"],
      dataLabels: {
        enabled: true,
      },
    },
  };
};

export default {
  getConfig: MaintenanceDurationChartConfig,
};
