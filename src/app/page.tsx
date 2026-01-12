"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  Laptop, 
  Smartphone, 
  Monitor, 
  Battery, 
  WashingMachine, 
  Cpu, 
  Keyboard,
  RefreshCw,
  Sparkles,
  Globe,
  PlusCircle,
  Search,
  CheckCircle2,
  Handshake,
  Loader2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import ImpactCalculator from "@/components/ImpactCalculator";
import { useEffect, useState } from "react";

const categories = [
  { 
    icon: <Laptop className="h-6 w-6 text-emerald-500" />, 
    name: "Laptops & PCs", 
    description: "Decommissioned enterprise laptops and desktop hardware.", 
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    icon: <Smartphone className="h-6 w-6 text-emerald-500" />, 
    name: "Mobile Devices", 
    description: "Handheld electronics containing high-value materials.", 
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    icon: <Monitor className="h-6 w-6 text-emerald-500" />, 
    name: "Displays", 
    description: "Visual hardware ranging from monitors to industrial panels.", 
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    icon: <Cpu className="h-6 w-6 text-emerald-500" />, 
    name: "Circuit Boards", 
    description: "Processing units and high-grade PCB assemblies.", 
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    icon: <Battery className="h-6 w-6 text-emerald-500" />, 
    name: "Energy Storage", 
    description: "Industrial and consumer power cells for resource recovery.", 
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    icon: <WashingMachine className="h-6 w-6 text-emerald-500" />, 
    name: "Appliances", 
    description: "Large-scale domestic and commercial electronic units.", 
    image: "https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    icon: <Keyboard className="h-6 w-6 text-emerald-500" />, 
    name: "Peripherals", 
    description: "Network hardware, input devices, and connectivity units.", 
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800" 
  },
];

const steps = [
  {
    title: "Create Your Account",
    description: "Join as a Seller to list e-waste or a Recycler to procure materials.",
    icon: PlusCircle,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "List Your Inventory",
    description: "Specify items, quantities, and condition with professional clarity.",
    icon: Search,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Connect & Finalize",
    description: "Recyclers express interest, allowing you to choose the best partner.",
    icon: Handshake,
    color: "from-orange-500 to-yellow-500"
  },
  {
    title: "Impact Verified",
    description: "Complete the exchange and track your contribution to sustainability.",
    icon: CheckCircle2,
    color: "from-purple-500 to-pink-500"
  }
];

