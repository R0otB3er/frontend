import { chartsConfig } from "@/configs";

const DepartmentSalesChartConfig = ({ 
  data = [], 
  title = "Department Sales",
  description = "Sales by department over time",
  color = "blue",
  type = "line"  // Default to line chart for multiple series
}) => {
  // Group data by department
  const departments = [...new Set(data.map(item => item.department))];
  
  // Create series for each department
  const series = departments.map(dept => {
    const deptData = data.filter(item => item.department === dept);
    return {
      name: dept,
      data: deptData.map(item => item.sales)
    };
  });

  // Get unique dates (x-axis categories)
  const dates = [...new Set(data.map(item => item.date))];
  const categories = dates.map(date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  // Generate distinct colors for each department
  const departmentColors = [
    "#388e3c",  // green
    "#d32f2f",  // red
    "#1976d2",  // blue
    "#ffa000",  // amber
    "#7b1fa2",  // purple
  ];

  return {
    type: type,
    height: 300,  // Slightly taller to accommodate legend
    series: series,
    options: {
      ...chartsConfig,
      colors: departmentColors,
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
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    },
  };
};

export default {
  getConfig: DepartmentSalesChartConfig
};