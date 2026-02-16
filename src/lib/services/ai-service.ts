
interface Message {
    role: "user" | "assistant"
    content: string
}

interface AIConfig {
    geminiKey?: string
    openaiKey?: string
    anthropicKey?: string
}

export const aiService = {
    async sendMessage(modelId: string, messages: Message[], config: AIConfig) {
        // 1. Google Gemini
        if (modelId.startsWith("gemini")) {
            if (!config.geminiKey) throw new Error("Google Gemini API Key is missing. Please add it in Account settings.")

            // Use the actual Gemini 3 API model names (require -preview suffix)
            // As of Jan 2026: gemini-3-pro-preview and gemini-3-flash-preview
            const googleModel = modelId === "gemini-3-flash"
                ? "gemini-3-flash-preview"
                : "gemini-3-pro-preview";

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${config.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: messages.map(m => ({
                        role: m.role === "assistant" ? "model" : "user",
                        parts: [{ text: m.content }]
                    }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from Gemini")
            }

            const data = await response.json()
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response."
        }

        // 2. OpenAI (GPT)
        if (modelId.startsWith("gpt")) {
            if (!config.openaiKey) throw new Error("OpenAI API Key is missing. Please add it in Account settings.")

            // Use GPT-5.2 model
            const openAiModel = "gpt-5.2";

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.openaiKey}`
                },
                body: JSON.stringify({
                    model: openAiModel,
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                    temperature: 0.7
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from OpenAI")
            }

            const data = await response.json()
            return data.choices?.[0]?.message?.content || "No response."
        }

        // 3. Anthropic (Claude)
        if (modelId.startsWith("claude")) {
            if (!config.anthropicKey) throw new Error("Anthropic API Key is missing. Please add it in Account settings.")

            // Map to the correct Claude 4.5 models
            // claude-4.5-sonnet -> claude-4.5-sonnet
            // claude-4.5-opus -> claude-opus-4-5
            const claudeModel = modelId === "claude-4.5-opus"
                ? "claude-opus-4-5"
                : "claude-4.5-sonnet";

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": config.anthropicKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true" // Required for browser calls
                },
                body: JSON.stringify({
                    model: claudeModel,
                    max_tokens: 1024,
                    messages: messages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from Anthropic")
            }

            const data = await response.json()
            return data.content?.[0]?.text || "No response."
        }

        throw new Error("Unknown model selected")
    }
}
