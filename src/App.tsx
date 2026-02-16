import { Routes, Route, Navigate } from "react-router-dom"
import { NewLayout } from "@/components/layout/NewLayout"
import { AccountLayout } from "@/components/layout/AccountLayout"
import { Ops } from "@/pages/Ops"
import { TaskManager } from "@/pages/ops/TaskManager"
import { OrgChart } from "@/pages/ops/OrgChart"
import { Standup } from "@/pages/ops/Standup"
import { Workspace } from "@/pages/ops/Workspace"
import { Docs } from "@/pages/ops/Docs"
import { Brain } from "@/pages/Brain"
import { Lab } from "@/pages/Lab"
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
                            <Route path="/ops/org-chart" element={<OrgChart />} />
                            <Route path="/ops/standup" element={<Standup />} />
                            <Route path="/ops/workspace" element={<Workspace />} />
                            <Route path="/ops/docs" element={<Docs />} />

                            {/* Other Main Pages */}
                            <Route path="/brain" element={<Brain />} />
                            <Route path="/lab" element={<Lab />} />
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
