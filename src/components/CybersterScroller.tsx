import React, { useEffect, useRef, useState, useCallback } from 'react';

// Front View
import front1 from '../assets/cyberster/front1.png';
import front2 from '../assets/cyberster/front2.png';
import front3 from '../assets/cyberster/front3.png';
import front4 from '../assets/cyberster/front4.png';
import front5 from '../assets/cyberster/front5.png';

// Back View
import back1 from '../assets/cyberster/back1.png';
import back2 from '../assets/cyberster/back2.png';
import back3 from '../assets/cyberster/back3.png';
import back4 from '../assets/cyberster/back4.png';
import back5 from '../assets/cyberster/back5.png';

// Left View
import left1 from '../assets/cyberster/left1.png';
import left2 from '../assets/cyberster/left2.png';
import left3 from '../assets/cyberster/left3.png';
import left4 from '../assets/cyberster/left4.png';
import left5 from '../assets/cyberster/left5.png';

// Right View
import right1 from '../assets/cyberster/right1.png';
import right2 from '../assets/cyberster/right2.png';
import right3 from '../assets/cyberster/right3.png';
import right4 from '../assets/cyberster/right4.png';
import right5 from '../assets/cyberster/right5.png';

// Top View
import top1 from '../assets/cyberster/top1.png';
import top2 from '../assets/cyberster/top2.png';
import top3 from '../assets/cyberster/top3.png';
import top4 from '../assets/cyberster/top4.png';
import top5 from '../assets/cyberster/top5.png';

// Bottom View
import bottom1 from '../assets/cyberster/bottom1.png';
import bottom2 from '../assets/cyberster/bottom2.png';
import bottom3 from '../assets/cyberster/bottom3.png';
import bottom4 from '../assets/cyberster/bottom4.png';
import bottom5 from '../assets/cyberster/bottom5.png';

export type ViewAngle = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom';

interface ViewConfig {
  id: ViewAngle;
  label: string;
  iconLabel: string;
  frames: string[];
}

const VIEW_CONFIGS: Record<ViewAngle, ViewConfig> = {
  front: {
    id: 'front',
    label: 'Front View',
    iconLabel: 'FRONT',
    frames: [front1, front2, front3, front4, front5],
  },
  left: {
    id: 'left',
    label: 'Left Profile',
    iconLabel: 'LEFT',
    frames: [left1, left2, left3, left4, left5],
  },
  back: {
    id: 'back',
    label: 'Rear View',
    iconLabel: 'BACK',
    frames: [back1, back2, back3, back4, back5],
  },
  right: {
    id: 'right',
    label: 'Right Profile',
    iconLabel: 'RIGHT',
    frames: [right1, right2, right3, right4, right5],
  },
  top: {
    id: 'top',
    label: "Top Bird's Eye",
    iconLabel: 'TOP',
    frames: [top1, top2, top3, top4, top5],
  },
  bottom: {
    id: 'bottom',
    label: 'Underbody Chassis',
    iconLabel: 'BOTTOM',
    frames: [bottom1, bottom2, bottom3, bottom4, bottom5],
  },
};

const VIEW_ORDER: ViewAngle[] = ['front', 'left', 'back', 'right', 'top', 'bottom'];
const HORIZONTAL_ORBIT: ViewAngle[] = ['front', 'left', 'back', 'right'];

const STAGE_LABELS = [
  { percent: 0, title: 'DOORS CLOSED', desc: '0° Angle • Aerodynamic Clean Flow' },
  { percent: 25, title: 'DOORS 25% OPEN', desc: 'Electric Struts Initializing' },
  { percent: 50, title: 'DOORS 50% OPEN', desc: 'Mid-Arc Elevation' },
  { percent: 75, title: 'DOORS 75% OPEN', desc: 'High Clearance Arc' },
  { percent: 100, title: 'DOORS 100% OPEN', desc: 'Full Scissor Articulation' },
];

