import React, { useState } from 'react';

interface Colorway {
  id: string;
  name: string;
  category: string;
  hex: string;
  description: string;
}

const COLORWAYS: Colorway[] = [
  {
    id: 'red',
    name: 'Dynamic Red',
    category: 'Heritage Supercar Metallic',
    hex: '#D91424',
    description: 'Deep racing crimson with high-gloss metallic flake that accentuates the electric roadster muscular haunches.',
  },
  {
    id: 'grey',
    name: 'Camden Grey',
    category: 'Matte Stealth Satin',
    hex: '#4A4E54',
    description: 'Understated British architectural satin finish engineered to absorb and sculpt ambient city light reflections.',
  },
  {
    id: 'yellow',
    name: 'Inca Yellow',
    category: 'High-Voltage Electric Solid',
    hex: '#F5B700',
    description: 'Radical electric yellow paying tribute to legendary European hillclimb and endurance racing liveries.',
  },
  {
    id: 'white',
    name: 'English White',
    category: 'Pearl Coat Metallic',
    hex: '#EDEDED',
    description: 'Classic British roadster pearl white paired with contrasting black aerodynamic ground effect splitters.',
  },
  {
    id: 'andes',
    name: 'Andes Grey',
    category: 'Deep Obsidian Metallic',
    hex: '#23272A',
    description: 'Subtle charcoal graphite with micro-fine silver particles, delivering an imposing stealth silhouette.',
  },
];

