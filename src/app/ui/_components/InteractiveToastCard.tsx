'use client';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Button } from '@/components/UI/Button/button';
import { Small } from '@/components/UI/text/typography';
import { useLayoutStore } from '@/lib/store/layout-store';

export function InteractiveToastCard() {
    const addNotification = useLayoutStore((state) => state.actions.addNotification);

    const handleToast = (type: 'success' | 'error' | 'info' | 'warning') => {
        addNotification({
            type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
            message: 'This is a notification message.',
            duration: 3000,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Interactive Toasts</CardTitle>
                <CardDescription>
                    Trigger notification toasts.
                </CardDescription>
            </CardHeader>
            <CardContent className="">

                <div className="wrap">
                    <Button size="sm" variant="outline" onClick={() => handleToast('success')}>Success</Button>
                    <Button size="sm" variant="outline" onClick={() => handleToast('error')}>Error</Button>
                    <Button size="sm" variant="outline" onClick={() => handleToast('info')}>Info</Button>
                    <Button size="sm" variant="outline" onClick={() => handleToast('warning')}>Warning</Button>
                </div>
            </CardContent>
        </Card>
    );
}
