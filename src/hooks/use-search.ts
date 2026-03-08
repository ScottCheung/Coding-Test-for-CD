import { useState } from "react"
import { useDebounce } from "./use-debounce"

interface UseSearchOptions {
    initialValue?: string
    delay?: number
}

interface UseSearchResult {
    value: string
    onChange: (value: string) => void
    debouncedValue: string
    isDebouncing: boolean
}

export function useSearch({ initialValue = "", delay = 500 }: UseSearchOptions = {}): UseSearchResult {
    const [value, setValue] = useState(initialValue)
    const debouncedValue = useDebounce(value, delay)
    // isDebouncing is true if the current value hasn't propagated to debouncedValue yet
    const isDebouncing = value !== debouncedValue

    return {
        value,
        onChange: setValue,
        debouncedValue,
        isDebouncing
    }
}
