
interface Message {
    role: "user" | "assistant" | "system"
    content: string
}

interface AIConfig {
    geminiKey?: string
    openaiKey?: string
    anthropicKey?: string
    openrouterKey?: string
    perplexityKey?: string
}

export const aiService = {
    async sendMessage(modelId: string, messages: Message[], config: AIConfig): Promise<string> {

        // 1a. Nano Banana Pro — Native Image Generation via Gemini Imagen
        if (modelId === "nano-banana-pro") {
            if (!config.geminiKey) throw new Error("Google API Key is missing. Please connect it in Model Registry.")

            const userMessage = [...messages].reverse().find(m => m.role === "user")?.content || "Generate an image"

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${config.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: `Generate an image: ${userMessage}` }] }],
                    generationConfig: {
                        responseModalities: ["TEXT", "IMAGE"]
                    }
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to generate image with Nano Banana Pro")
            }

            const data = await response.json()
            const parts = data.candidates?.[0]?.content?.parts || []

            // Extract image data and text
            let textPart = ""
            let imageBase64 = ""
            let imageMimeType = "image/png"

            for (const part of parts) {
                if (part.text) {
                    textPart += part.text
                }
                if (part.inlineData) {
                    imageBase64 = part.inlineData.data
                    imageMimeType = part.inlineData.mimeType || "image/png"
                }
            }

            if (imageBase64) {
                // Return special format that VistroAI can parse for image preview
                return `${textPart || "Here is your generated image:"}\n\n[IMAGE_DATA:${imageMimeType}:${imageBase64}]`
            }

            return textPart || "Image generation completed but no image data was returned."
        }

        // 1b. Veo 3.1 — Video Generation (text description, API not yet public)
        if (modelId === "veo-3.1") {
            if (!config.geminiKey) throw new Error("Google API Key is missing. Please connect it in Model Registry.")

            const systemMessage = messages.find(m => m.role === "system")?.content
            const chatMessages = messages.filter(m => m.role !== "system")

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${config.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: systemMessage ? { parts: [{ text: systemMessage }] } : undefined,
                    contents: chatMessages.map(m => ({
                        role: m.role === "assistant" ? "model" : "user",
                        parts: [{ text: m.content }]
                    }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from Veo 3.1")
            }

            const data = await response.json()
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response."
        }

        // 1c. Google Gemini (text models)
        if (modelId.startsWith("gemini")) {
            if (!config.geminiKey) throw new Error("Google API Key is missing. Please connect it in Model Registry.")

            let googleModel;
            if (modelId === "gemini-3-flash") {
                googleModel = "gemini-3-flash-preview";
            } else if (modelId === "gemini-3.1-pro") {
                googleModel = "gemini-3.1-pro-preview";
            } else {
                googleModel = "gemini-2.5-pro"; // Reliable fallback for generation
            }

            const systemMessage = messages.find(m => m.role === "system")?.content;
            const chatMessages = messages.filter(m => m.role !== "system");

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${config.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: systemMessage ? { parts: [{ text: systemMessage }] } : undefined,
                    contents: chatMessages.map(m => ({
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
            if (!config.openaiKey) throw new Error("OpenAI API Key is missing. Please connect it in Model Registry.")

            const openAiModel = "gpt-4o";

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
            if (!config.anthropicKey) throw new Error("Anthropic API Key is missing. Please connect it in Model Registry.")

            const claudeModel = modelId.includes("opus")
                ? "claude-3-5-opus-20240229"
                : "claude-3-5-sonnet-20240620";

            const systemMessage = messages.find(m => m.role === "system")?.content;
            const chatMessages = messages.filter(m => m.role !== "system");

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": config.anthropicKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model: claudeModel,
                    max_tokens: 1024,
                    system: systemMessage,
                    messages: chatMessages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from Anthropic")
            }

            const data = await response.json()
            return data.content?.[0]?.text || "No response."
        }

        // 4. OpenRouter
        if (modelId === "openrouter-free") {
            if (!config.openrouterKey) throw new Error("OpenRouter API Key is missing. Please connect it in Model Registry.")

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.openrouterKey}`
                },
                body: JSON.stringify({
                    model: "openrouter/auto",
                    messages: messages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from OpenRouter")
            }

            const data = await response.json()
            return data.choices?.[0]?.message?.content || "No response."
        }

        // 5. Perplexity
        if (modelId === "perplexity-sonar") {
            if (!config.perplexityKey) throw new Error("Perplexity API Key is missing. Please connect it in Model Registry.")

            const response = await fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.perplexityKey}`
                },
                body: JSON.stringify({
                    model: "sonar",
                    messages: messages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error?.message || "Failed to fetch from Perplexity")
            }

            const data = await response.json()
            return data.choices?.[0]?.message?.content || "No response."
        }

        throw new Error("Unknown model selected")
    }
}
