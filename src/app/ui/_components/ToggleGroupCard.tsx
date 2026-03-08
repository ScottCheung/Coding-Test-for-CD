'use client';

import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { ToggleGroup } from '@/components/UI/toggle-group';
import { Small } from '@/components/UI/text/typography';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function ToggleGroupCard() {
    const [toggleValue, setToggleValue] = useState('left');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Toggle Group</CardTitle>
                <CardDescription>
                    Group of toggle buttons.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">

                    <ToggleGroup
                        value={toggleValue}
                        onValueChange={setToggleValue}
                        items={[
                            { value: 'left', label: 'Left', icon: AlignLeft },
                            { value: 'center', label: 'Center', icon: AlignCenter },
                            { value: 'right', label: 'Right', icon: AlignRight },
                        ]}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
