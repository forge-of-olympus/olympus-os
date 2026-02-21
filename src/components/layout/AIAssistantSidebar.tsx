"use client"

import * as React from "react"
import {
    Plus,
    X,
    FileText,
    ChevronDown,
    ArrowUp,
    Sparkles,
    Search,
    Check,
    MoreVertical,
    Pencil,
    Trash2,
    Download,
    Activity,
    Database,
    Shield,
    Code,
    TableProperties,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Share,
    RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useAI } from "@/contexts/AIContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AIShareModal } from "./AIShareModal"
import { AIMoreActionsMenu } from "./AIMoreActionsMenu"
import type { AIMessage } from "@/lib/services/ai-chat-history-service"

// Types are now handled by AIContext and AIChatHistoryService

export function AIAssistantSidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const {
        currentChatId,
        messages,
        chatHistory,
        sendMessage,
        loadChat,
        createNewChat,
        renameChat,
        deleteChat,
        logFeedback
    } = useAI()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [inputValue, setInputValue] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [renamingChatId, setRenamingChatId] = React.useState<string | null>(null)
    const [renameValue, setRenameValue] = React.useState("")
    const [copiedId, setCopiedId] = React.useState<string | null>(null)
    const [feedbackIds, setFeedbackIds] = React.useState<Record<string, 'good' | 'bad'>>({})
    const [shareModalOpen, setShareModalOpen] = React.useState(false)
    const [shareContent, setShareContent] = React.useState({ user: "", ai: "" })
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages])


    const handleRenameChat = async () => {
        if (!renamingChatId || !renameValue.trim()) return
        try {
            await renameChat(renamingChatId, renameValue)
            setRenamingChatId(null)
            setRenameValue("")
        } catch (error) {
            console.error("Failed to rename chat:", error)
        }
    }

    const handleDeleteChat = async (chatId: string) => {
        if (!confirm("Are you sure you want to delete this chat?")) return
        try {
            await deleteChat(chatId)
        } catch (error) {
            console.error("Failed to delete chat:", error)
        }
    }

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleFeedback = async (messageId: string, type: 'good' | 'bad', content: string) => {
        await logFeedback(messageId, type, content)
        setFeedbackIds(prev => ({ ...prev, [messageId]: type }))
    }

    const handleShare = (message: AIMessage) => {
        const index = messages.findIndex(m => m.id === message.id)
        const userMsg = index > 0 ? messages[index - 1].content : "VistroAI Interaction"
        setShareContent({ user: userMsg, ai: message.content })
        setShareModalOpen(true)
    }

    const handleExportChat = async (chatId: string) => {
        try {
            const chat = chatHistory.find(c => c.id === chatId)
            // Use current messages if exporting the current chat, otherwise we'd need to fetch them
            const chatMessages = chatId === currentChatId ? messages : chat?.messages || []

            const exportData = {
                title: chat?.title || "Untitled Chat",
                model: chat?.model,
                created_at: chat?.createdAt,
                messages: chatMessages.map(m => ({
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp
                }))
            }

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${chat?.title || 'chat'}-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Failed to export chat:", error)
        }
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return
        const content = inputValue.trim()
        setInputValue("")
        setIsLoading(true)

        try {
            await sendMessage(content, "kratos")
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleIdeaClick = (idea: string) => {
        setInputValue(idea)
        textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            void handleSendMessage()
        }
    }

    const filteredChats = chatHistory.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getCurrentChatTitle = () => {
        if (!currentChatId) return "New chat"
        return chatHistory.find(chat => chat.id === currentChatId)?.title || "New chat"
    }

    const formatTimestamp = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 24) return "Today"
        if (diffInHours < 48) return "Yesterday"
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
        return date.toLocaleDateString()
    }

    // if (!open) return null // Removed to allow animation out, controlled by parent styles/state mostly, or we handle it here

    return (
        <aside
            className={`fixed right-0 top-[calc(4rem+1px)] bottom-0 w-[400px] sm:w-[450px] border-l bg-background z-40 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <TooltipProvider>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2 text-sm font-medium pl-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-md transition-colors">
                                    {getCurrentChatTitle()} <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 flex flex-col max-h-[450px]">
                                <div className="p-2 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search chats..."
                                            className="pl-8 h-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col border-b">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={createNewChat}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
                                        New chat
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                                        onClick={createNewChat}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Start a new chat
                                    </DropdownMenuItem>
                                </div>

                                <ScrollArea className="flex-1 overflow-y-auto">
                                    <div className="p-1">
                                        {filteredChats.map((chat) => (
                                            <div key={chat.id} className="group relative">
                                                <DropdownMenuItem
                                                    className="cursor-pointer flex-col items-start py-2 pr-8"
                                                    onClick={() => loadChat(chat.id)}
                                                >
                                                    <div className="flex items-center w-full">
                                                        <span className="truncate flex-1">{chat.title}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTimestamp(chat.updatedAt)}
                                                    </span>
                                                </DropdownMenuItem>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => {
                                                            setRenamingChatId(chat.id)
                                                            setRenameValue(chat.title)
                                                        }}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Rename
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleExportChat(chat.id)}>
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Export
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteChat(chat.id)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={createNewChat}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {messages.length === 0 ? (
                            <>


                                {/* Welcome & Ideas */}
                                <div className="space-y-6 pt-20">
                                    <h2 className="text-2xl font-semibold tracking-tight">How can I assist you?</h2>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">IDEAS</p>
                                        <div className="grid gap-2">
                                            <Button
                                                variant="ghost"
                                                className="justify-start h-auto py-2 px-3 font-normal text-muted-foreground hover:text-foreground text-xs"
                                                onClick={() => handleIdeaClick("Create a back-end")}
                                            >
                                                <FileText className="mr-3 h-4 w-4" />
                                                Create a back-end
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="justify-start h-auto py-2 px-3 font-normal text-muted-foreground hover:text-foreground text-xs"
                                                onClick={() => handleIdeaClick("Health check")}
                                            >
                                                <Activity className="mr-3 h-4 w-4" />
                                                Health check
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="justify-start h-auto py-2 px-3 font-normal text-muted-foreground hover:text-foreground text-xs"
                                                onClick={() => handleIdeaClick("Query your data")}
                                            >
                                                <Database className="mr-3 h-4 w-4" />
                                                Query your data
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="justify-start h-auto py-2 px-3 font-normal text-muted-foreground hover:text-foreground text-xs"
                                                onClick={() => handleIdeaClick("Set up RLS policies")}
                                            >
                                                <Shield className="mr-3 h-4 w-4" />
                                                Set up RLS policies
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="justify-start h-auto py-2 px-3 font-normal text-muted-foreground hover:text-foreground text-xs"
                                                onClick={() => handleIdeaClick("Create a function")}
                                            >
                                                <Code className="mr-3 h-4 w-4" />
                                                Create a function
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="justify-start h-auto py-2 px-3 font-normal text-muted-foreground hover:text-foreground text-xs"
                                                onClick={() => handleIdeaClick("Generate sample data")}
                                            >
                                                <TableProperties className="mr-3 h-4 w-4" />
                                                Generate sample data
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Chat Messages */}
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {/* Assistant icon removed */}

                                        <div className="flex flex-col gap-1.5 max-w-[85%]">
                                            <div
                                                className={cn(
                                                    "rounded-lg p-3",
                                                    message.role === "user" ? "bg-muted" : ""
                                                )}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                            {message.role === "assistant" && (
                                                <div className="flex items-center gap-1 px-0 ml-1.5">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-foreground/70 hover:text-foreground transition-colors"
                                                                onClick={() => handleCopy(message.content, message.id)}
                                                            >
                                                                {copiedId === message.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="text-[10px]">Copy</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={cn(
                                                                    "h-7 w-7 transition-colors",
                                                                    feedbackIds[message.id] === 'good' ? "text-green-500" : "text-foreground/70 hover:text-foreground"
                                                                )}
                                                                onClick={() => handleFeedback(message.id, 'good', message.content)}
                                                            >
                                                                <ThumbsUp className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="text-[10px]">Good Response</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={cn(
                                                                    "h-7 w-7 transition-colors",
                                                                    feedbackIds[message.id] === 'bad' ? "text-red-500" : "text-foreground/70 hover:text-foreground"
                                                                )}
                                                                onClick={() => handleFeedback(message.id, 'bad', message.content)}
                                                            >
                                                                <ThumbsDown className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="text-[10px]">Bad Response</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-foreground/70 hover:text-foreground transition-colors"
                                                                onClick={() => handleShare(message)}
                                                            >
                                                                <Share className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="text-[10px]">Share</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-foreground/70 hover:text-foreground transition-colors"
                                                                onClick={() => {
                                                                    const prevMsg = messages[messages.findIndex(m => m.id === message.id) - 1]
                                                                    if (prevMsg) setInputValue(prevMsg.content)
                                                                }}
                                                            >
                                                                <RotateCcw className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="flex flex-col items-center text-center text-[10px]">
                                                            <span>Copy</span>
                                                            <span className="text-[9px] text-muted-foreground mt-0.5">🪓 Kratos</span>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <AIMoreActionsMenu
                                                        messageContent={message.content}
                                                        timestamp={message.timestamp}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-1 py-3 px-1">
                                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-100" />
                                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-200" />
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </div>

                {/* Footer / Input Area */}
                <div className="p-4 border-t bg-background">
                    <div className="relative rounded-xl border bg-muted/20 focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all">
                        <Textarea
                            ref={textareaRef}
                            placeholder="Chat to Postgres..."
                            className="min-h-[60px] w-full resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-3 text-sm placeholder:text-muted-foreground shadow-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex items-center justify-between p-2 pt-0">
                            {/* Kratos - Always Active in Sidebar */}
                            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                                <span className="text-sm">🪓</span>
                                <span className="text-xs font-medium text-emerald-500">Kratos Active</span>
                            </div>
                            <Button
                                size="icon"
                                className="h-7 w-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-none"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Rename Chat Dialog */}
                <Dialog open={!!renamingChatId} onOpenChange={(open: boolean) => !open && setRenamingChatId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename Chat</DialogTitle>
                            <DialogDescription>
                                Give this conversation a new name
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="chat-name">Chat Name</Label>
                            <Input
                                id="chat-name"
                                name="chat-name"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRenameChat()
                                }}
                                className="mt-2"
                                placeholder="Enter chat name..."
                                autoComplete="off"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setRenamingChatId(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleRenameChat} disabled={!renameValue.trim()}>
                                Rename
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <AIShareModal
                    open={shareModalOpen}
                    onOpenChange={setShareModalOpen}
                    userMessage={shareContent.user}
                    aiMessage={shareContent.ai}
                />
            </TooltipProvider>
        </aside>
    )
}