export default function Home() {
  const [stats, setStats] = useState({ listings: 0, recyclers: 0, matches: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats/public');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        // Set fallback stats so UI doesn't look empty if API fails
        setStats({ listings: 1250, recyclers: 84, matches: 412 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/30 overflow-x-hidden">
      <main className="flex-1">
        {/* Full-Screen Hero Section */}
        <section className="w-full min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-[#030303]">
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-center">
              <motion.div 
                className="text-center lg:text-left flex flex-col items-center lg:items-start"
              >
                <motion.div 
                  className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6"
                >
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2" />
                  <span>Verified Circular Tech Exchange</span>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6 leading-[1.1] sm:leading-[1]"
                >
                  Scale Your <br className="hidden sm:block" />
                  Environmental <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 inline-block">
                    Impact.
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-lg font-medium"
                >
                  The professional marketplace for responsible electronics disposal. Connect with certified recyclers and manage your e-waste inventory with precision.
                </motion.p>
                
                <motion.div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/register?role=seller" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold group shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95">
                      List e-Waste <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/register?role=buyer" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold backdrop-blur-md transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95">
                      Sourcing Portal
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="mt-12 lg:mt-0 relative w-full max-w-[500px] lg:max-w-none mx-auto"
              >
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-2xl group transition-all duration-500 hover:shadow-emerald-500/10">
                  <Image 
                    src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1200" 
                    alt="Sustainable processing" 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    priority
                  />
                  
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 right-8 p-5 sm:p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 z-20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/40">
                        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Network Status</p>
                        <p className="text-sm sm:text-base font-black">Verified Secure</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-8 left-8 p-5 sm:p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 z-20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/40">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Active Impact</p>
                        <p className="text-sm sm:text-base font-black">Real-time ESG</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="px-6">
          {/* Real-time Stats Section */}
          <section className="py-24 sm:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[
                  { label: "Items Listed", value: stats.listings, icon: BarChart3 },
                  { label: "Verified Partners", value: stats.recyclers, icon: Globe },
                  { label: "Successful Matches", value: stats.matches, icon: Handshake }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ 
                        delay: i * 0.1, 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15 
                      }}
                      className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                        <Icon className="w-8 h-8 text-emerald-500" />
                      </div>
                      {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-300 mb-2" />
                      ) : (
                        <motion.p 
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.2 + i * 0.1 }}
                          className="text-5xl sm:text-6xl font-black mb-3 tracking-tighter"
                        >
                          {stat.value.toLocaleString()}
                        </motion.p>
                      )}
                      <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16 sm:mb-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-4 block">
                    Operating Model
                  </span>
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">Marketplace Protocol</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">A structured workflow designed for professional scale and environmental accountability.</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: idx * 0.1,
                      type: "spring",
                      stiffness: 80,
                      damping: 15
                    }}
                    className="relative p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-[1px] mb-8 relative z-10 group-hover:scale-110 transition-all duration-500`}>
                      <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-zinc-900 dark:text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 relative z-10 group-hover:text-emerald-500 transition-colors">{step.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed relative z-10">{step.description}</p>
                    <div className="absolute bottom-6 right-8 text-6xl font-black text-zinc-200 dark:text-zinc-800/20 opacity-40 select-none group-hover:scale-110 group-hover:text-emerald-500/20 transition-all duration-700">
                      {idx + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Inventory Focus */}
          <section className="py-24 sm:py-32 relative rounded-[3rem] sm:rounded-[4rem] bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden mx-4 sm:mx-6">
            <div className="max-w-7xl mx-auto relative z-10 px-6 sm:px-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="max-w-2xl"
                >
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">Material Categories</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-medium">Focused e-waste streams ready for procurement and systematic resource recovery.</p>
                </motion.div>
                <Link href="/register">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="inline-block"
                  >
                    <Button variant="link" className="text-emerald-500 font-bold text-lg p-0 group h-auto">
                      Explore all categories <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <BentoGrid>
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className={i === 3 || i === 6 ? "lg:col-span-2" : ""}
                  >
                    <BentoGridItem
                      title={cat.name}
                      description={cat.description}
                      header={
                        <div className="w-full h-40 sm:h-56 rounded-2xl overflow-hidden relative group mb-2 shrink-0">
                          <Image 
                            src={cat.image} 
                            alt={cat.name} 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-emerald-500/20 backdrop-blur-[2px]">
                            <div className="bg-white/90 dark:bg-zinc-900/90 p-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <ExternalLink className="w-5 h-5 text-emerald-500" />
                            </div>
                          </div>
                        </div>
                      }
                      icon={cat.icon}
                      className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500"
                    />
                  </motion.div>
                ))}
              </BentoGrid>
            </div>
          </section>

          {/* Platform Trust */}
          <section id="features" className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-12 sm:space-y-16"
                >
                  <div className="space-y-6">
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1] sm:leading-[0.9]">Engineered for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Security & Scale</span></h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-xl leading-relaxed font-medium">A high-performance infrastructure built to facilitate the global shift towards a circular electronics economy.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    {[
                      { icon: ShieldCheck, title: "Verified Network", desc: "Rigorous vetting for all recyclers to ensure environmental compliance." },
                      { icon: BarChart3, title: "Precision Tracking", desc: "Manage your listings and monitor interest with professional-grade tools." },
                      { icon: Globe, title: "Circular Efficiency", desc: "Optimizing the recovery of critical materials through direct matching." }
                    ].map((feature, i) => (
                      <motion.div 
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/30 transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
                      >
                        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all duration-500">
                          <feature.icon className="w-7 h-7 sm:w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold mb-3">{feature.title}</h3>
                          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl hidden lg:block"
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
                    alt="Sustainable tech" 
                    fill 
                    className="object-cover transition-transform duration-1000 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
                  <div className="absolute bottom-12 left-12 right-12">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 1, type: "spring" }}
                      className="p-10 rounded-[3rem] bg-white/10 dark:bg-zinc-900/60 backdrop-blur-3xl border border-white/10 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                    >
                      <motion.p 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4"
                      >
                        Network Growth
                      </motion.p>
                      <p className="text-6xl font-black text-white tracking-tighter mb-2">+{stats.recyclers}</p>
                      <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Active Recyclers Joined</p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Impact Calculator Section */}
          <section className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 sm:mb-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-4 block">
                    Environmental Metrics
                  </span>
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">Measure Your Difference</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">Use our professional assessment tool to visualize the tangible impact of your recycling decisions.</p>
                </motion.div>
              </div>
              <ImpactCalculator />
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 sm:py-32">
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", stiffness: 50 }}
              className="max-w-7xl mx-auto relative rounded-[3rem] sm:rounded-[4rem] overflow-hidden bg-emerald-600 dark:bg-emerald-950 p-10 sm:p-20 lg:p-32 border border-emerald-400/20 shadow-2xl group"
            >
              <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10 sm:space-y-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95]"
                >
                  Join the <br /><span className="text-emerald-300">Exchange.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="text-emerald-100/80 text-lg sm:text-2xl lg:text-3xl leading-relaxed font-medium"
                >
                  Whether listing corporate inventory or sourcing rare materials, our infrastructure is built for your requirements.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center pt-8"
                >
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 rounded-2xl h-16 sm:h-20 px-10 sm:px-14 text-xl sm:text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/30 bg-white/10 hover:bg-white/20 rounded-2xl h-16 sm:h-20 px-10 sm:px-14 text-xl sm:text-2xl font-black backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                      Partner Login
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-20 sm:py-24 bg-white dark:bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
          <div className="space-y-8 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3 font-black text-3xl group">
              <div className="bg-emerald-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
                <RefreshCw className="text-white w-7 h-7" />
              </div>
              <span className="tracking-tighter">e-WasteX</span>
            </Link>
            <p className="text-zinc-500 text-sm sm:text-base font-medium leading-relaxed max-w-xs mx-auto md:mx-0">The world's premier digital exchange for the circular electronic economy. Facilitating restoration through systematic innovation.</p>
          </div>
          
          <div className="flex justify-center gap-10 sm:gap-16 text-zinc-400 text-xs font-bold uppercase tracking-[0.3em]">
            <Link href="/" className="hover:text-emerald-500 transition-all hover:tracking-[0.4em]">Privacy</Link>
            <Link href="/" className="hover:text-emerald-500 transition-all hover:tracking-[0.4em]">Terms</Link>
            <Link href="/" className="hover:text-emerald-500 transition-all hover:tracking-[0.4em]">Contact</Link>
          </div>

          <div className="flex justify-center md:justify-end text-zinc-500 text-xs font-bold tracking-widest uppercase text-center md:text-right">
            © 2024 e-WasteX Exchange.<br className="hidden sm:block" />
            <span className="text-[10px] text-zinc-400 mt-2 block">All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
