import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Chart } from '@/components/UI/Chart';

const data = [
    { name: 'Jan', value: 400, sales: 240 },
    { name: 'Feb', value: 300, sales: 139 },
    { name: 'Mar', value: 550, sales: 980 },
    { name: 'Apr', value: 450, sales: 390 },
    { name: 'May', value: 600, sales: 480 },
    { name: 'Jun', value: 700, sales: 380 },
];

const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

export function ChartCard() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Charts</CardTitle>
                <CardDescription>
                    Visualizing data with Recharts wrapper.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="h-[200px] w-full">
                    <Chart
                        type="area"
                        data={data}
                        xKey="name"
                        yKey="value"
                        title="Area Chart"
                        size="sm"
                        showGridY
                        gradientFill
                    />
                </div>
                <div className="h-[200px] w-full">
                    <Chart
                        type="bar"
                        data={data}
                        xKey="name"
                        yKey="value"
                        title="Bar Chart"
                        size="sm"
                        showGridX
                    />
                </div>
                <div className="h-[200px] w-full">
                    <Chart
                        type="pie"
                        data={pieData}
                        title="Pie Chart"
                        size="sm"
                        showLegend
                    />
                </div>
            </CardContent>
        </Card>
    );
}
