"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from "@/components/ui/spotlight";
import { SparklesCore } from "@/components/ui/sparkles";
import { 
  ShieldAlert, 
  Clock, 
  Package, 
  Users, 
  Check, 
  X, 
  MapPin,
  Loader2,
  MessageSquare,
  Activity,
  User as UserIcon,
  LayoutDashboard,
  Settings,
  MoreVertical,
  Trash2,
  TrendingUp,
  BarChart3,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

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

type View = 'overview' | 'users' | 'listings' | 'messages' | 'settings';

export default function AdminDashboard() {
  const { user: admin, loading: authLoading } = useAuth('admin');
  const [activeView, setActiveView] = useState<View>('overview');
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchListings(),
      fetchMessages(),
      fetchUsers()
    ]);
    setLoading(false);
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  }

  async function fetchMessages() {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  }

  async function fetchListings() {
    try {
      const res = await fetch('/api/listings?status=pending');
      if (res.ok) {
        setListings(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch listings');
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch users');
    }
  }

  async function updateListingStatus(id: string, status: 'approved' | 'rejected') {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setListings(listings.filter((l: any) => l._id !== id));
        fetchStats(); 
        toast.success(`Listing ${status}`);
      }
    } catch (error) {
      toast.error('Update failed');
    }
  }

  async function updateUserRole(userId: string, role: string) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      });
      if (res.ok) {
        fetchUsers();
        toast.success('User role updated');
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(users.filter((u: any) => u._id !== userId));
        toast.success('User deleted');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  }

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030303]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  const SidebarItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
        activeView === view 
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' 
          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeView === view ? 'animate-pulse' : ''}`} />
      <span className="text-sm uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 flex relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 p-8 hidden lg:flex flex-col relative z-20 backdrop-blur-3xl bg-white/50 dark:bg-zinc-950/50">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <ShieldAlert className="w-3 h-3 mr-2" />
            <span>Admin Control</span>
          </div>
          <h2 className="text-2xl font-black tracking-tighter">ORCHIDS OS</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem view="overview" icon={LayoutDashboard} label="Overview" />
          <SidebarItem view="users" icon={Users} label="Users" />
          <SidebarItem view="listings" icon={Package} label="Moderation" />
          <SidebarItem view="messages" icon={MessageSquare} label="Comms" />
          <SidebarItem view="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="mt-auto p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white">
              {admin?.name[0]}
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
              <p className="text-xs font-bold truncate">{admin?.name}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 h-10 rounded-xl" onClick={() => window.location.href='/api/auth/logout'}>
            <X className="w-4 h-4 mr-2" /> Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative z-10 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-2">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your global e-waste network infrastructure.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={fetchAllData} variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
              <Activity className="w-4 h-4 mr-2" /> Refresh Data
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats?.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Pending Listings', value: stats?.pending, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                  { label: 'Approved Assets', value: stats?.approved, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Network Comms', value: stats?.messages, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="flex items-center text-[10px] font-black text-emerald-500">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                      </span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</p>
                    <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-[3rem] bg-white/50 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-xl font-black tracking-tighter">User Growth</h4>
                      <p className="text-xs text-zinc-500 font-medium">New registrations over last 7 days</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.charts?.registrations}>
                        <defs>
                          <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', color: '#fff' }}
                          itemStyle={{ color: '#10b981' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorReg)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-8 rounded-[3rem] bg-white/50 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-xl font-black tracking-tighter">Inventory Flux</h4>
                      <p className="text-xs text-zinc-500 font-medium">Daily listing submissions</p>
                    </div>
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.charts?.listings}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 6, fill: '#3b82f6'}} activeDot={{r: 8}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User Profile</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Tier</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u._id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black">
                              {u.name[0]}
                            </div>
                            <div>
                              <p className="font-bold">{u.name}</p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{new Date(u.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-medium text-zinc-500">{u.email}</td>
                        <td className="px-8 py-6">
                          <select 
                            value={u.role} 
                            onChange={(e) => updateUserRole(u._id, e.target.value)}
                            className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                            <Button 
                              onClick={() => deleteUser(u._id)}
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeView === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid gap-6"
            >
              {listings.length === 0 ? (
                <div className="py-40 text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[4rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <Check className="w-16 h-16 text-zinc-300 mx-auto mb-6 opacity-50" />
                  <p className="text-zinc-500 font-bold text-2xl tracking-tight">Moderation queue is clear</p>
                </div>
              ) : (
                listings.map((item: any) => (
                  <div key={item._id} className="group relative p-8 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-[3rem] border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5">
                    <div className="flex gap-8 items-center flex-1">
                      <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-2xl text-zinc-300 group-hover:text-emerald-500/50 transition-all duration-500">
                        {item.category[0]}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-2xl font-black tracking-tighter leading-none">{item.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            item.hazardLevel === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {item.hazardLevel} Hazard
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button onClick={() => updateListingStatus(item._id, 'rejected')} variant="ghost" className="h-14 px-8 rounded-xl text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px]">
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                      <Button onClick={() => updateListingStatus(item._id, 'approved')} className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px]">
                        <Check className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeView === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {messages.map((msg: any) => (
                <div key={msg._id} className="p-6 bg-white/50 dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-6 group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex -space-x-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-black text-white">
                        {msg.sender.name[0]}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-black text-white">
                        {msg.receiver.name[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-sm">{msg.sender.name}</span>
                        <span className="text-zinc-400">→</span>
                        <span className="font-black text-sm">{msg.receiver.name}</span>
                      </div>
                      <p className="text-sm text-zinc-500 italic line-clamp-1">"{msg.content}"</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{msg.listing?.title || 'Unknown Asset'}</p>
                    <p className="text-[10px] font-bold text-zinc-50">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto space-y-12 py-12"
            >
              <div className="space-y-8">
                <div className="p-8 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xl font-black tracking-tighter mb-6">Platform Governance</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Maintenance Mode</p>
                        <p className="text-xs text-zinc-500">Temporarily disable platform access for users.</p>
                      </div>
                      <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-zinc-400 rounded-full transition-all" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Member Registrations</p>
                        <p className="text-xs text-zinc-500">Toggle whether new users can create accounts.</p>
                      </div>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xl font-black tracking-tighter mb-6">Security & Logs</h4>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 px-6 font-black uppercase tracking-widest text-[10px]">
                      Export Audit Logs <ArrowUpRight className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 px-6 font-black uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-500/10">
                      Clear Cache & Sessions <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
