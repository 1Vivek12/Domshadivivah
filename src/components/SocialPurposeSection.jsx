import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShieldCheck, Sparkles, Gift, Check, X, Users, Award, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function SocialPurposeSection({ isReducedMotion }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState(5100);
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.purpose-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.2,
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

  const handlePledgeSubmit = (e) => {
    e.preventDefault();
    setPledgeSubmitted(true);
    setTimeout(() => {
      setPledgeSubmitted(false);
      setPledgeModalOpen(false);
    }, 2800);
  };

  return (
    <section
      id="scene-5"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 bg-[#0a0205] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e0812]/80 border border-[#d4af37]/40 text-[#f5d77f] text-xs uppercase tracking-[0.2em] font-accent mb-4 backdrop-blur-md">
            <Heart size={14} className="text-[#f5d77f]" />
            <span>{t.scene5Badge}</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-gold-gradient tracking-wide mb-4">
            {t.scene5Title}
          </h2>

          <div className="royal-divider">
            <div className="royal-divider-diamond"></div>
          </div>

          <p className="font-accent text-base sm:text-lg text-[#faeed1] font-light leading-relaxed">
            {t.scene5Subtitle}
          </p>
        </div>

        {/* Feature Hero Card with Story Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-7 purpose-card relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl">
            <img
              src="/assets/social_assistance_kalyanam.jpg"
              alt="Dignified community wedding gifts and community support for humble bride"
              className="w-full h-[380px] sm:h-[460px] object-cover object-center filter brightness-[0.9] contrast-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0208] via-transparent to-black/30 pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/30">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#f5d77f] block">
                {t.kalyanamTagline}
              </span>
              <p className="text-xs sm:text-sm text-[#faeed1] font-accent">
                {t.kalyanamImageCaption}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 purpose-card flex flex-col justify-center space-y-6">
            <div className="p-8 rounded-2xl bg-[#18040d]/80 border border-[#d4af37]/30 backdrop-blur-md relative">
              <div className="royal-card-corner corner-tl" />
              <div className="royal-card-corner corner-tr" />
              <div className="royal-card-corner corner-bl" />
              <div className="royal-card-corner corner-br" />

              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                {t.missionDignity}
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#faeed1] mt-2 mb-4">
                {t.empoweringTitle}
              </h3>
              <p className="font-body text-sm text-[#d8c7b5] leading-relaxed font-light mb-6">
                {t.empoweringDesc}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#faeed1]">
                  <Gift size={16} className="text-[#d4af37] shrink-0" />
                  <span>{t.kitItem1}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#faeed1]">
                  <Gift size={16} className="text-[#d4af37] shrink-0" />
                  <span>{t.kitItem2}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#faeed1]">
                  <Gift size={16} className="text-[#d4af37] shrink-0" />
                  <span>{t.kitItem3}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#d4af37]/20 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <span className="text-2xl font-display font-bold text-[#f5d77f]">480+</span>
                  <span className="text-xs text-[#d8c7b5] block font-accent">{t.statMarriages}</span>
                </div>
                <button
                  onClick={() => setPledgeModalOpen(true)}
                  className="btn-royal-gold text-xs px-5 py-2.5"
                >
                  {t.contributeBtn}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CRITICAL DISTINCTION CARD (Matrimonial vs Charitable) */}
        <div className="purpose-card p-6 sm:p-8 rounded-2xl bg-[#14030a] border-2 border-[#d4af37]/60 shadow-[0_15px_45px_rgba(0,0,0,0.8)]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] block mb-1">
              {t.distinctionTagline}
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#faeed1]">
              {t.distinctionHeading}
            </h3>
            <p className="text-xs sm:text-sm text-[#d8c7b5] font-light mt-1">
              {t.distinctionSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Column A: Matrimonial Service Fees */}
            <div className="p-6 rounded-xl bg-black/40 border border-[#d4af37]/25 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#801235] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#faeed1]">
                    {t.commercialTitle}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono uppercase">
                    {t.commercialBadge}
                  </span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-[#d8c7b5] font-light">
                {t.commercialPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="text-[#d4af37] mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column B: Charitable Kalyanam Sahayata */}
            <div className="p-6 rounded-xl bg-[#200511] border border-[#d4af37]/50 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center">
                  <Heart size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#f5d77f]">
                    {t.charityTitle}
                  </h4>
                  <span className="text-[10px] text-amber-200/70 font-mono uppercase">
                    {t.charityBadge}
                  </span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-[#faeed1] font-light">
                {t.charityPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="text-[#f5d77f] mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sahayata Pledge Modal */}
      {pledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in">
          <div className="relative w-full max-w-lg royal-card bg-[#16030b] border-2 border-[#d4af37] p-6 sm:p-8 rounded-2xl shadow-2xl">
            <button
              onClick={() => setPledgeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {pledgeSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#801235] border-2 border-[#d4af37] mx-auto flex items-center justify-center text-[#f5d77f] animate-bounce">
                  <Heart size={32} />
                </div>
                <h3 className="font-display font-bold text-2xl text-gold-gradient">
                  {t.pledgeThanksTitle}
                </h3>
                <p className="text-sm text-[#faeed1] font-accent">
                  {t.pledgeThanksDesc}
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block mb-1">
                  {t.pledgeTag}
                </span>
                <h3 className="font-display font-bold text-2xl text-[#faeed1] mb-2">
                  {t.pledgeTitle}
                </h3>
                <p className="text-xs text-[#d8c7b5] leading-relaxed mb-6 font-light">
                  {t.pledgeDesc}
                </p>

                <form onSubmit={handlePledgeSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-accent uppercase text-[#faeed1] block mb-2">
                      {t.selectAmount}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[2100, 5100, 11000].map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => setPledgeAmount(amt)}
                          className={`py-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                            pledgeAmount === amt
                              ? 'bg-[#d4af37] text-black border-[#f5d77f] shadow-lg'
                              : 'bg-black/40 border-[#d4af37]/30 text-[#faeed1] hover:border-[#d4af37]'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                      {t.sponsorName}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. शर्मा परिवार / Sharma Family"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                      {t.sponsorEmail}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="family@domain.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <p className="text-[10px] text-stone-400 italic">
                    * {t.modalDisclaimer}
                  </p>

                  <button
                    type="submit"
                    className="btn-royal-gold w-full text-center py-3 text-xs"
                  >
                    {t.confirmPledge}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
