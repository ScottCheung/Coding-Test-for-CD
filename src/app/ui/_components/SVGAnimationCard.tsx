import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import { SVGAnimation } from '@/components/UI/SVGanimation/StatusSVG';

export function SVGAnimationCard() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>SVG Animations</CardTitle>
                <CardDescription>
                    Animated status icons for feedback.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 flex justify-center bg-muted/20">
                        <SVGAnimation icon="success" className="transform scale-75" />
                    </div>
                    <div className="border rounded-lg p-4 flex justify-center bg-muted/20">
                        <SVGAnimation icon="error" className="transform scale-75" />
                    </div>
                    <div className="border rounded-lg p-4 flex justify-center bg-muted/20">
                        <SVGAnimation icon="warning" className="transform scale-75" />
                    </div>
                    <div className="border rounded-lg p-4 flex justify-center bg-muted/20">
                        <SVGAnimation icon="info" className="transform scale-75" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
