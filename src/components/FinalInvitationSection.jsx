import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Heart, Shield, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function FinalInvitationSection({ isReducedMotion, onOpenMembershipModal }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const sealRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sealRef.current,
        { scale: 0.6, rotate: -25, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="scene-6"
      ref={sectionRef}
      className="relative w-full pt-24 sm:pt-28 md:pt-36 bg-[#080104] overflow-hidden scroll-mt-20"
    >
      {/* Background Visual Layer */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/assets/cinematic_video_poster.webp" type="image/webp" />
          <img
            src="/assets/cinematic_video_poster.jpg"
            alt="Royal burgundy and gold palace arch with volumetric light rays"
            width="1376"
            height="768"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.2]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080104] via-[#100207]/75 to-[#0a0205] pointer-events-none" />
        <div className="cinematic-vignette pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Final Invitation Royal Card */}
        <div
          ref={cardRef}
          className="royal-card max-w-4xl mx-auto p-6 sm:p-14 text-center border-2 border-[#d4af37]/70 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative bg-[#18040d]/85 mb-20 sm:mb-24"
        >
          {/* Corner Ornaments */}
          <div className="royal-card-corner corner-tl" />
          <div className="royal-card-corner corner-tr" />
          <div className="royal-card-corner corner-bl" />
          <div className="royal-card-corner corner-br" />

          {/* Royal Seal Emblem */}
          <div
            ref={sealRef}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-6 bg-gradient-to-br from-[#d4af37] via-[#801235] to-[#20040d] border-2 border-[#f5d77f] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <span className="font-display font-extrabold text-[#faeed1] text-xl sm:text-2xl">ॐ</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full bg-black/60 border border-[#d4af37]/40 text-[#f5d77f] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-accent mb-4">
            <Sparkles size={12} />
            <span>{t.scene6Badge}</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-gold-gradient tracking-wide mb-4">
            {t.scene6Title}
          </h2>

          <div className="royal-divider">
            <div className="royal-divider-diamond"></div>
          </div>

          <p className="font-accent text-base sm:text-lg text-[#faeed1] font-light max-w-2xl mx-auto leading-relaxed mb-8 px-2">
            {t.scene6Subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-md sm:max-w-none mx-auto">
            <button
              onClick={onOpenMembershipModal}
              className="btn-royal-gold w-full sm:w-auto px-8 py-3.5 sm:py-4 text-xs sm:text-sm cursor-pointer"
            >
              <span>{t.requestMembershipBtn}</span>
            </button>

            <a
              href="#scene-4"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('scene-4');
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="btn-royal-outline w-full sm:w-auto px-7 py-3.5 text-xs tracking-wider cursor-pointer text-center"
            >
              <span>{t.reviewProfilesBtn}</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d4af37]/20 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#d8c7b5]/80 font-accent">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#d4af37]" />
              {t.trustConfidential}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{t.trustVerified}</span>
            <span className="hidden sm:inline">•</span>
            <span>{t.trustMediation}</span>
          </div>
        </div>

        {/* LUXURY ROYAL FOOTER (Extended bottom padding to ensure zero overlap with fixed controls) */}
        <footer className="pt-16 pb-28 sm:pb-24 border-t border-[#d4af37]/20 text-stone-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
            {/* Col 1: Brand & Sanskrit Shloka */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#801235]">
                  <span className="font-display font-bold text-[#f5d77f] text-base">ॐ</span>
                </div>
                <div>
                  <span className="font-display font-bold text-lg tracking-[0.12em] text-[#faeed1] block">
                    {t.brandTitle}
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#d4af37] font-accent uppercase">
                    {t.brandSubtitle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#d8c7b5] leading-relaxed font-light">
                {t.footerBrandDesc}
              </p>

              <div className="p-3 rounded-lg bg-black/40 border border-[#d4af37]/20 text-[11px] font-accent italic text-[#f5d77f]">
                {t.footerShloka}
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-display text-xs uppercase tracking-widest text-[#f5d77f] pb-1 border-b border-[#d4af37]/20">
                {t.footerNavTitle}
              </h4>
              <ul className="space-y-2 text-xs font-accent">
                <li><a href="#scene-1" className="text-stone-400 hover:text-[#f5d77f] transition-colors">01. {t.navEntrance}</a></li>
                <li><a href="#scene-2" className="text-stone-400 hover:text-[#f5d77f] transition-colors">02. {t.navMandap}</a></li>
                <li><a href="#scene-3" className="text-stone-400 hover:text-[#f5d77f] transition-colors">03. {t.navFamilies}</a></li>
                <li><a href="#scene-4" className="text-stone-400 hover:text-[#f5d77f] transition-colors">04. {t.navMatch}</a></li>
                <li><a href="#scene-5" className="text-stone-400 hover:text-[#f5d77f] transition-colors">05. {t.navPurpose}</a></li>
                <li><a href="#scene-6" className="text-stone-400 hover:text-[#f5d77f] transition-colors">06. {t.navInvitation}</a></li>
              </ul>
            </div>

            {/* Col 3: Principles & Integrity */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-display text-xs uppercase tracking-widest text-[#f5d77f] pb-1 border-b border-[#d4af37]/20">
                {t.footerPillarsTitle}
              </h4>
              <ul className="space-y-2 text-xs font-accent text-stone-400">
                <li>{t.trustConfidential}</li>
                <li>{t.elderMediationTitle}</li>
                <li>{t.astrologyTitle}</li>
                <li>{t.charityBadge}</li>
                <li>100% Offline Integrity</li>
              </ul>
            </div>

            {/* Col 4: Elder Concierge Liaison */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-display text-xs uppercase tracking-widest text-[#f5d77f] pb-1 border-b border-[#d4af37]/20">
                {t.footerSecretariatTitle}
              </h4>
              <div className="space-y-2 text-xs text-[#d8c7b5] font-light">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#d4af37] shrink-0" />
                  <span>{t.footerAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#d4af37] shrink-0" />
                  <span>{t.footerDesk}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#d4af37] shrink-0" />
                  <span>{t.footerEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#d4af37]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>
              &copy; {new Date().getFullYear()} {t.footerCopyright}
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider text-[#d4af37] hover:text-[#f5d77f] transition-colors"
            >
              <span>{t.ascendBtn}</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
