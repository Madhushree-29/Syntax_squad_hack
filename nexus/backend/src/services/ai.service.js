"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// We must manually pass apiKey if process.env.GEMINI_API_KEY is not set by default name
// The SDK uses GEMINI_API_KEY by default
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
class AIService {
    static async analyzeProfile(profile) {
        const prompt = `
      Act as an expert Career Counselor.
      Analyze the following student profile:
      Name: ${profile.name}
      Academic Background: ${profile.academicBg}
      Goals: ${profile.goals}
      Skills: ${profile.skills.map((s) => s.skill?.name).join(', ')}
      Interests: ${profile.interests.map((i) => i.interest?.name).join(', ')}

      Provide 3 career recommendations.
      For each recommendation, include:
      1. title: The job title
      2. description: Briefly explain why it fits
      3. roadmap: An array of steps to achieve this career (e.g., "Learn React", "Build Projects")
      4. skillGap: An object highlighting missing skills compared to their current skills.

      Return the response STRICTLY as a JSON array of objects. Do not include markdown formatting or backticks around the JSON.
      [
        {
          "title": "String",
          "description": "String",
          "roadmap": ["Step 1", "Step 2"],
          "skillGap": { "missing": ["Skill 1", "Skill 2"] }
        }
      ]
    `;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const text = response.text || "[]";
            // Basic cleanup in case Gemini adds markdown
            const cleanedText = text.replace(/```json\n/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleanedText);
        }
        catch (error) {
            console.error("AI Analysis Error:", error);
            throw error;
        }
    }
    static async chat(messages, userMessage, profileContext) {
        const systemPrompt = `You are a Career Guidance Expert helping a student.
    Student Context: ${profileContext}
    Provide actionable, concise advice.`;
        const contents = messages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));
        contents.push({ role: 'user', parts: [{ text: userMessage }] });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents, // Includes the history
                config: { systemInstruction: systemPrompt }
            });
            return response.text;
        }
        catch (error) {
            console.error("AI Chat Error:", error);
            throw error;
        }
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map