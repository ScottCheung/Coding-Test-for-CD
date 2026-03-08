"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, Edit2, Trash2, LayoutGrid, List, Building2, GripVertical } from "lucide-react"
import { Button } from "@/components/UI/Button"
import { Checkbox } from "@/components/UI/checkbox"
import { StatusSwitch } from "@/components/custom/status-switch"
import { Badge } from "@/components/UI/badge"
import { IconBox } from "@/components/UI/icon/box"
import { DataTable } from "@/components/UI/table/data-table"
import { TableToolbar } from "@/components/custom/table-toolbar"
import { SegmentedControl } from "@/components/UI/segmented-control"
import { cn } from "@/lib/utils"
import { ColumnDef, VisibilityState } from "@tanstack/react-table"
import { useSearch } from "@/hooks/use-search"
import { WaterfallLayout } from "@/components/layout/waterfallLayout"
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount, useDeleteAccounts, Account } from "@/api"
import { notify } from "@/lib/notifications"
import { CardBackgroundInitials } from "@/components/UI/card/card-background-initials"
import { AddEntityCard } from "@/components/custom/add-entity-card"
import { AutoTooltip } from "@/components/UI/tooltip/auto-tooltip"
import { EditingOverlay } from "@/components/custom/overlay/editing-overlay"
import { SelectionOverlay } from "@/components/custom/overlay/selection-overlay"
import { ColumnSettingsDialog } from "@/components/UI/table/column-settings"
import { useLayoutStore } from "@/lib/store/layout-store"
import { Tooltip } from "@/components/UI/tooltip"
import { AccountConfigurationDialog } from "../components/account-configuration-dialog"
import { useHeader } from "@/hooks/use-header"
import { H3 } from "@/components/UI/text/typography"
import { usePreferencesActions, usePreferencesStore } from "@/lib/store/preferences-store"

