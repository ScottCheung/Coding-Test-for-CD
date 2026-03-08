import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import Logo from '@/components/UI/logo';

export function BrandCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Assets</CardTitle>
                <CardDescription>
                    Logos and branding elements.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="p-4 border rounded-lg flex justify-center bg-gray-50 dark:bg-gray-900">
                    <Logo mode="logo" />
                </div>
                <div className="p-4 border rounded-lg flex justify-center bg-gray-50 dark:bg-gray-900">
                    <Logo mode="brand" />
                </div>
            </CardContent>
        </Card>
    );
}
