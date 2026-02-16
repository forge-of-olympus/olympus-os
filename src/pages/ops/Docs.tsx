
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { FileText, BookOpen } from "lucide-react"

interface Doc {
    id: string
    title: string
    content: string
}

const docs: Doc[] = [
    {
        id: 'overview',
        title: 'Overview',
        content: `# Olympus OS Overview\n\nOlympus OS is a comprehensive operating system for managing AI agents, tasks, and organizational structures. It is designed to streamline operations and enhance collaboration between human and AI workers.\n\n## Key Features\n\n- **Task Management**: Centralized task tracking for all agents.\n- **Organization Chart**: Visual hierarchy of the AI workforce.\n- **Workspaces**: Dedicated environments for agent configuration.\n- **Documentation**: Centralized knowledge base.`
    },
    {
        id: 'task-manager',
        title: 'Task Manager',
        content: `# Task Manager\n\nThe Task Manager is the central hub for tracking and managing tasks across the organization. It provides a real-time view of task status, priority, and assignment.\n\n## Features\n\n- **Kanban Board**: Drag-and-drop task management.\n- **List View**: Detailed list of all tasks.\n- **Filtering**: Filter by agent, status, or priority.\n- **Creation**: Rapidly create and assign new tasks.`
    },
    {
        id: 'org-chart',
        title: 'Organization Chart',
        content: `# Organization Chart\n\nThe Organization Chart visualizes the hierarchy and structure of the AI workforce. It shows the relationships between chiefs, sub-agents, and their respective roles.\n\n## Structure\n\n- **Chiefs**: High-level agents responsible for specific domains (e.g., Ops, Dev, Marketing).\n- **Sub-agents**: Specialized agents reporting to chiefs.\n- **Metrics**: Real-time performance metrics for each agent.`
    },
    {
        id: 'team-workspaces',
        title: 'Team Workspaces',
        content: `# Team Workspaces\n\nTeam Workspaces provide dedicated environments for configuring and managing individual agents. This is where you define an agent's identity, tools, and behavior.\n\n## Configuration Files\n\n- **IDENTITY.md**: Defines the agent's persona and role.\n- **TOOLS.md**: Lists the tools available to the agent.\n- **MEMORY.md**: Configures the agent's memory systems.\n- **SOUL.md**: Defines the core core values and directives.`
    },
    {
        id: 'memory-architecture',
        title: 'Memory Architecture',
        content: `# Memory Architecture\n\nOlympus OS utilizes a sophisticated memory architecture to ensure agents retain context and learn over time.\n\n## Layers\n\n1.  **Short-term Memory**: Handles immediate context and current tasks.\n2.  **Long-term Memory**: Stores historical data and learned patterns.\n3.  **Episodic Memory**: Records specific events and interactions.\n4.  **Semantic Memory**: Stores general knowledge and facts.`
    }
]

export function Docs() {
    const [selectedDoc, setSelectedDoc] = useState<Doc>(docs[0])

    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            {/* Left Sidebar */}
            <div className="w-[300px] border-r bg-background/50 flex flex-col h-full shrink-0">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">Documentation</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        System guides and references
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Guides</h3>
                    <div className="space-y-1">
                        {docs.map((doc) => (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                    selectedDoc.id === doc.id
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <FileText className="h-4 w-4 shrink-0" />
                                {doc.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                <ScrollArea className="h-full">
                    <div className="p-8 max-w-4xl mx-auto w-full">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold tracking-tight mb-4">{selectedDoc.title}</h1>
                            <div className="h-1 w-20 bg-primary rounded-full" />
                        </div>

                        <Card className="border-none shadow-none bg-transparent">
                            <CardContent className="p-0">
                                <article className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-muted-foreground prose-p:leading-relaxed">
                                    {/* Simple markdown rendering for now - just preserving whitespace */}
                                    <div className="whitespace-pre-wrap font-sans text-base">
                                        {selectedDoc.content.replace(/^# .+\n/, '')} {/* Remove H1 as it's already shown above */}
                                    </div>
                                </article>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
