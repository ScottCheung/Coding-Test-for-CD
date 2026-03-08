"use client"

import { useEffect } from 'react'
import { useHeaderStore } from '@/lib/store/header-store'
import { ReactNode } from 'react'

interface UseHeaderProps {
    title: string
    description?: string
    actions?: ReactNode
    children?: ReactNode
}

export function useHeader(props: UseHeaderProps) {
    const setHeader = useHeaderStore((state) => state.setHeader)
    const resetHeader = useHeaderStore((state) => state.resetHeader)

    // Use a ref to track if multiple updates happen in the same render cycle
    // or to ensure we only update when props change
    useEffect(() => {
        setHeader(props)

        // Cleanup on unmount
        return () => {
            resetHeader()
        }
    }, [props, setHeader, resetHeader])
}
