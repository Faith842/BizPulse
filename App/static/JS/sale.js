// --- Helper Functions ---
function cleanAmountToFloat(amountStr) {
    if (typeof amountStr !== 'string') return 0.0;
    const cleanedStr = amountStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanedStr) || 0.0;
}

// Aggregate sales data from the table
function calculateSalesDataFromTable() {
    const salesTable = document.getElementById('salestable');
    if (!salesTable) return [];

    const rows = salesTable.querySelectorAll('tbody tr');
    const salesData = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 9) return;

        const date = cells[1].textContent.trim();
        const product = cells[2].textContent.trim();
        const amount = cleanAmountToFloat(cells[8].textContent.trim());

        salesData.push({ Date: date, Product: product, Amount: amount });
    });

    return salesData;
}

// -----------------------------------------------------------

// --- ECharts Line Chart ---
var salesChartDom = document.getElementById('sales-graph');
if (salesChartDom) {
    var salesChart = echarts.init(salesChartDom, 'dark');

    const rawData = calculateSalesDataFromTable();

    // Unique products
    const products = Array.from(new Set(rawData.map(d => d.Product)));

    const datasetWithFilters = [];
    const seriesList = [];

    products.forEach(product => {
        const datasetId = 'dataset_' + product.replace(/\s+/g, '_');

        datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: { dimension: 'Product', '=': product }
            }
        });

        seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: true,
            name: product,
            encode: {
                x: 'Date',
                y: 'Amount'
            },
            emphasis: { focus: 'series' }
        });
    });

    const dataset = [{ id: 'dataset_raw', source: rawData }, ...datasetWithFilters];

    const salesOption = {
        animationDuration: 1000,
        dataset: dataset,
        title: { text: 'Sales Amount per Product', left: 'center', textStyle: { color: '#fff' } },
        tooltip: { trigger: 'axis', order: 'valueDesc' },
        xAxis: { type: 'category', name: 'Date', nameLocation: 'middle' },
        yAxis: { name: 'Amount (RWF)' },
        grid: { right: 140, bottom: 60 },
        series: seriesList
    };

    salesChart.setOption(salesOption);
    window.addEventListener('resize', salesChart.resize);
}
