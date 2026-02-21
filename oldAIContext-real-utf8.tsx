import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AIChatHistoryService } from '../lib/services/ai-chat-history-service'
import type { AIMessage, ChatHistoryItem } from '../lib/services/ai-chat-history-service'
import { useAuth } from '@/components/auth-provider'
import dbService from '../lib/indexedDB/db-service'

interface AIContextType {
    currentChatId: string | null
    messages: AIMessage[]
    chatHistory: ChatHistoryItem[]
    isLoading: boolean
    isSaving: boolean

    // Actions
    sendMessage: (content: string, model: string) => Promise<void>
    loadChat: (chatId: string) => Promise<void>
    createNewChat: () => void
    saveCurrentChat: () => Promise<void>
    refreshChatHistory: () => Promise<void>

    // Chat management
    renameChat: (chatId: string, title: string) => Promise<void>
    pinChat: (chatId: string, isPinned: boolean) => Promise<void>
    archiveChat: (chatId: string, isArchived: boolean) => Promise<void>
    deleteChat: (chatId: string) => Promise<void>
    logFeedback: (messageId: string, type: 'good' | 'bad', content: string) => Promise<void>
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

    // Load chat history on mount
    useEffect(() => {
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
            const title = currentChatId
                ? chatHistory.find(c => c.id === currentChatId)?.title || AIChatHistoryService.generateTitle(messages)
                : AIChatHistoryService.generateTitle(messages)

            const savedChat = await AIChatHistoryService.saveChat(
                user.id,
                currentChatId,
                title,
                messages,
                'gemini-3-flash'
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
    }, [user?.id, currentChatId, messages, chatHistory])

    const sendMessage = useCallback(async (content: string, model: string = 'gemini-3-flash') => {
        if (!content.trim()) return

        // 1. Load API keys from localStorage
        let apiKeys: { gemini?: string; openai?: string; anthropic?: string } = {}
        try {
            const keysJson = localStorage.getItem("vistro_api_keys")
            if (keysJson) {
                apiKeys = JSON.parse(keysJson)
            }
        } catch (e) {
            console.error("Failed to load API keys from localStorage", e)
        }

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        try {
            // 2. Call the real AI service
            const { aiService } = await import('../lib/services/ai-service')

            const config = {
                geminiKey: apiKeys.gemini,
                openaiKey: apiKeys.openai,
                anthropicKey: apiKeys.anthropic
            }

            // Load preferences for learning
            const prefs = await dbService.getAll("aiPreferences")
            const goodPrefs = prefs.filter(p => p.type === 'good').map(p => p.content).slice(-5)
            const badPrefs = prefs.filter(p => p.type === 'bad').map(p => p.content).slice(-5)

            let systemContext = "You are VistroAI, a helpful assistant."
            if (goodPrefs.length > 0) {
                systemContext += `\nUser liked these past responses: "${goodPrefs.join('", "')}". Try to maintain this style.`
            }
            if (badPrefs.length > 0) {
                systemContext += `\nUser disliked these past responses: "${badPrefs.join('", "')}". Avoid these patterns.`
            }

            // Convert AIMessage to the format expected by aiService
            const messagesForService = [
                { role: 'assistant', content: systemContext }, // Inject as system context
                ...messages.concat(userMessage).map(m => ({
                    role: m.role,
                    content: m.content
                }))
            ]

            const responseText = await aiService.sendMessage(model, messagesForService as any, config)

            const assistantMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error: any) {
            console.error('Error sending message:', error)

            const errorMessage: AIMessage = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: `Error: ${error.message || 'Failed to get response from AI. Please check your API keys in Preferences.'}`,
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }, [messages])

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
            await dbService.add('aiPreferences', {
                id: Date.now().toString(),
                messageId,
                type,
                content,
                timestamp: Date.now()
            })
        } catch (error) {
            console.error('Error logging feedback:', error)
        }
    }, [])

    const value: AIContextType = {
        currentChatId,
        messages,
        chatHistory,
        isLoading,
        isSaving,
        sendMessage,
        loadChat,
        createNewChat,
        saveCurrentChat,
        refreshChatHistory,
        renameChat,
        pinChat,
        archiveChat,
        deleteChat,
        logFeedback
    }

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>
}
