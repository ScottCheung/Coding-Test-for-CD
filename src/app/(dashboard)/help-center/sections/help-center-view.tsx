"use client"

import * as React from "react"
import {
    Search,
    BookOpen,
    CircleHelp,
    Workflow,
    Lightbulb,
    FileText,
    ChevronRight,
    LifeBuoy,
} from "lucide-react"
import { Button } from "@/components/UI/Button"
import { Input } from "@/components/UI/input"
import { Card } from "@/components/UI/card"
import { cn } from "@/lib/utils"
import { H1, H2, H3, P, Muted } from "@/components/UI/text/typography"

const CATEGORIES = [
    {
        icon: BookOpen,
        title: "Guides",
        desc: "Step-by-step instructions for core system functions",
    },
    {
        icon: CircleHelp,
        title: "FAQ",
        desc: "Collection of frequently asked questions and answers",
    },
    {
        icon: Workflow,
        title: "Process Examples",
        desc: "Walkthroughs of common HR workflows",
    },
    {
        icon: Lightbulb,
        title: "Concepts",
        desc: "Definitions of key HR and payroll terms",
    },
]

const POPULAR_ARTICLES = [
    "How to set up a new employee onboarding process?",
    "Guide to troubleshooting payroll calculation errors",
    "Holiday and leave policy configuration",
]

export function HelpCenterView() {
    return (
        <div className="mx-auto max-w-4xl space-y-10">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center">
                <H1 className="text-4xl text-primary sm:text-5xl">
                    Help Center
                </H1>
                <Muted className="max-w-md font-normal text-ink-secondary dark:text-gray-400">
                    Search for questions, guides, or keywords, and we&apos;ll find the best
                    answer for you.
                </Muted>
            </div>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
                <div className="relative flex h-14 w-full items-center overflow-hidden rounded-full bg-panel -sm ">
                    <div className="flex h-full items-center justify-center pl-5 text-ink-secondary dark:text-gray-400">
                        <Search className="size-6" />
                    </div>
                    <input
                        className="flex h-full w-full flex-1 border-none bg-transparent pl-3 pr-6 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-gray-400"
                        placeholder="Search help documentation"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid  gap-4 grid-cols-2 lg:grid-cols-4">
                {CATEGORIES.map((cat) => (
                    <Card
                        key={cat.title}
                        className="group flex cursor-pointer flex-col gap-4  p-card transition-all hover:-translate-y-1 "
                    >
                        <div className="flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary dark:bg-primary/20">
                            <cat.icon className="size-6" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-primary">
                                {cat.title}
                            </p>
                            <p className="mt-1 text-sm text-ink-secondary dark:text-gray-400">
                                {cat.desc}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Popular Articles */}
            <div>
                <H2 className="mb-4 px-4 text-primary">
                    Popular Articles
                </H2>
                <div className="space-y-3">
                    {POPULAR_ARTICLES.map((article, i) => (
                        <div
                            key={i}
                            className="flex cursor-pointer items-center justify-between rounded-xl bg-panel p-4 transition-colors hover:bg-gray-50  dark:hover:bg-zinc-800"
                        >
                            <div className="flex items-center gap-4">
                                <FileText className="size-6 text-ink-secondary dark:text-gray-400" />
                                <p className="font-medium text-ink-primary">
                                    {article}
                                </p>
                            </div>
                            <ChevronRight className="size-6 text-gray-400 dark:text-ink-secondary" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="rounded-2xl bg-primary/5 px-4 py-8 text-center dark:bg-primary/20">
                <H3 className="text-primary">
                    Didn&apos;t find what you were looking for?
                </H3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Our support team is always ready to help.
                </p>
                <Button className="mt-6 h-11 rounded-full px-8">
                    <LifeBuoy className="mr-2 size-5" />
                    Contact Support
                </Button>
            </div>
        </div>
    )
}
