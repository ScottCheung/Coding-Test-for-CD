import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Switch } from '@/components/UI/switch';
import { Small } from '@/components/UI/text/typography';

export function SwitchCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Switch</CardTitle>
                <CardDescription>
                    Toggle control for binary states.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">

                    <div className="flex items-center gap-4">
                        <Switch checked={false} onCheckedChange={() => { }} />
                        <Switch checked={true} onCheckedChange={() => { }} />
                        <Switch checked={false} isLoading onCheckedChange={() => { }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
