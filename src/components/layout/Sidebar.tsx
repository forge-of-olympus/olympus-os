import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Calendar, Upload, Settings, Share2, MessageSquareText, Inbox, Bot, Drama } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

interface NavigationItem {
    name: string
    href: string
    icon: LucideIcon
}

const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Content Calendar", href: "/content-calendar", icon: Calendar },
    { name: "Connect Socials", href: "/connect-socials", icon: Share2 },
    { name: "Upload & Schedule Posts", href: "/upload-schedule-posts", icon: Upload },
    { name: "Social Messages", href: "/social-messages", icon: Inbox },
    { name: "Social Comments", href: "/social-comments", icon: MessageSquareText },
    { name: "Active AI Agents", href: "/active-ai-agents", icon: Bot },
    { name: "Operating Agents", href: "/operating-agents", icon: Drama },
    { name: "Custom Tools", href: "/custom-tools", icon: Settings },
]

export function Sidebar() {
    const location = useLocation()

    return (
        <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
                <div className="flex items-center gap-2 font-bold text-xl">
                    {/* V-Prism Logo Placeholder */}
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2L2 28H30L16 2Z" fill="url(#prism-gradient)" style={{ opacity: 0.1 }} />
                        <path d="M16 8L8 24H24L16 8Z" fill="url(#prism-gradient)" />
                        <rect x="14" y="24" width="4" height="4" fill="#FBBF24" />
                        <defs>
                            <linearGradient id="prism-gradient" x1="2" y1="2" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4F46E5" />
                                <stop offset="1" stopColor="#0891B2" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Vistro
                    </span>
                </div>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                                )}
                            />
                            <span className={cn(isActive && "font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent")}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Jane Doe</p>
                        <p className="text-xs text-gray-500">Creator Account</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
