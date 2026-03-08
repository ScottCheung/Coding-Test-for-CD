import { create } from 'zustand'
import { ReactNode } from 'react'

interface DrawerConfig {
    content: ReactNode | null
    title?: string
    description?: string
    width?: string | number
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
    id: string
    type: NotificationType
    title?: string
    message: string
    duration?: number
}

interface LayoutState {
    isSidebarCollapsed: boolean
    isDrawerOpen: boolean
    isDialogOpen: boolean

    // Global Drawer State
    drawerConfig: DrawerConfig

    // Global Notification State
    notifications: Notification[]

    actions: {
        toggleSidebar: () => void
        setSidebarCollapsed: (collapsed: boolean) => void
        openDrawer: (config: DrawerConfig) => void
        closeDrawer: () => void
        setDrawerOpen: (open: boolean) => void
        setDialogOpen: (open: boolean) => void
        addNotification: (notification: Omit<Notification, 'id'>) => void
        removeNotification: (id: string) => void
        clearNotifications: () => void
    }
}

export const useLayoutStore = create<LayoutState>((set) => ({
    isSidebarCollapsed: false,
    isDrawerOpen: false,
    isDialogOpen: false,

    drawerConfig: {
        content: null,
        title: undefined,
        description: undefined,
        width: undefined,
    },

    notifications: [],

    actions: {
        toggleSidebar: () => set((state) => {
            const newCollapsed = !state.isSidebarCollapsed
            return {
                isSidebarCollapsed: newCollapsed,
                // If expanding sidebar (newCollapsed is false), close drawer
                isDrawerOpen: !newCollapsed ? false : state.isDrawerOpen
            }
        }),

        setSidebarCollapsed: (collapsed) => set((state) => ({
            isSidebarCollapsed: collapsed,
            // If expanding sidebar, close drawer
            isDrawerOpen: !collapsed ? false : state.isDrawerOpen
        })),

        openDrawer: (config) => set((state) => ({
            isDrawerOpen: true,
            drawerConfig: config,
            // Mutual exclusion: collapse sidebar and close dialogs
            isSidebarCollapsed: true,
            isDialogOpen: false
        })),

        closeDrawer: () => set(() => ({
            isDrawerOpen: false,
            // We can optionally clear content here or leave it for next open
            // drawerConfig: { content: null } 
        })),

        setDrawerOpen: (open) => set((state) => ({
            isDrawerOpen: open,
            isSidebarCollapsed: open ? true : state.isSidebarCollapsed,
            isDialogOpen: open ? false : state.isDialogOpen
        })),

        setDialogOpen: (open) => set((state) => ({
            isDialogOpen: open,
            isSidebarCollapsed: open ? true : state.isSidebarCollapsed,
            isDrawerOpen: open ? false : state.isDrawerOpen
        })),

        addNotification: (notification) => {
            const id = Math.random().toString(36).substring(2, 9)
            set((state) => ({
                notifications: [...state.notifications, { ...notification, id }],
            }))

            if (notification.duration !== 0) {
                setTimeout(() => {
                    set((state) => ({
                        notifications: state.notifications.filter((n) => n.id !== id),
                    }))
                }, notification.duration || 5000)
            }
        },

        removeNotification: (id) => set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
        clearNotifications: () => set(() => ({
            notifications: [],
        })),
    },
}))

export const useLayoutActions = () => useLayoutStore((state) => state.actions)
