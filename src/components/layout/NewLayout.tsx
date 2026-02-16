import { useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { NewSidebar } from "@/components/layout/NewSidebar"
import { NewHeader } from "@/components/layout/NewHeader"
import { AIAssistantSidebar } from "@/components/layout/AIAssistantSidebar"

export function NewLayout() {
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen overflow-hidden flex-col w-full">
                <div className="z-50 border-b bg-background flex-none">
                    <NewHeader onAIAssistantToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)} />
                </div>
                <div className="flex flex-1 w-full overflow-hidden relative">
                    <NewSidebar className="top-[calc(4rem+1px)] h-[calc(100vh-4rem-1px)]" />
                    <main
                        className={`flex-1 overflow-auto w-full transition-all duration-300 ease-in-out ${isAIAssistantOpen ? "mr-[400px] sm:mr-[450px]" : ""
                            }`}
                    >
                        <div className="w-full flex flex-col min-h-[calc(100vh-4rem-1px)] max-w-[1600px] mx-auto p-6">
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
