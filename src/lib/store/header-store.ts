import { create } from 'zustand'
import { ReactNode } from 'react'

interface HeaderState {
    title: string
    description?: string
    actions?: ReactNode
    children?: ReactNode
}

interface HeaderStore extends HeaderState {
    setHeader: (config: Partial<HeaderState> & { title: string }) => void
    resetHeader: () => void
}

const initialState: HeaderState = {
    title: '',
    description: undefined,
    actions: undefined,
    children: undefined,
}

export const useHeaderStore = create<HeaderStore>((set) => ({
    ...initialState,
    setHeader: (config) => set({
        ...initialState,
        ...config,
    }),
    resetHeader: () => set(initialState),
}))
