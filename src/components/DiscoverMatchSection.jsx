import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, MapPin, Briefcase, GraduationCap, Heart, Eye, ShieldCheck, X, Compass, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function DiscoverMatchSection({ isReducedMotion }) {
  const { language, t } = useLanguage();
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(null);

  const demoProfiles = [
    {
      id: 'DEMO-BRIDE-101',
      type: 'bride',
      nameEn: 'Ananya Sharma',
      nameHi: 'अनन्या शर्मा',
      age: 26,
      height: "5'6\"",
      professionEn: 'Principal AI Researcher & Classical Artist',
      professionHi: 'प्रमुख एआई शोधकर्ता एवं शास्त्रीय नृत्यांगना',
      educationEn: 'M.Tech, Indian Institute of Science (IISc)',
      educationHi: 'एम.टेक, भारतीय विज्ञान संस्थान (IISc बंगलुरु)',
      locationEn: 'Bengaluru • Ancestral: Varanasi, UP',
      locationHi: 'बेंगलुरु • पैतृक: काशी (वाराणसी)',
      gotraEn: 'Kashyapa Gotra • Brahmin',
      gotraHi: 'कश्यप गोत्र • सनाढ्य ब्राह्मण',
      image: '/assets/bride_demo_profile.jpg',
      bioEn: 'Deeply appreciative of Vedic philosophy and classical arts while thriving in cutting-edge technology. Enjoys Sanskrit literature, sitar recitals, and respectful joint family conversations.',
      bioHi: 'वैदिक दर्शन एवं भारतीय शास्त्रीय कलाओं के प्रति गहरी निष्ठा, साथ ही आधुनिक तकनीक में अग्रणी। संस्कृत साहित्य, सितार वादन एवं संयुक्त पारिवारिक संस्कारों में विश्वास।',
      kundali: {
        rashiEn: 'Kanya (Virgo)',
        rashiHi: 'कन्या राशि',
        nakshatraEn: 'Hasta',
        nakshatraHi: 'हस्त नक्षत्र',
        manglikEn: 'Non-Manglik',
        manglikHi: 'अमांगलिक (निर्दोष)',
        doshaEn: 'Nadi Nirbhaya',
        doshaHi: 'नाड़ी दोष रहित',
        gunaScore: '32 / 36 Gun Milan',
      },
      family: {
        fatherEn: 'Senior Director, Public Health Research',
        fatherHi: 'वरिष्ठ निदेशक, जनस्वास्थ्य अनुसंधान',
        motherEn: 'Professor of Philosophy (Retd.)',
        motherHi: 'दर्शनशास्त्र प्राध्यापिका (सेवानिवृत्त)',
        ancestralOriginEn: 'Varanasi (Kashi)',
        ancestralOriginHi: 'वाराणसी (काशी)',
      },
      valuesEn: ['Vedic Traditions', 'Intellectual Dialogue', 'Classical Music', 'Community Seva'],
      valuesHi: ['वैदिक परंपरा', 'विद्वत संवाद', 'शास्त्रीय संगीत', 'सामाजिक सेवा'],
    },
    {
      id: 'DEMO-GROOM-202',
      type: 'groom',
      nameEn: 'Raghavendra Rathore',
      nameHi: 'राघवेंद्र सिंह राठौड़',
      age: 29,
      height: "6'1\"",
      professionEn: 'Heritage Architect & Urban Preservationist',
      professionHi: 'विरासत वास्तुकार एवं ऐतिहासिक धरोहर संरक्षक',
      educationEn: 'M.Arch, School of Planning & Architecture (SPA)',
      educationHi: 'एम.आर्क, योजना तथा वास्तुकला विद्यालय (SPA दिल्ली)',
      locationEn: 'Udaipur & Mumbai • Ancestral: Mewar, Rajasthan',
      locationHi: 'उदयपुर एवं मुम्बई • पैतृक: मेवाड़, राजस्थान',
      gotraEn: 'Vatsa Gotra • Rajput Kshatriya',
      gotraHi: 'वत्स गोत्र • सूर्यवंशी राजपूत क्षत्रिय',
      image: '/assets/groom_demo_profile.jpg',
      bioEn: 'Dedicated to preserving India’s architectural treasures and promoting sustainable craftsmanship. Grounded in Mewari principles of honor, loyalty, and deep spiritual reverence for family elders.',
      bioHi: 'भारत की स्थापत्य धरोहरों के संरक्षण हेतु समर्पित। मेवाड़ी आन-बान-शान, कुल मर्यादा, स्वामिभक्ति एवं ज्येष्ठजनों के प्रति अगाध आदर से परिपूर्ण।',
      kundali: {
        rashiEn: 'Simha (Leo)',
        rashiHi: 'सिंह राशि',
        nakshatraEn: 'Magha',
        nakshatraHi: 'मघा नक्षत्र',
        manglikEn: 'Anshik (Gentle) Manglik',
        manglikHi: 'आंशिक मांगलिक (सौम्य)',
        doshaEn: 'Dosha Shanti Completed',
        doshaHi: 'दोष शांति संपन्न',
        gunaScore: '33 / 36 Gun Milan',
      },
      family: {
        fatherEn: 'Heritage Conservation Trustee & Industrialist',
        fatherHi: 'धरोहर न्यास ट्रस्टी एवं उद्योगपति',
        motherEn: 'Philanthropist & Classical Weaver Guild Patron',
        motherHi: 'समाजसेवी एवं पारंपरिक बुनकर शिल्पी संरक्षिका',
        ancestralOriginEn: 'Udaipur (Mewar)',
        ancestralOriginHi: 'उदयपुर (मेवाड़)',
      },
      valuesEn: ['Heritage Preservation', 'Family Honor', 'Equestrian Sports', 'Spiritual Integrity'],
      valuesHi: ['धरोहर संरक्षण', 'कुल सम्मान', 'अश्वारोहण', 'धार्मिक निष्ठा'],
    },
    {
      id: 'DEMO-BRIDE-103',
      type: 'bride',
      nameEn: 'Priyadarshini Rao',
      nameHi: 'प्रियदर्शिनी राव',
      age: 27,
      height: "5'5\"",
      professionEn: 'Biomedical Innovator & Bharatanatyam Exponent',
      professionHi: 'जैव-चिकित्सा वैज्ञानिक एवं भरतनाट्यम नृत्यांगना',
      educationEn: 'PhD Candidate, AIIMS New Delhi',
      educationHi: 'शोधार्थी (पीएच.डी), एम्स नई दिल्ली',
      locationEn: 'Hyderabad • Ancestral: Vijayawada, AP',
      locationHi: 'हैदराबाद • पैतृक: विजयवाड़ा, आं.प्र.',
      gotraEn: 'Bharadwaja Gotra',
      gotraHi: 'भारद्वाज गोत्र',
      image: '/assets/bride_demo_profile.jpg',
      bioEn: 'Combining scientific rigor with deep devotion to ancient temple arts. Values humility, lifelong learning, and creating a warm, spiritual home atmosphere.',
      bioHi: 'आधुनिक चिकित्सा विज्ञान के साथ प्राचीन मंदिर कलाओं का सुंदर समन्वय। विनम्रता, निरंतर ज्ञानार्जन और आध्यात्मिक गृहस्थ वातावरण की पक्षधर।',
      kundali: {
        rashiEn: 'Dhanu (Sagittarius)',
        rashiHi: 'धनु राशि',
        nakshatraEn: 'Moola',
        nakshatraHi: 'मूल नक्षत्र',
        manglikEn: 'Non-Manglik',
        manglikHi: 'अमांगलिक',
        doshaEn: 'None',
        doshaHi: 'निर्दोष',
        gunaScore: '31 / 36 Gun Milan',
      },
      family: {
        fatherEn: 'Chief Surgeon, Medical University',
        fatherHi: 'मुख्य शल्य चिकित्सक, आयुर्विज्ञान संस्थान',
        motherEn: 'Carnatic Vocalist & School Principal',
        motherHi: 'कर्नाटक संगीत विदुषी एवं प्राचार्या',
        ancestralOriginEn: 'Andhra Pradesh',
        ancestralOriginHi: 'आंध्र प्रदेश',
      },
      valuesEn: ['Vedic Rhythms', 'Medical Ethics', 'Temple Architecture', 'Warm Hospitality'],
      valuesHi: ['वैदिक संस्कार', 'चिकित्सीय शुचिता', 'मंदिर वास्तु', 'आतिथ्य सत्कार'],
    },
    {
      id: 'DEMO-GROOM-204',
      type: 'groom',
      nameEn: 'Devendra Pratap Singh',
      nameHi: 'देवेंद्र प्रताप सिंह',
      age: 30,
      height: "6'0\"",
      professionEn: 'Civil Services Officer & Rural Development Lead',
      professionHi: 'प्रशासनिक अधिकारी (सिविल सेवा) एवं ग्रामीण विकास प्रमुख',
      educationEn: 'B.Tech (IIT Kanpur), Public Policy (LBSNAA)',
      educationHi: 'बी.टेक (आईआईटी कानपुर), लोकनीति (LBSNAA मसूरी)',
      locationEn: 'Lucknow • Ancestral: Awadh Region',
      locationHi: 'लखनऊ • पैतृक: अवध क्षेत्र, उ.प्र.',
      gotraEn: 'Shandilya Gotra',
      gotraHi: 'शांडिल्य गोत्र',
      image: '/assets/groom_demo_profile.jpg',
      bioEn: 'Committed to grassroots public service and integrity. Believes marriage is a sacred partnership where both partners champion each other’s aspirations while upholding familial dignity.',
      bioHi: 'सत्यनिष्ठा और लोक कल्याण के प्रति समर्पित। विवाह को ऐसा पवित्र सहचर्य मानते हैं जिसमें दोनों परिवार एक-दूसरे के आदर्शों का सम्मान करते हैं।',
      kundali: {
        rashiEn: 'Mesha (Aries)',
        rashiHi: 'मेष राशि',
        nakshatraEn: 'Ashwini',
        nakshatraHi: 'अश्विनी नक्षत्र',
        manglikEn: 'Non-Manglik',
        manglikHi: 'अमांगलिक',
        doshaEn: 'None',
        doshaHi: 'निर्दोष',
        gunaScore: '34 / 36 Gun Milan',
      },
      family: {
        fatherEn: 'High Court Senior Advocate',
        fatherHi: 'वरिष्ठ अधिवक्ता, उच्च न्यायालय',
        motherEn: 'Homemaker & Sanskrit Scholar',
        motherHi: 'संस्कृत विदुषी एवं कुशल गृहस्वामिनी',
        ancestralOriginEn: 'Ayodhya / Awadh',
        ancestralOriginHi: 'अयोध्या (अवध)',
      },
      valuesEn: ['Public Good', 'Sanskrit Studies', 'Quiet Dignity', 'Lifelong Devotion'],
      valuesHi: ['लोक सेवा', 'संस्कृत स्वाध्याय', 'शालीनता', 'अखंड निष्ठा'],
    },
  ];

  const filtered = demoProfiles.filter(
    (p) => activeFilter === 'all' || p.type === activeFilter
  );

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.profile-card-item',
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.profiles-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeFilter, isReducedMotion]);

  const getName = (p) => (language === 'hi' ? p.nameHi : p.nameEn);
  const getProf = (p) => (language === 'hi' ? p.professionHi : p.professionEn);
  const getEdu = (p) => (language === 'hi' ? p.educationHi : p.educationEn);
  const getLoc = (p) => (language === 'hi' ? p.locationHi : p.locationEn);
  const getGotra = (p) => (language === 'hi' ? p.gotraHi : p.gotraEn);
  const getBio = (p) => (language === 'hi' ? p.bioHi : p.bioEn);
  const getValues = (p) => (language === 'hi' ? p.valuesHi : p.valuesEn);

  return (
    <section
      id="scene-4"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 bg-[#0c0207] overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c040f]/80 border border-[#d4af37]/40 text-[#f5d77f] text-xs uppercase tracking-[0.2em] font-accent mb-4 backdrop-blur-md">
            <Heart size={14} className="text-[#f5d77f]" />
            <span>{t.scene4Badge}</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-gold-gradient tracking-wide mb-4">
            {t.scene4Title}
          </h2>

          <div className="royal-divider">
            <div className="royal-divider-diamond"></div>
          </div>

          <p className="font-accent text-base sm:text-lg text-[#faeed1] font-light leading-relaxed">
            {t.scene4Subtitle}
          </p>

          {/* Ethical Disclaimer Notice */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#240614]/75 border border-[#d4af37]/35 text-xs text-[#d8c7b5] max-w-2xl text-left">
            <ShieldCheck size={18} className="text-[#d4af37] shrink-0" />
            <span>
              <strong className="text-[#f5d77f]">{t.demoNoticeTitle}:</strong> {t.demoNoticeDesc}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'bride', label: t.filterBrides },
            { id: 'groom', label: t.filterGrooms },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-accent transition-all duration-300 border ${
                activeFilter === tab.id
                  ? 'bg-[#d4af37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] border-[#f5d77f]'
                  : 'bg-black/50 text-[#d8c7b5] border-[#d4af37]/25 hover:border-[#d4af37]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Cards Grid */}
        <div className="profiles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((profile) => (
            <div
              key={profile.id}
              className="profile-card-item royal-card flex flex-col justify-between group hover:border-[#f5d77f] transition-all"
            >
              {/* Corner Ornaments */}
              <div className="royal-card-corner corner-tl" />
              <div className="royal-card-corner corner-tr" />
              <div className="royal-card-corner corner-bl" />
              <div className="royal-card-corner corner-br" />

              <div>
                {/* Profile Portrait with Badge */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-black/60">
                  <img
                    src={profile.image}
                    alt={getName(profile)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14030a] via-transparent to-black/30" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[10px] uppercase tracking-widest text-[#f5d77f] font-mono">
                    {profile.id}
                  </div>

                  {/* Compatibility Score Tag */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#801235]/80 backdrop-blur-md border border-[#d4af37]/50 text-[10px] text-[#faeed1] font-accent flex items-center gap-1">
                    <Star size={11} className="text-[#f5d77f]" />
                    <span>{profile.kundali.gunaScore.split(' ')[0]} Gunas</span>
                  </div>

                  {/* Bottom Portrait Info */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display font-bold text-xl text-[#faeed1] group-hover:text-[#f5d77f] transition-colors leading-snug">
                      {getName(profile)}
                    </h3>
                    <p className="text-xs text-[#d4af37] font-accent">
                      {profile.age} {language === 'hi' ? 'वर्ष' : 'Yrs'} • {profile.height} • {getGotra(profile).split('•')[0]}
                    </p>
                  </div>
                </div>

                {/* Profile Metadata */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-2 text-xs text-[#d8c7b5]">
                    <Briefcase size={14} className="text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{getProf(profile)}</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-[#d8c7b5]">
                    <GraduationCap size={14} className="text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{getEdu(profile)}</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-[#d8c7b5]">
                    <MapPin size={14} className="text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{getLoc(profile)}</span>
                  </div>

                  <p className="font-body text-xs text-stone-300 line-clamp-2 pt-2 border-t border-[#d4af37]/15 font-light">
                    {getBio(profile)}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedProfile(profile)}
                  className="w-full py-2.5 rounded border border-[#d4af37]/50 bg-black/40 text-xs uppercase tracking-widest font-accent text-[#f5d77f] hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2 group-hover:border-[#d4af37]"
                >
                  <Eye size={14} />
                  <span>{t.inspectBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto royal-card bg-[#14030a] border-2 border-[#d4af37] p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.3)]">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Modal Left: Image */}
              <div className="sm:col-span-5 rounded-xl overflow-hidden border border-[#d4af37]/40">
                <img
                  src={selectedProfile.image}
                  alt={getName(selectedProfile)}
                  className="w-full h-80 object-cover object-top"
                />
                <div className="p-4 bg-[#1a040d] text-center border-t border-[#d4af37]/20">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] block">
                    {t.sampleDossier}
                  </span>
                  <p className="font-display font-bold text-lg text-[#faeed1]">
                    {getName(selectedProfile)}
                  </p>
                  <p className="text-xs text-stone-300 font-accent">
                    {selectedProfile.age} {language === 'hi' ? 'वर्ष' : 'Yrs'} • {selectedProfile.height}
                  </p>
                </div>
              </div>

              {/* Modal Right: In-depth Details */}
              <div className="sm:col-span-7 space-y-5">
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-[#801235]/60 border border-[#d4af37]/40 text-xs font-accent text-[#f5d77f] uppercase tracking-wider mb-2">
                    {t.vedicScoreLabel}: {selectedProfile.kundali.gunaScore}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-gold-gradient">
                    {getName(selectedProfile)}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-mono">
                    {t.refCodeLabel}: {selectedProfile.id}
                  </p>
                </div>

                {/* Kundali Details Table */}
                <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/20 space-y-2">
                  <h4 className="text-xs font-accent uppercase tracking-widest text-[#f5d77f] flex items-center gap-1.5 pb-2 border-b border-[#d4af37]/15">
                    <Compass size={14} />
                    <span>{t.astrologyTitle}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400">{language === 'hi' ? 'राशि:' : 'Rashi:'}</span>{' '}
                      <span className="text-[#faeed1] font-semibold">
                        {language === 'hi' ? selectedProfile.kundali.rashiHi : selectedProfile.kundali.rashiEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">{language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}</span>{' '}
                      <span className="text-[#faeed1] font-semibold">
                        {language === 'hi' ? selectedProfile.kundali.nakshatraHi : selectedProfile.kundali.nakshatraEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">{language === 'hi' ? 'मांगलिक दोष:' : 'Manglik Status:'}</span>{' '}
                      <span className="text-[#faeed1] font-semibold">
                        {language === 'hi' ? selectedProfile.kundali.manglikHi : selectedProfile.kundali.manglikEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">{language === 'hi' ? 'गोत्र:' : 'Gotra:'}</span>{' '}
                      <span className="text-[#faeed1] font-semibold">{getGotra(selectedProfile)}</span>
                    </div>
                  </div>
                </div>

                {/* Family Pedigree */}
                <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/20 space-y-2">
                  <h4 className="text-xs font-accent uppercase tracking-widest text-[#f5d77f] pb-2 border-b border-[#d4af37]/15">
                    {t.familyTitle}
                  </h4>
                  <p className="text-xs text-[#d8c7b5]">
                    <strong>{t.fatherLabel}:</strong> {language === 'hi' ? selectedProfile.family.fatherHi : selectedProfile.family.fatherEn}
                  </p>
                  <p className="text-xs text-[#d8c7b5]">
                    <strong>{t.motherLabel}:</strong> {language === 'hi' ? selectedProfile.family.motherHi : selectedProfile.family.motherEn}
                  </p>
                  <p className="text-xs text-[#d8c7b5]">
                    <strong>{t.rootsLabel}:</strong> {language === 'hi' ? selectedProfile.family.ancestralOriginHi : selectedProfile.family.ancestralOriginEn}
                  </p>
                </div>

                {/* Bio & Shared Values */}
                <div>
                  <h4 className="text-xs font-accent uppercase tracking-widest text-[#f5d77f] mb-1.5">
                    {t.personalEthos}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-light mb-3">
                    {getBio(selectedProfile)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getValues(selectedProfile).map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-[#1c040f] border border-[#d4af37]/30 text-[10px] text-[#faeed1]"
                      >
                        #{v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button in modal */}
                <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 italic">
                    {t.dossierNotice}
                  </span>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="btn-royal-gold text-xs px-4 py-2"
                  >
                    {t.doneReviewing}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
