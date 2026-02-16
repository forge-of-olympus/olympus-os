import { Sparkles, PanelRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface NewHeaderProps {
    onAIAssistantToggle?: () => void
}

export function NewHeader({ onAIAssistantToggle }: NewHeaderProps) {
    const location = useLocation()

    const opsNavItems = [
        { title: "Task Manager", href: "/ops/task-manager" },
        { title: "Org Chart", href: "/ops/org-chart" },
        { title: "Standup", href: "/ops/standup" },
        { title: "Workspace", href: "/ops/workspace" },
        { title: "Docs", href: "/ops/docs" },
    ]

    const isOpsPage = location.pathname.startsWith("/ops")

    return (
        <header className="w-full bg-background z-50 sticky top-0">
            <div className="flex h-16 items-center px-4">
                {/* Left side - Logo & Sidebar Trigger */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="mr-2 md:hidden" />

                        <Link to="/" className="flex items-center gap-2">
                            <img src="/Icons/water-wave.png" alt="River-OS" className="h-8 w-auto" />
                            <span className="font-semibold text-lg">River-OS</span>
                        </Link>
                    </div>

                    {/* Ops Navigation */}
                    {isOpsPage && (
                        <nav className="hidden md:flex items-center gap-1 ml-4 border-l pl-4 h-8">
                            {opsNavItems.map((item) => (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-8",
                                        location.pathname === item.href
                                            ? "text-foreground bg-accent"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                    asChild
                                >
                                    <Link to={item.href}>
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right side items */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground rounded-full border"
                        asChild
                    >
                        <Link to="/vistro-ai">
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground rounded-full border"
                        onClick={onAIAssistantToggle}
                    >
                        <PanelRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
