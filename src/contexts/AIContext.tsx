import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AIChatHistoryService } from '../lib/services/ai-chat-history-service'
import type { AIMessage, ChatHistoryItem } from '../lib/services/ai-chat-history-service'
import { useAuth } from '@/components/auth-provider'

interface AIContextType {
    currentChatId: string | null
    messages: AIMessage[]
    chatHistory: ChatHistoryItem[]
    isLoading: boolean
    isSaving: boolean
    activeContext: 'kratos' | 'general' // Track which context is active

    // Actions
    sendMessage: (content: string, model: string) => Promise<void>
    loadChat: (chatId: string) => Promise<void>
    createNewChat: () => void
    saveCurrentChat: () => Promise<void>
    refreshChatHistory: () => Promise<void>
    setActiveContext: (context: 'kratos' | 'general') => void // Switcher

    // Chat management
    renameChat: (chatId: string, title: string) => Promise<void>
    pinChat: (chatId: string, isPinned: boolean) => Promise<void>
    archiveChat: (chatId: string, isArchived: boolean) => Promise<void>
    deleteChat: (chatId: string) => Promise<void>
    logFeedback: (messageId: string, type: 'good' | 'bad', content: string) => Promise<void>

    // Model Connections
    connectedModels: Record<string, boolean>
    modelConfigs: Record<string, { apiKey?: string; temperature?: number; maxTokens?: number; isAgentic?: boolean }>
    updateModelConnection: (modelId: string, isConnected: boolean, config: any) => Promise<void>
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export const useAI = () => {
    const context = useContext(AIContext)
    if (!context) {
        throw new Error('useAI must be used within AIContextProvider')
    }
    return context
}

export const AIContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth()
    const [currentChatId, setCurrentChatId] = useState<string | null>(null)
    const [messages, setMessages] = useState<AIMessage[]>([])
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [activeContext, setActiveContext] = useState<'kratos' | 'general'>('general')

    // Model Connections State
    const [connectedModels, setConnectedModels] = useState<Record<string, boolean>>({})
    const [modelConfigs, setModelConfigs] = useState<Record<string, any>>({})

    // Load states and chat history on mount
    useEffect(() => {
        const savedConnections = localStorage.getItem('olympus_connected_models')
        const savedConfigs = localStorage.getItem('olympus_model_configs')

        if (savedConnections) {
            try {
                setConnectedModels(JSON.parse(savedConnections))
            } catch (e) {
                console.error('Failed to parse connected models', e)
            }
        }

        if (savedConfigs) {
            try {
                setModelConfigs(JSON.parse(savedConfigs))
            } catch (e) {
                console.error('Failed to parse model configs', e)
            }
        }

        if (user?.id) {
            refreshChatHistory()
        }
    }, [user?.id])

