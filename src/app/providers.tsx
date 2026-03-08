"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { Toaster } from "@/components/UI/toast/toaster"

import { ThemeProvider } from "@/components/theme-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                {children}
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
    )
}
