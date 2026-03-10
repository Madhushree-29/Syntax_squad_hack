import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// We must manually pass apiKey if process.env.GEMINI_API_KEY is not set by default name
// The SDK uses GEMINI_API_KEY by default
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class AIService {
  static async analyzeProfile(profile: any) {
    const prompt = `
      Act as an expert Career Counselor.
      Analyze the following student profile:
      Name: ${profile.name}
      Academic Background: ${profile.academicBg}
      Goals: ${profile.goals}
      Skills: ${profile.skills.map((s: any) => s.skill.name).join(', ')}
      Interests: ${profile.interests.map((i: any) => i.interest.name).join(', ')}

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
    } catch (error) {
      console.error("AI Analysis Error:", error);
      throw error;
    }
  }

  static async chat(messages: any[], userMessage: string, profileContext: string) {
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
    } catch (error) {
       console.error("AI Chat Error:", error);
       throw error;
    }
  }
}
