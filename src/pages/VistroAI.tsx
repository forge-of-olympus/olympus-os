import * as React from "react"
import { Plus, Search, Image, Film, FileText, Send, Paperclip, ChevronDown, PanelLeft, MoreHorizontal, Pin, Archive, Trash2, Edit2, Copy, ThumbsUp, ThumbsDown, Share, RotateCcw, Check, Zap, Download } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import { useAI } from "@/contexts/AIContext"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon } from "lucide-react"
import { AIShareModal } from "@/components/layout/AIShareModal"
import { AIMoreActionsMenu } from "@/components/layout/AIMoreActionsMenu"
import type { AIMessage } from "@/lib/services/ai-chat-history-service"

const availableModels = [
    { id: "gemini-3-flash", name: "Gemini 3 Flash" },
    { id: "claude-4.6-sonnet", name: "Claude 4.6 Sonnet" },
    { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro" },
    { id: "gpt-5.3-codex", name: "GPT 5.3 Codex" },
    { id: "claude-4.6-opus", name: "Claude 4.6 Opus" },
    { id: "openrouter-free", name: "Openrouter/free" },
    { id: "perplexity-sonar", name: "Perplexity Sonar" }
]

export function VistroAI() {
    const { theme, setTheme } = useTheme()
    const {
        currentChatId,
        messages,
        chatHistory,
        isLoading,
        sendMessage,
        loadChat,
        createNewChat,
        renameChat,
        pinChat,
        archiveChat,
        deleteChat,
        logFeedback,
        connectedModels,
        activeContext,
        setActiveContext
    } = useAI()
    const [input, setInput] = React.useState("")
    const [selectedModel, setSelectedModel] = React.useState("gemini-3-flash")
    const [showMoreModels, setShowMoreModels] = React.useState(false)
    const [sidebarBehavior, setSidebarBehavior] = React.useState("expand")
    const [editingChatId, setEditingChatId] = React.useState<string | null>(null)
    const [editingTitle, setEditingTitle] = React.useState("")
    const [copiedId, setCopiedId] = React.useState<string | null>(null)
    const [feedbackIds, setFeedbackIds] = React.useState<Record<string, 'good' | 'bad'>>({})
    const [shareModalOpen, setShareModalOpen] = React.useState(false)
    const [shareContent, setShareContent] = React.useState({ user: "", ai: "" })
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)

    // Derived state for local UI toggle
    const chatWithKratos = activeContext === 'kratos'

    // Function to toggle Kratos mode
    const toggleKratos = (active: boolean) => {
        setActiveContext(active ? 'kratos' : 'general')
        // When switching to general, we might want to ensure a valid model is selected or load last general chat
        // For now, context handles loading Kratos chat on switch.
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return
        const content = input.trim()
        setInput("")

        if (chatWithKratos) {
            // Handle Kratos chat directly
            await sendMessage(content, "kratos")
        } else {
            await sendMessage(content, selectedModel)
        }
    }

    // Filter chat history based on active context
    const filteredHistory = chatHistory.filter(chat => {
        if (activeContext === 'kratos') {
            return chat.model === 'kratos'
        } else {
            return chat.model !== 'kratos'
        }
    })

    const handleChatClick = async (chatId: string) => {
        await loadChat(chatId)
    }

    const handleRenameStart = (chatId: string, currentTitle: string) => {
        setEditingChatId(chatId)
        setEditingTitle(currentTitle)
    }

    const handleRenameSubmit = async (chatId: string) => {
        if (editingTitle.trim()) {
            await renameChat(chatId, editingTitle.trim())
        }
        setEditingChatId(null)
        setEditingTitle("")
    }

    const handlePinToggle = async (chatId: string, isPinned: boolean) => {
        await pinChat(chatId, !isPinned)
    }

    const handleArchive = async (chatId: string) => {
        await archiveChat(chatId, true)
    }

    const handleDelete = async (chatId: string) => {
        if (confirm("Are you sure you want to delete this chat?")) {
            await deleteChat(chatId)
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

    const getModelName = (id: string) => {
        return availableModels.find(m => m.id === id)?.name || id
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen overflow-hidden flex-col w-full">
                {/* Header with Model Selector */}
                <div className="z-50 border-b bg-background flex-none">
                    <header className="w-full bg-background">
                        <div className="flex h-16 items-center px-4">
                            {/* Left side - Logo & Model Selector */}
                            <div className="flex items-center gap-4">
                                <SidebarTrigger className="mr-2 md:hidden" />

                                <Link to="/" className="flex items-center gap-2">
                                    <img src="/Icons/swords.png" alt="Olympus-OS" className="h-8 w-auto" />
                                    <span className="font-semibold text-lg">Olympus-OS</span>
                                </Link>

                                {/* AI Model Selector */}
                                <div className="border-l border-border pl-4 hidden sm:block">
                                    <DropdownMenu onOpenChange={(open) => { if (!open) setShowMoreModels(false); }}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="gap-2 h-8">
                                                <span className="font-medium text-sm">
                                                    {availableModels.find(m => m.id === selectedModel)?.name || "Select Model"}
                                                </span>
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-56">
                                            {(showMoreModels ? availableModels : availableModels.slice(0, 3)).map(model => (
                                                <DropdownMenuItem
                                                    key={model.id}
                                                    onClick={() => { setSelectedModel(model.id); toggleKratos(false); }}
                                                    className="cursor-pointer flex items-center justify-between"
                                                >
                                                    <span>{model.name}</span>
                                                    {connectedModels[model.id] && (
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                            {!showMoreModels && availableModels.length > 3 && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer justify-center text-muted-foreground hover:text-foreground"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMoreModels(true); }}
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Kratos Communication */}
                                <div className="border-l border-border pl-4 hidden sm:block">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`gap-2 h-8 ${chatWithKratos ? 'bg-emerald-500/10 border border-emerald-500/30' : ''}`}
                                            >
                                                <span className="font-medium text-sm">{chatWithKratos ? '🪓 Kratos Active' : '🪓 Kratos'}</span>
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem
                                                className="cursor-pointer font-medium"
                                                onClick={() => toggleKratos(!chatWithKratos)}
                                            >
                                                {chatWithKratos ? '✓ Chatting with Kratos' : '🪓 Chat with Kratos'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer">
                                                Status: Online 🟢
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                300 Spartans Ready
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => window.location.href = '/brain'}
                                            >
                                                🧠 Open Brain Page
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />

                        </div>
                    </header>
                </div>

                <div className="flex flex-1 w-full overflow-hidden relative">
                    {/* Left Sidebar */}
                    <Sidebar
                        collapsible={sidebarBehavior === "open" ? "none" : "icon"}
                        className={cn(
                            "pt-0 mt-0 z-40 border-r transition-all duration-300 top-[calc(4rem+1px)] h-[calc(100vh-4rem-1px)]",
                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:hover:!w-[--sidebar-width]"
                        )}
                    >
                        <SidebarContent className="flex flex-col group-data-[collapsible=icon]:items-start pt-4">
                            <SidebarMenu className="gap-2 w-full">
                                <SidebarMenuItem className="w-full">
                                    <SidebarMenuButton
                                        onClick={createNewChat}
                                        className={cn(
                                            "transition-all duration-300 w-full justify-start pl-[14px]",
                                            "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[14px]",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[14px] big-data-[collapsible=icon]:group-hover:!mx-0"
                                        )}
                                    >
                                        <Plus className="h-5 w-5 shrink-0" />
                                        <span className={cn(
                                            "transition-opacity duration-300 whitespace-nowrap group-data-[collapsible=icon]:hidden",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:inline-block"
                                        )}>
                                            New chat
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem className="w-full">
                                    <SidebarMenuButton
                                        className={cn(
                                            "transition-all duration-300 w-full justify-start pl-[14px]",
                                            "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[14px]",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[14px] big-data-[collapsible=icon]:group-hover:!mx-0"
                                        )}
                                    >
                                        <Search className="h-5 w-5 shrink-0" />
                                        <span className={cn(
                                            "transition-opacity duration-300 whitespace-nowrap group-data-[collapsible=icon]:hidden",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:inline-block"
                                        )}>
                                            Search chats
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem className="w-full">
                                    <SidebarMenuButton
                                        className={cn(
                                            "transition-all duration-300 w-full justify-start pl-[14px]",
                                            "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[14px]",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[14px] big-data-[collapsible=icon]:group-hover:!mx-0"
                                        )}
                                    >
                                        <Image className="h-5 w-5 shrink-0" />
                                        <span className={cn(
                                            "transition-opacity duration-300 whitespace-nowrap group-data-[collapsible=icon]:hidden",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:inline-block"
                                        )}>
                                            Images
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem className="w-full">
                                    <SidebarMenuButton
                                        className={cn(
                                            "transition-all duration-300 w-full justify-start pl-[14px]",
                                            "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[14px]",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[14px] big-data-[collapsible=icon]:group-hover:!mx-0"
                                        )}
                                    >
                                        <Film className="h-5 w-5 shrink-0" />
                                        <span className={cn(
                                            "transition-opacity duration-300 whitespace-nowrap group-data-[collapsible=icon]:hidden",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:inline-block"
                                        )}>
                                            Video
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem className="w-full">
                                    <SidebarMenuButton
                                        className={cn(
                                            "transition-all duration-300 w-full justify-start pl-[14px]",
                                            "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[14px]",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[14px] big-data-[collapsible=icon]:group-hover:!mx-0"
                                        )}
                                    >
                                        <FileText className="h-5 w-5 shrink-0" />
                                        <span className={cn(
                                            "transition-opacity duration-300 whitespace-nowrap group-data-[collapsible=icon]:hidden",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:inline-block"
                                        )}>
                                            Files
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Your Chats Header */}
                                {chatHistory.length > 0 && (
                                    <div className="pt-4 pb-2 px-3">
                                        <p className={cn(
                                            "text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden text-left",
                                            sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:block"
                                        )}>
                                            {activeContext === 'kratos' ? 'Kratos History' : 'General History'}
                                        </p>
                                    </div>
                                )}

                                {filteredHistory.map((chat) => (
                                    <SidebarMenuItem key={chat.id} className="w-full group/item">
                                        <div className="flex items-center w-full relative">
                                            <SidebarMenuButton
                                                isActive={currentChatId === chat.id}
                                                onClick={() => handleChatClick(chat.id)}
                                                className={cn(
                                                    "transition-all duration-300 w-full justify-start pl-[10px]",
                                                    "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!mx-auto",
                                                    sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:!w-full group-data-[collapsible=icon]:group-hover:!justify-start group-data-[collapsible=icon]:group-hover:!pl-[10px] group-data-[collapsible=icon]:group-hover:!mx-0"
                                                )}
                                            >
                                                {/* Sparkles icon removed */}

                                                <div className={cn(
                                                    "flex flex-col items-start overflow-hidden ml-2 transition-opacity duration-300 group-data-[collapsible=icon]:hidden",
                                                    sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:flex"
                                                )}>
                                                    {editingChatId === chat.id ? (
                                                        <input
                                                            autoFocus
                                                            className="bg-transparent border-none outline-none w-full text-sm font-medium"
                                                            value={editingTitle}
                                                            onChange={(e) => setEditingTitle(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") handleRenameSubmit(chat.id)
                                                                if (e.key === "Escape") setEditingChatId(null)
                                                            }}
                                                            onBlur={() => handleRenameSubmit(chat.id)}
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium truncate w-full text-left">
                                                            {chat.title}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-muted-foreground truncate w-full text-left">
                                                        {new Date(chat.updatedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </SidebarMenuButton>

                                            {chat.isPinned && (
                                                <div className="absolute right-1 w-8 h-8 flex items-center justify-center pointer-events-none group-hover/item:opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:group-hover:flex">
                                                    <Pin className="h-3.5 w-3.5 text-muted-foreground/50 transition-colors" />
                                                </div>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 absolute right-1"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleRenameStart(chat.id, chat.title)}>
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handlePinToggle(chat.id, chat.isPinned)}>
                                                        <Pin className="h-4 w-4 mr-2" />
                                                        {chat.isPinned ? 'Unpin' : 'Pin'} Chat
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleArchive(chat.id)}>
                                                        <Archive className="h-4 w-4 mr-2" />
                                                        Archive
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(chat.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>

                        <SidebarFooter className="px-0 pt-2 pb-4 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!pb-4 group-data-[collapsible=icon]:!pt-2">
                            <div className={cn(
                                "flex items-center justify-between w-full group-data-[collapsible=icon]:px-0",
                                sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:justify-between"
                            )}>
                                <SidebarMenu className="w-auto">
                                    <SidebarMenuItem>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuButton
                                                    className={cn(
                                                        "transition-all duration-300 w-auto justify-start hover:bg-transparent pl-[6px] py-0 pr-0",
                                                        "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-start group-data-[collapsible=icon]:!pl-[6px]"
                                                    )}
                                                >
                                                    <div className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                                                        <PanelLeft className="h-5 w-5 shrink-0" />
                                                    </div>
                                                    <span className="sr-only">Sidebar Behavior</span>
                                                </SidebarMenuButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="top" align="start" className="w-[--sidebar-width]">
                                                <DropdownMenuLabel>Sidebar Behavior</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup value={sidebarBehavior} onValueChange={setSidebarBehavior}>
                                                    <DropdownMenuRadioItem value="expand">Expand on hover</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="open">Expanded</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="closed">Collapsed</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuItem>
                                </SidebarMenu>

                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className={cn(
                                        "flex items-center justify-start pr-[6px] group-data-[collapsible=icon]:hidden",
                                        sidebarBehavior === "expand" && "group-data-[collapsible=icon]:group-hover:flex"
                                    )}
                                    title="Toggle Theme"
                                >
                                    <div className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                                        {theme === 'dark' ? (
                                            <Sun className="h-5 w-5 shrink-0" />
                                        ) : (
                                            <Moon className="h-5 w-5 shrink-0" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>

                    {/* Main Chat Area */}
                    <main className="flex-1 overflow-hidden w-full flex flex-col pt-4">
                        <TooltipProvider>
                            {messages.length === 0 ? (
                                // Empty state - centered input
                                <div className="flex-1 flex flex-col items-center justify-center px-4">
                                    <div className="w-full max-w-3xl">
                                        <h1 className="text-4xl font-semibold mb-8 text-center">What can I help with?</h1>

                                        {/* Centered Input */}
                                        <div className="relative flex items-center gap-2 bg-muted rounded-full px-4 py-3 border border-border focus-within:border-primary transition-colors shadow-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handleSendMessage()
                                                    }
                                                }}
                                                placeholder={chatWithKratos ? "Message Kratos..." : "Message VistroAI..."}
                                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                                                disabled={isLoading}
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                disabled={!input.trim() || isLoading}
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <p className="text-[10px] text-muted-foreground text-center mt-3">
                                            VistroAI can make mistakes. Check important info.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // Conversation view
                                <>
                                    {/* Messages Area */}
                                    <ScrollArea ref={scrollAreaRef} className="flex-1">
                                        <div className="max-w-3xl mx-auto px-4 pb-8 pt-20">
                                            <div className="space-y-6">
                                                {messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={cn(
                                                            "flex gap-3",
                                                            message.role === "user" ? "justify-end" : "justify-start"
                                                        )}
                                                    >
                                                        {/* Assistant icon removed per request */}

                                                        <div className="flex flex-col gap-2 max-w-[80%]">
                                                            <div
                                                                className={cn(
                                                                    "rounded-2xl px-4 py-3",
                                                                    message.role === "user" ? "bg-muted" : ""
                                                                )}
                                                            >
                                                                {/* Render message text (strip image data tokens) */}
                                                                <p className="text-sm whitespace-pre-wrap">
                                                                    {message.content
                                                                        .replace(/\[IMAGE_DATA:[^\]]+\]/g, '')
                                                                        .replace(/\[IMAGE\]/g, '')
                                                                        .replace(/\[VIDEO\]/g, '')
                                                                        .replace(/\[FILE\]/g, '')
                                                                        .trim()
                                                                    }
                                                                </p>

                                                                {/* Artifact Rendering */}
                                                                {message.role === "assistant" && (
                                                                    <div className="mt-3 space-y-3">
                                                                        {/* Real Image Preview from Nano Banana Pro */}
                                                                        {message.content.match(/\[IMAGE_DATA:([^:]+):([^\]]+)\]/) && (() => {
                                                                            const match = message.content.match(/\[IMAGE_DATA:([^:]+):([^\]]+)\]/)
                                                                            if (!match) return null
                                                                            const mimeType = match[1]
                                                                            const base64 = match[2]
                                                                            const dataUrl = `data:${mimeType};base64,${base64}`
                                                                            return (
                                                                                <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                                                                                    <div className="relative group">
                                                                                        <img
                                                                                            src={dataUrl}
                                                                                            alt="AI Generated Image"
                                                                                            className="w-full h-auto max-h-[500px] object-contain bg-zinc-900"
                                                                                        />
                                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                                                            <p className="text-[10px] text-white">Generated by Nano Banana Pro • AI Image</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="p-2 flex items-center justify-between border-t border-border/50 bg-background/50">
                                                                                        <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                                                                                            <Zap className="h-3 w-3" /> Nano Banana Pro
                                                                                        </span>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-6 w-6"
                                                                                            onClick={() => {
                                                                                                const link = document.createElement('a')
                                                                                                link.href = dataUrl
                                                                                                link.download = `nano-banana-${Date.now()}.png`
                                                                                                link.click()
                                                                                            }}
                                                                                        >
                                                                                            <Download className="h-3 w-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })()}

                                                                        {/* Fallback [IMAGE] placeholder (no actual image data) */}
                                                                        {message.content.includes("[IMAGE]") && !message.content.includes("[IMAGE_DATA:") && (
                                                                            <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                                                                                <div className="aspect-video bg-zinc-900 flex items-center justify-center relative group">
                                                                                    <Image className="h-8 w-8 text-emerald-500/50" />
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                                                        <p className="text-[10px] text-white">Generated Spartan Artifact: 1240x720.png</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="p-2 flex items-center justify-between border-t border-border/50 bg-background/50">
                                                                                    <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                                                                                        <Zap className="h-3 w-3" /> Saved to Images
                                                                                    </span>
                                                                                    <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {message.content.includes("[VIDEO]") && (
                                                                            <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                                                                                <div className="aspect-video bg-zinc-900 flex items-center justify-center relative group">
                                                                                    <Film className="h-8 w-8 text-blue-500/50" />
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                                                        <p className="text-[10px] text-white">Generated by Veo 3.1 • AI Video</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="p-2 flex items-center justify-between border-t border-border/50 bg-background/50">
                                                                                    <span className="text-[10px] font-medium text-blue-500 flex items-center gap-1">
                                                                                        <Zap className="h-3 w-3" /> Veo 3.1
                                                                                    </span>
                                                                                    <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {message.content.includes("[FILE]") && (
                                                                            <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/30 p-3 flex items-center gap-3">
                                                                                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                                                    <FileText className="h-5 w-5 text-indigo-500" />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <p className="text-[12px] font-medium">Research_Report.pdf</p>
                                                                                    <p className="text-[10px] text-muted-foreground">3.2 MB • PDF Document</p>
                                                                                </div>
                                                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {message.role === "assistant" && (
                                                                <div className="flex items-center gap-1.5 px-0 ml-2.5">
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
                                                                                onClick={() => sendMessage(messages[messages.findIndex(m => m.id === message.id) - 1]?.content || "", selectedModel)}
                                                                            >
                                                                                <RotateCcw className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="bottom" className="flex flex-col items-center text-[10px]">
                                                                            <span>Try Again</span>
                                                                            <span className="text-[9px] text-muted-foreground mt-0.5">{chatWithKratos ? '🪓 Kratos' : 'AI: ' + getModelName(selectedModel)}</span>
                                                                        </TooltipContent>
                                                                    </Tooltip>

                                                                    <AIMoreActionsMenu
                                                                        messageContent={message.content}
                                                                        timestamp={message.timestamp}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* User avatar removed per request */}

                                                    </div>
                                                ))}
                                                {isLoading && (
                                                    <div className="flex gap-1 py-3 px-1">
                                                        <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                                                        <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                                                        <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                                                    </div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </div>
                                    </ScrollArea>

                                    {/* Input Area - Fixed at bottom */}
                                    <div className="p-4 bg-background">
                                        <div className="max-w-3xl mx-auto">
                                            <div className="relative flex items-center gap-2 bg-muted rounded-3xl px-4 py-2 border border-border focus-within:border-primary transition-colors">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                >
                                                    <Paperclip className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    value={input}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault()
                                                            handleSendMessage()
                                                        }
                                                    }}
                                                    placeholder="Message VistroAI"
                                                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    disabled={isLoading}
                                                />
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={!input.trim() || isLoading}
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </TooltipProvider>
                    </main>
                </div>
            </div>
            <AIShareModal
                open={shareModalOpen}
                onOpenChange={setShareModalOpen}
                userMessage={shareContent.user}
                aiMessage={shareContent.ai}
            />
        </SidebarProvider>
    )
}
