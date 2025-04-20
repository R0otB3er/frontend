import { chartsConfig } from "@/configs";

// Utility to format all dates to month-year
const formatMonth = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });

export const TopVendorsChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return {
      type: "bar",
      height: 300,
      series: [],
      options: {
        xaxis: { categories: [] },
        yaxis: { title: { text: "Total Sales ($)" } },
      },
    };
  }
  
  const vendorTotals = {};

  data.forEach((item) => {
    vendorTotals[item.vendor_name] = (vendorTotals[item.vendor_name] || 0) + parseFloat(item.total_sales);
  });

  const topVendors = Object.entries(vendorTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    type: "bar",
    height: 300,
    series: [
      {
        name: "Total Sales",
        data: topVendors.map(([, total]) => parseFloat(total.toFixed(2))),
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0"],
      xaxis: {
        categories: topVendors.map(([name]) => name),
        title: { text: "Vendor" },
      },
      yaxis: {
        title: { text: "Total Sales ($)" },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          borderRadius: 6,
        },
      },
    },
  };
};

export const TopMerchItemsOverTimeChart = ({ data = [] }) => {

  if (!data || data.length === 0) {
    return {
      type: "bar",
      height: 300,
      series: [],
      options: {
        xaxis: { categories: [] },
        yaxis: { title: { text: "Total Sales ($)" } },
      },
    };
  }

  const formatted = data.map((item) => ({
    ...item,
    sale_month: formatMonth(item.sale_date),
    total_sales: parseFloat(item.total_sales),
  }));

  const totalPerItem = {};
  formatted.forEach((item) => {
    totalPerItem[item.Item_Name] = (totalPerItem[item.Item_Name] || 0) + item.total_sales;
  });

  const topItems = Object.entries(totalPerItem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

    const months = [...new Set(formatted.map((i) => i.sale_month))].sort(
      (a, b) => new Date(a) - new Date(b)
    );
    

  const series = topItems.map((itemName) => {
    const monthly = months.map((month) => {
      const record = formatted.find((i) => i.Item_Name === itemName && i.sale_month === month);
      return record ? record.total_sales : 0;
    });
    return { name: itemName, data: monthly };
  });

  return {
    type: "line",
    height: 300,
    series,
    options: {
      ...chartsConfig,
      colors: ["#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0"],
      xaxis: {
        categories: months,
        title: { text: "Month" },
      },
      yaxis: {
        title: { text: "Sales ($)" },
      },
      stroke: { width: 2 },
    },
  };
};

export const ItemTypeStackedChart = ({ data = [] }) => {

  if (!data || data.length === 0) {
    return {
      type: "bar",
      height: 300,
      series: [],
      options: {
        xaxis: { categories: [] },
        yaxis: { title: { text: "Total Sales ($)" } },
      },
    };
  }

  const formatted = data.map((item) => ({
    ...item,
    sale_month: formatMonth(item.sale_date),
    total_sales: parseFloat(item.total_sales),
  }));

  const months = [...new Set(formatted.map((i) => i.sale_month))].sort(
    (a, b) => new Date(a) - new Date(b)
  );
  
  const types = [...new Set(formatted.map((i) => i.item_types))];

  const series = types.map((typeName) => {
    const monthly = months.map((month) => {
      const sum = formatted
        .filter((i) => i.sale_month === month && i.item_types === typeName)
        .reduce((acc, cur) => acc + cur.total_sales, 0);
      return parseFloat(sum.toFixed(2));
    });
    return { name: typeName, data: monthly };
  });

  return {
    type: "bar",
    height: 300,
    series,
    options: {
      ...chartsConfig,
      colors: ["#388e3c", "#d32f2f", "#1976d2", "#ffa000", "#7b1fa2", "#f57c00"],
      chart: {
        stacked: true,
      },
      xaxis: {
        categories: months,
        title: { text: "Month" },
      },
      yaxis: {
        title: { text: "Sales by Item Type ($)" },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "45%",
        },
      },
    },
  };
};
