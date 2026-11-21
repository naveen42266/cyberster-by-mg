import React from 'react';
import CybersterScroller from '../components/CybersterScroller';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-montserrat selection:bg-red-600 selection:text-white">
      {/* Sleek Minimalist Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-neutral-900/60 transition-all">
        <div className="w-full px-6 sm:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-600 font-extrabold tracking-wider text-xs border border-red-600/60 px-2 py-0.5 rounded bg-red-950/20">
              MG
            </span>
            <span className="font-bold tracking-widest text-base sm:text-lg">CYBERSTER</span>
            <span className="hidden sm:inline-block text-neutral-600 text-sm">|</span>
            <span className="hidden sm:inline-block text-xs font-mono text-neutral-400 uppercase tracking-widest">
              108-Frame Interactive Cinema
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono tracking-widest text-neutral-400">
            <a href="#cockpit-details" className="hover:text-red-500 transition-colors hidden sm:block">
              COCKPIT
            </a>
            <a href="#powertrain" className="hover:text-red-500 transition-colors">
              PERFORMANCE
            </a>
            <a href="#chassis" className="hover:text-red-500 transition-colors hidden md:block">
              CHASSIS
            </a>
          </div>
        </div>
      </nav>

      {/* Main Fullscreen 108-Frame 4-Act Cinema Scroller */}
      <main id="showcase">
        <CybersterScroller />
      </main>

      {/* Cockpit & Tech Showcase (Flows directly from Act IV Cockpit Dive) */}
      <section id="cockpit-details" className="relative py-28 px-6 sm:px-12 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 bg-red-950/40 border border-red-900/50 px-3 py-1 rounded-full">
              Driver Immersion
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase mt-4 tracking-tight">
              Wrap-Around Digital Cockpit
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
              Designed around the driver, the Cyberster cockpit seamlessly merges heritage sports car ergonomics with
              triple-screen digital command displays powered by Snapdragon processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-red-600/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-bold mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Triple Screen Cluster</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                A 10.25-inch central driver display flanked by dual 7-inch auxiliary screens provides all telemetry, navigation, and vehicle dynamics at a glance.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-red-600/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-bold mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sports Bucket Ergonomics</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Sculpted Y-shaped bucket seats with integrated headrests and high-grip lateral bolsters keep you planted through high-G cornering.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-red-600/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-bold mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bose 8-Speaker Audio</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Custom-tuned acoustic staging with headrest speakers preserves crystal-clear acoustic fidelity even with the soft-top convertible down.
              </p>
            </div>
          </div>

          {/* Powertrain & Performance Data Grid */}
          <div id="powertrain" className="mt-20 pt-16 border-t border-neutral-900 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-xl bg-neutral-900/20 border border-neutral-800/40">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">536 HP</div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2 font-mono">Dual Electric Motor</div>
            </div>
            <div className="p-6 rounded-xl bg-neutral-900/20 border border-neutral-800/40">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">3.2 SEC</div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2 font-mono">0-100 KM/H</div>
            </div>
            <div className="p-6 rounded-xl bg-neutral-900/20 border border-neutral-800/40">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">725 NM</div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2 font-mono">Instant Torque</div>
            </div>
            <div id="chassis" className="p-6 rounded-xl bg-neutral-900/20 border border-neutral-800/40">
              <div className="text-3xl sm:text-4xl font-extrabold text-red-500">F1 TUNED</div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2 font-mono">Chassis by Marco Fainello</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 sm:px-12 border-t border-neutral-900 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MG CYBERSTER</span>
            <span>• 108-Frame Cinematic Roadster Experience</span>
          </div>
          <div className="text-neutral-500">
            Scroll down to advance journey • Scroll up to reverse
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
