'use client';

import React from 'react';
import { WaterfallLayout } from '@/components/layout/waterfallLayout';
import { H1, P } from '@/components/UI/text/typography';
import { Badge } from '@/components/UI/badge';
import { ColorPicker } from '@/components/color-picker';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/UI/toast/toaster';

// Component Cards
import { TypographyCard } from './_components/TypographyCard';
import { ButtonsCard } from './_components/ButtonsCard';
import { SelectCard } from './_components/SelectCard';
import { TextareaCard } from './_components/TextareaCard';
import { BrandCard } from './_components/BrandCard';
import { SkeletonCard } from './_components/SkeletonCard';
import { AvatarCard } from './_components/AvatarCard';
import { AccordionCard } from './_components/AccordionCard';
import { TableCard } from './_components/TableCard';
import { BadgeCard } from './_components/BadgeCard';
import { NotificationBadgeCard } from './_components/NotificationBadgeCard';
import { InputCard } from './_components/InputCard';
import { CheckboxCard } from './_components/CheckboxCard';
import { SwitchCard } from './_components/SwitchCard';
import { SegmentedControlCard } from './_components/SegmentedControlCard';
import { ToggleGroupCard } from './_components/ToggleGroupCard';
import { IconSelectorCard } from './_components/IconSelectorCard';
import { TooltipCard } from './_components/TooltipCard';
import { PopoverCard } from './_components/PopoverCard';
import { InteractiveToastCard } from './_components/InteractiveToastCard';
import { StaticToastCard } from './_components/StaticToastCard';
import { ChartCard } from './_components/ChartCard';
import { IconCard } from './_components/IconCard';
import { SVGAnimationCard } from './_components/SVGAnimationCard';
import { DatePickerCard } from './_components/DatePickerCard';

export default function UIShowcasePage() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background text-foreground p-page">
                <div className="mb-8 space-y-4">
                    <H1>UI Components Showcase</H1>
                    <div className="flex flex-col gap-2">
                        <P className="text-muted-foreground">
                            Global style reference for all UI components.
                        </P>
                        <Badge variant="neutral" className="w-fit">
                            Design System v1.1
                        </Badge>
                        <div className="pt-2 wrap">
                            <ColorPicker />
                            <ModeToggle />
                        </div>
                    </div>
                </div>

                <WaterfallLayout minColumnWidth={340} gap={24}>
                    <TypographyCard />
                    <ButtonsCard />
                    <InputCard />
                    <CheckboxCard />
                    <SelectCard />
                    <TextareaCard />
                    <BadgeCard />
                    <NotificationBadgeCard />
                    <SwitchCard />
                    <SegmentedControlCard />
                    <ToggleGroupCard />
                    <TooltipCard />
                    <PopoverCard />
                    <InteractiveToastCard />
                    <StaticToastCard />
                    <AccordionCard />
                    <TableCard />
                    <IconSelectorCard />
                    <BrandCard />
                    <SkeletonCard />
                    <AvatarCard />

                    <DatePickerCard />
                    <IconCard />

                </WaterfallLayout>

                <Toaster />
            </div>
        </ThemeProvider>
    );
}
