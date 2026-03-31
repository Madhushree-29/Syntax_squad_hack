"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function Navbar() {
  const pathname = usePathname();
  const { userId, name, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  }

  return (
    <nav className="w-full h-20 border-b border-white/10 bg-[#12121c]/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center border border-brand-500/50 group-hover:bg-brand-600/40 transition-colors">
            <BrainCircuit className="w-6 h-6 text-brand-500" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            NODE<span className="text-brand-500">NEXUS (Set 3)</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {userId ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-brand-500' : 'text-gray-400 hover:text-white'}`}>
                Dashboard
              </Link>
              <Link href="/chat" className={`text-sm font-medium transition-colors ${pathname === '/chat' ? 'text-brand-500' : 'text-gray-400 hover:text-white'}`}>
                AI Counselor
              </Link>
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <span className="text-sm text-gray-300">Hi, {name}</span>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">Logout</button>
              </div>
            </>
          ) : (
            <Link href="/onboarding" className="px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Start Journey
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
