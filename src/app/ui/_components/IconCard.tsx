import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { IconBox } from '@/components/UI/icon/box';
import { Home, User, Settings, Heart, Bell } from 'lucide-react';

export function IconCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Icons</CardTitle>
                <CardDescription>
                    Icon containers with hover effects.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    <IconBox>
                        <Home className="size-6" />
                    </IconBox>
                    <IconBox>
                        <User className="size-6" />
                    </IconBox>
                    <IconBox>
                        <Settings className="size-6" />
                    </IconBox>
                    <IconBox>
                        <Heart className="size-6" />
                    </IconBox>
                    <IconBox>
                        <Bell className="size-6" />
                    </IconBox>
                </div>
            </CardContent>
        </Card>
    );
}
