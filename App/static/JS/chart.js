// ---------------- BAR CHART ----------------
var barChartDom = document.getElementById('bar-chart');
if (barChartDom) {
    let barChart = echarts.init(barChartDom, "dark");
    
    let baroption = {
        title: {
            text: 'Revenue vs Time',
            subtext: 'Fake Data'
        },
        tooltip: { trigger: 'axis' },
        legend: { data: ['Positive Revenue', 'Negative Revenue'] },
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: [{
            type: 'category',
            data: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        }],
        yAxis: [{ type: 'value' }],
        series: [
            {
                name: 'Positive Revenue',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint: { data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }] },
                markLine: { data: [{ type: 'average', name: 'Avg' }] }
            },
            {
                name: 'Negative Revenue',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint: { data: [{ name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 }, { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }] },
                markLine: { data: [{ type: 'average', name: 'Avg' }] }
            }
        ]
    };
    
    barChart.setOption(baroption);
}


// ---------------- STOCK GRAPH ----------------
var stockDom = document.getElementById('stock-graph');
if (stockDom) {
    var stockChart = echarts.init(stockDom, 'dark');
    var stockoption;
    
    setTimeout(function () {
        stockoption = {
            legend: {},
            tooltip: { trigger: 'axis', showContent: false },
            dataset: {
                source: [
                    ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                    ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
                    ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
                    ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
                    ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
                ]
            },
            xAxis: { type: 'category' },
            yAxis: { gridIndex: 0 },
            grid: { top: '55%' },
            series: [
                { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
                { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
                { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
                { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
                {
                    type: 'pie',
                    id: 'pie',
                    radius: '30%',
                    center: ['50%', '25%'],
                    emphasis: { focus: 'self' },
                    label: { formatter: '{b}: {@2012} ({d}%)' },
                    encode: { itemName: 'product', value: '2012', tooltip: '2012' }
                }
            ]
        };
    
        stockChart.on('updateAxisPointer', function (event) {
            const xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
                const dimension = xAxisInfo.value + 1;
                stockChart.setOption({
                    series: {
                        id: 'pie',
                        label: { formatter: '{b}: {@[' + dimension + ']} ({d}%)' },
                        encode: { value: dimension, tooltip: dimension }
                    }
                });
            }
        });
        stockChart.setOption(stockoption);
    }, 100);
}


// ---------------- SALES GRAPH ----------------
var salesChartDom = document.getElementById('sales-graph');
if (salesChartDom) {
    var salesChart = echarts.init(salesChartDom, 'dark');
    var salesoption;
    
    var _rawData = [
        { "Year": 1950, "Country": "France", "Income": 800 },
        { "Year": 1951, "Country": "France", "Income": 850 },
        { "Year": 1952, "Country": "France", "Income": 900 },
        { "Year": 1950, "Country": "Germany", "Income": 700 },
        { "Year": 1951, "Country": "Germany", "Income": 760 },
        { "Year": 1952, "Country": "Germany", "Income": 830 },
        { "Year": 1950, "Country": "Finland", "Income": 600 },
        { "Year": 1951, "Country": "Finland", "Income": 620 },
        { "Year": 1952, "Country": "Finland", "Income": 640 },
        { "Year": 1950, "Country": "United Kingdom", "Income": 900 },
        { "Year": 1951, "Country": "United Kingdom", "Income": 950 },
        { "Year": 1952, "Country": "United Kingdom", "Income": 980 }
    ];
    
    function run(_rawData) {
        const countries = [
            'Finland', 'France', 'Germany', 'Iceland', 
            'Norway', 'Poland', 'Russia', 'United Kingdom'
        ];
    
        const datasetWithFilters = [];
        const seriesList = [];
    
        echarts.util.each(countries, function (country) {
            var datasetId = 'dataset_' + country;
            datasetWithFilters.push({
                id: datasetId,
                fromDatasetId: 'dataset_raw',
                transform: {
                    type: 'filter',
                    config: {
                        and: [
                            { dimension: 'Year', gte: 1950 },
                            { dimension: 'Country', '=': country }
                        ]
                    }
                }
            });
            seriesList.push({
                type: 'line',
                datasetId: datasetId,
                showSymbol: false,
                name: country,
                endLabel: {
                    show: true,
                    formatter: function (params) {
                        return params.value[3] + ': ' + params.value[0];
                    }
                },
                labelLayout: {
                    moveOverlap: 'shiftY'
                },
                emphasis: {
                    focus: 'series'
                },
                encode: {
                    x: 'Year',
                    y: 'Income',
                    label: ['Country', 'Income'],
                    itemName: 'Year',
                    tooltip: ['Income']
                }
            });
        });
    
        salesoption = {
            animationDuration: 10000,
            dataset: [
                { id: 'dataset_raw', source: _rawData },
                ...datasetWithFilters
            ],
            title: { text: 'Income of Germany and France since 1950' },
            tooltip: { order: 'valueDesc', trigger: 'axis' },
            xAxis: { type: 'category', nameLocation: 'middle' },
            yAxis: { name: 'Income' },
            grid: { right: 140 },
            series: seriesList
        };
    
        salesChart.setOption(salesoption);
    }
    
    run(_rawData);
}


// ---------------- EXPENSE CHART ----------------
var expenseChartDom = document.getElementById('expensechart');
if (expenseChartDom) {
    var expenseChart = echarts.init(expenseChartDom, "dark");
    
    var expenseoption = {
        dataset: {
            source: [
                ['score', 'amount', 'product'],
                [89.3, 58212, 'Matcha Latte'],
                [57.1, 78254, 'Milk Tea'],
                [74.4, 41032, 'Cheese Cocoa'],
                [50.1, 12755, 'Cheese Brownie'],
                [89.7, 20145, 'Matcha Cocoa'],
                [68.1, 79146, 'Tea'],
                [19.6, 91852, 'Orange Juice'],
                [10.6, 101852, 'Lemon Juice'],
                [32.7, 20112, 'Walnut Brownie']
            ]
        },
        grid: { containLabel: true },
        xAxis: { name: 'amount' },
        yAxis: { type: 'category' },
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 10,
            max: 100,
            text: ['High Score', 'Low Score'],
            dimension: 0,
            inRange: {
                color: ['#800505', '#35045e', '#050967']
            }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    x: 'amount',
                    y: 'product'
                }
            }
        ]
    };
    
    expenseChart.setOption(expenseoption);
}


// ---------------- VISUALS CHART ---------------
var visualsChartDom = document.getElementById('visualschart');
if (visualsChartDom) {
    var visualChart = echarts.init(visualsChartDom, 'dark');
    var visualsoption;
    
    var xAxisData = [];
    var data1 = [];
    var data2 = [];
    for (var i = 0; i < 100; i++) {
        xAxisData.push('A' + i);
        data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }
    
    visualsoption = {
        title: {
            text: 'Sales-Expense Overview'
        },
        legend: {
            data: ['profit', 'loss']
        },
        toolbox: {
            feature: {
                magicType: {
                    type: ['stack']
                },
                dataView: {},
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {},
        xAxis: {
            data: xAxisData,
            splitLine: {
                show: false
            }
        },
        yAxis: {},
        series: [
            {
                name: 'profit',
                type: 'bar',
                data: data1,
                emphasis: {
                    focus: 'series'
                },
                animationDelay: function (idx) {
                    return idx * 10;
                }
            },
            {
                name: 'loss',
                type: 'bar',
                data: data2,
                emphasis: {
                    focus: 'series'
                },
                animationDelay: function (idx) {
                    return idx * 10 + 100;
                }
            }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };
    
    visualChart.setOption(visualsoption);
}