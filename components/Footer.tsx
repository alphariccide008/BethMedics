'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Shield, Award, Heart, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const categories = ['Supplements', 'Medical Devices', 'First Aid', 'Personal Care', 'Diagnostics'];

  return (
    <footer className="bg-[#0D0720] text-gray-400">
      {/* Top border gradient */}
      <div className="h-1 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316]" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] flex items-center justify-center shadow-[0_4px_14px_rgba(124,58,237,0.4)]">
                <span className="text-white font-black text-xl">B</span>
              </div>
              <div>
                <span className="text-xl font-black text-white font-heading">Beth<span className="text-[#A855F7]">Medic</span></span>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Premium Healthcare</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted source for pharmaceutical-grade supplements and certified medical devices. Founded by Beth — a healthcare professional who puts your health first.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#7C3AED] flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/5 hover:border-transparent">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/products?featured=true', label: 'Featured' },
                { href: '/cart', label: 'Cart' },
                { href: '/login', label: 'Sign In' },
                { href: '/signup', label: 'Create Account' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-[#A855F7] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-sm hover:text-[#F97316] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-[#F97316] mt-0.5 flex-shrink-0" />
                12 Marina Street, Lagos Island, Lagos, Nigeria 101001
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#F97316] flex-shrink-0" />
                +234 800 BETH-MED
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#F97316] flex-shrink-0" />
                care@bethmedic.com.ng
              </li>
            </ul>

            {/* Certifications */}
            <div className="flex gap-2 flex-wrap">
              {[
                { icon: Shield, label: 'FDA Reg.' },
                { icon: Award, label: 'ISO 9001' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <Icon size={13} className="text-[#A855F7]" />
                  <span className="text-xs text-gray-300 font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} BethMedic. All rights reserved. Made with <Heart size={10} className="inline text-[#F97316]" /> for better health.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(item => (
              <Link key={item} href="#" className="text-xs hover:text-[#A855F7] transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
