import { useEffect, useRef } from "react"
import { useAI } from "@/contexts/AIContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, Bot, User, Clock, Trash2, Search, Image, Film, FileText, Download, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"

export function Conversations() {
    const { chatHistory, currentChatId, loadChat, messages, deleteChat } = useAI()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleChatSelect = async (id: string) => {
        await loadChat(id)
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this chat history?")) {
            await deleteChat(id)
        }
    }

    const currentChat = chatHistory.find(c => c.id === currentChatId)

    return (
        <div className="flex h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            {/* Left Sidebar */}
            <div className="w-[300px] border-r bg-background flex flex-col h-full shrink-0">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold tracking-tight mb-4">Conversations</h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search history..."
                            className="pl-9 bg-muted/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Recent History
                        </h3>
                        <div className="space-y-1">
                            {chatHistory.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleChatSelect(chat.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-3 rounded-md text-sm transition-colors cursor-pointer group",
                                        currentChatId === chat.id
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                            currentChatId === chat.id ? "bg-background border-primary/20 text-primary" : "bg-muted border-transparent"
                                        )}>
                                            {/* Distinguish Kratos chats visually */}
                                            {chat.model === 'kratos' ? (
                                                <span className="text-sm">🪓</span>
                                            ) : (
                                                <MessageSquare className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden text-left">
                                            <span className="font-medium truncate">{chat.title}</span>
                                            <span className="text-[10px] text-muted-foreground truncate font-normal mt-0.5 flex items-center gap-1">
                                                {chat.model === 'kratos' && <span className="text-emerald-500 font-semibold text-[9px]">KRATOS</span>}
                                                <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive shrink-0"
                                        onClick={(e) => handleDelete(e, chat.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {chatHistory.length === 0 && (
                                <p className="text-xs text-muted-foreground px-3 py-2 text-center">No conversation history.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                <div className="flex-1 p-8 overflow-hidden flex flex-col">
                    {currentChatId ? (
                        <Card className="flex-1 flex flex-col border-border/50 shadow-sm max-w-5xl mx-auto w-full">
                            <CardHeader className="border-b py-4 bg-background">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                    {currentChat?.title || "Conversation"}
                                </CardTitle>
                                <CardDescription>
                                    Last updated: {currentChat ? new Date(currentChat.updatedAt).toLocaleString() : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden bg-background">
                                <ScrollArea className="h-full px-6 py-6">
                                    <div className="space-y-6">
                                        {messages.map((msg, idx) => (
                                            <div
                                                key={msg.id || idx}
                                                className={cn(
                                                    "flex gap-4 max-w-[85%]",
                                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                                    msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                                </div>
                                                <div className={cn(
                                                    "rounded-2xl px-5 py-3 text-sm",
                                                    msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                                                )}>
                                                    <pre className="whitespace-pre-wrap font-sans font-medium leading-relaxed">
                                                        {msg.content
                                                            .replace(/\[IMAGE_DATA:[^\]]+\]/g, '')
                                                            .replace(/\[IMAGE\]/g, '')
                                                            .replace(/\[VIDEO\]/g, '')
                                                            .replace(/\[FILE\]/g, '')
                                                            .trim()
                                                        }
                                                    </pre>

                                                    {/* Artifact Rendering */}
                                                    {msg.role === "assistant" && (
                                                        <div className="mt-3 space-y-3">
                                                            {/* Real Image Preview */}
                                                            {msg.content.match(/\[IMAGE_DATA:([^:]+):([^\]]+)\]/) && (() => {
                                                                const match = msg.content.match(/\[IMAGE_DATA:([^:]+):([^\]]+)\]/)
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

                                                            {/* Fallback [IMAGE] placeholder */}
                                                            {msg.content.includes("[IMAGE]") && !msg.content.includes("[IMAGE_DATA:") && (
                                                                <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                                                                    <div className="aspect-video bg-zinc-900 flex items-center justify-center relative group">
                                                                        <Image className="h-8 w-8 text-emerald-500/50" />
                                                                    </div>
                                                                    <div className="p-2 flex items-center justify-between border-t border-border/50 bg-background/50">
                                                                        <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                                                                            <Zap className="h-3 w-3" /> Saved to Images
                                                                        </span>
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {/* Video Preview */}
                                                            {msg.content.includes("[VIDEO]") && (
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
                                                            {/* File Preview */}
                                                            {msg.content.includes("[FILE]") && (
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
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full rounded-lg border border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center text-center p-8">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium">No conversation selected</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                Select a chat from your history in the sidebar to view the full conversation thread.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
