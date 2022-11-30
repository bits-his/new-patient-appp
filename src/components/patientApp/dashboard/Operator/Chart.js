import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
export default function Chart() {
    return (
        <div>
            <PieChart
                data={[
                    { title: 'One', value: 50, color: '#1D89E4' },
                    { title: 'Two', value: 50, color: 'rgb(34, 64, 41)' },
                ]}
                lineWidth={20}
                animate={true}
                radius={40}
            />
        </div>
    )
}
