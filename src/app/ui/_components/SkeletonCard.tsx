import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Skeleton } from '@/components/UI/Skeleton/Skeleton';
import { Small } from '@/components/UI/text/typography';

export function SkeletonCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Skeleton</CardTitle>
                <CardDescription>
                    Loading placeholders.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">
                    <Small>Text Lines</Small>
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                </div>
                <div className="space-y-2">
                    <Small>Shapes</Small>
                    <div className="flex gap-4">
                        <Skeleton variant="circular" className="size-12" />
                        <Skeleton variant="rectangular" className="size-12" />
                        <Skeleton variant="card" className="size-12" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
