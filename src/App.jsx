import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MandapJourney from './components/MandapJourney';
import TwoFamiliesSection from './components/TwoFamiliesSection';
import DiscoverMatchSection from './components/DiscoverMatchSection';
import SocialPurposeSection from './components/SocialPurposeSection';
import FinalInvitationSection from './components/FinalInvitationSection';
import MembershipModal from './components/MembershipModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Eye, ShieldCheck, Box, Image as ImageIcon, Sparkles, X, Globe } from 'lucide-react';

function MainAppContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const [is3DMode, setIs3DMode] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [activeScene, setActiveScene] = useState(1);
  const [showManifest, setShowManifest] = useState(false);

  // Track active scene based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scenes = [1, 2, 3, 4, 5, 6];
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (const sceneNum of scenes) {
        const el = document.getElementById(`scene-${sceneNum}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveScene(sceneNum);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scenes = [
    { num: 1, name: 'Royal Entrance', hindi: 'मांगलिक प्रवेश' },
    { num: 2, name: 'Mandap Journey', hindi: 'परिणय वेदी' },
    { num: 3, name: 'Two Families', hindi: 'कुल मिलन' },
    { num: 4, name: 'Discover Match', hindi: 'योग्य वर-वधू' },
    { num: 5, name: 'Social Purpose', hindi: 'कल्याणम् सहायता' },
    { num: 6, name: 'The Invitation', hindi: 'सादर आमंत्रण' },
  ];

  return (
    <div className={`min-h-screen bg-[#080104] text-[#fdfaf4] ${isReducedMotion ? 'reduced-motion-active' : ''} ${language === 'hi' ? 'lang-hi' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        is3DMode={is3DMode}
        setIs3DMode={setIs3DMode}
        isReducedMotion={isReducedMotion}
        setIsReducedMotion={setIsReducedMotion}
        onOpenMembershipModal={() => setMembershipModalOpen(true)}
      />

      {/* Main Cinematic Scroll Story */}
      <main className="w-full">
        {/* Scene 1 — The Royal Entrance */}
        <HeroSection
          is3DMode={is3DMode}
          setIs3DMode={setIs3DMode}
          isReducedMotion={isReducedMotion}
          onOpenMembershipModal={() => setMembershipModalOpen(true)}
        />

        {/* Scene 2 — A Journey Toward Togetherness */}
        <MandapJourney isReducedMotion={isReducedMotion} />

        {/* Scene 3 — Two Families, One Relationship */}
        <TwoFamiliesSection isReducedMotion={isReducedMotion} />

        {/* Scene 4 — Discover Your Match */}
        <DiscoverMatchSection isReducedMotion={isReducedMotion} />

        {/* Scene 5 — A Relationship With Purpose (Kalyanam Sahayata) */}
        <SocialPurposeSection isReducedMotion={isReducedMotion} />

        {/* Scene 6 — The Final Invitation & Luxury Royal Footer */}
        <FinalInvitationSection
          isReducedMotion={isReducedMotion}
          onOpenMembershipModal={() => setMembershipModalOpen(true)}
        />
      </main>

      {/* Floating Right Scene Progress Tracker */}
      <nav
        aria-label="Scene progress indicator"
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3"
      >
        {scenes.map((s) => {
          const displayName = language === 'hi' ? s.hindi : s.name;
          return (
            <a
              key={s.num}
              href={`#scene-${s.num}`}
              className="flex items-center gap-2 group text-decoration-none"
              title={`${s.name} (${s.hindi})`}
            >
              <span
                className={`text-[10px] uppercase tracking-wider font-accent transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  activeScene === s.num ? 'opacity-100 text-[#f5d77f]' : 'text-stone-400'
                }`}
              >
                {displayName}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  activeScene === s.num
                    ? 'bg-[#d4af37] border-[#f5d77f] scale-125 shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                    : 'bg-black/60 border-[#d4af37]/40 group-hover:border-[#d4af37]'
                }`}
              />
            </a>
          );
        })}
      </nav>

      {/* Bottom Floating Visual Asset Manifest Toggle */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowManifest(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#18040d]/90 border border-[#d4af37]/50 text-xs font-accent uppercase tracking-wider text-[#faeed1] hover:text-[#f5d77f] shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all hover:scale-105"
        >
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>{t.manifestBtn}</span>
        </button>

        {/* Floating Quick Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#2a0815]/90 border border-[#d4af37] text-xs font-accent text-[#f5d77f] shadow-lg hover:scale-105 transition-transform backdrop-blur-md"
          title="Toggle Language (देवनागरी / English)"
        >
          <Globe size={13} />
          <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
        </button>
      </div>

      {/* Visual Asset & Quality Manifest Drawer / Modal */}
      {showManifest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl royal-card bg-[#14030a] border-2 border-[#d4af37] p-6 sm:p-8 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowManifest(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40"
              aria-label="Close manifest"
            >
              <X size={18} />
            </button>

            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] block mb-1">
              {t.manifestAudit}
            </span>
            <h3 className="font-display font-bold text-2xl text-[#faeed1] mb-4">
              {t.manifestTitle}
            </h3>

            <div className="space-y-4 text-xs text-[#d8c7b5]">
              {/* Category 1: Genuine 3D Experience */}
              <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/30">
                <div className="flex items-center gap-2 text-sm font-display font-bold text-[#f5d77f] mb-1">
                  <Box size={16} />
                  <span>1. Genuine 3D Experience (Three.js WebGL)</span>
                </div>
                <p className="font-light mb-2">
                  Implemented via <code className="text-[#f5d77f]">ThreeMandapScene.jsx</code> using Three.js:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-300">
                  <li>3D Octagonal Sandstone Vedi platform with gold torus trims.</li>
                  <li>4 Mughal/Rajput carved Stambhas (pillars) with fluting & brass capitals.</li>
                  <li>Tiered Havankund (copper fire pit) with flickering point light source & flame core.</li>
                  <li>3D Physics-driven floating rose petals (180 particles) and golden ember fireflies (240 particles).</li>
                  <li>PerspectiveCamera with smooth orbit controls and scroll-scrubbed camera angle interpolation.</li>
                </ul>
              </div>

              {/* Category 2: Motion Graphics */}
              <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/30">
                <div className="flex items-center gap-2 text-sm font-display font-bold text-[#f5d77f] mb-1">
                  <Sparkles size={16} />
                  <span>2. Procedural Motion Graphics Engine</span>
                </div>
                <p className="font-light mb-2">
                  Implemented via <code className="text-[#f5d77f]">MotionGraphicsCanvas.jsx</code>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-300">
                  <li>Real-time volumetric light beams (sunlight rays through palace arches).</li>
                  <li>Procedural golden embers with radial glow and screen blend mode.</li>
                  <li>Web Audio API royal Tanpura/Sitar harmonic drone soundscape generator.</li>
                </ul>
              </div>

              {/* Category 3: Original Generated Visual Assets */}
              <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/30">
                <div className="flex items-center gap-2 text-sm font-display font-bold text-[#f5d77f] mb-1">
                  <ImageIcon size={16} />
                  <span>3. Original Visual Assets (Local Storage in /public/assets)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-300">
                  <li><strong className="text-white">hero_palace_mandap.jpg</strong> — Royal Indian palace courtyard at twilight with reflective water pool.</li>
                  <li><strong className="text-white">mandap_ornate_details.jpg</strong> — Ornate carved stone canopy with crystal chandelier and falling rose petals.</li>
                  <li><strong className="text-white">family_blessing_heritage.jpg</strong> — Family elders giving traditional aashirvaad in haveli courtyard.</li>
                  <li><strong className="text-white">sacred_wedding_rituals.jpg</strong> — Close-up of mangalsutra ritual and sacred havankund flame.</li>
                  <li><strong className="text-white">bride_demo_profile.jpg</strong> — Sample editorial portrait of bride in velvet lehenga and kundan jewelry.</li>
                  <li><strong className="text-white">groom_demo_profile.jpg</strong> — Sample editorial portrait of groom in embroidered ivory sherwani.</li>
                  <li><strong className="text-white">social_assistance_kalyanam.jpg</strong> — Community elders presenting wedding gifts for underprivileged vivah.</li>
                  <li><strong className="text-white">cinematic_video_poster.jpg</strong> — Royal burgundy arch silhouette with volumetric rays and golden dust.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowManifest(false)}
                className="btn-royal-gold text-xs px-5 py-2.5"
              >
                {language === 'hi' ? 'विवरणिका बंद करें' : 'Close Manifest'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confidential Membership Inquiry Modal */}
      <MembershipModal
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
