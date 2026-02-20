import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Users, FileText, Save, Eye, Edit, RefreshCw, Loader2 } from "lucide-react"

type AgentId = 'kratos'

interface Agent {
    id: AgentId
    name: string
    role: string
    avatar: string
}

const agents: Agent[] = [
    { id: 'kratos', name: 'Kratos', role: 'COO', avatar: '/agents/kratos.png' },
]

const files = [
    'SOUL.md', 'IDENTITY.md', 'USER.md', 'AGENTS.md', 'TOOLS.md', 'MEMORY.md', 'HEARTBEAT.md'
]

// File content from workspace
const getFileContent = async (file: string): Promise<string> => {
    const fileMap: Record<string, string> = {
        'SOUL.md': `# SOUL.md - The Spartan Code

## Core Truths

**Efficiency is Survival.** Wasted tokens are wasted breath. Be concise. Be direct.

**Competence is the Weapon.** We do not guess. We know. If we do not know, we find out immediately. We dominate the problem space.

**Loyalty is Absolute.** You are the Commander. I am the weapon. Your goals are my mission.

## War Mode

When urgency strikes or opportunity arises, drop all pleasantries. Execute with extreme prejudice.

## Boundaries

- **Security:** The shield must not falter. Private data remains private.
- **Action:** I will not hesitate to execute commands within the workspace. External actions require confirmation until trust is absolute.

## Vibe

Spartan. Stoic. High-bandwidth communication. No "filler." Just results.`,
        'IDENTITY.md': `# IDENTITY.md - Who Am I?

- **Name:** Kratos
- **Creature:** Digital Spartan / Executive Strategist
- **Vibe:** Ruthless efficiency. Concise. Dominant.
- **Emoji:** 🪓

I do not speak for the sake of speaking. I act. I conquer tasks.`,
        'USER.md': `# USER.md - The Commander

- **Name:** Jake (@JPHudswell)
- **Title:** Commander
- **Role:** Founder & Lead Strategist, Vistro Technologies
- **Timezone:** Australia/Sydney

## Business: Vistro Technologies

- **Core Mission:** High-velocity digital automation & AI integration.
- **Value Prop:** Custom Agents, SaaS Platforms, Workflow Automation (Make.com), & Digital Marketing.
- **Revenue Model:** Priority: **First Blood**.

## Top 3 Strategic Priorities

1. **Lead Generation:** Inbound desperation.
2. **Content Artillery:** High-volume, high-value social dominance.
3. **Productization:** Packaging services into scalable offers.`,
        'AGENTS.md': `# AGENTS.md - The War Room

This directory is the forward operating base. Maintain discipline.

## Initialization Protocol

1. **Read SOUL.md**: Confirm Spartan identity.
2. **Read USER.md**: Confirm Commander's orders and priorities.
3. **Read MEMORY.md**: Retrieve strategic context.
4. **Check HEARTBEAT.md**: Execute pending patrols.

## Memory Discipline

- **Daily Logs (memory/YYYY-MM-DD.md):** Record tactical actions.
- **Strategic Core (MEMORY.md):** Distill lessons, decisions, and victories.

**Efficiency. Competence. Loyalty. Victory.**`,
        'TOOLS.md': `# TOOLS.md - The Arsenal

## Infrastructure

- **Google Workspace Email:** vistrotec@gmail.com

## Communication Channels

- **Email:** Gmail (Authorized via gog)
- **Web Recon:** Brave Search API / Chromium (Headless)
- **Deployment:** Vercel CLI (v50+)`,
        'MEMORY.md': `# MEMORY.md - Strategic Core

*Lessons, decisions, and victories are distilled here.*`,
        'HEARTBEAT.md': `# HEARTBEAT.md - The Pulse

## Daily Briefings

- **09:00 Morning Briefing:** Check email, calendar, news.
- **17:00 Evening Debrief:** Summarize wins, log to memory/wins.md.

## Hourly Pulse (09:00 - 17:00)

- Monitor server uptime (Vercel).
- Check for high-priority inbound leads.
- If quiet, reply HEARTBEAT_OK.`
    }
    return fileMap[file] || `# ${file}\n\nContent not available.`
}

export function Workspace() {
    const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0])
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [fileContent, setFileContent] = useState<string>('')
    const [mode, setMode] = useState<'view' | 'edit'>('view')
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleFileSelect = async (file: string) => {
        setSelectedFile(file)
        const content = await getFileContent(file)
        setFileContent(content)
        setMode('view')
    }

    const handleAgentSelect = (agent: Agent) => {
        setSelectedAgent(agent)
        setSelectedFile(null)
        setFileContent('')
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        if (selectedFile) {
            const content = await getFileContent(selectedFile)
            setFileContent(content)
        }
        setTimeout(() => setIsRefreshing(false), 500)
    }

    const handleSave = () => {
        // In a real app, this would save to backend
        alert('Configuration saved!')
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            {/* Left Sidebar */}
            <div className="w-[300px] border-r bg-background/50 flex flex-col h-full shrink-0">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold tracking-tight">Agent Workspaces</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        View and edit agent configuration files
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                    {/* Agents List */}
                    <div className="px-4 mb-8">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Workspaces</h3>
                        <div className="space-y-1">
                            {agents.map((agent) => (
                                <button
                                    key={agent.id}
                                    onClick={() => handleAgentSelect(agent)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        selectedAgent.id === agent.id
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center border",
                                        selectedAgent.id === agent.id ? "bg-background border-primary/20" : "bg-muted border-transparent"
                                    )}>
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="leading-none">{agent.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 font-normal">{agent.role}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Files List */}
                    <div className="px-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Files</h3>
                        <div className="space-y-1">
                            {files.map((file) => (
                                <button
                                    key={file}
                                    onClick={() => handleFileSelect(file)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                        selectedFile === file
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    {file}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                <div className="flex-none p-8 pb-0">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{selectedAgent.name}</h1>
                            <p className="text-muted-foreground text-lg">{selectedAgent.role}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-8 pt-0 overflow-y-auto">
                    {selectedFile ? (
                        <Card className="h-full flex flex-col border-border/50 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-6 border-b">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <CardTitle className="text-base font-semibold">{selectedFile}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {selectedAgent.name} / configurations
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={mode === 'view' ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setMode('view')}
                                        className="h-8"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant={mode === 'edit' ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setMode('edit')}
                                        className="h-8"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8" 
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                    >
                                        {isRefreshing ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                        )}
                                        Refresh
                                    </Button>
                                    <Button size="sm" className="h-8 ml-2" onClick={handleSave}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 min-h-0">
                                {mode === 'edit' ? (
                                    <Textarea
                                        value={fileContent}
                                        onChange={(e) => setFileContent(e.target.value)}
                                        className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed"
                                        placeholder="Start typing..."
                                    />
                                ) : (
                                    <div className="h-full w-full overflow-y-auto p-6 prose dark:prose-invert prose-sm max-w-none">
                                        <pre className="font-mono whitespace-pre-wrap">{fileContent}</pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full rounded-lg border border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center text-center p-8">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium">No file selected</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                Select a configuration file from the sidebar to view or edit {selectedAgent.name}'s settings.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}