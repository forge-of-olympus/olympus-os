
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Github, ExternalLink, Sun, Monitor, AlertCircle, Upload, Loader2, LibraryBig } from "lucide-react"
import { useTheme, type Theme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ImagePicker } from "@/components/image-picker"
import { useToast } from "@/components/ui/use-toast"
import { AccountSidebar } from "@/components/account-sidebar"

export function Account() {
    const { user, updateUser } = useAuth()
    const { theme, setTheme } = useTheme()
    const { toast } = useToast()
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [firstName, setFirstName] = useState(user?.firstName || "")
    const [lastName, setLastName] = useState(user?.lastName || "")
    const [name, setName] = useState(() => {
        const generated = `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
        return user?.name === generated ? "" : (user?.name || "")
    })
    const [email, setEmail] = useState(user?.email || "")
    const [company, setCompany] = useState(user?.company || "")

    // Generate the default username for placeholder and fallback
    const generatedName = `${firstName} ${lastName}`.trim()

    // API Keys State
    const [geminiKey, setGeminiKey] = useState("")
    const [openaiKey, setOpenaiKey] = useState("")
    const [anthropicKey, setAnthropicKey] = useState("")

    useEffect(() => {
        const keys = localStorage.getItem("vistro_api_keys")
        if (keys) {
            try {
                const parsed = JSON.parse(keys)
                setGeminiKey(parsed.gemini || "")
                setOpenaiKey(parsed.openai || "")
                setAnthropicKey(parsed.anthropic || "")
            } catch (e) {
                console.error("Failed to parse API keys", e)
            }
        }
    }, [])

    const handleSaveApiKeys = () => {
        const keys = {
            gemini: geminiKey,
            openai: openaiKey,
            anthropic: anthropicKey
        }
        localStorage.setItem("vistro_api_keys", JSON.stringify(keys))
        toast({
            title: "API Keys Saved",
            description: "Your AI model keys have been securely stored locally.",
        })
    }

    // Sync state with user data when it loads or changes
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
            setEmail(user.email || "")
            setCompany(user.company || "")
            // Sync name if it's not set locally yet, or if we want to respect the upstream data.
            // But we must be careful not to overwrite user input if they are typing.
            // Since this is primarily for "reload", checks against emptiness or default might be wise.
            // However, sticking to the simple sync for reload:
            setName((prev) => {
                const generated = `${user.firstName || ""} ${user.lastName || ""}`.trim()
                // If it was already generated (empty map to default), or prev is empty, update it.
                // Otherwise keep local intent.
                if (prev === "" || prev === generated) {
                    return user.name === generated ? "" : (user.name || "")
                }
                return prev
            })
            setAvatarPreview(user.avatar || null)
        }
    }, [user])

    // Auto-save effect
    useEffect(() => {
        // Skip initial mount to avoid unnecessary double-save or overwrite with empty values
        if (!user) return

        const timer = setTimeout(async () => {
            try {
                // Use the name state if present, otherwise fall back to generated name
                const resolvedName = name.trim() || generatedName

                await updateUser({
                    name: resolvedName,
                    firstName,
                    lastName,
                    email,
                    company,
                })

                // Optional: We could show a subtle "Saved" indicator here, 
                // but for now we'll keep it silent as requested ("auto save") 
                // to avoid toast spamming.
            } catch (error) {
                console.error("Auto-save failed:", error)
                toast({
                    title: "Auto-save failed",
                    description: "Failed to save profile information.",
                    variant: "destructive"
                })
            }
        }, 1000) // 1 second debounce

        return () => clearTimeout(timer)
    }, [name, firstName, lastName, email, company, generatedName, user, updateUser, toast])

    if (!user) return null

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploadingAvatar(true)
        try {
            // Mock upload
            await new Promise(resolve => setTimeout(resolve, 1000))
            const mockUrl = URL.createObjectURL(file)

            await updateUser({ avatar: mockUrl })
            setAvatarPreview(mockUrl)

            toast({
                title: "Avatar updated",
                description: "Your profile picture has been updated.",
            })
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Failed to upload avatar.",
                variant: "destructive",
            })
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const handleLibrarySelect = async (url: string) => {
        try {
            await updateUser({ avatar: url })
            setAvatarPreview(url)
            toast({
                title: "Avatar updated",
                description: "Profile picture updated from library.",
            })
        } catch (error) {
            toast({
                title: "Update failed",
                description: "Failed to update avatar.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex h-[calc(100vh-4rem-1px)] w-full">
            <AccountSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
                    <div className="space-y-12 pb-20">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your account profile, connections, and dashboard experience.
                            </p>
                        </div>

                        {/* Profile Information */}
                        <section className="space-y-4">
                            <h2 className="text-base font-semibold">Profile information</h2>
                            <Card className="shadow-none">
                                <CardContent className="p-0 border-none">
                                    <div className="divide-y border-t lg:border-t-0">
                                        {/* Avatar Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 py-6 px-6 gap-4">
                                            <Label className="text-sm font-medium pt-2">Profile picture</Label>
                                            <div className="md:col-span-2 flex items-center gap-6">
                                                <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                                    <AvatarImage src={avatarPreview || user.avatar} />
                                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex gap-2">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleAvatarChange}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs font-normal"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isUploadingAvatar}
                                                    >
                                                        {isUploadingAvatar ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Upload className="h-3 w-3 mr-2" />}
                                                        Change avatar
                                                    </Button>
                                                    <ImagePicker
                                                        onSelect={handleLibrarySelect}
                                                        trigger={
                                                            <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
                                                                <LibraryBig className="h-3 w-3 mr-2" />
                                                                From library
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <Label className="text-sm font-medium">First name</Label>
                                            <div className="md:col-span-2">
                                                <Input
                                                    placeholder="First name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="max-w-md bg-muted/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <Label className="text-sm font-medium">Last name</Label>
                                            <div className="md:col-span-2">
                                                <Input
                                                    placeholder="Last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="max-w-md bg-muted/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-medium">Primary email</Label>
                                                <p className="text-[12px] text-muted-foreground leading-tight">Primary email is used for account notifications.</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <Select value={email} onValueChange={setEmail}>
                                                    <SelectTrigger className="max-w-md bg-muted/20">
                                                        <SelectValue placeholder="Select email" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={email || "no-email"}>{email || "No email linked"}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-medium">Username</Label>
                                                <p className="text-[12px] text-muted-foreground leading-tight">Username appears as a display name throughout the dashboard.</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <Input
                                                    placeholder={generatedName || "Username"}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="max-w-md bg-muted/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Account Identities */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Account identities</h2>
                                <p className="text-sm text-muted-foreground">Manage the providers linked to your Supabase account and update their details.</p>
                            </div>
                            <Card className="shadow-none">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-background border rounded p-1.5">
                                            <Github className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">GitHub</p>
                                            <p className="text-xs text-muted-foreground">{user.name} • {user.email}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ExternalLink className="h-4 w-4" /></Button>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Connections */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Connections</h2>
                                <p className="text-sm text-muted-foreground">Connect your Supabase account with other services.</p>
                            </div>
                            <Card className="shadow-none">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-background border rounded p-1.5">
                                            <Github className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">GitHub</p>
                                            <p className="text-xs text-muted-foreground">Sync repos to Supabase projects for automatic branch creation and merging</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-4 font-normal text-xs">Connect</Button>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Appearance */}
                        <section id="sidebar-control" className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Appearance</h2>
                                <p className="text-sm text-muted-foreground">Choose how Supabase looks and behaves in the dashboard.</p>
                            </div>
                            <Card className="shadow-none p-6 space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Theme mode</Label>
                                    <p className="text-sm text-muted-foreground">Choose how Supabase looks to you. Select a single theme, or sync with your system.</p>

                                    <RadioGroup defaultValue={theme} onValueChange={(v: Theme) => setTheme(v)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dark" className="cursor-pointer block">
                                                <div className={cn(
                                                    "rounded-lg border-2 p-1 bg-zinc-950 overflow-hidden",
                                                    theme === "dark" ? "border-emerald-500" : "border-muted"
                                                )}>
                                                    <div className="bg-zinc-900 rounded-md p-3 space-y-2 border border-white/5">
                                                        <div className="h-1.5 w-1/2 bg-zinc-700 rounded-full" />
                                                        <div className="h-1.5 w-3/4 bg-zinc-800 rounded-full" />
                                                        <div className="h-6 w-full bg-zinc-800/50 rounded flex items-center px-1 gap-1">
                                                            <div className="h-3 w-3 bg-zinc-700 rounded" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Label>
                                            <div className="flex items-center space-x-2 px-1">
                                                <RadioGroupItem value="dark" id="dark" />
                                                <Label htmlFor="dark" className="text-xs">Dark</Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="light" className="cursor-pointer block">
                                                <div className={cn(
                                                    "rounded-lg border-2 p-1 bg-zinc-100 overflow-hidden",
                                                    theme === "light" ? "border-emerald-500" : "border-muted"
                                                )}>
                                                    <div className="bg-white rounded-md p-3 space-y-2 border border-zinc-200">
                                                        <div className="h-1.5 w-1/2 bg-zinc-200 rounded-full" />
                                                        <div className="h-1.5 w-3/4 bg-zinc-100 rounded-full" />
                                                        <div className="h-6 w-full bg-zinc-100/50 rounded flex items-center px-1 gap-1">
                                                            <div className="h-3 w-3 bg-zinc-200 rounded" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Label>
                                            <div className="flex items-center space-x-2 px-1">
                                                <RadioGroupItem value="light" id="light" />
                                                <Label htmlFor="light" className="text-xs">Light</Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2 opacity-50 select-none">
                                            <div className="rounded-lg border-2 border-muted p-1 bg-black overflow-hidden relative">
                                                <div className="bg-zinc-900 rounded-md p-3 space-y-2 border border-white/5 grayscale">
                                                    <div className="h-1.5 w-1/2 bg-zinc-700 rounded-full" />
                                                    <div className="h-1.5 w-3/4 bg-zinc-800 rounded-full" />
                                                    <div className="h-6 w-full bg-zinc-800/50 rounded flex items-center px-1 gap-1">
                                                        <div className="h-3 w-3 bg-zinc-700 rounded" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 px-1">
                                                <RadioGroupItem value="classic-dark" id="classic-dark" disabled />
                                                <Label htmlFor="classic-dark" className="text-xs">Classic Dark</Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="system" className="cursor-pointer block">
                                                <div className={cn(
                                                    "rounded-lg border-2 p-1 bg-zinc-950 overflow-hidden relative",
                                                    theme === "system" ? "border-emerald-500" : "border-muted"
                                                )}>
                                                    {/* Split simulation */}
                                                    <div className="absolute inset-0 flex">
                                                        <div className="w-1/2 bg-zinc-950" />
                                                        <div className="w-1/2 bg-zinc-200" />
                                                    </div>
                                                    <div className="relative bg-zinc-900/40 backdrop-blur rounded-md p-3 space-y-2 border border-white/10 overflow-hidden">
                                                        <div className="h-1.5 w-1/2 bg-zinc-500/50 rounded-full" />
                                                        <div className="h-1.5 w-3/4 bg-zinc-500/30 rounded-full" />
                                                        <div className="h-6 w-full bg-zinc-500/20 rounded flex items-center px-1 gap-1">
                                                            <div className="h-3 w-3 bg-zinc-500/50 rounded" />
                                                        </div>
                                                        <div className="absolute top-0 right-0 p-1">
                                                            <Sun className="h-3 w-3 opacity-50" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Label>
                                            <div className="flex items-center space-x-2 px-1">
                                                <RadioGroupItem value="system" id="system" />
                                                <Label htmlFor="system" className="text-xs font-semibold flex items-center gap-1"><Monitor className="h-3 w-3" /> System</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3 pt-6 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">Sidebar behavior</Label>
                                            <p className="text-xs text-muted-foreground">Choose your preferred sidebar behavior: open, closed, or expand on hover.</p>
                                        </div>
                                        <div>
                                            <Select defaultValue="expand">
                                                <SelectTrigger className="max-w-md bg-muted/20 h-10">
                                                    <SelectValue placeholder="Select behavior" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="open">Fixed open</SelectItem>
                                                    <SelectItem value="closed">Fixed closed</SelectItem>
                                                    <SelectItem value="expand">Expand on hover</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Regional Settings */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Regional Settings</h2>
                                <p className="text-sm text-muted-foreground">Manage your language, timezone, and date display preferences.</p>
                            </div>
                            <Card className="shadow-none">
                                <CardContent className="p-0 border-none">
                                    <div className="divide-y border-t lg:border-t-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <Label className="text-sm font-medium">Language</Label>
                                            <div className="md:col-span-2">
                                                <Select defaultValue="en">
                                                    <SelectTrigger className="max-w-md bg-muted/20">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="en">English (US)</SelectItem>
                                                        <SelectItem value="en-gb">English (UK)</SelectItem>
                                                        <SelectItem value="fr">French</SelectItem>
                                                        <SelectItem value="de">German</SelectItem>
                                                        <SelectItem value="es">Spanish</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <Label className="text-sm font-medium">Timezone</Label>
                                            <div className="md:col-span-2">
                                                <Select defaultValue="utc">
                                                    <SelectTrigger className="max-w-md bg-muted/20">
                                                        <SelectValue placeholder="Select timezone" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                                                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                                                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                                                        <SelectItem value="cet">CET (Central European Time)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 px-6 gap-4">
                                            <Label className="text-sm font-medium">Date format</Label>
                                            <div className="md:col-span-2">
                                                <Select defaultValue="mdy">
                                                    <SelectTrigger className="max-w-md bg-muted/20">
                                                        <SelectValue placeholder="Select date format" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                                                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                                                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end p-4 border-t bg-muted/5">
                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-4">Save</Button>
                                </CardFooter>
                            </Card>
                        </section>

                        {/* Keyboard Shortcuts */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Keyboard shortcuts</h2>
                                <p className="text-sm text-muted-foreground">Choose which shortcuts stay active while working in the dashboard.</p>
                            </div>
                            <Card className="shadow-none overflow-hidden">
                                <div className="divide-y">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-muted border rounded text-[10px] font-mono">Ctrl</kbd>
                                            <kbd className="px-2 py-1 bg-muted border rounded text-[10px] font-mono">k</kbd>
                                            <span className="text-sm font-medium">Command menu</span>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-muted border rounded text-[10px] font-mono">Ctrl</kbd>
                                            <kbd className="px-2 py-1 bg-muted border rounded text-[10px] font-mono">l</kbd>
                                            <span className="text-sm font-medium">AI Assistant Panel</span>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-muted border rounded text-[10px] font-mono">Ctrl</kbd>
                                            <kbd className="px-2 py-1 bg-muted border rounded text-[10px] font-mono">e</kbd>
                                            <span className="text-sm font-medium">Inline SQL Editor Panel</span>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Dashboard */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Dashboard</h2>
                                <p className="text-sm text-muted-foreground">Choose your preferred experience when editing policies, triggers, and functions.</p>
                            </div>
                            <Card className="shadow-none p-6">
                                <div className="flex items-start justify-between gap-8">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Edit entities in SQL</p>
                                        <p className="text-xs text-muted-foreground max-w-xl">
                                            When enabled, view and edit policies, triggers, and functions directly in the SQL editor instead of a more beginner-friendly UI panel. Ideal for those comfortable with SQL.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </Card>
                        </section>

                        {/* Analytics and Marketing */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">Analytics and Marketing</h2>
                                <p className="text-sm text-muted-foreground">Control whether telemetry and marketing data is sent from Supabase services.</p>
                            </div>
                            <Card className="shadow-none p-6 text-foreground">
                                <div className="flex items-start justify-between gap-8">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Send telemetry data from Supabase services</p>
                                        <p className="text-xs text-muted-foreground max-w-xl">
                                            By opting in to sharing telemetry data, Supabase can analyze usage patterns to enhance user experience and use it for marketing and advertising purposes.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </Card>
                        </section>

                        {/* API Access */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">API Access</h2>
                                <p className="text-sm text-muted-foreground">Manage your API keys for AI models.</p>
                            </div>
                            <Card className="shadow-none">
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="gemini-key"
                                                    type="password"
                                                    placeholder="AIzaSy..."
                                                    value={geminiKey}
                                                    onChange={(e) => setGeminiKey(e.target.value)}
                                                    className="bg-muted/20 font-mono"
                                                />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">Required for Gemini 3 Pro & Flash models.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="openai-key">OpenAI API Key</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="openai-key"
                                                    type="password"
                                                    placeholder="sk-..."
                                                    value={openaiKey}
                                                    onChange={(e) => setOpenaiKey(e.target.value)}
                                                    className="bg-muted/20 font-mono"
                                                />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">Required for GPT-5.2 & GPT-4 models.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="anthropic-key"
                                                    type="password"
                                                    placeholder="sk-ant-..."
                                                    value={anthropicKey}
                                                    onChange={(e) => setAnthropicKey(e.target.value)}
                                                    className="bg-muted/20 font-mono"
                                                />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">Required for Claude 4.5 Sonnet.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            size="sm"
                                            onClick={handleSaveApiKeys}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                        >
                                            Save Keys
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Danger Zone */}
                        <section className="space-y-4">
                            <h2 className="text-base font-semibold">Danger zone</h2>
                            <p className="text-sm text-muted-foreground">Permanently delete your Supabase account and data.</p>
                            <Card className="shadow-none border-destructive/20 dark:border-destructive/40">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-destructive/10 p-1 rounded text-destructive mt-0.5">
                                            <AlertCircle className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-destructive">Request for account deletion</p>
                                            <p className="text-xs text-muted-foreground max-w-2xl">
                                                Deleting your account is permanent and cannot be undone. Your data will be deleted within 30 days, but we may retain some metadata and logs for longer where required or permitted by law.
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="bg-transparent border-destructive/20 text-destructive hover:bg-destructive/10 text-xs py-1 h-8">Request to delete account</Button>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
