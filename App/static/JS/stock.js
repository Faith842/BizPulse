// stock-chart.js - Enhanced version of your existing chart logic
document.addEventListener("DOMContentLoaded", function () {
  var stockDom = document.getElementById("stock-graph");
  if (!stockDom) return;

  // Initialize chart with dark theme
  var stockChart = echarts.init(stockDom, "dark");

  // Extract table data
  const table = document.getElementById("stocktable");
  if (!table) {
    console.warn("Stock table not found");
    showNoDataChart(stockChart);
    return;
  }

  const rows = table.querySelectorAll("tbody tr");
  const stockData = [];

  // Process table data
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length > 7) {
      stockData.push({
        stockid: cells[0].textContent.trim(),
        stockstatus: cells[1].textContent.trim(),
        productname: cells[2].textContent.trim(),
        description: cells[3].textContent.trim(),
        date: cells[4].textContent.trim(),
        debit_credit: cells[5].textContent.trim(),
        buyingprice: Number(cells[6].textContent.trim()) || 0,
        quantity: Number(cells[7].textContent.trim()) || 0,
      });
    }
  });

  // Check if we have data
  if (stockData.length === 0) {
    showNoDataChart(stockChart);
    return;
  }

  // Prepare line chart data
  const products = [...new Set(stockData.map((item) => item.productname))];
  const dates = [...new Set(stockData.map((item) => item.date))].sort();

  const lineDataset = [["date", ...products]];

  dates.forEach((date) => {
    const row = [date];
    products.forEach((product) => {
      const qty = stockData
        .filter((item) => item.date === date && item.productname === product)
        .reduce((acc, cur) => acc + cur.quantity, 0);
      row.push(qty);
    });
    lineDataset.push(row);
  });

  // Prepare pie chart data (total stock per product)
  const pieData = products
    .map((product) => {
      const total = stockData
        .filter((item) => item.productname === product)
        .reduce((acc, cur) => {
          // Calculate net stock level
          if (cur.stockstatus === "Stock-In") return acc + cur.quantity;
          // Assuming "Stock-Out" represents a decrease in quantity
          else return acc - cur.quantity;
        }, 0);
      return {
        name: product,
        value: Math.max(0, total), // Ensure non-negative values
      };
    })
    .filter((item) => item.value > 0); // Only show products with stock

  // ECharts option (Updated for a single pie chart)
  const stockOption = {
    backgroundColor: "transparent",
    legend: {
      top: "bottom",
      textStyle: {
        color: "#9ca3af",
      },
      type: "scroll",
    },
    tooltip: {
      trigger: "axis",
      showContent: true,
      backgroundColor: "rgba(30, 30, 46, 0.95)",
      borderColor: "#6366f1",
      textStyle: {
        color: "#e2e8f0",
      },
    },
    dataset: { source: lineDataset },

    // Grid for line chart
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: "45%",
    },

    xAxis: {
      type: "category",
      gridIndex: 0,
      axisLine: {
        lineStyle: {
          color: "#4b5563",
        },
      },
      axisLabel: {
        color: "#9ca3af",
      },
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
      axisLine: {
        lineStyle: {
          color: "#4b5563",
        },
      },
      axisLabel: {
        color: "#9ca3af",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },

    series: products
      .map((product, index) => ({
        name: product,
        type: "line",
        smooth: true,
        seriesLayoutBy: "column",
        emphasis: { focus: "series" },
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: {
          width: 3,
        },
        symbolSize: 6,
      }))
      .concat([
        // Single Pie Chart (Centered in the upper space)
        {
          type: "pie",
          id: "pie-net-stock",
          radius: ["0%", "35%"],
          center: ["50%", "22%"],
          data: pieData,
          label: {
            formatter: "{b}: {c} ({d}%)",
            position: "outer",
            alignTo: "labelLine",
            color: "#e2e8f0",
          },
          emphasis: {
            focus: "self",
            scale: true,
            scaleSize: 5,
          },
          itemStyle: {
            borderRadius: 6,
            borderColor: "rgba(30, 30, 46, 0.95)",
            borderWidth: 2,
          },
        },
      ]),
  };

  // Update pie chart on hover
  stockChart.on("updateAxisPointer", function (event) {
    const xAxisInfo = event.axesInfo && event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      stockChart.setOption({
        series: [
          {
            id: "pie-net-stock",
            label: { formatter: "{b}: {@[" + dimension + "]} ({d}%)" },
            encode: { value: dimension, tooltip: dimension },
          },
        ],
      });
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    stockChart.resize();
  });

  stockChart.setOption(stockOption);
});

