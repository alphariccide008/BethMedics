'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Stethoscope, Award, Star, Users, CheckCircle2,
  ArrowRight, Heart, BookOpen, ShieldCheck, Microscope,
  MessageCircle, Phone, Mail, BadgeCheck, Quote
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const credentials = [
  { icon: Award, label: 'Licensed Healthcare Professional', sub: '15+ years clinical experience' },
  { icon: Microscope, label: 'Pharmacology & Nutrition Expert', sub: 'Specialised in integrative medicine' },
  { icon: BadgeCheck, label: 'FDA & GMP Compliance Advisor', sub: 'Certified quality assurance' },
  { icon: BookOpen, label: 'Health Education Advocate', sub: 'Community wellness programs' },
];

const timeline = [
  {
    year: '2008',
    title: 'Medical Training Begins',
    desc: 'Beth began her journey in healthcare, studying pharmacology and clinical nutrition at the University of Lagos College of Medicine.',
    icon: BookOpen,
  },
  {
    year: '2012',
    title: 'Clinical Practice',
    desc: 'Worked as a senior clinical pharmacist at Lagos University Teaching Hospital, where she noticed the gap in access to quality health products.',
    icon: Stethoscope,
  },
  {
    year: '2017',
    title: 'Community Health Advocacy',
    desc: 'Launched free health education workshops across Lagos, Abuja, and Port Harcourt — reaching over 10,000 Nigerians with evidence-based health guidance.',
    icon: Heart,
  },
  {
    year: '2021',
    title: 'BethMedic Founded',
    desc: 'Frustrated by counterfeit supplements flooding the Nigerian market, Beth founded BethMedic — Nigeria\'s first clinically vetted medical e-commerce platform.',
    icon: ShieldCheck,
  },
  {
    year: '2024',
    title: '50,000+ Patients Served',
    desc: 'BethMedic has grown to serve over 50,000 Nigerians across all 36 states, with a 4.9-star rating and a 99% satisfaction rate.',
    icon: Users,
  },
];

const values = [
  { icon: ShieldCheck, title: 'Clinical Integrity', desc: 'Every product on BethMedic passes the same rigorous standards Beth applies in her clinical practice. If she wouldn\'t recommend it to a patient, it won\'t appear on this platform.' },
  { icon: Users, title: 'Patient-First Approach', desc: 'Beth believes healthcare is a right, not a privilege. Every pricing decision, product choice, and support policy is made with the patient\'s best interest at heart.' },
  { icon: BookOpen, title: 'Education Over Sales', desc: 'Beth\'s mission goes beyond selling products — she creates educational content, answers questions personally, and empowers Nigerians to make informed health decisions.' },
  { icon: Microscope, title: 'Science-Backed Only', desc: 'No trends, no gimmicks. Every supplement is 3rd-party tested. Every medical device is clinically validated. Beth\'s name is on every product listed here.' },
];

const quotes = [
  {
    text: 'Beth didn\'t just sell me vitamins — she spent 20 minutes in the chat explaining exactly what my body needed based on my symptoms. I\'ve never experienced that level of care from a health platform.',
    author: 'Adaeze O., Lagos',
    rating: 5,
  },
  {
    text: 'As someone who has been burned by fake supplements before, finding BethMedic was a relief. You can feel the difference in quality, and knowing a real healthcare professional stands behind every product gives me peace of mind.',
    author: 'Emeka N., Abuja',
    rating: 5,
  },
  {
    text: 'I chat with Beth about my mum\'s medication routine regularly. She\'s patient, knowledgeable, and genuinely invested in outcomes — not just transactions.',
    author: 'Temi A., Port Harcourt',
    rating: 5,
  },
];

