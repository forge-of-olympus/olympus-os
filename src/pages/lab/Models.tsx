import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Cpu, Zap, Activity, MemoryStick, ShieldAlert } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import { Slider } from "@/components/ui/slider"
import { useAI } from "@/contexts/AIContext"

export function Models() {
    const { connectedModels, modelConfigs, updateModelConnection } = useAI()
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    // Form states for modal
    const [apiKey, setApiKey] = useState("")
    const [temperature, setTemperature] = useState(0.7)
    const [maxTokens, setMaxTokens] = useState(2000)
    const [isAgentic, setIsAgentic] = useState(false)

    const aiModels = [
        {
            id: 'gpt-5.3-codex',
            name: 'GPT 5.3 Codex',
            provider: 'OpenAI',
            type: 'Advanced Coding',
            context: '128k',
            speed: 'Ultra-Fast',
            color: 'bg-green-500',
            textColor: 'text-green-500'
        },
        {
            id: 'claude-4.6-sonnet',
            name: 'Claude 4.6 Sonnet',
            provider: 'Anthropic',
            type: 'Speed & Reasoning',
            context: '200k',
            speed: 'Ultra-Fast',
            color: 'bg-orange-500',
            textColor: 'text-orange-500'
        },
        {
            id: 'claude-4.6-opus',
            name: 'Claude 4.6 Opus',
            provider: 'Anthropic',
            type: 'Maximum Intelligence',
            context: '200k',
            speed: 'Medium',
            color: 'bg-orange-600',
            textColor: 'text-orange-600'
        },
        {
            id: 'gemini-3.1-pro',
            name: 'Gemini 3.1 Pro',
            provider: 'Google',
            type: 'Multimodal Research',
            context: '2M',
            speed: 'Medium',
            color: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            id: 'gemini-3-flash',
            name: 'Gemini 3 Flash',
            provider: 'Google',
            type: 'High-Speed Task',
            context: '1M',
            speed: 'Ultra-Fast',
            color: 'bg-blue-400',
            textColor: 'text-blue-400'
        },
        {
            id: 'nano-banana-pro',
            name: 'Nano Banana Pro',
            provider: 'Banana',
            type: 'Image Generation',
            context: 'N/A',
            speed: 'Fast',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-500'
        },
        {
            id: 'veo-3.1',
            name: 'Veo 3.1',
            provider: 'Google',
            type: 'Video Generation',
            context: 'N/A',
            speed: 'Medium',
            color: 'bg-purple-500',
            textColor: 'text-purple-500'
        },
        {
            id: 'openrouter-free',
            name: 'Openrouter/free',
            provider: 'OpenRouter',
            type: 'Cost-Effective AI',
            context: '8k',
            speed: 'Fast',
            color: 'bg-indigo-500',
            textColor: 'text-indigo-500'
        },
        {
            id: 'perplexity-sonar',
            name: 'Perplexity Sonar',
            provider: 'Perplexity',
            type: 'Real-time Search & Intelligence',
            context: '32k',
            speed: 'Reliable',
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500'
        }
    ]

    const handleCardClick = (modelId: string) => {
        const config = modelConfigs[modelId] || {}
        setSelectedModelId(modelId)
        setApiKey(config.apiKey || "")
        setTemperature(config.temperature || 0.7)
        setMaxTokens(config.maxTokens || 2000)
        setIsAgentic(config.isAgentic || false)
        setModalOpen(true)
    }

    const handleConnect = async () => {
        if (!selectedModelId) return

        const isConnected = apiKey.length > 0
        await updateModelConnection(selectedModelId, isConnected, {
            apiKey,
            temperature,
            maxTokens,
            isAgentic
        })
        setModalOpen(false)
    }

    const selectedModel = aiModels.find(m => m.id === selectedModelId)

    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <Cpu className="h-10 w-10 text-emerald-500" />
                            Model Registry
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">Manage LLM engines available to the Olympus-OS</p>
                    </div>
                </div>

                {/* Models Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiModels.map((model) => {
                        const isConnected = connectedModels[model.id] === true
                        const config = modelConfigs[model.id]

                        return (
                            <Card
                                key={model.id}
                                onClick={() => handleCardClick(model.id)}
                                className="relative overflow-hidden transition-all duration-300 border-border/50 hover:border-border hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 cursor-pointer group bg-card/30 backdrop-blur-xl"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 ${model.color}`}></div>
                                <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${isConnected ? model.color : 'bg-muted'}`}></div>
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className={isConnected ? model.textColor : 'text-muted-foreground'}>
                                            {model.provider}
                                        </Badge>
                                        {config?.isAgentic && (
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                                                AGENTIC SPARTAN
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{model.name}</CardTitle>
                                    <CardDescription className="text-sm mt-1">{model.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                            <div className="space-y-1">
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                                                    <MemoryStick className="h-3 w-3" />
                                                    Context
                                                </div>
                                                <div className="font-semibold">{model.context} tokens</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                                                    <Zap className="h-3 w-3" />
                                                    Speed
                                                </div>
                                                <div className="font-semibold">{model.speed}</div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border/50">
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider mb-2">
                                                <Activity className="h-3 w-3" />
                                                System Status
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
                                                <span className="text-sm font-medium">{isConnected ? 'API Connected & Ready' : 'Offline / Tap to Connect'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Connection Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[500px] border-border bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {selectedModel && <div className={`h-3 w-3 rounded-full ${modelConfigs[selectedModel.id] ? selectedModel.color : 'bg-muted'}`} />}
                            {selectedModel?.name} Connection
                        </DialogTitle>
                        <DialogDescription>
                            Configure API credentials and operational parameters for this model.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="apiKey" className="text-sm font-medium">API Key</Label>
                            <Input
                                id="apiKey"
                                type="password"
                                placeholder="Enter your key..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="font-mono bg-muted/30 focus-visible:ring-emerald-500/50"
                            />
                            <p className="text-[10px] text-muted-foreground italic">Your key is stored locally and encrypted in Olympus-OS.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-sm font-medium">Temperature</Label>
                                    <span className="text-xs font-mono">{temperature}</span>
                                </div>
                                <Slider
                                    value={[temperature]}
                                    min={0}
                                    max={1.5}
                                    step={0.1}
                                    onValueChange={([val]) => setTemperature(val)}
                                    className="pt-2"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-sm font-medium">Max Tokens</Label>
                                    <span className="text-xs font-mono">{maxTokens}</span>
                                </div>
                                <Slider
                                    value={[maxTokens]}
                                    min={100}
                                    max={32000}
                                    step={100}
                                    onValueChange={([val]) => setMaxTokens(val)}
                                    className="pt-2"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-emerald-500" />
                                        Agentic Spartan Mode
                                    </Label>
                                    <p className="text-xs text-muted-foreground pr-8">
                                        Enable this model to act as a sub-agent for autonomous dashboard tasks.
                                    </p>
                                </div>
                                <Switch
                                    checked={isAgentic}
                                    onCheckedChange={setIsAgentic}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </div>

                        {isAgentic && apiKey === "" && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-tight">
                                    API key required to enable Agentic Mode. Model will remain offline until connected.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleConnect}
                            className={`bg-emerald-600 hover:bg-emerald-500 transition-all ${apiKey.length > 0 ? 'opacity-100' : 'opacity-70'}`}
                        >
                            {apiKey.length > 0 ? (connectedModels[selectedModelId!] ? 'Save Changes' : 'Connect API') : 'Disconnect Model'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
