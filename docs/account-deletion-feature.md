# Account Deletion Feature Implementation

## 概述 (Overview)

已成功实现账户的单个和批量删除功能。

## 实现的功能 (Implemented Features)

### 1. API 层 (`src/api/accounts.ts`)

添加了以下函数和 hooks：

- **`deleteAccount(id: string)`**: 删除单个账户的 API 调用
- **`deleteAccounts(ids: string[])`**: 批量删除多个账户（通过调用多个单个删除 API）
- **`useDeleteAccount()`**: React Query mutation hook，用于单个删除
- **`useDeleteAccounts()`**: React Query mutation hook，用于批量删除

### 2. UI 层 (`src/app/(dashboard)/accounts/sections/accounts-view.tsx`)

#### 新增状态管理：
- `selectedIds`: 存储被选中的账户 ID 数组

#### 新增功能：
1. **复选框选择**：
   - 表头有全选/取消全选复选框
   - 每行都有独立的复选框
   
2. **单个删除**：
   - 每行的操作列添加了删除按钮（垃圾桶图标）
   - 点击后会弹出确认对话框
   - 删除成功后显示成功通知

3. **批量删除**：
   - 当选中一个或多个账户时，页面顶部会显示"Delete X Account(s)"按钮
   - 点击后会弹出确认对话框，显示要删除的账户数量
   - 删除成功后清空选择并显示成功通知

#### 新增处理函数：
- `handleDelete(id)`: 处理单个账户删除
- `handleBulkDelete()`: 处理批量删除
- `toggleSelectAll()`: 切换全选状态
- `toggleSelect(id)`: 切换单个账户的选择状态

### 3. UI 组件 (`src/components/ui/checkbox.tsx`)

创建了新的 Checkbox 组件，使用 Radix UI 的 checkbox 原语，支持：
- 亮色和暗色主题
- 键盘导航
- 无障碍访问

## API 端点使用

当前实现使用现有的 API 端点：
```
DELETE /api/v1/accounts/{account_id}
```

对于批量删除，前端会并行调用多个单个删除端点。如果后端将来支持批量删除端点，可以轻松更新 `deleteAccounts` 函数。

## 用户体验

1. **视觉反馈**：
   - 删除按钮在鼠标悬停时显示
   - 选中的行会有视觉指示
   - 批量删除按钮使用红色（destructive）样式

2. **确认机制**：
   - 所有删除操作都需要用户确认
   - 确认对话框会显示要删除的账户数量

3. **通知反馈**：
   - 成功删除后显示成功消息
   - 失败时显示错误消息

## 技术栈

- **React Query**: 用于数据获取和缓存失效
- **Radix UI**: 用于无障碍的 UI 组件
- **Lucide Icons**: 用于图标
- **自定义通知系统**: 用于用户反馈

## 未来改进建议

1. 如果后端支持，可以添加批量删除的专用 API 端点
2. 可以添加撤销删除功能
3. 可以添加软删除（标记为非活动）而不是硬删除
4. 可以添加删除前的更详细的确认对话框，显示将要删除的账户详情
