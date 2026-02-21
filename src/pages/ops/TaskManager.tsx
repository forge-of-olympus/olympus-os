import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { RefreshCw, Activity, Clock, Lightbulb, Database, CheckCircle2, XCircle, AlertCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAI } from "@/contexts/AIContext"

// Mock Data Generators
const generateRandomMetric = (base: number, variance: number) => {
    return Math.floor(base + (Math.random() * variance * 2 - variance))
}

const models = [
    {
        id: "claude-4.6-opus",
        name: "Claude 4.6 Opus",
        status: "online",
        latency: "145ms",
        description: "Primary model for complex reasoning and maximum intelligence.",
        authType: "API KEY",
        cost: "$0.075 / 1k",
        tokens: "12.5M",
        sessions: 8
    },
    {
        id: "claude-4.6-sonnet",
        name: "Claude 4.6 Sonnet",
        status: "online",
        latency: "85ms",
        description: "High-speed model for reasoning, coding and analysis.",
        authType: "API KEY",
        cost: "$0.015 / 1k",
        tokens: "24.2M",
        sessions: 12
    },
    {
        id: "gemini-3.1-pro",
        name: "Gemini 3.1 Pro",
        status: "online",
        latency: "110ms",
        description: "Model for multimodal research and analysis with large context.",
        authType: "API KEY",
        cost: "$0.030 / 1k",
        tokens: "8.1M",
        sessions: 5
    },
    {
        id: "gpt-5.3-codex",
        name: "GPT 5.3 Codex",
        status: "online",
        latency: "180ms",
        description: "Advanced model for complex code generation.",
        authType: "API KEY",
        cost: "$0.045 / 1k",
        tokens: "15.3M",
        sessions: 3
    },
    {
        id: "gemini-3-flash",
        name: "Gemini 3 Flash",
        status: "idle",
        latency: "45ms",
        description: "Ultra-low latency model for real-time and high-speed tasks.",
        authType: "API KEY",
        cost: "$0.005 / 1k",
        tokens: "2.1M",
        sessions: 0
    },
    {
        id: "nano-banana-pro",
        name: "Nano Banana Pro",
        status: "offline",
        latency: "-",
        description: "Specialized model for image generation.",
        authType: "API KEY",
        cost: "$0.020 / img",
        tokens: "0",
        sessions: 0
    },
    {
        id: "veo-3.1",
        name: "Veo 3.1",
        status: "offline",
        latency: "-",
        description: "Specialized model for high quality video generation.",
        authType: "API KEY",
        cost: "$0.100 / sec",
        tokens: "0",
        sessions: 0
    },
    {
        id: "openrouter-free",
        name: "Openrouter/free",
        status: "online",
        latency: "120ms",
        description: "Free cost-effective AI models via OpenRouter.",
        authType: "API KEY",
        cost: "FREE",
        tokens: "5.4M",
        sessions: 2
    },
    {
        id: "perplexity-sonar",
        name: "Perplexity Sonar",
        status: "online",
        latency: "195ms",
        description: "Real-time search and intelligence engine.",
        authType: "API KEY",
        cost: "$0.020 / req",
        tokens: "1.2M",
        sessions: 4
    }
]

interface Session {
    id: string
    title: string
    status: 'active' | 'idle' | 'completed'
    tokens: number
    cost: number
    tags: string[]
    timeAgo: string
    formattedDate: string
    timestamp: number
    currentAction?: string
    notes?: string
}

interface CronJob {
    id: string
    title: string
    summary: string
    schedule: string
    duration: string
    owner: 'Ops' | 'Brain' | 'Labs'
    tags: string[]
    status: 'success' | 'running' | 'pending' | 'failed'
}

