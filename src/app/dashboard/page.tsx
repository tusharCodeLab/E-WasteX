"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck,
  Zap,
  Globe,
  Leaf,
  Loader2,
  ArrowUpRight,
  Activity,
  ChevronRight,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function UserOverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats/user');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          </div>
        </div>
      );
    }


  const { stats, impact, categoryStats, activityData } = data || {
    stats: { activeCount: 0, messageCount: 0, completedCount: 0, impactScore: 0 },
    impact: { eWasteDiverted: 0, carbonSaved: 0, mineralsRecovered: 0 },
    categoryStats: [],
    activityData: []
  };

    const statCards = [
      { 
        label: user?.role === 'seller' ? 'Active Inventory' : 'Open Acquisitions', 
        value: stats.activeCount, 
        icon: user?.role === 'seller' ? Package : ShoppingBag, 
        color: 'blue',
        hoverBg: 'hover:bg-blue-500/10 hover:border-blue-500/50',
        iconColor: 'text-blue-500',
        trend: '+4%'
      },
      { 
        label: 'Network Interactions', 
        value: stats.messageCount, 
        icon: MessageSquare, 
        color: 'purple',
        hoverBg: 'hover:bg-purple-500/10 hover:border-purple-500/50',
        iconColor: 'text-purple-500',
        trend: 'Real-time'
      },
      { 
        label: 'Completed Cycles', 
        value: stats.completedCount, 
        icon: ShieldCheck, 
        color: 'emerald',
        hoverBg: 'hover:bg-emerald-500/10 hover:border-emerald-500/50',
        iconColor: 'text-emerald-500',
        trend: '+12%'
      },
      { 
        label: 'Efficiency Quotient', 
        value: `${stats.impactScore}%`, 
        icon: Target, 
        color: 'orange',
        hoverBg: 'hover:bg-orange-500/10 hover:border-orange-500/50',
        iconColor: 'text-orange-500',
        trend: 'Optimized'
      },
    ];

    return (
      <div className="p-10 lg:p-16 max-w-[1600px] mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>System Operational</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]"
            >
              Dashboard Overview<br />
              <span className="text-zinc-400">Welcome, {user?.name?.split(' ')[0]}</span>
            </motion.h1>
            <p className="text-zinc-500 font-bold text-lg max-w-xl">
              Monitoring your environmental footprint and platform velocity through high-fidelity analytics.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:border-emerald-500/30 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 group-hover:rotate-[15deg] transition-transform duration-500">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Impact Rating</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{stats.impactScore}<span className="text-sm ml-1 text-zinc-400 font-bold">AAA+</span></p>
            </div>
          </motion.div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className={`p-10 rounded-[3rem] bg-white dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 group transition-all duration-700 relative overflow-hidden ${stat.hoverBg}`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                <stat.icon className={`w-24 h-24 ${stat.iconColor} -rotate-12`} />
              </div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner`}>
                  <stat.icon className={`w-6 h-6 text-zinc-400 ${stat.iconColor} transition-colors duration-500`} />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${stat.iconColor} border-current opacity-60`}>Verified</span>
                  <p className="text-[10px] font-black text-zinc-300 mt-1 uppercase tracking-widest">Q4 2024</p>
                </div>
              </div>
              
              <div className="space-y-1 relative z-10">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">{stat.label}</p>
                  <span className={`text-[9px] font-black ${stat.iconColor} flex items-center gap-0.5`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2 p-10 rounded-[3.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 relative z-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-500" />
                Performance Velocity
              </h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time throughput analysis</p>
            </div>
            <div className="flex gap-4 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50">
              <button className="px-5 py-2 rounded-xl bg-white dark:bg-zinc-700 text-[10px] font-black uppercase tracking-widest shadow-sm">Daily</button>
              <button className="px-5 py-2 rounded-xl text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors">Weekly</button>
            </div>
          </div>
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800 opacity-50" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#71717a' }} 
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '16px', padding: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}
                  labelStyle={{ fontSize: '9px', color: '#71717a', marginBottom: '4px', fontWeight: '900', textTransform: 'uppercase' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorActive)" 
                  strokeWidth={4}
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorImpact)"
                  strokeWidth={4} 
                  strokeDasharray="0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-10 rounded-[3.5rem] bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe className="w-40 h-40 animate-spin-slow" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-emerald-500" />
              Asset Distribution
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-12">Flow by specialized category</p>
            
            <div className="flex-1 space-y-8">
              {categoryStats.length > 0 ? categoryStats.slice(0, 4).map((cat: any, i: number) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest">{cat.category}</span>
                    <span className="text-lg font-black">{cat.count} units</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 dark:bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (cat.count / 10) * 100)}%` }}
                      transition={{ duration: 1, delay: 1 + i * 0.1 }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full py-12 opacity-50">
                  <Package className="w-12 h-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No data available</p>
                </div>
              )}
            </div>

            <button className="mt-12 w-full py-5 rounded-[1.5rem] bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:gap-5 transition-all group">
              Audit Full Inventory
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ESG Impact Footer Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-16 rounded-[4rem] bg-gradient-to-br from-zinc-50 via-zinc-50 to-emerald-500/5 dark:from-zinc-900/40 dark:via-zinc-900/40 dark:to-emerald-500/10 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
          <Leaf className="w-80 h-80 text-emerald-500 -rotate-12" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
              <Globe className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter leading-none">
                Circular Economy <br />
                <span className="text-emerald-600 dark:text-emerald-400">Validated Impact</span>
              </h2>
              <p className="text-zinc-500 font-bold text-xl leading-relaxed max-w-lg">
                Your enterprise participation has diverted <span className="text-zinc-900 dark:text-white">{impact.eWasteDiverted}kg</span> of toxic material from global ecosystems.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 shadow-xl shadow-zinc-500/5 group/card hover:border-emerald-500/30 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 group-hover/card:text-emerald-500 transition-colors">Carbon Offset</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">~{impact.carbonSaved}</span>
                <span className="text-lg font-black text-zinc-400 uppercase tracking-widest">Tons</span>
              </div>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 shadow-xl shadow-zinc-500/5 group/card hover:border-blue-500/30 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 group-hover/card:text-blue-500 transition-colors">Resources</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">{impact.mineralsRecovered}</span>
                <span className="text-lg font-black text-zinc-400 uppercase tracking-widest">kg</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
