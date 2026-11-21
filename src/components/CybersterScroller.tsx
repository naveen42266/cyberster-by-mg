import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_FRAMES, BEATS, BeatInfo } from '../utils/frameLoader';

export const CybersterScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cached HTMLImageElements in memory
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

  // Active frame and progress tracking
  // const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [activeBeat, setActiveBeat] = useState<BeatInfo>(BEATS[0]);
  const [displayPercent, setDisplayPercent] = useState<number>(0);

  // Smooth LERP (Linear Interpolation) refs
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const lastDrawnIndex = useRef<number>(-1);
  const animFrameId = useRef<number | null>(null);

  const totalFrames = ALL_FRAMES.length; // 108 frames

  // 1. Preload all 108 WebP frames into memory
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    ALL_FRAMES.forEach((src, idx) => {
      const img = new Image();
      img.src = src;

      const onImageLoaded = () => {
        loaded += 1;
        setLoadedCount(loaded);

        // When Beat 1 (24 frames) is loaded, visualizer is ready to experience immediately
        if (loaded >= 24 && !isInitialReady) {
          setIsInitialReady(true);
        }
      };

      img.onload = onImageLoaded;
      img.onerror = onImageLoaded;
      imgs[idx] = img;
    });

    imagesRef.current = imgs;
  }, [isInitialReady]);

  // 2. High-DPI Canvas Draw with Aspect Ratio "Cover" Math
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Enable high-quality bicubic smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate aspect ratio "cover" scale
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const renderWidth = imgWidth * scale;
    const renderHeight = imgHeight * scale;

    const offsetX = (canvasWidth - renderWidth) / 2;
    const offsetY = (canvasHeight - renderHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    lastDrawnIndex.current = frameIdx;
  }, []);

  // 3. Resize Canvas to match device pixel ratio for ultra-crisp Retina sharpness
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    if (lastDrawnIndex.current >= 0) {
      drawFrame(lastDrawnIndex.current);
    }
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // 4. Smooth Animation Loop with LERP Damping (60 - 120 FPS)
  useEffect(() => {
    let running = true;

    const renderLoop = () => {
      if (!running) return;

      const diff = targetProgress.current - currentProgress.current;

      // 0.085 lerp factor creates realistic camera inertia and mechanical glide
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.085;
      } else if (currentProgress.current !== targetProgress.current) {
        currentProgress.current = targetProgress.current;
      }

      const progress = Math.min(Math.max(currentProgress.current, 0), 1);
      const targetIdx = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);

      if (targetIdx !== lastDrawnIndex.current) {
        drawFrame(targetIdx);
        // setCurrentFrameIndex(targetIdx);

        // Find which beat this frame belongs to
        const foundBeat = BEATS.find(
          (b) => targetIdx >= b.startFrame && targetIdx <= b.endFrame
        ) || BEATS[0];

        setActiveBeat((prev) => (prev.id !== foundBeat.id ? foundBeat : prev));
        setDisplayPercent(Math.round(progress * 100));
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
  }, [drawFrame, totalFrames]);

  // 5. Scroll listener calculating normalized progress (0.0 to 1.0)
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
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific Beat on Click
  // const scrollToBeat = (beat: BeatInfo) => {
  //   if (!containerRef.current) return;
  //   const rect = containerRef.current.getBoundingClientRect();
  //   const scrollTop = window.scrollY || window.pageYOffset;
  //   const containerTop = rect.top + scrollTop;
  //   const totalScrollable = rect.height - window.innerHeight;

  //   const targetFraction = beat.startFrame / (totalFrames - 1);
  //   const targetScrollY = containerTop + targetFraction * totalScrollable;

  //   window.scrollTo({
  //     top: targetScrollY,
  //     behavior: 'smooth',
  //   });
  // };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: '520vh' }} // 520vh provides ample cinematic scrub travel for 108 frames
    >
      {/* Sticky Fullscreen Cinematic Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-black">
        {/* Fullscreen HTML5 Canvas Frame Renderer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            imageRendering: 'auto',
            filter: 'contrast(1.03) brightness(1.01)',
          }}
        />

        {/* Ambient Cinema Vignette & Gradients */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
        </div>

        {/* Loading Splash */}
        {!isInitialReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
              <span className="absolute text-xs font-mono font-bold text-red-500">MG</span>
            </div>
            <h3 className="text-sm font-mono tracking-widest uppercase text-neutral-200 mb-2">
              Loading Cyberster 108-Frame Cinema
            </h3>
            <div className="w-56 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-150"
                style={{ width: `${Math.min((loadedCount / totalFrames) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 mt-2">
              {loadedCount} / {totalFrames} Frames Buffered
            </span>
          </div>
        )}

        {/* Top Header & Cyberster Branding */}
        <header className="absolute top-0 inset-x-0 z-30 px-6 sm:px-12 pt-6 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="text-red-500 font-extrabold tracking-widest text-xs uppercase px-2.5 py-1 border border-red-500/40 rounded-md bg-neutral-950/80 backdrop-blur-md">
              MG
            </span>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-widest text-white font-montserrat drop-shadow-lg">
                CYBERSTER
              </h1>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest hidden sm:block">
                Cinematic 4-Act Roadster Journey
              </p>
            </div>
          </div>

          {/* Act Badge & Live Frame Telemetry */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex items-center gap-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-800/90 rounded-full px-4 py-1.5 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-neutral-200">
                ACT {activeBeat.id} / 4
              </span>
              <div className="h-3 w-px bg-neutral-700" />
              <span className="text-xs font-mono font-bold text-red-500 min-w-[3ch] text-right">
                {displayPercent}%
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Storytelling Text Overlay (Synced to current Beat) */}
        <div className="absolute left-6 sm:left-14 top-24 sm:top-28 z-20 pointer-events-none max-w-lg transition-all duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur text-red-400 text-[11px] font-mono tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {activeBeat.tagline}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none drop-shadow-2xl">
            {activeBeat.headline}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed drop-shadow-md">
            {activeBeat.description}
          </p>

          {/* <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-950/60 backdrop-blur px-3 py-1.5 rounded-lg border border-neutral-800/80 w-fit">
            <span className="text-red-500">TELEMETRY:</span>
            <span>{activeBeat.telemetry}</span>
          </div> */}
        </div>

        {/* Bottom Cinema Dashboard & Navigation */}
        <footer className="absolute bottom-0 inset-x-0 z-30 px-6 sm:px-12 pb-6 flex flex-col items-center gap-3 pointer-events-none">
          {/* Scroll Cue Guidance */}
          {/* <div className="pointer-events-auto flex items-center gap-2 text-xs font-medium text-neutral-200 bg-neutral-950/80 border border-neutral-800/80 px-5 py-2 rounded-full backdrop-blur-md shadow-2xl">
            <svg
              className={`w-3.5 h-3.5 text-red-500 transition-transform duration-300 ${displayPercent > 90 ? 'rotate-180' : 'animate-bounce'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>
              {displayPercent >= 98
                ? 'Scroll up to exit cockpit • Full immersion reached'
                : displayPercent <= 4
                  ? 'Scroll down to initiate scissor doors & dive into cockpit'
                  : 'Keep scrolling to advance camera journey • Reverse on scroll up'}
            </span>
          </div> */}

          {/* Interactive 4-Act Stepper & Scrub Bar */}
          {/* <div className="pointer-events-auto w-full max-w-2xl bg-neutral-950/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2">
              <span className="text-white font-bold">
                FRAME {String(currentFrameIndex + 1).padStart(3, '0')} / {totalFrames}
              </span>
              <span className="text-red-500 font-bold uppercase">
                {activeBeat.name}
              </span>
            </div>

            <div className="relative w-full h-2 bg-neutral-900 rounded-full overflow-hidden mb-3.5 border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full shadow-[0_0_14px_rgba(220,38,38,0.8)] transition-all duration-75"
                style={{ width: `${Math.max(displayPercent, 2)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {BEATS.map((beat) => {
                const isSelected = activeBeat.id === beat.id;

                return (
                  <button
                    key={beat.id}
                    onClick={() => scrollToBeat(beat)}
                    className={`group flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${isSelected
                      ? 'bg-neutral-900/90 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                      : 'bg-neutral-950/50 border-neutral-800/80 hover:border-neutral-700 text-neutral-500'
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'
                          }`}
                      />
                      <span
                        className={`text-[10px] font-mono font-bold tracking-wider ${isSelected ? 'text-white' : 'text-neutral-400'
                          }`}
                      >
                        ACT 0{beat.id}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest hidden sm:block truncate ${isSelected ? 'text-red-400 font-semibold' : 'text-neutral-500'
                        }`}
                    >
                      {beat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Quick Specifications Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-neutral-400 text-[11px] font-mono uppercase tracking-wider">
            <div>
              <span className="text-neutral-600">POWERTRAIN:</span>{' '}
              <span className="text-neutral-200">536 HP DUAL MOTOR</span>
            </div>
            <div>
              <span className="text-neutral-600">0-100 KM/H:</span>{' '}
              <span className="text-neutral-200">3.2 SEC</span>
            </div>
            <div>
              <span className="text-neutral-600">DOORS:</span>{' '}
              <span className="text-red-500 font-semibold">ELECTRIC SCISSOR</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-neutral-600">COCKPIT:</span>{' '}
              <span className="text-neutral-200">TRIPLE SCREEN WRAP-AROUND</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CybersterScroller;
