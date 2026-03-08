'use client';

import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { SegmentedControl } from '@/components/UI/segmented-control';
import { Small } from '@/components/UI/text/typography';

export function SegmentedControlCard() {
    const [segmentedValue, setSegmentedValue] = useState('daily');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Segmented Control</CardTitle>
                <CardDescription>
                    Toggle between different views.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">

                    <SegmentedControl
                        value={segmentedValue}
                        onChange={setSegmentedValue}
                        options={[
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'monthly', label: 'Monthly' },
                        ]}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
