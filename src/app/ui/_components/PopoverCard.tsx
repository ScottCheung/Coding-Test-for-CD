import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/UI/popover';
import { Button } from '@/components/UI/Button/button';
import { Small, H4, P } from '@/components/UI/text/typography';

export function PopoverCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Popover</CardTitle>
                <CardDescription>
                    Contextual content in a layer.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Open Popover</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="space-y-2">
                                <H4>Dimensions</H4>
                                <P className="text-sm text-muted-foreground">
                                    Set the dimensions for the layer.
                                </P>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
        </Card>
    );
}
