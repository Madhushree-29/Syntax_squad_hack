import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Fallback Mock Data in case of 429 or missing API Key
const fallbackMockData = {
  suggestedRole: "Senior Software Engineer",
  coveragePercent: 65,
  hireabilityScore: 60,
  coveredSkills: [
    { skill: "HTML/CSS", syllabusDepth: "Covered in undergrad", jobRelevance: "required" },
    { skill: "JavaScript", syllabusDepth: "Covered in undergrad", jobRelevance: "required" },
    { skill: "React", syllabusDepth: "Basics known", jobRelevance: "required" }
  ],
  partialSkills: [
    { skill: "Node.js", syllabusDepth: "Basic server", jobRelevance: "preferred", gap: "Needs advanced architecture" }
  ],
  missingSkills: [
    { skill: "System Design", jobRelevance: "required", priority: 1, estimatedHours: 20, weekendPlan: "Study architectures" },
    { skill: "Cloud Services (AWS)", jobRelevance: "preferred", priority: 2, estimatedHours: 15, weekendPlan: "Build deployment pipeline" }
  ],
  weekendRoadmap: [
    {
      weekend: 1,
      focus: "Advanced Backend & System Design",
      totalHours: 10,
      tasks: [
        { task: "Understand System Design Basics", resource: "https://www.youtube.com/results?search_query=system+design+basics", type: "youtube", duration: "2 hours" },
        { task: "Read system design primer", resource: "https://github.com/donnemartin/system-design-primer", type: "article", duration: "3 hours" },
        { task: "Build a basic Node.js microservice", resource: "https://www.freecodecamp.org/news/nodejs-microservices/", type: "project", duration: "5 hours" }
      ]
    },
    {
      weekend: 2,
      focus: "Cloud Deployment & AWS",
      totalHours: 12,
      tasks: [
        { task: "AWS EC2 and S3 Basics", resource: "https://www.youtube.com/results?search_query=aws+ec2+s3+tutorial", type: "youtube", duration: "3 hours" },
        { task: "Deploy microservice to AWS", resource: "https://aws.amazon.com/getting-started/", type: "article", duration: "4 hours" }
      ]
    }
  ],
  rawSummary: "You have a solid foundation in frontend, but lack backend architecture and cloud deployment skills. You need to focus heavily on system design and AWS to reach the Senior status required for this job."
};

export async function POST(req: Request) {
  try {
    const { syllabusText, targetJobTitle, targetJobDescription, vibeCheck } =
      await req.json();

    if (!syllabusText || !targetJobTitle) {
      return NextResponse.json(
        { error: "Syllabus and Skills are required" },
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
Your task is to analyze the user's current academic syllabus and current skills, and assess their readiness for their field of interest. The user has also provided their "vibe check" constraints.

--- INPUT ---
**Syllabus/Current Skills:**
${syllabusText}

**Current Skills:**
${targetJobTitle}

**Field of Interest:**
${targetJobDescription || "(Not provided)"}

**User Profile/Constraints:**
Weekly Hours Available: ${vibeCheck?.weeklyHours || 5}
Learning Style: ${vibeCheck?.learningStyle || "MIXED"}
Biggest Bottleneck: ${vibeCheck?.biggestBottleneck || "None"}

--- INSTRUCTIONS ---
Compare the user's syllabus/skills against the requirements for their field of interest.
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
  resource: string; // MUST BE a specific working clickable URL (e.g. YouTube search query or website like freeCodeCamp). DO NOT output generic text.
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
  suggestedRole: string; // The specific job role recommended based on the user's skills
  coveragePercent: number; // 0-100 score of how well syllabus matches job
  hireabilityScore: number; // 0-100 realistic score of current hireability
  coveredSkills: CoveredSkill[];
  partialSkills: PartialSkill[];
  missingSkills: SkillGap[];
  weekendRoadmap: WeekendPlan[]; // 100% accurate, lively daily/weekend roadmap spreading missing skills with exactly actionable youtube/website links for resources.
  rawSummary: string; // Brutal truth, unfiltered assessment of their readiness (approx 100-120 words). Act like an experienced engineer giving real world advice.
}

Output JSON only. Do not include \`\`\`json or \`\`\`.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
      console.log("Serving mock data due to parse error.");
      return NextResponse.json(fallbackMockData);
    }
  } catch (error: any) {
    console.error("AI Analysis Error (likely 429 Rate Limit):", error?.message);
    console.log("Serving mock data due to API failure.");
    return NextResponse.json(fallbackMockData);
  }
}
