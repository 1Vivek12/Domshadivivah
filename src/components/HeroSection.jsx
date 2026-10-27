import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronDown, Compass, Box } from 'lucide-react';
import MotionGraphicsCanvas from './MotionGraphicsCanvas';
import ThreeMandapScene from './ThreeMandapScene';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({
  is3DMode,
  setIs3DMode,
  isReducedMotion,
  onOpenMembershipModal
}) {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const visualLayerRef = useRef(null);
  const textContentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaGroupRef = useRef(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Opening cinematic reveal sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 30, letterSpacing: '0.4em' },
        { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1.4, delay: 0.3 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1.6 },
          '-=0.9'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.2 },
          '-=0.9'
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0 },
          '-=0.7'
        );

      // Scroll-scrubbed camera zoom & parallax on hero background
      if (visualLayerRef.current) {
        gsap.to(visualLayerRef.current, {
          scale: 1.15,
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Smooth scroll-driven fade of hero text as user scrolls into Scene 2
      if (textContentRef.current) {
        gsap.to(textContentRef.current, {
          opacity: 0.1,
          y: -60,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'center top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const handleScrollToJourney = (e) => {
    e.preventDefault();
    const target = document.getElementById('scene-2');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="scene-1"
      ref={heroRef}
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0a0205] pt-24 pb-28 sm:py-32 scroll-mt-20"
    >
      {/* Visual Experience Layer: 3D Mandap OR Cinematic Film */}
      <div className="absolute inset-0 z-0">
        {is3DMode ? (
          <ThreeMandapScene
            isInteractive={true}
            isReducedMotion={isReducedMotion}
            onSwitchToCinematic={() => setIs3DMode(false)}
          />
        ) : (
          <div ref={visualLayerRef} className="absolute inset-0 w-full h-full will-change-transform">
            <picture>
              <source srcSet="/assets/hero_palace_mandap.webp" type="image/webp" />
              <img
                src="/assets/hero_palace_mandap.jpg"
                alt="Royal Indian Wedding Palace Courtyard Mandap at Twilight"
                width="1376"
                height="768"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.12]"
              />
            </picture>
            {/* Real-time Procedural Volumetric Light Beams & Golden Embers */}
            <MotionGraphicsCanvas intensity={1.2} isReducedMotion={isReducedMotion} />
          </div>
        )}

        {/* Cinematic Vignette and Royal Burgundy Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0206] via-[#120309]/50 to-black/70 pointer-events-none z-10" />
        <div className="cinematic-vignette pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div
        ref={textContentRef}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center"
      >
        {/* Auspicious Seal Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-[#18040d]/85 border border-[#d4af37]/45 text-[#f5d77f] text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-accent shadow-[0_0_20px_rgba(212,175,55,0.25)] mb-4 sm:mb-6 backdrop-blur-md"
        >
          <Sparkles size={13} className="text-[#f5d77f] animate-pulse shrink-0" />
          <span>{t.scene1Badge}</span>
          <Sparkles size={13} className="text-[#f5d77f] animate-pulse shrink-0" />
        </div>

        {/* Brand Display Title */}
        <h1
          ref={titleRef}
          className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-8xl tracking-[0.03em] sm:tracking-[0.05em] leading-[1.15] sm:leading-[1.08] mb-4 sm:mb-6 text-gold-gradient drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] px-2"
        >
          {t.scene1Title}
        </h1>

        {/* Subtitle with Royal Divider */}
        <div ref={subtitleRef} className="w-full max-w-3xl">
          <div className="royal-divider my-3 sm:my-4">
            <div className="royal-divider-diamond"></div>
          </div>
          <p className="font-accent text-base sm:text-xl md:text-3xl text-[#faeed1] font-normal tracking-wide leading-relaxed drop-shadow-md px-2">
            {t.scene1Subtitle}
          </p>
          <p className="font-body text-xs sm:text-sm md:text-base text-[#d8c7b5]/90 mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed font-light px-2">
            {t.scene1Desc}
          </p>
        </div>

        {/* Primary Call to Action Group */}
        <div
          ref={ctaGroupRef}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-md sm:max-w-none"
        >
          <a
            href="#scene-2"
            onClick={handleScrollToJourney}
            className="btn-royal-gold w-full sm:w-auto text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 shadow-[0_10px_25px_rgba(212,175,55,0.4)] text-center cursor-pointer"
          >
            <span>{t.scene1CtaJourney}</span>
          </a>

          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className="btn-royal-outline w-full sm:w-auto text-xs sm:text-sm px-5 sm:px-6 py-3.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Box size={16} className="text-[#f5d77f] shrink-0" />
            <span>{is3DMode ? t.scene1CtaFilm : t.scene1Cta3D}</span>
          </button>

          <button
            onClick={onOpenMembershipModal}
            className="text-xs tracking-wider uppercase font-accent text-[#faeed1]/90 hover:text-[#f5d77f] py-2 px-3 border-b border-transparent hover:border-[#d4af37] transition-all cursor-pointer"
          >
            {t.scene1CtaInquire}
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator (Shown on medium and larger screens only to prevent mobile overlap) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none opacity-80 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.25em] font-accent text-[#f5d77f]">
          {t.scene1ScrollText}
        </span>
        <ChevronDown size={18} className="text-[#d4af37]" />
      </div>
    </section>
  );
}
