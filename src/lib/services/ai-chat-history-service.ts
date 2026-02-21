const STORAGE_KEY = 'olympus_ai_chats'

export interface AIMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: number
}

export interface ChatHistoryItem {
    id: string
    userId: string
    title: string
    messages: AIMessage[]
    model: string
    isPinned: boolean
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

function loadAllChatsFromStorage(): ChatHistoryItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        return JSON.parse(raw) as ChatHistoryItem[]
    } catch {
        console.error('[ChatHistory] Failed to parse chats from localStorage')
        return []
    }
}

function saveAllChatsToStorage(chats: ChatHistoryItem[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (e) {
        console.error('[ChatHistory] Failed to save chats to localStorage', e)
    }
}

export class AIChatHistoryService {
    /**
     * Save or update a chat
     */
    static async saveChat(
        userId: string,
        chatId: string | null,
        title: string,
        messages: AIMessage[],
        model: string = 'gemini-3-flash'
    ): Promise<ChatHistoryItem> {
        const allChats = loadAllChatsFromStorage()

        if (chatId) {
            // Update existing chat
            const idx = allChats.findIndex(c => c.id === chatId)
            if (idx !== -1) {
                allChats[idx].title = title
                allChats[idx].messages = messages
                allChats[idx].model = model
                allChats[idx].updatedAt = new Date().toISOString()
                saveAllChatsToStorage(allChats)
                return allChats[idx]
            }
        }

        // Create new chat
        const newChat: ChatHistoryItem = {
            id: chatId || `chat_${Date.now()}`,
            userId,
            title,
            messages,
            model,
            isPinned: false,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        allChats.unshift(newChat)
        saveAllChatsToStorage(allChats)
        return newChat
    }

    /**
     * Load all chats for a user (excluding archived by default)
     */
    static async loadChats(userId: string, includeArchived: boolean = false): Promise<ChatHistoryItem[]> {
        const allChats = loadAllChatsFromStorage()
        const userChats = allChats.filter(c => c.userId === userId)

        const filtered = includeArchived
            ? userChats
            : userChats.filter(c => !c.isArchived)

        return filtered.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    }

    /**
     * Load a specific chat by ID
     */
    static async loadChat(chatId: string): Promise<ChatHistoryItem | null> {
        const allChats = loadAllChatsFromStorage()
        return allChats.find(c => c.id === chatId) || null
    }

    /**
     * Rename a chat
     */
    static async renameChat(chatId: string, newTitle: string): Promise<void> {
        const allChats = loadAllChatsFromStorage()
        const chat = allChats.find(c => c.id === chatId)
        if (chat) {
            chat.title = newTitle
            chat.updatedAt = new Date().toISOString()
            saveAllChatsToStorage(allChats)
        }
    }

    /**
     * Pin or unpin a chat
     */
    static async pinChat(chatId: string, isPinned: boolean): Promise<void> {
        const allChats = loadAllChatsFromStorage()
        const chat = allChats.find(c => c.id === chatId)
        if (chat) {
            chat.isPinned = isPinned
            chat.updatedAt = new Date().toISOString()
            saveAllChatsToStorage(allChats)
        }
    }

    /**
     * Archive or unarchive a chat
     */
    static async archiveChat(chatId: string, isArchived: boolean): Promise<void> {
        const allChats = loadAllChatsFromStorage()
        const chat = allChats.find(c => c.id === chatId)
        if (chat) {
            chat.isArchived = isArchived
            chat.updatedAt = new Date().toISOString()
            saveAllChatsToStorage(allChats)
        }
    }

    /**
     * Delete a chat permanently
     */
    static async deleteChat(chatId: string): Promise<void> {
        const allChats = loadAllChatsFromStorage()
        const filtered = allChats.filter(c => c.id !== chatId)
        saveAllChatsToStorage(filtered)
    }

    /**
     * Generate a title from the first user message
     */
    static generateTitle(messages: AIMessage[]): string {
        const firstUserMessage = messages.find(m => m.role === 'user')
        if (!firstUserMessage) return 'New Chat'

        const title = firstUserMessage.content.slice(0, 50)
        return title.length < firstUserMessage.content.length ? `${title}...` : title
    }
}
