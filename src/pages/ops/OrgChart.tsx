import { useState, useEffect } from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import {
    Users,
    Bot,
    ChevronDown,
    ChevronRight,
    Layers,
    Plus,
    Command,
    Search,
    Filter,
    MoreVertical,
    TrendingUp,
    Activity,
    Cpu,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Types ---

type AgentStatus = 'idle' | 'working' | 'completed' | 'failed'

interface SubAgent {
    id: string
    name: string
    type: 'general' | 'coding' | 'research' | 'builder' | 'writer' | 'analyst'
    status: AgentStatus
    parentId?: string
    lastTask?: string
    startedAt: string
    models: string[]
    capabilities: string[]
    completedTasks: number
    currentTaskProgress?: number
}

interface Message {
    id: string
    sender: 'user' | 'kratos'
    text: string
    timestamp: string
}

// --- Helper Functions ---

const generateModelPool = (type: string): string[] => {
    const modelPools: Record<string, string[]> = {
        general: ['gpt-4o', 'claude-3.5-sonnet', 'gemini-2.0-flash'],
        coding: ['gpt-4o', 'claude-3.5-sonnet', 'deepseek-coder'],
        research: ['gpt-4o', 'claude-3.5-sonnet', 'perplexity', 'gemini-2.0-flash'],
        builder: ['gpt-4o', 'claude-3.5-sonnet', 'stable-diffusion'],
        writer: ['gpt-4o', 'claude-3.5-sonnet', 'gemini-2.0-flash'],
        analyst: ['gpt-4o', 'claude-3.5-sonnet', 'python']
    }
    return modelPools[type] || modelPools.general
}

const generateCapabilities = (type: string): string[] => {
    const caps: Record<string, string[]> = {
        general: ['Task Delegation', 'Research', 'Planning', 'Communication'],
        coding: ['Code Generation', 'Debugging', 'Code Review', 'Refactoring'],
        research: ['Web Search', 'Data Analysis', 'Summarization', 'Fact Checking'],
        builder: ['UI Design', 'Frontend Dev', 'Backend Dev', 'Deployment'],
        writer: ['Content Creation', 'Copywriting', 'Editing', 'SEO'],
        analyst: ['Data Visualization', 'Reporting', 'Forecasting', 'Metrics']
    }
    return caps[type] || caps.general
}

const createAgent = (type: SubAgent['type'], parentId?: string, name?: string): SubAgent => {
    const id = `agent-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1)
    return {
        id,
        name: name || `${typeLabel}-${Math.floor(Math.random() * 900) + 100}`,
        type,
        status: 'idle',
        parentId,
        lastTask: undefined,
        startedAt: new Date().toISOString(),
        models: generateModelPool(type),
        capabilities: generateCapabilities(type),
        completedTasks: 0
    }
}

const agentTypes: { type: SubAgent['type']; label: string; icon: string; color: string }[] = [
    { type: 'general', label: 'General', icon: '◎', color: 'bg-blue-500' },
    { type: 'coding', label: 'Coding', icon: '⌘', color: 'bg-purple-500' },
    { type: 'research', label: 'Research', icon: '◉', color: 'bg-green-500' },
    { type: 'builder', label: 'Builder', icon: '⚡', color: 'bg-orange-500' },
    { type: 'writer', label: 'Writer', icon: '✎', color: 'bg-pink-500' },
    { type: 'analyst', label: 'Analyst', icon: '◈', color: 'bg-yellow-500' }
]

// --- Main Component ---

export function OrgChart() {
    const [agents, setAgents] = useState<SubAgent[]>([
        { ...createAgent('general', undefined, 'Athena'), status: 'working', lastTask: 'Coordinating Spartan forces', completedTasks: 47, currentTaskProgress: 65 },
        { ...createAgent('coding', undefined, 'Hephaestus'), status: 'working', lastTask: 'Building command interfaces', completedTasks: 23, currentTaskProgress: 80 },
        { ...createAgent('research', undefined, 'Apollo'), status: 'idle', completedTasks: 89 },
        { ...createAgent('builder', undefined, 'Ares'), status: 'completed', lastTask: 'Deploy Olympus-OS to production', completedTasks: 156 }
    ])
    const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null)
    const [commandInput, setCommandInput] = useState('')
    const [statusFeed, setStatusFeed] = useState<{ id: string; message: string; type: string; timestamp: string }[]>([])
    const [activeTab, setActiveTab] = useState<'hierarchy' | 'spawn' | 'tasks'>('hierarchy')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    const totalSpartans = 300
    const activeAgents = agents.filter(a => a.status === 'working').length

    useEffect(() => {
        setStatusFeed([
            { id: '1', message: 'Command Hierarchy initialized', type: 'info', timestamp: new Date().toISOString() },
            { id: '2', message: '300 Spartans ready for deployment', type: 'success', timestamp: new Date().toISOString() },
            { id: '3', message: 'Athena coordinating forces', type: 'info', timestamp: new Date(Date.now() - 1000).toISOString() }
        ])
    }, [])

    const handleSpawnAgent = (type: SubAgent['type'], parentId?: string) => {
        if (agents.length >= totalSpartans) {
            setStatusFeed(prev => [{ id: `status-${Date.now()}`, message: 'Maximum Spartans reached (300)', type: 'error', timestamp: new Date().toISOString() }, ...prev])
            return
        }
        const newAgent = createAgent(type, parentId)
        setAgents(prev => [...prev, newAgent])
        setStatusFeed(prev => [{ id: `status-${Date.now()}`, message: `Spawned ${type} Spartan: ${newAgent.name}`, type: 'success', timestamp: new Date().toISOString() }, ...prev])
    }

    const handleCommand = () => {
        if (!commandInput.trim()) return
        setStatusFeed(prev => [{ id: `status-${Date.now()}`, message: `Executing: ${commandInput}`, type: 'info', timestamp: new Date().toISOString() }, ...prev])
        setTimeout(() => {
            setStatusFeed(prev => [{ id: `status-${Date.now()}`, message: `Completed: ${commandInput}`, type: 'success', timestamp: new Date().toISOString() }, ...prev])
        }, 1500)
        setCommandInput('')
    }

    const getChildAgents = (parentId: string) => agents.filter(a => a.parentId === parentId)
    const rootAgents = agents.filter(a => !a.parentId)

    const filteredAgents = agents.filter(agent => {
        if (filterStatus !== 'all' && agent.status !== filterStatus) return false
        if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    const renderHierarchyNode = (agent: SubAgent, level: number = 0) => {
        const children = getChildAgents(agent.id)
        return (
            <div key={agent.id} style={{ marginLeft: level * 32 }}>
                <div 
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all mb-2",
                        selectedAgent?.id === agent.id 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : "border-border hover:border-emerald-500/50"
                    )}
                    onClick={() => setSelectedAgent(agent)}
                >
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold", 
                        agent.type === 'general' && "bg-blue-500/20 text-blue-500",
                        agent.type === 'coding' && "bg-purple-500/20 text-purple-500",
                        agent.type === 'research' && "bg-green-500/20 text-green-500",
                        agent.type === 'builder' && "bg-orange-500/20 text-orange-500",
                        agent.type === 'writer' && "bg-pink-500/20 text-pink-500",
                        agent.type === 'analyst' && "bg-yellow-500/20 text-yellow-500"
                    )}>
                        {agentTypes.find(t => t.type === agent.type)?.icon || '◈'}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{agent.name}</span>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full uppercase",
                                agent.status === 'idle' && "bg-green-500/20 text-green-500",
                                agent.status === 'working' && "bg-yellow-500/20 text-yellow-500",
                                agent.status === 'completed' && "bg-blue-500/20 text-blue-500",
                                agent.status === 'failed' && "bg-red-500/20 text-red-500"
                            )}>{agent.status}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{agent.type} • {agent.completedTasks} tasks</div>
                    </div>
                    {agent.currentTaskProgress && (
                        <div className="w-24">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${agent.currentTaskProgress}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{agent.currentTaskProgress}%</span>
                        </div>
                    )}
                    {level < 2 && (
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleSpawnAgent('general', agent.id) }}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {children.length > 0 && (
                    <div className="ml-4 pl-4 border-l border-border">
                        {children.map(child => renderHierarchyNode(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Stats */}
                <div className="p-6 border-b bg-gradient-to-r from-background to-secondary/20">
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-5 gap-4 mb-6">
                        <div className="text-center p-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/10">
                            <div className="text-3xl font-bold text-emerald-500">1</div>
                            <div className="text-xs text-muted-foreground uppercase">Commander</div>
                        </div>
                        <div className="text-center p-4 rounded-xl border border-border">
                            <div className="text-3xl font-bold">{rootAgents.filter(a => getChildAgents(a.id).length > 0).length}</div>
                            <div className="text-xs text-muted-foreground uppercase">Chiefs</div>
                        </div>
                        <div className="text-center p-4 rounded-xl border border-border">
                            <div className="text-3xl font-bold">{agents.length}</div>
                            <div className="text-xs text-muted-foreground uppercase">Total Agents</div>
                        </div>
                        <div className="text-center p-4 rounded-xl border border-border">
                            <div className="text-3xl font-bold text-blue-500">{activeAgents}</div>
                            <div className="text-xs text-muted-foreground uppercase">Active</div>
                        </div>
                        <div className="text-center p-4 rounded-xl border border-border">
                            <div className="text-3xl font-bold text-muted-foreground">{totalSpartans - agents.length}</div>
                            <div className="text-xs text-muted-foreground uppercase">Available</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Command className="h-6 w-6 text-emerald-500" />
                                Command Hierarchy
                            </h1>
                            <p className="text-muted-foreground">Manage your 300 Digital Spartans</p>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex gap-2">
                        <Button variant={activeTab === 'hierarchy' ? 'default' : 'ghost'} onClick={() => setActiveTab('hierarchy')}>
                            <Layers className="h-4 w-4 mr-2" /> Hierarchy
                        </Button>
                        <Button variant={activeTab === 'spawn' ? 'default' : 'ghost'} onClick={() => setActiveTab('spawn')}>
                            <Plus className="h-4 w-4 mr-2" /> Spawn
                        </Button>
                        <Button variant={activeTab === 'tasks' ? 'default' : 'ghost'} onClick={() => setActiveTab('tasks')}>
                            <Activity className="h-4 w-4 mr-2" /> Tasks
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6">
                    {activeTab === 'hierarchy' && (
                        <div className="space-y-4">
                            {/* Search & Filter */}
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search Spartans..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                                    />
                                </div>
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 rounded-lg border bg-background"
                                >
                                    <option value="all">All Status</option>
                                    <option value="idle">Idle</option>
                                    <option value="working">Working</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {/* Kratos Root - At Top */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 p-6 rounded-xl border-2 border-emerald-500 bg-emerald-500/10">
                                    <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl bg-emerald-500/20">
                                        🪓
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-emerald-500">KRATOS</div>
                                        <div className="text-sm text-muted-foreground">Commander • {agents.length} Spartans Deployed • {rootAgents.filter(a => getChildAgents(a.id).length > 0).length} Chiefs</div>
                                    </div>
                                </div>
                            </div>

                            {/* Captains Row - Top 4 Agents */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Your Captains</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    {rootAgents.slice(0, 4).map((agent, idx) => (
                                        <div 
                                            key={agent.id}
                                            className={cn(
                                                "p-4 rounded-xl border cursor-pointer transition-all",
                                                selectedAgent?.id === agent.id 
                                                    ? "border-emerald-500 bg-emerald-500/10" 
                                                    : "border-border hover:border-emerald-500/50"
                                            )}
                                            onClick={() => setSelectedAgent(agent)}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold", 
                                                    agent.type === 'general' && "bg-blue-500/20 text-blue-500",
                                                    agent.type === 'coding' && "bg-purple-500/20 text-purple-500",
                                                    agent.type === 'research' && "bg-green-500/20 text-green-500",
                                                    agent.type === 'builder' && "bg-orange-500/20 text-orange-500"
                                                )}>
                                                    {agentTypes.find(t => t.type === agent.type)?.icon || '◈'}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{agent.name}</div>
                                                    <div className="text-xs text-muted-foreground">Captain #{idx + 1}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={cn("text-xs px-2 py-0.5 rounded-full uppercase",
                                                    agent.status === 'idle' && "bg-green-500/20 text-green-500",
                                                    agent.status === 'working' && "bg-yellow-500/20 text-yellow-500",
                                                    agent.status === 'completed' && "bg-blue-500/20 text-blue-500"
                                                )}>{agent.status}</span>
                                                <span className="text-xs text-muted-foreground">{agent.completedTasks} tasks</span>
                                            </div>
                                            {agent.currentTaskProgress && (
                                                <div>
                                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${agent.currentTaskProgress}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="text-xs text-muted-foreground mt-2">
                                                {getChildAgents(agent.id).length} Sub-agents
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hierarchy Tree - Sub-agents under captains */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Sub-Agents</h3>
                                {rootAgents.slice(0, 4).map(agent => {
                                    const subAgents = getChildAgents(agent.id)
                                    if (subAgents.length === 0) return null
                                    return (
                                        <div key={agent.id} className="mb-4">
                                            <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <span className="text-emerald-500">→</span> 
                                                {agent.name}'s Division ({subAgents.length})
                                            </div>
                                            {subAgents.map(child => renderHierarchyNode(child, 0))}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'spawn' && (
                        <div className="grid grid-cols-6 gap-4">
                            {agentTypes.map(({ type, label, icon, color }) => (
                                <div 
                                    key={type}
                                    className="p-6 rounded-xl border border-border hover:border-emerald-500 cursor-pointer transition-all text-center"
                                    onClick={() => handleSpawnAgent(type)}
                                >
                                    <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3", color + "/20")}>
                                        {icon}
                                    </div>
                                    <div className="font-semibold mb-1">{label}</div>
                                    <div className="text-xs text-emerald-500">Click to Spawn</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-4">
                            {/* Command Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commandInput}
                                    onChange={(e) => setCommandInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                                    placeholder="Delegate task to Spartans..."
                                    className="flex-1 px-4 py-3 rounded-lg border bg-background"
                                />
                                <Button onClick={handleCommand}>
                                    <Zap className="h-4 w-4 mr-2" /> Execute
                                </Button>
                            </div>

                            {/* Status Feed */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Status Feed</h3>
                                {statusFeed.map(update => (
                                    <div key={update.id} className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border",
                                        update.type === 'success' && "border-l-green-500",
                                        update.type === 'error' && "border-l-red-500",
                                        update.type === 'info' && "border-l-blue-500"
                                    )}>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(update.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span>{update.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Agent Detail Panel */}
            {selectedAgent && (
                <div className="w-80 border-l bg-card p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-lg">Agent Details</h2>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(null)}>×</Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
                                selectedAgent.type === 'general' && "bg-blue-500/20 text-blue-500",
                                selectedAgent.type === 'coding' && "bg-purple-500/20 text-purple-500",
                                selectedAgent.type === 'research' && "bg-green-500/20 text-green-500",
                                selectedAgent.type === 'builder' && "bg-orange-500/20 text-orange-500"
                            )}>
                                {agentTypes.find(t => t.type === selectedAgent.type)?.icon || '◈'}
                            </div>
                            <div>
                                <div className="font-bold">{selectedAgent.name}</div>
                                <div className={cn("text-sm", 
                                    selectedAgent.status === 'idle' && "text-green-500",
                                    selectedAgent.status === 'working' && "text-yellow-500",
                                    selectedAgent.status === 'completed' && "text-blue-500"
                                )}>{selectedAgent.status}</div>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-secondary/50">
                            <div className="text-sm text-muted-foreground mb-1">Current Task</div>
                            <div>{selectedAgent.lastTask || 'No active task'}</div>
                            {selectedAgent.currentTaskProgress && (
                                <div className="mt-2">
                                    <div className="h-2 bg-background rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${selectedAgent.currentTaskProgress}%` }} />
                                    </div>
                                    <span className="text-xs">{selectedAgent.currentTaskProgress}% complete</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-2">Connected Models</div>
                            <div className="flex flex-wrap gap-2">
                                {selectedAgent.models.map(model => (
                                    <span key={model} className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">
                                        {model}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-2">Capabilities</div>
                            <div className="flex flex-wrap gap-2">
                                {selectedAgent.capabilities.map(cap => (
                                    <span key={cap} className="text-xs px-2 py-1 rounded border">
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded bg-secondary/50">
                                <div className="font-bold text-emerald-500">{selectedAgent.completedTasks}</div>
                                <div className="text-xs text-muted-foreground">Tasks</div>
                            </div>
                            <div className="p-2 rounded bg-secondary/50">
                                <div className="font-bold">{getChildAgents(selectedAgent.id).length}</div>
                                <div className="text-xs text-muted-foreground">Sub-Agents</div>
                            </div>
                            <div className="p-2 rounded bg-secondary/50">
                                <div className="font-bold">{new Date(selectedAgent.startedAt).toLocaleDateString()}</div>
                                <div className="text-xs text-muted-foreground">Started</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1">Assign Task</Button>
                            <Button variant="destructive" className="flex-1">Terminate</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}