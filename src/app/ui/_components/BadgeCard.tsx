import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Small } from '@/components/UI/text/typography';

export function BadgeCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>
                    Status indicators and labels.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">
                    <Small>Standard Badges</Small>
                    <div className="wrap">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="neutral">Neutral</Badge>
                    </div>
                    <div className="wrap">
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
