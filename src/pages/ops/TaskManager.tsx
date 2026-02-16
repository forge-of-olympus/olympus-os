import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { RefreshCw, Activity, Clock, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data Generators
const generateRandomMetric = (base: number, variance: number) => {
    return Math.floor(base + (Math.random() * variance * 2 - variance))
}

const models = [
    {
        name: "Claude Opus 4.6",
        status: "online",
        latency: "145ms",
        description: "Primary model for complex reasoning and code generation tasks.",
        authType: "OAUTH 2.0",
        cost: "$0.075 / 1k",
        tokens: "12.5M",
        sessions: 8
    },
    {
        name: "Claude Opus 4.5 (Antigravity)",
        status: "online",
        latency: "160ms",
        description: "[Fallback 1] High-stability fallback for critical system operations.",
        authType: "API KEY",
        cost: "$0.060 / 1k",
        tokens: "4.2M",
        sessions: 2
    },
    {
        name: "Gemini 3 Pro Preview",
        status: "online",
        latency: "110ms",
        description: "[Fallback 2] Experimental model for multimodal analysis and fast context.",
        authType: "OAUTH 2.0",
        cost: "$0.030 / 1k",
        tokens: "8.1M",
        sessions: 5
    },
    {
        name: "GPT 5.3 Codex",
        status: "online",
        latency: "180ms",
        description: "Legacy code completion and pattern matching engine.",
        authType: "API KEY",
        cost: "$0.045 / 1k",
        tokens: "15.3M",
        sessions: 3
    },
    {
        name: "Gemini 3 Flash",
        status: "idle",
        latency: "-",
        description: "Ultra-low latency model for real-time interactions.",
        authType: "API KEY",
        cost: "$0.005 / 1k",
        tokens: "2.1M",
        sessions: 0
    },
    {
        name: "Nano Banana Pro",
        status: "offline",
        latency: "-",
        description: "Local lightweight model for offline tasks (Currently Maintainence).",
        authType: "LOCAL",
        cost: "$0.000 / 1k",
        tokens: "0",
        sessions: 0
    },
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
        tags: ["Claude Opus", "Refactor"],
        timeAgo: "1h 20m ago",
        formattedDate: "Feb 15 3:30pm",
        timestamp: Date.now() - 80 * 60 * 1000, // 80 mins ago
        notes: "Refactoring complete. 45 files updated."
    },
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

export function TaskManager() {
    const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString())
    const [metrics, setMetrics] = useState({
        active: 12,
        idle: 5,
        totalSessions: 1458,
        tokensUsed: 450230,
        totalCost: 124.50
    })
    const [sessions, setSessions] = useState<Session[]>(initialSessions)

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

            {/* Model Fleet */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight cursor-default">Model Fleet <span className="text-yellow-500">({models.length})</span></h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {models.map((model, i) => (
                        <ModelCard key={i} model={model} />
                    ))}
                </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Active Sessions <span className="text-yellow-500">({metrics.active})</span></h2>
                </div>
                <div className="flex flex-col gap-4">
                    {sessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            </div>

            {/* Cron Monitor */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Cron Monitor <span className="text-yellow-500">({dailyJobs.length + weeklyJobs.length})</span></h2>
                </div>

                {/* Daily Jobs */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-1">Daily Jobs</h3>
                    {dailyJobs.map(job => (
                        <CronJobCard key={job.id} job={job} />
                    ))}
                </div>

                {/* Weekly Jobs */}
                <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-1">Weekly Jobs</h3>
                    {weeklyJobs.map(job => (
                        <CronJobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>

            {/* Overnight Log */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Overnight Log <span className="text-yellow-500">({overnightTasks.length})</span></h2>
                </div>
                <div className="space-y-1 bg-muted/20 p-6 rounded-lg border border-border/50">
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

function ModelCard({ model }: any) {
    return (
        <Card className={cn(
            "transition-all duration-300 min-h-[220px] flex flex-col justify-between border-l-4 border-l-yellow-500",
            model.status === 'offline' && "opacity-75 grayscale"
        )}>
            <CardHeader className="p-6 pb-2 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="text-base font-semibold leading-tight flex items-center gap-2">
                            {model.name}
                            {model.status !== 'offline' && (
                                <span className="text-[10px] font-normal text-muted-foreground px-1.5 py-0.5 rounded-full border bg-muted/50 font-mono">
                                    {model.latency}
                                </span>
                            )}
                        </CardTitle>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[40px]">
                    {model.description}
                </p>

                <div className="flex items-center gap-3 pt-2">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 border-primary/20 bg-primary/5">
                        {model.authType}
                    </Badge>
                    <div className={cn(
                        "h-2.5 w-2.5 rounded-full shadow-sm",
                        model.status === 'online' ? "bg-green-500 shadow-green-500/50" :
                            model.status === 'idle' ? "bg-yellow-500 shadow-yellow-500/50" : "bg-red-500"
                    )} />
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-2">
                <div className="grid grid-cols-3 gap-2 text-xs border-t pt-4 mt-2">
                    <div className="flex items-baseline gap-1">
                        <p className="font-medium font-mono">{model.cost}</p>
                        <p className="text-muted-foreground text-[10px] uppercase">Cost</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p className="font-medium font-mono">{model.tokens}</p>
                        <p className="text-muted-foreground text-[10px] uppercase">Tokens</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p className="font-medium font-mono">{model.sessions}</p>
                        <p className="text-muted-foreground text-[10px] uppercase">Sessions</p>
                    </div>
                </div>
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

                            <div className="space-y-2">
                                <h3 className="text-lg font-medium leading-none tracking-tight">{session.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex gap-2">
                                        {session.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-5 font-mono">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">{session.timeAgo}</span>
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
                    <div className="flex justify-end pl-8">
                        <div className="text-[11px] text-muted-foreground font-mono opacity-75">
                            {session.formattedDate}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CronJobCard({ job }: { job: CronJob }) {
    return (
        <Card className="w-full hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
                {/* Left Side: Indicator + Title/Summary */}
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-3 w-3 rounded-full shrink-0",
                        job.status === 'success' ? "bg-green-500" :
                            job.status === 'running' ? "bg-blue-500 animate-pulse" :
                                job.status === 'failed' ? "bg-red-500" : "bg-yellow-500"
                    )} />
                    <div>
                        <h4 className="font-medium text-base leading-none mb-1">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.summary}</p>
                    </div>
                </div>

                {/* Right Side: Time -> Owner -> Tags */}
                <div className="flex items-center gap-8 text-right">
                    {/* Time Block */}
                    <div className="flex flex-col items-end min-w-[80px]">
                        <span className="text-sm font-mono font-medium">{job.schedule}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{job.duration !== '-' ? `Duration: ${job.duration}` : 'Pending'}</span>
                    </div>

                    {/* Owner Tag */}
                    <Badge variant="outline" className={cn(
                        "font-mono text-[10px] uppercase px-2 py-0.5 border-none",
                        job.owner === 'Ops' ? "bg-blue-500/10 text-blue-500" :
                            job.owner === 'Brain' ? "bg-purple-500/10 text-purple-500" :
                                "bg-orange-500/10 text-orange-500"
                    )}>
                        {job.owner}
                    </Badge>

                    {/* Job Tags */}
                    <div className="flex gap-2 min-w-[140px] justify-end">
                        {job.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-5 font-mono text-muted-foreground bg-muted/50 border border-border/50">
                                {tag}
                            </Badge>
                        ))}
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
