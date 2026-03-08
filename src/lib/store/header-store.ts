import { create } from 'zustand'
import { ReactNode } from 'react'

interface HeaderState {
    title: string
    description?: string
    actions?: ReactNode
    children?: ReactNode
}

interface HeaderStore extends HeaderState {
    setHeader: (config: HeaderState) => void
    resetHeader: () => void
}

const initialState: HeaderState = {
    title: '',
    description: undefined,
    actions: null,
    children: null,
}

export const useHeaderStore = create<HeaderStore>((set) => ({
    ...initialState,
    setHeader: (config) => set(config),
    resetHeader: () => set(initialState),
}))
