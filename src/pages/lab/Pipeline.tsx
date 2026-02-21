import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { GitMerge, ArrowRight, Bot, Database, Globe, CheckCircle2, Play, Settings } from "lucide-react"

export function Pipeline() {
    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <GitMerge className="h-10 w-10 text-blue-500" />
                            Pipeline Builder
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">Design and monitor multi-stage agent workflows</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Global Config
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <Play className="h-4 w-4" />
                            Run Pipeline
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Active Pipeline View */}
                    <Card className="border-blue-500/20 shadow-lg">
                        <CardHeader className="bg-blue-500/5 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        Content Generation Flow
                                    </CardTitle>
                                    <CardDescription>A 3-stage pipeline for researching and drafting blog content.</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 gap-1 border-blue-500/30">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Ready
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 overflow-x-auto">
                            <div className="min-w-[800px] flex items-center justify-between relative">
                                {/* Connecting Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0"></div>

                                {/* Node 1 */}
                                <div className="relative z-10 w-64">
                                    <Card className="border-2 border-muted hover:border-blue-500/50 transition-colors bg-background">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="secondary" className="text-[10px] uppercase">Stage 1</Badge>
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardTitle className="text-lg">Web Research</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                            Scrapes top 5 search results for the given topic and extracts key entities.
                                        </CardContent>
                                    </Card>
                                </div>

                                <ArrowRight className="h-6 w-6 text-muted-foreground z-10 shrink-0 mx-4" />

                                {/* Node 2 */}
                                <div className="relative z-10 w-64">
                                    <Card className="border-2 border-blue-500 bg-background shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge className="text-[10px] uppercase bg-blue-500 text-white">Stage 2</Badge>
                                                <Bot className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <CardTitle className="text-lg">Drafting Agent</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                            Uses research context to generate a 1500-word draft following strict brand guidelines.
                                        </CardContent>
                                    </Card>
                                </div>

                                <ArrowRight className="h-6 w-6 text-muted-foreground z-10 shrink-0 mx-4" />

                                {/* Node 3 */}
                                <div className="relative z-10 w-64">
                                    <Card className="border-2 border-muted hover:border-blue-500/50 transition-colors bg-background">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="secondary" className="text-[10px] uppercase">Stage 3</Badge>
                                                <Database className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardTitle className="text-lg">Memory Committal</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                            Saves the final draft to Long-Term Memory and logs the action in Daily Notes.
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pipeline Library (Placeholder) */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                            Saved Pipelines
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-dashed border-border/50">
                                <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                    <span className="font-medium">Social Media Auto-replier</span>
                                    <span className="text-xs mt-1">2 Stages</span>
                                </CardContent>
                            </Card>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-dashed border-border/50">
                                <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                    <span className="font-medium">Lead Enrichment Flow</span>
                                    <span className="text-xs mt-1">4 Stages</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
