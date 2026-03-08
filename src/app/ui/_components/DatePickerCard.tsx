"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/UI/card";
import { DatePicker } from "@/components/UI/DataPicker";
import { useState } from "react";
import { H4, Small } from "@/components/UI/text/typography";

export function DatePickerCard() {
    const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
    const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([new Date(), new Date(new Date().setDate(new Date().getDate() + 5))]);
    const [multipleDates, setMultipleDates] = useState<Date[]>([new Date()]);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle>DatePicker</CardTitle>
                <CardDescription>
                    DatePicker is used to select a date or a range of dates.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <DatePicker
                    label="Pick a date"
                    mode="single"
                    value={singleDate}
                    onChange={setSingleDate}
                />
                <Small>
                    Selected: {singleDate?.toDateString()}
                </Small>

                <DatePicker
                    label="Pick a range"
                    mode="range"
                    value={dateRange}
                    onChange={setDateRange}
                />
                <Small>
                    Start: {dateRange[0]?.toDateString()} <br />
                    End: {dateRange[1]?.toDateString()}
                </Small>

                <DatePicker
                    label="Pick multiple dates"
                    mode="multiple"
                    value={multipleDates}
                    onChange={setMultipleDates}
                />
                <Small>
                    Count: {multipleDates.length}
                </Small>

            </CardContent>
        </Card>
    );
}
