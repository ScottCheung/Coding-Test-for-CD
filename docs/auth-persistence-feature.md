# 认证持久化和"记住我"功能实现（优化版）

## 问题描述

1. **没有持久化**：每次刷新页面都需要重新登录
2. **缺少"记住我"功能**：用户无法选择保持登录状态
3. **刷新后退出登录**：页面刷新后认证状态丢失
4. **关闭浏览器后丢失登录**：即使选择"记住我"，关闭浏览器后仍需重新登录

## 解决方案（已优化）

### 1. 增强的认证 Store (`src/lib/store.ts`)

#### 核心改进：
- ✅ **始终使用 localStorage**：确保跨浏览器会话持久化
- ✅ **7天自动过期**：登录后7天自动失效
- ✅ **记录登录时间**：`loginTime` 字段追踪登录时间戳
- ✅ **过期检查**：`isTokenExpired()` 方法检查是否过期
- ✅ **简化存储逻辑**：移除复杂的动态存储选择

#### 关键更改：

```typescript
interface AuthState {
    user: User | null;
    token: string | null;
    rememberMe: boolean;
    loginTime: number | null;  // 新增：记录登录时间
    login: (token: string, rememberMe?: boolean) => void;
    logout: () => void;
    fetchMe: () => Promise<void>;
    setRememberMe: (remember: boolean) => void;
    isTokenExpired: () => boolean;  // 新增：检查是否过期
}

const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天（毫秒）
```

**存储机制**：
- 始终使用 `localStorage`
- 登录时记录 `Date.now()`
- 每次访问时检查是否超过7天

### 2. 登录页面更新 (`src/app/login/sections/login-view.tsx`)

#### 新增 UI 元素：

```tsx
{/* Remember Me Checkbox */}
<div className="flex items-center">
    <input
        id="remember-me"
        type="checkbox"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
    />
    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
        Remember me for 7 days
    </label>
</div>
```

#### 登录逻辑更新：

```typescript
const [rememberMe, setRememberMe] = React.useState(true)

// 在登录时传递 rememberMe 参数和记录登录时间
login(data.access_token, rememberMe)
```

### 3. 增强的 AuthGuard (`src/components/auth/auth-guard.tsx`)

#### 新增功能：

1. **加载状态**：
   - 等待 zustand persist 从存储中恢复状态
   - 显示加载动画，避免闪烁

2. **自动过期检查**：
   - 检查登录是否超过7天
   - 超过7天自动登出并重定向

3. **防止重定向循环**：
   - 只在加载完成且没有 token 时重定向

4. **更好的用户体验**：
   - 显示加载指示器
   - 平滑的状态转换

```typescript
const isTokenExpired = useAuthStore((state) => state.isTokenExpired)
const logout = useAuthStore((state) => state.logout)
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    if (!isLoading) {
        // 检查 token 是否过期
        if (token && isTokenExpired()) {
            logout()
            router.push("/login")
            return
        }
        
        // 检查 token 是否存在
        if (!token) {
            router.push("/login")
        }
    }
}, [token, router, isLoading, isTokenExpired, logout])
```

## 工作流程

### 登录流程：

1. 用户输入凭据
2. 用户选择是否"记住我"（默认选中）
3. 点击"Sign In"
4. 调用 `login(token, rememberMe)`
5. Token、rememberMe 和 loginTime 保存到 localStorage
6. 自动获取用户信息
7. 重定向到 dashboard

### 页面刷新流程：

1. 页面加载
2. AuthGuard 显示加载状态
3. Zustand persist 从 localStorage 恢复状态
4. 检查 token 是否过期（超过7天）
5. 如果未过期且有 token：显示受保护的内容
6. 如果过期或没有 token：自动登出并重定向到登录页

### 登出流程：

1. 调用 `logout()`
2. 清除状态（user, token, loginTime）
3. 清除 localStorage
4. 用户被重定向到登录页

## 存储机制

### LocalStorage（始终使用）
- **位置**：`localStorage['auth-storage']`
- **持久性**：跨浏览器会话（关闭浏览器后仍然保留）
- **过期时间**：7天（604,800,000 毫秒）
- **存储内容**：
  ```json
  {
    "state": {
      "token": "eyJ...",
      "user": {...},
      "rememberMe": true,
      "loginTime": 1733572800000
    },
    "version": 0
  }
  ```

### 过期机制
- 登录时记录 `loginTime = Date.now()`
- 每次访问时计算：`elapsed = Date.now() - loginTime`
- 如果 `elapsed > 7天`：自动登出

## 安全考虑

1. **Token 存储**：
   - Token 存储在浏览器 localStorage 中
   - 通过 HTTPS 传输
   - 建议后端实现 token 过期机制

2. **自动登出**：
   - 401 响应时自动登出
   - 7天后自动过期并登出
   - Token 过期时清除状态

3. **清除机制**：
   - 登出时清除所有存储
   - 支持手动清除

## 用户体验改进

1. ✅ **无需重复登录**：刷新页面保持登录状态
2. ✅ **跨会话持久化**：关闭浏览器后仍然保持登录（7天内）
3. ✅ **平滑的加载体验**：显示加载状态，避免闪烁
4. ✅ **清晰的反馈**：登录成功/失败通知
5. ✅ **默认记住**：默认选中"记住我"，减少用户操作
6. ✅ **自动过期**：7天后自动登出，提高安全性

## 测试场景

### 场景 1：正常登录（记住我 - 已选中）
1. 登录时勾选"Remember me for 7 days"
2. 刷新页面 → ✅ 保持登录
3. 关闭浏览器重新打开 → ✅ 保持登录
4. 7天内访问 → ✅ 保持登录
5. 7天后访问 → ❌ 自动登出，需要重新登录
6. 清除浏览器数据 → ❌ 需要重新登录

### 场景 2：不记住（记住我 - 未选中）
1. 登录时取消勾选"Remember me"
2. 刷新页面 → ✅ 保持登录
3. 关闭浏览器重新打开 → ✅ 仍然保持登录（存储在 localStorage）
4. 注意：即使不勾选，仍会保存到 localStorage，但可以作为未来功能扩展点

### 场景 3：手动登出
1. 点击登出按钮
2. 所有存储被清除
3. 重定向到登录页
4. 刷新页面 → ❌ 需要重新登录

### 场景 4：Token 过期
1. 登录成功
2. 等待7天
3. 访问任何受保护页面
4. AuthGuard 检测到过期
5. 自动登出并重定向到登录页

## 技术栈

- **Zustand**: 状态管理
- **Zustand Persist**: 持久化中间件
- **Next.js**: 路由和页面管理
- **React**: UI 组件
- **TypeScript**: 类型安全

## 未来改进

1. **Token 刷新**：实现自动 token 刷新机制
2. **多设备管理**：显示登录设备列表
3. **安全增强**：添加设备指纹识别
4. **过期提醒**：Token 即将过期时提醒用户
5. **生物识别**：支持指纹/面部识别（移动端）
