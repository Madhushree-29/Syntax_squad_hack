"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Target,
  Brain,
  TrendingUp,
  Users,
  Mic,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: Target,
    title: "Reality Check",
    desc: "See the brutal truth — exactly how much of the job you're actually prepared for.",
    color: "var(--neon-cyan)",
  },
  {
    icon: Zap,
    title: "Weekend Roadmaps",
    desc: "3 crash courses. One weekend. Close the gap before Monday.",
    color: "var(--neon-purple)",
  },
  {
    icon: Brain,
    title: "AI Skill-Map",
    desc: "3D node graph showing how your theory connects to real-world jobs.",
    color: "var(--neon-pink)",
  },
  {
    icon: TrendingUp,
    title: "Market Alerts",
    desc: "Live notifications matching your progress to new internship openings.",
    color: "var(--neon-green)",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    desc: "Voice AI that grills you on exactly the gaps you just closed.",
    color: "var(--neon-orange)",
  },
  {
    icon: Users,
    title: "Peer Matching",
    desc: "Auto-connect with 2 others learning the same thing this weekend.",
    color: "var(--neon-blue)",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="orb orb-cyan"
        style={{ width: 600, height: 600, top: -100, right: -200 }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 500, height: 500, top: 300, left: -200 }}
      />
      <div
        className="orb orb-pink"
        style={{ width: 400, height: 400, bottom: 50, right: 100 }}
      />

      {/* ── NAV ── */}
      <nav className="relative z-10 grid grid-cols-3 items-center px-6 md:px-16 py-5">
        {/* Empty placeholder for flex alignment */}
        <div></div>

        {/* Centered Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--gradient-button)",
              boxShadow: "var(--shadow-neon-cyan)",
            }}
          >
            <Sparkles size={18} color="#050510" strokeWidth={2.5} />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="neon-text">NODENEXUS</span>
          </span>
        </Link>
        
        {/* Right Action */}
        <div className="flex justify-end items-center gap-4">
          <Link
            href="/onboarding"
            className="btn-secondary"
            style={{ padding: "10px 24px", fontSize: "0.85rem" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 md:pt-32 md:pb-40">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8 max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="glass-card px-5 py-2 flex items-center gap-2 text-sm"
            style={{ borderColor: "var(--border-glow)" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--neon-green)" }}
            />
            <span style={{ color: "var(--text-secondary)" }}>
              AI-Powered Career Gap Analysis
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white"
          >
            Your degree covers{" "}
            <span className="neon-text">40%</span> of the job.
            <br />
            <span style={{ color: "rgba(255,255,255,0.95)" }}>
              We&apos;ll fix the rest.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl max-w-2xl leading-relaxed mt-4 font-medium"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Upload your syllabus. Paste your dream job. Get a{" "}
            <strong style={{ color: "var(--neon-cyan)", textShadow: "0 0 10px rgba(0, 255, 255, 0.5)"}}>
              brutally honest gap analysis
            </strong>{" "}
            and a weekend-sized roadmap with the exact crash courses to close it.
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          >
            <Link href="/onboarding" className="btn-primary" id="hero-cta">
              Get Your Reality Check
              <ChevronRight size={18} />
            </Link>
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Free • No sign-up required
            </span>
          </motion.div>

          {/* Innovative Highlights */}
          <motion.div
            custom={4}
            variants={fadeUp}
            className="w-full max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { 
                title: "Precision Gap Analysis", 
                text: "AI pinpoints your exact skill deficits instantly with brutal honesty.", 
                icon: Target, 
                color: "var(--neon-cyan)",
                shadow: "rgba(0, 255, 255, 0.4)"
              },
              { 
                title: "Accelerated Learning", 
                text: "Compress months of learning into focused weekend crash courses.", 
                icon: Zap, 
                color: "var(--neon-purple)",
                shadow: "rgba(186, 85, 211, 0.4)"
              },
              { 
                title: "Real-World Application", 
                text: "Connect theory directly to practical, high-paying engineering roles.", 
                icon: Brain, 
                color: "var(--neon-pink)",
                shadow: "rgba(255, 105, 180, 0.4)"
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-2xl p-[1px] group cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}50 0%, transparent 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-full bg-black/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center text-center border border-white/5 group-hover:border-white/20 transition-all duration-300">
                  <div
                    className="w-16 h-16 mb-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      background: `${feature.color}15`, 
                      border: `1px solid ${feature.color}40`,
                      boxShadow: `0 0 25px ${feature.shadow}` 
                    }}
                  >
                    <feature.icon size={32} color={feature.color} strokeWidth={2} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3 tracking-wide" 
                    style={{ color: "#ffffff", textShadow: `0 0 15px ${feature.shadow}` }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-base font-medium leading-relaxed" 
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {feature.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section
        className="relative z-10 px-6 md:px-16 pb-32"
        id="features"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-center mb-4"
          >
            Not just a gap check.{" "}
            <span className="neon-text">A full career engine.</span>
          </motion.h2>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-center mb-16 max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Every feature is designed to get you hired faster — with zero fluff.
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i + 2}
                variants={fadeUp}
                className="glass-card p-7 flex flex-col gap-4 cursor-default group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                  }}
                >
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 px-6 md:px-16 pb-32" id="how-it-works">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            How it works —{" "}
            <span className="neon-text">under 2 minutes</span>
          </motion.h2>

          <div className="flex flex-col gap-8">
            {[
              {
                step: "01",
                title: "Tell us who you are",
                desc: "Student? Self-taught? Professional? This sets your baseline.",
                color: "var(--neon-cyan)",
              },
              {
                step: "02",
                title: "Paste your syllabus",
                desc: 'Or list your current skills. We parse what you already know.',
                color: "var(--neon-purple)",
              },
              {
                step: "03",
                title: "Paste your dream job",
                desc: "Copy-paste the exact JD. The AI extracts every required skill.",
                color: "var(--neon-pink)",
              },
              {
                step: "04",
                title: "Get the brutal truth",
                desc: '"Your syllabus covers 40%. Here are the 3 weekend crash courses to fix it."',
                color: "var(--neon-green)",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                custom={i + 1}
                variants={fadeUp}
                className="glass-card p-6 flex items-start gap-6 group"
              >
                <div
                  className="text-3xl font-black shrink-0 w-14 text-center transition-colors"
                  style={{ color: step.color }}
                >
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={6}
            variants={fadeUp}
            className="text-center mt-14"
          >
            <Link href="/onboarding" className="btn-primary" id="cta-bottom">
              Start My Reality Check
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: "var(--neon-cyan)" }} />
          <span className="text-sm font-semibold neon-text">NODENEXUS</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 NODENEXUS. Built for engineers who refuse to be irrelevant.
        </p>
      </footer>
    </div>
  );
}
