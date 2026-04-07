'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import {
  Pill, Cpu, Heart, ShieldCheck, Truck, Clock, Star,
  ArrowRight, Microscope, Activity, ChevronDown, ChevronUp,
  CheckCircle2, MessageCircle, Zap, Lock, Award,
  BadgeCheck, Stethoscope, FlaskConical, Package, Sparkles,
  Users, ThumbsUp, Phone
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'Supplements', icon: Pill, color: 'bg-violet-100 text-violet-600', count: '200+' },
  { name: 'Medical Devices', icon: Cpu, color: 'bg-blue-100 text-blue-600', count: '85+' },
  { name: 'First Aid', icon: Heart, color: 'bg-rose-100 text-rose-600', count: '60+' },
  { name: 'Personal Care', icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-600', count: '150+' },
  { name: 'Diagnostics', icon: Microscope, color: 'bg-amber-100 text-amber-600', count: '40+' },
  { name: 'Monitoring', icon: Activity, color: 'bg-sky-100 text-sky-600', count: '30+' },
];

const stats = [
  { value: 50000, label: 'Patients Served', suffix: '+' },
  { value: 500, label: 'Products', suffix: '+' },
  { value: 99, label: 'Satisfaction Rate', suffix: '%' },
  { value: 24, label: 'Hour Support', suffix: '/7' },
];

const services = [
  {
    icon: Pill,
    title: 'Pharmaceutical Supplements',
    desc: 'Vitamins, minerals, and specialty supplements manufactured to pharmaceutical standards — 3rd-party tested for purity.',
    tag: 'Most Popular',
    tagColor: 'bg-purple-50 text-[#7C3AED] border-purple-100',
    iconColor: 'bg-purple-50 text-[#7C3AED]',
  },
  {
    icon: Cpu,
    title: 'Certified Medical Devices',
    desc: 'FDA-cleared diagnostic equipment and monitoring devices for home and professional use, at competitive prices.',
    tag: 'Clinically Tested',
    tagColor: 'bg-blue-50 text-blue-600 border-blue-100',
    iconColor: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Heart,
    title: 'First Aid & Emergency',
    desc: 'Complete first aid kits, wound care, and emergency essentials — everything you need to be prepared.',
    tag: 'Essential',
    tagColor: 'bg-rose-50 text-rose-600 border-rose-100',
    iconColor: 'bg-rose-50 text-rose-600',
  },
  {
    icon: MessageCircle,
    title: 'Expert Consultation',
    desc: 'Chat directly with Beth and our team for personalized product recommendations tailored to your health needs.',
    tag: 'Free with Orders',
    tagColor: 'bg-orange-50 text-[#F97316] border-orange-100',
    iconColor: 'bg-orange-50 text-[#F97316]',
  },
];

const whyUs = [
  { icon: BadgeCheck, title: 'Pharmaceutical-Grade Quality', desc: 'Every product sourced from FDA-registered, ISO-certified manufacturers. We never compromise on quality.' },
  { icon: Zap, title: 'Same-Day Dispatch', desc: 'Orders placed before 2 PM ship same day. Free express delivery on orders over $50.' },
  { icon: MessageCircle, title: 'Direct Founder Access', desc: 'Chat with Beth directly — a healthcare professional who personally curates every product we carry.' },
  { icon: Award, title: 'Clinically Validated', desc: 'All medical devices are clinically tested. All supplements are 3rd-party lab verified for potency.' },
  { icon: Lock, title: 'Secure & Private', desc: 'HIPAA-compliant data handling and bank-grade SSL encryption on every transaction.' },
  { icon: Truck, title: '100% Satisfaction Guarantee', desc: 'Not happy? We\'ll make it right with our 30-day hassle-free return and refund policy.' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Verified Customer',
    avatar: 'SM',
    avatarBg: 'bg-purple-500',
    rating: 5,
    text: 'BethMedic completely changed how I manage my family\'s health. Products are genuinely top-quality and the customer support from Beth is second to none.',
    product: 'Omega-3 Fish Oil',
    location: 'New York, NY',
  },
  {
    name: 'James T.',
    role: 'Verified Customer · 1 year',
    avatar: 'JT',
    avatarBg: 'bg-blue-500',
    rating: 5,
    text: 'I have tried countless health platforms and nothing comes close to BethMedic. The quality of the products is unmatched and the team actually cares about your results.',
    product: 'Blood Pressure Monitor',
    location: 'Austin, TX',
  },
  {
    name: 'Linda K.',
    role: 'Loyal Customer · 2 years',
    avatar: 'LK',
    avatarBg: 'bg-emerald-500',
    rating: 5,
    text: 'The live chat with Beth helped me find the right probiotic after years of gut issues. Real advice, real products — not just marketing. I tell everyone about this site.',
    product: 'ProBio+ Probiotic',
    location: 'Seattle, WA',
  },
];

