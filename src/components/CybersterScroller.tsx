import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_FRAMES, BEATS, BeatInfo } from '../utils/frameLoader';

// --- Tuning Knobs ---
const SCROLL_HEIGHT_VH = 900;     // Higher = slower, more cinematic scrub (was 520)
const DAMPING_SPEED = 6.5;        // Lower = heavier camera inertia (try 4.5 - 8.0)
const ENABLE_FRAME_BLEND = true;  // Crossfades between frame N and N+1 for silky motion
const CONCURRENT_LOADS = 6;       // Prevents network congestion during preload
const INITIAL_READY_FRAMES = 30;  // Frames decoded before dismissing splash screen

type FrameSource = ImageBitmap | HTMLImageElement;

function getSourceDimensions(src: FrameSource) {
  if (typeof ImageBitmap !== 'undefined' && src instanceof ImageBitmap) {
    return { width: src.width, height: src.height };
  }
  const img = src as HTMLImageElement;
  return { width: img.naturalWidth, height: img.naturalHeight };
}

export const CybersterScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);

  // Decoded frames cached in GPU/RAM
  const framesRef = useRef<(FrameSource | null)[]>(
    new Array(ALL_FRAMES.length).fill(null)
  );

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [activeBeat, setActiveBeat] = useState<BeatInfo>(BEATS[0]);

  // Animation loop refs (zero React re-renders during scroll)
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const lastDrawnFrameFloat = useRef<number>(-1);
  const lastBeatId = useRef<number>(BEATS[0].id);
  const lastPercent = useRef<number>(-1);
  const animFrameId = useRef<number | null>(null);

  const totalFrames = ALL_FRAMES.length; // 108

  // Find exact frame, or fall back to nearest loaded frame to prevent "buffering" freezes
  const getBestFrame = useCallback((index: number): FrameSource | null => {
    const frames = framesRef.current;
    if (frames[index]) return frames[index];

    for (let offset = 1; offset < totalFrames; offset++) {
      if (index - offset >= 0 && frames[index - offset]) return frames[index - offset];
      if (index + offset < totalFrames && frames[index + offset]) return frames[index + offset];
    }
    return null;
  }, [totalFrames]);

  // Draw a single source with "cover" math
  const drawSourceCover = (
    ctx: CanvasRenderingContext2D,
    src: FrameSource,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const { width: imgWidth, height: imgHeight } = getSourceDimensions(src);
    if (!imgWidth || !imgHeight) return;

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const renderWidth = imgWidth * scale;
    const renderHeight = imgHeight * scale;
    const offsetX = (canvasWidth - renderWidth) / 2;
    const offsetY = (canvasHeight - renderHeight) / 2;

    ctx.drawImage(src, offsetX, offsetY, renderWidth, renderHeight);
  };

  // High-DPI Canvas Renderer with optional sub-frame crossfade
  const drawFrame = useCallback(
    (exactFrame: number) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const clamped = Math.min(Math.max(exactFrame, 0), totalFrames - 1);
      const baseIdx = Math.floor(clamped);
      const nextIdx = Math.min(baseIdx + 1, totalFrames - 1);
      const blendAlpha = clamped - baseIdx;

      const baseFrame = getBestFrame(baseIdx);
      if (!baseFrame) return;

      const { width, height } = canvas;

      ctx.globalAlpha = 1;
      drawSourceCover(ctx, baseFrame, width, height);

      // Subtle sub-frame crossfade eliminates discrete stepping at slow scroll speeds
      if (ENABLE_FRAME_BLEND && blendAlpha > 0.02 && nextIdx !== baseIdx) {
        const nextFrame = framesRef.current[nextIdx];
        if (nextFrame) {
          ctx.globalAlpha = blendAlpha;
          drawSourceCover(ctx, nextFrame, width, height);
          ctx.globalAlpha = 1;
        }
      }

      lastDrawnFrameFloat.current = clamped;
    },
    [getBestFrame, totalFrames]
  );

  // 1. Preload & Decode all frames ONCE using a controlled worker queue
  useEffect(() => {
    let cancelled = false;
    let nextIndex = 0;
    let completed = 0;
    let readyTriggered = false;

    const loadSingleFrame = async (idx: number) => {
      try {
        const res = await fetch(ALL_FRAMES[idx]);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();

        if (cancelled) return;

        let source: FrameSource;
        if (typeof createImageBitmap === 'function') {
          // Decodes image off the main thread — prevents scroll stutter
          source = await createImageBitmap(blob);
        } else {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await img.decode();
          source = img;
        }

        if (cancelled) {
          if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
            source.close();
          }
          return;
        }

        framesRef.current[idx] = source;

        // Immediately paint frame 0 as soon as it arrives
        if (idx === 0 && lastDrawnFrameFloat.current < 0) {
          drawFrame(0);
        }
      } catch {
        // Fallback to standard Image element if fetch/createImageBitmap fails
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.src = ALL_FRAMES[idx];
          img.onload = () => {
            if (!cancelled) framesRef.current[idx] = img;
            resolve();
          };
          img.onerror = () => resolve();
        });
      } finally {
        if (!cancelled) {
          completed += 1;

          // Only update React loading bar while splash screen is visible
          if (!readyTriggered) {
            setLoadedCount(completed);
            if (completed >= Math.min(INITIAL_READY_FRAMES, totalFrames)) {
              readyTriggered = true;
              setIsInitialReady(true);
            }
          }
        }
      }
    };

    const worker = async () => {
      while (!cancelled && nextIndex < totalFrames) {
        const current = nextIndex++;
        await loadSingleFrame(current);
      }
    };

    const workers = Array.from(
      { length: Math.min(CONCURRENT_LOADS, totalFrames) },
      () => worker()
    );
    Promise.all(workers);

    return () => {
      cancelled = true;
      framesRef.current.forEach((src) => {
        if (typeof ImageBitmap !== 'undefined' && src instanceof ImageBitmap) {
          src.close();
        }
      });
      framesRef.current = new Array(totalFrames).fill(null);
    };
  }, [drawFrame, totalFrames]);

  // 2. Canvas initialization & DPR resize handling
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      // alpha: false tells the browser the canvas is opaque (faster compositing)
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const targetW = Math.floor(window.innerWidth * dpr);
    const targetH = Math.floor(window.innerHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      if (ctxRef.current) {
        ctxRef.current.imageSmoothingEnabled = true;
        ctxRef.current.imageSmoothingQuality = 'high';
      }
    }

    if (lastDrawnFrameFloat.current >= 0) {
      drawFrame(lastDrawnFrameFloat.current);
    } else {
      drawFrame(0);
    }
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // 3. Delta-Time Damped Render Loop (consistent speed on 60Hz, 90Hz, 120Hz+)
  useEffect(() => {
    let running = true;
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      if (!running) return;

      // Clamp dt so tab-switching doesn't cause a huge jump
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.00005) {
        const factor = 1 - Math.exp(-DAMPING_SPEED * dt);
        currentProgress.current += diff * factor;
      } else {
        currentProgress.current = targetProgress.current;
      }

      const progress = Math.min(Math.max(currentProgress.current, 0), 1);
      const exactFrame = progress * (totalFrames - 1);

      // Only repaint when movement is visually noticeable
      const threshold = ENABLE_FRAME_BLEND ? 0.015 : 0.5;
      const shouldRedraw = ENABLE_FRAME_BLEND
        ? Math.abs(exactFrame - lastDrawnFrameFloat.current) >= threshold
        : Math.round(exactFrame) !== Math.round(lastDrawnFrameFloat.current);

      if (shouldRedraw) {
        drawFrame(ENABLE_FRAME_BLEND ? exactFrame : Math.round(exactFrame));

        // Update percentage directly in the DOM (no React re-render)
        const pct = Math.round(progress * 100);
        if (pct !== lastPercent.current && percentTextRef.current) {
          lastPercent.current = pct;
          percentTextRef.current.textContent = `${pct}%`;
        }

        // Only trigger React state when crossing into a new Act (4 times total)
        const frameIdx = Math.round(exactFrame);
        const foundBeat =
          BEATS.find((b) => frameIdx >= b.startFrame && frameIdx <= b.endFrame) ||
          BEATS[0];

        if (foundBeat.id !== lastBeatId.current) {
          lastBeatId.current = foundBeat.id;
          setActiveBeat(foundBeat);
        }
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [drawFrame, totalFrames]);

  // 4. Passive Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
      targetProgress.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* Sticky Fullscreen Cinematic Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ willChange: 'transform' }}
        />

        {/* Ambient Cinema Vignette & Gradients */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
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
                style={{
                  width: `${Math.min((loadedCount / INITIAL_READY_FRAMES) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 mt-2">
              {loadedCount} / {INITIAL_READY_FRAMES} Keyframes Ready
            </span>
          </div>
        )}

        {/* Top Header (offset below fixed nav in index.tsx) */}
        <header className="absolute top-16 inset-x-0 z-30 px-6 sm:px-12 pt-4 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="text-red-500 font-extrabold tracking-widest text-xs uppercase px-2.5 py-1 border border-red-500/40 rounded-md bg-neutral-950/80">
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

          {/* Act Badge & Live Percentage */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex items-center gap-3 bg-neutral-950/85 border border-neutral-800/90 rounded-full px-4 py-1.5 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              <span className="text-xs font-bold tracking-wider text-neutral-200">
                ACT {activeBeat.id} / 4
              </span>
              <div className="h-3 w-px bg-neutral-700" />
              <span
                ref={percentTextRef}
                className="text-xs font-mono font-bold text-red-500 min-w-[3ch] text-right"
              >
                0%
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Storytelling Text Overlay */}
        <div className="absolute left-6 sm:left-14 top-36 sm:top-40 z-20 pointer-events-none max-w-lg transition-all duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/60 text-red-400 text-[11px] font-mono tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {activeBeat.tagline}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none drop-shadow-2xl">
            {activeBeat.headline}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed drop-shadow-md">
            {activeBeat.description}
          </p>
        </div>

        {/* Bottom Specs Strip */}
        <footer className="absolute bottom-0 inset-x-0 z-30 px-6 sm:px-12 pb-6 flex flex-col items-center gap-3 pointer-events-none">
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