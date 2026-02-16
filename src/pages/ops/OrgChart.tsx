import { useState } from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import {
    Users,
    Bot,
    ChevronDown,
    ChevronRight,
    Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// --- Types ---

type AgentStatus = 'active' | 'idle' | 'ready' | 'deprecated' | 'scaffolded'

interface Agent {
    id: string
    name: string
    role: string
    avatar?: string
    status: AgentStatus
    description: string
    aiModel?: string
    tools?: string[]
}

interface Division {
    id: string
    name: string
    summary: string
    agents: Agent[]
}

interface Executive {
    id: string
    name: string
    role: string
    avatar?: string
    status: AgentStatus
    description: string
    aiModel?: string
    tools?: string[]
    divisions: Division[]
}

interface TopAgent {
    id: string
    name: string
    role: string
    status: AgentStatus
    description: string
    aiModel?: string
    subordinates?: Executive[]
}

// --- Mock Data ---

const ceoAgent: TopAgent = {
    id: "CEO",
    name: "Jake Hudswell",
    role: "CEO",
    status: 'active',
    description: "Vision, Strategy, Final Decisions",
}

const cooAgent: TopAgent = {
    id: "COO",
    name: "Kratos",
    role: "COO",
    status: 'active',
    aiModel: "Claude Opus 4.6 (Antigravity)",
    description: "Research, Delegation, Execution and Organization",
    subordinates: [
        {
            id: "CTO",
            name: "Elon",
            role: "CTO",
            status: 'active',
            aiModel: "o3-mini-high",
            description: "Technical architecture, Code reviews, System scaling",
            divisions: [
                {
                    id: "D-BE",
                    name: "Backend & Security",
                    summary: "Core API infrastructure, authentication services, and security hardening",
                    agents: [
                        { id: "A-1", name: "ArchitectOne", role: "System Architect", status: 'active', aiModel: "Claude 3.5 Sonnet", description: "Designing microservices schema", tools: ["Diagrams as Code", "AWS CLI"] },
                        { id: "A-2", name: "DevBot Alpha", role: "Backend Developer", status: 'idle', aiModel: "GPT-4o", description: "API implementation", tools: ["VS Code", "Postman"] },
                    ]
                },
                {
                    id: "D-FE",
                    name: "Frontend & DevOps",
                    summary: "UI component library, CI/CD pipelines, and deployment automation",
                    agents: [
                        { id: "A-4", name: "UIBuilder", role: "Frontend Developer", status: 'active', aiModel: "Claude 3.5 Sonnet", description: "React component development", tools: ["Figma", "Storybook"] },
                        { id: "A-5", name: "PipelineBot", role: "DevOps Engineer", status: 'active', aiModel: "GPT-4o", description: "CI/CD and infrastructure automation", tools: ["GitHub Actions", "Docker", "Terraform"] },
                    ]
                },
                {
                    id: "D-QA",
                    name: "QA",
                    summary: "Automated testing, regression coverage, and legacy code maintenance",
                    agents: [
                        { id: "A-3", name: "LegacyFixer", role: "Maintenance", status: 'deprecated', aiModel: "GPT-3.5", description: "Refactoring old codebases", tools: ["Git"] },
                        { id: "A-6", name: "TestRunner", role: "QA Analyst", status: 'scaffolded', aiModel: "-", description: "End-to-end test automation", tools: ["Playwright", "Jest"] },
                    ]
                }
            ]
        },
        {
            id: "CMO",
            name: "Gary",
            role: "CMO",
            status: 'idle',
            aiModel: "Gemini 1.5 Pro",
            description: "Marketing strategy, Content generation, Brand voice",
            divisions: [
                {
                    id: "D-CON",
                    name: "Content",
                    summary: "Blog posts, SEO content, documentation, and thought leadership",
                    agents: [
                        { id: "M-1", name: "CopyWriter X", role: "Content Creator", status: 'active', aiModel: "Claude 3 Opus", description: "Blog post generation", tools: ["CMS", "SEO Tools"] },
                    ]
                },
                {
                    id: "D-CRE",
                    name: "Creative",
                    summary: "Social media management, visual branding, and campaign assets",
                    agents: [
                        { id: "M-2", name: "SocialBee", role: "Social Media Manager", status: 'scaffolded', aiModel: "-", description: "Waiting for API keys", tools: ["Twitter API", "LinkedIn API"] },
                    ]
                }
            ]
        },
        {
            id: "CRO",
            name: "Alex",
            role: "CRO",
            status: 'active',
            aiModel: "GPT-4-Turbo",
            description: "Revenue optimization, Growth Metrics and Product Market",
            divisions: [
                {
                    id: "D-PRD",
                    name: "Products",
                    summary: "Product development lifecycle, feature prioritization, and roadmap management",
                    agents: [
                        { id: "S-2", name: "ProductScope", role: "Product Analyst", status: 'active', aiModel: "GPT-4o", description: "Feature scoping and roadmap analysis", tools: ["Jira", "Confluence"] },
                    ]
                },
                {
                    id: "D-GRW",
                    name: "Growth",
                    summary: "Sales pipeline optimization, lead generation, and conversion tracking",
                    agents: [
                        { id: "S-1", name: "LeadGenius", role: "SalesDR", status: 'ready', aiModel: "GPT-4o", description: "Outbound lead qualification", tools: ["LinkedIn Sales Nav", "Email Client"] },
                    ]
                },
                {
                    id: "D-COM",
                    name: "Community",
                    summary: "User engagement, community building, and developer relations",
                    agents: [
                        { id: "S-3", name: "CommunityBot", role: "Community Manager", status: 'scaffolded', aiModel: "-", description: "Discord and forum moderation", tools: ["Discord API", "Discourse"] },
                    ]
                }
            ]
        }
    ]
}

// Count all agents across divisions
const allAgents = cooAgent.subordinates?.flatMap(exec => exec.divisions.flatMap(d => d.agents)) || []
const totalAgentCount = allAgents.length + 5 // +5 for Jake, Kratos, Elon, Gary, Alex
const activeCount = allAgents.filter(a => a.status === 'active').length
const scaffoldedCount = allAgents.filter(a => a.status === 'scaffolded').length
const deprecatedCount = allAgents.filter(a => a.status === 'deprecated').length

const metrics = [
    { title: "Chiefs", value: "5", color: "text-yellow-500", border: "border-l-yellow-500" },
    { title: "Total Agents", value: String(totalAgentCount), color: "text-yellow-500", border: "border-l-yellow-500" },
    { title: "Active", value: String(activeCount), color: "text-green-500", border: "border-l-green-500" },
    { title: "Scaffolded", value: String(scaffoldedCount), color: "text-yellow-500", border: "border-l-yellow-500" },
    { title: "Deprecated", value: String(deprecatedCount), color: "text-red-500", border: "border-l-red-500" },
]

// --- Constants ---

const MODEL_COLORS: Record<string, string> = {
    "Claude Opus 4.6 (Antigravity)": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "o3-mini-high": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Claude 3.5 Sonnet": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "GPT-4o": "bg-green-500/10 text-green-500 border-green-500/20",
    "GPT-3.5": "bg-gray-500/10 text-gray-500 border-gray-500/20",
    "Gemini 1.5 Pro": "bg-teal-500/10 text-teal-500 border-teal-500/20",
    "Claude 3 Opus": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    "GPT-4-Turbo": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "default": "bg-primary/10 text-primary border-primary/20"
}

const STATUS_COLORS: Record<AgentStatus, string> = {
    active: "border-l-green-500",
    idle: "border-l-yellow-500",
    ready: "border-l-blue-500",
    deprecated: "border-l-red-500",
    scaffolded: "border-l-slate-400"
}

// --- Components ---

export function OrgChart() {
    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Organization Chart</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Olympus OS - Operational Structure
                </p>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-5">
                {metrics.map((m, i) => (
                    <Card key={i} className={cn("border-l-4 flex flex-col items-center justify-center py-6", m.border)}>
                        <CardContent className="p-0 flex flex-col items-center gap-2">
                            <div className={cn("text-3xl font-bold", m.color)}>{m.value}</div>
                            <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Hierarchy Tree Visualizer */}
            <div className="flex flex-col items-center space-y-8 mt-8">
                {/* CEO */}
                <AgentNode agent={ceoAgent} isTopLevel />

                {/* Connector */}
                <div className="h-8 w-px bg-border -my-4" />

                {/* COO */}
                <AgentNode agent={cooAgent} isTopLevel />

                {/* Connector to Chiefs */}
                <div className="h-8 w-px bg-border -my-4" />

                {/* Chiefs Row */}
                <div className="flex flex-row items-start justify-center gap-8 w-full pt-4 border-t border-border/50 relative overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {cooAgent.subordinates?.map(chief => (
                        <div key={chief.id} className="flex flex-col items-center space-y-6 w-[400px] shrink-0">
                            <AgentNode agent={chief} className="min-h-[140px]" />

                            {/* Divisions */}
                            {chief.divisions.length > 0 && (
                                <div className="w-full space-y-3 pl-4 border-l-2 border-border/30 ml-4">
                                    {chief.divisions.map(division => (
                                        <DivisionCard key={division.id} division={division} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">AI Model Legend</h3>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(MODEL_COLORS).filter(([key]) => key !== 'default').map(([name, colorClass]) => (
                        <Badge key={name} variant="outline" className={cn("font-mono font-normal", colorClass)}>
                            {name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}

function AgentNode({ agent, isTopLevel, className }: { agent: TopAgent | Executive, isTopLevel?: boolean, className?: string }) {
    const isScaffolded = agent.status === 'scaffolded'
    const borderColor = isScaffolded ? "border-l-yellow-500" : STATUS_COLORS[agent.status]

    const isExec = ['CTO', 'CMO', 'CRO'].includes(agent.id)
    const showModelHeader = isExec

    return (
        <Card className={cn("w-full max-w-md border-l-4 shadow-md transition-all hover:shadow-lg", borderColor, className)}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                        {agent.id === 'CEO' ? <Users className="h-6 w-6 text-foreground" /> :
                            agent.id === 'COO' ? <Bot className="h-6 w-6 text-blue-500" /> :
                                <Bot className="h-6 w-6 text-muted-foreground" />}
                    </div>

                    <div className="space-y-1 w-full">
                        {isTopLevel ? (
                            <>
                                <p className="text-sm font-medium text-blue-500">{agent.role}</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg leading-none mt-1">{agent.name}</h3>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg leading-none">{agent.name}</h3>
                                    {showModelHeader && agent.aiModel && (
                                        <Badge variant="outline" className={cn("text-[10px] font-mono px-2 py-0.5", MODEL_COLORS[agent.aiModel] || MODEL_COLORS['default'])}>
                                            {agent.aiModel}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-blue-500">{agent.role}</p>
                            </>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {agent.description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function DivisionCard({ division }: { division: Division }) {
    const [isOpen, setIsOpen] = useState(false)
    const activeCount = division.agents.filter(a => a.status === 'active').length

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <div className="w-full bg-card rounded-md border shadow-sm">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Layers className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">{division.name}</h4>
                            <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[220px]">{division.summary}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                            {activeCount}/{division.agents.length}
                        </Badge>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>

                <CollapsibleContent>
                    <div className="px-3 pb-3 space-y-2 border-t border-border/50 pt-2">
                        {division.agents.map(agent => (
                            <DivisionAgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}

function DivisionAgentCard({ agent }: { agent: Agent }) {
    const borderColor = agent.status === 'scaffolded' ? "border-l-yellow-500" : STATUS_COLORS[agent.status]
    const modelColor = agent.aiModel && agent.aiModel !== '-' ? (MODEL_COLORS[agent.aiModel] || MODEL_COLORS['default']) : null

    return (
        <div className={cn("w-full bg-background rounded-md border-l-4 border border-t-border border-r-border border-b-border p-3", borderColor)}>
            <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-muted/50 flex items-center justify-center border border-border/50 shrink-0">
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h5 className="font-semibold text-xs truncate">{agent.name}</h5>
                        {modelColor && (
                            <Badge variant="outline" className={cn("text-[8px] px-1.5 py-0 shrink-0", modelColor)}>
                                {agent.aiModel}
                            </Badge>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{agent.role} · {agent.description}</p>
                </div>
            </div>
        </div>
    )
}