const faqs = [
  {
    q: 'Are your products FDA approved?',
    a: 'All our supplement manufacturing facilities are FDA-registered and follow GMP (Good Manufacturing Practices). Our medical devices are FDA-cleared. We source only from certified suppliers with documented quality assurance processes.',
  },
  {
    q: 'How fast will my order arrive?',
    a: 'Orders placed before 2 PM (EST) on business days ship same day. Standard delivery takes 3-5 business days. Free express shipping is available on orders over $50. All orders include tracking.',
  },
  {
    q: 'Can I speak directly with Beth?',
    a: 'Absolutely! Use our live chat widget (bottom right corner) to connect with Beth or a member of our expert team. We\'re available Monday–Saturday, 8 AM–8 PM EST, with emergency support available 24/7.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with any product for any reason, contact us and we\'ll either replace it or issue a full refund — no questions asked.',
  },
  {
    q: 'Are your supplements third-party tested?',
    a: 'Yes. Every supplement we carry comes with a Certificate of Analysis (CoA) from an independent, accredited laboratory verifying potency, purity, and the absence of contaminants.',
  },
  {
    q: 'Do you offer subscription or bulk discounts?',
    a: 'Yes! Subscribe & Save gives you 15% off recurring orders. For bulk orders (healthcare practices, businesses), contact us directly for wholesale pricing and custom quotes.',
  },
];

const steps = [
  { step: '01', title: 'Browse & Select', desc: 'Explore our certified catalog with advanced filters by category, condition, and certification type.', icon: Package, color: 'bg-purple-50 text-purple-600' },
  { step: '02', title: 'Get Expert Advice', desc: 'Chat with Beth for personalized recommendations — free with every account, no appointment needed.', icon: MessageCircle, color: 'bg-orange-50 text-orange-600' },
  { step: '03', title: 'Checkout Securely', desc: 'Bank-grade SSL encryption protects every transaction. Multiple payment methods accepted.', icon: Lock, color: 'bg-emerald-50 text-emerald-600' },
  { step: '04', title: 'Receive & Feel Better', desc: 'Fast, tracked delivery to your door. Our 30-day guarantee means zero risk to you.', icon: Truck, color: 'bg-sky-50 text-sky-600' },
];

