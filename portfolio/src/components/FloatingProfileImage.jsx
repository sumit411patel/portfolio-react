import React, { useState, useEffect } from 'react';
import profileImg from '../assets/profile-image.png';

export default function FloatingProfileImage() {
  const [pos, setPos] = useState(null);
  const [pathData, setPathData] = useState({ d: '', heroCenter: { x: 0, y: 0 }, aboutCenter: { x: 0, y: 0 }, currentPoint: { x: 0, y: 0 } });
  const [screenMode, setScreenMode] = useState('desktop');

  useEffect(() => {
    const checkScreen = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setScreenMode('mobile');
      } else if (w < 1024) {
        setScreenMode('tablet');
      } else {
        setScreenMode('desktop');
      }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const updatePosition = () => {
      const heroEl = document.getElementById('hero-img-target');
      const aboutEl = document.getElementById('about-img-target');

      if (!heroEl || !aboutEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      const aboutRect = aboutEl.getBoundingClientRect();

      const scrollY = window.scrollY;

      // Calculate absolute document positions
      const x0 = heroRect.left;
      const y0 = heroRect.top + scrollY;
      const w0 = heroRect.width;
      const h0 = heroRect.height;

      const x1 = aboutRect.left;
      const y1 = aboutRect.top + scrollY;
      const w1 = aboutRect.width;
      const h1 = aboutRect.height;

      // Scroll trigger range calculation adjusted per screen mode
      const startScroll = Math.max(0, y0 - (screenMode === 'mobile' ? 60 : 120));
      const endScroll = Math.max(startScroll + 80, y1 - (screenMode === 'mobile' ? 140 : 220));

      let t = (scrollY - startScroll) / (endScroll - startScroll);
      t = Math.max(0, Math.min(1, t));

      // Ease progress for ultra-smooth movement
      const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // Curved Arc Offset tailored per screen mode
      const arcMultiplier = screenMode === 'mobile' ? 0 : screenMode === 'tablet' ? 25 : 60;
      const arcOffset = Math.sin(easedT * Math.PI) * arcMultiplier;

      // Current page position
      const currPageX = (1 - easedT) * x0 + easedT * x1 + arcOffset;
      const currPageY = (1 - easedT) * y0 + easedT * y1;
      const currW = (1 - easedT) * w0 + easedT * w1;
      const currH = (1 - easedT) * h0 + easedT * h1;

      // Viewport relative position for fixed rendering
      const currViewX = currPageX;
      const currViewY = currPageY - scrollY;

      // Centers for SVG path
      const cX0 = x0 + w0 / 2;
      const cY0 = y0 + h0 / 2;
      const cX1 = x1 + w1 / 2;
      const cY1 = y1 + h1 / 2;

      // Control point for smooth SVG path line
      const ctrlXOffset = screenMode === 'mobile' ? 0 : screenMode === 'tablet' ? 35 : 90;
      const ctrlX = (cX0 + cX1) / 2 + ctrlXOffset;
      const ctrlY = (cY0 + cY1) / 2;

      // Quadratic bezier path
      const svgPath = `M ${cX0} ${cY0} Q ${ctrlX} ${ctrlY} ${cX1} ${cY1}`;

      // Current point on Bezier curve for path dot indicator
      const dotX = (1 - easedT) * (1 - easedT) * cX0 + 2 * (1 - easedT) * easedT * ctrlX + easedT * easedT * cX1;
      const dotY = (1 - easedT) * (1 - easedT) * cY0 + 2 * (1 - easedT) * easedT * ctrlY + easedT * easedT * cY1;

      const maxRotation = screenMode === 'mobile' ? -2 : screenMode === 'tablet' ? -4 : -6;

      setPos({
        x: currViewX,
        y: currViewY,
        width: currW,
        height: currH,
        rotation: Math.sin(easedT * Math.PI) * maxRotation,
        isDragging: t > 0.02 && t < 0.98,
      });

      setPathData({
        d: svgPath,
        heroCenter: { x: cX0, y: cY0 },
        aboutCenter: { x: cX1, y: cY1 },
        currentPoint: { x: dotX, y: dotY },
      });
    };

    const onScrollOrResize = () => {
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [screenMode]);

  if (!pos) return null;

  return (
    <>
      {/* ─── SVG PATH LINE FOR DRAGGING TRAJECTORY ─── */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none z-20 overflow-visible"
        style={{ height: `${Math.max(1000, (pathData.aboutCenter.y || 0) + 300)}px` }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B2B" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8F5C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF6B2B" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle glow line */}
        <path
          d={pathData.d}
          fill="none"
          stroke="#FF6B2B"
          strokeWidth="6"
          strokeOpacity="0.25"
          filter="url(#glow)"
        />

        {/* Main dashed path line */}
        <path
          d={pathData.d}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          className="transition-all duration-300"
        />
      </svg>

      {/* ─── FLOATING & DRAGGING PROFILE IMAGE CARD ─── */}
      <div
        className="fixed z-30 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          transform: `rotate(${pos.rotation}deg) scale(${pos.isDragging ? 1.03 : 1})`,
          willChange: 'transform, left, top',
        }}
      >
        <div
          className={`pf w-full h-full rounded-3xl overflow-hidden transition-all duration-300 ${pos.isDragging
            ? 'shadow-2xl shadow-accent/30 ring-4 ring-accent/40 bg-zinc-900'
            : 'shadow-lg shadow-black/10'
            }`}
        >
          <img
            src={profileImg}
            alt="Sumit — Profile"
            className="w-full h-full object-cover select-none"
            loading="eager"
          />
        </div>

        {/* Drag label tooltip during transition */}
        {pos.isDragging && (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-accent text-white font-display font-bold text-xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap tracking-wide animate-pulse">
            {screenMode === 'mobile' ? 'Moving to About...' : 'Dragging to About...'}
          </div>
        )}
      </div>
    </>
  );
}
