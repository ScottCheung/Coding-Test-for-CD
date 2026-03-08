"use client"

import { Button } from "@/components/UI/Button"
import { H1, P } from "@/components/UI/text/typography"
import { notify } from "@/lib/notifications"
import { Card } from "@/components/UI/card"

export default function ToastTestPage() {
    return (
        <div className="flex flex-col gap-8 p-10 max-w-2xl mx-auto">
            <div className="space-y-2">
                <H1>Toast Notification Playground</H1>
                <P className="text-ink-secondary">
                    Click the buttons below to trigger different types of notifications.
                    Use this to debug styles and animations.
                </P>
            </div>

            <Card className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="border-green-200 hover:bg-green-50 text-green-700 justify-start"
                        onClick={() => notify.success("Operation completed successfully!", "Success")}
                    >
                        Trigger Success
                    </Button>

                    <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 text-red-700 justify-start"
                        onClick={() => notify.error("Something went wrong. Please try again.", "Error")}
                    >
                        Trigger Error
                    </Button>

                    <Button
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50 text-blue-700 justify-start"
                        onClick={() => notify.info("Here is some useful information for you.", "Info")}
                    >
                        Trigger Info
                    </Button>

                    <Button
                        variant="outline"
                        className="border-yellow-200 hover:bg-yellow-50 text-yellow-700 justify-start"
                        onClick={() => notify.warning("Warning: unexpected behavior detected.", "Warning")}
                    >
                        Trigger Warning
                    </Button>
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <P className="font-medium">Long Text Test</P>
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => notify.info("This is a very long notification message to test how the toast component handles wrapping and sizing when the content exceeds the typical width. It should handle this gracefully without breaking layout.", "Long Message Test")}
                    >
                        Trigger Long Message
                    </Button>
                </div>
            </Card>
        </div>
    )
}
