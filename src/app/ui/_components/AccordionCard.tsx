import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Accordion } from '@/components/UI/Accordion/Accordion';
import { P } from '@/components/UI/text/typography';

export function AccordionCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Accordion</CardTitle>
                <CardDescription>
                    Expandable content sections.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <Accordion title="Is this accessible?">
                    <P>Yes. It adheres to the WAI-ARIA design pattern.</P>
                </Accordion>
                <Accordion title="Is it styled?">
                    <P>Yes. It comes with default styles that matches the other components.</P>
                </Accordion>
                <Accordion title="Is it animated?">
                    <P>Yes. It uses framer-motion for smooth transitions.</P>
                </Accordion>
            </CardContent>
        </Card>
    );
}
