import { GoogleGenAI } from "@google/genai";

export const createGeminiClient = () => {
    if (!process.env.API_KEY) {
        console.warn("API Key is missing for Gemini");
        return null;
    }
    return new GoogleGenAI({
        apiKey: process.env.API_KEY,
        // Optional: If you need to override the base URL
        baseUrl: process.env.BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'
    });
};

export const generateChatResponse = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
    const ai = createGeminiClient();
    if (!ai) return "I'm sorry, I can't connect to the AI service right now. Please check the API key configuration.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-1.5-flash-001',
            config: {
                systemInstruction: "You are 'EzBot', a helpful assistant for the EzLicence Explorer web application. Your goal is to help users find driving instructors, understand booking packages, and answer general questions about road rules (specifically Australian/general road safety). Be concise, friendly, and encourage safety. If asked about specific instructor availability, simulate a helpful response but clarify you don't have real-time live access."
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
};