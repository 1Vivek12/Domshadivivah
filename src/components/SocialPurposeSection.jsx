import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShieldCheck, Sparkles, Gift, Check, X, Users, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function SocialPurposeSection({ isReducedMotion }) {
  const { language, t } = useLanguage();
  const sectionRef = useRef(null);
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState(2100);
  const [customAmount, setCustomAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    phone: '',
    disclaimerAccepted: false,
  });

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && pledgeModalOpen) {
        resetModal();
      }
    };
    if (pledgeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pledgeModalOpen]);

  const activeAmount = customAmount ? Number(customAmount) : pledgeAmount;

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!donorData.disclaimerAccepted) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया स्वीकार करें कि यह योगदान पूर्णतः स्वैच्छिक है और सदस्यता शुल्क से अलग है।'
          : 'Please acknowledge that this charity contribution is voluntary and separate from membership fees.'
      );
      return;
    }

    if (!activeAmount || activeAmount < 100) {
      setErrorMessage(language === 'hi' ? 'कृपया कम से कम ₹100 की सहयोग राशि दर्ज करें।' : 'Please enter a valid amount (minimum ₹100).');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/charity/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contributorName: donorData.name,
          email: donorData.email,
          phone: donorData.phone,
          amount: activeAmount,
          disclaimerAccepted: true,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit pledge');
      }

      setSubmittedData(result.data);
    } catch (err) {
      console.error('Charity contribution submission error:', err);
      setErrorMessage(err.message || 'Network error submitting pledge.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setSubmittedData(null);
    setErrorMessage('');
    setPledgeModalOpen(false);
  };

  return (
    <section
      id="scene-5"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-28 md:py-36 bg-[#0a0205] overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Requirement 5) */}
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
            <picture>
              <source srcSet="/assets/social_assistance_kalyanam.webp" type="image/webp" />
              <img
                src="/assets/social_assistance_kalyanam.jpg"
                alt="Dignified community wedding gifts and community support for humble bride"
                width="1376"
                height="768"
                loading="lazy"
                decoding="async"
                className="w-full h-[340px] sm:h-[460px] object-cover object-center filter brightness-[0.9] contrast-[1.05]"
              />
            </picture>
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
                  <span className="text-2xl font-display font-bold text-[#f5d77f]">100%</span>
                  <span className="text-xs text-[#d8c7b5] block font-accent">
                    {language === 'hi' ? 'स्वैच्छिक एवं ऐच्छिक' : 'Voluntary & Optional'}
                  </span>
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

        {/* CRITICAL SEPARATE ACCOUNTING CARD (Requirement 5 & 6) */}
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

            {/* Column B: Voluntary Kalyanam Charity */}
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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="charity-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-in fade-in overflow-y-auto"
        >
          <div className="relative w-full max-w-lg royal-card bg-[#16030b] border-2 border-[#d4af37] p-5 sm:p-8 rounded-2xl shadow-2xl my-6">
            <button
              onClick={resetModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {submittedData ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#801235] border-2 border-[#d4af37] mx-auto flex items-center justify-center text-[#f5d77f] animate-bounce">
                  <Heart size={32} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                  CHARITY REFERENCE: {submittedData.id}
                </span>
                <h3 className="font-display font-bold text-2xl text-gold-gradient">
                  {t.pledgeThanksTitle}
                </h3>
                <div className="p-3.5 rounded-lg bg-[#240614] border border-[#d4af37]/35 text-xs text-[#faeed1] leading-relaxed text-left">
                  <p>{language === 'hi' ? submittedData.messageHindi : submittedData.messageEn}</p>
                  <p className="mt-2 text-stone-300 italic text-[11px]">
                    * {language === 'hi' ? 'चैरिटी बहीखाता में अलग प्रविष्टि दर्ज की गई है।' : 'Recorded in the segregated charity ledger.'}
                  </p>
                </div>
                <button
                  onClick={resetModal}
                  className="btn-royal-gold text-xs px-6 py-2"
                >
                  {language === 'hi' ? 'स्वीकारें एवं बंद करें' : 'Acknowledge & Close'}
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block mb-1">
                  {t.pledgeTag}
                </span>
                <h3 id="charity-modal-title" className="font-display font-bold text-2xl text-[#faeed1] mb-2">
                  {t.pledgeTitle}
                </h3>
                <p className="text-xs text-[#d8c7b5] leading-relaxed mb-4 font-light">
                  {t.pledgeDesc}
                </p>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handlePledgeSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-accent uppercase text-[#faeed1] block mb-2">
                      {t.selectAmount}
                    </label>
                    <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                      {[1100, 2100, 5100].map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => {
                            setPledgeAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                            !customAmount && pledgeAmount === amt
                              ? 'bg-[#d4af37] text-black border-[#f5d77f] shadow-lg'
                              : 'bg-black/40 border-[#d4af37]/30 text-[#faeed1] hover:border-[#d4af37]'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      placeholder={t.customAmountLabel}
                      min="100"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                      {t.sponsorName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorData.name}
                      onChange={(e) => setDonorData({ ...donorData, name: e.target.value })}
                      placeholder="e.g. शर्मा परिवार, जयपुर / Sharma Family"
                      className="w-full px-4 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                        {t.sponsorPhone}
                      </label>
                      <input
                        type="tel"
                        value={donorData.phone}
                        onChange={(e) => setDonorData({ ...donorData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                        {t.sponsorEmail}
                      </label>
                      <input
                        type="email"
                        value={donorData.email}
                        onChange={(e) => setDonorData({ ...donorData, email: e.target.value })}
                        placeholder="family@domain.com"
                        className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  {/* Disclaimer & Voluntary Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-300">
                      <input
                        type="checkbox"
                        required
                        checked={donorData.disclaimerAccepted}
                        onChange={(e) => setDonorData({ ...donorData, disclaimerAccepted: e.target.checked })}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <span>
                        {t.disclaimerAcknowledgeLabel}
                      </span>
                    </label>
                  </div>

                  {/* Payment Gateway Pending Notice */}
                  <div className="p-2.5 rounded-lg bg-black/60 border border-[#d4af37]/20 text-[11px] text-amber-200/80 leading-relaxed flex items-start gap-2">
                    <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {language === 'hi'
                        ? 'भुगतान गेटवे एकीकरण प्रक्रियाधीन है। यह स्वैच्छिक संकल्प अलग चैरिटी बहीखाते में दर्ज होगा।'
                        : 'Payment gateway integration is pending. This pledge is recorded in the segregated charity ledger.'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-royal-gold w-full text-center py-3 text-xs disabled:opacity-50"
                  >
                    {submitting
                      ? (language === 'hi' ? 'संकल्प दर्ज हो रहा है...' : 'Recording Pledge...')
                      : `${t.confirmPledge} (₹${activeAmount.toLocaleString()})`
                    }
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
