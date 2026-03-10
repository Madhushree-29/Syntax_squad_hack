"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Target,
  TrendingUp,
  Bell,
  Clock,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Users,
  ChevronRight,
  Play,
  ExternalLink,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

/* ── Animated Gauge ── */
function DashGauge({ score, label }: { score: number; label: string }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 40) return "var(--neon-pink)";
    if (s < 70) return "var(--neon-orange)";
    return "var(--neon-green)";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg width="144" height="144" className="transform -rotate-90">
          <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
          <motion.circle
            cx="72" cy="72" r={radius} fill="none" stroke={getColor(score)} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${getColor(score)})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-black"
            style={{ color: getColor(score) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"roadmap" | "notifications">("roadmap");

  // Demo data
  type ItemStatus = "completed" | "in-progress" | "not-started";
  const roadmapItems: { id: number; skill: string; status: ItemStatus; hours: number; progress: number }[] = [
    { id: 1, skill: "Docker & Containerization", status: "completed", hours: 6, progress: 100 },
    { id: 2, skill: "Git & Version Control", status: "completed", hours: 3, progress: 100 },
    { id: 3, skill: "REST API Design", status: "in-progress", hours: 5, progress: 60 },
    { id: 4, skill: "AWS Cloud Fundamentals", status: "not-started", hours: 8, progress: 0 },
    { id: 5, skill: "Node.js Backend Dev", status: "not-started", hours: 10, progress: 0 },
  ];

  const statusConfigMap: Record<ItemStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
    completed: { icon: CheckCircle2, color: "var(--neon-green)", label: "Done" },
    "in-progress": { icon: TrendingUp, color: "var(--neon-cyan)", label: "In Progress" },
    "not-started": { icon: Circle, color: "var(--text-muted)", label: "Not Started" },
  };

  const notifications = [
    {
      id: 1,
      type: "market_alert",
      title: "New internship at Stripe!",
      body: "Requires React + Node.js. You're 65% ready — 2hr course to close the gap.",
      time: "2 hours ago",
      icon: Zap,
      color: "var(--neon-cyan)",
    },
    {
      id: 2,
      type: "peer_match",
      title: "Peer match found!",
      body: "Aisha K. is also learning REST APIs this weekend. Connect?",
      time: "5 hours ago",
      icon: Users,
      color: "var(--neon-purple)",
    },
    {
      id: 3,
      type: "streak",
      title: "🔥 3-day streak!",
      body: "You've been consistent. Keep it up — Docker is almost done.",
      time: "1 day ago",
      icon: Flame,
      color: "var(--neon-orange)",
    },
  ];

  const totalHours = roadmapItems.reduce((a, b) => a + b.hours, 0);
  const completedHours = roadmapItems
    .filter((i) => i.status === "completed")
    .reduce((a, b) => a + b.hours, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-cyan" style={{ width: 400, height: 400, top: -100, right: -100 }} />
      <div className="orb orb-purple" style={{ width: 300, height: 300, bottom: 50, left: -80 }} />

      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--gradient-button)", boxShadow: "var(--shadow-neon-cyan)" }}
          >
            <Sparkles size={18} color="#050510" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold neon-text">Nexus</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/onboarding"
            className="text-sm font-medium transition-colors hover:text-[var(--neon-cyan)]"
            style={{ color: "var(--text-secondary)" }}
          >
            + New Check
          </Link>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "var(--gradient-button)",
              color: "#050510",
            }}
          >
            PM
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-6 md:px-16 pb-24 max-w-6xl mx-auto">
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 pt-4"
        >
          <h1 className="text-3xl font-bold mb-1">
            Your <span className="neon-text">Pilot Dashboard</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Target: <strong style={{ color: "var(--text-primary)" }}>Junior Backend Engineer — Amazon</strong>
          </p>
        </motion.div>

        {/* ── TOP STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {/* Hireability Gauge */}
          <div className="glass-card p-6 flex items-center justify-center col-span-2 lg:col-span-1 row-span-2">
            <DashGauge score={52} label="Hireability Score" />
          </div>

          {/* Stats Cards */}
          {[
            {
              icon: CheckCircle2,
              label: "Skills Closed",
              value: "2 / 5",
              color: "var(--neon-green)",
            },
            {
              icon: Clock,
              label: "Hours Invested",
              value: `${completedHours}h / ${totalHours}h`,
              color: "var(--neon-cyan)",
            },
            {
              icon: Flame,
              label: "Current Streak",
              value: "3 days",
              color: "var(--neon-orange)",
            },
            {
              icon: BarChart3,
              label: "Weekly Progress",
              value: "+12%",
              color: "var(--neon-purple)",
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── TABS ── */}
        <div className="flex gap-1 mb-6">
          {[
            { key: "roadmap" as const, label: "Active Roadmap", icon: BookOpen },
            { key: "notifications" as const, label: "Notifications", icon: Bell, badge: 3 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={{
                background: activeTab === tab.key ? "rgba(0,245,255,0.1)" : "transparent",
                borderColor: activeTab === tab.key ? "var(--neon-cyan)" : "transparent",
                color: activeTab === tab.key ? "var(--neon-cyan)" : "var(--text-muted)",
                border: `1px solid ${activeTab === tab.key ? "rgba(0,245,255,0.2)" : "transparent"}`,
              }}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.badge && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "var(--neon-pink)",
                    color: "#fff",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── ROADMAP TAB ── */}
        {activeTab === "roadmap" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
          >
            {roadmapItems.map((item, i) => {
              const statusConfig = statusConfigMap[item.status];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-5 flex items-center gap-5 group cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${statusConfig.color}15`,
                      border: `1px solid ${statusConfig.color}30`,
                    }}
                  >
                    <statusConfig.icon size={20} color={statusConfig.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-sm">{item.skill}</span>
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${statusConfig.color}15`,
                          color: statusConfig.color,
                        }}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: statusConfig.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                        {item.hours}h est.
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--text-muted)" }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
          >
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 flex items-start gap-4 cursor-pointer group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `${notif.color}15`,
                    border: `1px solid ${notif.color}30`,
                  }}
                >
                  <notif.icon size={20} color={notif.color} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">{notif.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {notif.body}
                  </p>
                  <span className="text-[10px] mt-2 inline-block" style={{ color: "var(--text-muted)" }}>
                    {notif.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