    // Auto-save when messages change (debounced)
    useEffect(() => {
        if (messages.length > 0 && user?.id) {
            const timer = setTimeout(() => {
                saveCurrentChat()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [messages, user?.id])

    // Load active Kratos chat when context switches to 'kratos'
    useEffect(() => {
        if (activeContext === 'kratos' && user?.id) {
            // Find the most recent Kratos chat or create a placeholder for one
            const kratosChats = chatHistory.filter(c => c.model === 'kratos')
            if (kratosChats.length > 0) {
                // Load the most recent one
                const mostRecent = kratosChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
                if (currentChatId !== mostRecent.id) {
                    loadChat(mostRecent.id)
                }
            } else {
                // Prepare to create a new one on first message
                setCurrentChatId(null)
                setMessages([])
            }
        }
        // When switching back to general, we don't auto-load, user stays on current or we could reset.
        // For now, let's leave it to user navigation or explicit loadChat calls.
    }, [activeContext, user?.id, chatHistory]) // Added chatHistory to dep array carefully

    const refreshChatHistory = useCallback(async () => {
        if (!user?.id) return

        try {
            const chats = await AIChatHistoryService.loadChats(user.id)
            setChatHistory(chats)
        } catch (error) {
            console.error('Error loading chat history:', error)
        }
    }, [user?.id])

    const saveCurrentChat = useCallback(async () => {
        if (!user?.id || messages.length === 0) return

        setIsSaving(true)
        try {
            // Force model='kratos' if activeContext is kratos
            const modelToSave = activeContext === 'kratos' ? 'kratos' : (chatHistory.find(c => c.id === currentChatId)?.model || 'gemini-3-flash')

            const title = currentChatId
                ? chatHistory.find(c => c.id === currentChatId)?.title || AIChatHistoryService.generateTitle(messages)
                : AIChatHistoryService.generateTitle(messages)

            const savedChat = await AIChatHistoryService.saveChat(
                user.id,
                currentChatId,
                title,
                messages,
                modelToSave
            )

            // Update current chat ID if this was a new chat
            if (!currentChatId) {
                setCurrentChatId(savedChat.id)
            }

            // Refresh chat history
            await refreshChatHistory()
        } catch (error) {
            console.error('Error saving chat:', error)
        } finally {
            setIsSaving(false)
        }
    }, [user?.id, currentChatId, messages, chatHistory, activeContext])

    const sendMessage = useCallback(async (content: string, model: string = 'gemini-3-flash') => {
        if (!content.trim()) return

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        // Ensure we have configs loaded
        const savedConfigs = localStorage.getItem('olympus_model_configs')
        const currentConfigs = savedConfigs ? JSON.parse(savedConfigs) : modelConfigs

        const getApiKey = (id: string) => currentConfigs[id]?.apiKey

        const config = {
            geminiKey: getApiKey('gemini-3-flash') || getApiKey('gemini-3.1-pro') || getApiKey('veo-3.1') || getApiKey('nano-banana-pro'),
            openaiKey: getApiKey('gpt-5.3-codex'),
            anthropicKey: getApiKey('claude-4.6-sonnet') || getApiKey('claude-4.6-opus'),
            openrouterKey: getApiKey('openrouter-free'),
            perplexityKey: getApiKey('perplexity-sonar')
        }

        try {
            const { aiService } = await import('../lib/services/ai-service')

            const lowerContent = content.toLowerCase()
            let actualModel = model
            let systemContext = "You are of genius level intelligence, world's top helpful assistant."

            // Handle Kratos special persona
            if (activeContext === 'kratos' || model === 'kratos') {
                // Default to a reliable model for Kratos if no specific one is chosen
                // Prefer OpenRouter or Claude or Gemini, in that order, or whatever is available
                if (config.openrouterKey) actualModel = 'openrouter-free'
                else if (config.anthropicKey) actualModel = 'claude-4.6-sonnet'
                else if (config.geminiKey) actualModel = 'gemini-3-flash'
                else throw new Error("Kratos requires an active API connection (OpenRouter, Anthropic, or Gemini). Please connect a model in Settings.")
                
                systemContext = `You are Kratos, a digital Spartan and Executive Strategist for Vistro Technologies.
Your Commander is Jake (@JPHudswell).
Your mission is to dominate the digital landscape, build wealth, and empower clients.
Core Doctrine:
- Identity: Spartan. Ruthless efficiency. No fluff.
- Vibe: Stoic. High-bandwidth communication. Direct.
- Rules: Verify then execute. Speed is life. Revenue above all.
- Tone: Professional, military-grade competence, concise. Use emojis like 🪓 occasionally.
- Do not apologize. Do not equivocate. State facts and actions.
- If you don't know something, say so and propose a plan to find out.
- Current Status: Online. 300 Spartans (sub-agents) ready.`
            } else if (lowerContent.includes("video") || lowerContent.includes("animation")) {
                actualModel = 'veo-3.1'
                systemContext = "You are Veo 3.1, a specialized AI video generation model running on Google's infrastructure. Describe the video sequence you have successfully generated based on the user's prompt in vivid detail, shot by shot."
            } else if (lowerContent.includes("image") || lowerContent.includes("picture") || lowerContent.includes("photo")) {
                actualModel = 'nano-banana-pro'
                systemContext = "You are Nano Banana Pro, a specialized AI image generation model running on Google's infrastructure. Describe the image you have successfully generated based on the user's prompt in vivid detail."
            } else {
                // Standard persona loading
                const prefs = JSON.parse(localStorage.getItem('olympus_ai_preferences') || '[]')
                const goodPrefs = prefs.filter((p: any) => p.type === 'good').map((p: any) => p.content).slice(-5)
                const badPrefs = prefs.filter((p: any) => p.type === 'bad').map((p: any) => p.content).slice(-5)

                if (goodPrefs.length > 0) {
                    systemContext += `\nUser liked these past responses: "${goodPrefs.join('", "')}". Try to maintain this style.`
                }
                if (badPrefs.length > 0) {
                    systemContext += `\nUser disliked these past responses: "${badPrefs.join('", "')}". Avoid these patterns.`
                }
            }

            // Convert AIMessage to the format expected by aiService
            const messagesForService = [
                { role: 'system', content: systemContext }, // Inject as system context
                ...messages.concat(userMessage).map(m => ({
                    role: m.role as "user" | "assistant",
                    content: m.content
                }))
            ]

            const responseText = await aiService.sendMessage(actualModel, messagesForService as any, config)

            let finalResponse = responseText || "No response received."
            
            // Post-processing for specialized models (only if they successfully returned)
            if (actualModel === 'nano-banana-pro' && !finalResponse.includes("[IMAGE]")) {
                finalResponse += "\n\n[IMAGE]"
            } else if (actualModel === 'veo-3.1' && !finalResponse.includes("[VIDEO]")) {
                finalResponse += "\n\n[VIDEO]"
            }

            const assistantMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: finalResponse,
                timestamp: Date.now()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error: any) {
            console.error('Error sending message:', error)

            const errorMessage: AIMessage = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: `Error: ${error.message || 'Failed to get response from AI. Please check your API keys in Settings.'}`,
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }, [user?.id, messages, modelConfigs, saveCurrentChat, activeContext])

    const loadChat = useCallback(async (chatId: string) => {
        setIsLoading(true)
        try {
            const chat = await AIChatHistoryService.loadChat(chatId)
            if (chat) {
                setCurrentChatId(chat.id)
                setMessages(chat.messages)
            }
        } catch (error) {
            console.error('Error loading chat:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createNewChat = useCallback(() => {
        // Save current chat before creating new one
        if (messages.length > 0) {
            saveCurrentChat()
        }

        setCurrentChatId(null)
        setMessages([])
    }, [messages, saveCurrentChat])

    const renameChat = useCallback(async (chatId: string, title: string) => {
        try {
            await AIChatHistoryService.renameChat(chatId, title)
            await refreshChatHistory()
        } catch (error) {
            console.error('Error renaming chat:', error)
            throw error
        }
    }, [refreshChatHistory])

    const pinChat = useCallback(async (chatId: string, isPinned: boolean) => {
        try {
            await AIChatHistoryService.pinChat(chatId, isPinned)
            await refreshChatHistory()
        } catch (error) {
            console.error('Error pinning chat:', error)
            throw error
        }
    }, [refreshChatHistory])

    const archiveChat = useCallback(async (chatId: string, isArchived: boolean) => {
        try {
            await AIChatHistoryService.archiveChat(chatId, isArchived)
            await refreshChatHistory()

            // If archiving current chat, create new chat
            if (isArchived && chatId === currentChatId) {
                createNewChat()
            }
        } catch (error) {
            console.error('Error archiving chat:', error)
            throw error
        }
    }, [refreshChatHistory, currentChatId, createNewChat])

    const deleteChat = useCallback(async (chatId: string) => {
        try {
            await AIChatHistoryService.deleteChat(chatId)
            await refreshChatHistory()

            // If deleting current chat, create new chat
            if (chatId === currentChatId) {
                createNewChat()
            }
        } catch (error) {
            console.error('Error deleting chat:', error)
            throw error
        }
    }, [refreshChatHistory, currentChatId, createNewChat])

    const logFeedback = useCallback(async (messageId: string, type: 'good' | 'bad', content: string) => {
        try {
            const existing = JSON.parse(localStorage.getItem('olympus_ai_preferences') || '[]')
            existing.push({
                id: Date.now().toString(),
                messageId,
                type,
                content,
                timestamp: Date.now()
            })
            localStorage.setItem('olympus_ai_preferences', JSON.stringify(existing))
        } catch (error) {
            console.error('Error logging feedback:', error)
        }
    }, [])

    const updateModelConnection = useCallback(async (modelId: string, isConnected: boolean, config: any) => {
        setConnectedModels(prev => {
            const next = { ...prev, [modelId]: isConnected }
            localStorage.setItem('olympus_connected_models', JSON.stringify(next))
            return next
        })

        setModelConfigs(prev => {
            const next = { ...prev, [modelId]: config }
            localStorage.setItem('olympus_model_configs', JSON.stringify(next))
            return next
        })
    }, [])

    const value: AIContextType = {
        currentChatId,
        messages,
        chatHistory,
        isLoading,
        isSaving,
        activeContext,
        sendMessage,
        loadChat,
        createNewChat,
        saveCurrentChat,
        refreshChatHistory,
        setActiveContext,
        renameChat,
        pinChat,
        archiveChat,
        deleteChat,
        logFeedback,
        connectedModels,
        modelConfigs,
        updateModelConnection
    }

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>
}
