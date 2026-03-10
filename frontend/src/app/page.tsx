"use client";

import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-medium text-gray-300">Intelligent Career Mapping</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
          Navigate Your Future with <span className="text-gradient">NODENEXUS</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          AI-powered career guidance designed specifically for engineering students. Discover paths tailored strictly to your skills and passions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onboarding">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-lg flex items-center gap-2 transition-all shadow-[0_0_30px_-5px_#4f46e5]"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="#features">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/10 transition-colors"
            >
              Learn More
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Grids */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full z-10"
        id="features"
      >
        {[
          { icon: BrainCircuit, title: "AI Skill Analysis", desc: "Our engine maps your current abilities against industry standards to find your perfect fit." },
          { icon: Target, title: "Personalized Roadmaps", desc: "Get step-by-step guides on what courses to take and projects to build." },
          { icon: Sparkles, title: "Interactive Guidance", desc: "Chat with your 24/7 AI career counselor anytime you feel stuck or need advice." }
        ].map((feature, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
            <feature.icon className="w-10 h-10 text-brand-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
