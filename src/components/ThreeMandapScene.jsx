import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AlertTriangle, Sparkles, Box } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ThreeMandapScene({
  scrollProgress = 0,
  isInteractive = true,
  isReducedMotion = false,
  onSwitchToCinematic,
}) {
  const { language } = useLanguage();
  const mountRef = useRef(null);
  const fpsDomRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [lowPerfNotice, setLowPerfNotice] = useState(false);

  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    fireLight: null,
    petals: null,
    goldDust: null,
    mandapGroup: null,
    flameCore: null,
    reqId: null,
    isVisible: true,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    orbitAngleX: 0,
    orbitAngleY: 0.15,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Detect WebGL Support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGlSupported(false);
      return;
    }

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 2. SCENE with atmospheric Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x120309, 0.045);

    // 3. CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 80);
    camera.position.set(0, 2.2, 9);

    // 4. HIGH-PERFORMANCE RENDERER
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile, // Disable MSAA on mobile for massive FPS boost
        alpha: true,
        powerPreference: 'high-performance',
        precision: isMobile ? 'mediump' : 'highp',
      });
    } catch (e) {
      console.warn('WebGL init failed, triggering fallback:', e);
      setWebGlSupported(false);
      return;
    }

    renderer.setSize(width, height);
    // Strict pixel ratio cap: 1.0 on mobile, 1.5 on desktop (eliminates 60% fillrate overhead)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Shadows: Only on desktop with compact 512x512 map
    if (!isMobile) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
    } else {
      renderer.shadowMap.enabled = false;
    }

    mount.appendChild(renderer.domElement);

    // 5. LIGHTING (Optimized count & tight shadow camera)
    const ambientLight = new THREE.AmbientLight(0x2a0c16, 1.8);
    scene.add(ambientLight);

    const topChandelierLight = new THREE.DirectionalLight(0xffdf88, 2.2);
    topChandelierLight.position.set(0, 10, 2);
    if (!isMobile) {
      topChandelierLight.castShadow = true;
      topChandelierLight.shadow.mapSize.width = 512;
      topChandelierLight.shadow.mapSize.height = 512;
      topChandelierLight.shadow.camera.near = 1;
      topChandelierLight.shadow.camera.far = 18;
      topChandelierLight.shadow.camera.left = -4;
      topChandelierLight.shadow.camera.right = 4;
      topChandelierLight.shadow.camera.top = 4;
      topChandelierLight.shadow.camera.bottom = -4;
    }
    scene.add(topChandelierLight);

    // Sacred Fire Point Light
    const fireLight = new THREE.PointLight(0xff6e26, 3.5, 12, 1.5);
    fireLight.position.set(0, 0.6, 0);
    scene.add(fireLight);

    // Cool rim light
    const rimLight = new THREE.DirectionalLight(0x6b3040, 1.0);
    rimLight.position.set(-6, 4, -8);
    scene.add(rimLight);

    // 6. SHARED MATERIALS
    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: 0x9e7240,
      roughness: 0.85,
      metalness: 0.1,
    });

    const royalGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85,
    });

    const crimsonFabricMat = new THREE.MeshStandardMaterial({
      color: 0x730e2b,
      roughness: 0.65,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc49b38,
      roughness: 0.4,
      metalness: 0.8,
    });

    // 7. MANDAP ROOT GROUP & GEOMETRIES
    const mandapGroup = new THREE.Group();
    scene.add(mandapGroup);

    // Octagonal Platform (Vedi / Peetha)
    const platformGeo = new THREE.CylinderGeometry(4.8, 5.2, 0.4, 8);
    const platform = new THREE.Mesh(platformGeo, sandstoneMat);
    platform.position.y = -0.2;
    platform.receiveShadow = !isMobile;
    mandapGroup.add(platform);

    const platformStepGeo = new THREE.CylinderGeometry(5.4, 5.8, 0.25, 8);
    const platformStep = new THREE.Mesh(platformStepGeo, sandstoneMat);
    platformStep.position.y = -0.5;
    platformStep.receiveShadow = !isMobile;
    mandapGroup.add(platformStep);

    // Gold Trim Ring
    const trimGeo = new THREE.TorusGeometry(4.8, 0.05, 8, 8);
    trimGeo.rotateX(Math.PI / 2);
    const trim = new THREE.Mesh(trimGeo, royalGoldMat);
    trim.position.y = 0.01;
    mandapGroup.add(trim);

    // 4 Pillars (Shared geometries)
    const baseGeo = new THREE.BoxGeometry(0.85, 0.5, 0.85);
    const shaftGeo = new THREE.CylinderGeometry(0.24, 0.28, 3.8, isMobile ? 8 : 12);
    const ringGeo = new THREE.TorusGeometry(0.32, 0.05, 8, isMobile ? 8 : 12);
    ringGeo.rotateX(Math.PI / 2);
    const capGeo = new THREE.BoxGeometry(0.8, 0.35, 0.8);

    const pillarPositions = [
      [-2.6, -2.6],
      [2.6, -2.6],
      [-2.6, 2.6],
      [2.6, 2.6],
    ];

    pillarPositions.forEach(([px, pz]) => {
      const pColGroup = new THREE.Group();
      pColGroup.position.set(px, 0, pz);

      const base = new THREE.Mesh(baseGeo, sandstoneMat);
      base.position.y = 0.25;
      pColGroup.add(base);

      const shaft = new THREE.Mesh(shaftGeo, sandstoneMat);
      shaft.position.y = 2.4;
      pColGroup.add(shaft);

      const ring1 = new THREE.Mesh(ringGeo, royalGoldMat);
      ring1.position.y = 0.6;
      pColGroup.add(ring1);

      const ring2 = ring1.clone();
      ring2.position.y = 4.1;
      pColGroup.add(ring2);

      const cap = new THREE.Mesh(capGeo, royalGoldMat);
      cap.position.y = 4.3;
      pColGroup.add(cap);

      mandapGroup.add(pColGroup);
    });

    // Canopy Cross Beams
    const roofRingGeo = new THREE.BoxGeometry(5.4, 0.25, 0.4);
    const b1 = new THREE.Mesh(roofRingGeo, royalGoldMat);
    b1.position.set(0, 4.45, -2.6);
    mandapGroup.add(b1);

    const b2 = b1.clone();
    b2.position.set(0, 4.45, 2.6);
    mandapGroup.add(b2);

    const b3 = b1.clone();
    b3.rotateY(Math.PI / 2);
    b3.position.set(-2.6, 4.45, 0);
    mandapGroup.add(b3);

    const b4 = b1.clone();
    b4.rotateY(Math.PI / 2);
    b4.position.set(2.6, 4.45, 0);
    mandapGroup.add(b4);

    // Domed Royal Canopy (Chattra)
    const domeGeo = new THREE.ConeGeometry(3.6, 1.4, 8, 1, true);
    const dome = new THREE.Mesh(domeGeo, crimsonFabricMat);
    dome.position.y = 5.3;
    mandapGroup.add(dome);

    // Kalash Finial atop dome
    const kalashGeo = new THREE.SphereGeometry(0.35, 10, 10);
    const kalash = new THREE.Mesh(kalashGeo, royalGoldMat);
    kalash.position.y = 6.2;
    mandapGroup.add(kalash);

    const kalashSpireGeo = new THREE.ConeGeometry(0.12, 0.6, 8);
    const kalashSpire = new THREE.Mesh(kalashSpireGeo, royalGoldMat);
    kalashSpire.position.y = 6.65;
    mandapGroup.add(kalashSpire);

    // Hanging brass bells (Reduced count for performance)
    const bellGeo = new THREE.ConeGeometry(0.08, 0.16, 6);
    bellGeo.rotateX(Math.PI);
    for (let i = -2; i <= 2; i += 1.2) {
      const bell = new THREE.Mesh(bellGeo, brassMat);
      bell.position.set(i, 4.25, 2.6);
      mandapGroup.add(bell);

      const bellBack = bell.clone();
      bellBack.position.set(i, 4.25, -2.6);
      mandapGroup.add(bellBack);
    }

    // Sacred Havankund (Agni Kunda)
    const kundaGroup = new THREE.Group();
    const k1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 1.6), brassMat);
    k1.position.y = 0.08;
    kundaGroup.add(k1);

    const k2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), royalGoldMat);
    k2.position.y = 0.22;
    kundaGroup.add(k2);

    const k3 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.85), brassMat);
    k3.position.y = 0.35;
    kundaGroup.add(k3);

    // Sacred Fire Core
    const flameGeo = new THREE.TetrahedronGeometry(0.3, 1);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const flameCore = new THREE.Mesh(flameGeo, flameMat);
    flameCore.position.y = 0.62;
    kundaGroup.add(flameCore);
    mandapGroup.add(kundaGroup);

    // 8. OPTIMIZED PARTICLES: Rose Petals (50 desktop / 20 mobile)
    const petalCount = isMobile ? 20 : 50;
    const petalGeo = new THREE.BufferGeometry();
    const petalPos = new Float32Array(petalCount * 3);
    const petalSpeed = new Float32Array(petalCount);

    for (let i = 0; i < petalCount; i++) {
      petalPos[i * 3] = (Math.random() - 0.5) * 8;
      petalPos[i * 3 + 1] = Math.random() * 6;
      petalPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      petalSpeed[i] = 0.008 + Math.random() * 0.012;
    }
    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));

    // Shared simple particle canvas texture
    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 16;
    petalCanvas.height = 16;
    const pCtx = petalCanvas.getContext('2d');
    pCtx.beginPath();
    pCtx.arc(8, 8, 6, 0, Math.PI * 2);
    pCtx.fillStyle = '#b81434';
    pCtx.fill();
    const petalTexture = new THREE.CanvasTexture(petalCanvas);

    const petalMat = new THREE.PointsMaterial({
      size: 0.16,
      map: petalTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const petals = new THREE.Points(petalGeo, petalMat);
    scene.add(petals);

    // 9. Floating Golden Ember Particles (60 desktop / 25 mobile)
    const dustCount = isMobile ? 25 : 60;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 1] = Math.random() * 7;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = 16;
    dustCanvas.height = 16;
    const dCtx = dustCanvas.getContext('2d');
    const grad = dCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 230, 130, 1)');
    grad.addColorStop(0.6, 'rgba(212, 175, 55, 0.6)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    dCtx.fillStyle = grad;
    dCtx.fillRect(0, 0, 16, 16);
    const dustTexture = new THREE.CanvasTexture(dustCanvas);

    const dustMat = new THREE.PointsMaterial({
      size: 0.15,
      map: dustTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const goldDust = new THREE.Points(dustGeo, dustMat);
    scene.add(goldDust);

    // STORE STATE
    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.fireLight = fireLight;
    stateRef.current.petals = { points: petals, pos: petalPos, speed: petalSpeed, count: petalCount };
    stateRef.current.goldDust = goldDust;
    stateRef.current.mandapGroup = mandapGroup;
    stateRef.current.flameCore = flameCore;

    // 10. INTERSECTION OBSERVER (Halts rendering when scrolled offscreen -> 0% GPU load!)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stateRef.current.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    // 11. PAGE VISIBILITY (Pause loop on background tabs)
    const handleVisibility = () => {
      stateRef.current.isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // TOUCH & MOUSE INTERACTION (DRAG TO ROTATE)
    const handleMouseDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!stateRef.current.isDragging) {
        if (!isMobile) {
          const nx = (e.clientX / window.innerWidth - 0.5) * 0.35;
          stateRef.current.orbitAngleX += (nx - stateRef.current.orbitAngleX) * 0.04;
        }
        return;
      }
      const dx = e.clientX - stateRef.current.prevMousePos.x;
      const dy = e.clientY - stateRef.current.prevMousePos.y;
      stateRef.current.orbitAngleX += dx * 0.005;
      stateRef.current.orbitAngleY = Math.max(0.05, Math.min(0.5, stateRef.current.orbitAngleY + dy * 0.003));
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        stateRef.current.isDragging = true;
        stateRef.current.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e) => {
      if (stateRef.current.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - stateRef.current.prevMousePos.x;
        const dy = e.touches[0].clientY - stateRef.current.prevMousePos.y;
        stateRef.current.orbitAngleX += dx * 0.006;
        stateRef.current.orbitAngleY = Math.max(0.05, Math.min(0.5, stateRef.current.orbitAngleY + dy * 0.004));
        stateRef.current.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    mount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 12. OPTIMIZED ANIMATION LOOP & REAL FPS MEASUREMENT
    const clock = new THREE.Clock();
    let lastTime = performance.now();
    let frameCount = 0;
    let lowFpsCount = 0;
    let hasAutoAdapted = false;

    const animate = () => {
      stateRef.current.reqId = requestAnimationFrame(animate);

      // Skip render entirely if not visible in viewport
      if (!stateRef.current.isVisible) return;

      const state = stateRef.current;
      const time = clock.getElapsedTime();

      // Real FPS calculation
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const measuredFps = frameCount;
        if (fpsDomRef.current) {
          fpsDomRef.current.innerText = `${measuredFps} FPS`;
        }

        // Automatic degradation if device is struggling (< 20 FPS for 3 sec)
        if (measuredFps < 20 && !hasAutoAdapted) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            hasAutoAdapted = true;
            setLowPerfNotice(true);
            if (renderer.shadowMap.enabled) {
              renderer.shadowMap.enabled = false;
            }
            renderer.setPixelRatio(1.0);
          }
        } else {
          lowFpsCount = 0;
        }

        frameCount = 0;
        lastTime = now;
      }

      // Sacred Fire dynamic flicker (smooth and lightweight)
      if (state.fireLight) {
        const flicker = Math.sin(time * 10) * 0.35 + Math.cos(time * 16) * 0.25;
        state.fireLight.intensity = 3.5 + flicker;
      }
      if (state.flameCore && !isReducedMotion) {
        const s = 1.0 + Math.sin(time * 10) * 0.12;
        state.flameCore.scale.set(s, 1.0 + Math.cos(time * 14) * 0.2, s);
        state.flameCore.rotation.y += 0.03;
      }

      // Rose Petal falling physics (only when motion enabled)
      if (state.petals && !isReducedMotion) {
        const { pos, speed, count, points } = state.petals;
        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] -= speed[i];
          pos[i * 3] += Math.sin(time + i) * 0.002;
          if (pos[i * 3 + 1] < 0) {
            pos[i * 3 + 1] = 6;
            pos[i * 3] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
      }

      // Firefly dust rotation
      if (state.goldDust && !isReducedMotion) {
        state.goldDust.rotation.y = time * 0.03;
      }

      // Smooth Camera Interpolation
      const radius = 8.5;
      const camX = Math.sin(state.orbitAngleX) * radius;
      const camZ = Math.cos(state.orbitAngleX) * radius;
      const camY = 1.6 + state.orbitAngleY * 4;

      camera.position.x += (camX - camera.position.x) * 0.06;
      camera.position.y += (camY - camera.position.y) * 0.06;
      camera.position.z += (camZ - camera.position.z) * 0.06;
      camera.lookAt(0, 1.4, 0);

      renderer.render(scene, camera);
    };

    stateRef.current.reqId = requestAnimationFrame(animate);

    // 13. THOROUGH CLEANUP (All geometries, textures, render targets, listeners)
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      mount.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (stateRef.current.reqId) {
        cancelAnimationFrame(stateRef.current.reqId);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      petalTexture.dispose();
      dustTexture.dispose();

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isReducedMotion]);

  // Update camera on scrollProgress changes
  useEffect(() => {
    if (!stateRef.current.camera) return;
    stateRef.current.orbitAngleX = scrollProgress * Math.PI * 0.8;
  }, [scrollProgress]);

  // WebGL Unsupported Fallback UI
  if (!webGlSupported) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#16030c] text-center text-[#faeed1]">
        <div className="p-4 rounded-full bg-[#801235]/60 border border-[#d4af37] mb-3">
          <AlertTriangle size={28} className="text-[#f5d77f]" />
        </div>
        <h4 className="font-display font-bold text-lg text-gold-gradient mb-2">
          {language === 'hi' ? 'WebGL 3D समर्थन अनुपलब्ध' : 'WebGL 3D Accelerated Mode Unavailable'}
        </h4>
        <p className="font-body text-xs text-[#d8c7b5] max-w-md mb-4 leading-relaxed">
          {language === 'hi'
            ? 'आपके ब्राउज़र या डिवाइस में WebGL हार्डवेयर एक्सेलेरेशन सक्षम नहीं है। सहज अनुभव हेतु सिनेमैटिक कैनवास दृश्य देखें।'
            : 'Your browser or graphics hardware does not currently support WebGL rendering. Please switch to the optimized Cinematic Visual Canvas.'}
        </p>
        {onSwitchToCinematic && (
          <button
            onClick={onSwitchToCinematic}
            className="btn-royal-gold text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>{language === 'hi' ? 'सिनेमैटिक दृश्य पर स्विच करें' : 'Switch to Cinematic Visual'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Real-time 3D Mandap HUD overlay with Measured Live FPS */}
      <div className="absolute bottom-4 left-4 sm:left-6 z-10 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-wider uppercase font-display bg-black/75 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-500/40 backdrop-blur-md shadow-lg max-w-[calc(100vw-2rem)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span className="text-amber-200 truncate">Three.js 3D Mandap</span>
        <span className="text-amber-500/50 hidden sm:inline">|</span>
        <span className="text-stone-300 hidden sm:inline">Drag to Orbit</span>
        <span className="text-amber-500/50">|</span>
        {/* Dynamic DOM element updated by requestAnimationFrame without React state re-renders */}
        <span ref={fpsDomRef} className="text-amber-400 font-mono font-bold shrink-0">
          -- FPS
        </span>

        {/* Low performance automatic notification & switch prompt */}
        {lowPerfNotice && onSwitchToCinematic && (
          <>
            <span className="text-amber-500/50">|</span>
            <button
              onClick={onSwitchToCinematic}
              className="text-[#f5d77f] hover:underline text-[10px] lowercase font-sans ml-1"
            >
              (switch to cinematic)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
