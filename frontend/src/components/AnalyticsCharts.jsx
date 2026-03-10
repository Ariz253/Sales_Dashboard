import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut, Pie, Bubble, Scatter } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Set Global Chart.js defaults for Dark Theme
ChartJS.defaults.color = '#94a3b8'; // Slate 400 for text
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.05)'; // Faint grids
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
ChartJS.defaults.plugins.tooltip.titleColor = '#f8fafc';
ChartJS.defaults.plugins.tooltip.bodyColor = '#f8fafc';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

export const CategoryBarChart = ({ data }) => {
    if (!data || !data.sales_by_category) return null;

    const labels = Object.keys(data.sales_by_category);
    const values = Object.values(data.sales_by_category);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Revenue by Category',
                data: values,
                backgroundColor: 'rgba(53, 162, 235, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Revenue by Category' },
        },
    };

    return <div style={{ height: '300px', width: '100%' }}><Bar options={options} data={chartData} /></div>;
};

export const DailySalesLineChart = ({ data }) => {
    if (!data || !data.daily_sales) return null;

    const sortedDates = Object.keys(data.daily_sales).sort();
    const values = sortedDates.map(date => data.daily_sales[date]);

    const chartData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Daily Sales',
                data: values,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Daily Sales Trend' },
        },
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: 10,
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    return <div style={{ height: '350px' }}><Line options={options} data={chartData} /></div>;
};

export const GenderDoughnutChart = ({ data }) => {
    if (!data || !data.gender_spending) return null;

    const labels = Object.keys(data.gender_spending);
    const values = Object.values(data.gender_spending);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Spending by Gender',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return <div style={{ maxWidth: '300px', margin: '0 auto' }}><Doughnut data={chartData} /></div>;
}

export const AgeGroupPieChart = ({ data }) => {
    if (!data || !data.sales_by_age_group) return null;

    const labels = Object.keys(data.sales_by_age_group);
    const values = Object.values(data.sales_by_age_group);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Sales by Age Group',
                data: values,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
                borderWidth: 1,
            }
        ]
    };

    return <div style={{ maxWidth: '300px', margin: '0 auto' }}><Pie data={chartData} /></div>;
}

export const AgeSpendingChart = ({ data }) => {
    if (!data || !data.avg_spend_by_age_group) return null;

    const labels = Object.keys(data.avg_spend_by_age_group);
    const values = Object.values(data.avg_spend_by_age_group);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Avg Spend per Transaction ($)',
                data: values,
                backgroundColor: 'rgba(124, 58, 237, 0.6)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Avg Transaction Value by Age' },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value;
                    }
                }
            }
        }
    };

    return <div style={{ height: '300px', width: '100%' }}><Bar options={options} data={chartData} /></div>;
}

export const PriceSensitivityScatterChart = ({ data }) => {
    if (!data || !data.price_sensitivity) return null;

    // Group by exact price & quantity coordinates to count frequency
    const groupedData = data.price_sensitivity.reduce((acc, item) => {
        const key = `${item.price_per_unit}-${item.quantity}`;
        if (!acc[key]) {
            acc[key] = {
                x: item.price_per_unit,
                y: item.quantity,
                category: item.product_category, // Just take the first category encountered for that price point in this view
                count: 0
            };
        }
        acc[key].count++;
        return acc;
    }, {});

    const bubbleData = Object.values(groupedData).map(item => {
        // We scale the radius 'r' so bubbles don't get absurdly huge or stay too small
        // Cap the max size and give a base min size
        const minRadius = 4;
        const scaledRadius = Math.min(minRadius + (item.count * 1.5), 30); 
        
        return {
            x: item.x,
            y: item.y,
            r: scaledRadius,
            category: item.category,
            transactionCount: item.count
        };
    });

    const chartData = {
        datasets: [
            {
                label: 'Price vs Quantity (Bubble)',
                data: bubbleData,
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(239, 68, 68, 0.8)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Price vs. Quantity (Bubble Size = # of Transactions)' },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const pointInfo = context.raw;
                        return `Price: $${pointInfo.x}, Qty: ${pointInfo.y} | Transactions: ${pointInfo.transactionCount}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Price Per Unit ($)'
                },
                beginAtZero: true,
                grace: '10%' // Add padding so bubbles don't get cut off on the right
            },
            y: {
                title: {
                    display: true,
                    text: 'Quantity Sold'
                },
                beginAtZero: true,
                grace: '20%', // Add padding so highest bubbles don't get cut off at the top
                ticks: {
                    stepSize: 1 // Quantity is always a whole number
                }
            }
        }
    };

    return <div style={{ height: '300px', width: '100%' }}><Bubble options={options} data={chartData} /></div>;
};
