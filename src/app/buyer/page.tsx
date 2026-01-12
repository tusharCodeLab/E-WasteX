"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Info,
  ChevronDown,
  Loader2,
  Clock,
  MessageSquare,
  LayoutGrid,
  Heart,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  }
};

export default function BuyerMarketplace() {
  const { user, loading: authLoading } = useAuth('buyer');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [hazard, setHazard] = useState('all');
  const [interests, setInterests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'interests'>('marketplace');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
    if (user) fetchInterests();
  }, [category, hazard, user]);

  async function fetchInterests() {
    try {
      const res = await fetch('/api/interests');
      if (res.ok) {
        const data = await res.json();
        setInterests(data);
      }
    } catch (error) {
      console.error('Failed to fetch interests');
    }
  }

  async function expressInterest(listingId: string) {
    setSubmitting(listingId);
    try {
      const res = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, message: 'I am interested in this item.' }),
      });
      if (res.ok) {
        fetchInterests();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to express interest');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setSubmitting(null);
    }
  }

  async function fetchListings() {
    setLoading(true);
    try {
      let url = '/api/listings?status=approved';
      if (category !== 'all') url += `&category=${category}`;
      if (hazard !== 'all') url += `&hazardLevel=${hazard}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  }

  const interestedIds = interests.map(i => i.listing._id);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030303]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="text-zinc-900 dark:text-zinc-100 px-12 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20"
        >
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <Search className="w-3 h-3 mr-2" />
                <span>Global Procurement Network</span>
              </motion.div>
              <Link href="/profile" className="hover:text-emerald-500 transition-colors">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-4 leading-none">
                  Hi, {user?.name ? user.name.split(' ')[0] : 'User'}
                </h1>
              </Link>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium max-w-xl">Manage your procurement interests and active negotiations.</p>
            </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Button 
                onClick={() => setActiveTab('marketplace')}
                variant={activeTab === 'marketplace' ? 'default' : 'ghost'}
                className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest ${activeTab === 'marketplace' ? 'bg-emerald-600 text-white' : ''}`}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Marketplace
              </Button>
              <Button 
                onClick={() => setActiveTab('interests')}
                variant={activeTab === 'interests' ? 'default' : 'ghost'}
                className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest ${activeTab === 'interests' ? 'bg-emerald-600 text-white' : ''}`}
              >
                <Heart className="w-4 h-4 mr-2" />
                My Interests
              </Button>
            </div>
          </div>
        </motion.div>

        {activeTab === 'marketplace' ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-6 p-4 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 mb-12"
            >
              <div className="space-y-2 flex-1 min-w-[200px]">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4 mb-1 block">Inventory Stream</label>
                <Select onValueChange={(val) => setCategory(val)} defaultValue="all">
                  <SelectTrigger className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="Laptops">Laptops</SelectItem>
                    <SelectItem value="Smartphones">Smartphones</SelectItem>
                    <SelectItem value="Monitors">Monitors</SelectItem>
                    <SelectItem value="Batteries">Batteries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1 min-w-[200px]">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4 mb-1 block">Hazard Profile</label>
                <Select onValueChange={(val) => setHazard(val)} defaultValue="all">
                  <SelectTrigger className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 transition-all">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="all">All Profiles</SelectItem>
                    <SelectItem value="Low">Low Risk</SelectItem>
                    <SelectItem value="Medium">Medium Risk</SelectItem>
                    <SelectItem value="High">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-zinc-50 dark:bg-zinc-900/40 rounded-[3rem] animate-pulse border border-zinc-200 dark:border-zinc-800" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                  {listings.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-40 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[4rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
                    >
                      <Filter className="w-16 h-16 text-zinc-300 mx-auto mb-6 opacity-50" />
                      <p className="text-zinc-500 font-bold text-2xl tracking-tight">No assets match your criteria</p>
                      <Button variant="link" className="text-emerald-500 font-black mt-2" onClick={() => {setCategory('all'); setHazard('all');}}>Reset Filters</Button>
                    </motion.div>
                  ) : (
                    listings.map((item: any, idx) => (
                      <motion.div
                        key={item._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="group flex flex-col bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 perspective-1000"
                      >
                        <div className="p-8 sm:p-10 flex-1">
                          <div className="flex justify-between items-start mb-8">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              item.hazardLevel === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                              item.hazardLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            }`}>
                              {item.hazardLevel} Hazard
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter group-hover:text-emerald-500 transition-colors leading-[1.1]">
                              {item.title}
                            </h3>
                            <Link href={`/profile/${item.seller._id}`} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-500 transition-colors">
                              View Seller
                            </Link>
                          </div>
                          
                          <p className="text-zinc-500 dark:text-zinc-400 text-base line-clamp-3 mb-10 font-medium leading-relaxed">
                            {item.description}
                          </p>
                          
                          <div className="grid grid-cols-1 gap-4 mt-auto">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800 group-hover:bg-emerald-500/5 transition-colors">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-black tracking-tight truncate">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800 group-hover:bg-orange-500/5 transition-colors">
                              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-black tracking-tight truncate">Condition: {item.condition}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-8 sm:p-10 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 transition-colors group-hover:bg-emerald-500/10">
                          <Button 
                            disabled={interestedIds.includes(item._id) || submitting === item._id}
                            onClick={() => expressInterest(item._id)}
                            className={`w-full h-16 rounded-2xl font-black text-lg transition-all duration-500 shadow-2xl ${
                              interestedIds.includes(item._id) 
                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 shadow-none cursor-default'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20 active:scale-[0.98]'
                            }`}
                          >
                            {submitting === item._id ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                             interestedIds.includes(item._id) ? 'Interest Logged' : 'Express Interest'}
                          </Button>
                        </div>

                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tighter mb-8">My Procurement Requests</h2>
              {interests.length === 0 ? (
                <div className="p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                   <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">You haven't expressed interest in any items yet.</p>
                </div>
              ) : (
                interests.map(interest => (
                  <div 
                    key={interest._id}
                    className="p-6 rounded-[2rem] border bg-white/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-lg tracking-tight">{interest.listing.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        interest.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                        interest.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 
                        interest.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {interest.status}
                      </div>
                    </div>
                    {interest.status === 'accepted' ? (
                      <Button 
                        onClick={() => setSelectedChat(interest)}
                        className={`w-full rounded-xl h-12 font-black text-xs uppercase tracking-widest ${
                          selectedChat?._id === interest._id ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    ) : (
                      <p className="text-xs text-zinc-500 font-medium italic">Chat will be available once the seller accepts your interest.</p>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="lg:col-span-2">
              {selectedChat ? (
                <Chat 
                  listingId={selectedChat.listing._id} 
                  receiverId={selectedChat.listing.seller} 
                  listingTitle={selectedChat.listing.title} 
                />
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="w-20 h-20 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-2">Secure Negotiation Vault</h3>
                  <p className="text-zinc-500 font-medium">Select an accepted request to start chatting with the seller.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
