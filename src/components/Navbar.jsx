import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Box, ShieldCheck, Menu, X, Heart, Globe, Lock } from 'lucide-react';
import { royalAudio } from '../utils/audioAmbience';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({
  is3DMode,
  setIs3DMode,
  isReducedMotion,
  setIsReducedMotion,
  onOpenMembershipModal,
  onOpenAdminModal,
}) {
  const { language, toggleLanguage, t } = useLanguage();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const playing = royalAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const navLinks = [
    { name: t.navEntrance, href: '#scene-1' },
    { name: t.navMandap, href: '#scene-2' },
    { name: t.navFamilies, href: '#scene-3' },
    { name: t.navMatch, href: '#scene-4' },
    { name: t.navPurpose, href: '#scene-5' },
    { name: t.navInvitation, href: '#scene-6' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#120309]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.85)] py-2.5'
          : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Identity */}
        <a href="#scene-1" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center bg-gradient-to-br from-[#801235] to-[#20050d] shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
            <span className="font-display font-bold text-[#f5d77f] text-base">ॐ</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-lg sm:text-xl tracking-[0.12em] text-[#faeed1] group-hover:text-[#f5d77f] transition-colors leading-tight">
              {t.brandTitle}
            </span>
            <span className="text-[10px] tracking-[0.18em] text-[#d4af37] font-accent">
              {t.brandSubtitle}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.14em] font-accent text-[#d8c7b5] hover:text-[#f5d77f] transition-colors relative py-1 group"
            >
              <span className="text-[9px] text-[#d4af37]/70 mr-1 font-mono">0{idx + 1}</span>
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#d4af37] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* MULTI-LANGUAGE SWITCHER (Devanagari हिन्दी <-> English) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af37] bg-gradient-to-r from-[#2a0815] to-[#120208] text-xs font-accent tracking-wider text-[#faeed1] hover:border-[#f5d77f] shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all hover:scale-105"
            title={language === 'hi' ? 'Switch to English' : 'देवनागरी हिन्दी में देखें'}
          >
            <Globe size={13} className="text-[#f5d77f]" />
            <span className="font-bold text-[#f5d77f]">
              {language === 'hi' ? 'अ हिन्दी' : 'EN English'}
            </span>
            <span className="text-[10px] text-stone-400">
              ({language === 'hi' ? 'EN' : 'हिन्दी'})
            </span>
          </button>

          {/* 3D Mode Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs tracking-wider font-accent uppercase transition-all ${
              is3DMode
                ? 'bg-[#d4af37]/25 border-[#d4af37] text-[#faeed1] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'bg-black/40 border-[#d4af37]/30 text-[#d8c7b5] hover:border-[#d4af37]/60'
            }`}
            title="Toggle between 3D Mandap & Cinematic Film"
          >
            <Box size={13} className={is3DMode ? 'text-[#f5d77f]' : 'text-stone-400'} />
            <span>{is3DMode ? t.nav3DActive : t.nav3DMode}</span>
          </button>

          {/* Soundscape Ambience Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs tracking-wider font-accent uppercase transition-all ${
              isAudioPlaying
                ? 'bg-[#801235]/50 border-[#d4af37] text-[#faeed1] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'bg-black/40 border-[#d4af37]/30 text-[#d8c7b5] hover:border-[#d4af37]/60'
            }`}
            title="Toggle Royal Shehnai & Tanpura Ambience (Web Audio)"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 size={13} className="text-[#f5d77f] animate-pulse" />
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2.5 bg-[#f5d77f] animate-bounce"></span>
                  <span className="w-0.5 h-3.5 bg-[#f5d77f] animate-pulse"></span>
                  <span className="w-0.5 h-2 bg-[#f5d77f] animate-bounce"></span>
                </span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-stone-400" />
                <span>{t.navAudioRaga}</span>
              </>
            )}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => setIsReducedMotion(!isReducedMotion)}
            className={`p-1.5 rounded-full border text-xs transition-all ${
              isReducedMotion
                ? 'bg-amber-900/40 border-[#d4af37] text-[#f5d77f]'
                : 'bg-black/40 border-[#d4af37]/30 text-stone-400 hover:text-[#faeed1]'
            }`}
            title={isReducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
          >
            <Sparkles size={13} />
          </button>

          {/* Admin Button */}
          <button
            onClick={onOpenAdminModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/40 text-xs font-accent text-[#faeed1] hover:border-[#f5d77f] hover:text-[#f5d77f] transition-all"
            title={t.navAdmin}
          >
            <Lock size={12} className="text-[#f5d77f]" />
            <span>{t.navAdmin}</span>
          </button>

          {/* Royal CTA */}
          <button
            onClick={onOpenMembershipModal}
            className="btn-royal-gold text-xs px-4 py-2"
          >
            <span>{t.navInquireVivah}</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex xl:hidden items-center gap-2">
          {/* Mobile Language Button */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full border border-[#d4af37] text-xs font-accent text-[#f5d77f] bg-[#2a0815]"
          >
            {language === 'hi' ? 'EN' : 'अ'}
          </button>

          <button
            onClick={toggleSound}
            className="p-2 text-[#d4af37]"
            aria-label="Toggle Sound"
          >
            {isAudioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#faeed1] hover:text-[#d4af37]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#14030a]/98 backdrop-blur-xl border-b border-[#d4af37]/30 px-6 py-6 transition-all">
          <div className="flex flex-col gap-3.5 mb-6">
            {navLinks.map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-accent text-[#faeed1] hover:text-[#f5d77f] py-1 flex items-center justify-between"
              >
                <span>{item.name}</span>
                <span className="text-xs text-[#d4af37]/70 font-mono">0{idx + 1}</span>
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col gap-3">
            {/* Language Switch in Mobile Menu */}
            <button
              onClick={() => {
                toggleLanguage();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded border border-[#d4af37] text-xs font-accent uppercase text-[#f5d77f] bg-[#2a0815]"
            >
              <Globe size={15} />
              <span>{language === 'hi' ? 'Switch to English' : 'देवनागरी (हिन्दी) में बदलें'}</span>
            </button>

            <button
              onClick={() => {
                setIs3DMode(!is3DMode);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded border border-[#d4af37]/40 text-xs font-accent uppercase text-[#faeed1]"
            >
              <Box size={16} />
              <span>{is3DMode ? t.navFilmMode : t.nav3DMode}</span>
            </button>

            <button
              onClick={() => {
                setIsReducedMotion(!isReducedMotion);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 rounded border border-[#d4af37]/30 text-xs font-accent uppercase text-stone-300"
            >
              <Sparkles size={14} />
              <span>{isReducedMotion ? 'Enable Motion' : t.navReducedMotion}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded border border-[#d4af37]/40 text-xs font-accent uppercase text-[#f5d77f] bg-black/50"
            >
              <Lock size={15} />
              <span>{t.navAdmin}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMembershipModal();
              }}
              className="btn-royal-gold w-full text-center py-3 text-xs"
            >
              {t.navInquireVivah}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
