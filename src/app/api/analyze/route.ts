import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { syllabusText, targetJobTitle, targetJobDescription, vibeCheck } =
      await req.json();

    if (!syllabusText || !targetJobTitle) {
      return NextResponse.json(
        { error: "Syllabus and Job Title are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert technical recruiter, senior software engineer, and career coach.
Your task is to analyze the user's current academic syllabus and assess their readiness for a specific job target. The user has also provided their "vibe check" constraints.

--- INPUT ---
**Syllabus/Current Skills:**
${syllabusText}

**Target Job Title:**
${targetJobTitle}

**Target Job Description:**
${targetJobDescription || "(Not provided, assume standard responsibilities for the job title)"}

**User Profile/Constraints:**
Weekly Hours Available: ${vibeCheck?.weeklyHours || 5}
Learning Style: ${vibeCheck?.learningStyle || "MIXED"}
Biggest Bottleneck: ${vibeCheck?.biggestBottleneck || "None"}

--- INSTRUCTIONS ---
Compare the user's syllabus/skills against the requirements for the target role.
You must output ONLY raw JSON that perfectly matches the following TypeScript interface (and nothing else). No markdown formatting blocks around the JSON output, JUST raw JSON.

export interface SkillGap {
  skill: string;
  jobRelevance: "required" | "preferred" | "nice-to-have";
  priority: number; // 1 is highest priority
  estimatedHours: number;
  weekendPlan: string; // Specific, actionable plan to learn this
}

export interface CoveredSkill {
  skill: string;
  syllabusDepth: string; // Brief description of what they know from syllabus
  jobRelevance: "required" | "preferred" | "nice-to-have" | "irrelevant";
}

export interface PartialSkill {
  skill: string;
  syllabusDepth: string;
  jobRelevance: "required" | "preferred" | "nice-to-have" | "irrelevant";
  gap: string; // What they still need to learn about this
}

export interface RoadmapTask {
  task: string;
  resource: string; // Specific YouTube search, freeCodeCamp, documentation link etc
  type: "youtube" | "article" | "project" | "course"; // string
  duration: string; // e.g. "2 hours"
}

export interface WeekendPlan {
  weekend: number; // 1, 2, 3...
  focus: string; // Main theme for the weekend
  totalHours: number; // Total hours planned for this weekend (respect their weeklyHours constraint if possible)
  tasks: RoadmapTask[]; // 3-5 specific, tactical learning tasks
}

export interface AnalysisResult {
  coveragePercent: number; // 0-100 score of how well syllabus matches job
  hireabilityScore: number; // 0-100 realistic score of current hireability
  coveredSkills: CoveredSkill[];
  partialSkills: PartialSkill[];
  missingSkills: SkillGap[];
  weekendRoadmap: WeekendPlan[]; // Spread the missing skills into a realistic 3-4 week weekend plan based on their weeklyHours constraint.
  rawSummary: string; // Brutal truth, unfiltered assessment of their readiness (approx 100-120 words). Act like an experienced engineer giving real world advice.
}

Output JSON only. Do not include \`\`\`json or \`\`\`.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const aiText = response.text;
    if (!aiText) {
      throw new Error("Empty response from AI");
    }

    try {
      const parsed = JSON.parse(aiText);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiText);
      return NextResponse.json(
        { error: "AI generated invalid JSON structure" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during AI analysis" },
      { status: 500 }
    );
  }
}
