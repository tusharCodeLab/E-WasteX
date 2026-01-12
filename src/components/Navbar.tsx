"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  LogOut, 
  User, 
  Menu, 
  X, 
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavLinks = () => {
    const links = [
      { name: "Marketplace", href: "/buyer" },
      { name: "Sustainability", href: "/#features" },
      { name: "About", href: "/" },
    ];

    if (user?.role === 'seller') {
      links.push(
        { name: "New Listing", href: "/seller/create" }
      );
    }

    if (user?.role === 'admin') {
      return links.filter(l => l.name !== "Marketplace");
    }

    return links;
  };

  const navLinks = getNavLinks();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return "/admin";
    if (user.role === 'seller') return "/seller";
    return "/buyer";
  };

  return (
    <nav 
      className={`fixed top-4 left-0 right-0 z-[100] transition-all duration-700 flex justify-center pointer-events-none`}
    >
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`transition-all duration-700 flex items-center justify-between px-6 pointer-events-auto overflow-hidden ${
          scrolled 
            ? "bg-white/70 dark:bg-black/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 py-3 rounded-[2rem] w-[92%] md:w-[75%] lg:w-[65%] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]" 
            : "bg-transparent py-4 w-full max-w-7xl"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" data-cursor="Go Home">
          <div className="bg-emerald-500 p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
            <RefreshCw className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter">
            e-Waste<span className="text-emerald-500">X</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              >
                <Link 
                  href={link.href}
                  data-cursor={link.name}
                  className={`hover:text-emerald-500 transition-colors relative group ${
                    pathname === link.href ? "text-emerald-500" : ""
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-500 group-hover:w-full ${
                    pathname === link.href ? "w-full" : ""
                  }`} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <div className="flex items-center gap-3">
              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-4">
                      <Link href="/profile" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30 transition-all group/profile">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center group-hover/profile:scale-110 transition-transform">
                          <User className="w-3 h-3 text-white" />
                        </div>
                          <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 truncate max-w-[100px]">
                            {user?.name || 'User'}
                          </span>
                      </Link>
                    <div className="flex items-center gap-2">
                      <Link href={getDashboardLink()} data-cursor="My Space">
                        <Button 
                          variant="ghost" 
                          className="rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 transition-all active:scale-95"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={logout}
                        data-cursor="Logout"
                        className="rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95"
                      >
                        <LogOut className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" data-cursor="Welcome Back">
                    <Button variant="ghost" className="font-black text-xs uppercase tracking-widest rounded-xl px-5 h-10 transition-all active:scale-95">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" data-cursor="Get Started">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                      Join Platform
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 transition-transform active:scale-75"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-x-4 top-24 z-[99] md:hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-8"
          >
            <div className="space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-2xl font-black tracking-tighter hover:text-emerald-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Session</span>
                            <span className="text-lg font-black tracking-tighter">{user?.name || 'User'}</span>

                        </div>
                      </div>
                      <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-2xl justify-start gap-3 bg-emerald-600 font-bold">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full h-14 rounded-2xl justify-start gap-3 text-red-500 border-red-100 dark:border-red-900/30 font-bold"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-bold">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                      <Button className="w-full h-14 rounded-2xl bg-emerald-600 font-bold">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
