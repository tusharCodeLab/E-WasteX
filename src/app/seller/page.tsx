"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  TrendingUp, 
  Users, 
    ArrowUpRight,
    MessageSquare,
    ShieldCheck
  } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Spotlight } from "@/components/ui/spotlight";
import { SparklesCore } from "@/components/ui/sparkles";
import Chat from '@/components/Chat';

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
  },
  exit: { scale: 0.95, opacity: 0 }
};

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth('seller');
  const [listings, setListings] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'messages'>('inventory');
  const [selectedChat, setSelectedChat] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    setLoading(true);
    try {
      const [listingsRes, interestsRes] = await Promise.all([
        fetch(`/api/listings?sellerId=${user.id}&status=all`),
        fetch('/api/interests')
      ]);
      
      if (listingsRes.ok) setListings(await listingsRes.json());
      if (interestsRes.ok) setInterests(await interestsRes.json());
    } catch (error) {
      toast.error('Failed to sync data');
    } finally {
      setLoading(false);
    }
  }

  async function deleteListing(id: string) {
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(listings.filter((l: any) => l._id !== id));
        toast.success('Listing removed successfully');
      }
    } catch (error) {
      toast.error('Could not delete listing');
    }
  }

    async function updateInterestStatus(id: string, status: 'accepted' | 'rejected' | 'completed') {
      try {
        const res = await fetch(`/api/interests/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          setInterests(interests.map((i: any) => i._id === id ? { ...i, status } : i));
          toast.success(`Request ${status === 'completed' ? 'marked as sold' : status}`);
          if (status === 'completed') {
             // Refresh listings to show 'sold' status
             const listingsRes = await fetch(`/api/listings?sellerId=${user.id}&status=all`);
             if (listingsRes.ok) setListings(await listingsRes.json());
          }
        }
      } catch (error) {
        toast.error('Status update failed');
      }
    }


  const stats = [
    { label: 'Live Listings', value: listings.filter(l => l.status === 'approved').length, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Review', value: listings.filter(l => l.status === 'pending').length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Buyer Interest', value: interests.filter(i => i.status === 'pending').length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  if (authLoading || (loading && !listings.length)) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-zinc-900 dark:text-zinc-100 overflow-hidden relative p-12">
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
          >
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <Package className="w-3 h-3 mr-2" />
                <span>Seller Command Center</span>
              </motion.div>
                  <Link href="/profile" className="hover:text-emerald-500 transition-colors">
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-2 leading-none">
                      Hi, {user?.name ? user.name.split(' ')[0] : 'Seller'}
                    </h1>
                  </Link>

              <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">Manage your inventory and connect with certified buyers.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <Button 
                  onClick={() => setActiveTab('inventory')}
                  variant={activeTab === 'inventory' ? 'default' : 'ghost'}
                  className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest ${activeTab === 'inventory' ? 'bg-emerald-600 text-white' : ''}`}
                >
                  Inventory
                </Button>
                <Button 
                  onClick={() => setActiveTab('messages')}
                  variant={activeTab === 'messages' ? 'default' : 'ghost'}
                  className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest ${activeTab === 'messages' ? 'bg-emerald-600 text-white' : ''}`}
                >
                  Messages
                </Button>
              </div>
              <Link href="/seller/create">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] px-10 h-16 text-lg font-black group shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95">
                  <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-500" /> 
                  Create
                </Button>
              </Link>
            </div>
          </motion.div>

        {activeTab === 'inventory' ? (
          <>
            {/* Stats Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {stats.map((stat, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <div className="relative group p-8 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5">
                    <div className="flex items-start justify-between">
                      <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <stat.icon className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-16">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between mb-10"
                >
                  <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4">
                    <Package className="w-8 h-8 text-emerald-500" />
                    Active Inventory
                  </h2>
                  <div className="px-4 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {listings.length} TOTAL ITEMS
                  </div>
                </motion.div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {listings.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
                      >
                        <Package className="w-16 h-16 text-zinc-300 mx-auto mb-6 opacity-50" />
                        <p className="text-zinc-500 font-bold text-xl">Your warehouse is currently empty</p>
                        <Link href="/seller/create" className="text-emerald-500 font-black mt-4 inline-flex items-center gap-2 hover:gap-3 transition-all">
                          Start listing now <ArrowUpRight className="w-5 h-5" />
                        </Link>
                      </motion.div>
                    ) : (
                      listings.map((listing) => (
                        <motion.div 
                          layout
                          key={listing._id}
                          variants={itemVariants}
                          exit="exit"
                          className="group relative p-8 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                            <div className="flex gap-8 items-center">
                              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-4xl font-black text-zinc-300 group-hover:text-emerald-500/50 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                                 {listing.category[0]}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <h3 className="font-black text-2xl tracking-tighter">{listing.title}</h3>
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    listing.hazardLevel === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                    listing.hazardLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  }`}>
                                    {listing.hazardLevel} Hazard
                                  </span>
                                </div>
                                <div className="flex gap-6 text-sm text-zinc-500 font-bold uppercase tracking-widest">
                                  <span className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-emerald-500" /> {listing.category}</span>
                                  <span className="text-zinc-300">|</span>
                                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-10 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="text-right">
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                                  listing.status === 'approved' ? 'text-emerald-500' :
                                  listing.status === 'rejected' ? 'text-red-500' : 'text-orange-500'
                                }`}>
                                  {listing.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  {listing.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                  {listing.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                  <span>{listing.status}</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-14 w-14 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90" 
                                onClick={() => deleteListing(listing._id)}
                              >
                                <Trash2 className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Sidebar Feed */}
              <div className="space-y-12">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between"
                >
                  <h2 className="text-2xl font-black tracking-tighter flex items-center gap-4">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    Buyer Feed
                  </h2>
                </motion.div>

                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {interests.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-16 text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed"
                      >
                        <Users className="w-10 h-10 text-zinc-300 mx-auto mb-4 opacity-50" />
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No buyer interest yet</p>
                      </motion.div>
                    ) : (
                      interests.map((interest) => (
                        <motion.div 
                          layout
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0 }}
                          key={interest._id} 
                          className="p-8 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:border-blue-500/30 transition-all duration-500"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-sm uppercase group-hover:scale-110 transition-transform">
                                  {interest.buyer?.name ? interest.buyer.name[0] : 'B'}
                                </div>
                                <div>
                                  <h4 className="font-black text-base leading-tight tracking-tight">{interest.buyer?.name || 'Buyer'}</h4>
                                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{interest.buyer?.email || 'No email'}</p>
                                </div>

                            </div>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">
                              Buyer
                            </span>
                          </div>

                          <div className="bg-zinc-100/50 dark:bg-zinc-800/30 p-5 rounded-3xl mb-6 border border-zinc-100 dark:border-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/50 transition-colors">
                            <p className="text-[9px] font-black text-zinc-400 mb-1.5 uppercase tracking-widest">Target Item</p>
                            <p className="text-sm font-black text-zinc-800 dark:text-zinc-200 truncate">{interest.listing.title}</p>
                          </div>

                          <div className="relative mb-8">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic line-clamp-3 pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                              "{interest.message}"
                            </p>
                          </div>
                          
                            {interest.status === 'pending' ? (
                              <div className="grid grid-cols-2 gap-4">
                                <Button 
                                  variant="secondary"
                                  className="rounded-2xl h-12 text-xs font-black uppercase tracking-widest border-none hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
                                  onClick={() => updateInterestStatus(interest._id, 'rejected')}
                                >
                                  Pass
                                </Button>
                                <Button 
                                  className="rounded-2xl h-12 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all"
                                  onClick={() => updateInterestStatus(interest._id, 'accepted')}
                                >
                                  Connect
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className={`flex items-center justify-center gap-3 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                  interest.status === 'completed' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                                  interest.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
                                }`}>
                                  {interest.status === 'completed' ? <ShieldCheck className="w-4 h-4" /> : 
                                   interest.status === 'accepted' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                  {interest.status}
                                </div>
                                {interest.status === 'accepted' && (
                                  <Button 
                                    onClick={() => updateInterestStatus(interest._id, 'completed')}
                                    className="w-full rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
                                  >
                                    Mark as Sold
                                  </Button>
                                )}
                              </div>
                            )}

                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tighter mb-8">Active Discussions</h2>
              {interests.filter(i => i.status === 'accepted').length === 0 ? (
                <div className="p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                   <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">No active chats. Accept a buyer's interest to start chatting.</p>
                </div>
              ) : (
                interests.filter(i => i.status === 'accepted').map(interest => (
                  <button 
                    key={interest._id}
                    onClick={() => setSelectedChat(interest)}
                    className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-500 ${
                      selectedChat?._id === interest._id 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                        : 'bg-white/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                        selectedChat?._id === interest._id ? 'bg-white/20' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {interest.buyer.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black truncate max-w-[150px]">{interest.buyer.name}</h4>
                        <p className={`text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px] ${
                          selectedChat?._id === interest._id ? 'text-white/60' : 'text-zinc-400'
                        }`}>
                          {interest.listing.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="lg:col-span-2">
              {selectedChat ? (
                <Chat 
                  listingId={selectedChat.listing._id} 
                  receiverId={selectedChat.buyer._id} 
                  listingTitle={selectedChat.listing.title} 
                />
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="w-20 h-20 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-2">Secure Negotiation Vault</h3>
                  <p className="text-zinc-500 font-medium">Select a discussion from the left to view messages.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
