import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VisibilityState } from '@tanstack/react-table'

interface ColumnSettings {
    visibility: VisibilityState
    order: string[]
}

interface PreferencesState {
    viewMode: 'table' | 'card' | 'chart'
    isSelectionMode: boolean
    columnSettings: Record<string, ColumnSettings>

    actions: {
        setViewMode: (mode: 'table' | 'card' | 'chart') => void
        setSelectionMode: (isSelectionMode: boolean) => void
        setColumnSettings: (viewId: string, settings: Partial<ColumnSettings>) => void
    }
}

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            viewMode: 'card',
            isSelectionMode: false,
            columnSettings: {},

            actions: {
                setViewMode: (mode) => set({ viewMode: mode }),
                setSelectionMode: (mode) => set({ isSelectionMode: mode }),
                setColumnSettings: (viewId, settings) => set((state) => {
                    const currentSettings = state.columnSettings[viewId] || { visibility: {}, order: [] }
                    return {
                        columnSettings: {
                            ...state.columnSettings,
                            [viewId]: {
                                ...currentSettings,
                                ...settings
                            }
                        }
                    }
                })
            }
        }),
        {
            name: 'ui-preferences',
            partialize: (state) => ({
                viewMode: state.viewMode,
                isSelectionMode: state.isSelectionMode,
                columnSettings: state.columnSettings,
            }),
            version: 2,
            migrate: (persistedState: unknown, version: number) => {
                if (version < 2) {
                    // Start fresh if version < 2 (handles 0 and 1)
                    return {
                        viewMode: 'card',
                        isSelectionMode: false,
                        columnSettings: {},
                    }
                }
                return persistedState as PreferencesState
            },
        }
    )
)

export const usePreferencesActions = () => usePreferencesStore((state) => state.actions)
