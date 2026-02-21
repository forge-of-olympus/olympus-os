import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    PanelLeft,
    Sun,
    Moon,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

interface NewSidebarProps {
    className?: string
}

export function NewSidebar({ className }: NewSidebarProps) {
    const { theme, setTheme } = useTheme()
    const location = useLocation()
    const [sidebarBehavior, setSidebarBehavior] = useState("expand")

    const routes: { title: string; href: string; icon: string | React.ElementType; isImage?: boolean }[] = [
        { title: "Ops", href: "/ops", icon: "/Icons/rocket.png", isImage: true },
        { title: "Brain", href: "/brain", icon: "/Icons/brain.png", isImage: true },
        { title: "Lab", href: "/lab", icon: "/Icons/test-tube.png", isImage: true },
    ]

    return (
        <Sidebar
            collapsible={sidebarBehavior === "open" ? "none" : "icon"}
            className={cn(
                "pt-0 mt-0 z-40 border-r transition-all duration-300",
                sidebarBehavior === "expand" && "group-data-[collapsible=icon]:hover:!w-[--sidebar-width]",
                className
            )}
        >
            <SidebarContent className="flex flex-col group-data-[collapsible=icon]:items-start pt-4">
                <SidebarMenu className="gap-2 w-full">
                    {routes.map((route) => (
                        <SidebarMenuItem key={route.href} className="w-full">
                            <SidebarMenuButton
                                asChild
                                isActive={location.pathname.startsWith(route.href)}
                                className={cn(
                                    "transition-all duration-300 w-full justify-start pl-[14px]",
                                    "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[14px]",
                                    sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[14px] group-data-[collapsible=icon]:group-hover:!mx-0"
                                )}
                            >
                                <Link to={route.href} className="flex items-center gap-3">
                                    {route.isImage ? (
                                        <img
                                            src={route.icon as string}
                                            alt={route.title}
                                            className="h-5 w-5 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <route.icon className="h-5 w-5 shrink-0" />
                                    )}
                                    <span className={cn(
                                        "transition-opacity duration-300 whitespace-nowrap group-data-[collapsible=icon]:hidden",
                                        sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:inline-block"
                                    )}>
                                        {route.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="px-0 pt-2 pb-4 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!pb-4 group-data-[collapsible=icon]:!pt-2">
                <div className={cn(
                    "flex items-center justify-between w-full group-data-[collapsible=icon]:px-0",
                    sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:justify-between"
                )}>
                    <SidebarMenu className="w-auto">
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        className={cn(
                                            "transition-all duration-300 w-auto justify-start hover:bg-transparent pl-[6px] py-0 pr-0",
                                            "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[6px]"
                                        )}
                                    >
                                        <div className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                                            <PanelLeft className="h-5 w-5 shrink-0" />
                                        </div>
                                        <span className="sr-only">Sidebar Behavior</span>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" align="start" className="w-[--sidebar-width]">
                                    <DropdownMenuLabel>Sidebar Behavior</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={sidebarBehavior} onValueChange={setSidebarBehavior}>
                                        <DropdownMenuRadioItem value="expand">Expand on hover</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="open">Expanded</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="closed">Collapsed</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={cn(
                            "flex items-center justify-start pr-[6px] group-data-[collapsible=icon]:hidden",
                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:flex"
                        )}
                        title="Toggle Theme"
                    >
                        <div className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 shrink-0" />
                            ) : (
                                <Moon className="h-5 w-5 shrink-0" />
                            )}
                        </div>
                    </button>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
