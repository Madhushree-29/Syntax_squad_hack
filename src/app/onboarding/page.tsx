"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore, UserStatus, LearningStyle } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Code2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Target,
  Brain,
  Clock,
  Eye,
  BookOpen,
  Wrench,
  Shuffle,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

/* ── SLIDE ANIMATION ── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/* ══════════════════════════════════════════════════════
   STEP 1: WHO ARE YOU?
   ══════════════════════════════════════════════════════ */
function StepStatus() {
  const { userStatus, setUserStatus, nextStep } = useOnboardingStore();

  const options: { value: UserStatus; icon: typeof GraduationCap; label: string; desc: string }[] = [
    {
      value: "DEGREE_STUDENT",
      icon: GraduationCap,
      label: "Degree Student",
      desc: "Currently enrolled in an engineering program",
    },
    {
      value: "SELF_TAUGHT",
      icon: Code2,
      label: "Self-Taught",
      desc: "Learning on my own — no formal CS degree",
    },
    {
      value: "WORKING_PROFESSIONAL",
      icon: Briefcase,
      label: "Working Professional",
      desc: "Already employed, looking to level up or pivot",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          First things first.{" "}
          <span className="neon-text">Who are you?</span>
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          This shapes how we analyze your starting point.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {options.map((opt) => {
          const isSelected = userStatus === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setUserStatus(opt.value)}
              className="glass-card p-5 flex items-center gap-4 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: isSelected
                  ? "var(--neon-cyan)"
                  : "var(--border-subtle)",
                boxShadow: isSelected
                  ? "var(--shadow-neon-cyan)"
                  : "none",
              }}
              id={`status-${opt.value}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: isSelected
                    ? "rgba(0,245,255,0.15)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isSelected ? "var(--neon-cyan)" : "var(--border-subtle)"}`,
                }}
              >
                <opt.icon
                  size={22}
                  color={isSelected ? "var(--neon-cyan)" : "var(--text-muted)"}
                />
              </div>
              <div>
                <div
                  className="font-semibold"
                  style={{
                    color: isSelected
                      ? "var(--neon-cyan)"
                      : "var(--text-primary)",
                  }}
                >
                  {opt.label}
                </div>
                <div
                  className="text-sm mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => { if (userStatus) nextStep(); }}
        disabled={!userStatus}
        className="btn-primary w-full max-w-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
        id="next-step-1"
      >
        Continue
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STEP 2: YOUR BASELINE (SYLLABUS / SKILLS)
   ══════════════════════════════════════════════════════ */
function StepSyllabus() {
  const { userStatus, syllabusText, setSyllabusText, nextStep, prevStep } =
    useOnboardingStore();

  const isStudent = userStatus === "DEGREE_STUDENT";

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          {isStudent ? (
            <>
              Paste your{" "}
              <span className="neon-text">syllabus</span>
            </>
          ) : (
            <>
              List your{" "}
              <span className="neon-text">current skills</span>
            </>
          )}
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          {isStudent
            ? "Copy-paste your semester syllabus or course list. The AI will extract every skill."
            : "List the technologies, frameworks, and languages you actually know."}
        </p>
      </div>

      <div className="w-full relative">
        <div
          className="absolute top-4 left-4 flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <FileText size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">
            {isStudent ? "Syllabus" : "Skills"}
          </span>
        </div>
        <textarea
          value={syllabusText}
          onChange={(e) => setSyllabusText(e.target.value)}
          placeholder={
            isStudent
              ? "e.g.,\nSemester 5 - Computer Science\n1. Data Structures & Algorithms\n2. Object Oriented Programming (Java)\n3. Database Management Systems\n4. Computer Networks\n5. Operating Systems\n..."
              : "e.g.,\nJavaScript, React, Node.js, basic SQL, Git, HTML/CSS..."
          }
          className="w-full h-64 glass-card p-4 pt-10 text-sm leading-relaxed resize-none focus:outline-none transition-all"
          style={{
            background: "rgba(10,10,26,0.7)",
            color: "var(--text-primary)",
            borderColor: syllabusText
              ? "var(--neon-cyan)"
              : "var(--border-subtle)",
          }}
          id="syllabus-input"
        />
        <div
          className="text-xs mt-2 text-right"
          style={{ color: "var(--text-muted)" }}
        >
          {syllabusText.length} characters
        </div>
      </div>

      <div className="flex items-center gap-4 w-full max-w-md">
        <button
          onClick={prevStep}
          className="btn-secondary flex-1"
          id="back-step-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={nextStep}
          className="btn-primary flex-1"
          id="next-step-2"
        >
          {syllabusText.trim() ? "Continue" : "Skip"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STEP 3: DREAM JOB
   ══════════════════════════════════════════════════════ */
function StepTargetJob() {
  const {
    targetJobTitle,
    targetJobDescription,
    setTargetJobTitle,
    setTargetJobDescription,
    nextStep,
    prevStep,
  } = useOnboardingStore();

  const canProceed = targetJobTitle.trim().length > 0 && targetJobDescription.trim().length > 0;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Tell us your{" "}
          <span className="neon-text">goals & skills</span>
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          List the skills you have and your main field of interest.
        </p>
      </div>

      {/* Job Title */}
      <div className="w-full">
        <label
          className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          <Target size={14} />
          Skills you have
        </label>
        <input
          value={targetJobTitle}
          onChange={(e) => setTargetJobTitle(e.target.value)}
          placeholder="e.g., Python, React, SQL"
          className="w-full glass-card p-4 text-sm focus:outline-none transition-all"
          style={{
            background: "rgba(10,10,26,0.7)",
            color: "var(--text-primary)",
            borderColor: targetJobTitle
              ? "var(--neon-purple)"
              : "var(--border-subtle)",
          }}
          id="job-title-input"
        />
      </div>

      {/* Job Description */}
      <div className="w-full">
        <label
          className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          <FileText size={14} />
          Field of Interest
        </label>
        <textarea
          value={targetJobDescription}
          onChange={(e) => setTargetJobDescription(e.target.value)}
          placeholder="e.g., Artificial Intelligence, Web Development, Data Science..."
          className="w-full h-56 glass-card p-4 text-sm leading-relaxed resize-none focus:outline-none transition-all"
          style={{
            background: "rgba(10,10,26,0.7)",
            color: "var(--text-primary)",
            borderColor: targetJobDescription
              ? "var(--neon-purple)"
              : "var(--border-subtle)",
          }}
          id="job-desc-input"
        />
      </div>

      <div className="flex items-center gap-4 w-full max-w-md">
        <button onClick={prevStep} className="btn-secondary flex-1" id="back-step-3">
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => { if (canProceed) nextStep(); }}
          disabled={!canProceed}
          className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          id="next-step-3"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STEP 4: VIBE CHECK
   ══════════════════════════════════════════════════════ */
function StepVibeCheck() {
  const { vibeCheck, setVibeCheck, prevStep } = useOnboardingStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hourOptions = [2, 5, 10, 15, 20];
  const styleOptions: { value: LearningStyle; icon: typeof Eye; label: string }[] = [
    { value: "VISUAL", icon: Eye, label: "Video tutorials" },
    { value: "READING", icon: BookOpen, label: "Docs & articles" },
    { value: "HANDS_ON", icon: Wrench, label: "Build projects" },
    { value: "MIXED", icon: Shuffle, label: "Mix of everything" },
  ];
  const bottleneckOptions = [
    { value: "distraction", label: "I get distracted easily", icon: AlertTriangle },
    { value: "no-direction", label: "I don't know where to start", icon: Target },
    { value: "no-money", label: "No budget for paid courses", icon: DollarSign },
    { value: "no-time", label: "Too many commitments", icon: Clock },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate AI processing time — in production this calls Gemini 3 Pro
    await new Promise((r) => setTimeout(r, 2000));
    router.push("/results");
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Quick{" "}
          <span className="neon-text">vibe check</span>
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Be honest. This makes your roadmap actually fit your life.
        </p>
      </div>

      {/* Weekly hours */}
      <div className="w-full">
        <label
          className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          <Clock size={14} />
          Hours per week you can realistically dedicate
        </label>
        <div className="flex gap-3 flex-wrap">
          {hourOptions.map((h) => (
            <button
              key={h}
              onClick={() => setVibeCheck({ weeklyHours: h })}
              className="glass-card px-5 py-3 text-sm font-semibold transition-all cursor-pointer"
              style={{
                borderColor:
                  vibeCheck.weeklyHours === h
                    ? "var(--neon-cyan)"
                    : "var(--border-subtle)",
                color:
                  vibeCheck.weeklyHours === h
                    ? "var(--neon-cyan)"
                    : "var(--text-secondary)",
                boxShadow:
                  vibeCheck.weeklyHours === h
                    ? "var(--shadow-neon-cyan)"
                    : "none",
              }}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Learning style */}
      <div className="w-full">
        <label
          className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          <Brain size={14} />
          How do you learn best?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {styleOptions.map((s) => {
            const sel = vibeCheck.learningStyle === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setVibeCheck({ learningStyle: s.value })}
                className="glass-card p-4 flex items-center gap-3 text-sm font-medium transition-all cursor-pointer text-left"
                style={{
                  borderColor: sel
                    ? "var(--neon-purple)"
                    : "var(--border-subtle)",
                  color: sel
                    ? "var(--neon-purple)"
                    : "var(--text-secondary)",
                  boxShadow: sel ? "var(--shadow-neon-purple)" : "none",
                }}
              >
                <s.icon size={18} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Biggest bottleneck */}
      <div className="w-full">
        <label
          className="text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          <AlertTriangle size={14} />
          Biggest bottleneck right now?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {bottleneckOptions.map((b) => {
            const sel = vibeCheck.biggestBottleneck === b.value;
            return (
              <button
                key={b.value}
                onClick={() => setVibeCheck({ biggestBottleneck: b.value })}
                className="glass-card p-4 flex items-center gap-3 text-sm font-medium transition-all cursor-pointer text-left"
                style={{
                  borderColor: sel
                    ? "var(--neon-pink)"
                    : "var(--border-subtle)",
                  color: sel
                    ? "var(--neon-pink)"
                    : "var(--text-secondary)",
                }}
              >
                <b.icon size={18} />
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 w-full max-w-md mt-4">
        <button onClick={prevStep} className="btn-secondary flex-1" id="back-step-4">
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary flex-1 disabled:opacity-60"
          id="submit-reality-check"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Get My Reality Check
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN ONBOARDING PAGE
   ══════════════════════════════════════════════════════ */
export default function OnboardingPage() {
  const { currentStep, totalSteps } = useOnboardingStore();
  const [direction, setDirection] = useState(1);

  // Handle step change direction tracking
  const store = useOnboardingStore;
  const origNext = useOnboardingStore.getState().nextStep;
  const origPrev = useOnboardingStore.getState().prevStep;

  // Wrap navigation to track direction
  const handleNext = () => {
    setDirection(1);
    origNext();
  };
  const handlePrev = () => {
    setDirection(-1);
    origPrev();
  };

  // override in store for child components
  // (We use direct callbacks in the child components instead)

  const steps = [
    { num: 1, label: "Status" },
    { num: 2, label: "Baseline" },
    { num: 3, label: "Target" },
    { num: 4, label: "Vibe Check" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="orb orb-purple"
        style={{ width: 500, height: 500, top: -100, right: -150 }}
      />
      <div
        className="orb orb-cyan"
        style={{ width: 400, height: 400, bottom: 0, left: -100 }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--gradient-button)",
              boxShadow: "var(--shadow-neon-cyan)",
            }}
          >
            <Sparkles size={18} color="#050510" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight neon-text">
            NODENEXUS
          </span>
        </Link>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Step {currentStep} of {totalSteps}
        </span>
      </nav>

      {/* Progress bar */}
      <div className="relative z-10 px-6 md:px-16">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300"
                style={{
                  background:
                    currentStep >= s.num
                      ? "var(--gradient-button)"
                      : "rgba(255,255,255,0.05)",
                  color:
                    currentStep >= s.num
                      ? "#050510"
                      : "var(--text-muted)",
                  boxShadow:
                    currentStep === s.num
                      ? "var(--shadow-neon-cyan)"
                      : "none",
                }}
              >
                {s.num}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`step-line ${currentStep > s.num ? "active" : ""}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto flex justify-between mt-1 px-0.5">
          {steps.map((s) => (
            <span
              key={s.num}
              className="text-[10px] font-medium uppercase tracking-wide"
              style={{
                color:
                  currentStep >= s.num
                    ? "var(--neon-cyan)"
                    : "var(--text-muted)",
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 px-6 md:px-16 pt-12 pb-24 min-h-[70vh] flex items-start justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {currentStep === 1 && <StepStatus />}
            {currentStep === 2 && <StepSyllabus />}
            {currentStep === 3 && <StepTargetJob />}
            {currentStep === 4 && <StepVibeCheck />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
