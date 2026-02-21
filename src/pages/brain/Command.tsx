import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Command, Send, Zap, Activity, Clock, Users, ShieldAlert, RefreshCw } from "lucide-react"

export function CommandCenter() {
    const [commandText, setCommandText] = useState('')

    const activeTasks = [
        { id: 'T-1029', title: 'Deploy Kronos Deck', status: 'In Progress', agent: 'Hephaestus', priority: 'High' },
        { id: 'T-1030', title: 'Analyze Sub-Agent Metrics', status: 'Pending', agent: 'Athena', priority: 'Medium' },
    ]

    const decisionLog = [
        { id: 'D-882', text: 'Auto-scaled resources for VistroAI routing due to high load.', time: '10 mins ago', type: 'System' },
        { id: 'D-881', text: 'Approved deployment of new artifact generation pipeline.', time: '1 hour ago', type: 'Tactical' },
    ]

    return (
        <div className="flex h-full animate-in fade-in duration-500">
            <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <Command className="h-10 w-10 text-red-500" />
                            Command Center
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">Global Operations & Delegation Surface</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-sm text-muted-foreground">Active Directives</div>
                        </div>
                        <div className="w-px bg-border"></div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-500">99.9%</div>
                            <div className="text-sm text-muted-foreground">Fleet Efficiency</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Issue Commands */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Command Input */}
                        <Card className="border-red-500/20 bg-red-500/5 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-red-500" />
                                    Issue Global Directive
                                </CardTitle>
                                <CardDescription>Command Kratos to delegate tasks across the Spartan fleet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Textarea
                                        placeholder="e.g., 'Deploy 5 agents to scrape competitor pricing data and summarize into memory/daily_pricing.md'"
                                        className="min-h-[120px] bg-background/50 border-input font-mono text-sm leading-relaxed focus-visible:ring-red-500"
                                        value={commandText}
                                        onChange={(e) => setCommandText(e.target.value)}
                                    />
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Target: All</Badge>
                                            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Priority: Auto</Badge>
                                        </div>
                                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                                            <Send className="h-4 w-4" />
                                            Execute Order
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Delegations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Active Delegations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activeTasks.map(task => (
                                        <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{task.title}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                        <span>ID: {task.id}</span>
                                                        <span>•</span>
                                                        <span>Agent: {task.agent}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className={task.priority === 'High' ? 'text-red-500 bg-red-500/10' : ''}>
                                                    {task.priority}
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    {task.status === 'In Progress' ? <RefreshCw className="h-3 w-3 animate-spin duration-3000" /> : <Clock className="h-3 w-3" />}
                                                    {task.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Decision Stream */}
                    <div className="space-y-8">
                        <Card className="h-[600px] flex flex-col">
                            <CardHeader className="border-b bg-muted/10">
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5" />
                                    Autonomous Decisions
                                </CardTitle>
                                <CardDescription>Decisions executed by Kratos without manual intervention.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-0">
                                <div className="divide-y">
                                    {decisionLog.map(log => (
                                        <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline" className="text-xs">{log.type}</Badge>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {log.time}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">
                                                {log.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
