import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { StaticToast } from '@/components/UI/toast/toaster';

export function StaticToastCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Static Toasts</CardTitle>
                <CardDescription>
                    Toasts displayed as static elements (like Alerts).
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <StaticToast
                    type="success"
                    title="Success"
                    message="Operation completed successfully."
                />
                <StaticToast
                    type="info"
                    title="Note"
                    message="Here is some relevant information."
                />
                <StaticToast
                    type="warning"
                    title="Warning"
                    message="This action cannot be undone."
                />
                <StaticToast
                    type="error"
                    title="Error"
                    message="Something went wrong. Please try again."
                />
            </CardContent>
        </Card>
    );
}
