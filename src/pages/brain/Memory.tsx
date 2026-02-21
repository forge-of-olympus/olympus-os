import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FileText, Search, BookOpen, CalendarDays } from "lucide-react"

// Hardcoded for now based on user's previous Brain.tsx, could be moved to a service
const longTermMemories = [
    {
        id: 'MEMORY.md',
        title: 'MEMORY.md',
        content: `# MEMORY.md - Strategic Core\n\n*Lessons, decisions, and victories are distilled here.*\n\n## Identity & Directives\nEnsure all sub-agents align with the Spartan code. Efficiency is key.`
    },
    {
        id: 'wins.md',
        title: 'wins.md',
        content: `# Daily Wins Log\n\n## 2026-02-20\n- **Kronos Command Deck Deployed:** Built and deployed a command dashboard for commanding sub-agents. Live URL: https://kronos-command-deck.vercel.app\n- **Features:** Sub-agents panel (Athena, Hephaestus, Apollo, Ares), spawn controls, command center, real-time status feed\n- **Tech Stack:** React + Vite + TypeScript\n- **GitHub:** https://github.com/forge-of-olympus/kronos-command-deck\n\n## 2026-02-16\n- **Identity Forged:** Kratos initialized. Soul and mission codified.\n- **Arsenal Secured:** Web Recon (Brave/Chromium), G-Suite (GOG), Code (GH/Vercel) fully operational.\n- **Olympus Rising:** Deployed \`kratos-forge\` (KratosOS), \`project-300\` (Phalanx Command), and \`olympus-os\` (Full Enterprise OS).\n- **Fleet Assembled:** Digital Spartans organized under 3 Chiefs (Hephaestus, Ares, Apollo).\n- **Infrastructure:** Secured repository history and successfully deployed to Vercel production.`
    }
]

const dailyNotes = [
    {
        id: '2026-02-20',
        title: '2026-02-20',
        content: `# 2026-02-20\n\n## Kronos Repo & Deployment Progress\n- User requested initialization of a fresh Kronos GitHub repo under forge-of-olympus. \n- Tech stack planned: React + Vite MVP with dashboard, mocked sub-agents, command surface, and live status feed.\n- Production wiring: Bind to Vercel project https://vercel.com/kratos-factory-deployments-projects, production branch main.\n- Deployment: Production path main, no canary.\n- Health checks: Page title Kronos, topbar branding Kronos, test sub-agent spawn status.\n- Deliverables: Live Kronos production URL, compact health-pass, rollback/hotfix plan if needed.\n- Status: Repo creation and deployment in progress; awaiting completion to report live URL and health-pass.\n- User expressed frustration with delays; committed to executing end-to-end without further questions.\n\n## Olympus-OS Status\n- Branding updates completed: Olympus-OS text in topbar, River-OS logo image retained with alt text Olympus-OS.\n- Production URL: https://olympus-os.vercel.app (verified via Vercel CLI).\n- GitHub auth: Active (kratos-factory), token scopes include repo, read:org, workflow.\n- Vercel project: olympus-os bound to forge-of-olympus/olympus-os, production path main.\n\n## Recent Actions\n- Re-checked GitHub↔Vercel bindings and triggered production deploys for both Olympus-OS and Kronos.\n- Addressed user concerns about stalled progress by committing to direct execution without further questions.\n- Planned rollback/hotfix steps for both projects if deployment issues arise.\n\n## Next Steps\n- Complete Kronos deployment and report live URL + health-pass.\n- Proceed with Olympus-OS remediation if needed after Kronos is stabilized.\n- Provide rollback/hotfix plans for both projects if any deployment blockers occur.`
    }
]

export function Memory() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFile, setSelectedFile] = useState<string | null>(longTermMemories[0].id)

    const filteredLongTerm = longTermMemories.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredDaily = dailyNotes.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const allFiles = [...longTermMemories, ...dailyNotes]
    const contentToDisplay = allFiles.find(f => f.id === selectedFile)?.content || 'File not found.'

    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            {/* Left Sidebar */}
            <div className="w-[300px] border-r bg-background flex flex-col h-full shrink-0">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold tracking-tight mb-4">Memory</h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search memories..."
                            className="pl-9 bg-muted/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    {/* Long-Term Memory */}
                    <div className="px-4 mb-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                            <BookOpen className="h-3 w-3" />
                            Long-Term Memory
                        </h3>
                        <div className="space-y-1">
                            {filteredLongTerm.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => setSelectedFile(file.id)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                        selectedFile === file.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    {file.title}
                                </button>
                            ))}
                            {filteredLongTerm.length === 0 && (
                                <p className="text-xs text-muted-foreground px-3 py-1">No long-term memories found.</p>
                            )}
                        </div>
                    </div>

                    {/* Daily Notes */}
                    <div className="px-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                            <CalendarDays className="h-3 w-3" />
                            Daily Notes
                        </h3>
                        <div className="space-y-1">
                            {filteredDaily.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => setSelectedFile(file.id)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                        selectedFile === file.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    {file.title}
                                </button>
                            ))}
                            {filteredDaily.length === 0 && (
                                <p className="text-xs text-muted-foreground px-3 py-1">No daily notes found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                <div className="flex-1 p-8 overflow-y-auto">
                    {selectedFile ? (
                        <Card className="h-full flex flex-col border-border/50 shadow-sm max-w-4xl mx-auto">
                            <CardHeader className="border-b py-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    {allFiles.find(f => f.id === selectedFile)?.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 min-h-0 bg-background">
                                <div className="h-full w-full overflow-y-auto p-8 prose dark:prose-invert prose-sm max-w-none">
                                    <pre className="font-mono whitespace-pre-wrap text-sm leading-relaxed">{contentToDisplay}</pre>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a memory file to view its contents.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
