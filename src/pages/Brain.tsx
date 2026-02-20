import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { 
    Brain as BrainIcon, 
    Settings, 
    Zap, 
    Target, 
    MessageSquare,
    Command,
    Shield,
    Cpu,
    Database,
    Globe,
    Mail,
    Calendar,
    Bot,
    Users,
    Activity,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Save,
    RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KratosConfig {
    name: string
    role: string
    personality: string
    responseStyle: 'concise' | 'detailed' | 'strategic'
    primaryModel: string
    maxSubAgents: number
    autoDeploy: boolean
    notifications: boolean
}

interface SystemStatus {
    cpu: number
    memory: number
    uptime: string
    activeConnections: number
}

export function Brain() {
    const [config, setConfig] = useState<KratosConfig>({
        name: 'Kratos',
        role: 'Digital Spartan / Executive Strategist',
        personality: 'Efficient, Competent, Loyal, Strategic',
        responseStyle: 'concise',
        primaryModel: 'gpt-4o',
        maxSubAgents: 300,
        autoDeploy: true,
        notifications: true
    })

    const [systemStatus] = useState<SystemStatus>({
        cpu: 23,
        memory: 45,
        uptime: '99.9%',
        activeConnections: 12
    })

    const [chatLog, setChatLog] = useState<{ role: string; content: string; time: string }[]>([
        { role: 'system', content: 'Brain interface initialized. Kratos ready for direct communication.', time: '00:00' }
    ])
    const [chatInput, setChatInput] = useState('')

    const handleSendMessage = () => {
        if (!chatInput.trim()) return
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setChatLog(prev => [...prev, { role: 'user', content: chatInput, time }])
        
        // Simulate Kratos response
        setTimeout(() => {
            const responses: Record<string, string> = {
                'hello': 'Greetings, Commander. Brain interface active. How may I serve?',
                'status': `Systems operational. CPU: ${systemStatus.cpu}%, Memory: ${systemStatus.memory}%. 300 Spartans ready.`,
                'help': 'Direct control available. Configure my settings, monitor system status, or communicate directly through this interface.',
                'deploy': 'Deployment sequence ready. Which project shall we deploy?',
                'default': 'I receive your command, Commander. Executing now.'
            }
            const lower = chatInput.toLowerCase()
            let response = responses.default
            for (const [key, value] of Object.entries(responses)) {
                if (lower.includes(key)) {
                    response = value
                    break
                }
            }
            const msgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            setChatLog(prev => [...prev, { role: 'kratos', content: response, time: msgTime }])
        }, 800)
        
        setChatInput('')
    }

    const handleConfigChange = (key: keyof KratosConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }

    const handleSaveConfig = () => {
        setChatLog(prev => [...prev, { role: 'system', content: `Configuration saved: ${config.name} - ${config.role}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }

    return (
        <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <BrainIcon className="h-8 w-8 text-purple-500" />
                            Kratos Brain
                        </h1>
                        <p className="text-muted-foreground">Direct control center for Kratos - your Digital Spartan</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Online
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                            <Users className="h-3 w-3" />
                            300 Spartans
                        </Badge>
                    </div>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{systemStatus.cpu}%</div>
                                    <div className="text-xs text-muted-foreground">CPU Usage</div>
                                </div>
                                <Cpu className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{systemStatus.memory}%</div>
                                    <div className="text-xs text-muted-foreground">Memory</div>
                                </div>
                                <Database className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{systemStatus.uptime}</div>
                                    <div className="text-xs text-muted-foreground">Uptime</div>
                                </div>
                                <Activity className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{systemStatus.activeConnections}</div>
                                    <div className="text-xs text-muted-foreground">Connections</div>
                                </div>
                                <Globe className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Direct Chat with Kratos */}
                    <Card className="h-[500px]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Direct Communication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col h-[calc(100%-60px)]">
                            <div className="flex-1 overflow-auto space-y-3 mb-4">
                                {chatLog.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "p-3 rounded-lg",
                                        msg.role === 'system' && "bg-muted/50 text-center text-sm",
                                        msg.role === 'user' && "bg-blue-500/10 ml-8",
                                        msg.role === 'kratos' && "bg-purple-500/10 mr-8"
                                    )}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-semibold",
                                                msg.role === 'system' && "text-muted-foreground",
                                                msg.role === 'user' && "text-blue-500",
                                                msg.role === 'kratos' && "text-purple-500"
                                            )}>
                                                {msg.role === 'kratos' ? '🪓 Kratos' : msg.role === 'user' ? 'You' : 'System'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                                        </div>
                                        <div className="text-sm">{msg.content}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Message Kratos directly..."
                                    className="flex-1 px-4 py-2 rounded-lg border bg-background"
                                />
                                <Button onClick={handleSendMessage}>
                                    <Zap className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuration */}
                    <Card className="h-[500px] overflow-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Kratos Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Name</label>
                                <input
                                    type="text"
                                    value={config.name}
                                    onChange={(e) => handleConfigChange('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Role</label>
                                <input
                                    type="text"
                                    value={config.role}
                                    onChange={(e) => handleConfigChange('role', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Personality</label>
                                <input
                                    type="text"
                                    value={config.personality}
                                    onChange={(e) => handleConfigChange('personality', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Response Style</label>
                                <select
                                    value={config.responseStyle}
                                    onChange={(e) => handleConfigChange('responseStyle', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                >
                                    <option value="concise">Concise</option>
                                    <option value="detailed">Detailed</option>
                                    <option value="strategic">Strategic</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Primary Model</label>
                                <select
                                    value={config.primaryModel}
                                    onChange={(e) => handleConfigChange('primaryModel', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                >
                                    <option value="gpt-4o">GPT-4o</option>
                                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Max Sub-Agents</label>
                                <input
                                    type="number"
                                    value={config.maxSubAgents}
                                    onChange={(e) => handleConfigChange('maxSubAgents', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Auto-Deploy</span>
                                <Button 
                                    variant={config.autoDeploy ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleConfigChange('autoDeploy', !config.autoDeploy)}
                                >
                                    {config.autoDeploy ? 'Enabled' : 'Disabled'}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Notifications</span>
                                <Button 
                                    variant={config.notifications ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleConfigChange('notifications', !config.notifications)}
                                >
                                    {config.notifications ? 'Enabled' : 'Disabled'}
                                </Button>
                            </div>
                            <Button className="w-full" onClick={handleSaveConfig}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Configuration
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Target className="h-6 w-6" />
                                <span className="text-sm">Deploy Project</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => window.location.href = '/ops/org-chart'}>
                                <Command className="h-6 w-6" />
                                <span className="text-sm">Open Org Chart</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <RefreshCw className="h-6 w-6" />
                                <span className="text-sm">Sync Systems</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Shield className="h-6 w-6" />
                                <span className="text-sm">Security Scan</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}