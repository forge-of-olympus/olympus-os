"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, Smartphone, Globe, Lock, History } from "lucide-react"
import { AccountSidebar } from "@/components/account-sidebar"

export function Security() {
    return (
        <div className="flex h-[calc(100vh-4rem-1px)] w-full">
            <AccountSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
                    <div className="space-y-12 pb-20">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your account security and authentication methods.
                            </p>
                        </div>

                        {/* Two-Factor Authentication */}
                        <section className="space-y-4">
                            <h2 className="text-base font-semibold text-foreground">Two-Factor Authentication</h2>
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Authentication Method</CardTitle>
                                    <CardDescription className="text-xs">
                                        Manage how you verify your identity when signing in.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Alert className="bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/10">
                                        <Check className="h-4 w-4" />
                                        <AlertTitle className="text-sm font-semibold">Two-factor authentication is enabled</AlertTitle>
                                        <AlertDescription className="text-xs opacity-90">
                                            Your account is currently protected with a combination of authenticator app and recovery codes.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-background border rounded p-2">
                                                    <Smartphone className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Authenticator App</p>
                                                    <p className="text-[12px] text-muted-foreground">Google Authenticator or Authy</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Verified</Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-background border rounded p-2">
                                                    <Lock className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Recovery Codes</p>
                                                    <p className="text-[12px] text-muted-foreground">Use these if you lose access to your authenticator app</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-8 text-xs">View codes</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button variant="outline" size="sm" className="h-8 text-xs font-normal">Manage 2FA</Button>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-normal text-destructive hover:text-destructive hover:bg-destructive/5">Disable</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Active Sessions */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold text-foreground">Login Sessions</h2>
                                <p className="text-sm text-muted-foreground">This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.</p>
                            </div>
                            <Card className="shadow-none overflow-hidden">
                                <div className="divide-y">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <Globe className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium flex items-center">Chrome on Windows <Badge className="ml-2 text-[10px] h-4 bg-emerald-500/10 text-emerald-600 border-none shadow-none">Current Session</Badge></div>
                                                <p className="text-[12px] text-muted-foreground">New York, USA • 192.168.1.1</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">iPhone 15 Pro</p>
                                                <p className="text-[12px] text-muted-foreground">New York, USA • Mobile App</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-normal text-muted-foreground">Log out</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/5">
                                        <div className="flex items-center gap-4">
                                            <History className="h-5 w-5 text-muted-foreground opacity-50" />
                                            <div className="opacity-70">
                                                <p className="text-sm font-medium">Firefox on macOS</p>
                                                <p className="text-[12px] text-muted-foreground">San Francisco, USA • 3 days ago</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-normal text-muted-foreground">Log out</Button>
                                    </div>
                                </div>
                                <div className="p-4 border-t bg-muted/10 flex justify-end">
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-normal">Sign out all other devices</Button>
                                </div>
                            </Card>
                        </section>

                        {/* Security Log */}
                        <section className="space-y-4">
                            <h2 className="text-base font-semibold text-foreground">Security Log</h2>
                            <Card className="shadow-none p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-8 pb-4 border-b">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Login detected from new IP</p>
                                            <p className="text-xs text-muted-foreground">192.168.1.100 • 2 hours ago</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-medium uppercase tracking-tighter">Details</Button>
                                    </div>
                                    <div className="flex items-start justify-between gap-8 pb-4 border-b">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Recovery codes viewed</p>
                                            <p className="text-xs text-muted-foreground">via Dashboard • Yesterday at 4:32 PM</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-medium uppercase tracking-tighter">Details</Button>
                                    </div>
                                    <div className="flex items-start justify-between gap-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">2FA enabled</p>
                                            <p className="text-xs text-muted-foreground">via TOTP App • Nov 20, 2023</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-medium uppercase tracking-tighter">Details</Button>
                                    </div>
                                </div>
                            </Card>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
