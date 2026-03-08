import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Checkbox } from '@/components/UI/checkbox';
import { Small } from '@/components/UI/text/typography';

export function CheckboxCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Checkbox</CardTitle>
                <CardDescription>
                    Selection control for multiple options.
                </CardDescription>
            </CardHeader>
            <CardContent className="">


                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Accept terms and conditions
                    </label>
                </div>
            </CardContent>
        </Card>
    );
}
