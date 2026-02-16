import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { FlaskConical } from "lucide-react"

export function Lab() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <FlaskConical className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Experimental Lab</h1>
            </div>
            <p className="text-muted-foreground">Test new features and experimental agents here.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle>Agent Prototype Alpha</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">Testing new autonomous capabilities.</p>
                    </CardContent>
                </Card>
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle>Tool Sandbox</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">Isolated environment for custom tool testing.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
