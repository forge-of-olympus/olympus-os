"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
    Plus,
    Trash2,
    Copy,
    Clock,
    Eye,
    EyeOff,
    RefreshCw,
    Zap,
    ShieldAlert,
    Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Link } from "react-router-dom"
import { AccountSidebar } from "@/components/account-sidebar"

const MOCK_TOKENS = [
    { id: "1", name: "Development Laptop", lastUsed: "2 hours ago", created: "2023-11-20", token: "vs_pk_xxxxxxxxxxxxxx123" },
    { id: "2", name: "Production API", lastUsed: "5 mins ago", created: "2023-10-15", token: "vs_pk_xxxxxxxxxxxxxx456" },
]

export function ApiAccess() {
    const { toast } = useToast()
    const [tokens] = useState(MOCK_TOKENS)
    const [isLoading, setIsLoading] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)

    // Project API state
    const [apiKey, setApiKey] = useState("sk_live_51NXxREDACTED_API_KEY")
    const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook")
    const [webhookEnabled, setWebhookEnabled] = useState(true)

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied",
            description: `${label} copied to clipboard.`,
        })
    }

    const generateNewApiKey = () => {
        setIsLoading(true)
        setTimeout(() => {
            const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15)
            setApiKey(newKey)
            setIsLoading(false)
            toast({
                title: "API key regenerated",
                description: "Your new API key has been generated successfully.",
            })
        }, 1000)
    }

    return (
        <div className="flex h-[calc(100vh-4rem-1px)] w-full">
            <AccountSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
                    <div className="space-y-12 pb-20">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">API Access</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your API keys, webhooks, and personal access tokens.
                            </p>
                        </div>

                        {/* Project API Keys */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold">Project API Keys</h2>
                                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                                    Production
                                </Badge>
                            </div>
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Live API Credentials</CardTitle>
                                    <CardDescription className="text-xs">
                                        Use these keys to authenticate your server-side API requests.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="api-key" className="text-xs text-muted-foreground">Secret Key</Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        id="api-key"
                                                        value={showApiKey ? apiKey : "•".repeat(24)}
                                                        readOnly
                                                        className="bg-muted/20 font-mono pr-10 text-sm h-9"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full w-9 text-muted-foreground hover:text-foreground transition-colors"
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                    >
                                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => copyToClipboard(apiKey, "API Key")}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <Label className="text-xs text-muted-foreground">Public Key</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value="pk_live_51NXxXXXXXXXXXXXXXXXXXXXX"
                                                    readOnly
                                                    className="bg-muted/20 font-mono text-sm h-9"
                                                />
                                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => copyToClipboard("pk_live_51NXxXXXXXXXXXXXXXXXXXXXX", "Public Key")}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-3 p-4 border-t bg-muted/5">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 text-xs font-normal" disabled={isLoading}>
                                                {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                                                {isLoading ? "Regenerating..." : "Regenerate Keys"}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Regenerate API Keys?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will invalidate your current keys. Any applications using them will stop working until updated.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={generateNewApiKey}>Confirm</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        </section>

                        {/* Webhooks */}
                        <section className="space-y-4">
                            <h2 className="text-base font-semibold">Webhooks</h2>
                            <Card className="shadow-none">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">Enable Webhooks</Label>
                                            <p className="text-xs text-muted-foreground">Receive real-time notifications for account events.</p>
                                        </div>
                                        <Switch checked={webhookEnabled} onCheckedChange={setWebhookEnabled} />
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="webhook-url" className="text-xs text-muted-foreground">Endpoint URL</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="webhook-url"
                                                    placeholder="https://your-domain.com/webhook"
                                                    value={webhookUrl}
                                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                                    className="bg-muted/20 text-sm h-9"
                                                    disabled={!webhookEnabled}
                                                />
                                                <Button variant="outline" size="sm" className="h-9" disabled={!webhookEnabled}>Test</Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end p-4 border-t bg-muted/5">
                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-4" disabled={!webhookEnabled}>
                                        Save Webhook
                                    </Button>
                                </CardFooter>
                            </Card>
                        </section>

                        {/* Personal Access Tokens */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold">Personal Access Tokens</h2>
                                    <p className="text-xs text-muted-foreground pt-1">Tokens for CLI and third-party tool authentication.</p>
                                </div>
                                <Button size="sm" className="h-8">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Token
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {tokens.map((token) => (
                                    <Card key={token.id} className="shadow-none group">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                    {token.name}
                                                    <Badge variant="secondary" className="text-[10px] h-4 bg-muted/50 border-none font-normal">Active</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Last used {token.lastUsed}
                                                    </div>
                                                    <span>•</span>
                                                    <span>Created {token.created}</span>
                                                </div>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <code className="text-[11px] bg-muted/40 px-2 py-0.5 rounded font-monoSelection">{token.token}</code>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(token.token, "Token")}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* API Usage & Limits */}
                        <section className="space-y-4">
                            <h2 className="text-base font-semibold">API Usage & Limits</h2>
                            <Card className="shadow-none p-6 space-y-6 text-foreground">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Monthly Request Capacity</span>
                                            <span>1,234 / 10,000</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }} />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Your plan allows up to 10,000 monthly requests.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Zap className="h-4 w-4 text-amber-500" />
                                            Rate Limits
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            100 requests per minute. Need more? <Link to="#" className="text-emerald-500 hover:underline">Contact Support</Link> to increase your limits.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Security Warning */}
                        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-900/30 shadow-none">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-semibold text-amber-800 dark:text-amber-500 flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4" />
                                    Security Notice
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-amber-700 dark:text-amber-400/90 text-xs leading-relaxed">
                                    API keys and access tokens grant full access to your account data.
                                    **Never** commit keys to version control or share them in client-side code. Use environment variables and store them securely.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
