"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useOnboardingStore, AnalysisResult } from "@/lib/store";
import { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Play,
  Clock,
  ChevronRight,
  TrendingUp,
  Target,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// ── Removed DEMO_RESULT as we now fetch from the API ──

/* ── Animated Gauge SVG ── */
function HireabilityGauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 40) return "var(--neon-pink)";
    if (s < 70) return "var(--neon-orange)";
    return "var(--neon-green)";
  };

  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      <svg width="208" height="208" className="transform -rotate-90">
        <circle
          cx="104"
          cy="104"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
        />
        <motion.circle
          cx="104"
          cy="104"
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          style={{
            filter: `drop-shadow(0 0 8px ${getColor(score)})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-black"
          style={{ color: getColor(score) }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Hireability
        </span>
      </div>
    </div>
  );
}

/* ── Skill Badge ── */
function SkillBadge({
  skill,
  type,
}: {
  skill: string;
  type: "covered" | "partial" | "missing";
}) {
  const colors = {
    covered: { bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)", text: "var(--neon-green)" },
    partial: { bg: "rgba(255,140,0,0.1)", border: "rgba(255,140,0,0.3)", text: "var(--neon-orange)" },
    missing: { bg: "rgba(255,45,120,0.1)", border: "rgba(255,45,120,0.3)", text: "var(--neon-pink)" },
  };
  const icons = { covered: CheckCircle2, partial: AlertTriangle, missing: XCircle };
  const Icon = icons[type];
  const c = colors[type];

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <Icon size={12} />
      {skill}
    </div>
  );
}

export default function ResultsPage() {
  const { syllabusText, targetJobTitle, targetJobDescription, vibeCheck, completedTaskIds, toggleTaskCompletion } = useOnboardingStore();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            syllabusText,
            targetJobTitle,
            targetJobDescription,
            vibeCheck,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate AI analysis.");
        }

        setResult(data as AnalysisResult);
      } catch (err: any) {
        console.error("Analysis Error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    // Only run if we actually have data, prevent re-runs
    if (!result && !error) {
      fetchAnalysis();
    }
  }, [syllabusText, targetJobTitle, targetJobDescription, vibeCheck, result, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 relative">
        <div
          className="orb orb-cyan"
          style={{ width: 400, height: 400, top: "20%", left: "30%" }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 size={48} style={{ color: "var(--neon-cyan)" }} />
        </motion.div>
        <div className="text-center z-10">
          <h2 className="text-2xl font-bold mb-2">
            Running your <span className="neon-text">Reality Check</span>…
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            AI is comparing your syllabus against the job requirements.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative p-6">
        <div className="text-center z-10 glass-card p-8 neon-border">
          <XCircle size={48} className="mx-auto mb-4" color="var(--neon-pink)" />
          <h2 className="text-2xl font-bold mb-2">Analysis Failed</h2>
          <p className="mb-6" style={{ color: "var(--neon-pink)" }}>
            {error}
          </p>
          <Link href="/onboarding" className="btn-secondary">
            <ArrowLeft size={16} />
            Back to Onboarding
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -50, right: -100 }} />
      <div className="orb orb-pink" style={{ width: 300, height: 300, bottom: 100, left: -80 }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--gradient-button)", boxShadow: "var(--shadow-neon-cyan)" }}
          >
            <Sparkles size={18} color="#050510" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold neon-text">NODENEXUS</span>
        </Link>
        <Link href="/dashboard" className="btn-secondary" style={{ padding: "10px 24px", fontSize: "0.85rem" }}>
          Go to Dashboard
          <ChevronRight size={14} />
        </Link>
      </nav>

      <main className="relative z-10 px-6 md:px-16 pb-24 max-w-5xl mx-auto">
        {/* ── HERO: The Brutal Truth ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 text-xs font-semibold"
              style={{ borderColor: "var(--border-glow)", color: "var(--neon-cyan)" }}>
              <Target size={14} />
              Reality Check for: {targetJobTitle || "Junior Backend Engineer — Amazon"}
            </div>
            
            {result.suggestedRole && (
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 text-xs font-semibold"
                style={{ borderColor: "rgba(168, 85, 247, 0.4)", color: "rgb(192, 132, 252)" }}>
                <Sparkles size={14} />
                AI Suggests: {result.suggestedRole}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <HireabilityGauge score={result.hireabilityScore} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="glass-card p-6 max-w-2xl text-left"
              style={{ borderColor: "rgba(255,45,120,0.2)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <span className="font-bold" style={{ color: "var(--neon-pink)" }}>🔥 Hard truth: </span>
                {result.rawSummary}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* ── COVERAGE BREAKDOWN ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold mb-6">
            Skill Breakdown —{" "}
            <span className="neon-text">{result.coveragePercent}% covered</span>
          </h3>

          {/* Coverage bar */}
          <div className="glass-card p-5 mb-6">
            <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              <span>Your coverage</span>
              <span>{result.coveragePercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "var(--gradient-neon)",
                  boxShadow: "0 0 10px rgba(0,245,255,0.3)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${result.coveragePercent}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              />
            </div>
          </div>

          {/* Skill tags */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--neon-green)" }}>
                <CheckCircle2 size={16} />
                Covered ({result.coveredSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {result.coveredSkills.map((s) => (
                  <SkillBadge key={s.skill} skill={s.skill} type="covered" />
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--neon-orange)" }}>
                <AlertTriangle size={16} />
                Partial ({result.partialSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {result.partialSkills.map((s) => (
                  <SkillBadge key={s.skill} skill={s.skill} type="partial" />
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--neon-pink)" }}>
                <XCircle size={16} />
                Missing ({result.missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s) => (
                  <SkillBadge key={s.skill} skill={s.skill} type="missing" />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── WEEKEND ROADMAP ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6">
            Your <span className="neon-text">Weekend Roadmap</span>
          </h3>

          <div className="relative pl-8 md:pl-10 before:absolute before:inset-0 before:left-[15px] md:before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-[var(--neon-cyan)] before:to-[var(--neon-pink)] before:opacity-50 min-h-[200px]">
            {result.weekendRoadmap.map((weekend, wi) => {
              const allWeekendTasks = weekend.tasks.map(t => String(t.task));
              const allDone = allWeekendTasks.length > 0 && allWeekendTasks.every(t => completedTaskIds.includes(t));
              return (
              <motion.div
                key={weekend.weekend}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + wi * 0.15 }}
                className="relative mb-12 last:mb-0 glass-card p-6 neon-border"
              >
                {/* Map Node */}
                <div 
                  className="absolute -left-[45px] md:-left-[53px] top-6 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)] z-10"
                  style={{ background: "#050510", border: `2px solid ${allDone ? 'var(--neon-green)' : 'var(--neon-cyan)'}` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: allDone ? 'var(--neon-green)' : 'var(--neon-cyan)' }}></div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                      style={{
                        background: allDone ? "rgba(0,255,136,0.1)" : "rgba(0,245,255,0.1)",
                        border: `1px solid ${allDone ? 'rgba(0,255,136,0.2)' : 'rgba(0,245,255,0.2)'}`,
                        color: allDone ? "var(--neon-green)" : "var(--neon-cyan)",
                      }}
                    >
                      W{weekend.weekend}
                    </div>
                    <div>
                      <div className="font-semibold">{weekend.focus}</div>
                      <div className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <Clock size={11} />
                        {weekend.totalHours} hours total
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10">
                  {weekend.tasks.map((task, ti) => {
                    const taskId = String(task.task);
                    const isDone = completedTaskIds.includes(taskId);
                    return (
                    <div
                      key={ti}
                      className={`relative z-10 flex items-center gap-3 p-3 ml-8 rounded-xl transition-all cursor-pointer ${isDone ? 'bg-white/[0.05] opacity-60' : 'hover:bg-white/[0.02] bg-[#0A0A15]'}`}
                      style={{ border: `1px solid ${isDone ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)'}` }}
                      onClick={() => toggleTaskCompletion(taskId)}
                    >
                      {/* Connection to parent line */}
                      <div className="absolute -left-8 top-1/2 w-8 h-[2px] bg-white/10"></div>
                      
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                        style={{
                          background: isDone ? 'rgba(0,255,136,0.1)' : (task.type === "youtube" ? "rgba(255,0,0,0.1)" : "rgba(0,245,255,0.1)"),
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2 size={14} color="var(--neon-green)" />
                        ) : task.type === "youtube" ? (
                          <Play size={14} color="#ff4444" />
                        ) : (
                          <TrendingUp size={14} style={{ color: "var(--neon-cyan)" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isDone ? 'line-through text-gray-500' : ''} truncate`}>{task.task}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {task.duration}
                        </div>
                      </div>
                      {task.resource && (
                        <a
                          href={task.resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/[0.05]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  )})}
                </div>
              </motion.div>
            )})}
          </div>

          {/* CTA to Dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-12"
          >
            <Link href="/dashboard" className="btn-primary" id="go-to-dashboard">
              Track My Progress
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
