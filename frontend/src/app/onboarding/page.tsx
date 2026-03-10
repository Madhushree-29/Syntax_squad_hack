"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function Onboarding() {
  const router = useRouter();
  const { setUserId, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    academicBg: '',
    goals: '',
    skills: '',
    interests: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Parse skills and interests by comma
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const interestsArray = formData.interests.split(',').map(s => s.trim()).filter(Boolean);
      
      const payload = { ...formData, skills: skillsArray, interests: interestsArray };

      const res = await fetch('http://localhost:8000/api/student-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to create profile');
      const data = await res.json();
      
      setUserId(data.user.id);
      setUser(data.user.name, data.user.email);
      
      // Trigger AI Analysis automatically
      await fetch('http://localhost:8000/api/career/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id })
      });

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Error saving profile or generating recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#1a1a24] border border-white/10 rounded-2xl p-8 shadow-xl"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Build Your Profile</h1>
          <p className="text-gray-400">Tell us about yourself so NODENEXUS can map your perfect career.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#12121c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#12121c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="john@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Academic Background</label>
            <input required value={formData.academicBg} onChange={e => setFormData({...formData, academicBg: e.target.value})} className="w-full bg-[#12121c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g. B.Tech in Computer Science, 3rd Year" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Career Goals</label>
            <input required value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} className="w-full bg-[#12121c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="e.g. Become a Machine Learning Engineer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Skills (comma separated)</label>
              <input value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-[#12121c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="Python, React, SQL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Interests (comma separated)</label>
              <input value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} className="w-full bg-[#12121c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="AI, Web3, Space Tech" />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold flex flex-row items-center justify-center gap-2 rounded-xl px-6 py-4 mt-8 transition-colors disabled:opacity-50"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Profile & Generating AI Matches...</> : <><ArrowRight className="w-5 h-5"/> Generate My Career Map</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