export const CybersterScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentageTextRef = useRef<HTMLSpanElement>(null);

  // Active and previous view states for cinematic cross-dissolve
  const [activeView, setActiveView] = useState<ViewAngle>('front');
  const [prevView, setPrevView] = useState<ViewAngle | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  // const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

  // Drag interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [dragFeedback, setDragFeedback] = useState<string | null>(null);

  // Image references for all views: imgRefs.current[view][frameIndex]
  const imgRefs = useRef<Record<ViewAngle, (HTMLImageElement | null)[]>>({
    front: [null, null, null, null, null],
    left: [null, null, null, null, null],
    back: [null, null, null, null, null],
    right: [null, null, null, null, null],
    top: [null, null, null, null, null],
    bottom: [null, null, null, null, null],
  });

  // Smooth LERP (Linear Interpolation) refs
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Progressive Preloading
  useEffect(() => {
    let totalLoaded = 0;
    const allFrames: string[] = [];

    allFrames.push(...VIEW_CONFIGS.front.frames);
    (Object.keys(VIEW_CONFIGS) as ViewAngle[]).forEach((v) => {
      if (v !== 'front') {
        allFrames.push(...VIEW_CONFIGS[v].frames);
      }
    });

    allFrames.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      const onDone = () => {
        totalLoaded += 1;
        setLoadedCount(totalLoaded);
        if (totalLoaded >= 5 && !isInitialReady) {
          setIsInitialReady(true);
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      if (idx > 5) {
        img.loading = 'lazy';
      }
    });
  }, [isInitialReady]);

  // Synchronize frame opacities across all views simultaneously
  const updateRender = useCallback((progress: number) => {
    const totalFrames = 5;
    const continuousIndex = progress * (totalFrames - 1);
    const baseIndex = Math.min(Math.floor(continuousIndex), totalFrames - 2);
    const fraction = continuousIndex - baseIndex;

    // Apply frame blending across all views so every perspective is perfectly in sync
    VIEW_ORDER.forEach((viewKey) => {
      const viewImgs = imgRefs.current[viewKey];
      if (!viewImgs) return;

      for (let i = 0; i < totalFrames; i++) {
        const el = viewImgs[i];
        if (!el) continue;

        if (progress >= 0.999 && i === totalFrames - 1) {
          el.style.opacity = '1';
          el.style.zIndex = '20';
          el.style.visibility = 'visible';
        } else if (i < baseIndex) {
          el.style.opacity = '0';
          el.style.zIndex = '0';
          el.style.visibility = 'hidden';
        } else if (i === baseIndex) {
          el.style.opacity = '1';
          el.style.zIndex = '10';
          el.style.visibility = 'visible';
        } else if (i === baseIndex + 1) {
          el.style.opacity = fraction.toFixed(4);
          el.style.zIndex = '20';
          el.style.visibility = 'visible';
        } else {
          el.style.opacity = '0';
          el.style.zIndex = '0';
          el.style.visibility = 'hidden';
        }
      }
    });

    const roundedPercent = Math.round(progress * 100);
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.max(roundedPercent, 2)}%`;
    }
    if (percentageTextRef.current) {
      percentageTextRef.current.innerText = `${roundedPercent}%`;
    }

    const nearestIndex = Math.min(
      Math.round(progress * (totalFrames - 1)),
      totalFrames - 1
    );
    setActiveFrameIndex((prev) => (prev !== nearestIndex ? nearestIndex : prev));
    // setDisplayPercent((prev) => (prev !== roundedPercent ? roundedPercent : prev));
  }, []);

  // Smooth Animation Loop with LERP Damping
  useEffect(() => {
    let running = true;

    const renderLoop = () => {
      if (!running) return;

      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.09;
        updateRender(currentProgress.current);
      } else if (currentProgress.current !== targetProgress.current) {
        currentProgress.current = targetProgress.current;
        updateRender(currentProgress.current);
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [updateRender]);

  // Scroll listener that updates targetProgress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      targetProgress.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Jump to specific frame on checkpoint click
  // const scrollToFrame = (index: number) => {
  //   if (!containerRef.current) return;
  //   const rect = containerRef.current.getBoundingClientRect();
  //   const scrollTop = window.scrollY || window.pageYOffset;
  //   const containerTop = rect.top + scrollTop;
  //   const totalScrollable = rect.height - window.innerHeight;

  //   const targetFraction = index / 4;
  //   const targetScrollY = containerTop + targetFraction * totalScrollable;

  //   window.scrollTo({
  //     top: targetScrollY,
  //     behavior: 'smooth',
  //   });
  // };

  // Switch View Angle with Cinematic Transition
  const switchView = useCallback(
    (newView: ViewAngle) => {
      if (newView === activeView) return;

      // Keep previous view active in DOM to cross-fade gracefully
      setPrevView(activeView);
      setActiveView(newView);

      // Immediately ensure the new view frames match current door position
      updateRender(currentProgress.current);

      setDragFeedback(VIEW_CONFIGS[newView].label.toUpperCase());
      setTimeout(() => setDragFeedback(null), 1400);

      // Clean up previous view after transition completes
      setTimeout(() => {
        setPrevView(null);
      }, 700);
    },
    [activeView, updateRender]
  );

  // Drag Gesture Handling
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
  };

  const handleDragEnd = (clientX: number, clientY: number) => {
    if (!dragStart.current) {
      setIsDragging(false);
      return;
    }

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    const threshold = 35; // Pixels needed to register a deliberate swipe

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal Drag
        if (deltaX < -threshold) {
          // Dragged Left -> Next in turntable orbit
          if (activeView === 'front') switchView('left');
          else if (activeView === 'left') switchView('back');
          else if (activeView === 'back') switchView('right');
          else if (activeView === 'right') switchView('front');
          else switchView('left');
        } else if (deltaX > threshold) {
          // Dragged Right -> Previous in turntable orbit
          if (activeView === 'front') switchView('right');
          else if (activeView === 'right') switchView('back');
          else if (activeView === 'back') switchView('left');
          else if (activeView === 'left') switchView('front');
          else switchView('right');
        }
      } else {
        // Vertical Drag
        // USER REQUIREMENT:
        // "bottom to top drag scroll means bottom frames ,top to bottom drag scroll means top frames"
        if (deltaY < -threshold) {
          // Bottom-to-Top drag (swiping upward): Switch to BOTTOM frames
          if (activeView === 'top') {
            switchView('front');
          } else {
            switchView('bottom');
          }
        } else if (deltaY > threshold) {
          // Top-to-Bottom drag (swiping downward): Switch to TOP frames
          if (activeView === 'bottom') {
            switchView('front');
          } else {
            switchView('top');
          }
        }
      }
    }

    setIsDragging(false);
    dragStart.current = null;
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
          const idx = HORIZONTAL_ORBIT.indexOf(activeView);
          const nextIdx = (idx + 1) % HORIZONTAL_ORBIT.length;
          switchView(HORIZONTAL_ORBIT[nextIdx >= 0 ? nextIdx : 1]);
        } else if (e.key === 'ArrowRight') {
          const idx = HORIZONTAL_ORBIT.indexOf(activeView);
          const prevIdx = (idx - 1 + HORIZONTAL_ORBIT.length) % HORIZONTAL_ORBIT.length;
          switchView(HORIZONTAL_ORBIT[prevIdx >= 0 ? prevIdx : 3]);
        } else if (e.key === 'ArrowUp') {
          // Upward key: Bottom frames
          switchView('bottom');
        } else if (e.key === 'ArrowDown') {
          // Downward key: Top frames
          switchView('top');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, switchView]);

  const currentStage = STAGE_LABELS[activeFrameIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-neutral-950 text-white"
      style={{ height: '420vh' }}
    >
      {/* Fullscreen Sticky Viewport */}
      <div
        className={`sticky top-0 h-screen w-full overflow-hidden select-none bg-neutral-950 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseUp={(e) => handleDragEnd(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={(e) => {
          if (e.changedTouches.length === 1) {
            handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }
        }}
      >
        {/* Fullscreen Edge-to-Edge Image Stage */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          {/* Subtle Ambient Studio Lighting */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[70vh] bg-red-600/[0.07] blur-[160px] rounded-full" />
            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-transparent" />
          </div>

          {/* Initial Loading Screen */}
          {!isInitialReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 z-50">
              <div className="w-14 h-14 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Initializing 3D Cyberster Visualizer ({loadedCount}/30)
              </p>
            </div>
          )}

          {/* Cinematic Multi-Angle View Stage with Silky Cross-Dissolve */}
          {VIEW_ORDER.map((viewKey) => {
            const isCurrentView = viewKey === activeView;
            const isPreviousView = viewKey === prevView;
            const viewConfig = VIEW_CONFIGS[viewKey];

            // Only render active or outgoing view to save GPU/DOM memory
            const shouldRender = isCurrentView || isPreviousView;

            return (
              <div
                key={viewKey}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${isCurrentView
                  ? 'opacity-100 scale-100 z-20 pointer-events-auto'
                  : isPreviousView
                    ? 'opacity-0 scale-[0.98] z-10 pointer-events-none'
                    : 'opacity-0 scale-95 z-0 pointer-events-none invisible'
                  }`}
              >
                {shouldRender &&
                  viewConfig.frames.map((src, fIdx) => (
                    <img
                      key={fIdx}
                      ref={(el) => {
                        imgRefs.current[viewKey][fIdx] = el;
                      }}
                      src={src}
                      alt={`MG Cyberster ${viewConfig.label} Frame ${fIdx + 1}`}
                      className={`absolute inset-0 w-full h-full pointer-events-none select-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${fitMode === 'cover'
                        ? 'object-cover object-center'
                        : 'object-contain object-center'
                        }`}
                      style={{
                        opacity: fIdx === 0 ? 1 : 0,
                        zIndex: fIdx === 0 ? 10 : 0,
                        visibility: fIdx === 0 ? 'visible' : 'hidden',
                        willChange: 'opacity',
                        transform: 'translateZ(0)',
                      }}
                      draggable={false}
                    />
                  ))}
              </div>
            );
          })}
        </div>

        {/* Cinematic View Angle Notification Banner */}
        {dragFeedback && (
          <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
            <div className="bg-neutral-900/95 backdrop-blur-xl border border-red-500/40 px-6 py-3 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all animate-fade-in flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white">
                VIEW: {dragFeedback}
              </span>
            </div>
          </div>
        )}

        {/* Floating Top Header & Status */}
        <header className="absolute top-0 inset-x-0 z-30 px-6 sm:px-12 pt-6 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="text-red-500 font-extrabold tracking-widest text-xs uppercase px-2.5 py-1 border border-red-500/40 rounded-md bg-neutral-900/80 backdrop-blur-md">
              MG
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-widest text-white font-montserrat drop-shadow-md">
                CYBERSTER
              </h2>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest hidden sm:block">
                360° Cinematic Scissor Door Visualizer
              </p>
            </div>
          </div>

          {/* Controls: Fit Mode & Active Door Angle Badge */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
              className="text-[11px] font-mono tracking-wider px-3 py-1.5 rounded-full border border-neutral-700 bg-neutral-900/80 backdrop-blur-md text-neutral-300 hover:text-white hover:border-red-500 transition-all flex items-center gap-1.5 shadow-lg"
              title="Toggle between full-bleed screen cover or fit frame"
            >
              <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{fitMode === 'cover' ? 'Full Bleed' : 'Fit Frame'}</span>
            </button>

            {/* Dynamic Angle Pill */}
            <div className="flex items-center gap-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full px-4 py-1.5 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="text-xs font-semibold tracking-wider text-neutral-200">
                  {currentStage.title}
                </span>
              </div>
              <div className="h-3.5 w-px bg-neutral-700" />
              <span
                ref={percentageTextRef}
                className="text-xs font-mono font-bold text-red-500 min-w-[3ch] text-right"
              >
                0%
              </span>
            </div>
          </div>
        </header>

        {/* Floating 360° Angle Switcher (Desktop Side Panel) */}
        {/* <div className="absolute right-6 top-24 z-30 pointer-events-none hidden md:flex flex-col items-end gap-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 bg-neutral-950/70 px-2.5 py-1 rounded backdrop-blur border border-neutral-800">
            Camera Angle
          </div>

          <div className="pointer-events-auto flex flex-col gap-1.5 bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-xl">
            {VIEW_ORDER.map((viewKey) => {
              const cfg = VIEW_CONFIGS[viewKey];
              const isSelected = activeView === viewKey;

              return (
                <button
                  key={viewKey}
                  onClick={() => switchView(viewKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-[0_0_14px_rgba(220,38,38,0.7)]'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                  }`}
                >
                  <span>{cfg.iconLabel}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="text-[9px] font-mono text-neutral-500 pr-1 text-right leading-tight mt-1">
            Drag $\uparrow$: Bottom View<br />
            Drag $\downarrow$: Top View<br />
            Drag $\leftarrow\rightarrow$: 360° Orbit
          </div>
        </div> */}

        {/* Floating Bottom Dashboard & Controls */}
        <footer className="absolute bottom-0 inset-x-0 z-30 px-6 sm:px-12 pb-6 flex flex-col items-center gap-3 pointer-events-none">
          {/* Dual Action Cue: Drag to Switch Angle + Scroll to Actuate Doors */}
          {/* <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-5 py-2 rounded-full backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-1.5 text-neutral-200">
              <svg
                className={`w-3.5 h-3.5 text-red-500 transition-transform duration-300 ${displayPercent > 10 ? 'rotate-180' : 'animate-bounce'
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>
                {displayPercent >= 95
                  ? 'Scroll up to close doors'
                  : displayPercent <= 5
                    ? 'Scroll down to open doors'
                    : 'Scroll moves scissor doors'}
              </span>
            </div>

            <span className="text-neutral-600">|</span>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <svg className="w-3.5 h-3.5 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>
                Drag $\uparrow$ Bottom • $\downarrow$ Top • $\leftarrow\rightarrow$ Orbit ({VIEW_CONFIGS[activeView].label})
              </span>
            </div>
          </div> */}

          <div className="pointer-events-auto flex md:hidden items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xl border border-neutral-800">
            {VIEW_ORDER.map((viewKey) => {
              const cfg = VIEW_CONFIGS[viewKey];
              const isSelected = activeView === viewKey;
              return (
                <button
                  key={viewKey}
                  onClick={() => switchView(viewKey)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${isSelected
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                    }`}
                >
                  {cfg.iconLabel}
                </button>
              );
            })}
          </div>

          {/* Scrubber Track */}
          {/* <div className="pointer-events-auto w-full max-w-xl bg-neutral-950/85 backdrop-blur-lg border border-neutral-800/90 rounded-2xl p-4 shadow-2xl">
            <div className="relative w-full h-2 bg-neutral-800/90 rounded-full overflow-hidden mb-3">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.7)]"
                style={{ width: '2%' }}
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              {STAGE_LABELS.map((stage, index) => {
                const isSelected = activeFrameIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => scrollToFrame(index)}
                    className={`group flex flex-col items-center gap-1 transition-all ${isSelected
                      ? 'text-white scale-105'
                      : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border transition-all ${isSelected
                        ? 'bg-red-600 border-white ring-2 ring-red-600/60 shadow-[0_0_8px_rgba(220,38,38,0.8)]'
                        : 'bg-neutral-800 border-neutral-700 group-hover:border-neutral-500'
                        }`}
                    />
                    <span className="font-mono text-[10px] font-semibold">
                      {stage.percent}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Specifications Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-neutral-400 text-[11px] font-mono uppercase tracking-wider">
            <div>
              <span className="text-neutral-500">CAMERA:</span>{' '}
              <span className="text-red-400 font-semibold">{VIEW_CONFIGS[activeView].label.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-neutral-500">POWER:</span>{' '}
              <span className="text-neutral-200 font-semibold">536 HP</span>
            </div>
            <div>
              <span className="text-neutral-500">0-100 KM/H:</span>{' '}
              <span className="text-neutral-200 font-semibold">3.2 SEC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-neutral-500">STATUS:</span>{' '}
              <span className="text-neutral-200">{currentStage.desc}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CybersterScroller;
