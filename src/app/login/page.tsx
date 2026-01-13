"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from "@/components/ui/sparkles";
import { useAuth } from '@/components/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#030303] px-6 py-10 overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore
          id="tsparticleslogin"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={70}
          className="w-full h-full"
          particleColor="#10b981"
        />
      </div>
      <BackgroundBeams className="opacity-40" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Recycle className="w-3.5 h-3.5 mr-2 animate-spin-slow" />
            <span>Secure Access Point</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-3 leading-none">Welcome back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Enter your credentials to access the exchange.</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-emerald-500/5 group transition-all duration-500 hover:border-emerald-500/30"
        >
          <form onSubmit={handleLogin} className="space-y-7">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Email Address</label>
              <Input 
                type="email" 
                required 
                placeholder="name@company.com" 
                className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Password</label>
              <Input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16 rounded-2xl font-black text-lg mt-2 shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Authorize Access'}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            variants={itemVariants}
            className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800/50 text-center"
          >
            <p className="text-sm font-medium text-zinc-500 mb-2">Don't have an account?</p>
            <Link href="/register" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 group">
              Register new entity <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
