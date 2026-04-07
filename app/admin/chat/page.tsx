'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { MessageSquare, Send, Loader2, Users, Circle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Room {
  id: string;
  userId: string;
  status: string;
  updatedAt: string;
  user: { name: string; email: string };
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  senderRole: string;
  senderName: string;
  read: boolean;
  createdAt: string;
}

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (Array.isArray(data)) setRooms(data);
    } catch {}
  }, []);

  const fetchRoom = useCallback(async (roomId: string) => {
    try {
      const res = await fetch(`/api/chat/${roomId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {}
  }, []);

  useEffect(() => {
    fetchRooms().finally(() => setLoading(false));
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoom(selectedRoom.id);
      pollRef.current = setInterval(() => fetchRoom(selectedRoom.id), 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedRoom, fetchRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedRoom || sending) return;
    setSending(true);
    const content = input.trim();
    setInput('');

    try {
      const res = await fetch(`/api/chat/${selectedRoom.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        await fetchRoom(selectedRoom.id);
      } else {
        toast.error('Failed to send message');
        setInput(content);
      }
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const unreadCount = (room: Room) =>
    room.messages?.filter(m => m.senderRole === 'CUSTOMER' && !m.read).length || 0;

  return (
    <div className="flex h-[calc(100vh-0px)] pt-16 lg:pt-0">
      {/* Sidebar - rooms list */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 font-heading flex items-center gap-2">
            <MessageSquare size={20} className="text-brand-purple" />
            Customer Chats
          </h2>
          <p className="text-xs text-gray-500 mt-1">{rooms.length} conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-brand-purple" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Users size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No conversations yet</p>
              <p className="text-gray-400 text-xs mt-1">Customers will appear here when they send messages</p>
            </div>
          ) : (
            rooms.map(room => {
              const unread = unreadCount(room);
              const lastMsg = room.messages?.[0];
              const isActive = selectedRoom?.id === room.id;

              return (
                <button
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`w-full flex items-start gap-3 p-4 border-b border-gray-50 text-left transition-colors hover:bg-gray-50 ${
                    isActive ? 'bg-brand-purple-50 border-l-4 border-l-brand-purple' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {room.user.name[0].toUpperCase()}
                    </div>
                    <Circle size={8} className="absolute -bottom-0.5 -right-0.5 fill-green-400 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{room.user.name}</p>
                      <span className="text-xs text-gray-400">
                        {format(new Date(room.updatedAt), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{room.user.email}</p>
                    {lastMsg && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!selectedRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-brand-purple-50 flex items-center justify-center mb-4">
              <MessageSquare size={36} className="text-brand-purple/40" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Conversation</h3>
            <p className="text-gray-500 text-sm max-w-xs">Choose a customer chat from the left panel to start responding</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">
                {selectedRoom.user.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedRoom.user.name}</p>
                <p className="text-xs text-gray-500">{selectedRoom.user.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No messages yet
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                    <div className={msg.senderRole === 'ADMIN' ? 'chat-bubble-user' : 'chat-bubble-admin'}>
                      <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderRole === 'ADMIN' ? 'text-white/60' : 'text-gray-400'}`}>
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Reply to ${selectedRoom.user.name}...`}
                  className="flex-1 input-field"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="btn-primary px-5 flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
