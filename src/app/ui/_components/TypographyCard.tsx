import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import {
    H1,
    H2,
    H3,
    H4,
    P,
    Lead,
    Small,
    Muted,
    Error,
} from '@/components/UI/text/typography';

export function TypographyCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                    Headings and text styles used across the app.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2 border-b pb-4">
                    <H1>Heading 1</H1>
                    <H2>Heading 2</H2>
                    <H3>Heading 3</H3>
                    <H4>Heading 4</H4>
                </div>
                <div className="space-y-2">
                    <Lead>
                        This is a lead paragraph, used for introductions or important context.
                    </Lead>
                    <P>
                        This is a standard paragraph. It contains the main body text
                        for the application. It should be legible and well-spaced.
                    </P>
                    <Small>
                        This is small text, often used for captions or disclaimers.
                    </Small>
                    <Muted>
                        This is muted text, used for secondary information.
                    </Muted>
                    <Error>This is error text, used for error messages.</Error>

                </div>
            </CardContent>
        </Card>
    );
}
