"use client"

import * as React from "react"
import { Button } from "@/components/UI/Button"
import { Card } from "@/components/UI/card"
import { Input } from "@/components/UI/input"
import { H1, H2, P } from "@/components/UI/text/typography"
import { notify } from "@/lib/notifications"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

export default function ToastPlaygroundPage() {
    const [title, setTitle] = React.useState("Notification Title")
    const [message, setMessage] = React.useState("This is a sample notification message to test the toaster component.")
    const [duration, setDuration] = React.useState(5000)

    const handleNotify = (type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success':
                notify.success(message, title)
                break
            case 'error':
                notify.error(message, title)
                break
            case 'info':
                notify.info(message, title)
                break
            case 'warning':
                notify.warning(message, title)
                break
        }
    }

    const handleStressTest = () => {
        let count = 0
        const interval = setInterval(() => {
            const types: ('success' | 'error' | 'info' | 'warning')[] = ['success', 'error', 'info', 'warning']
            const type = types[Math.floor(Math.random() * types.length)]
            notify[type](`Stress test message #${count + 1}`, `Notification #${count + 1}`)
            count++
            if (count >= 10) clearInterval(interval)
        }, 300)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div>
                <H1>Toast Notification Playground</H1>
                <P className="text-gray-500">Debug and refine toast notification styles and animations.</P>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Configuration */}
                <Card className="p-6 space-y-4">
                    <H2>Configuration</H2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title (Optional)</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-2xl focus:text-ink-primary text-ink-secondary border border-transparent bg-glass focus:border-primary px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter message..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Duration (ms) - (Note: current impl uses default unless updated)</label>
                        <Input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500">
                            Currently `notify` helper doesn't expose duration override easily without refactoring `lib/notifications.ts`, but the store supports it.
                        </p>
                    </div>
                </Card>

                {/* Triggers */}
                <Card className="p-6 space-y-4">
                    <H2>Trigger Notifications</H2>

                    <div className="grid grid-cols-1 gap-3">
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white w-full justify-start"
                            onClick={() => handleNotify('success')}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Trigger Success
                        </Button>

                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white w-full justify-start"
                            onClick={() => handleNotify('error')}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Trigger Error
                        </Button>

                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-start"
                            onClick={() => handleNotify('info')}
                        >
                            <Info className="mr-2 h-4 w-4" />
                            Trigger Info
                        </Button>

                        <Button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full justify-start"
                            onClick={() => handleNotify('warning')}
                        >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Trigger Warning
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" onClick={handleStressTest}>
                            Run Stress Test (10 rapid toasts)
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Preview Section - Showing what components invoke */}
            <Card className="p-6">
                <H2 className="mb-4">Common Application Scenarios</H2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => notify.info("View settings opened")}>
                        View Settings Opened
                    </Button>
                    <Button variant="outline" onClick={() => notify.info("View settings closed")}>
                        View Settings Closed
                    </Button>
                    <Button variant="outline" onClick={() => notify.info("Entered multi-select mode")}>
                        Multi-select Entered
                    </Button>
                    <Button variant="outline" onClick={() => notify.info("Exited multi-select mode")}>
                        Multi-select Exited
                    </Button>
                </div>
            </Card>
        </div>
    )
}
