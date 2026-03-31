import { create } from "zustand";

export type UserStatus = "DEGREE_STUDENT" | "SELF_TAUGHT" | "WORKING_PROFESSIONAL" | null;
export type LearningStyle = "VISUAL" | "READING" | "HANDS_ON" | "MIXED";

export interface VibeCheckAnswers {
  weeklyHours: number;
  learningStyle: LearningStyle;
  biggestBottleneck: string;
  budgetConstraint: boolean;
}

export interface OnboardingState {
  // Step tracking
  currentStep: number;
  totalSteps: number;

  // Step 1: Status
  userStatus: UserStatus;

  // Step 2: Syllabus or skills
  syllabusText: string;

  // Step 3: Target job
  targetJobTitle: string;
  targetJobDescription: string;

  // Step 4: Vibe check
  vibeCheck: VibeCheckAnswers;

  // Results
  isAnalyzing: boolean;
  analysisComplete: boolean;
  analysisResult: AnalysisResult | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setUserStatus: (status: UserStatus) => void;
  setSyllabusText: (text: string) => void;
  setTargetJobTitle: (title: string) => void;
  setTargetJobDescription: (desc: string) => void;
  setVibeCheck: (answers: Partial<VibeCheckAnswers>) => void;
  setAnalyzing: (val: boolean) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  reset: () => void;
}

export interface SkillGap {
  skill: string;
  jobRelevance: "required" | "preferred" | "nice-to-have";
  priority: number;
  estimatedHours: number;
  weekendPlan: string;
}

export interface CoveredSkill {
  skill: string;
  syllabusDepth: string;
  jobRelevance: string;
}

export interface PartialSkill {
  skill: string;
  syllabusDepth: string;
  jobRelevance: string;
  gap: string;
}

export interface RoadmapTask {
  task: string;
  resource: string;
  type: string;
  duration: string;
}

export interface WeekendPlan {
  weekend: number;
  focus: string;
  totalHours: number;
  tasks: RoadmapTask[];
}

export interface AnalysisResult {
  coveragePercent: number;
  hireabilityScore: number;
  coveredSkills: CoveredSkill[];
  partialSkills: PartialSkill[];
  missingSkills: SkillGap[];
  weekendRoadmap: WeekendPlan[];
  rawSummary: string;
}

const defaultVibeCheck: VibeCheckAnswers = {
  weeklyHours: 5,
  learningStyle: "MIXED",
  biggestBottleneck: "",
  budgetConstraint: true,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  totalSteps: 4,
  userStatus: null,
  syllabusText: "",
  targetJobTitle: "",
  targetJobDescription: "",
  vibeCheck: { ...defaultVibeCheck },
  isAnalyzing: false,
  analysisComplete: false,
  analysisResult: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setUserStatus: (status) => set({ userStatus: status }),
  setSyllabusText: (text) => set({ syllabusText: text }),
  setTargetJobTitle: (title) => set({ targetJobTitle: title }),
  setTargetJobDescription: (desc) => set({ targetJobDescription: desc }),
  setVibeCheck: (answers) =>
    set((s) => ({ vibeCheck: { ...s.vibeCheck, ...answers } })),
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  setAnalysisResult: (result) =>
    set({ analysisResult: result, analysisComplete: true, isAnalyzing: false }),
  reset: () =>
    set({
      currentStep: 1,
      userStatus: null,
      syllabusText: "",
      targetJobTitle: "",
      targetJobDescription: "",
      vibeCheck: { ...defaultVibeCheck },
      isAnalyzing: false,
      analysisComplete: false,
      analysisResult: null,
    }),
}));
