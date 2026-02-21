import { Routes, Route, Navigate } from "react-router-dom"
import { NewLayout } from "@/components/layout/NewLayout"
import { AccountLayout } from "@/components/layout/AccountLayout"
import { Ops } from "@/pages/Ops"
import { TaskManager } from "@/pages/ops/TaskManager"
import { Company } from "@/pages/ops/Company"
import Standup from "@/pages/ops/Standup"
import { Workspace } from "@/pages/ops/Workspace"
import { Docs } from "@/pages/ops/Docs"
import { KratosHub } from "@/pages/brain/KratosHub"
import { Memory } from "@/pages/brain/Memory"
import { CommandCenter } from "@/pages/brain/Command"
import { Conversations } from "@/pages/brain/Conversations"
import { Workbench } from "@/pages/lab/Workbench"
import { Pipeline } from "@/pages/lab/Pipeline"
import { Models } from "@/pages/lab/Models"
import { Account } from "@/pages/Account"
import { ApiAccess } from "@/pages/account/ApiAccess"
import { Security } from "@/pages/account/Security"
import { Notifications } from "@/pages/account/Notifications"
import { VistroAI } from "@/pages/VistroAI"

import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

import { ThemeProvider } from "@/components/theme-provider"
import { AIContextProvider } from "@/contexts/AIContext"

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <AIContextProvider>
                    <Routes>
                        {/* Redirect /login to / */}
                        <Route path="/login" element={<Navigate to="/" replace />} />

                        {/* VistroAI - Full page chat */}
                        <Route path="/vistro-ai" element={<VistroAI />} />

                        <Route element={<NewLayout />}>
                            {/* Root redirects to /ops */}
                            <Route path="/" element={<Navigate to="/ops" replace />} />

                            {/* Ops Defaults to Task Manager */}
                            <Route path="/ops" element={<Navigate to="/ops/task-manager" replace />} />

                            {/* Ops Sub-pages */}
                            <Route path="/ops/dashboard" element={<Ops />} />
                            <Route path="/ops/task-manager" element={<TaskManager />} />
                            <Route path="/ops/company" element={<Company />} />
                            <Route path="/ops/standup" element={<Standup />} />
                            <Route path="/ops/workspace" element={<Workspace />} />
                            <Route path="/ops/docs" element={<Docs />} />

                            {/* Other Main Pages */}
                            <Route path="/brain" element={<Navigate to="/brain/kratos" replace />} />
                            <Route path="/brain/kratos" element={<KratosHub />} />
                            <Route path="/brain/memory" element={<Memory />} />
                            <Route path="/brain/command" element={<CommandCenter />} />
                            <Route path="/brain/conversations" element={<Conversations />} />

                            <Route path="/lab" element={<Navigate to="/lab/workbench" replace />} />
                            <Route path="/lab/workbench" element={<Workbench />} />
                            <Route path="/lab/pipeline" element={<Pipeline />} />
                            <Route path="/lab/models" element={<Models />} />
                        </Route>

                        <Route element={<AccountLayout />}>
                            <Route path="/account" element={<Account />} />
                            <Route path="/account/api-access" element={<ApiAccess />} />
                            <Route path="/account/security" element={<Security />} />
                            <Route path="/account/notifications" element={<Notifications />} />
                        </Route>
                    </Routes>
                    <Toaster />
                </AIContextProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