export default function FounderPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el: any) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
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
      gsap.utils.toArray('.stagger').forEach((container: any) => {
        gsap.fromTo(container.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: container, start: 'top 82%', once: true }
          }
        );
      });

      // Hero entrance
      gsap.fromTo('.founder-hero-left',
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.founder-hero-right',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.35 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-[#3B0764] via-[#6D28D9] to-[#7C3AED]">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#F97316]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-900/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div className="founder-hero-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-8">
                <Heart size={12} className="text-[#F97316]" />
                Meet Our Founder
              </div>
              <h1 className="font-heading font-black text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)' }}>
                The Story Behind<br />
                <span className="text-[#F97316]">BethMedic</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                Beth is a licensed healthcare professional with over 15 years of clinical experience. She founded BethMedic to solve a crisis she witnessed daily — Nigerians spending hard-earned money on counterfeit and substandard health products.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
                  Shop Beth's Picks
                  <ArrowRight size={16} />
                </Link>
                <Link href="/#meet-beth" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-full transition-all">
                  <MessageCircle size={16} />
                  Chat with Beth
                </Link>
              </div>
            </div>

            {/* Right — profile card */}
            <div className="founder-hero-right flex justify-center lg:justify-end">
              <div className="relative">
                {/* Card */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2rem] p-8 max-w-sm text-center">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-4 border-white/30 flex items-center justify-center mx-auto mb-5">
                    <Stethoscope size={52} className="text-white/90" />
                  </div>
                  <h2 className="text-2xl font-black text-white font-heading mb-1">Dr. Precious Nneoma Ojiugo</h2>
                  <p className="text-[#F97316] font-bold text-sm mb-2">Founder & Chief Medical Officer</p>
                  <p className="text-white/60 text-xs font-medium mb-5">MD, MSc Clinical Nutrition · Lagos, Nigeria</p>

                  <div className="flex justify-center gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-white/60 text-xs ml-2 self-center">4.9/5 platform rating</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center pt-5 border-t border-white/10">
                    {[
                      { v: '15+', l: 'Yrs Exp.' },
                      { v: '50K+', l: 'Patients' },
                      { v: '500+', l: 'Products' },
                    ].map(({ v, l }) => (
                      <div key={l}>
                        <div className="text-xl font-black text-white font-heading">{v}</div>
                        <div className="text-white/50 text-[11px]">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute -top-4 -right-4 bg-[#F97316] text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">
                  Online Now 🟢
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CREDENTIALS ═══════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="stagger grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {credentials.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-4 bg-purple-50/60 border border-purple-100 rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-snug">{label}</p>
                  <p className="text-slate-500 text-xs mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STORY ═══════ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            <div className="reveal-left">
              <span className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-[#7C3AED] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                Her Story
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-heading mb-6 leading-tight">
                Why Beth Built<br />
                <span className="text-[#7C3AED]">This Platform</span>
              </h2>
              <div className="space-y-5 text-slate-600 text-[0.97rem] leading-relaxed">
                <p>
                  During her years as a clinical pharmacist, Beth would regularly see patients arrive with supplements purchased from roadside vendors and online marketplaces — products that contained none of the ingredients on the label, and sometimes contained harmful contaminants.
                </p>
                <p>
                  "I would counsel patients to take a supplement, only for them to return three months later with no improvement — because what they bought wasn't what it claimed to be. It broke my heart every single time."
                </p>
                <p>
                  In 2021, Beth decided to do something about it. She founded BethMedic with a simple but powerful promise: <strong className="text-slate-900">every product on this platform is verified, every supplier is certified, and every customer has direct access to a real healthcare professional.</strong>
                </p>
                <p>
                  Today, BethMedic serves over 50,000 Nigerians across all 36 states, and Beth personally oversees the quality standards, answers customer chats, and continues to curate every product in the catalog.
                </p>
              </div>

              <div className="mt-8 bg-white border border-purple-100 rounded-2xl p-6">
                <Quote size={24} className="text-[#7C3AED]/30 mb-3" />
                <p className="text-slate-700 font-medium italic text-base leading-relaxed">
                  "Your health is not negotiable. You deserve products that actually work — verified by science and backed by someone who has dedicated their life to healthcare."
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] flex items-center justify-center">
                    <span className="text-white font-black text-sm">B</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Dr. Precious Nneoma Ojiugo</p>
                    <p className="text-slate-400 text-xs">Founder, BethMedic</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="reveal-right">
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-8">Beth's Journey</h3>
              <div className="space-y-0">
                {timeline.map(({ year, title, desc, icon: Icon }, i) => (
                  <div key={year} className="relative flex gap-5">
                    {/* Line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-[0_4px_15px_rgba(124,58,237,0.35)] flex-shrink-0 z-10">
                        <Icon size={18} className="text-white" />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-300 to-purple-100 my-2 min-h-[40px]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8">
                      <span className="text-xs font-black text-[#7C3AED] uppercase tracking-widest">{year}</span>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5 mb-1.5 font-heading">{title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ VALUES ═══════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-[#7C3AED] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              What She Stands For
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-heading mt-4 mb-4">Beth's Core Values</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Every decision at BethMedic flows from these four non-negotiable principles.
            </p>
          </div>
          <div className="stagger grid md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-white rounded-2xl border border-gray-100 p-8 hover:border-purple-200 hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-[#7C3AED] flex items-center justify-center mb-5 transition-colors">
                  <Icon size={26} className="text-[#7C3AED] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3 font-heading">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PATIENT QUOTES ═══════ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-heading mb-4">What Patients Say About Beth</h2>
            <p className="text-slate-500 text-lg">The impact she's made, in their own words.</p>
          </div>
          <div className="stagger grid md:grid-cols-3 gap-6">
            {quotes.map((q) => (
              <div key={q.author} className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-[0_8px_40px_rgba(124,58,237,0.08)] transition-all duration-300">
                <Quote size={28} className="text-purple-100 mb-4" />
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{q.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
                      {q.author[0]}
                    </div>
                    <p className="text-sm font-bold text-slate-700">{q.author}</p>
                  </div>
                  <div className="flex">
                    {[...Array(q.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B0764] via-[#6B21A8] to-[#7C3AED]" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-900/30 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Stethoscope size={36} className="text-white/80" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white font-heading mb-5">
            Ready to Experience<br />
            <span className="text-[#F97316]">Healthcare Done Right?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Shop Beth's personally curated catalog and chat with her directly. Your health deserves the same quality she'd give her own family.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
              Browse Products
              <ArrowRight size={16} />
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-full transition-all">
              Create Free Account
            </Link>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Phone size={14} />
              +234 800 BETH-MED
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Mail size={14} />
              care@bethmedic.com.ng
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MessageCircle size={14} />
              Live chat available
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
