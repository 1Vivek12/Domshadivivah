import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Users, Award, Shield, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function TwoFamiliesSection({ isReducedMotion }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      id: 0,
      title: t.story1Title,
      tagline: t.story1Tagline,
      image: '/assets/family_blessing_heritage.jpg',
      alt: 'Royal Indian family elders blessing bride and groom in traditional banarasi attire',
      description: t.story1Desc,
      points: t.story1Points,
      partLabel: t.traditionPart1,
    },
    {
      id: 1,
      title: t.story2Title,
      tagline: t.story2Tagline,
      image: '/assets/sacred_wedding_rituals.jpg',
      alt: 'Close-up of sacred mangalsutra ritual and havankund fire',
      description: t.story2Desc,
      points: t.story2Points,
      partLabel: t.traditionPart2,
    },
  ];

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.family-visual-frame',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <section
      id="scene-3"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 bg-[#0a0206] overflow-hidden"
    >
      {/* Decorative Jharokha background pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e0410]/80 border border-[#d4af37]/40 text-[#f5d77f] text-xs uppercase tracking-[0.2em] font-accent mb-4 backdrop-blur-md">
            <Users size={14} className="text-[#f5d77f]" />
            <span>{t.scene3Badge}</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-gold-gradient tracking-wide mb-4">
            {t.scene3Title}
          </h2>

          <div className="royal-divider">
            <div className="royal-divider-diamond"></div>
          </div>

          <p className="font-accent text-base sm:text-lg text-[#faeed1] font-light leading-relaxed">
            {t.scene3Subtitle}
          </p>
        </div>

        {/* Narrative Switcher Tabs */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12">
          {[
            { id: 0, label: t.scene3Tab1 },
            { id: 1, label: t.scene3Tab2 },
          ].map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveStory(idx)}
              className={`px-5 sm:px-8 py-3 rounded-full font-accent text-xs sm:text-sm tracking-wider transition-all duration-300 border ${
                activeStory === idx
                  ? 'bg-gradient-to-r from-[#801235] to-[#45091c] border-[#d4af37] text-[#faeed1] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                  : 'bg-black/40 border-[#d4af37]/30 text-stone-400 hover:text-[#faeed1] hover:border-[#d4af37]/60'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Editorial Two-Column Story Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Image with Arch Frame & Crossfade */}
          <div className="lg:col-span-7 family-visual-frame relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] group">
              <img
                src={stories[activeStory].image}
                alt={stories[activeStory].alt}
                className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-center filter brightness-[0.92] contrast-[1.08] transition-all duration-700 group-hover:scale-105"
                key={stories[activeStory].id}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#14030a] via-transparent to-black/30 pointer-events-none" />

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-[#d4af37]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-mono block">
                    VIVAH PARAMPARA
                  </span>
                  <p className="text-xs sm:text-sm text-[#faeed1] font-accent font-semibold">
                    {stories[activeStory].tagline}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#801235] border border-[#d4af37] flex items-center justify-center text-[#f5d77f]">
                  <Sparkles size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text & Values */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="p-8 rounded-2xl bg-[#18040d]/80 border border-[#d4af37]/30 backdrop-blur-md relative shadow-xl">
              <div className="royal-card-corner corner-tl" />
              <div className="royal-card-corner corner-tr" />
              <div className="royal-card-corner corner-bl" />
              <div className="royal-card-corner corner-br" />

              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                {stories[activeStory].partLabel}
              </span>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-gold-gradient mt-2 mb-4">
                {stories[activeStory].title}
              </h3>

              <p className="font-body text-sm sm:text-base text-[#d8c7b5] leading-relaxed font-light mb-6">
                {stories[activeStory].description}
              </p>

              <div className="space-y-3.5 pt-4 border-t border-[#d4af37]/20">
                {stories[activeStory].points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#d4af37] mt-1 shrink-0" />
                    <span className="text-xs sm:text-sm text-[#faeed1] font-accent leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heritage Trust Badge */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#d4af37]/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#2a0815] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                <Shield size={18} />
              </div>
              <p className="text-xs text-[#d8c7b5] font-light">
                <strong className="text-[#faeed1] font-accent">{t.elderMediationTitle}:</strong> {t.elderMediationDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
