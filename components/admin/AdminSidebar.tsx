'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare,
  LogOut, Menu, X, Home, ChevronRight
} from 'lucide-react';

function SidebarContent({ onClose, unreadChats }: { onClose?: () => void; unreadChats: number }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, badge: 0 },
    { href: '/admin/products', label: 'Products', icon: Package, badge: 0 },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: 0 },
    { href: '/admin/chat', label: 'Customer Chat', icon: MessageSquare, badge: unreadChats },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 font-heading text-base">BethMedic</span>
            <p className="text-xs text-gray-400 font-medium">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-[#7C3AED] text-white shadow-[0_4px_15px_rgba(124,58,237,0.3)]'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED]'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="font-semibold text-sm flex-1">{label}</span>
              {badge > 0 && !active && (
                <span className="min-w-[20px] h-5 bg-[#F97316] text-white text-xs font-black rounded-full flex items-center justify-center px-1">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors text-sm font-semibold"
        >
          <Home size={18} className="flex-shrink-0" />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full text-sm font-semibold"
        >
          <LogOut size={18} className="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);

  // Poll for unread customer messages every 10 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/chat/unread');
        if (res.ok) {
          const data = await res.json();
          setUnreadChats(data.count ?? 0);
        }
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-gray-100 shadow-sm z-30 flex-col">
        <SidebarContent unreadChats={unreadChats} />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center"
      >
        <Menu size={20} className="text-gray-700" />
        {unreadChats > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#F97316] text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5">
            {unreadChats > 9 ? '9+' : unreadChats}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
            <SidebarContent unreadChats={unreadChats} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
