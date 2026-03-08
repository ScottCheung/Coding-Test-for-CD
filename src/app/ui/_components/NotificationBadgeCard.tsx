import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { NotificationBadge } from '@/components/UI/NotificationBadge/NotificationBadge';
import { Button } from '@/components/UI/Button/button';
import { Bell, Mail, AlertCircle } from 'lucide-react';
import { Small } from '@/components/UI/text/typography';

export function NotificationBadgeCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Badges</CardTitle>
                <CardDescription>
                    Badges for notification counts.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">

                    <div className="flex gap-4 items-center">
                        <NotificationBadge count={5}>
                            <Button variant="outline" size="icon" Icon={Bell} />
                        </NotificationBadge>
                        <NotificationBadge count={100}>
                            <Button variant="outline" size="icon" Icon={Mail} />
                        </NotificationBadge>
                        <NotificationBadge count="!">
                            <Button variant="outline" size="icon" Icon={AlertCircle} />
                        </NotificationBadge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