const initialSessions: Session[] = [
    {
        id: "S-1024",
        title: "Analyze large dataset for anomalies",
        status: "active" as const,
        tokens: 12450,
        cost: 0.12,
        tags: ["Claude Opus", "Data Analysis"],
        timeAgo: "2m ago",
        formattedDate: "Feb 15 4:50pm",
        timestamp: Date.now() - 2 * 60 * 1000, // 2 mins ago
        currentAction: "Scanning row 45,201 of 1M for outliers..."
    },
    {
        id: "S-1026",
        title: "Optimize database queries",
        status: "idle" as const,
        tokens: 8900,
        cost: 0.09,
        tags: ["GPT 5.3", "SQL"],
        timeAgo: "15m ago",
        formattedDate: "Feb 15 4:35pm",
        timestamp: Date.now() - 15 * 60 * 1000, // 15 mins ago
        notes: "Optimization paused. Waiting for user input on index strategy."
    },
    {
        id: "S-1027",
        title: "Translations for marketing copy",
        status: "active" as const,
        tokens: 2300,
        cost: 0.02,
        tags: ["Gemini 3 Pro", "Translation"],
        timeAgo: "45m ago",
        formattedDate: "Feb 15 4:05pm",
        timestamp: Date.now() - 45 * 60 * 1000, // 45 mins ago
        currentAction: "Translating paragraph 4 to Spanish (ES-MX)..."
    },
    {
        id: "S-1028",
        title: "Legacy Code Refactor",
        status: "completed" as const,
        tokens: 4500,
        cost: 0.045,
        tags: ["Claude Opus", "Refactor", "Apollo"],
        timeAgo: "1h 20m ago",
        formattedDate: "Feb 15 3:30pm",
        timestamp: Date.now() - 80 * 60 * 1000, // 80 mins ago
        notes: "Refactoring complete. 45 files updated."
    },
    {
        id: "S-1029",
        title: "Deploying Vistro-AI Updates",
        status: "active" as const,
        tokens: 15400,
        cost: 0.08,
        tags: ["Gemini 3 Pro", "Deployment", "Kratos"],
        timeAgo: "5m ago",
        formattedDate: "Feb 15 4:47pm",
        timestamp: Date.now() - 5 * 60 * 1000,
        currentAction: "Building production bundle..."
    },
    {
        id: "S-1030",
        title: "Security Audit",
        status: "idle" as const,
        tokens: 32000,
        cost: 0.25,
        tags: ["Claude Opus", "Security", "Ares"],
        timeAgo: "22m ago",
        formattedDate: "Feb 15 4:30pm",
        timestamp: Date.now() - 22 * 60 * 1000,
        notes: "Audit paused pending manual review of suspected vulnerabilities."
    },
    {
        id: "S-1031",
        title: "Generating New UI Assets",
        status: "active" as const,
        tokens: 8500,
        cost: 0.05,
        tags: ["Nano Banana Pro", "Design", "Hephaestus"],
        timeAgo: "12m ago",
        formattedDate: "Feb 15 4:40pm",
        timestamp: Date.now() - 12 * 60 * 1000,
        currentAction: "Rendering high-res glassmorphism icons..."
    }
].sort((a, b) => b.timestamp - a.timestamp)

const dailyJobs: CronJob[] = [
    { id: "J-101", title: "Database Backup", summary: "Full backup of primary Postgres cluster", schedule: "00:00 AM", duration: "14m 30s", owner: 'Ops', tags: ["Backup", "Critical"], status: 'success' },
    { id: "J-102", title: "Cache Pruning", summary: "Clear expired Redis keys and extensive temp files", schedule: "03:00 AM", duration: "4m 12s", owner: 'Ops', tags: ["Maintenance", "Redis"], status: 'success' },
    { id: "J-103", title: "System Health Check", summary: "Deep diagnostic scan of all microservices", schedule: "Every 1h", duration: "45s", owner: 'Brain', tags: ["Health", "Diagnostics"], status: 'running' },
    { id: "J-104", title: "Report Generation", summary: "Compile daily usage and cost reports", schedule: "06:00 AM", duration: "-", owner: 'Labs', tags: ["Analytics", "Reporting"], status: 'pending' },
]

const weeklyJobs: CronJob[] = [
    { id: "W-201", title: "Deep Analysis", summary: "Weekly AI performance and bias analysis", schedule: "Sun 02:00 AM", duration: "2h 15m", owner: 'Brain', tags: ["AI", "Audit"], status: 'success' },
    { id: "W-202", title: "Model Retraining", summary: "Incremental training on new user feedback data", schedule: "Sun 04:00 AM", duration: "-", owner: 'Labs', tags: ["Training", "ML"], status: 'pending' },
    { id: "W-203", title: "Log Archival", summary: "Compress and archive logs older than 30 days", schedule: "Sat 11:00 PM", duration: "45m", owner: 'Ops', tags: ["Storage", "Archival"], status: 'pending' },
]

interface OvernightTask {
    id: string
    title: string
    summary: string
    status: 'completed' | 'incomplete'
    category: string
    date: string
}

