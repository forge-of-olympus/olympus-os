"use client"

import { NotificationForm } from "@/components/notification-form"
import { AccountSidebar } from "@/components/account-sidebar"

export function Notifications() {
    return (
        <div className="flex h-[calc(100vh-4rem-1px)] w-full">
            <AccountSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
                    <div className="space-y-8 pb-20">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-muted-foreground">
                                Choose what notifications you want to receive and where.
                            </p>
                        </div>
                        <NotificationForm />
                    </div>
                </div>
            </main>
        </div>
    )
}
