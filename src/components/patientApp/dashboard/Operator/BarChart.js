import React from "react"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2'

// ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  // responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '2022 Tenants payments status ',
    },

    //   scales: {
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: false,
    //         min: 5,
    //         stepSize: 3,
    //         callback: function (value) {
    //           return `${value}`
    //         }
    //       }
    //     }],
    //     xAxes: [{
    //       ticks: {
    //         beginAtZero: false,
    //         min: 5,
    //         stepSize: 3,
    //         callback: function (value) {
    //           return `${value}`
    //         }
    //       }
    //     }]
    //   }
    scales: {
      y:
      {
        min: 0,
        max: 6,
        stepSize: 2,
      },
      x:
      {
        min: 0,
        max: 10,
        stepSize: 5,
      }
    }
  }
};


const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'Paid',
      data: [1, 2, 3, 4, 5, 6, 7, 4, 1, 0.5, 5, 8],
      backgroundColor: 'rgb(44,194,216)',
    },
    {
      label: 'Pending',
      data: [1, 2, 3, 4, 5, 6, 7, 1, 3, 4, 6, 6],
      backgroundColor: 'rgb(255, 133, 105)',
    },
  ],
  borderColor: [
    'rgb(44,194,216)',
    'rgb(255, 133, 105)',
  ]
};

export default function BarChart() {
  return (
    <>
      <div style={{ height: '' }}>
      <h1>helooooooooo</h1>
        {/* <Bar width={1000}
          height={500} options={options} data={data} /> */}
      </div>
    </>
  )
}