'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import {
  ShoppingCart, Menu, X, LogOut, Settings,
  ChevronDown, Search, Heart, ArrowRight
} from 'lucide-react';
import { gsap } from 'gsap';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/products?category=Supplements', label: 'Supplements' },
  { href: '/products?category=Medical+Devices', label: 'Devices' },
  { href: '/products?category=First+Aid', label: 'First Aid' },
  { href: '/founder', label: 'Our Founder' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cartCount = useCartStore(s => s.count());
  const toggleCart = useCartStore(s => s.toggleCart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Hide navbar completely on admin pages
  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, []);

  const isScrolled = scrolled;
  const textColor = isScrolled ? 'text-white' : 'text-slate-600';
  const logoColor = isScrolled ? 'text-white' : 'text-slate-900';
  const subLogoColor = isScrolled ? 'text-white/60' : 'text-gray-400';
  const logoAccent = isScrolled ? 'text-purple-300' : 'text-[#7C3AED]';
  const linkHover = isScrolled ? 'hover:text-white hover:bg-white/10' : 'hover:text-[#7C3AED] hover:bg-purple-50';
  const iconHover = isScrolled ? 'hover:text-white hover:bg-white/10' : 'hover:text-[#7C3AED] hover:bg-purple-50';

  return (
    <>
      {/* Announcement bar — scrolls away */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#6B21A8] text-white text-xs py-2.5 px-4 text-center hidden md:block">
        <span className="font-medium">🚚 Free shipping on orders over <strong>₦50,000</strong> — Use code <strong>BETHCARE</strong> for 10% off your first order!</span>
      </div>

      {/* Main Navbar */}
      <nav
        ref={navRef}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-r from-[#4C1D95] via-[#6B21A8] to-[#7C3AED] shadow-[0_4px_30px_rgba(107,33,168,0.4)]'
            : 'bg-white shadow-sm border-b border-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isScrolled
                  ? 'bg-white/20 border border-white/30 shadow-none'
                  : 'bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] shadow-[0_4px_14px_rgba(124,58,237,0.4)]'
              }`}>
                <span className="text-white font-black text-xl font-heading">B</span>
              </div>
              <div>
                <div className={`text-xl font-black font-heading leading-none ${logoColor}`}>
                  Beth<span className={logoAccent}>Medic</span>
                </div>
                <div className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${subLogoColor}`}>Premium Healthcare</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${textColor} ${linkHover}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link href="/products" className={`hidden lg:flex p-2.5 rounded-xl transition-all ${textColor} ${iconHover}`}>
                <Search size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${textColor} ${iconHover}`}
              >
                <ShoppingCart size={21} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#F97316] text-white text-xs font-black rounded-full flex items-center justify-center px-1">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
                      isScrolled
                        ? 'border-white/20 hover:bg-white/10 text-white'
                        : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isScrolled ? 'bg-white/20 text-white border border-white/30' : 'bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] text-white'
                    }`}>
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={`hidden sm:block text-sm font-semibold max-w-20 truncate ${isScrolled ? 'text-white' : 'text-slate-700'}`}>
                      {session.user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={isScrolled ? 'text-white/60' : 'text-gray-400'} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-slate-800 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                      </div>
                      {session.user?.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors">
                          <Settings size={16} className="text-gray-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="#" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors">
                        <Heart size={16} className="text-gray-400" />
                        My Orders
                      </Link>
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login" className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                    isScrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-[#7C3AED]'
                  }`}>
                    Log In
                  </Link>
                  <Link href="/signup"
                    className={`group flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] ${
                      isScrolled
                        ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]'
                        : 'bg-[#7C3AED] hover:bg-[#6B21A8] text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]'
                    }`}>
                    Get Started
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${textColor} ${isScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={`lg:hidden border-t px-4 py-4 space-y-1 ${
            isScrolled ? 'bg-[#5B21B6] border-white/10' : 'bg-white border-gray-100'
          }`}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isScrolled
                    ? 'text-white hover:bg-white/10'
                    : 'text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED]'
                }`}>
                {link.label}
              </Link>
            ))}
            {!session && (
              <div className="flex gap-2 pt-3 border-t mt-3 border-gray-50">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center border-2 border-[#7C3AED] text-[#7C3AED] font-bold py-3 rounded-xl text-sm transition-colors hover:bg-purple-50">
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-[#7C3AED] text-white font-bold py-3 rounded-xl text-sm transition-colors hover:bg-[#6B21A8]">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
