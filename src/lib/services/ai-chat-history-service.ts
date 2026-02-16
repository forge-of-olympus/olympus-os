
export interface AIMessage {
    id: string
    role: 'user' | 'assistant'
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

export class AIChatHistoryService {
    /**
     * Save or update a chat
     */
    static async saveChat(
        userId: string,
        chatId: string | null,
        title: string,
        messages: AIMessage[],
        model: string = 'gemini-3-pro'
    ): Promise<ChatHistoryItem> {
        return {
            id: chatId || `chat_${Date.now()}`,
            userId: userId,
            title,
            messages,
            model,
            isPinned: false,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }

    /**
     * Load all chats for a user (excluding archived by default)
     */
    static async loadChats(userId: string, includeArchived: boolean = false): Promise<ChatHistoryItem[]> {
        return []
    }

    /**
     * Load a specific chat by ID
     */
    static async loadChat(chatId: string): Promise<ChatHistoryItem | null> {
        return null
    }

    /**
     * Rename a chat
     */
    static async renameChat(chatId: string, newTitle: string): Promise<void> {
        // Mock success
    }

    /**
     * Pin or unpin a chat
     */
    static async pinChat(chatId: string, isPinned: boolean): Promise<void> {
        // Mock success
    }

    /**
     * Archive or unarchive a chat
     */
    static async archiveChat(chatId: string, isArchived: boolean): Promise<void> {
        // Mock success
    }

    /**
     * Delete a chat permanently
     */
    static async deleteChat(chatId: string): Promise<void> {
        // Mock success
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
