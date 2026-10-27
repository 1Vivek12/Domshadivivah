import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Flame, Heart, Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function MandapJourney({ isReducedMotion }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const bgImageRef = useRef(null);
  const cardGroupRef = useRef(null);
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Background Image Parallax depth
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { yPercent: -10, scale: 1.05 },
          {
            yPercent: 12,
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // Staggered reveal of narrative stage cards
      const stages = [stage1Ref.current, stage2Ref.current, stage3Ref.current];
      stages.forEach((stage) => {
        if (!stage) return;
        gsap.fromTo(
          stage,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stage,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const stagesData = [
    {
      ref: stage1Ref,
      number: '01',
      icon: Bell,
      title: t.stage1Title,
      hindi: t.stage1Hindi,
      desc: t.stage1Desc,
      detail: t.stage1Detail,
    },
    {
      ref: stage2Ref,
      number: '02',
      icon: Sparkles,
      title: t.stage2Title,
      hindi: t.stage2Hindi,
      desc: t.stage2Desc,
      detail: t.stage2Detail,
    },
    {
      ref: stage3Ref,
      number: '03',
      icon: Flame,
      title: t.stage3Title,
      hindi: t.stage3Hindi,
      desc: t.stage3Desc,
      detail: t.stage3Detail,
    },
  ];

  return (
    <section
      id="scene-2"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 overflow-hidden bg-[#0d0207]"
    >
      {/* Background Visual Layer with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bgImageRef} className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform">
          <img
            src="/assets/mandap_ornate_details.jpg"
            alt="Ornate Wedding Mandap Canopy with Chandelier and Falling Rose Petals"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.15]"
            loading="lazy"
          />
        </div>
        {/* Deep rich burgundy gradient masks */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0206] via-[#1a040e]/75 to-[#0e0208] pointer-events-none" />
        <div className="cinematic-vignette pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e0511]/80 border border-[#d4af37]/40 text-[#f5d77f] text-xs uppercase tracking-[0.2em] font-accent mb-4 backdrop-blur-md">
            <Sparkles size={13} className="text-[#f5d77f]" />
            <span>{t.scene2Badge}</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-gold-gradient tracking-wide mb-5">
            {t.scene2Title}
          </h2>

          <div className="royal-divider">
            <div className="royal-divider-diamond"></div>
          </div>

          <p className="font-accent text-base sm:text-lg md:text-xl text-[#faeed1] font-light leading-relaxed">
            {t.scene2Subtitle}
          </p>
        </div>

        {/* Narrative Stages Grid */}
        <div ref={cardGroupRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {stagesData.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.number}
                ref={stage.ref}
                className="royal-card p-8 flex flex-col justify-between group hover:border-[#f5d77f]/70"
              >
                {/* Decorative Corners */}
                <div className="royal-card-corner corner-tl" />
                <div className="royal-card-corner corner-tr" />
                <div className="royal-card-corner corner-bl" />
                <div className="royal-card-corner corner-br" />

                <div>
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/20">
                    <span className="font-mono text-xs tracking-widest text-[#d4af37]/80 font-bold">
                      {t.phaseLabel} {stage.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#350a19] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] group-hover:scale-110 group-hover:bg-[#801235] transition-all">
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Hindi & Title */}
                  <div className="mb-4">
                    <span className="text-xs text-[#d4af37] font-accent tracking-widest block mb-1">
                      {stage.hindi}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl text-[#faeed1] group-hover:text-[#f5d77f] transition-colors leading-snug">
                      {stage.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm text-[#d8c7b5] leading-relaxed mb-6 font-light">
                    {stage.desc}
                  </p>
                </div>

                {/* Bottom Detail */}
                <div className="pt-4 border-t border-[#d4af37]/15">
                  <p className="text-xs text-[#d4af37]/90 font-accent italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinematic Mandap Quote Banner */}
        <div className="mt-16 text-center max-w-3xl mx-auto p-6 rounded-xl bg-black/45 border border-[#d4af37]/25 backdrop-blur-md">
          <p className="font-accent text-sm sm:text-base text-[#faeed1] italic leading-relaxed">
            {t.scene2Quote}
          </p>
        </div>
      </div>
    </section>
  );
}
