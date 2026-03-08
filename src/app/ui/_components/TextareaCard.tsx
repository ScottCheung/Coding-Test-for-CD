import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Textarea } from '@/components/UI/textarea';

export function TextareaCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Textarea</CardTitle>
                <CardDescription>
                    Multi-line text input.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <Textarea
                    label="Description"
                    placeholder="Write a description..."
                    maxLength={200}
                />
                <Textarea
                    label="With Error"
                    placeholder="Type here..."
                    error="Description is required"
                />
                <Textarea
                    label="Disabled"
                    disabled
                    defaultValue="This is read-only content."
                />
            </CardContent>
        </Card>
    );
}
