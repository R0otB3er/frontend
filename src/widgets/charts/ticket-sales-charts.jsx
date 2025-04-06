import { chartsConfig } from "@/configs";

const DepartmentChartConfig = ({ 
  data = [], 
  title = "Department Sales",
  description = "Sales by department over time",
  color = "blue",
  type = "line"  // Default to line chart for multiple series
}) => {
  // Group data by department
  const departments = [...new Set(data.map(item => item.department_name))];
  
  // Create series for each department
  const series = departments.map(dept => {
    const deptData = data.filter(item => item.department_name === dept);
    return {
      name: dept,
      data: deptData.map(item => item.tickets_sold)
    };
  });

  // Get unique dates (x-axis categories)
  const dates = [...new Set(data.map(item => item.sale_date))];
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

const AttractionChartConfig = ({ 
  data = [], 
  title = "Attraction Sales",
  description = "Sales by attraction over time",
  color = "blue",
  type = "line"  // Default to line chart for multiple series
}) => {
  // Group data by department
  const attractions = [...new Set(data.map(item => item.Attraction_Name))];
  
  // Create series for each department
  const series = attractions.map(att => {
    const attData = data.filter(item => item.Attraction_Name === att);
    return {
      name: att,
      data: attData.map(item => item.tickets_sold)
    };
  });

  // Get unique dates (x-axis categories)
  const dates = [...new Set(data.map(item => item.sale_date))];
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

const GeneralChartConfig = ({ 
  data = [], 
  title = "General Ticket Sales",
  description = "Sales of general admission over time",
  color = "blue",
  type = "line"  // Default to line chart for multiple series
}) => {
  // Group data by department
  const attractions = [...new Set(data.map(item => item.Attraction_Name))];
  
  // Create series for each department
  const series = attractions.map(att => {
    const attData = data.filter(item => item.Attraction_Name === att);
    return {
      name: att,
      data: attData.map(item => item.tickets_sold)
    };
  });

  // Get unique dates (x-axis categories)
  const dates = [...new Set(data.map(item => item.sale_date))];
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

const PersonTypeChartConfig = ({ 
  data = [], 
  title = "Sales by Person Type",
  description = "Sales by type of visitor over time",
  color = "blue",
  type = "line"  // Default to line chart for multiple series
}) => {
  // Group data by department
  const pTypes = [...new Set(data.map(item => item.ticket_person))];
  
  // Create series for each department
  const series = pTypes.map(pt => {
    const ptData = data.filter(item => item.ticket_person === pt);
    return {
      name: pt,
      data: ptData.map(item => item.tickets_sold)
    };
  });

  // Get unique dates (x-axis categories)
  const dates = [...new Set(data.map(item => item.sale_date))];
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

const MemTypeChartConfig = ({ 
  data = [], 
  title = "Sales by Membership Type",
  description = "Sales by type of member over time",
  color = "blue",
  type = "line"  // Default to line chart for multiple series
}) => {
  // Group data by department
  const memTypes = [...new Set(data.map(item => item.membership_Type))];
  
  // Create series for each department
  const series = memTypes.map(mt => {
    const mtData = data.filter(item => item.membership_Type === mt);
    return {
      name: mt,
      data: mtData.map(item => item.tickets_sold)
    };
  });

  // Get unique dates (x-axis categories)
  const dates = [...new Set(data.map(item => item.sale_date))];
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

export {
  DepartmentChartConfig,
  AttractionChartConfig,
  GeneralChartConfig,
  PersonTypeChartConfig,
  MemTypeChartConfig
};