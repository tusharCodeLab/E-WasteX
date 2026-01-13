"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from "@/components/ui/sparkles";
import { useAuth } from '@/components/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'seller';
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
      } else {
        const data = await res.json();
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#030303] px-6 py-12 overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore
          id="tsparticlesregister"
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
            <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" />
            <span>Registration Portal</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-3 leading-none">Create Account</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Empower the circular economy today.</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-emerald-500/5 group transition-all duration-500 hover:border-emerald-500/30"
        >
          <form onSubmit={handleRegister} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Full Name</label>
              <Input 
                required 
                placeholder="John Doe" 
                className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Email Address</label>
              <Input 
                type="email" 
                required 
                placeholder="name@company.com" 
                className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Password</label>
              <Input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Account Role</label>
              <Select 
                defaultValue={initialRole}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="seller" className="rounded-xl">Sell e-Waste</SelectItem>
                  <SelectItem value="buyer" className="rounded-xl">Recycle/Buy e-Waste</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16 rounded-2xl font-black text-lg mt-4 shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Initialize Account'}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            variants={itemVariants}
            className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800/50 text-center"
          >
            <p className="text-sm font-medium text-zinc-500 mb-2">Already have an account?</p>
            <Link href="/login" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 group">
              Sign in to dashboard <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
