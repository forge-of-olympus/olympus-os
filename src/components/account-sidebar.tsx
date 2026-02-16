"use client"

import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { User, Key, Shield, Bell, Globe, ArrowLeft } from "lucide-react"

const items = [
    {
        title: "Preferences",
        href: "/account",
        icon: User,
    },
    {
        title: "API Access",
        href: "/account/api-access",
        icon: Key,
    },
    {
        title: "Security",
        href: "/account/security",
        icon: Shield,
    },
    {
        title: "Notifications",
        href: "/account/notifications",
        icon: Bell,
    },
]

export function AccountSidebar() {
    const location = useLocation()
    const pathname = location.pathname

    return (
        <div className="w-64 border-r bg-muted/10 h-full hidden md:block">
            <div className="p-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </Link>
                <h2 className="text-lg font-semibold tracking-tight mb-4">Account</h2>
                <nav className="space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            to={item.icon === Globe ? "https://google.com" : item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}
