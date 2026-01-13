"use client";

import { UserSidebar } from "./UserSidebar";
import { motion } from "framer-motion";

export function UserDashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white dark:bg-[#030303] overflow-hidden">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