function showNoDataChart(chart) {
  const option = {
    backgroundColor: "transparent",
    title: {
      text: "No Stock Data Available",
      left: "center",
      top: "center",
      textStyle: {
        color: "#9ca3af",
        fontSize: 16,
        fontWeight: "normal",
      },
    },
    graphic: {
      type: "text",
      left: "center",
      top: "45%",
      style: {
        text: "Add stock records to see analytics",
        fontSize: 14,
        fill: "#6b7280",
      },
    },
  };
  chart.setOption(option);
}

// document.addEventListener('DOMContentLoaded', function () {
//     var stockDom = document.getElementById('stock-graph');
//     if (!stockDom) return;

//     var stockChart = echarts.init(stockDom, 'dark');

//     // --- Extract table data ---
//     const table = document.getElementById('stocktable');
//     if (!table) return;

//     const rows = table.querySelectorAll('tbody tr');
//     const stockData = [];

//     rows.forEach(row => {
//         const cells = row.querySelectorAll('td');
//         // Ensure you handle cases where cells might not exist or content is not a valid number
//         if (cells.length > 7) {
//             stockData.push({
//                 stockid: cells[0].textContent.trim(),
//                 stockstatus: cells[1].textContent.trim(),
//                 productname: cells[2].textContent.trim(),
//                 description: cells[3].textContent.trim(),
//                 date: cells[4].textContent.trim(),
//                 debit_credit: cells[5].textContent.trim(),
//                 // Use Number(content) || 0 for safe conversion
//                 buyingprice: Number(cells[6].textContent.trim()) || 0,
//                 quantity: Number(cells[7].textContent.trim()) || 0
//             });
//         }
//     });

//     // --- Prepare line chart data ---
//     const products = [...new Set(stockData.map(item => item.productname))];
//     const dates = [...new Set(stockData.map(item => item.date))].sort();

//     const lineDataset = [['date', ...products]];

//     dates.forEach(date => {
//         const row = [date];
//         products.forEach(product => {
//             const qty = stockData
//                 .filter(item => item.date === date && item.productname === product)
//                 .reduce((acc, cur) => acc + cur.quantity, 0);
//             row.push(qty);
//         });
//         lineDataset.push(row);
//     });

//     // --- Prepare pie chart data (total stock per product) ---
//     const pieData = products.map(product => {
//         const total = stockData
//             .filter(item => item.productname === product)
//             .reduce((acc, cur) => {
//                 // Calculate net stock level
//                 if (cur.stockstatus === 'Stock-In') return acc + cur.quantity;
//                 // Assuming "Stock-Out" represents a decrease in quantity
//                 else return acc - cur.quantity;
//             }, 0);
//         return { name: product, value: total };
//     });

//     // --- ECharts option (Updated for a single pie chart) ---
//     const stockOption = {
//         // Move legend to the bottom to avoid interfering with the charts at the top
//         legend: { top: 'bottom' },
//         tooltip: { trigger: 'axis', showContent: true },
//         dataset: { source: lineDataset },

//         // PUSH THE LINE CHART DOWN to leave space for the pie chart at the top
//         grid: {
//             left: '10%',
//             right: '10%',
//             bottom: '10%',
//             top: '45%' // Line chart grid starts 45% down
//         },

//         xAxis: { type: 'category', gridIndex: 0 },
//         yAxis: { type: 'value', gridIndex: 0 },

//         series: products.map(() => ({
//             type: 'line',
//             smooth: true,
//             seriesLayoutBy: 'column',
//             emphasis: { focus: 'series' },
//             // Explicitly associate with the defined grid/axes
//             xAxisIndex: 0,
//             yAxisIndex: 0
//         })).concat([
//             // Single Pie Chart (Centered in the upper space)
//             {
//                 type: 'pie',
//                 id: 'pie-net-stock',
//                 radius: ['0%', '35%'],
//                 // Center it horizontally in the upper space (50%)
//                 center: ['50%', '22%'],
//                 data: pieData,
//                 label: {
//                     formatter: '{b}: {c} ({d}%)',
//                     position: 'outer',
//                     alignTo: 'labelLine'
//                 },
//                 emphasis: { focus: 'self' }
//             }
//         ])
//     };

//     // --- Update pie chart on hover ---
//     stockChart.on('updateAxisPointer', function (event) {
//         const xAxisInfo = event.axesInfo && event.axesInfo[0];
//         if (xAxisInfo) {
//             // dimension is used to look up the column index in the dataset (date + 1)
//             const dimension = xAxisInfo.value + 1;
//             stockChart.setOption({
//                 series: [
//                     {
//                         id: 'pie-net-stock', // Updates on hover
//                         label: { formatter: '{b}: {@[' + dimension + ']} ({d}%)' },
//                         encode: { value: dimension, tooltip: dimension }
//                     }
//                 ]
//             });
//         }
//     });

//     stockChart.setOption(stockOption);
// });
