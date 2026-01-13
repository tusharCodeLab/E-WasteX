"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Scale, 
  Plus, 
  Minus,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MATERIAL_IMPACT = {
  laptops: { co2: 350, water: 1200, energy: 1500, label: "Laptops" },
  phones: { co2: 80, water: 400, energy: 300, label: "Smartphones" },
  monitors: { co2: 500, water: 2000, energy: 2500, label: "Monitors" },
  servers: { co2: 1200, water: 5000, energy: 8000, label: "Servers" }
};

export default function ImpactCalculator() {
  const [counts, setCounts] = useState({
    laptops: 0,
    phones: 0,
    monitors: 0,
    servers: 0
  });

  const updateCount = (type: keyof typeof counts, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const totals = Object.entries(counts).reduce((acc, [type, count]) => {
    const impact = MATERIAL_IMPACT[type as keyof typeof counts];
    return {
      co2: acc.co2 + (impact.co2 * count),
      water: acc.water + (impact.water * count),
      energy: acc.energy + (impact.energy * count)
    };
  }, { co2: 0, water: 0, energy: 0 });

  return (
    <div className="w-full max-w-5xl mx-auto p-8 sm:p-12 rounded-[3rem] bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Scale className="w-3 h-3" />
            Impact Assessment
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">Calculate Your Potential <span className="text-emerald-500">ESG Contribution</span></h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-10 font-medium leading-relaxed">Estimate the environmental savings achieved by recycling your enterprise assets through our verified network.</p>
          
          <div className="space-y-6">
            {Object.entries(MATERIAL_IMPACT).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-emerald-500/30">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateCount(key as any, -1)}
                    className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-xl">{counts[key as keyof typeof counts]}</span>
                  <button 
                    onClick={() => updateCount(key as any, 1)}
                    className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "CO2 Emissions Saved", value: `${totals.co2} kg`, icon: Leaf, color: "text-emerald-500", desc: "Carbon footprint reduction" },
            { label: "Water Usage Prevented", value: `${totals.water} L`, icon: Droplets, color: "text-blue-500", desc: "Clean water conservation" },
            { label: "Energy Recovery", value: `${totals.energy} kWh`, icon: Zap, color: "text-yellow-500", desc: "Primary energy offset" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-8 group hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black tracking-tighter mb-1">{stat.value}</p>
                <p className="text-zinc-400 text-xs font-medium">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-4 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
            <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              Calculations are based on average lifecycle assessment (LCA) data for enterprise electronics. Actual savings may vary based on device condition and specific recycling protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
