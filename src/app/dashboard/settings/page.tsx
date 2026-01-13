"use client";

import { useAuth } from '@/components/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Lock, 
  Zap,
  Globe,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user } = useAuth();

  const sections = [
    {
      title: 'Profile Settings',
      description: 'Manage your public presence and account information.',
      icon: User,
      fields: [
        { label: 'Display Name', value: user?.name, type: 'text' },
        { label: 'Email Address', value: user?.email, type: 'email' },
      ]
    },
    {
      title: 'Security',
      description: 'Control your authentication methods and account safety.',
      icon: Shield,
      fields: [
        { label: 'Role', value: user?.role, type: 'text', disabled: true },
        { label: 'Password', value: '••••••••', type: 'password' },
      ]
    },
    {
      title: 'Preferences',
      description: 'Customize your dashboard experience and notifications.',
      icon: Bell,
      items: [
        'Email Notifications',
        'Marketplace Updates',
        'Direct Messages'
      ]
    }
  ];

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-12">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Monitor className="w-3 h-3 mr-2" />
          <span>System Config</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-2">Account Settings</h1>
        <p className="text-zinc-500 font-medium">Configure your personal preferences and security credentials.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">{section.title}</h3>
                <p className="text-sm text-zinc-500 font-medium">{section.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.fields?.map((field, fIdx) => (
                <div key={fIdx} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      disabled={field.disabled}
                      className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-bold disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
              
              {section.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <span className="text-sm font-bold">{item}</span>
                      <div className="w-10 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 relative">
                        <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" className="px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs">Reset Changes</Button>
        <Button className="px-10 py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20">Save Configuration</Button>
      </div>
    </div>
  );
}
