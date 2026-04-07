'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight, ShieldCheck, Star, Clock, Users, BadgeCheck, CheckCircle2, Sparkles } from 'lucide-react';

const pills = [
  { label: 'FDA Registered' },
  { label: 'ISO 9001 Certified' },
  { label: 'GMP Compliant' },
  { label: 'HIPAA Secure' },
];

const statCards = [
  {
    icon: '⭐',
    value: '4.9/5',
    label: 'Patient Rating',
    sub: 'from 12,000+ reviews',
    color: 'bg-amber-50 border-amber-100',
    textColor: 'text-amber-600',
  },
  {
    icon: '🚚',
    value: 'Same Day',
    label: 'Shipping',
    sub: 'Orders before 2 PM',
    color: 'bg-purple-50 border-purple-100',
    textColor: 'text-[#7C3AED]',
  },
  {
    icon: '💊',
    value: '500+',
    label: 'Products',
    sub: 'All verified & certified',
    color: 'bg-emerald-50 border-emerald-100',
    textColor: 'text-emerald-600',
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.h-badge', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.55 })
        .fromTo('.h-h1', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.75 }, '-=0.3')
        .fromTo('.h-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.5')
        .fromTo('.h-ctas', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.4')
        .fromTo('.h-pills', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2')
        .fromTo('.h-visual', { opacity: 0, x: 60, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 1.0 }, '-=0.9')
        .fromTo('.h-floatcard', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, '-=0.5');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center bg-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 -right-64 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-violet-50 via-purple-50 to-transparent" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-50/60 via-amber-50/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #7C3AED 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-24 items-center min-h-[85vh]">

          {/* ───── LEFT COLUMN ───── */}
          <div className="flex flex-col justify-center">
            {/* Top badge */}
            <div className="h-badge inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 px-5 py-2.5 rounded-full mb-8 w-fit">
              <Sparkles size={14} className="text-[#7C3AED]" />
              <span className="text-[#7C3AED] text-sm font-bold">
                #1 Trusted Medical E-Commerce Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="h-h1 font-heading font-black text-slate-900 leading-[1.07] mb-6">
              <span className="block" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
                Your Health Deserves
              </span>
              <span
                className="block bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent"
                style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}
              >
                Only The Best.
              </span>
              <span
                className="block text-slate-800"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700 }}
              >
                Premium products. Expert guidance.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="h-sub text-slate-500 text-[1.05rem] leading-relaxed mb-9 max-w-[30rem]">
              Pharmaceutical-grade supplements and certified medical devices — personally
              curated by Beth, a licensed healthcare professional committed to your wellbeing.
            </p>

            {/* CTAs */}
            <div className="h-ctas flex flex-wrap gap-4 mb-10">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 bg-[#7C3AED] hover:bg-[#6B21A8] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-[0_8px_30px_rgba(124,58,237,0.4)] text-[0.95rem]"
              >
                Shop All Products
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#meet-beth"
                className="inline-flex items-center gap-3 border-2 border-gray-200 hover:border-[#7C3AED] text-slate-700 hover:text-[#7C3AED] font-bold px-8 py-4 rounded-full transition-all duration-300 text-[0.95rem] bg-white"
              >
                Meet Our Founder
              </Link>
            </div>

            {/* Trust pills */}
            <div className="h-pills flex flex-wrap gap-2.5">
              {pills.map(({ label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
                >
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ───── RIGHT COLUMN ───── */}
          <div className="h-visual relative flex items-center justify-center">
            {/* Main visual card */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#7C3AED]/20 to-[#A855F7]/10 blur-xl scale-105" />

              {/* Card */}
              <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] overflow-hidden shadow-[0_30px_80px_rgba(107,33,168,0.35)]">
                {/* Dot grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)`,
                    backgroundSize: '28px 28px',
                  }}
                />
                {/* Top arc */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#F97316]/10" />

                <div className="relative p-10 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                        {/* Medical cross SVG */}
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                          <rect x="17" y="4" width="10" height="36" rx="5" fill="white" />
                          <rect x="4" y="17" width="36" height="10" rx="5" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg">
                      <ShieldCheck size={17} className="text-white" />
                    </div>
                  </div>

                  <div className="text-2xl font-black text-white font-heading mb-1">BethMedic</div>
                  <div className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-6">Premium Healthcare</div>

                  <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-[240px]">
                    "I built this platform so every family could access the same quality products healthcare professionals use."
                  </p>

                  <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                    <span className="text-white/80 text-sm font-semibold">Dr. Precious · Founder & CMO</span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10 my-7" />

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                      { v: '50K+', l: 'Patients' },
                      { v: '500+', l: 'Products' },
                      { v: '4.9★', l: 'Rating' },
                    ].map(({ v, l }) => (
                      <div key={l}>
                        <div className="text-white font-black text-lg font-heading">{v}</div>
                        <div className="text-white/50 text-[11px] font-medium">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="h-floatcard absolute -left-6 top-8 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-3.5 w-[160px] animate-float">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck size={18} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-medium">All Verified</div>
                  <div className="text-xs font-bold text-gray-900">500+ Products</div>
                </div>
              </div>
            </div>

            <div className="h-floatcard absolute -right-6 top-1/3 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-3.5 w-[160px] animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-medium">Avg. Rating</div>
                  <div className="text-xs font-bold text-gray-900">4.9 / 5.0 ★</div>
                </div>
              </div>
            </div>

            <div className="h-floatcard absolute -left-4 bottom-10 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-3.5 w-[170px] animate-float" style={{ animationDelay: '3s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-[#7C3AED]" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-medium">Same-Day Ship</div>
                  <div className="text-xs font-bold text-gray-900">Order by 2 PM</div>
                </div>
              </div>
            </div>

            <div className="h-floatcard absolute -right-4 bottom-16 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-3.5 w-[155px] animate-float" style={{ animationDelay: '2.2s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-medium">Customers</div>
                  <div className="text-xs font-bold text-gray-900">50,000+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
