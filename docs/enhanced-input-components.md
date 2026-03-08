# 增强的输入组件功能

## 新增功能

我已经为 `InputField` 和 `LabeledTextarea` 组件添加了以下增强功能：

### ✨ 1. 字符计数器

**显示位置**：输入框右下角

**显示格式**：`当前字数/最大字数`（例如：`45/100`）

**颜色变化**：
- 正常状态：灰色 (`text-gray-400`)
- 接近限制（>90%）：橙色 (`text-orange-500`)，字体加粗

**示例**：
```
[输入框]
错误消息（如有）          45/100
```

### 🗑️ 2. 一键清除按钮

**显示条件**：当输入框有内容时

**位置**：输入框右侧（X 图标）

**功能**：
- 点击清除所有内容
- 清除后自动聚焦到输入框
- 支持键盘操作

**视觉效果**：
- 灰色图标
- 悬停时变深色
- 平滑过渡动画

### 🔄 3. 自动恢复原始值

**触发条件**：
- 输入框为空
- 失去焦点（点击外部）

**行为**：
- 如果用户清空了输入框
- 然后点击外部区域
- 自动恢复到原始值

**使用场景**：
- 用户误删内容
- 想要撤销编辑
- 快速恢复默认值

## 使用方法

### InputField

```tsx
<InputField
    label="Account Name"
    placeholder="Enter name"
    maxLength={100}           // 必需：启用字符计数
    showCharCount={true}      // 可选：显示计数器（默认 true）
    {...register("Name")}
/>
```

### LabeledTextarea

```tsx
<LabeledTextarea
    label="Description"
    placeholder="Enter description"
    maxLength={500}           // 必需：启用字符计数
    showCharCount={true}      // 可选：显示计数器（默认 true）
    rows={4}
    {...register("Description")}
/>
```

### 禁用字符计数器

```tsx
<InputField
    label="Email"
    showCharCount={false}     // 不显示字符计数
    {...register("Email")}
/>
```

## 功能演示

### 场景 1：正常输入

```
用户输入：Hello World
显示：
┌─────────────────────────┐
│ Hello World            │
│                      [X]│
└─────────────────────────┘
                    11/100
```

### 场景 2：接近限制

```
用户输入：92 个字符...
显示：
┌─────────────────────────┐
│ Very long text...      │
│                      [X]│
└─────────────────────────┘
                    92/100  ← 橙色加粗
```

### 场景 3：一键清除

```
步骤 1：输入框有内容
┌─────────────────────────┐
│ Some text              │
│                      [X]│ ← 点击这里
└─────────────────────────┘

步骤 2：清除后
┌─────────────────────────┐
│ |                       │ ← 自动聚焦
└─────────────────────────┘
                     0/100
```

### 场景 4：自动恢复

```
步骤 1：原始值
┌─────────────────────────┐
│ Original Value         │
└─────────────────────────┘

步骤 2：用户清空
┌─────────────────────────┐
│                         │
└─────────────────────────┘

步骤 3：点击外部 → 自动恢复
┌─────────────────────────┐
│ Original Value         │ ← 恢复了！
└─────────────────────────┘
```

## 技术实现

### 状态管理

```typescript
const [internalValue, setInternalValue] = useState(value || defaultValue || "")
const [originalValue, setOriginalValue] = useState(value || defaultValue || "")
const [isFocused, setIsFocused] = useState(false)
```

### 清除功能

```typescript
const handleClear = () => {
    const event = {
        target: { value: "" },
        currentTarget: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>
    
    setInternalValue("")
    onChange?.(event)
    inputRef.current?.focus()  // 自动聚焦
}
```

### 恢复功能

```typescript
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    
    // 如果为空，恢复原始值
    if (!e.target.value && originalValue) {
        const event = {
            target: { value: String(originalValue) },
            currentTarget: { value: String(originalValue) },
        } as React.ChangeEvent<HTMLInputElement>
        
        setInternalValue(originalValue)
        onChange?.(event)
    }
    
    onBlur?.(e)
}
```

### 字符计数

```typescript
const currentLength = String(internalValue || "").length

{showCharCount && maxLength && (
    <p className={cn(
        "text-xs transition-colors",
        currentLength > maxLength * 0.9 
            ? "text-orange-500 dark:text-orange-400 font-medium" 
            : "text-gray-400 dark:text-ink-secondary"
    )}>
        {currentLength}/{maxLength}
    </p>
)}
```

## 兼容性

### React Hook Form

✅ 完全兼容 `react-hook-form`
✅ 支持 `register` 和 `Controller`
✅ 正确触发验证
✅ 错误消息正常显示

### 受控/非受控

✅ 支持受控组件（`value` prop）
✅ 支持非受控组件（`defaultValue` prop）
✅ 自动同步外部值变化

### TypeScript

✅ 完整的类型定义
✅ 继承所有原生 input/textarea 属性
✅ 类型安全的 ref 转发

## 样式特性

### 响应式设计

- ✅ 移动端友好
- ✅ 触摸优化
- ✅ 暗色模式支持

### 动画效果

- ✅ 清除按钮淡入淡出
- ✅ 字符计数颜色过渡
- ✅ 悬停状态平滑变化

### 布局

- ✅ 错误消息和字符计数并排显示
- ✅ 保持一致的高度（避免布局跳动）
- ✅ 图标、输入框、清除按钮完美对齐

## 用户体验优势

### 1. **即时反馈**
- 用户随时知道还能输入多少字符
- 接近限制时有视觉警告

### 2. **操作便捷**
- 一键清除，无需手动删除
- 误删可自动恢复

### 3. **减少错误**
- 防止超长输入
- 清晰的限制提示

### 4. **提高效率**
- 快速清空重新输入
- 自动恢复减少重复工作

## 示例代码

### 完整的表单示例

```tsx
import { useForm } from "react-hook-form"
import { InputField } from "@/components/ui/labeled-input"
import { LabeledTextarea } from "@/components/ui/labeled-textarea"

function MyForm() {
    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
                label="Account Name"
                placeholder="e.g. Acme Corp"
                {...register("Name", { 
                    required: "Name is required",
                    maxLength: {
                        value: 100,
                        message: "Name must be 100 characters or less"
                    }
                })}
                error={errors.Name?.message}
                maxLength={100}
            />

            <LabeledTextarea
                label="Description"
                placeholder="Enter description..."
                {...register("Description", {
                    maxLength: {
                        value: 500,
                        message: "Description must be 500 characters or less"
                    }
                })}
                error={errors.Description?.message}
                maxLength={500}
                rows={4}
            />

            <button type="submit">Submit</button>
        </form>
    )
}
```

## 总结

✅ **字符计数器**：实时显示当前/最大字数
✅ **一键清除**：快速清空输入内容
✅ **自动恢复**：误删可自动恢复原始值
✅ **视觉反馈**：接近限制时颜色警告
✅ **完全兼容**：React Hook Form 和 TypeScript
✅ **用户友好**：直观的交互体验

这些增强功能大大提升了表单的可用性和用户体验！🎉
