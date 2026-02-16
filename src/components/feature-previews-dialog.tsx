import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const features = [
    {
        id: "branching-dashboard",
        title: "Branching via dashboard",
        status: "new",
        description: "Create branches, review changes, and merge back into production all through the dashboard. Read the below limitations and our branching documentation before opting in.",
        image: "/placeholder-feature.png",
        limitations: [
            "Branching is currently in beta and may have some limitations",
            "Some features may not be available in all regions",
            "Performance may vary based on project size",
        ],
    },
    {
        id: "advisor-rules",
        title: "Disable Advisor rules",
        status: null,
        description: "Customize which Advisor rules are enabled for your project.",
        image: null,
        limitations: [],
    },
    {
        id: "api-docs",
        title: "Project API documentation",
        status: null,
        description: "Auto-generated API documentation for your project endpoints.",
        image: null,
        limitations: [],
    },
    {
        id: "column-privileges",
        title: "Column-level privileges",
        status: null,
        description: "Set granular permissions at the column level for enhanced security.",
        image: null,
        limitations: [],
    },
]

interface FeaturePreviewsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FeaturePreviewsDialog({ open, onOpenChange }: FeaturePreviewsDialogProps) {
    const [selectedFeature, setSelectedFeature] = useState(features[0])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Dashboard feature previews</DialogTitle>
                </DialogHeader>

                <div className="flex h-[calc(85vh-73px)]">
                    {/* Left sidebar - Feature list */}
                    <div className="w-64 border-r bg-muted/20 p-4">
                        <ScrollArea className="h-full">
                            <div className="space-y-1">
                                {features.map((feature) => (
                                    <button
                                        key={feature.id}
                                        onClick={() => setSelectedFeature(feature)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedFeature.id === feature.id
                                            ? "bg-background shadow-sm"
                                            : "hover:bg-background/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{feature.title}</span>
                                            {feature.status === "new" && (
                                                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                                                    NEW
                                                </Badge>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right content - Feature details */}
                    <div className="flex-1 p-6">
                        <ScrollArea className="h-full">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{selectedFeature.title}</h3>
                                            {selectedFeature.status === "new" && (
                                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                                                    NEW
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{selectedFeature.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Give feedback
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Enable feature
                                        </Button>
                                    </div>
                                </div>

                                {selectedFeature.image && (
                                    <div className="rounded-lg border bg-muted/50 overflow-hidden">
                                        <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                                            <div className="text-center p-8">
                                                <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto border border-slate-700">
                                                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                                                        <span>Merge</span>
                                                        <span className="text-blue-400">Branchla</span>
                                                        <span>into</span>
                                                        <span className="text-slate-300">main</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mb-4">Review requested 3 hours ago</div>
                                                    <div className="flex gap-4 text-xs border-b border-slate-700 pb-2 mb-4">
                                                        <span className="text-slate-300">Database</span>
                                                        <span className="text-slate-500">Edge Functions</span>
                                                    </div>
                                                    <div className="bg-slate-900 rounded p-3 text-left">
                                                        <div className="text-xs text-slate-400 mb-2">SCHEMA CHANGES</div>
                                                        <div className="font-mono text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                                                            + ALTER TABLE "public"."reviews" DROP COLUMN "rating"
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-4 max-w-lg">
                                                    Create branches, review changes, and merge back into production all through the dashboard. Read the below{" "}
                                                    <span className="underline">limitations and our branching documentation</span> before opting in.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedFeature.limitations.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Limitations:</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {selectedFeature.limitations.map((limitation, index) => (
                                                <li key={index}>{limitation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
