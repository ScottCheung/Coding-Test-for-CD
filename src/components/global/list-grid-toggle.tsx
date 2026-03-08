"use client"

import * as React from "react"
import { List, LayoutGrid } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/UI/toggle-group"
import { usePreferencesActions, usePreferencesStore } from "@/lib/store/preferences-store"

export function ListGridToggle() {
    const viewMode = usePreferencesStore((state) => state.viewMode)
    const { setViewMode } = usePreferencesActions()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const items: ToggleGroupItem[] = [
        { value: "table", label: "List", icon: List },
        { value: "card", label: "Grid", icon: LayoutGrid },
    ]

    if (!mounted) {
        return <div className="h-10 w-[72px] rounded-full bg-glass" />
    }

    return (
        <ToggleGroup
            id="view-mode-toggle"
            items={items}
            value={viewMode}
            onValueChange={(val) => setViewMode(val as "table" | "card")}
        />
    )
}
