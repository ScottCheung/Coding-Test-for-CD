import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Avatar } from '@/components/UI/Avatar/Avatar';
import { Small } from '@/components/UI/text/typography';

export function AvatarCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>
                    User profile images.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">
                    <Small>Sizes</Small>
                    <div className="flex items-end gap-4">
                        <Avatar size="sm" name="Small User" />
                        <Avatar size="md" name="Medium User" />
                        <Avatar size="lg" name="Large User" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Small>Status</Small>
                    <div className="flex items-center gap-4">
                        <Avatar size="md" name="Online" status="online" />
                        <Avatar size="md" name="Offline" status="offline" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Small>With Notifications</Small>
                    <div className="flex items-center gap-4">
                        <Avatar size="md" name="Msg" message={5} />
                        <Avatar size="lg" name="Msg" message={99} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
