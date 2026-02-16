import {
    MoreHorizontal,
    Flag,
    GitBranch,
    Volume2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface AIMoreActionsMenuProps {
    messageContent: string
    timestamp: string | Date | number
}

export function AIMoreActionsMenu({ messageContent, timestamp }: AIMoreActionsMenuProps) {
    const messageDate = new Date(timestamp)

    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const isToday = date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()

        const day = isToday ? "Today" : new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)

        const time = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(date)

        return `${day}, ${time}`
    }

    const handleReadAloud = () => {
        const utterance = new SpeechSynthesisUtterance(messageContent)
        window.speechSynthesis.speak(utterance)
    }

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/70 hover:text-foreground transition-colors outline-none focus:ring-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">More Actions</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="start" className="w-56 p-2 rounded-2xl shadow-xl border-border bg-background/95 backdrop-blur-sm">
                <div className="px-2 py-1 flex flex-col gap-0.5 mb-1">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                        {formatTimestamp(messageDate)}
                    </span>
                </div>

                <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 py-2">
                    <GitBranch className="h-3.5 w-3.5" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium leading-none">Branch in new chat</span>
                        <span className="text-[9px] text-muted-foreground leading-none tracking-tight">Continue from this point</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleReadAloud} className="rounded-xl cursor-pointer gap-2 py-2">
                    <Volume2 className="h-3.5 w-3.5" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium leading-none">Read aloud</span>
                        <span className="text-[9px] text-muted-foreground leading-none tracking-tight">Listen to the response</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 py-2 text-destructive focus:text-destructive">
                    <Flag className="h-3.5 w-3.5" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium leading-none">Report Issue</span>
                        <span className="text-[9px] text-destructive/70 leading-none tracking-tight">Flag as inaccurate or harmful</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
