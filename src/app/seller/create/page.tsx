"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from "@/components/ui/sparkles";
import LocationPicker from '@/components/LocationPicker';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const categories = [
  'Laptops', 'Smartphones', 'Monitors', 'Accessories', 'Appliances', 'Industrial', 'Batteries'
];

export default function CreateListing() {
  const { user, loading: authLoading } = useAuth('seller');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      condition: '',
      location: '',
      preciseLocation: null as any,
    });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/seller');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create listing');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030303]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore
          id="tsparticlescreate"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#10b981"
        />
      </div>
      <BackgroundBeams className="opacity-40" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/seller" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-500 mb-12 transition-all font-bold group">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-emerald-500/10 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            </div>
            Back to Hub
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-16 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-emerald-500/5"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-none">Initialize <span className="text-emerald-500">Asset</span></h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium max-w-xl leading-relaxed">Provide precise specifications for your electronic waste. Our neural classifier will verify hazard compliance automatically.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Asset Title</label>
              <Input 
                required
                placeholder="e.g. Bulk Enterprise Workstations (15 units)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-16 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all text-lg"
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Asset Stream</label>
                <Select onValueChange={(val) => setFormData({ ...formData, category: val })} required>
                  <SelectTrigger className="h-16 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all text-lg">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-xl">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Condition Profile</label>
                <Select onValueChange={(val) => setFormData({ ...formData, condition: val })} required>
                  <SelectTrigger className="h-16 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all text-lg">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="Working" className="rounded-xl">Verified Working</SelectItem>
                    <SelectItem value="Non-working" className="rounded-xl">Defective/Non-working</SelectItem>
                    <SelectItem value="Parts Only" className="rounded-xl">Harvestable Parts</SelectItem>
                    <SelectItem value="Mixed" className="rounded-xl">Mixed Condition Batch</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Precise Collection Origin</label>
              <div className="p-8 rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800">
                <LocationPicker 
                  onLocationSelect={(loc) => {
                    setFormData({
                      ...formData,
                      location: `${loc.area}, ${loc.city}`,
                      preciseLocation: loc
                    });
                  }}
                />
                <AnimatePresence>
                  {formData.preciseLocation && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="p-2 rounded-xl bg-emerald-500/10">
                          <MapPin className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">Target Address Locked</p>
                          <p className="text-sm font-medium leading-relaxed">{formData.preciseLocation.address}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Technical Inventory</label>
              <Textarea 
                required
                placeholder="List detailed specifications, model numbers, and quantity breakdowns..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-2xl min-h-[160px] bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all text-lg p-6"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button 
                disabled={loading}
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] h-20 text-xl font-black mt-4 shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Authorize Listing Deployment'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
