
import React from "react"
// import { Doughnut } from 'react-chartjs-2'
// import { Chart, ArcElement, Tooltip,  } from 'chart.js'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  // labels: ["Male", "Female"],
  datasets: [{
    data: [27, 73],
    backgroundColor: [
      'rgb(255, 133, 105)',
      'rgb(44,194,216)',
    ],
    borderColor: [
      'rgba(255, 133, 105,0.5)',
      'rgb(44,194,216)',
    ],
    borderWidth: 1,
  }]
}
export default function DoughnutChart() {
  return (
    <>
      <div>
        <h1>hiiiiiiiiiiiii</h1>
        {/* <Doughnut data={data} /> */}
      </div>
    </>
  )
}