import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { InputField } from '@/components/UI/input';
import { Search } from 'lucide-react';

export function InputCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>
                    Form controls for user input.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <InputField label="Default Input" placeholder="Type something..." />
                <InputField
                    label="With Helper Text"
                    helpTextLong="This is a helper text"
                    placeholder="Input with text"
                />
                <InputField
                    label="With Icon"
                    icon={Search}
                    placeholder="Search..."
                />
                <InputField
                    label="Error State"
                    error="This field has an error"
                    defaultValue="Invalid value"
                />
                <InputField
                    label="With Character Count"
                    maxLength={20}
                    placeholder="Max 20 chars"
                />
                <InputField
                    label="Disabled"
                    disabled
                    defaultValue="Disabled content"
                />
            </CardContent>
        </Card>
    );
}