const overnightTasks: OvernightTask[] = [
    {
        id: "T-1",
        title: "Search Index Optimization",
        summary: "Re-indexed primary user search cluster for faster query performance across all regions.",
        status: 'completed',
        category: "Performance",
        date: "Feb 15, 2:30 AM"
    },
    {
        id: "T-2",
        title: "Security Patch Rollout",
        summary: "Applied critical security patches to load balancer fleet to address CVE-2025-X.",
        status: 'completed',
        category: "Security",
        date: "Feb 15, 3:15 AM"
    },
    {
        id: "T-3",
        title: "Model Distillation",
        summary: "Distillation of GPT-5.3 to Flash model interrupted by resource quotas. Rescheduled.",
        status: 'incomplete',
        category: "AI Ops",
        date: "Feb 15, 4:00 AM"
    },
    {
        id: "T-4",
        title: "Database Migration",
        summary: "Successfully migrated archive tables to cold storage buckets.",
        status: 'completed',
        category: "Data",
        date: "Feb 15, 4:45 AM"
    }
]

const AGENT_FILTERS = ['ALL', 'KRATOS', 'HEPHAESTUS', 'ARES', 'APOLLO']

export function TaskManager() {
    const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString())
    const [metrics, setMetrics] = useState({
        active: 12,
        idle: 5,
        totalSessions: 1458,
        tokensUsed: 450230,
        totalCost: 124.50
    })
    const { connectedModels } = useAI()
    const [sessions, setSessions] = useState<Session[]>(initialSessions)

    // UI State
    const [sessionsFilter, setSessionsFilter] = useState('ALL')
    const [sessionsExpanded, setSessionsExpanded] = useState(true)
    const [overnightExpanded, setOvernightExpanded] = useState(true)

    // Derived State
    const filteredSessions = useMemo(() => {
        if (sessionsFilter === 'ALL') return sessions;
        // In a real app we'd map this mapping more directly, for the mock let's just 
        // string match the filter name in the tags or fallback to random mapping for demo
        return sessions.filter(s => s.tags.some(t => t.toUpperCase() === sessionsFilter))
    }, [sessions, sessionsFilter])

    // Simulate Live Updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Update Metrics
            setMetrics(prev => ({
                active: generateRandomMetric(12, 3),
                idle: generateRandomMetric(5, 2),
                totalSessions: prev.totalSessions + 1,
                tokensUsed: prev.tokensUsed + Math.floor(Math.random() * 500),
                totalCost: prev.totalCost + (Math.random() * 0.01)
            }))

            // Update Sessions
            setSessions(prev => prev.map(session => {
                if (session.status === 'active') {
                    return {
                        ...session,
                        tokens: session.tokens + Math.floor(Math.random() * 50),
                        cost: session.cost + (Math.random() * 0.0005)
                    }
                }
                return session
            }))

        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const handleRefresh = () => {
        setLastRefreshed(new Date().toLocaleTimeString())
    }

    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
                    <p className="text-sm text-muted-foreground">
                        Last Refreshed: {lastRefreshed}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-2 px-3 py-1 border-green-500/50 text-green-500 bg-green-500/10">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-5">
                <MetricCard
                    title="Active"
                    value={metrics.active}
                    borderColor="border-l-green-500"
                    textColor="text-green-500"
                />
                <MetricCard
                    title="Idle"
                    value={metrics.idle}
                    borderColor="border-l-orange-500"
                    textColor="text-orange-500"
                />
                <MetricCard
                    title="Total Sessions"
                    value={metrics.totalSessions.toLocaleString()}
                    borderColor="border-l-purple-500"
                    textColor="text-purple-500"
                />
                <MetricCard
                    title="Tokens Used"
                    value={metrics.tokensUsed.toLocaleString()}
                    borderColor="border-l-blue-500"
                    textColor="text-blue-500"
                />
                <MetricCard
                    title="Total Cost"
                    value={`$${metrics.totalCost.toFixed(2)}`}
                    borderColor="border-l-red-500"
                    textColor="text-red-500"
                />
            </div>

            {/* Top Panels: Model Fleet & Cron Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Model Fleet Panel */}
                <Card className="flex flex-col border-border/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-yellow-500" />
                            <CardTitle className="text-base font-semibold">Model Fleet</CardTitle>
                        </div>
                        <div className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            {models.length}
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 py-4 px-6">
                        {models.map((model, i) => {
                            const isConnected = connectedModels[model.id] === true
                            return (
                                <div key={i} className="flex justify-between items-start">
                                    <div className="flex gap-3 items-start">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full mt-2 shrink-0",
                                            isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-600"
                                        )} />
                                        <div>
                                            <div className="text-sm font-medium leading-none mb-1 text-foreground/90">{model.name}</div>
                                            <div className="text-[11px] text-muted-foreground max-w-[280px] line-clamp-1">{model.description}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-right shrink-0">
                                        <div className="text-[11px] font-mono font-medium text-emerald-500/80">{isConnected ? "ONLINE" : "OFFLINE"}</div>
                                        <div className="text-[11px] font-mono font-medium text-yellow-500">{model.cost}</div>
                                        <div className="text-[11px] font-mono text-muted-foreground w-8 text-right">{isConnected ? model.latency : "-"}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Cron Health Panel */}
                <Card className="flex flex-col border-border/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <CardTitle className="text-base font-semibold">Cron Health</CardTitle>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="h-3 w-3" />{dailyJobs.filter(j => j.status === 'success').length + weeklyJobs.filter(j => j.status === 'success').length}</span>
                            <span className="flex items-center gap-1 text-red-500"><XCircle className="h-3 w-3" />{dailyJobs.filter(j => j.status === 'failed').length + weeklyJobs.filter(j => j.status === 'failed').length}</span>
                            <span className="flex items-center gap-1 text-yellow-500"><AlertCircle className="h-3 w-3" />{dailyJobs.filter(j => j.status !== 'success' && j.status !== 'failed').length + weeklyJobs.filter(j => j.status !== 'success' && j.status !== 'failed').length}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 py-4 px-6">
                        {[...dailyJobs, ...weeklyJobs].map((job, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div className="flex gap-3 items-start">
                                    <div className={cn(
                                        "h-1.5 w-1.5 rounded-full mt-2 shrink-0",
                                        job.status === 'success' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                            job.status === 'running' ? "bg-blue-500 animate-pulse" :
                                                job.status === 'failed' ? "bg-red-500" : "bg-yellow-500"
                                    )} />
                                    <div>
                                        <div className="text-sm font-medium leading-none mb-1 text-foreground/90">{job.title}</div>
                                        <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">Ls: {job.duration}</div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center h-full pt-1">
                                    <Badge variant="outline" className={cn(
                                        "text-[9px] uppercase px-1.5 py-0 border-none font-bold tracking-wider",
                                        job.owner === 'Ops' ? "text-blue-400 bg-blue-400/10" :
                                            job.owner === 'Brain' ? "text-purple-400 bg-purple-400/10" :
                                                "text-orange-400 bg-orange-400/10"
                                    )}>
                                        {job.owner}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Active Sessions */}
            <div className="space-y-4 pt-4">
                <div
                    className="flex items-center justify-between border-b pb-2 cursor-pointer group"
                    onClick={() => setSessionsExpanded(!sessionsExpanded)}
                >
                    <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
                        <ChevronDown className={cn("h-4 w-4 text-yellow-500 transition-transform duration-200", !sessionsExpanded && "-rotate-90")} />
                        <span className="flex items-center gap-2 group-hover:text-yellow-500 transition-colors">
                            Active Sessions <span className="text-yellow-500 text-sm ml-1">({filteredSessions.length})</span>
                        </span>
                    </h2>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {AGENT_FILTERS.map(f => (
                            <Badge
                                key={f}
                                variant="outline"
                                onClick={() => setSessionsFilter(f)}
                                className={cn("text-[9px] font-mono cursor-pointer transition-colors border-border/50 rounded-full px-3 py-0.5", sessionsFilter === f ? "bg-zinc-100 text-zinc-900" : "text-muted-foreground bg-transparent hover:text-foreground")}
                            >
                                {f}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className={cn(
                    "grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 origin-top overflow-hidden",
                    sessionsExpanded ? "opacity-100 scale-y-100 max-h-[2000px]" : "opacity-0 scale-y-0 max-h-0"
                )}>
                    {filteredSessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                    {filteredSessions.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground font-mono text-sm border-2 border-dashed border-border/50 rounded-lg">
                            No {sessionsFilter !== 'ALL' ? sessionsFilter : ''} sessions currently active.
                        </div>
                    )}
                </div>
            </div>

            {/* Overnight Log */}
            <div className="space-y-4 pt-4">
                <div
                    className="flex items-center justify-between border-b pb-2 cursor-pointer group"
                    onClick={() => setOvernightExpanded(!overnightExpanded)}
                >
                    <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
                        <ChevronDown className={cn("h-4 w-4 text-yellow-500 transition-transform duration-200", !overnightExpanded && "-rotate-90")} />
                        <span className="flex items-center gap-2 group-hover:text-yellow-500 transition-colors">
                            Overnight Log <span className="text-yellow-500 text-sm ml-1">({overnightTasks.length})</span>
                        </span>
                    </h2>
                </div>
                <div className={cn(
                    "space-y-1 bg-muted/20 p-6 rounded-lg border border-border/50 transition-all duration-300 origin-top overflow-hidden",
                    overnightExpanded ? "opacity-100 scale-y-100 max-h-[1000px]" : "opacity-0 scale-y-0 max-h-0 p-0 border-0"
                )}>
                    {overnightTasks.map((task) => (
                        <OvernightTaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, borderColor, textColor }: any) {
    return (
        <Card className={cn("border-l-4 flex flex-col items-center justify-center py-6", borderColor)}>
            <CardContent className="p-0 flex flex-col items-center gap-1">
                <div className={cn("text-3xl font-bold", textColor)}>{value}</div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardContent>
        </Card>
    )
}

function SessionCard({ session }: { session: Session }) {
    const isActive = session.status === 'active';
    const isIdle = session.status === 'idle';

    // Active = Green, Idle = Yellow, Completed = Slate (Gray)
    const borderColor = isActive ? "border-l-green-500" : isIdle ? "border-l-yellow-500" : "border-l-slate-400";
    const statusColor = isActive ? "bg-green-500" : isIdle ? "bg-yellow-500" : "bg-slate-400";
    const statusShadow = isActive ? "shadow-[0_0_10px_rgba(34,197,94,0.5)]" : isIdle ? "shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "";

    return (
        <Card className={cn("w-full border-l-4 transition-all duration-300", borderColor)}>
            <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                    {/* Top Row: Indicator, Title/Tags, Metrics */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                            {/* Big Circle Indicator */}
                            <div className={cn(
                                "h-4 w-4 rounded-full mt-1.5 shrink-0 transition-all duration-300",
                                statusColor,
                                isActive && "animate-pulse",
                                statusShadow
                            )} />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium leading-none tracking-tight">{session.title}</h3>
                                <div className="flex items-start xl:items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex flex-wrap gap-2 mt-0.5 xl:mt-0">
                                        {session.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-5 font-mono whitespace-nowrap">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Metrics */}
                        <div className="flex flex-col items-end gap-1.5 min-w-[150px]">
                            <div className="flex items-center gap-6 text-sm font-mono font-medium">
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="text-lg font-bold leading-none">{session.tokens.toLocaleString()}</span>
                                    <span className="text-muted-foreground text-[10px] uppercase tracking-wide">Tokens</span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="text-lg font-bold leading-none">${session.cost.toFixed(4)}</span>
                                    <span className="text-muted-foreground text-[10px] uppercase tracking-wide">Cost</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Heartbeat or Notes */}
                    <div className="w-full mt-2 pl-8">
                        {isActive ? (
                            <div className="text-[12px] font-medium flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-2 rounded-md border border-green-500/20 w-full animate-in fade-in slide-in-from-top-1 duration-300">
                                <Activity className="h-3.5 w-3.5 animate-pulse shrink-0" />
                                <span className="font-mono truncate">{session.currentAction || "Processing..."}</span>
                            </div>
                        ) : isIdle ? (
                            <div className="text-[12px] font-medium flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-md border border-yellow-500/20 w-full animate-in fade-in slide-in-from-top-1 duration-300">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-mono truncate">{session.notes || "Session paused."}</span>
                            </div>
                        ) : (
                            <div className="text-[12px] text-muted-foreground bg-muted/30 px-3 py-2 rounded-md border border-border/50 w-full font-mono animate-in fade-in slide-in-from-top-1 duration-300">
                                <span className="font-semibold text-foreground/80 mr-2">Final Notes:</span>
                                {session.notes || "Session completed successfully."}
                            </div>
                        )}
                    </div>

                    {/* Date/Time moved to bottom right */}
                    <div className="flex justify-end gap-3 pl-8">
                        <span className="text-[11px] text-muted-foreground font-mono opacity-75 whitespace-nowrap">{session.timeAgo}</span>
                        <div className="text-[11px] text-muted-foreground font-mono opacity-75 whitespace-nowrap">
                            {session.formattedDate}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


function OvernightTaskItem({ task }: { task: OvernightTask }) {
    return (
        <div className="flex items-start gap-4 py-4 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors rounded-md px-2 -mx-2">
            <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />

            <div className="flex-1 w-full">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm text-foreground/90 leading-relaxed">
                            <span className="font-bold text-foreground">{task.title}</span>
                            <span className="text-muted-foreground mx-2">-</span>
                            {task.summary}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{task.date}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={cn(
                            "font-mono text-[10px] uppercase px-2 py-0.5 border-none",
                            task.status === 'completed' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                            {task.status}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-5 font-mono text-muted-foreground border border-border/50">
                            {task.category}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}
