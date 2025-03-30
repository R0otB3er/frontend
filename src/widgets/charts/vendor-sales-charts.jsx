import PropTypes from 'prop-types';
import { chartsConfig } from "@/configs";
import StatisticsChart from "./StatisticsChart";

const SalesChart = ({ 
  data = [], 
  title = "Sales Chart",
  description = "Total sales over time",
  color = "blue",
  type = "bar"
}) => {
  // Transform the data into chart format
  const series = [{
    name: "Sales",
    data: data.map(item => item.sales)
  }];

  const categories = data.map(item => {
    // If date is a string, parse it
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  const chartConfig = {
    type: type,
    height: 220,
    series: series,
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: categories,
      },
    },
  };

  return (
    <StatisticsChart
      color={color}
      chart={chartConfig}
      title={title}
      description={description}
    />
  );
};

SalesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date)
      ]).isRequired,
      sales: PropTypes.number.isRequired
    })
  ).isRequired,
  title: PropTypes.node,
  description: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.oneOf(['bar', 'line', 'area']),
};

SalesChart.defaultProps = {
  data: [],
  title: "Sales Chart",
  description: "Total sales over time",
  color: "blue",
  type: "bar"
};

export default SalesChart;