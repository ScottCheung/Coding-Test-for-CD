import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Tooltip } from '@/components/UI/tooltip';
import { Button } from '@/components/UI/Button/button';
import { Small } from '@/components/UI/text/typography';

export function TooltipCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tooltip</CardTitle>
                <CardDescription>
                    Brief description on hover.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">

                    <div className="flex gap-2">
                        <Tooltip content="This is a tooltip">
                            <Button variant="outline">Hover me</Button>
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
