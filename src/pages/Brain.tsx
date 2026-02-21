import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import {
    Brain as BrainIcon,
    Settings,
    Zap,
    Target,
    Command,
    Shield,
    Cpu,
    Database,
    Globe,
    Users,
    Activity,
    CheckCircle,
    FileText,
    Clock,
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

const memoryFiles = [
    {
        title: '2026-02-20',
        content: `# 2026-02-20

## Kronos Repo & Deployment Progress
- User requested initialization of a fresh Kronos GitHub repo under forge-of-olympus. 
- Tech stack planned: React + Vite MVP with dashboard, mocked sub-agents, command surface, and live status feed.
- Production wiring: Bind to Vercel project https://vercel.com/kratos-factory-deployments-projects, production branch main.
- Deployment: Production path main, no canary.
- Health checks: Page title Kronos, topbar branding Kronos, test sub-agent spawn status.
- Deliverables: Live Kronos production URL, compact health-pass, rollback/hotfix plan if needed.
- Status: Repo creation and deployment in progress; awaiting completion to report live URL and health-pass.
- User expressed frustration with delays; committed to executing end-to-end without further questions.

## Olympus-OS Status
- Branding updates completed: Olympus-OS text in topbar, River-OS logo image retained with alt text Olympus-OS.
- Production URL: https://olympus-os.vercel.app (verified via Vercel CLI).
- GitHub auth: Active (kratos-factory), token scopes include repo, read:org, workflow.
- Vercel project: olympus-os bound to forge-of-olympus/olympus-os, production path main.

## Recent Actions
- Re-checked GitHub↔Vercel bindings and triggered production deploys for both Olympus-OS and Kronos.
- Addressed user concerns about stalled progress by committing to direct execution without further questions.
- Planned rollback/hotfix steps for both projects if deployment issues arise.

## Next Steps
- Complete Kronos deployment and report live URL + health-pass.
- Proceed with Olympus-OS remediation if needed after Kronos is stabilized.
- Provide rollback/hotfix plans for both projects if any deployment blockers occur.`
    },
    {
        title: 'wins.md',
        content: `# Daily Wins Log

## 2026-02-20
- **Kronos Command Deck Deployed:** Built and deployed a command dashboard for commanding sub-agents. Live URL: https://kronos-command-deck.vercel.app
- **Features:** Sub-agents panel (Athena, Hephaestus, Apollo, Ares), spawn controls, command center, real-time status feed
- **Tech Stack:** React + Vite + TypeScript
- **GitHub:** https://github.com/forge-of-olympus/kronos-command-deck

## 2026-02-16
- **Identity Forged:** Kratos initialized. Soul and mission codified.
- **Arsenal Secured:** Web Recon (Brave/Chromium), G-Suite (GOG), Code (GH/Vercel) fully operational.
- **Olympus Rising:** Deployed \`kratos-forge\` (KratosOS), \`project-300\` (Phalanx Command), and \`olympus-os\` (Full Enterprise OS).
- **Fleet Assembled:** Digital Spartans organized under 3 Chiefs (Hephaestus, Ares, Apollo).
- **Infrastructure:** Secured repository history and successfully deployed to Vercel production.`
    }
]

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

    const [selectedMemory, setSelectedMemory] = useState(0)
    const [memoryKey, setMemoryKey] = useState(0) // Used to force refresh

    const handleMemoryRefresh = () => {
        setMemoryKey(prev => prev + 1)
    }

    const handleConfigChange = (key: keyof KratosConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }

    const handleSaveConfig = () => {
        alert('Configuration saved!')
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
                    {/* Memory Files */}
                    <Card className="h-[500px] overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Kratos Memory
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={handleMemoryRefresh}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-60px)] flex flex-col">
                            <div className="flex gap-2 mb-4">
                                {memoryFiles.map((file, idx) => (
                                    <Button
                                        key={idx}
                                        variant={selectedMemory === idx ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedMemory(idx)}
                                    >
                                        {file.title}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex-1 overflow-auto p-4 rounded-lg bg-secondary/50">
                                <pre className="text-sm whitespace-pre-wrap font-mono">
                                    {memoryFiles[selectedMemory].content}
                                </pre>
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
                            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => window.location.href = '/ops/company'}>
                                <Command className="h-6 w-6" />
                                <span className="text-sm">Open Company</span>
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