'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { format } from 'date-fns';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  senderRole: string;
  senderName: string;
  createdAt: string;
}

export default function ChatWidget() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const bgPollRef = useRef<NodeJS.Timeout | null>(null);

  // NOTE: all hooks must be declared BEFORE any conditional return
  const isAdmin = session?.user?.role === 'ADMIN';

  // Count unread = messages from ADMIN that arrived while widget was closed
  const unreadCount = messages.filter(m => m.senderRole === 'ADMIN').length > seenCount
    ? messages.filter(m => m.senderRole === 'ADMIN').length - seenCount
    : 0;

  const fetchMessages = useCallback(async () => {
    if (!session || isAdmin) return;
    try {
      const res = await fetch('/api/chat');
      const room = await res.json();
      if (room.id) {
        setRoomId(room.id);
        setMessages(room.messages || []);
      }
    } catch {}
  }, [session, isAdmin]);

  // Background poll when closed — to detect new admin messages
  useEffect(() => {
    if (!open && session && !isAdmin) {
      bgPollRef.current = setInterval(fetchMessages, 8000);
    }
    return () => { if (bgPollRef.current) clearInterval(bgPollRef.current); };
  }, [open, session, isAdmin, fetchMessages]);

  // When opening, mark all current admin messages as seen
  useEffect(() => {
    if (open) {
      setSeenCount(messages.filter(m => m.senderRole === 'ADMIN').length);
    }
  }, [open]);

  useEffect(() => {
    if (open && session && !isAdmin) {
      setLoading(true);
      fetchMessages().finally(() => setLoading(false));
      pollRef.current = setInterval(fetchMessages, 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open, session, isAdmin, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
      );
    }
  }, [open]);

  // Don't render for admins or on admin pages — but AFTER all hooks
  if (isAdmin || pathname?.startsWith('/admin')) return null;

  const sendMessage = async () => {
    if (!input.trim() || !roomId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput('');
    try {
      const res = await fetch(`/api/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) await fetchMessages();
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '480px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-white text-lg">B</div>
              <div>
                <p className="text-white font-bold text-sm">BethMedic Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/70 text-xs">Beth is online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {!session ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                  <MessageCircle size={28} className="text-[#7C3AED]/40" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 mb-1">Sign in to chat</p>
                  <p className="text-sm text-gray-400">Get personalized help from Beth</p>
                </div>
                <Link href="/login" className="btn-primary text-sm px-6 py-2.5">Log In</Link>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={24} className="animate-spin text-[#7C3AED]" />
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="chat-bubble-admin">
                    <p className="text-sm">👋 Hi {session.user?.name?.split(' ')[0]}! I'm Beth. How can I help you with your health today?</p>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderRole === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}>
                    <div className={msg.senderRole === 'CUSTOMER' ? 'chat-bubble-user' : 'chat-bubble-admin'}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderRole === 'CUSTOMER' ? 'text-white/50' : 'text-gray-400'}`}>
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {session && (
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 bg-[#7C3AED] hover:bg-[#6B21A8] disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                >
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] text-white rounded-2xl shadow-[0_8px_30px_rgba(124,58,237,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 relative hover:shadow-[0_12px_40px_rgba(124,58,237,0.6)]"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && unreadCount > 0 ? (
          <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] bg-[#F97316] text-white text-xs font-black rounded-full border-2 border-white flex items-center justify-center px-1 animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : !open ? (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F97316] rounded-full border-2 border-white animate-pulse" />
        ) : null}
      </button>
    </div>
  );
}
