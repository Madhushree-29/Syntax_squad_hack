"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, ChevronRight, AlertTriangle, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function Dashboard() {
  const { userId } = useUserStore();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push('/onboarding');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8002/api/student-history/${userId}`);
        const data = await res.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId, router]);

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Career Matches</h1>
          <p className="text-gray-400 text-lg">AI-tailored paths based on your unique profile.</p>
        </div>
        <button onClick={() => router.push('/chat')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition flex items-center gap-2 font-medium">
          Ask AI Counselor <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-gray-400 mb-4">No recommendations found.</p>
          <button onClick={() => router.push('/onboarding')} className="text-brand-400 hover:text-brand-300 underline font-medium">Update Profile Profile</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {recommendations.map((rec, i) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1a1a24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/10 bg-gradient-to-br from-brand-900/40 to-transparent">
                <div className="inline-flex p-3 rounded-xl bg-brand-500/20 text-brand-400 mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{rec.title}</h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{rec.description}</p>
              </div>
              
              <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Roadmap */}
                <div>
                  <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Action Plan
                  </h3>
                  <ul className="space-y-4">
                    {Array.isArray(rec.roadmap) && rec.roadmap.slice(0, 4).map((step: string, j: number) => (
                      <li key={j} className="flex gap-3 text-sm text-gray-300">
                         <span className="shrink-0 w-6 h-6 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-xs">{j+1}</span>
                         <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Gap */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                  <h3 className="text-sm font-bold tracking-widest text-red-400 uppercase mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                      {rec.skillGap && rec.skillGap.missing ? (
                          (rec.skillGap.missing as string[]).map((m: string, k: number) => (
                              <span key={k} className="px-3 py-1 bg-red-500/10 text-red-300 rounded-lg text-xs font-medium border border-red-500/20">{m}</span>
                          ))
                      ) : (
                          <span className="text-gray-500 text-xs">-</span>
                      )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
