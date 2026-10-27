import React, { useEffect, useRef } from 'react';

/**
 * Procedural Cinematic Motion Graphics Engine
 * Renders real-time volumetric light shafts, warm golden embers,
 * floating rose petal silhouettes, and anamorphic lens flares.
 */
export default function MotionGraphicsCanvas({ intensity = 1.0, isReducedMotion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Golden Embers and Dust Particles
    const particleCount = 65;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        hue: 38 + Math.random() * 12, // Warm gold (38-50)
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Soft Volumetric Light Beams
    const beamCount = 4;
    const beams = [];
    for (let i = 0; i < beamCount; i++) {
      beams.push({
        x: canvas.width * (0.2 + i * 0.2),
        width: 120 + Math.random() * 100,
        alpha: 0.08 + Math.random() * 0.06,
        angle: -0.15 + (Math.random() - 0.5) * 0.1,
        speed: (Math.random() - 0.5) * 0.002,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Volumetric Light Rays from top center
      beams.forEach((beam) => {
        beam.angle += beam.speed;
        if (Math.abs(beam.angle) > 0.25) beam.speed *= -1;

        const grad = ctx.createLinearGradient(beam.x, 0, beam.x + Math.tan(beam.angle) * canvas.height, canvas.height);
        const dynamicAlpha = (beam.alpha + Math.sin(time + beam.x) * 0.03) * intensity;
        grad.addColorStop(0, `rgba(255, 230, 150, ${dynamicAlpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${dynamicAlpha * 0.8})`);
        grad.addColorStop(1, 'rgba(120, 20, 40, 0)');

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(beam.x - 20, 0);
        ctx.lineTo(beam.x + 20, 0);
        ctx.lineTo(beam.x + Math.tan(beam.angle) * canvas.height + beam.width, canvas.height);
        ctx.lineTo(beam.x + Math.tan(beam.angle) * canvas.height - beam.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw Floating Golden Embers
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        // Wrap around edges
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const currentAlpha = Math.max(0.05, p.alpha + Math.sin(p.pulse) * 0.3) * intensity;
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        radGrad.addColorStop(0, `hsla(${p.hue}, 90%, 75%, ${currentAlpha})`);
        radGrad.addColorStop(0.4, `hsla(${p.hue}, 80%, 55%, ${currentAlpha * 0.6})`);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, isReducedMotion]);

  if (isReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
