'use client';

import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { IconSelector } from '@/components/UI/IconSelector/IconSelector';

export function IconSelectorCard() {
    const [iconValue, setIconValue] = useState('home');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Icon Selector</CardTitle>
                <CardDescription>
                    Component to select icons.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <IconSelector value={iconValue} onChange={setIconValue} />
            </CardContent>
        </Card>
    );
}
