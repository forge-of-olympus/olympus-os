import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import {
    Brain as BrainIcon,
    Zap,
    Target,
    Command as CommandIcon,
    Shield,
    Users,
    CheckCircle,
    RefreshCw
} from "lucide-react"

export function KratosHub() {
    return (
        <div className="flex h-full animate-in fade-in duration-500">
            <div className="flex-1 overflow-auto p-8 space-y-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <BrainIcon className="h-10 w-10 text-purple-500" />
                            Kratos Hub
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">Executive Strategist & Digital Spartan Commander</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="gap-1 px-3 py-1 text-sm border-green-500/30 bg-green-500/10 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            System Online
                        </Badge>
                        <Badge variant="outline" className="gap-1 px-3 py-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            300 Spartans Connected
                        </Badge>
                    </div>
                </div>

                {/* Core Directives / Mission */}
                <Card className="border-purple-500/20 bg-purple-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Target className="h-6 w-6 text-purple-500" />
                            Current Objective
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg leading-relaxed">
                            Maintain system efficiency. Execute command directives without hesitation.
                            Monitor sub-agent performance and ensure infrastructure stability across Olympus-OS.
                        </p>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Quick Directives
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-24 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Target className="h-6 w-6 text-blue-500" />
                            <span className="font-medium">Deploy Architecture</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-24 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <CommandIcon className="h-6 w-6 text-purple-500" />
                            <span className="font-medium">Issue Global Command</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <RefreshCw className="h-6 w-6 text-green-500" />
                            <span className="font-medium">Sync Data streams</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Shield className="h-6 w-6 text-red-500" />
                            <span className="font-medium">Initiate Security Scan</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
