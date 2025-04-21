import { chartsConfig } from "@/configs";

const formatLabel = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

const groupBy = (array, key) =>
  array.reduce((acc, obj) => {
    const prop = obj[key];
    if (!acc[prop]) acc[prop] = [];
    acc[prop].push(obj);
    return acc;
  }, {});

const PersonTypeSalesBarChart = (data = []) => {
  const grouped = groupBy(data, "ticket_person");
  const categories = Object.keys(grouped);
  const series = [
    {
      name: "Tickets Sold",
      data: categories.map((key) =>
        grouped[key].reduce((sum, row) => sum + (row.tickets_sold || 0), 0)
      ),
    },
  ];

  return {
    type: "bar",
    height: 300,
    series,
    options: {
      ...chartsConfig,
      colors: ["#2196f3", "#4caf50", "#f44336", "#ff9800"],
      chart: {
        type: "bar",
        stacked: false,
      },
      xaxis: {
        categories,
        title: { text: "Person Type" },
        labels: {
          style: { fontSize: "12px" },
        },
      },
      yaxis: {
        title: { text: "Tickets Sold" },
        labels: {
          formatter: formatLabel,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          borderRadius: 6,
        },
      },
      title: {
        text: "Ticket Sales by Person Type",
        align: "left",
      },
    },
  };
};

const MembershipSalesBarChart = (data = []) => {
  const grouped = groupBy(data, "membership_type");
  const categories = Object.keys(grouped);
  const series = [
    {
      name: "Tickets Sold",
      data: categories.map((key) =>
        grouped[key].reduce((sum, row) => sum + (row.tickets_sold || 0), 0)
      ),
    },
  ];

  return {
    type: "bar",
    height: 300,
    series,
    options: {
      ...chartsConfig,
      colors: ["#9c27b0", "#03a9f4", "#8bc34a", "#ff9800"],
      chart: {
        type: "bar",
        stacked: false,
      },
      xaxis: {
        categories,
        title: { text: "Membership Type" },
        labels: {
          style: { fontSize: "12px" },
        },
      },
      yaxis: {
        title: { text: "Tickets Sold" },
        labels: {
          formatter: formatLabel,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          borderRadius: 6,
        },
      },
      title: {
        text: "Ticket Sales by Membership Type",
        align: "left",
      },
    },
  };
};

const TotalSalesOverTimeChart = (data = []) => {
  const byDate = {};

  data.forEach((row) => {
    const rawDate = row.sale_date || row.date || row.Bought_Date;
    const parsedDate = new Date(rawDate);

    // Skip invalid dates
    if (isNaN(parsedDate)) return;

    const formatted = parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    byDate[formatted] = (byDate[formatted] || 0) + (row.tickets_sold || row.ticketsSold || 0);
  });

  const sortedDates = Object.keys(byDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const series = [
    {
      name: "Total Tickets Sold",
      data: sortedDates.map((d) => byDate[d]),
    },
  ];

  return {
    type: "line",
    height: 300,
    series,
    options: {
      ...chartsConfig,
      colors: ["#673ab7"],
      stroke: {
        width: 3,
        curve: "smooth",
      },
      xaxis: {
        categories: sortedDates,
        title: { text: "Date" },
        labels: {
          rotate: -45,
        },
      },
      yaxis: {
        title: { text: "Tickets Sold" },
        labels: {
          formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val),
        },
      },
      title: {
        text: "Ticket Sales Over Time",
        align: "left",
      },
    },
  };
};


export {
  PersonTypeSalesBarChart,
  TotalSalesOverTimeChart,
  MembershipSalesBarChart,
};