export const CybersterStudio: React.FC = () => {
  const [activeColor, setActiveColor] = useState<Colorway>(COLORWAYS[0]);
  const [roofColor, setRoofColor] = useState<'black' | 'red'>('black');

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-24 border-t border-neutral-900">
      {/* Studio Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-red-500 bg-red-950/40 border border-red-900/50 px-3 py-1 rounded-full">
          Bespoke Atelier • Exterior Styling
        </span>
        <h2 className="text-3xl sm:text-5xl font-black uppercase mt-4 tracking-tight text-white font-montserrat">
          Personalization & Colorway Studio
        </h2>
        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          Inspired by classic British racing pedigree and cyberpunk aesthetics, configure the Cyberster with custom tailored body paints and electric folding fabric soft-tops.
        </p>
      </div>

      {/* Colorway & Roof Interactive Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-950/80 border border-neutral-800/90 rounded-3xl p-8 sm:p-12 shadow-2xl mb-24">
        {/* Left: Selected Color Palette Visual */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[300px] sm:min-h-[380px] rounded-2xl bg-gradient-to-b from-neutral-900/50 to-neutral-950/80 border border-neutral-800 p-8 overflow-hidden">
          {/* Dynamic Background Ambient Reflection */}
          <div
            className="absolute inset-0 opacity-20 blur-[90px] transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: activeColor.hex }}
          />

          {/* Colorway Display Badge */}
          <div className="relative z-10 text-center">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] mx-auto mb-6 transition-all duration-500 scale-100 hover:scale-105"
              style={{
                backgroundColor: activeColor.hex,
                boxShadow: `0 0 35px ${activeColor.hex}40`,
              }}
            />

            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              {activeColor.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-montserrat mt-1">
              {activeColor.name}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
              {activeColor.description}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-neutral-300 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-700/60">
              <span>Soft-Top Hood:</span>
              <span className="text-red-400 font-bold uppercase">{roofColor} Fabric</span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Swatches */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          {/* Exterior Color Swatches */}
          <div className="mb-8">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-4">
              1. Choose Exterior Body Colorway:
            </label>

            <div className="grid grid-cols-5 gap-3">
              {COLORWAYS.map((c) => {
                const isSelected = activeColor.id === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveColor(c)}
                    className={`group flex flex-col items-center gap-2 p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-red-600 bg-neutral-900 shadow-[0_0_15px_rgba(220,38,38,0.3)] scale-105'
                        : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-white/20 transition-transform group-hover:scale-110 shadow-md"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[9px] font-mono text-neutral-400 truncate w-full text-center">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roof Options */}
          <div className="mb-8">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-4">
              2. Electric Convertible Soft-Top (Opens in 10s at up to 50 km/h):
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRoofColor('black')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  roofColor === 'black'
                    ? 'border-red-600 bg-neutral-900/90 shadow-md ring-1 ring-red-600/40'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-600 shadow-inner" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white uppercase">Obsidian Black</div>
                  <div className="text-[10px] font-mono text-neutral-500">Triple-Layer Acoustic Fabric</div>
                </div>
              </button>

              <button
                onClick={() => setRoofColor('red')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  roofColor === 'red'
                    ? 'border-red-600 bg-neutral-900/90 shadow-md ring-1 ring-red-600/40'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-red-800 border border-red-500 shadow-inner" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white uppercase">Crimson Red</div>
                  <div className="text-[10px] font-mono text-neutral-500">Heritage British Red Fabric</div>
                </div>
              </button>
            </div>
          </div>

          {/* Scissor Door Actuation Spec */}
          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-neutral-500">DOOR SYSTEM:</span>{' '}
              <span className="text-white font-bold">FRAMELESS SCISSOR (30° - 76°)</span>
            </div>
            <span className="text-emerald-400 font-semibold">DUAL RADAR SENSORS</span>
          </div>
        </div>
      </div>

      {/* Heritage & Marco Fainello F1 Engineering Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-neutral-950 via-neutral-900/40 to-neutral-950 border border-neutral-800/80 rounded-3xl p-8 sm:p-14 mb-24">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/30 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Formula 1 Pedigree
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-montserrat tracking-tight leading-tight">
            Chassis Dynamics by Marco Fainello
          </h3>

          <p className="text-sm text-neutral-300 mt-4 leading-relaxed">
            To ensure the Cyberster drives like a true thoroughbred sports car, MG partnered with{' '}
            <strong className="text-white">Marco Fainello</strong>, the legendary vehicle dynamics and aerodynamics lead behind Michael Schumacher’s historic Ferrari Formula 1 world championships.
          </p>

          <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
            The chassis features a near-perfect <strong className="text-white">50:50 axle weight balance</strong>, independent double-wishbone front suspension, multi-link rear, and high-performance Brembo 4-piston monobloc brakes for laser-sharp turn-in precision.
          </p>

          {/* Engineering Highlights */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-800/80">
            <div>
              <div className="text-2xl font-black text-white font-montserrat">50 : 50</div>
              <div className="text-[10px] font-mono uppercase text-neutral-500 mt-1">Weight Distribution</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-montserrat">BREMBO</div>
              <div className="text-[10px] font-mono uppercase text-neutral-500 mt-1">4-Piston Calipers</div>
            </div>
            <div>
              <div className="text-2xl font-black text-red-500 font-montserrat">490 mm</div>
              <div className="text-[10px] font-mono uppercase text-neutral-500 mt-1">Ultra-Low Center of Gravity</div>
            </div>
          </div>
        </div>

        {/* Heritage Timeline Pill Box */}
        <div className="lg:col-span-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 border-b border-neutral-800 pb-2">
            100 Years of Roadster Heritage
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-start gap-3">
              <span className="text-red-500 font-bold">1924</span>
              <div>
                <strong className="text-white">MG 14/28 Super Sports</strong>
                <p className="text-neutral-400 text-[11px] mt-0.5">The first ever sports car carrying the iconic MG octagon badge.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-red-500 font-bold">1962</span>
              <div>
                <strong className="text-white">The Legendary MGB Roadster</strong>
                <p className="text-neutral-400 text-[11px] mt-0.5">Became the world’s best-selling two-seater convertible for decades.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-red-500 font-bold">2024+</span>
              <div>
                <strong className="text-white">MG Cyberster EV</strong>
                <p className="text-neutral-400 text-[11px] mt-0.5">The world’s first mass-production electric roadster with scissor doors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Data Comparison Matrix (Porsche / BMW M Level Data Sheet) */}
      <div id="specs-matrix" className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
              Engineering Specification Matrix
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-montserrat mt-1">
              Technical Comparison Sheet
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-500 hidden sm:block">
            *Certified under WLTP / India Homologation
          </span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-950/60 shadow-2xl">
          <table className="w-full text-left text-sm font-mono">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/70 text-xs uppercase tracking-wider text-neutral-300">
                <th className="py-4 px-6">Specification Parameter</th>
                <th className="py-4 px-6 text-white font-bold">Cyberster Trophy (RWD)</th>
                <th className="py-4 px-6 text-red-400 font-bold">Cyberster GT (AWD Flagship)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Powertrain Configuration</td>
                <td className="py-3.5 px-6 text-white">Single Permanent Magnet Rear Motor</td>
                <td className="py-3.5 px-6 text-white font-semibold">Dual Electric Motors (Front + Rear)</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Total System Power</td>
                <td className="py-3.5 px-6 text-white">335 HP (250 kW)</td>
                <td className="py-3.5 px-6 text-red-400 font-bold">536 HP (400 kW)</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Instant Peak Torque</td>
                <td className="py-3.5 px-6 text-white">475 Nm</td>
                <td className="py-3.5 px-6 text-red-400 font-bold">725 Nm</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">0 - 100 km/h Sprint</td>
                <td className="py-3.5 px-6 text-white">5.0 seconds</td>
                <td className="py-3.5 px-6 text-red-400 font-bold">3.2 seconds</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Top Speed</td>
                <td className="py-3.5 px-6 text-white">195 km/h</td>
                <td className="py-3.5 px-6 text-white font-semibold">200 km/h (Governed)</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Battery Capacity</td>
                <td className="py-3.5 px-6 text-white">77 kWh Ultra-thin Rubik's Cube</td>
                <td className="py-3.5 px-6 text-white font-semibold">77 kWh Ultra-thin Rubik's Cube</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Driving Range (WLTP)</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">508 km</td>
                <td className="py-3.5 px-6 text-white">444 km (Combined)</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Fast Charging (10% to 80%)</td>
                <td className="py-3.5 px-6 text-white">Approx 38 mins (150 kW DC)</td>
                <td className="py-3.5 px-6 text-white">Approx 38 mins (150 kW DC)</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Dimensions (L × W × H)</td>
                <td className="py-3.5 px-6 text-white">4,535 × 1,913 × 1,329 mm</td>
                <td className="py-3.5 px-6 text-white">4,535 × 1,913 × 1,329 mm</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Scissor Doors Actuation</td>
                <td className="py-3.5 px-6 text-white">Electric Power with Dual Radar Safety</td>
                <td className="py-3.5 px-6 text-white">Electric Power with Dual Radar Safety</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Cockpit Computing</td>
                <td className="py-3.5 px-6 text-white">Qualcomm Snapdragon 8155 Triple Display</td>
                <td className="py-3.5 px-6 text-white">Qualcomm Snapdragon 8155 Triple Display</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 text-neutral-400">Audio System</td>
                <td className="py-3.5 px-6 text-white">Bose 8-Speaker with Headrest Drivers</td>
                <td className="py-3.5 px-6 text-white">Bose 8-Speaker with Headrest Drivers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CybersterStudio;
