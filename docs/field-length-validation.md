# 字段长度限制实现

## 问题描述

表单字段没有字数限制，导致用户可能输入过长的内容，造成后端创建/更新失败。

## 解决方案

为所有表单字段添加了前端验证和 HTML 属性限制，确保数据符合后端要求。

## 实现的字段限制

### 1. **Accounts (账户)**

文件：`src/app/(dashboard)/accounts/components/account-form.tsx`

| 字段 | 最大长度 | 说明 |
|------|---------|------|
| Name (账户名称) | 100 字符 | 公司或组织名称 |
| Code (账户代码) | 20 字符 | 简短的唯一标识符 |

**验证规则**：
```typescript
{
    required: "Name is required",
    maxLength: {
        value: 100,
        message: "Name must be 100 characters or less"
    }
}
```

### 2. **Employment Types (雇佣类型)**

文件：`src/app/(dashboard)/employment-types/components/employment-type-configuration-dialog.tsx`

| 字段 | 最大长度 | 说明 |
|------|---------|------|
| Code (代码) | 20 字符 | 如 "FT", "PT", "CASUAL" |
| Name (名称) | 100 字符 | 如 "Full-Time", "Part-Time" |
| Description (描述) | 500 字符 | 详细说明（可选） |

**验证规则**：
```typescript
// Code
{
    required: "Code is required",
    maxLength: {
        value: 20,
        message: "Code must be 20 characters or less"
    }
}

// Name
{
    required: "Name is required",
    maxLength: {
        value: 100,
        message: "Name must be 100 characters or less"
    }
}

// Description
{
    maxLength: {
        value: 500,
        message: "Description must be 500 characters or less"
    }
}
```

### 3. **Leave Types (假期类型)**

文件：`src/app/(dashboard)/leaves/components/leave-configuration-dialog.tsx`

| 字段 | 最大长度 | 说明 |
|------|---------|------|
| Code (代码) | 20 字符 | 如 "AL", "PL", "LSL" |
| Name (名称) | 100 字符 | 如 "Annual Leave", "Personal Leave" |
| Description (描述) | 500 字符 | 内部HR备注（可选） |

**验证规则**：与 Employment Types 相同

## 技术实现

### 1. **React Hook Form 验证**

使用 `register` 函数的 `maxLength` 选项：

```typescript
{...register("Name", { 
    required: "Name is required",
    maxLength: {
        value: 100,
        message: "Name must be 100 characters or less"
    }
})}
```

### 2. **HTML 原生限制**

在组件上添加 `maxLength` 属性：

```tsx
<InputField
    label="Account Name"
    {...register("Name", { ... })}
    maxLength={100}  // HTML 原生限制
/>
```

### 3. **错误显示**

验证错误会自动显示在字段下方：

```tsx
error={errors.Name?.message}
```

## 用户体验

### 输入时的行为：

1. **字符计数**：
   - HTML `maxLength` 属性会阻止用户输入超过限制的字符
   - 用户无法继续输入超过限制的内容

2. **验证反馈**：
   - 如果用户尝试提交超长内容，会显示错误消息
   - 错误消息清晰说明字符限制

3. **视觉提示**：
   - 错误字段会显示红色边框
   - 错误消息显示在字段下方

### 示例错误消息：

- ✅ "Name must be 100 characters or less"
- ✅ "Code must be 20 characters or less"
- ✅ "Description must be 500 characters or less"

## 字段长度标准

基于常见数据库字段长度和最佳实践：

| 字段类型 | 推荐长度 | 理由 |
|---------|---------|------|
| Code (代码) | 20 | 简短唯一标识符，便于输入和记忆 |
| Name (名称) | 100 | 足够容纳大多数名称，不会太长 |
| Description (描述) | 500 | 允许详细说明，但不至于过长 |

## 测试场景

### 场景 1：正常输入
1. 输入符合长度限制的内容
2. 提交表单 → ✅ 成功

### 场景 2：超长输入
1. 尝试输入超过限制的字符
2. HTML `maxLength` 阻止继续输入
3. 无法输入更多字符

### 场景 3：粘贴超长内容
1. 粘贴超过限制的文本
2. 内容会被自动截断到最大长度
3. 提交时通过验证

### 场景 4：验证错误
1. 如果绕过 HTML 限制（如通过开发者工具）
2. React Hook Form 验证会捕获错误
3. 显示错误消息，阻止提交

## 组件支持

### InputField 组件
- ✅ 支持 `maxLength` 属性
- ✅ 通过 `...props` 传递到底层 `<Input>`
- ✅ 支持错误显示

### LabeledTextarea 组件
- ✅ 支持 `maxLength` 属性
- ✅ 通过 `...props` 传递到底层 `<textarea>`
- ✅ 支持错误显示

## 未来改进

1. **字符计数器**：
   - 显示 "45/100" 样式的实时字符计数
   - 帮助用户了解剩余可用字符

2. **动态限制**：
   - 从后端 `/meta` 端点获取字段限制
   - 根据后端配置动态设置限制

3. **国际化**：
   - 支持多语言错误消息
   - 考虑不同语言的字符长度差异

4. **更智能的验证**：
   - 去除首尾空格后再验证
   - 警告接近限制的输入

## 总结

✅ **已完成**：
- 所有表单字段添加了 `maxLength` 验证
- 使用 React Hook Form 和 HTML 原生限制双重保护
- 清晰的错误消息提示用户
- 防止后端创建/更新失败

✅ **字段覆盖**：
- Accounts: Name (100), Code (20)
- Employment Types: Code (20), Name (100), Description (500)
- Leave Types: Code (20), Name (100), Description (500)

现在用户无法输入超长内容，确保数据质量和后端兼容性！🎉
