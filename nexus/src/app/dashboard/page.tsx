"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store";
import {
  Home,
  Map,
  Library,
  Settings,
  GraduationCap,
  Target,
  Trophy,
  TrendingUp,
  Crosshair,
  BarChart,
  Award,
  CheckSquare,
  ChevronRight,
  Bell,
  Search,
  Loader2
} from "lucide-react";

/* ── Animated Central Gauge ── */
function CentralRing({ score }: { score: number }) {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg width="256" height="256" className="transform -rotate-90">
          <circle
            cx="128" cy="128" r={radius}
            fill="none"
            stroke="#FFF9E5"
            strokeWidth="16"
          />
          <motion.circle
            cx="128" cy="128" r={radius}
            fill="none"
            stroke="#FDB813"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="block text-5xl font-black text-[#333333] mb-1">
              {score}%
            </span>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Profile<br />Completion
            </span>
          </motion.div>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center text-[#333333] font-medium"
      >
        You are almost ready for your next big step!
      </motion.p>
    </div>
  );
}

/* ── Reusable Bento Card ── */
function BentoCard({
  title,
  icon: Icon,
  className,
  children,
  delay = 0
}: {
  title: string;
  icon: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#FFF9E5] flex items-center justify-center text-[#FDB813]">
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <h3 className="font-bold text-[#333333] text-lg">{title}</h3>
      </div>
      <div className="flex-1 w-full flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
}

/* ── Small Circular Progress ── */
function MiniProgress({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center justify-between w-full mb-3">
      <span className="text-sm font-medium text-gray-600 truncate max-w-[100px]" title={label}>{label}</span>
      <div className="flex items-center gap-3 w-32 shrink-0">
        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-[#FDB813]"
          />
        </div>
        <span className="text-xs font-bold text-[#333333] w-8 text-right">{value}%</span>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function DashboardPage() {
  const router = useRouter();
  const { analysisResult, targetJobTitle, userStatus, vibeCheck } = useOnboardingStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Fallback Mock Data so the Dashboard always renders its beautiful UI
    // even if the user hasn't set the GEMINI_API_KEY yet.
    if (!analysisResult) {
      useOnboardingStore.setState({
        userStatus: "DEGREE_STUDENT",
        targetJobTitle: "Junior Software Engineer",
        vibeCheck: { weeklyHours: 15, learningStyle: "MIXED", biggestBottleneck: "No direction", budgetConstraint: true },
        analysisResult: {
          coveragePercent: 75,
          hireabilityScore: 68,
          coveredSkills: [
            { skill: "React.js", syllabusDepth: "", jobRelevance: "required" },
            { skill: "JavaScript", syllabusDepth: "", jobRelevance: "required" },
            { skill: "HTML/CSS", syllabusDepth: "", jobRelevance: "required" },
            { skill: "Node.js", syllabusDepth: "", jobRelevance: "preferred" },
            { skill: "Git/GitHub", syllabusDepth: "", jobRelevance: "required" }
          ],
          partialSkills: [
            { skill: "TypeScript", syllabusDepth: "", jobRelevance: "preferred", gap: "" },
            { skill: "PostgreSQL", syllabusDepth: "", jobRelevance: "required", gap: "" }
          ],
          missingSkills: [
            { skill: "System Design", jobRelevance: "preferred", priority: 1, estimatedHours: 10, weekendPlan: "" },
            { skill: "AWS/Cloud", jobRelevance: "preferred", priority: 2, estimatedHours: 15, weekendPlan: "" },
            { skill: "CI/CD", jobRelevance: "nice-to-have", priority: 3, estimatedHours: 5, weekendPlan: "" }
          ],
          weekendRoadmap: [
            {
              weekend: 1, focus: "System Design Basics", totalHours: 10, tasks: [
                { task: "Understand Client-Server Architecture", resource: "https://roadmap.sh/guides/client-server", type: "article", duration: "2h" },
                { task: "Learn about Load Balancing", resource: "https://www.youtube.com/watch?v=K0Ta65OqQkY", type: "youtube", duration: "3h" }
              ]
            },
            {
              weekend: 2, focus: "Cloud Foundations", totalHours: 15, tasks: [
                { task: "Deploy an app on AWS EC2", resource: "https://aws.amazon.com/getting-started/hands-on/deploy-app-ec2/", type: "project", duration: "5h" },
                { task: "Set up S3 Object Storage", resource: "https://aws.amazon.com/s3/getting-started/", type: "project", duration: "3h" }
              ]
            }
          ],
          rawSummary: "You have a strong foundation in modern frontend web development, but you need to bridge the gap in backend architecture and deployment to reach full-stack readiness. Your immediate focus should be understanding cloud architecture and system design principles."
        }
      });
    }
  }, [analysisResult, router]);

  // Loading state while mounting
  if (!isMounted || !analysisResult) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#FDB813] mb-4" size={48} />
        <span className="font-bold text-[#333333]">Loading Dashboard...</span>
      </div>
    );
  }

  const coveredCount = analysisResult.coveredSkills.length;
  const missingCount = analysisResult.missingSkills.length;
  const partialCount = analysisResult.partialSkills.length;
  const totalSkills = coveredCount + missingCount + partialCount;

  // Aggregate tasks from the weekend plan
  const upcomingTasks = analysisResult.weekendRoadmap.flatMap(w => w.tasks).slice(0, 4);

  return (
    <div className="min-h-screen bg-amber-50 flex font-sans text-[#333333]">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col py-8 px-6 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-[#FDB813] flex items-center justify-center shadow-md">
            <span className="font-extrabold text-white text-xl">N</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-[#333333]">NODENEXUS</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Map, label: "My Path", active: false, href: "/results" },
            { icon: Library, label: "Resources", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href || "#"}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium ${item.active
                ? "bg-[#FFF9E5] text-[#FDB813]"
                : "text-gray-500 hover:bg-gray-50 hover:text-[#333333]"
                }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="bg-[#FFF9E5] p-4 rounded-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#FDB813] opacity-10 rounded-full blur-xl"></div>
            <h4 className="font-bold text-[#333333] mb-1">Need help?</h4>
            <p className="text-sm text-gray-600 mb-3">Talk to an advisor today.</p>
            <button className="w-full bg-[#FDB813] text-white font-bold py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              Book Call
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 md:ml-64 relative">
        {/* Top Navbar */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 bg-amber-50/80 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-black text-[#333333]">Career Planning</h1>
            <p className="text-sm font-medium text-gray-500">Welcome back. Let's map your future.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 border border-gray-200 hover:text-[#FDB813] transition-colors">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 border border-gray-200 hover:text-[#FDB813] transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#FDB813] border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold shadow-md cursor-pointer">
              ME
            </div>
          </div>
        </header>

        {/* Dashboard Grid Container */}
        <div className="p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-5rem)] pb-24">

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-full auto-rows-[minmax(250px,auto)]">

            {/* R1C1: Education / Profile Status */}
            <BentoCard title="Current Status" icon={GraduationCap} delay={1}>
              <div className="space-y-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {userStatus === "DEGREE_STUDENT" ? "SU" : userStatus === "WORKING_PROFESSIONAL" ? "WP" : "ST"}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#333333] capitalize">
                      {userStatus?.replace("_", " ").toLowerCase() || "Student"}
                    </h4>
                    <p className="text-xs text-gray-500">{vibeCheck?.weeklyHours}h / week avail.</p>
                  </div>
                </div>
                <Link href="/results" className="block bg-[#FFF9E5] border border-[#FDB813]/20 rounded-lg p-3 cursor-pointer hover:bg-[#FDB813] hover:text-white transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#FDB813] group-hover:text-white transition-colors">View Final Roadmap</span>
                    <ChevronRight size={16} className="text-[#FDB813] group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </div>
            </BentoCard>

            {/* R1C2: Feedback / AI Summary */}
            <BentoCard title="AI Feedback" icon={Target} delay={2}>
              <div className="flex flex-col items-center justify-center h-full relative px-2">
                <span className="text-4xl font-serif text-[#FDB813] opacity-20 absolute top-0 left-0 leading-none">"</span>
                <p className="text-sm font-medium italic text-gray-600 line-clamp-4 leading-relaxed z-10 w-full">
                  {analysisResult.rawSummary}
                </p>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest self-center">
                  Reality Check
                </div>
              </div>
            </BentoCard>

            {/* CENTRAL HERO (R1C2-R2C3 span) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 md:col-span-2 md:row-span-2 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FDB813] to-transparent opacity-50"></div>
              <CentralRing score={analysisResult.hireabilityScore} />
            </motion.div>

            {/* R1C4: Success (Stats) */}
            <BentoCard title="Success" icon={Trophy} delay={3}>
              <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-3xl font-black text-[#FDB813] mb-1">{coveredCount}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-center gap-1">Covered <Award size={10} /></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-3xl font-black text-red-400 mb-1">{missingCount}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Missing</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 col-span-2 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Syllabus Coverage</div>
                    <div className="text-lg font-black text-[#333333]">{analysisResult.coveragePercent}%</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FFF9E5] text-[#FDB813] flex items-center justify-center">
                    🔥
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* R2C1: Define Goals (Missing Skills) */}
            <BentoCard title="Goals & Gaps" icon={Crosshair} delay={4}>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
                {analysisResult.missingSkills.slice(0, 4).map((goal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#FDB813]' : 'bg-gray-300'}`}></div>
                    <div className="flex-1 w-full min-w-0">
                      <h4 className={`text-sm font-semibold truncate ${i === 0 ? 'text-[#333333]' : 'text-gray-500'}`} title={goal.skill}>{goal.skill}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-md uppercase shrink-0">
                      {goal.estimatedHours}h
                    </span>
                  </div>
                ))}
                {missingCount === 0 && <p className="text-sm text-gray-400">You're fully equipped!</p>}
              </div>
            </BentoCard>

            {/* R2C4: Career Ladder (Target Role) */}
            <BentoCard title="Career Target" icon={TrendingUp} delay={5} className="md:col-start-4">
              <div className="relative pl-4 border-l-2 border-gray-100 flex flex-col gap-6 py-2">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-[#FDB813] border-[#FDB813]"></div>
                  <h4 className="text-sm font-bold text-[#FDB813]">
                    {targetJobTitle || "Your Goal Role"}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Target Job</p>
                </div>
                <div className="relative opacity-50">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-white border-gray-300"></div>
                  <h4 className="text-sm font-bold text-gray-400">
                    Current Hireability
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{analysisResult.hireabilityScore}% Ready</p>
                </div>
              </div>
            </BentoCard>

            {/* R3C1: Qualification */}
            <BentoCard title="Qualification" icon={Award} delay={6}>
              <div className="w-full h-full flex flex-col justify-center gap-2">
                {analysisResult.coveredSkills.slice(0, 4).map((skill, i) => (
                  <MiniProgress
                    key={i}
                    value={skill.jobRelevance === 'required' ? 100 : skill.jobRelevance === 'preferred' ? 80 : 50}
                    label={skill.skill}
                  />
                ))}
                {coveredCount === 0 && <p className="text-sm text-gray-400">No covered skills from syllabus.</p>}
              </div>
            </BentoCard>

            {/* R3C2: Strengths & Weaknesses (Split Bar) */}
            <BentoCard title="Skill Relevancy" icon={BarChart} delay={7} className="md:col-span-2">
              <div className="flex items-center h-full gap-8">

                {/* Positives */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#333333]">Syllabus Relevance</span>
                      <span className="text-[#FDB813]">{analysisResult.coveragePercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FDB813] rounded-full" style={{ width: `${analysisResult.coveragePercent}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#333333]">Required Found</span>
                      <span className="text-[#FDB813]">
                        {totalSkills > 0 ? Math.round((coveredCount / totalSkills) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FDB813] rounded-full" style={{ width: `${totalSkills > 0 ? (coveredCount / totalSkills) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-32 bg-gray-100 hidden md:block"></div>

                {/* Negatives */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-500">Missing Gap</span>
                      <span className="text-gray-400">
                        {totalSkills > 0 ? Math.round((missingCount / totalSkills) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-red-300 rounded-full" style={{ width: `${totalSkills > 0 ? (missingCount / totalSkills) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-500">Partial Overlap</span>
                      <span className="text-gray-400">
                        {totalSkills > 0 ? Math.round((partialCount / totalSkills) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: `${totalSkills > 0 ? (partialCount / totalSkills) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </BentoCard>

            {/* R3C4: Checklist */}
            <BentoCard title="Checklist Tasks" icon={CheckSquare} delay={8}>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {upcomingTasks.length > 0 ? upcomingTasks.map((task, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors bg-white border-gray-300 text-transparent group-hover:border-[#FDB813] shrink-0`}>
                      <CheckSquare size={14} className="opacity-0" />
                    </div>
                    <span className="text-sm font-medium text-[#333333] line-clamp-2" title={task.task}>
                      {task.task}
                    </span>
                  </label>
                )) : (
                  <p className="text-sm text-gray-500">No scheduled tasks yet.</p>
                )}
              </div>
            </BentoCard>

          </div>
        </div>
      </main>
    </div>
  );
}
