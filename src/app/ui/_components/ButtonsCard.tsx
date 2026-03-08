import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { Button } from '@/components/UI/Button/button';
import { Small } from '@/components/UI/text/typography';
import { Bell, Settings, User, Mail, Search } from 'lucide-react';

export function ButtonsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                    Interactive elements for user actions.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <div className="space-y-2">
                    <Small>Variants</Small>
                    <div className="wrap">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link" size='link'>Link</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Small>Sizes</Small>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="link" size="link">Link</Button>
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>

                    </div>
                </div>

                <div className="space-y-2">
                    <Small>Icon Buttons</Small>
                    <div className="wrap">
                        <Button variant="icon" Icon={Bell} />
                        <Button variant="icon" Icon={Settings} />
                        <Button variant="icon" Icon={User} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Small>States</Small>
                    <div className="wrap">
                        <Button isLoading>isLoading</Button>
                        <Button disabled>Disabled</Button>
                        <Button variant="outline" disabled>
                            Disabled Outline
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Small>With Icons</Small>
                    <div className="wrap">
                        <Button Icon={Mail}>Login with Email</Button>
                        <Button variant="secondary" Icon={Search}>
                            Search
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
