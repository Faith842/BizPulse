// Initialize chart
let barChart = echarts.init(document.getElementById("bar-chart"));

// Global variables
let currentChartData = {
  months: [],
  revenue: [],
  expenses: [],
};

// Format currency
function formatCurrency(amount) {
  return (
    new Intl.NumberFormat("en-RW", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " RWF"
  );
}

// Update dashboard stats
function updateStats(data) {
  $("#total-balance").text(formatCurrency(data.total_balance || 0));
  $("#total-revenue").text(formatCurrency(data.total_revenue || 0));
  $("#total-expenses").text(formatCurrency(data.total_expenses || 0));
  $("#net-profit").text(formatCurrency(data.net_profit || 0));

  // Update period labels
  const periodText = data.period || "Current Period";
  $(".stat-period").text(periodText);
}

// Update top expenses list
function updateTopExpenses(expenses) {
  const container = $("#top-expenses");
  const loading = $("#expenses-loading");

  loading.hide();
  container.empty();

  if (expenses && expenses.length > 0) {
    expenses.forEach((expense) => {
      const li = $("<li>").html(`
                    <span class="product-name">${expense.productname}</span>
                    <span class="amount">${formatCurrency(
                      expense.total_amount
                    )}</span>
                `);
      container.append(li);
    });
  } else {
    container.append("<li>No expenses data available</li>");
  }
}

// Update top sales list
function updateTopSales(sales) {
  const container = $("#top-sales");
  const loading = $("#sales-loading");

  loading.hide();
  container.empty();

  if (sales && sales.length > 0) {
    sales.forEach((sale) => {
      const li = $("<li>").html(`
                    <span class="product-name">${sale.productname}</span>
                    <span class="amount">${formatCurrency(
                      sale.total_amount
                    )}</span>
                `);
      container.append(li);
    });
  } else {
    container.append("<li>No sales data available</li>");
  }
}

// Update chart
function updateChart(data) {
  const option = {
    title: {
      text: "Revenue vs Expenses Over Time",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let result = params[0].axisValue + "<br/>";
        params.forEach((param) => {
          result += `${param.seriesName}: ${formatCurrency(param.value)}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ["Revenue", "Expenses"],
      top: "10%",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: { show: true },
      },
    },
    xAxis: {
      type: "category",
      data: data.months || [],
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: function (value) {
          return formatCurrency(value);
        },
      },
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        data: data.revenue || [],
        itemStyle: { color: "#28a745" },
        markPoint: {
          data: [{ type: "max", name: "Max" }],
        },
      },
      {
        name: "Expenses",
        type: "bar",
        data: data.expenses || [],
        itemStyle: { color: "#dc3545" },
        markPoint: {
          data: [{ type: "max", name: "Max" }],
        },
      },
    ],
  };

  barChart.setOption(option);
}

// Load dashboard data
function loadDashboardData(filters = {}) {
  // Show loading states
  $("#expenses-loading").show();
  $("#sales-loading").show();

  $.ajax({
    url: "/dashboard/data",
    method: "GET",
    data: filters,
    success: function (response) {
      if (response.success) {
        updateStats(response.data);
        updateTopExpenses(response.data.top_expenses);
        updateTopSales(response.data.top_sales);
        updateChart(response.data.chart_data);
      } else {
        console.error("Error loading data:", response.error);
        alert("Error loading dashboard data");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      alert("Error loading dashboard data");
    },
  });
}

// Date range handling
function setupDateFilters() {
  const periodSelect = $("#period-select");
  const customRange = $("#custom-range");
  const applyFilter = $("#apply-filter");
  const resetFilter = $("#reset-filter");

  // Show/hide custom date range
  periodSelect.on("change", function () {
    if ($(this).val() === "custom") {
      customRange.show();
    } else {
      customRange.hide();
    }
  });

  // Apply filter
  applyFilter.on("click", function () {
    const period = periodSelect.val();
    const filters = { period: period };

    if (period === "custom") {
      const startDate = $("#start-date").val();
      const endDate = $("#end-date").val();

      if (!startDate || !endDate) {
        alert("Please select both start and end dates");
        return;
      }

      filters.start_date = startDate;
      filters.end_date = endDate;
    }

    loadDashboardData(filters);
  });

  // Reset filter
  resetFilter.on("click", function () {
    periodSelect.val("current_month");
    customRange.hide();
    $("#start-date").val("");
    $("#end-date").val("");
    loadDashboardData();
  });
}

// Auto-refresh data every 30 seconds
function setupAutoRefresh() {
  setInterval(() => {
    loadDashboardData();
  }, 30000); // 30 seconds
}

// Initialize dashboard when page loads
$(document).ready(function () {
  setupDateFilters();
  loadDashboardData();
  setupAutoRefresh();

  // Handle window resize for chart
  $(window).on("resize", function () {
    barChart.resize();
  });
});
// Add visual feedback for data updates
function addUpdateAnimation(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add("data-update");
    setTimeout(() => {
      element.classList.remove("data-update");
    }, 600);
  }
}

// Enhanced loadDashboardData function with animations
function loadDashboardData(filters = {}) {
  // Show loading states
  $("#expenses-loading").show();
  $("#sales-loading").show();

  // Add active state to date filter if custom filters are applied
  if (filters.period && filters.period !== "current_month") {
    $(".date-filter").addClass("filter-active");
  } else {
    $(".date-filter").removeClass("filter-active");
  }

  $.ajax({
    url: "/dashboard/data",
    method: "GET",
    data: filters,
    success: function (response) {
      if (response.success) {
        // Add animations for data updates
        addUpdateAnimation("total-balance");
        addUpdateAnimation("total-revenue");
        addUpdateAnimation("total-expenses");
        addUpdateAnimation("net-profit");

        updateStats(response.data);
        updateTopExpenses(response.data.top_expenses);
        updateTopSales(response.data.top_sales);
        updateChart(response.data.chart_data);

        // Refresh feather icons if any are added dynamically
        feather.replace();
      } else {
        console.error("Error loading data:", response.error);
        showNotification("Error loading dashboard data", "error");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      showNotification("Error loading dashboard data", "error");
    },
  });
}

// Notification function
function showNotification(message, type = "info") {
  // You can implement a custom notification system here
  console.log(`${type.toUpperCase()}: ${message}`);
}

// Initialize date inputs with current month range
function initializeDateInputs() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  $("#start-date").val(firstDay.toISOString().split("T")[0]);
  $("#end-date").val(lastDay.toISOString().split("T")[0]);
}

// Update document ready function
$(document).ready(function () {
  initializeDateInputs();
  setupDateFilters();
  loadDashboardData();
  setupAutoRefresh();

  // Handle window resize for chart
  $(window).on("resize", function () {
    barChart.resize();
  });
});

// let barChart = echarts.init(document.getElementById('bar-chart'))

// var option;

// option = {
//     title: {
//         text: 'Revenue vs Time',
//         subtext: 'Fake Data'
//     },
//     tooltip: {
//         trigger: 'axis'
//     },
//     legend: {
//         data: ['Rainfall', 'Evaporation']
//     },
//     toolbox: {
//         show: true,
//         feature: {
//             dataView: { show: true, readOnly: false },
//             magicType: { show: true, type: ['line', 'bar'] },
//             restore: { show: true },
//             saveAsImage: { show: true }
//         }
//     },
//     calculable: true,
//     xAxis: [
//     {
//         type: 'category',
//       // prettier-ignore
//         data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     }
//     ],
//     yAxis: [
//     {
//         type: 'value'
//     }
//     ],
//     series: [
//     {
//         name: 'Positive Revenue',
//         type: 'bar',
//         data: [
//         2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
//         ],
//         markPoint: {
//             data: [
//                 { type: 'max', name: 'Max' },
//                 { type: 'min', name: 'Min' }
//             ]
//         },
//         markLine: {
//             data: [{ type: 'average', name: 'Avg' }]
//         }
//     },
//     {
//         name: 'Negative Revenue',
//         type: 'bar',
//         data: [
//             2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
//         ],
//         markPoint: {
//             data: [
//             { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
//             { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
//             ]
//         },
//         markLine: {
//         data: [{ type: 'average', name: 'Avg' }]
//         }
//     }
//     ]
// };

// barChart.setOption(option)
