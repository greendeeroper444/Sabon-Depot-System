import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({orderCounts}) => {
    const totalOrders = orderCounts.delivered + orderCounts.pending + orderCounts.pickedUp;
    const deliveredPercentage = totalOrders ? (orderCounts.delivered / totalOrders) * 100 : 0;
    const pendingPercentage = totalOrders ? (orderCounts.pending / totalOrders) * 100 : 0;
    const pickedUpPercentage = totalOrders ? (orderCounts.pickedUp / totalOrders) * 100 : 0;

    const chartData = {
        labels: ['Delivered', 'Pending', 'Pick Up'],
        datasets: [
            {
                data: [deliveredPercentage, pendingPercentage, pickedUpPercentage],
                backgroundColor: ['#388E3C', '#FFCC00', '#FF7043'],
                hoverBackgroundColor: ['#66BB6A', '#FFF176', '#FF8A65'],
                borderWidth: 0,
                cutout: '60%',
            },
        ],
    }

    // const chartOptions = {
    //     plugins: {
    //         legend: {
    //             display: true,
    //             position: 'top',
    //             labels: {
    //                 usePointStyle: true,
    //                 boxWidth: 8,
    //             },
    //         },
    //         tooltip: {
    //                 enabled: false,
    //         },
    //         datalabels: {
    //             display: true,
    //             borderRadius: 4,
    //             padding: 8,
    //             font: {
    //                 weight: 'bold',
    //                 size: 14,
    //             },
    //             formatter: (value) => `${value.toFixed(1)}%`,
    //             color: (context) => {
    //                 const index = context.dataIndex;
    //                 return index === 0 ? '#388E3C' : '#FFCC00';
    //             },
    //             backgroundColor: (context) => {
    //                 const index = context.dataIndex;
    //                 return index === 0 ? '#CDEAD3' : '#FFF8E1';
    //             },
    //         },
    //     },
    //     maintainAspectRatio: false,
    // };

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                },
            },
            tooltip: {
                enabled: false,
            },
            datalabels: {
                display: true,
                borderRadius: 4,
                padding: 8,
                font: {
                    weight: 'bold',
                    size: 14,
                },
                formatter: (value) => `${value.toFixed(1)}%`,
                color: (context) => {
                    //use the same color as the segment
                    const dataset = context.chart.data.datasets[0];
                    return dataset.backgroundColor[context.dataIndex];
                },
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
            },
        },
        maintainAspectRatio: false,
    };
    
  return (
    <div style={{ width: '300px', height: '300px' }}>
        <Doughnut data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
    </div>
  )
}

export default DoughnutChart