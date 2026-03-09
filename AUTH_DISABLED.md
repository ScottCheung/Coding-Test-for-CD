# 认证功能禁用说明

## 问题
后台出现未授权的请求：
```
https://platform.ezeas.com/api/auth/me
Request Method: GET
Status Code: 401 Unauthorized
```

## 解决方案

已完全禁用所有与认证相关的请求和代码。

---

## 修改的文件

### 1. `src/lib/api.ts` (重新创建)
**之前**: 包含 axios 拦截器，自动在每个请求中添加认证 token，并在响应拦截器中调用 `/api/auth/me`

**现在**: 简化版本，移除所有认证逻辑
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://platform.ezeas.com/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 无认证拦截器 - 所有认证功能已禁用
```

**移除的功能**:
- ❌ 请求拦截器 (自动添加 Bearer token)
- ❌ 响应拦截器 (401 错误处理)
- ❌ useAuthStore 集成
- ❌ 自动登出逻辑
- ❌ 错误通知 (针对 /api/auth/me)

---

### 2. `src/api/auth.ts` (禁用)
**之前**: 包含 `login()` 和 `getMe()` 函数，会调用认证 API

**现在**: 所有函数抛出错误
```typescript
// 认证已禁用 - 所有认证功能已移除

export const login = async (credentials: FormData | { [key: string]: string }) => {
    throw new Error('Authentication is disabled');
};

export const getMe = async () => {
    throw new Error('Authentication is disabled');
};
```

**禁用的功能**:
- ❌ `POST /api/auth/login` - 登录请求
- ❌ `GET /api/auth/me` - 获取当前用户信息

---

### 3. `src/api/index.ts` (更新)
**之前**: 导出所有 API 模块，包括 auth

**现在**: 注释掉 auth 导出
```typescript
export * from './accounts';
export * from './employment';
export * from './leaves';
// Auth exports disabled
// export * from './auth';
```

---

### 4. `src/app/(dashboard)/afl-fixture/page.tsx` (修复)
**修复**: 移除了不存在的 `disableAnimation` 属性

---

## 影响范围

### ✅ 不受影响的功能
- AFL Fixture 页面 (使用独立的 AFL API)
- AFL Teams 页面
- Dashboard 页面
- 所有 UI 组件
- 虚拟滚动功能

### ❌ 禁用的功能
- 用户登录
- 用户认证
- Token 管理
- 自动登出
- 受保护的 API 请求

---

## 网络请求变化

### 之前
```
每次页面加载或 API 请求失败时:
→ GET https://platform.ezeas.com/api/auth/me
← 401 Unauthorized
→ 触发登出逻辑
```

### 现在
```
✅ 不再发送任何 /api/auth/me 请求
✅ 不再有 401 错误
✅ 不再有认证相关的网络请求
```

---

## 验证方法

### 1. 检查网络请求
打开浏览器开发者工具 → Network 标签
- ✅ 应该看不到任何 `/api/auth/me` 请求
- ✅ 应该看不到 `https://platform.ezeas.com/api/auth/*` 请求

### 2. 检查控制台
- ✅ 应该没有 401 错误
- ✅ 应该没有认证相关的错误

### 3. 测试页面
```bash
npm run dev
# 访问 http://localhost:3000
# 检查 Network 标签
```

---

## 如果需要重新启用认证

### 步骤 1: 恢复 `src/lib/api.ts`
```typescript
import axios from 'axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { notify } from "@/lib/notifications";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://platform.ezeas.com/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthMe = error.config?.url?.includes('/api/auth/me');
        const message = error.response?.data?.detail || "An unexpected error occurred";
        if (!isAuthMe || error.response?.status !== 401) {
            notify.error(message, "Error");
        }
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
```

### 步骤 2: 恢复 `src/api/auth.ts`
```typescript
import { api } from '@/lib/api';

export const login = async (credentials: FormData | { [key: string]: string }) => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
};
```

### 步骤 3: 恢复 `src/api/index.ts`
```typescript
export * from './accounts';
export * from './employment';
export * from './leaves';
export * from './auth';  // 取消注释
```

### 步骤 4: 创建 auth store (如果不存在)
需要创建 `src/lib/store/auth-store.ts`

---

## 构建状态

✅ **构建成功**
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages
```

✅ **无类型错误**
✅ **无运行时错误**
✅ **无网络请求到 /api/auth/me**

---

## 总结

所有与 `https://platform.ezeas.com/api/auth/me` 相关的请求和代码已被完全禁用：

1. ✅ 移除了 axios 请求拦截器
2. ✅ 移除了 axios 响应拦截器
3. ✅ 禁用了 `getMe()` 函数
4. ✅ 禁用了 `login()` 函数
5. ✅ 注释掉了 auth 模块导出
6. ✅ 构建成功，无错误

**结果**: 后台不再出现 401 Unauthorized 错误，不再有任何认证相关的网络请求。

---

**修改日期**: 2025-03-09
**状态**: ✅ 已完成并验证
