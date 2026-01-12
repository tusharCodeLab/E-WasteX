"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Briefcase,
  Loader2,
  Calendar,
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicProfilePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/profile?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030303]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-100">
      <h1 className="text-4xl font-black tracking-tighter mb-4">User Not Found</h1>
      <p className="text-zinc-500">The profile you are looking for does not exist.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <UserIcon className="w-12 h-12" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <ShieldCheck className="w-3 h-3 mr-2" />
                <span>Verified {profile.role}</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-2">{profile.name}</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xl font-medium max-w-xl mx-auto">
                {profile.bio || "This user hasn't provided a bio yet."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8 p-10 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-black tracking-tight mb-4">Professional Identity</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Organization</p>
                    <p className="font-bold text-lg">{profile.company || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Primary Location</p>
                    <p className="font-bold text-lg">{profile.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Member Since</p>
                    <p className="font-bold text-lg">{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10">
              <h2 className="text-2xl font-black tracking-tight mb-4">Interaction Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-950/50 flex items-center justify-center text-emerald-500 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Official Email</p>
                    <p className="font-bold text-lg">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-950/50 flex items-center justify-center text-emerald-500 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Phone Line</p>
                    <p className="font-bold text-lg">{profile.phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-3xl bg-white/50 dark:bg-zinc-950/50 border border-emerald-500/10">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Contact details are automatically verified. Interaction history is monitored to ensure the safety of our procurement network.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
