"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Briefcase,
  Loader2,
  Save,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    company: '',
    location: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
            company: data.company || '',
            location: data.location || '',
            phone: data.phone || '',
            website: data.website || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }


  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030303]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="py-12 px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <UserIcon className="w-3 h-3 mr-2" />
                <span>Personal Identity</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">User Profile</h1>
              <p className="text-zinc-500 font-medium">Manage how you appear to others on the exchange.</p>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 font-black transition-all active:scale-95"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Public Information
              </h2>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Full Name</label>
                <Input 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="rounded-xl h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Bio / Description</label>
                <Textarea 
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="rounded-xl min-h-[120px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  placeholder="Tell us about your organization or recycling goals..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Company</label>
                  <Input 
                    value={profile.company} 
                    onChange={e => setProfile({...profile, company: e.target.value})}
                    className="rounded-xl h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Location</label>
                  <Input 
                    value={profile.location} 
                    onChange={e => setProfile({...profile, location: e.target.value})}
                    className="rounded-xl h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Contact Details
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-auto">(Private)</span>
              </h2>

              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Email Address</label>
                <Input 
                  value={profile.email} 
                  disabled
                  className="rounded-xl h-12 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Phone Number</label>
                <Input 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="rounded-xl h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Website</label>
                <Input 
                  value={profile.website} 
                  onChange={e => setProfile({...profile, website: e.target.value})}
                  className="rounded-xl h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Contact details are only shared with partners after you both agree to interact on a specific listing.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
