"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  CreditCard,
  BarChart3,
  Search,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

    const routes = [
      {
        label: 'Overview',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'emerald',
        hoverColor: 'group-hover/item:text-emerald-500',
        activeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
      {
        label: 'Marketplace',
        icon: ShoppingBag,
        href: '/buyer',
        color: 'blue',
        hoverColor: 'group-hover/item:text-blue-500',
        activeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        show: user?.role === 'buyer' || user?.role === 'admin',
      },
      {
        label: 'Inventory',
        icon: Package,
        href: '/seller',
        color: 'orange',
        hoverColor: 'group-hover/item:text-orange-500',
        activeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        show: user?.role === 'seller' || user?.role === 'admin',
      },
      {
        label: 'Transactions',
        icon: CreditCard,
        href: '/dashboard/transactions',
        color: 'purple',
        hoverColor: 'group-hover/item:text-purple-500',
        activeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        show: false, // Feature coming soon
      },
    ];

    const secondaryRoutes = [
      {
        label: 'Profile',
        icon: User,
        href: '/profile',
        hoverColor: 'group-hover/item:text-zinc-900 dark:group-hover:text-white',
      },
      {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
        hoverColor: 'group-hover/item:text-zinc-900 dark:group-hover:text-white',
      }
    ];

    return (
      <div className="flex flex-col h-screen sticky top-0 bg-white dark:bg-[#020202] border-r border-zinc-200 dark:border-zinc-900 w-80 transition-all duration-500 overflow-hidden">
        {/* Premium Noise & Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
          <div className="absolute top-0 -left-1/4 w-full h-full bg-emerald-500/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 -right-1/4 w-full h-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="p-8 flex flex-col h-full relative z-10">
            {/* Brand Section */}
            <Link href="/" className="flex items-center gap-4 mb-14 px-3 group/logo">
              <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">
                  e-Waste<span className="text-emerald-500">X</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-1.5">Circular Platform</span>
              </div>
            </Link>

            {/* Main Navigation */}
          <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pr-2 -mr-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-6 px-4">Management</p>
              <nav className="space-y-2">
                {routes.filter(r => r.show !== false).map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onMouseEnter={() => setHoveredPath(route.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 relative group/item ${
                      pathname === route.href 
                        ? route.activeBg 
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <route.icon className={`w-5 h-5 transition-all duration-500 group-hover/item:scale-110 ${pathname === route.href ? '' : `text-zinc-400 ${route.hoverColor}`}`} />
                      <span className="text-sm font-black tracking-tight">{route.label}</span>
                    </div>
                    
                    {pathname === route.href && (
                      <motion.div 
                        layoutId="active-pill"
                        className="w-1.5 h-1.5 rounded-full bg-current relative z-10"
                      />
                    )}
                    
                    <AnimatePresence>
                      {hoveredPath === route.href && pathname !== route.href && (
                        <motion.div 
                          layoutId="sidebar-hover"
                          className="absolute inset-0 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-2xl z-0"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-6 px-4">Security</p>
              <nav className="space-y-2">
                {secondaryRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onMouseEnter={() => setHoveredPath(route.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 relative group/item ${
                      pathname === route.href 
                        ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' 
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <route.icon className={`w-5 h-5 transition-all duration-500 group-hover/item:scale-110 ${pathname === route.href ? '' : `text-zinc-400 ${route.hoverColor}`}`} />
                      <span className="text-sm font-black tracking-tight">{route.label}</span>
                    </div>
                    
                    <AnimatePresence>
                      {hoveredPath === route.href && pathname !== route.href && (
                        <motion.div 
                          layoutId="sidebar-hover"
                          className="absolute inset-0 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-2xl z-0"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* User Section & Session Management */}
          <div className="mt-auto pt-8 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
            <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4 group/user relative overflow-hidden transition-all duration-500 hover:border-emerald-500/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover/user:opacity-100 transition-opacity duration-700" />
              <div className="relative w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm shadow-2xl group-hover/user:scale-105 transition-transform duration-500">
                {user?.name?.[0] || 'U'}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
              </div>
              <div className="flex-1 overflow-hidden relative">
                <p className="text-sm font-black truncate text-zinc-900 dark:text-white leading-tight">{user?.name || 'Authorized User'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[8px] text-zinc-400 font-black uppercase tracking-[0.2em]">{user?.role || 'Partner'}</p>
                  <div className="w-1 h-1 rounded-full bg-zinc-300" />
                  <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em]">Verified</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => logout()}
              className="w-full h-14 flex items-center gap-4 px-6 rounded-3xl text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500 group/logout relative overflow-hidden"
            >
              <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform relative z-10" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase relative z-10">Terminate Session</span>
              <div className="absolute inset-0 bg-red-500/0 group-hover/logout:bg-red-500/5 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  }
