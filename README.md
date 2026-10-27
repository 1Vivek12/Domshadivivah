# DOM SHADI VIVAH — Royal Indian Matrimony & Cinematic Scroll Experience
### डोम शादी विवाह — शाही भारतीय विवाह • संस्कार एवं मर्यादा

An ultra-premium Indian wedding website featuring cinematic scroll storytelling, custom visual assets, genuine procedural motion graphics, bilingual support (Devanagari हिन्दी & English), and an interactive Three.js 3D Mandap environment.

---

## 🌟 Key Highlights

### 1. 📜 Complete Bilingual Support (देवनागरी & English)
- **Authentic Devanagari Typography**: Incorporating Google Fonts (`Rozha One`, `Martel`, `Mukta`) for regal Hindi text rendering.
- **Instant One-Click Language Switcher**: Persistent toggle in the Navbar (`अ हिन्दी` / `EN English`), mobile menu, and floating quick switcher.
- **Deep Cultural Localization**: Full Sanskrit shlokas, Vedic terminology, and bilingual Kundali matching metrics.

### 2. 🎬 6-Scene Cinematic Scroll Story (GSAP & ScrollTrigger)
- **Scene 1 — The Royal Entrance (मांगलिक प्रवेश)**: Full-screen Rajput twilight palace courtyard, layered architectural depth, real-time procedural light rays, and opening title sequence.
- **Scene 2 — A Journey Toward Togetherness (परिणय पथ)**: Deep parallax toward the wedding mandap, illuminated floral arches, crystal chandelier, and timed narrative stages (*The Sacred Threshold*, *Floral Arches*, *Agni Sakshi*).
- **Scene 3 — Two Families, One Relationship (कुल मिलन)**: Heritage haveli courtyard blessing narrative, crossfades between *Aashirvaad* (Ancestral Blessings) and *Saptapadi* (Seven Vows).
- **Scene 4 — Discover Your Match (योग्य वर-वधू)**: Editorial bride & groom demonstration dossiers with filter tabs, Kundali 36-gun metrics, and interactive inspection modal. *(Strict ethical disclaimer: Demonstration profiles only).*
- **Scene 5 — A Relationship With Purpose (कल्याणम् सहायता)**: Dignified wedding assistance for economically vulnerable families with a **transparent distinction card** separating commercial matrimonial service fees from 100% voluntary charitable donations.
- **Scene 6 — The Final Invitation (सादर आमंत्रण)**: Royal wax seal entrance, confidential membership inquiry modal, and a luxury royal footer.

### 3. 🏛️ Genuine 3D WebGL Mandap Experience (Three.js)
- 4 fluted Mughal/Rajput stambhas (pillars) with gold capitals.
- Octagonal stepped sandstone vedi platform with gold torus trim.
- Consecrated Havankund (sacred fire altar) with real-time flickering fire core and dynamic point lights.
- 3D particle physics: 180 floating rose petals and 240 golden embers.
- Scroll-linked camera interpolation plus mouse/touch drag-to-orbit controls.

### 4. ✨ Real-Time Procedural Motion Graphics
- Volumetric light rays (crepuscular sunbeams through palace arches).
- Golden embers and firefly dust rendered via canvas with screen blend mode.

### 5. 🎵 Procedural Royal Ambience Synthesizer (Web Audio API)
- Pure Web Audio API synthetic Indian Tanpura / Sitar harmonic drone (Key of D / Raga Yaman mood).
- Zero external MP3 or copyrighted audio file dependencies.
- Interactive toggle with animated equalizer bars in the navbar.

---

## 📁 Repository Structure

```text
DOMSHADIVIVAH/
├── public/
│   └── assets/                     # 8 locally stored high-res original generated assets
│       ├── hero_palace_mandap.jpg
│       ├── mandap_ornate_details.jpg
│       ├── family_blessing_heritage.jpg
│       ├── sacred_wedding_rituals.jpg
│       ├── bride_demo_profile.jpg
│       ├── groom_demo_profile.jpg
│       ├── social_assistance_kalyanam.jpg
│       └── cinematic_video_poster.jpg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Bilingual header, audio & 3D toggles
│   │   ├── HeroSection.jsx         # Scene 1: Royal Entrance
│   │   ├── MandapJourney.jsx       # Scene 2: Parallax Mandap Journey
│   │   ├── TwoFamiliesSection.jsx  # Scene 3: Traditions & Blessings
│   │   ├── DiscoverMatchSection.jsx# Scene 4: Editorial Profiles & Modal
│   │   ├── SocialPurposeSection.jsx# Scene 5: Kalyanam Sahayata & Distinction
│   │   ├── FinalInvitationSection.jsx# Scene 6: Royal Seal & Luxury Footer
│   │   ├── MembershipModal.jsx     # Confidential inquiry modal
│   │   ├── MotionGraphicsCanvas.jsx# Real-time volumetric light engine
│   │   └── ThreeMandapScene.jsx    # Live Three.js WebGL 3D Mandap
│   ├── context/
│   │   └── LanguageContext.jsx     # Bilingual state provider
│   ├── utils/
│   │   ├── audioAmbience.js        # Web Audio API raga synthesizer
│   │   └── translations.js         # Complete English & Devanagari dictionary
│   ├── App.jsx                     # Master application & scene tracker
│   ├── index.css                   # Royal design system & Devanagari typography
│   └── main.jsx                    # Entry point
├── index.html                      # SEO metadata & Google Fonts
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
git clone https://github.com/1Vivek12/Domshadivivah.git
cd Domshadivivah
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build Production Bundle
```bash
npm run build
```

---

## 📜 License & Disclaimers
- **Demonstration Showcase**: All profiles, dossiers, and family names displayed are demonstration examples to preview layouts and interactions.
- **Frontend Only Phase**: No backend database, payments, or production APIs are included.
