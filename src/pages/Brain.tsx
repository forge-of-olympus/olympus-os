import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function Brain() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Vistro Brain</h1>
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>Neural Network Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Visualization placeholder</p>
                    </CardContent>
                </Card>
                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>Knowledge Base</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                            <li>Documentation</li>
                            <li>API References</li>
                            <li>System Architecture</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