export function AccountsView() {
    const { data: accounts } = useAccounts()
    const updateAccount = useUpdateAccount()
    const deleteAccount = useDeleteAccount()
    const deleteAccounts = useDeleteAccounts()
    const searchHook = useSearch()
    const { value: search, debouncedValue: debouncedSearch, isDebouncing } = searchHook
    const [selectedRows, setSelectedRows] = useState<Account[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

    const viewMode = usePreferencesStore((state) => state.viewMode)
    const isSelectionMode = usePreferencesStore((state) => state.isSelectionMode)
    const columnSettings = usePreferencesStore((state) => state.columnSettings['accounts'])
    const { setViewMode, setSelectionMode, setColumnSettings } = usePreferencesActions()
    const columnVisibility = columnSettings?.visibility || {}
    const columnOrder = columnSettings?.order || []

    const { actions: { openDrawer, closeDrawer }, isDrawerOpen } = useLayoutStore()

    // Clear editingId when drawer closes
    useEffect(() => {
        if (!isDrawerOpen) {
            setEditingId(null)
        }
    }, [isDrawerOpen])

    const filteredAccounts = accounts?.filter(account => {
        if (!debouncedSearch) return true
        const query = debouncedSearch.toLowerCase()
        const matches = (val: any) => String(val).toLowerCase().includes(query)
        return (
            matches(account.Name) ||
            matches(account.Code) ||
            (account.IsActive ? matches("active") : matches("inactive"))
        )
    })

    const handleDelete = async (id: string) => {
        const account = accounts?.find(a => a.AccountId === id)
        if (confirm(`Are you sure you want to delete the account "${account?.Name}"?`)) {
            try {
                await deleteAccount.mutateAsync(id)
                notify.success(`You successfully deleted the account ———— ${account?.Name || 'Unknown'}`, "Delete Account Success")
            } catch (error) {
                notify.error("Failed to delete account. Please try again later.", "Delete Account Error")
            }
        }
    }

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return

        const count = selectedRows.length
        if (confirm(`Are you sure you want to delete ${count} account${count > 1 ? 's' : ''}?`)) {
            try {
                const ids = selectedRows.map(a => a.AccountId)
                await deleteAccounts.mutateAsync(ids)
                setSelectedRows([])
                notify.success(`You successfully deleted ${count} account${count > 1 ? 's' : ''}`, "Bulk Delete Success")
            } catch (error) {
                notify.error("Failed to delete accounts. Please try again later.", "Bulk Delete Error")
            }
        }
    }

    const toggleSelection = (account: Account) => {
        setSelectedRows(prev => {
            const isSelected = prev.some(r => r.AccountId === account.AccountId)
            if (isSelected) {
                return prev.filter(r => r.AccountId !== account.AccountId)
            } else {
                return [...prev, account]
            }
        })
    }

    // Clear selection when selection mode is disabled
    useEffect(() => {
        if (!isSelectionMode) {
            setSelectedRows([])
        }
    }, [isSelectionMode])

    // Sort order for Account is usually Name by default
    const columns = useMemo<ColumnDef<Account>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            enableSorting: false,
            size: 50,
        },
        {
            accessorKey: "Name",
            header: "Name",
            cell: ({ row }) => (
                <AutoTooltip className="font-medium text-primary">
                    {row.getValue("Name")}
                </AutoTooltip>
            ),
        },
        {
            accessorKey: "Code",
            header: "Code",
            cell: ({ row }) => (
                <Badge variant="code">
                    <AutoTooltip>
                        {row.getValue("Code")}
                    </AutoTooltip>
                </Badge>
            ),
        },
        {
            accessorKey: "IsActive",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("IsActive")
                return (
                    <span className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold",
                        isActive
                            ? "bg-green-500/10 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-500/10 text-ink-secondary dark:bg-zinc-800 dark:text-gray-400"
                    )}>
                        {isActive ? "Active" : "Inactive"}
                    </span>
                )
            },
        },
    ], [updateAccount])

    const openCreate = () => {
        setEditingId(null)
        openDrawer({
            title: "Create Account",
            width: 500,
            content: (
                <AccountConfigurationDialog
                    onClose={closeDrawer}
                    account={null}
                />
            )
        })
    }

    const openEdit = (account: Account) => {
        setEditingId(account.AccountId)
        openDrawer({
            title: "Edit Account",
            width: 500,
            content: (
                <AccountConfigurationDialog
                    onClose={() => {
                        setEditingId(null)
                        closeDrawer()
                    }}
                    account={account}
                />
            )
        })
    }

    // Initialize column order on load
    useEffect(() => {
        if (columnOrder.length === 0) {
            setColumnSettings('accounts', {
                order: columns.map(c => (c.id || (c as any).accessorKey) as string)
            })
        }
    }, [columns, columnOrder.length, setColumnSettings])


    const isSettingsOpen = isDrawerOpen && useLayoutStore.getState().drawerConfig.title === "View Settings"

    const handleSettingsClick = () => {
        if (isSettingsOpen) {
            notify.info("View settings closed")
            closeDrawer()
            return
        }

        notify.info("View settings opened")
        setEditingId(null)
        openDrawer({
            title: "View Settings",
            width: 400,
            content: (
                <ColumnSettingsDialog
                    columns={columns}
                    columnOrder={columnOrder}
                    setColumnOrder={(order) => setColumnSettings('accounts', { order })}
                    columnVisibility={columnVisibility}
                    setColumnVisibility={(updaterOrValue) => {
                        const newValue = typeof updaterOrValue === 'function' ? (updaterOrValue as (prev: any) => any)(columnVisibility) : updaterOrValue
                        setColumnSettings('accounts', { visibility: newValue })
                    }}
                    onClose={() => {
                        notify.info("View settings closed")
                        closeDrawer()
                    }}
                />
            )
        })
    }

    useHeader({
        title: "Accounts",
        description: "Manage your client accounts.",
        children: (
            <TableToolbar
                search={{
                    value: search,
                    onChange: searchHook.onChange,
                    placeholder: "Search accounts...",
                    isDebouncing
                }}
                onSettingsClick={handleSettingsClick}
                isSettingsOpen={isSettingsOpen}
            >
                {selectedRows.length > 0 && (
                    <Tooltip content={`Delete ${selectedRows.length} selected items`}>
                        <Button
                            onClick={handleBulkDelete}
                            variant="destructive"
                            size="icon"
                            className="rounded-full"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </Tooltip>
                )}
                <Tooltip content={isSelectionMode ? "Exit Selection Mode" : "Multi-Select"}>
                    <Button
                        onClick={() => {
                            const newMode = !isSelectionMode
                            setSelectionMode(newMode)
                            if (newMode) {
                                notify.info("Entered multi-select mode")
                                closeDrawer()
                                useLayoutStore.getState().actions.setSidebarCollapsed(true)
                            } else {
                                notify.info("Exited multi-select mode")
                            }
                        }}
                        variant={isSelectionMode ? "default" : "ghost"}
                        size="icon"
                    >
                        <GripVertical className="size-4" />
                    </Button>
                </Tooltip>
                <Tooltip content="Create New Account">
                    <div className="inline-block">
                        <Button
                            onClick={openCreate}
                            size="icon"
                            className="rounded-full"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>
                </Tooltip>
            </TableToolbar>
        )
    })

    return (
        <div className="space-y-6">
            {viewMode === "table" ? (
                <div className="rounded-2xl border border-gray-200 bg-panel -sm dark:border-zinc-800 /50">

                    <DataTable
                        columns={columns}
                        data={filteredAccounts || []}
                        enableSorting={true}
                        enableColumnVisibility={true}
                        enableRowSelection={true}
                        onRowSelectionChange={setSelectedRows}
                        hideToolbar={true}
                        isSelectionMode={isSelectionMode}
                        onSelectionModeChange={(mode) => setSelectionMode(mode)}
                        // Settings
                        // Column State
                        columnVisibility={columnVisibility}
                        onColumnVisibilityChange={(updaterOrValue) => {
                            const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(columnVisibility) : updaterOrValue
                            setColumnSettings('accounts', { visibility: newValue })
                        }}
                        columnOrder={columnOrder}
                        onColumnOrderChange={(updaterOrValue) => {
                            const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(columnOrder) : updaterOrValue
                            setColumnSettings('accounts', { order: newValue })
                        }}

                        defaultSorting={[{ id: "Name", desc: false }]}
                        renderRowActions={(row) => (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-ink-secondary hover:text-gray-900 hover:bg-gray-500/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800"
                                    onClick={() => openEdit(row.original)}
                                >
                                    <Edit2 className="size-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-ink-secondary hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                                    onClick={() => handleDelete(row.original.AccountId)}
                                >
                                    <Trash2 className="size-5" />
                                </Button>
                            </>
                        )}
                    />
                </div>
            ) : (
                <WaterfallLayout
                    minColumnWidth={isSelectionMode ? { sm: 150, md: 150, lg: 180, xl: 200 } : undefined}
                    itemScale={isSelectionMode ? 0.9 : 1}
                >
                    {filteredAccounts?.map((account) => {
                        const isSelected = selectedRows.some(r => r.AccountId === account.AccountId)
                        return (
                            <div
                                key={account.AccountId}
                                onClick={() => isSelectionMode ? toggleSelection(account) : openEdit(account)}
                                className={cn(
                                    "group relative overflow-hidden rounded-card border-2 bg-panel p-card transition-all hover:border-primary/50 hover:dark:border-primary cursor-pointer",
                                    isSelected ? "border-green-500 bg-green-50/5 dark:bg-green-900/10 ring-1 ring-green-500" : "border-transparent"
                                )}
                            >
                                {isSelected && <SelectionOverlay />}
                                {editingId === account.AccountId && <EditingOverlay />}
                                <CardBackgroundInitials name={account.Name} />
                                <div className="relative z-10">
                                    <div className="mb-4 flex items-start justify-between">
                                        <IconBox>
                                            <Building2 className="size-6" />
                                        </IconBox>
                                        {/* Status is usually top-right, but let's make it dynamic or keep fixed? 
                                            The user wants order change. If IsActive is moved, it should move.
                                            However, the design usually has status top-right. 
                                            Let's keep the IconBox fixed top-left, but everything else dynamic.
                                        */}
                                    </div>

                                    {columnOrder.map(colId => {
                                        if (columnVisibility[colId] === false) return null

                                        switch (colId) {
                                            case 'Name':
                                                return (
                                                    <H3 key={colId} className="mb-2 text-primary">
                                                        <AutoTooltip>
                                                            {account.Name}
                                                        </AutoTooltip>
                                                    </H3>
                                                )
                                            case 'Code':
                                                return (
                                                    <div key={colId} className="mb-4">
                                                        <Badge variant="code">
                                                            <AutoTooltip>
                                                                {account.Code}
                                                            </AutoTooltip>
                                                        </Badge>
                                                    </div>
                                                )
                                            case 'IsActive':
                                                return (
                                                    <div key={colId} className="mb-4">
                                                        <span className={cn(
                                                            "rounded-full px-2.5 py-1 text-xs font-bold",
                                                            account.IsActive
                                                                ? "bg-green-500/10 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                                                : "bg-gray-500/10 text-ink-secondary dark:bg-zinc-800 dark:text-gray-400"
                                                        )}>
                                                            {account.IsActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                )
                                            default:
                                                return null
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    {/* Add Account Placeholder */}
                    <div key={'add-account'}>
                        <AddEntityCard
                            onClick={openCreate}
                            label="Add Account"
                        /></div>
                </WaterfallLayout>
            )}
        </div>
    )
}
