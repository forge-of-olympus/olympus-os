import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { aiChatService, type AIAssistantSettings } from "@/lib/services/ai-chat-service"
import { useAuth } from "@/components/auth-provider"

interface AISettingsPanelProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const availableModels = [
    { id: "gpt-5.3-codex", name: "GPT 5.3 Codex" },
    { id: "claude-4.6-sonnet", name: "Claude 4.6 Sonnet" },
    { id: "claude-4.6-opus", name: "Claude 4.6 Opus" },
    { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro" },
    { id: "gemini-3-flash", name: "Gemini 3 Flash" },
    { id: "openrouter-free", name: "Openrouter/free" },
    { id: "perplexity-sonar", name: "Perplexity Sonar" }
]

export function AISettingsPanel({ open, onOpenChange }: AISettingsPanelProps) {
    const { user } = useAuth()
    const [settings, setSettings] = React.useState<AIAssistantSettings | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
        if (open && user?.id) {
            loadSettings()
        }
    }, [open, user?.id])

    const loadSettings = async () => {
        if (!user?.id) return
        const userSettings = await aiChatService.getSettings(user.id)
        setSettings(userSettings)
    }

    const handleSave = async () => {
        if (!user?.id || !settings) return
        setIsLoading(true)
        try {
            await aiChatService.updateSettings(user.id, {
                default_model_id: settings.default_model_id,
                temperature: settings.temperature,
                max_tokens: settings.max_tokens,
                auto_title_generation: settings.auto_title_generation,
                show_token_usage: settings.show_token_usage,
                theme: settings.theme
            })
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to save settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!settings) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>AI Assistant Settings</DialogTitle>
                    <DialogDescription>
                        Customize your AI assistant behavior and preferences
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Default Model */}
                    <div className="space-y-2">
                        <Label htmlFor="model">Default Model</Label>
                        <Select
                            value={settings.default_model_id}
                            onValueChange={(value) => setSettings({ ...settings, default_model_id: value })}
                        >
                            <SelectTrigger id="model">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableModels.map((model) => (
                                    <SelectItem key={model.id} value={model.id}>
                                        {model.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="temperature">Temperature</Label>
                            <span className="text-sm text-muted-foreground">{settings.temperature}</span>
                        </div>
                        <Slider
                            id="temperature"
                            min={0}
                            max={2}
                            step={0.1}
                            value={[settings.temperature]}
                            onValueChange={(value) => setSettings({ ...settings, temperature: value[0] })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Higher values make output more random, lower values more focused
                        </p>
                    </div>

                    {/* Max Tokens */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="tokens">Max Tokens</Label>
                            <span className="text-sm text-muted-foreground">{settings.max_tokens}</span>
                        </div>
                        <Slider
                            id="tokens"
                            min={256}
                            max={4096}
                            step={256}
                            value={[settings.max_tokens]}
                            onValueChange={(value) => setSettings({ ...settings, max_tokens: value[0] })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum length of generated responses
                        </p>
                    </div>

                    {/* Auto Title Generation */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="auto-title">Auto-generate Titles</Label>
                            <p className="text-xs text-muted-foreground">
                                Automatically create chat titles from first message
                            </p>
                        </div>
                        <Switch
                            id="auto-title"
                            checked={settings.auto_title_generation}
                            onCheckedChange={(checked) => setSettings({ ...settings, auto_title_generation: checked })}
                        />
                    </div>

                    {/* Show Token Usage */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-tokens">Show Token Usage</Label>
                            <p className="text-xs text-muted-foreground">
                                Display token count and response time for messages
                            </p>
                        </div>
                        <Switch
                            id="show-tokens"
                            checked={settings.show_token_usage}
                            onCheckedChange={(checked) => setSettings({ ...settings, show_token_usage: checked })}
                        />
                    </div>

                    {/* Theme */}
                    <div className="space-y-2">
                        <Label htmlFor="theme">Chat Display Theme</Label>
                        <Select
                            value={settings.theme}
                            onValueChange={(value: 'auto' | 'compact' | 'detailed') => setSettings({ ...settings, theme: value })}
                        >
                            <SelectTrigger id="theme">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">Auto</SelectItem>
                                <SelectItem value="compact">Compact</SelectItem>
                                <SelectItem value="detailed">Detailed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
