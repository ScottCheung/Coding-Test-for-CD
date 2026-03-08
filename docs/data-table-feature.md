# 高级数据表格功能实现计划

## 📋 需求概述

创建一个功能强大的数据表格组件，支持：
1. ✅ **列排序**（升序/降序）
2. ✅ **列可见性控制**（批量管理对话框）
3. ✅ **列拖拽重排序**（拖拽改变顺序）
4. 🔄 **行隐藏**（待实现）
5. ✅ **行选择**（复选框）

## ✅ 已完成

### 1. 依赖管理
- ✅ 移除 `@radix-ui/react-dropdown-menu`
- ✅ 安装 `@dnd-kit` 相关库

### 2. 组件实现
- ✅ `src/components/ui/data-table.tsx` - 主表格组件，集成 Dialog 和 DndKit
- ✅ `src/components/ui/dialog.tsx` - 复用现有的对话框组件

### 3. 功能特性
- ✅ **Table Settings 对话框**：点击按钮打开，集中管理列设置
- ✅ **批量可见性控制**：在对话框中勾选/取消勾选
- ✅ **拖拽排序**：在对话框中拖拽列项改变顺序
- ✅ **增强反馈**：拖拽时的视觉效果，排序图标颜色

## 📖 使用方法

### 基础示例

```tsx
import { DataTable } from "@/components/ui/data-table"

// 使用方式不变，组件内部已升级
<DataTable
    columns={columns}
    data={data}
    enableSorting={true}
    enableColumnVisibility={true}
    enableRowSelection={true}
    onRowSelectionChange={setSelectedRows}
/>
```

### 列定义注意事项

为了支持拖拽排序，列定义中的 `id` 或 `accessorKey` 将被用作唯一标识符。

```tsx
const columns: ColumnDef<T>[] = [
    {
        id: "select", // 必须有 id
        // ...
    },
    {
        accessorKey: "name", // 或 accessorKey
        header: "Name",
    }
]
```

## 🎨 交互说明

### 1. 打开设置
点击表格右上角的 "Table Settings" 按钮，打开列管理对话框。

### 2. 调整列顺序
在对话框中，按住列左侧的 **Grip 图标**（六个点）进行拖拽，松开后即完成排序。表格列顺序会立即更新。

### 3. 切换可见性
在对话框中，点击列右侧的 **复选框** 即可显示/隐藏该列。

### 4. 排序数据
点击表格列头，切换 升序/降序/默认。排序激活时图标会变蓝。

## 🔄 待实现功能

### 1. 行隐藏功能
添加每行的隐藏按钮或右键菜单。

### 2. 持久化设置
将用户的列顺序、可见性等设置保存到 localStorage。

## 💡 提示

- 拖拽排序目前在对话框中进行，这样可以避免直接在表头拖拽可能带来的交互冲突（如与点击排序冲突）。
- 对话框提供了更好的批量操作体验。
