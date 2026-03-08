import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Select } from '@/components/UI/select/select';
import { Globe } from 'lucide-react';

export function SelectCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Select</CardTitle>
                <CardDescription>
                    Dropdown menus for selection.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <Select label="Default Select">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Super long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long option</option>
                </Select>
                <Select
                    label="With Icon"
                    icon={Globe}
                    helpTextLong="Select a region"
                    placeholder="Select a region"
                >
                    <option>Asia</option>
                    <option>Africa</option>
                    <option>Europe</option>
                    <option>Super long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long optionSuper long option, Super long option, Super long option, Super long option</option>

                </Select>
                <Select
                    label="Error State"
                    error="Selection required"
                >
                    <option>Select...</option>
                </Select>
                <Select
                    label="Disabled"
                    disabled
                >
                    <option>Disabled Option</option>
                </Select>
            </CardContent>
        </Card>
    );
}
