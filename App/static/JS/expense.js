// --- Helper Functions (Put these at the top of chart.js) ---

function cleanAmountToFloat(amountStr) {
    if (typeof amountStr !== 'string') {
        return 0.0;
    }
    const cleanedStr = amountStr.replace(/[^0-9.]/g, '');
    try {
        return parseFloat(cleanedStr) || 0.0;
    } catch (e) {
        return 0.0;
    }
}

function calculateProductTotalsFromTable() {
    const expenseTable = document.getElementById('expensetable');
    if (!expenseTable) return {};
    
    const rows = expenseTable.querySelectorAll('tbody tr'); 
    const productTotals = {};

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        
        // Product name is at index 2, Amount is at index 7.
        if (cells.length < 10) { return; } 

        const productName = cells[2].textContent.trim();
        let amountText = cells[7].textContent.trim();
        const amount = cleanAmountToFloat(amountText);
        
        if (productName && amount > 0) {
            productTotals[productName] = (productTotals[productName] || 0) + amount;
        }
    });
    return productTotals;
}

// -----------------------------------------------------------


// --- ECharts Initialization and Data Population ---

var expenseChartDom = document.getElementById('expensechart');
if (expenseChartDom) {
    
    // 1. Get the aggregated data from the table
    const aggregatedData = calculateProductTotalsFromTable();
    
    // 2. Transform the dictionary into the ECharts array format: 
    //    [['score', 'amount', 'product'], ...]
    let chartData = [['score', 'amount', 'product']]; // Start with header row
    
    // A placeholder 'score' (dimension 0) is needed for the visual map, 
    // even if it's not meaningful data. We'll use a constant like 50.
    const scorePlaceholder = 50; 
    let maxAmount = 0;
    
    for (const product in aggregatedData) {
        if (aggregatedData.hasOwnProperty(product)) {
            const totalAmount = aggregatedData[product];
            chartData.push([scorePlaceholder, totalAmount, product]);
            if (totalAmount > maxAmount) {
                maxAmount = totalAmount;
            }
        }
    }
    
    // If no data is found, use a placeholder row
    if (chartData.length === 1) {
        chartData.push([scorePlaceholder, 100, 'No Expenses Recorded']);
        maxAmount = 100;
    }


    // 3. Initialize Chart and Set Options
    var expenseChart = echarts.init(expenseChartDom, "dark");
    
    var expenseoption = {
        title: {
            text: 'Total Expenses by Product',
            left: 'center',
            textStyle: {
                color: '#fff' 
            }
        },
        dataset: {
            source: chartData // Use the dynamically generated data
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                // Display the product name and the total amount
                return `<b>${params[0].data[2]}</b><br/>Total: ${params[0].data[1].toFixed(2)} RWF`;
            }
        },
        grid: { 
        containLabel: true,
        left: '3%',
        right: '10%',
        top: '10%',
        bottom: 70,      //  INCREASE BOTTOM MARGIN (e.g., 70px) to prevent overlap with the visualMap and X-axis labels.
        },
        // X-axis is the numeric value (amount)
        xAxis: { 
            name: 'Total Expense Amount (RWF)', 
            type: 'value',
            axisLabel: {
                formatter: function (value) {
                    return value.toFixed(0); // Optional: format large numbers
                }
            }
        },
        // Y-axis is the categorical data (product name)
        yAxis: { 
            type: 'category' 
        },
        visualMap: {
            orient: 'horizontal', // Keeps the horizontal bar orientation
            left: 'center',       // Centers it horizontally
            bottom: 10,           //  SET BOTTOM POSITION (10px from the bottom edge)
            min: 0,               
            max: Math.max(maxAmount * 1.1, 100), // Use dynamic max
            text: ['High Amount', 'Low Amount'],
            dimension: 1, // Targets the 'amount' column (index 1)
            inRange: {
                color: ['#00BFFF', '#35045e', '#800505'] 
            }
        },

        series: [
            {
                type: 'bar',
                encode: {
                    // Map X to amount (index 1), Y to product (index 2)
                    x: 'amount', 
                    y: 'product' 
                }
            }
        ]
    };
    
    expenseChart.setOption(expenseoption);
    
    // Optional: make the chart responsive
    window.addEventListener('resize', expenseChart.resize);
}