"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Settings,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/UI/Button"
import { InputField } from "@/components/UI/input"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { notify } from "@/lib/notifications"
import { H1, H2, P, Muted } from "@/components/UI/text/typography"


export function LoginView() {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [rememberMe, setRememberMe] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const username = formData.get("username") as string

        // Demo mode: 直接登录，不验证密码
        setTimeout(() => {
            login("demo-token", rememberMe)
            notify.success(`Welcome back, ${username || "User"}!`, "Login Successful")
            router.push("/dashboard")
            setIsLoading(false)
        }, 500) // 添加一点延迟让用户感觉更真实
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Background decorative blobs */}
            <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <div className="absolute -left-[10%] -top-[10%] h-96 w-96 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
                <div className="absolute -bottom-[10%] -right-[10%] h-96 w-96 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/20" />
            </div>

            <div className="grid min-h-[600px] w-full max-w-[1100px] grid-cols-1 overflow-hidden rounded-xl bg-panel -2xl  md:grid-cols-2 md:rounded-3xl lg:border lg:border-white/50 dark:lg:border-zinc-800">
                {/* Left Side: Image & Brand */}
                <div className="group relative hidden flex-col justify-between overflow-hidden p-12 text-white md:flex">
                    {/* Image Background */}
                    <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105">
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                            alt="Modern Building Background"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/80 to-primary-light/40 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex items-center space-x-3">
                        <div className="hidden rounded-lg border border-white/30 bg-panel/20 p-2 backdrop-blur-sm lg:block">
                            <Settings className="size-6 text-white" />
                        </div>
                        <span className="text-lg font-semibold tracking-wide">
                            Leave Platform
                        </span>
                    </div>

                    <div className="relative z-10">
                        <H2 className="mb-4 text-3xl leading-tight text-white">
                            Manage your world
                            <br />
                            with confidence.
                        </H2>
                        <P className="max-w-xs font-light leading-relaxed text-blue-100">
                            Access your dashboard to control settings, view analytics, and
                            manage team permissions securely.
                        </P>
                    </div>

                    {/* Decorative subtle element */}
                    <div className="pointer-events-none absolute bottom-0 right-0 p-12 opacity-10">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="relative flex w-full flex-col justify-center p-4 sm:p-12 lg:p-16">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-10">
                            <H1 className="text-primary">
                                Welcome Back
                            </H1>
                            <Muted className="mt-2 text-ink-secondary">
                                Please enter your details to sign in.
                            </Muted>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-ink-error">
                                    <AlertCircle className="size-4" />
                                    <P className="text-ink-error">{error}</P>
                                </div>
                            )}
                            {/* Username Input */}
                            <InputField
                                label="Username or Email"
                                icon={User}
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                required
                                className="pl-12"
                            />

                            {/* Password Input */}
                            <div className="relative">
                                <InputField
                                    label="Password"
                                    icon={Lock}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="your password"
                                    required
                                    className="pl-12"
                                />
                                <div className="absolute right-0 top-0">
                                    <Link
                                        href="#"
                                        className="text-xs font-medium text-primary transition-colors hover:text-primary-dark"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:text-gray-200"
                                >
                                    {showPassword ? (
                                        <Eye className="size-5" />
                                    ) : (
                                        <EyeOff className="size-5" />
                                    )}
                                </button>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-ink-primary"
                                >
                                    Remember me for 7 days
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-zinc-800">
                            <Muted className="text-ink-secondary dark:text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="#"
                                    className="font-semibold text-primary transition-colors hover:text-primary-dark"
                                >
                                    Create free account
                                </Link>
                            </Muted>
                        </div>
                    </div>
                </div>
            </div >

            <footer className="pointer-events-none absolute bottom-4 hidden w-full text-center text-xs text-gray-400 dark:text-gray-600 md:block">
                &copy; 2025 Leave Platform Inc. All rights reserved.
            </footer>
        </div >
    )
}
