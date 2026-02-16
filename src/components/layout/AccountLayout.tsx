import { useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { NewHeader } from "@/components/layout/NewHeader"
import { AIAssistantSidebar } from "@/components/layout/AIAssistantSidebar"

export function AccountLayout() {
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen overflow-hidden flex-col w-full">
                <div className="z-50 border-b bg-background flex-none">
                    <NewHeader onAIAssistantToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)} />
                </div>
                <div className="flex flex-1 w-full overflow-hidden relative">
                    {/* Main Sidebar is intentionally omitted for Account pages */}
                    <main
                        className={`flex-1 overflow-auto w-full transition-all duration-300 ease-in-out ${isAIAssistantOpen ? "mr-[400px] sm:mr-[450px]" : ""
                            }`}
                    >
                        <div className="w-full flex flex-col h-full mx-auto">
                            <Outlet />
                        </div>
                    </main>
                    <AIAssistantSidebar
                        open={isAIAssistantOpen}
                        onOpenChange={setIsAIAssistantOpen}
                    />
                </div>
            </div>
        </SidebarProvider>
    )
}
