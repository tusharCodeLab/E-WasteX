"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/AuthContext';
import { Send, User, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatProps {
  listingId: string;
  receiverId: string;
  listingTitle: string;
}

export default function Chat({ listingId, receiverId, listingTitle }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s for simplicity
    return () => clearInterval(interval);
  }, [listingId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/messages?listingId=${listingId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const tempContent = content;
    setContent('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, listingId, content: tempContent })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
      }
    } catch (error) {
      console.error('Failed to send message');
    }
  }

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>;

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <MessageSquare className="w-5 h-5" />
          </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black tracking-tight text-sm uppercase text-zinc-400">Negotiation Channel</h3>
                <Link href={`/profile/${receiverId}`} className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:underline">
                  View Partner Profile
                </Link>
              </div>
              <p className="font-bold text-base truncate max-w-[250px]">{listingTitle}</p>
            </div>

        </div>
      </div>

      <ScrollArea className="flex-1 p-6 bg-zinc-50/20 dark:bg-zinc-950/10">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-zinc-400">
                <p className="text-sm font-medium">No messages yet. Start the conversation.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender._id === user?.id;
                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                      isMe 
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-500/10' 
                        : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-none'
                    }`}>
                      {!isMe && <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">{msg.sender.name}</p>}
                      {msg.content}
                      <p className={`text-[9px] mt-1 text-right opacity-50 font-bold uppercase`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30">
        <div className="flex gap-3">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500"
          />
          <Button 
            type="submit" 
            disabled={!content.trim()}
            className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
