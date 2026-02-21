import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Play, Bug, Settings2, Plus, GripVertical } from "lucide-react"

export function Workbench() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [isSimulating, setIsSimulating] = useState(false)

    const handleSimulate = () => {
        if (!input.trim()) return
        setIsSimulating(true)
        setTimeout(() => {
            setOutput(`[Simulated Output]\nProcessed input: "${input}"\nTokens used: 142\nLatency: 840ms\nStatus: Success`)
            setIsSimulating(false)
        }, 1500)
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <FlaskConical className="h-10 w-10 text-primary" />
                            Workbench
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">Agent Sandbox & Prototyping Environment</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-14rem)] pb-8">
                    {/* Left Column: Configuration & Input */}
                    <Card className="flex flex-col h-full border-primary/20 bg-primary/5">
                        <CardHeader className="bg-background/50 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Settings2 className="h-5 w-5 text-primary" />
                                    Agent Prototype Alpha
                                </CardTitle>
                                <Badge variant="outline" className="bg-primary/10 text-primary">v0.1.0-alpha</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-6 space-y-6 overflow-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground">System Prompt</label>
                                    <Textarea
                                        defaultValue="You are a helpful prototype agent. Your goal is to analyze user requests and extract structured JSON data."
                                        className="h-24 bg-background border-primary/20 font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 flex items-center justify-between text-muted-foreground">
                                        Active Tools
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                            <Plus className="h-3 w-3 mr-1" /> Add Tool
                                        </Button>
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-primary/10">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">web_search</span>
                                            <Badge variant="secondary" className="ml-auto text-[10px]">Active</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-primary/10">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">read_memory</span>
                                            <Badge variant="secondary" className="ml-auto text-[10px]">Active</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-end mt-4">
                                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Test Input</label>
                                <Textarea
                                    placeholder="Enter test prompt to simulate sub-agent execution..."
                                    className="h-32 bg-background border-primary/20 resize-none mb-4"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <Button
                                    className="w-full gap-2"
                                    onClick={handleSimulate}
                                    disabled={!input.trim() || isSimulating}
                                >
                                    {isSimulating ? <Bug className="h-4 w-4 animate-bounce" /> : <Play className="h-4 w-4" />}
                                    {isSimulating ? "Simulating execution..." : "Run Simulation"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Execution Output */}
                    <Card className="flex flex-col h-full bg-muted/20">
                        <CardHeader className="border-b bg-background/50">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                Output Console
                                {output && <Badge variant="outline" className="text-[10px] uppercase">Success</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden bg-black/90 text-green-400 font-mono text-sm">
                            <div className="h-full p-6 overflow-auto whitespace-pre-wrap leading-relaxed">
                                {output || (
                                    <div className="text-green-400/30 flex flex-col items-center justify-center h-full gap-4 text-center">
                                        <Bug className="h-12 w-12" />
                                        <p>Awaiting execution...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
