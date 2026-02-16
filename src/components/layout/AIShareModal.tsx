import { Twitter, Linkedin, MessageSquare, Link as LinkIcon, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIShareModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userMessage: string
    aiMessage: string
}

export function AIShareModal({ open, onOpenChange, userMessage, aiMessage }: AIShareModalProps) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-background border-none shadow-2xl rounded-3xl [&>button]:hidden">
                <div className="p-8 space-y-8 flex flex-col h-full max-h-[85vh]">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <DialogTitle className="text-xl font-semibold tracking-tight leading-none">
                            {userMessage.split('\n')[0].length > 40 ? userMessage.slice(0, 40) + '...' : userMessage.split('\n')[0]}
                        </DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>

                    <div className="relative group flex-1">
                        <div className="rounded-3xl border bg-muted/30 p-8 h-[450px] flex flex-col justify-between transition-all hover:bg-muted/40">
                            <ScrollArea className="flex-1 pr-4 -mr-4">
                                <div className="space-y-6">
                                    <p className="text-base font-medium text-muted-foreground italic leading-relaxed">
                                        "{userMessage}"
                                    </p>
                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                        {aiMessage}
                                    </p>
                                </div>
                            </ScrollArea>

                            <div className="flex justify-end pt-6">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/logo-black.png"
                                        alt="Vistro"
                                        className="h-8 w-auto block dark:hidden object-contain"
                                    />
                                    <img
                                        src="/logo-white.png"
                                        alt="Vistro"
                                        className="h-8 w-auto hidden dark:block object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 pt-2">
                        <button
                            onClick={handleCopyLink}
                            className="flex flex-col items-center gap-2 group transition-all"
                        >
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 group-hover:scale-105 transition-all shadow-sm border">
                                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Copy Link</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 group transition-all">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 group-hover:scale-105 transition-all shadow-sm border">
                                <Twitter className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">X</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 group transition-all">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 group-hover:scale-105 transition-all shadow-sm border">
                                <Linkedin className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">LinkedIn</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 group transition-all">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 group-hover:scale-105 transition-all shadow-sm border">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reddit</span>
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
