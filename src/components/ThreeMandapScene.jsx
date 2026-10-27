import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeMandapScene({ scrollProgress = 0, isInteractive = false }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    fireLight: null,
    petals: null,
    goldDust: null,
    mandapGroup: null,
    reqId: null,
    targetCamPos: new THREE.Vector3(0, 2.2, 9),
    targetLookAt: new THREE.Vector3(0, 1.2, 0),
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    orbitAngleX: 0,
    orbitAngleY: 0.15,
  });

  const [fps, setFps] = useState(60);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x120309, 0.045);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 9);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x2a0c16, 1.8);
    scene.add(ambientLight);

    // Warm Golden Moon / Chandelier Light from top
    const topChandelierLight = new THREE.DirectionalLight(0xffdf88, 2.5);
    topChandelierLight.position.set(0, 12, 2);
    topChandelierLight.castShadow = true;
    scene.add(topChandelierLight);

    // Warm Sacred Fire PointLight
    const fireLight = new THREE.PointLight(0xff6e26, 4, 15, 1.5);
    fireLight.position.set(0, 0.6, 0);
    scene.add(fireLight);

    // Cool rim light for cinematic contrast
    const rimLight = new THREE.DirectionalLight(0x6b3040, 1.2);
    rimLight.position.set(-6, 4, -8);
    scene.add(rimLight);

    // MATERIALS
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

    // MANDAP ROOT GROUP
    const mandapGroup = new THREE.Group();
    scene.add(mandapGroup);

    // 1. Raised Octagonal Platform (Vedi / Peetha)
    const platformGeo = new THREE.CylinderGeometry(4.8, 5.2, 0.4, 8);
    const platform = new THREE.Mesh(platformGeo, sandstoneMat);
    platform.position.y = -0.2;
    platform.receiveShadow = true;
    mandapGroup.add(platform);

    const platformStepGeo = new THREE.CylinderGeometry(5.4, 5.8, 0.25, 8);
    const platformStep = new THREE.Mesh(platformStepGeo, sandstoneMat);
    platformStep.position.y = -0.5;
    platformStep.receiveShadow = true;
    mandapGroup.add(platformStep);

    // Platform Gold Border Trim
    const trimGeo = new THREE.TorusGeometry(4.8, 0.06, 12, 8);
    trimGeo.rotateX(Math.PI / 2);
    const trim = new THREE.Mesh(trimGeo, royalGoldMat);
    trim.position.y = 0.01;
    mandapGroup.add(trim);

    // 2. Ornate 4 Pillars (Stambha)
    const pillarPositions = [
      [-2.6, -2.6],
      [2.6, -2.6],
      [-2.6, 2.6],
      [2.6, 2.6],
    ];

    pillarPositions.forEach(([px, pz]) => {
      const pColGroup = new THREE.Group();
      pColGroup.position.set(px, 0, pz);

      // Base pedestal
      const baseGeo = new THREE.BoxGeometry(0.85, 0.5, 0.85);
      const base = new THREE.Mesh(baseGeo, sandstoneMat);
      base.position.y = 0.25;
      pColGroup.add(base);

      // Pillar shaft (fluted style)
      const shaftGeo = new THREE.CylinderGeometry(0.24, 0.28, 3.8, 16);
      const shaft = new THREE.Mesh(shaftGeo, sandstoneMat);
      shaft.position.y = 2.4;
      pColGroup.add(shaft);

      // Gold capital ring
      const ringGeo = new THREE.TorusGeometry(0.32, 0.05, 12, 16);
      ringGeo.rotateX(Math.PI / 2);
      const ring1 = new THREE.Mesh(ringGeo, royalGoldMat);
      ring1.position.y = 0.6;
      pColGroup.add(ring1);

      const ring2 = ring1.clone();
      ring2.position.y = 4.1;
      pColGroup.add(ring2);

      // Ornate Capital (Kumbha/Bracket)
      const capGeo = new THREE.BoxGeometry(0.8, 0.35, 0.8);
      const cap = new THREE.Mesh(capGeo, royalGoldMat);
      cap.position.y = 4.3;
      pColGroup.add(cap);

      mandapGroup.add(pColGroup);
    });

    // 3. Canopy Roof & Decorative Arches
    const roofRingGeo = new THREE.BoxGeometry(5.4, 0.25, 0.4);
    // 4 Cross Beams
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

    // Golden Kalash Finial atop dome
    const kalashGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const kalash = new THREE.Mesh(kalashGeo, royalGoldMat);
    kalash.position.y = 6.2;
    mandapGroup.add(kalash);

    const kalashSpireGeo = new THREE.ConeGeometry(0.12, 0.6, 12);
    const kalashSpire = new THREE.Mesh(kalashSpireGeo, royalGoldMat);
    kalashSpire.position.y = 6.65;
    mandapGroup.add(kalashSpire);

    // Hanging brass bells / ghungroo tassels along beams
    const bellGeo = new THREE.ConeGeometry(0.08, 0.16, 8);
    bellGeo.rotateX(Math.PI);
    for (let i = -2; i <= 2; i += 0.8) {
      if (Math.abs(i) < 2.5) {
        const bell = new THREE.Mesh(bellGeo, brassMat);
        bell.position.set(i, 4.25, 2.6);
        mandapGroup.add(bell);

        const bellBack = bell.clone();
        bellBack.position.set(i, 4.25, -2.6);
        mandapGroup.add(bellBack);
      }
    }

    // 4. Central Sacred Havankund (Agni Kunda)
    const kundaGroup = new THREE.Group();
    kundaGroup.position.set(0, 0, 0);

    // 3 tiered copper pit
    const k1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 1.6), brassMat);
    k1.position.y = 0.08;
    kundaGroup.add(k1);

    const k2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), royalGoldMat);
    k2.position.y = 0.22;
    kundaGroup.add(k2);

    const k3 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.85), brassMat);
    k3.position.y = 0.35;
    kundaGroup.add(k3);

    // Sacred Fire Core (Glowing multifaceted flame)
    const flameGeo = new THREE.TetrahedronGeometry(0.32, 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      wireframe: false,
    });
    const flameCore = new THREE.Mesh(flameGeo, flameMat);
    flameCore.position.y = 0.62;
    kundaGroup.add(flameCore);

    mandapGroup.add(kundaGroup);

    // 5. Rose Petal Particles System
    const petalCount = 180;
    const petalGeo = new THREE.BufferGeometry();
    const petalPos = new Float32Array(petalCount * 3);
    const petalRot = new Float32Array(petalCount * 3);
    const petalSpeed = new Float32Array(petalCount);

    for (let i = 0; i < petalCount; i++) {
      petalPos[i * 3] = (Math.random() - 0.5) * 8;
      petalPos[i * 3 + 1] = Math.random() * 6;
      petalPos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      petalRot[i * 3] = Math.random() * Math.PI;
      petalRot[i * 3 + 1] = Math.random() * Math.PI;
      petalRot[i * 3 + 2] = Math.random() * Math.PI;

      petalSpeed[i] = 0.008 + Math.random() * 0.015;
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));

    // Custom textured circular particle shader / point material
    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 32;
    petalCanvas.height = 32;
    const pCtx = petalCanvas.getContext('2d');
    pCtx.beginPath();
    pCtx.ellipse(16, 16, 12, 8, Math.PI / 4, 0, Math.PI * 2);
    pCtx.fillStyle = '#b81434';
    pCtx.fill();
    const petalTexture = new THREE.CanvasTexture(petalCanvas);

    const petalMat = new THREE.PointsMaterial({
      size: 0.18,
      map: petalTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    const petals = new THREE.Points(petalGeo, petalMat);
    scene.add(petals);

    // 6. Floating Golden Fireflies / Ember Particles
    const dustCount = 240;
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
    grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.6)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    dCtx.fillStyle = grad;
    dCtx.fillRect(0, 0, 16, 16);
    const dustTexture = new THREE.CanvasTexture(dustCanvas);

    const dustMat = new THREE.PointsMaterial({
      size: 0.16,
      map: dustTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const goldDust = new THREE.Points(dustGeo, dustMat);
    scene.add(goldDust);

    // STATE STORE
    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.fireLight = fireLight;
    stateRef.current.petals = { points: petals, pos: petalPos, speed: petalSpeed, count: petalCount };
    stateRef.current.goldDust = goldDust;
    stateRef.current.mandapGroup = mandapGroup;
    stateRef.current.flameCore = flameCore;

    // RESIZE LISTENER
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // MOUSE INTERACTION (DRAG TO ROTATE IN 3D ORBIT)
    const handleMouseDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!stateRef.current.isDragging) {
        // Subtle tilt parallax on mouse move
        const nx = (e.clientX / window.innerWidth - 0.5) * 0.4;
        const ny = (e.clientY / window.innerHeight - 0.5) * 0.2;
        stateRef.current.orbitAngleX += (nx - stateRef.current.orbitAngleX) * 0.05;
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

    // Touch support
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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      const state = stateRef.current;
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Sacred Fire dynamic flicker
      if (state.fireLight) {
        const flicker = Math.sin(time * 14) * 0.4 + Math.cos(time * 22) * 0.3;
        state.fireLight.intensity = 3.6 + flicker;
      }
      if (state.flameCore) {
        const s = 1.0 + Math.sin(time * 12) * 0.15;
        state.flameCore.scale.set(s, 1.0 + Math.cos(time * 18) * 0.25, s);
        state.flameCore.rotation.y += 0.04;
      }

      // Rose Petal falling physics
      if (state.petals) {
        const { pos, speed, count, points } = state.petals;
        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] -= speed[i];
          pos[i * 3] += Math.sin(time + i) * 0.003;
          pos[i * 3 + 2] += Math.cos(time + i) * 0.003;
          // Wrap around top
          if (pos[i * 3 + 1] < 0) {
            pos[i * 3 + 1] = 6;
            pos[i * 3] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
      }

      // Firefly dust gentle floating
      if (state.goldDust) {
        state.goldDust.rotation.y = time * 0.04;
      }

      // Camera Position derived from Orbit Angle + Scroll
      const radius = 8.5;
      const camX = Math.sin(state.orbitAngleX) * radius;
      const camZ = Math.cos(state.orbitAngleX) * radius;
      const camY = 1.6 + state.orbitAngleY * 4;

      state.camera.position.x += (camX - state.camera.position.x) * 0.05;
      state.camera.position.y += (camY - state.camera.position.y) * 0.05;
      state.camera.position.z += (camZ - state.camera.position.z) * 0.05;

      state.camera.lookAt(0, 1.4, 0);

      renderer.render(scene, camera);
      state.reqId = requestAnimationFrame(animate);
    };

    stateRef.current.reqId = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
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

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update camera on scrollProgress changes
  useEffect(() => {
    if (!stateRef.current.camera) return;
    // Map scrollProgress (0 to 1) into orbit & height zoom
    stateRef.current.orbitAngleX = scrollProgress * Math.PI * 0.8;
  }, [scrollProgress]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ width: '100%', height: '100%' }} />

      {/* 3D Mandap HUD overlay */}
      <div className="absolute bottom-4 left-6 z-10 flex items-center gap-3 text-xs tracking-wider uppercase font-display bg-black/60 px-4 py-2 rounded-full border border-amber-500/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-amber-200">Three.js 3D Mandap & Havankund</span>
        <span className="text-amber-500/50">|</span>
        <span className="text-stone-300">Drag to Orbit</span>
        <span className="text-amber-500/50">|</span>
        <span className="text-amber-400 font-mono">{fps} FPS</span>
      </div>
    </div>
  );
}