function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#6B21A8]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-900/30 blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {stats.map(({ value, label, suffix }) => (
            <div key={label}>
              <div className="text-4xl md:text-5xl font-black text-white font-heading mb-2">
                {inView ? <CountUp end={value} duration={2.5} separator="," /> : '0'}{suffix}
              </div>
              <div className="text-white/60 text-sm font-semibold uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, open, toggle }: { q: string; a: string; open: boolean; toggle: () => void }) {
  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${open ? 'border-purple-200 shadow-[0_4px_20px_rgba(124,58,237,0.1)]' : 'border-gray-100 hover:border-purple-100'}`}>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-7 py-5 text-left"
      >
        <span className={`font-bold text-[0.95rem] pr-4 ${open ? 'text-[#7C3AED]' : 'text-slate-800'}`}>{q}</span>
        <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-gray-500'}`}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-7 pb-6">
          <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=6')
      .then(r => r.json())
      .then(setFeaturedProducts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 87%', once: true }
          }
        );
      });
      gsap.utils.toArray('.reveal-left').forEach((el: any) => {
        gsap.fromTo(el,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          }
        );
      });
      gsap.utils.toArray('.reveal-right').forEach((el: any) => {
        gsap.fromTo(el,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          }
        );
      });
      gsap.utils.toArray('.stagger-children').forEach((container: any) => {
        gsap.fromTo(container.children,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: container, start: 'top 82%', once: true }
          }
        );
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, [featuredProducts]);

  return (
    <div ref={sectionsRef}>
      <Hero />

      {/* ═══════════════════════════════════════════════
          TRUSTED BY BANNER
      ═══════════════════════════════════════════════ */}
      <div className="bg-slate-900 py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex-shrink-0">Certified &amp; Trusted By</span>
            {['FDA Registered', 'ISO 9001', 'GMP Certified', 'HIPAA Compliant', 'BBB Accredited'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-white/70 text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-up">
            <span className="section-tag mb-4">
              <Sparkles size={13} />
              What We Offer
            </span>
            <h2 className="section-title mt-4 mb-4">Complete Healthcare, One Platform</h2>
            <p className="section-subtitle mx-auto text-center">
              Everything from pharmaceutical supplements to expert consultations — certified, tested, and delivered with care.
            </p>
          </div>

          <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, desc, tag, tagColor, iconColor }) => (
              <div key={title} className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-[0_12px_50px_rgba(124,58,237,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5">
                <div className={`w-14 h-14 rounded-2xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={26} />
                </div>
                <div>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full mb-3 ${tagColor}`}>
                    {tag}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mb-2 font-heading">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS BAND
      ═══════════════════════════════════════════════ */}
      <StatsSection />

      {/* ═══════════════════════════════════════════════
          MEET BETH
      ═══════════════════════════════════════════════ */}
      <section id="meet-beth" className="section-py bg-gradient-to-br from-slate-50 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Visual side */}
            <div className="reveal-left relative order-2 lg:order-1">
              <div className="relative max-w-sm mx-auto lg:mx-0">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#7C3AED]/15 to-[#A855F7]/10 blur-xl scale-105" />
                {/* Card */}
                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#3B0764] via-[#581C87] to-[#6D28D9] shadow-[0_30px_70px_rgba(107,33,168,0.3)] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#F97316]/10 -translate-y-16 translate-x-16" />

                  <div className="relative p-10">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center mb-6">
                      <Stethoscope size={44} className="text-white/90" />
                    </div>

                    <div className="text-2xl font-black text-white font-heading mb-1">Dr. Precious Ojiugo</div>
                    <div className="text-[#F97316] font-bold text-sm mb-6">Founder & Chief Medical Officer</div>

                    <blockquote className="text-white/75 text-sm leading-relaxed mb-8 border-l-2 border-[#F97316] pl-4">
                      "I built BethMedic because I was tired of seeing patients spend money on low-quality supplements with zero clinical evidence. Every product here meets the same standards I'd hold for my own family."
                    </blockquote>

                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-white/60 text-xs font-medium">Rated 4.9/5 by 12,000+ patients</span>
                    </div>

                    <div className="mt-8 pt-7 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                      {[
                        { v: '15+', l: 'Yrs Experience' },
                        { v: '50K+', l: 'Patients' },
                        { v: '500+', l: 'Products' },
                      ].map(({ v, l }) => (
                        <div key={l}>
                          <div className="text-xl font-black text-white font-heading">{v}</div>
                          <div className="text-white/50 text-[11px] font-medium mt-0.5">{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <BadgeCheck size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Verified Expert</div>
                      <div className="text-sm font-bold text-gray-900">Licensed CMO</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Phone size={18} className="text-[#F97316]" />
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Live Chat</div>
                      <div className="text-sm font-bold text-gray-900">Always Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy side */}
            <div className="reveal-right order-1 lg:order-2">
              <span className="section-tag mb-6">
                <Users size={13} />
                Meet the Founder
              </span>
              <h2 className="section-title mt-4 mb-6">
                Healthcare Built by a
                <span className="block text-[#7C3AED]">Healthcare Professional</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Beth isn't just the founder — she's the reason every product on this platform meets clinical-grade standards. With over 15 years in healthcare, she built BethMedic to give every family access to the same quality used in professional medical settings.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  'Personally reviews and approves every product before listing',
                  'Available via live chat for personalized health guidance',
                  'Partners only with FDA-registered, GMP-certified suppliers',
                  'Offers 30-day satisfaction guarantee on all purchases',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#7C3AED] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary">
                  Shop Beth's Picks
                  <ArrowRight size={16} />
                </Link>
                <a href="#" className="inline-flex items-center gap-2 text-[#7C3AED] font-bold hover:text-[#6B21A8] transition-colors text-sm">
                  <MessageCircle size={16} />
                  Chat with Beth
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-up">
            <span className="section-tag mb-4">
              <Zap size={13} />
              Simple Process
            </span>
            <h2 className="section-title mt-4 mb-4">Getting Healthy Has Never Been Easier</h2>
            <p className="section-subtitle mx-auto text-center">
              Four steps from browsing to better health — with expert support every step of the way.
            </p>
          </div>

          <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map(({ step, title, desc, icon: Icon, color }, i) => (
              <div key={step} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)] transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-5xl font-black text-gray-100 font-heading leading-none">{step}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 font-heading">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 w-6 justify-center -translate-y-1/2">
                    <ArrowRight size={18} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-gradient-to-br from-slate-50 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-up">
            <span className="section-tag mb-4">
              <FlaskConical size={13} />
              Browse by Category
            </span>
            <h2 className="section-title mt-4 mb-4">Everything Your Health Needs</h2>
            <p className="section-subtitle mx-auto text-center">
              From pharmaceutical supplements to cutting-edge diagnostics — all certified, all guaranteed.
            </p>
          </div>

          <div className="stagger-children grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ name, icon: Icon, color, count }) => (
              <Link
                key={name}
                href={`/products?category=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-[0_8px_40px_rgba(124,58,237,0.12)] transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-[#7C3AED] transition-colors leading-snug">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">{count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 reveal-up">
            <div>
              <span className="section-tag mb-4">
                <Star size={13} />
                Editor's Pick
              </span>
              <h2 className="section-title mt-4">Featured Products</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-[#7C3AED] font-bold hover:text-[#6B21A8] transition-colors whitespace-nowrap text-sm">
              View All Products
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0
              ? featuredProducts.map(p => <ProductCard key={p.id} product={p} />)
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-50 animate-pulse h-80 border border-gray-100" />
                ))
            }
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY BETHMEDIC
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-gradient-to-br from-slate-50 to-purple-50/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-up">
            <span className="section-tag mb-4">
              <ThumbsUp size={13} />
              Why BethMedic
            </span>
            <h2 className="section-title mt-4 mb-4">Healthcare You Can Actually Trust</h2>
            <p className="section-subtitle mx-auto text-center">
              We hold ourselves to clinical standards so you never have to wonder whether a product is safe or effective.
            </p>
          </div>

          <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-white rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-[#7C3AED] flex items-center justify-center mb-5 transition-colors">
                  <Icon size={22} className="text-[#7C3AED] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 font-heading">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-up">
            <span className="section-tag mb-4">
              <Star size={13} />
              Real Stories
            </span>
            <h2 className="section-title mt-4 mb-4">Trusted by Thousands</h2>
            <p className="section-subtitle mx-auto text-center">
              Don't just take our word for it — here's what our community says.
            </p>
          </div>

          {/* Rating summary bar */}
          <div className="reveal-up flex flex-col sm:flex-row items-center justify-center gap-8 mb-14 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-6xl font-black text-slate-900 font-heading">4.9</div>
              <div className="flex justify-center my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-slate-500 text-sm font-medium">Overall Rating</div>
            </div>
            <div className="w-px h-16 bg-purple-200 hidden sm:block" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { label: 'Quality', pct: 98 },
                { label: 'Delivery', pct: 97 },
                { label: 'Support', pct: 99 },
                { label: 'Value', pct: 96 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-[#7C3AED] font-heading">{pct}%</div>
                  <div className="text-slate-500 text-xs font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="stagger-children grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-4 hover:border-purple-200 hover:shadow-[0_8px_40px_rgba(124,58,237,0.08)] transition-all duration-300">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 font-medium">{t.location}</div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 justify-end mt-0.5">
                        <BadgeCheck size={11} />
                        {t.product}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════ */}
      <section className="section-py bg-gradient-to-br from-slate-50 to-purple-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-up">
            <span className="section-tag mb-4">
              <MessageCircle size={13} />
              FAQ
            </span>
            <h2 className="section-title mt-4 mb-4">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto text-center">
              Everything you need to know. Can't find the answer? Chat with Beth directly.
            </p>
          </div>

          <div className="reveal-up space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                open={openFaq === i}
                toggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>

          <div className="mt-10 text-center reveal-up">
            <p className="text-slate-500 text-sm mb-4">Still have questions? We're happy to help.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:care@bethmedic.com"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-slate-700 font-bold px-6 py-3 rounded-full hover:border-purple-300 hover:text-[#7C3AED] transition-all text-sm shadow-sm"
              >
                Email Us
              </a>
              <button className="inline-flex items-center gap-2 bg-[#7C3AED] text-white font-bold px-6 py-3 rounded-full hover:bg-[#6B21A8] transition-all text-sm shadow-md">
                <MessageCircle size={15} />
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B0764] via-[#6B21A8] to-[#7C3AED]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F97316]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-900/30 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest border border-white/20 px-5 py-2 rounded-full mb-8">
            <Zap size={12} />
            Stay Informed
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 font-heading leading-tight">
            Get Exclusive Health Tips<br />
            <span className="text-[#F97316]">&amp; Early Access Deals</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ subscribers receiving weekly health insights and exclusive product offers from Beth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-lg"
            />
            <button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-[1.02] whitespace-nowrap shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
              Subscribe Free
            </button>
          </div>
          <p className="text-white/40 text-xs">No spam. Unsubscribe anytime. We respect your privacy.</p>

          <div className="flex items-center justify-center gap-8 mt-12 pt-10 border-t border-white/10">
            {[
              { icon: CheckCircle2, text: 'No spam, ever' },
              { icon: Lock, text: 'Privacy protected' },
              { icon: Zap, text: 'Cancel anytime' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
                <Icon size={14} className="text-white/40" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
