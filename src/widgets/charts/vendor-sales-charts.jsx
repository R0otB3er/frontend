import { chartsConfig } from "@/configs";

const DepartmentSalesChartConfig = ({ 
  data = [], 
  title = "Department Sales",
  description = "Sales by department over time",
  color = "white",
  type = "line"
}) => {
  const departments = [...new Set(data.map(item => item.department_name))];

  const series = departments.map(dept => {
    const deptData = data.filter(item => item.department_name === dept);
    return {
      name: dept,
      data: deptData.map(item => item.total_sales)
    };
  });

  const dates = [...new Set(data.map(item => item.sale_date))];
  const categories = dates.map(date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  const departmentColors = ["#388e3c", "#d32f2f", "#1976d2", "#ffa000", "#7b1fa2"];

  return {
    type: type,
    height: 300,
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
      yaxis: {
        title: {
          text: "Total Sales by Department ($)"
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    },
  };
};

const VendorSalesChartConfig = ({ 
  data = [], 
  type = "line"
}) => {
  const departments = [...new Set(data.map(item => item.vendor_name))];

  const series = departments.map(vend => {
    const deptData = data.filter(item => item.vendor_name === vend);
    return {
      name: vend,
      data: deptData.map(item => item.total_sales)
    };
  });

  const dates = [...new Set(data.map(item => item.sale_date))];
  const categories = dates.map(date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  const departmentColors = ["#388e3c", "#d32f2f", "#1976d2", "#ffa000", "#7b1fa2"];

  return {
    type: type,
    height: 300,
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
      yaxis: {
        title: {
          text: "Total Sales by Vendor ($)"
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    },
  };
};

const MerchSalesChartConfig = ({
  data = [],
  type = "line",
  selectedDepartment = "all",
  selectedItemType = "all",
  selectedMerchItem = "all"
}) => {
  const filteredData = data.filter(item => {
    const matchesDepartment = selectedDepartment === "all" || item.Department_ID == selectedDepartment;
    const matchesItemType = selectedItemType === "all" || item.item_typeID == selectedItemType;
    const matchesMerchItem = selectedMerchItem === "all" || item.Merchandise_ID == selectedMerchItem;
    return matchesDepartment && matchesItemType && matchesMerchItem;
  });

  const formattedData = filteredData.map(item => ({
    ...item,
    sale_date: new Date(item.sale_date).toISOString().split("T")[0],
    total_sales: parseFloat(item.total_sales) || 0
  }));

  const dates = [...new Set(formattedData.map(item => item.sale_date))].sort();

  const totalSalesPerItem = {};
  formattedData.forEach(item => {
    totalSalesPerItem[item.Item_Name] = (totalSalesPerItem[item.Item_Name] || 0) + item.total_sales;
  });

  const topItems = Object.entries(totalSalesPerItem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([itemName]) => itemName);

  const series = topItems.map(itemName => {
    const dailySales = dates.map(date => {
      const entry = formattedData.find(d => d.sale_date === date && d.Item_Name === itemName);
      return entry ? entry.total_sales : 0;
    });
    return { name: itemName, data: dailySales };
  });

  const categories = dates.map(date => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  const departmentColors = ["#388e3c", "#d32f2f", "#1976d2", "#ffa000", "#7b1fa2", "#f57c00"];

  return {
    type: type,
    height: 300,
    series: series,
    options: {
      ...chartsConfig,
      colors: departmentColors.slice(0, series.length),
      xaxis: {
        ...chartsConfig.xaxis,
        categories,
      },
      yaxis: {
        title: {
          text: "Highest Sales by Merchandise ($)"
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    },
  };
};


const ItemTypeSalesChartConfig = ({ data = [], type = "line" }) => {
  const formattedData = data.map(item => ({
    ...item,
    sale_date: new Date(item.sale_date).toISOString().split("T")[0],
    total_sales: parseFloat(item.total_sales) || 0
  }));

  const dates = [...new Set(formattedData.map(item => item.sale_date))].sort();

  const types = [...new Set(formattedData.map(item => item.item_types))];

  const series = types.map(typeName => {
    const salesPerDay = dates.map(date => {
      const total = formattedData
        .filter(d => d.sale_date === date && d.item_types === typeName)
        .reduce((sum, item) => sum + item.total_sales, 0);
      return total;
    });
  
    return {
      name: typeName,
      data: salesPerDay
    };
  });
  

  const categories = dates.map(date => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  const departmentColors = ["#388e3c", "#d32f2f", "#1976d2", "#ffa000", "#7b1fa2", "#f57c00", "#0288d1"];

  return {
    type,
    height: 300,
    series,
    options: {
      ...chartsConfig,
      colors: departmentColors.slice(0, series.length),
      xaxis: {
        ...chartsConfig.xaxis,
        categories
      },
      yaxis: {
        title: {
          text: "Total Sales by Item Type ($)"
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    }
  };
};


export {
  ItemTypeSalesChartConfig,
  MerchSalesChartConfig,
  VendorSalesChartConfig,
  DepartmentSalesChartConfig
};
