// Auto-load and sort all 108 WebP frames across the 4 cinematic beats

// Beat 1: Exterior Front (24 frames)
const beat1Glob = import.meta.glob<{ default: string }>(
  '../assets/segment/beat1_exterior_front/*.webp',
  { eager: true }
);

// Beat 2: Orbital Sweep (30 frames)
const beat2Glob = import.meta.glob<{ default: string }>(
  '../assets/segment/beat2_orbital_sweep/*.webp',
  { eager: true }
);

// Beat 3: Aerial Rise (24 frames)
const beat3Glob = import.meta.glob<{ default: string }>(
  '../assets/segment/beat3_aerial_rise/*.webp',
  { eager: true }
);

// Beat 4: Cockpit Dive (30 frames)
const beat4Glob = import.meta.glob<{ default: string }>(
  '../assets/segment/beat4_cockpit_dive/*.webp',
  { eager: true }
);

const extractSortedUrls = (globObj: Record<string, { default: string }>): string[] => {
  return Object.keys(globObj)
    .sort()
    .map((key) => globObj[key].default);
};

export const BEAT_1_FRAMES = extractSortedUrls(beat1Glob);
export const BEAT_2_FRAMES = extractSortedUrls(beat2Glob);
export const BEAT_3_FRAMES = extractSortedUrls(beat3Glob);
export const BEAT_4_FRAMES = extractSortedUrls(beat4Glob);

export const ALL_FRAMES: string[] = [
  ...BEAT_1_FRAMES,
  ...BEAT_2_FRAMES,
  ...BEAT_3_FRAMES,
  ...BEAT_4_FRAMES,
];

export interface BeatInfo {
  id: number;
  name: string;
  tagline: string;
  headline: string;
  description: string;
  telemetry: string;
  startFrame: number;
  endFrame: number;
}

export const BEATS: BeatInfo[] = [
  {
    id: 1,
    name: 'EXTERIOR FRONT',
    tagline: 'ACT I • AERODYNAMIC STANCE',
    headline: 'ELECTRIC ROADSTER SPIRIT',
    description: 'Electric frameless scissor doors elevate into full wingspan clearance.',
    telemetry: '0° ➔ 65° Scissor Kinematics • Front View',
    startFrame: 0,
    endFrame: 23, // 24 frames (0..23)
  },
  {
    id: 2,
    name: 'ORBITAL SWEEP',
    tagline: 'ACT II • 360° TURNTABLE SWEEP',
    headline: 'RADICAL SUPERCAR PROFILE',
    description: 'Sweeping clockwise to the right-hand drive profile, revealing sculpted side contours.',
    telemetry: 'Right Profile Arc • 536 HP Dual Motor',
    startFrame: 24,
    endFrame: 53, // 30 frames (24..53)
  },
  {
    id: 3,
    name: 'AERIAL RISE',
    tagline: 'ACT III • BIRD\'S-EYE ELEVATION',
    headline: 'OPEN-TOP ARCHITECTURE',
    description: 'Ascending over the rear haunches to showcase the exposed convertible roadster cockpit.',
    telemetry: 'Overhead Vantage • Soft-Top Convertible Deck',
    startFrame: 54,
    endFrame: 77, // 24 frames (54..77)
  },
  {
    id: 4,
    name: 'COCKPIT DIVE',
    tagline: 'ACT IV • IMMERSIVE INTERIOR POV',
    headline: 'ENTER THE COMMAND CENTER',
    description: 'Diving between the sports bucket seats into the driver-centric wrap-around digital cockpit.',
    telemetry: 'Interior Center POV • Triple-Screen Driver Display',
    startFrame: 78,
    endFrame: 107, // 30 frames (78..107)
  },
];
