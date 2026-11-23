import React, { useState } from 'react';
import CybersterScroller from '../components/CybersterScroller';
import MGLogo from '../components/MGLogo';
import CybersterPricing from '../components/CybersterPricing';
import CybersterStudio from '../components/CybersterStudio';
import ReserveModal from '../components/ReserveModal';

const Home: React.FC = () => {
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState('Cyberster GT Dual Motor AWD');
  const [modalCity, setModalCity] = useState('New Delhi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenReserve = (variantName?: string, cityName?: string) => {
    if (variantName) setModalVariant(variantName);
    if (cityName) setModalCity(cityName);
    setIsReserveOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-montserrat selection:bg-red-600 selection:text-white">
      {/* 1. Flagship Luxury Top Navigation (BMW / Porsche / MG Select Caliber) */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Subtle top edge specular highlight line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="bg-black/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
            {/* Left: Official MG Select Brandmark & Model Lineage */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#showcase" className="group flex items-center gap-3 sm:gap-4">
                <MGLogo className="h-6 sm:h-7 md:h-8 w-auto hover:opacity-90 transition-opacity" glow />
                <div className="h-5 w-[1px] bg-white/20 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="font-montserrat font-extrabold tracking-[0.22em] text-sm sm:text-base text-neutral-100 group-hover:text-white transition-colors uppercase">
                    CYBERSTER
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase hidden md:block">
                    Pure Electric Roadster
                  </span>
                </div>
              </a>
            </div>

            {/* Center: Luxury Floating Glass Capsule Navigation */}
            <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-white/[0.08] backdrop-blur-md shadow-inner text-[11px] font-mono tracking-[0.16em] uppercase text-neutral-400">
              {/* <a
                href="#showcase"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Cinema 360°
              </a> */}
              <a
                href="#pricing-section"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Variants & Pricing
              </a>
              <a
                href="#studio-section"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Atelier Studio
              </a>
              <a
                href="#cockpit-details"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Cockpit
              </a>
              <a
                href="#specs-matrix"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Data Sheet
              </a>
            </nav>

            {/* Right: Pricing Teaser & Reserve Allocation CTA */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden xl:flex flex-col items-end text-right">
                <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase">Ex-Showroom India</span>
                <span className="text-xs font-mono font-bold tracking-wider text-neutral-200">FROM ₹65.00 LAKH*</span>
              </div>

              <button
                onClick={() => handleOpenReserve()}
                className="relative group px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-[11px] tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.65)] border border-red-500/40 flex items-center gap-2.5 active:scale-95"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Reserve </span>
                {/* Allocation */}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                aria-label="Toggle navigation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden px-6 py-6 bg-neutral-950/95 border-t border-neutral-800/80 backdrop-blur-2xl flex flex-col gap-4 text-xs font-mono tracking-widest uppercase">
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-300 hover:text-red-500 border-b border-neutral-900"
              >
                Cinema 360°
              </a>
              <a
                href="#pricing-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-300 hover:text-red-500 border-b border-neutral-900"
              >
                Variants & Pricing
              </a>
              <a
                href="#studio-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-300 hover:text-red-500 border-b border-neutral-900"
              >
                Atelier Studio
              </a>
              <a
                href="#cockpit-details"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-300 hover:text-red-500 border-b border-neutral-900"
              >
                Cockpit Command
              </a>
              <a
                href="#specs-matrix"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-300 hover:text-red-500"
              >
                Data Sheet
              </a>
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Fullscreen 108-Frame 4-Act Cinema Scroller */}
      <main id="showcase">
        <CybersterScroller />
      </main>

      {/* 4. India Tier-1 City Pricing & Variants Estimator */}
      <section id="pricing-section" className="relative bg-black">
        <CybersterPricing onReserveClick={handleOpenReserve} />
      </section>

      {/* 5. Colorway Atelier, Heritage Timeline & F1 Pedigree */}
      <section id="studio-section" className="relative bg-neutral-950/50">
        <CybersterStudio />
      </section>

      {/* 6. Cockpit & Driver Immersion Showcase */}
      <section id="cockpit-details" className="relative py-28 px-6 sm:px-12 bg-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 bg-red-950/40 border border-red-900/50 px-3 py-1 rounded-full font-bold">
              Driver-Centric Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase mt-4 tracking-tight text-white font-montserrat">
              The Wrap-Around Command Center
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
              Designed around the driver, the Cyberster cockpit seamlessly merges heritage British sports car ergonomics with
              triple-screen digital command displays powered by Snapdragon processing and Bose acoustic engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase font-montserrat">Triple Screen Display</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-mono">
                A 10.25-inch high-definition central instrument cluster flanked by dual 7-inch auxiliary touchscreens provides all driving dynamics, battery telemetry, and infotainment at a glance.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase font-montserrat">Snapdragon 8155 Chipset</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-mono">
                Powered by a 7nm automotive Qualcomm Snapdragon 8155 processor delivering instantaneous 60 FPS graphics rendering, Unreal Engine 3D vehicle state visualizers, and seamless voice AI.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase font-montserrat">Bose Headrest Acoustics</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-mono">
                Custom Bose 8-speaker audio system engineered specifically for roadster aerodynamics, incorporating dual headrest drivers for crystal-clear fidelity even with the convertible soft-top down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MG Select Luxury Retail Experience (India Tier-1 Network) */}
      <section className="relative py-24 px-6 sm:px-12 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 bg-gradient-to-r from-neutral-900/80 via-neutral-950 to-neutral-900/60 border border-neutral-800 rounded-3xl p-8 sm:p-14 shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <MGLogo className="h-7 sm:h-8 w-auto" glow />
              <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
                MG SELECT LUXURY CHANNEL
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-white font-montserrat tracking-tight leading-tight">
              Bespoke Showroom Lounges Across Tier-1 India
            </h3>
            <p className="text-sm text-neutral-300 mt-4 leading-relaxed font-mono">
              The Cyberster is distributed exclusively through <strong className="text-white">MG Select</strong>, an elite luxury retail network featuring private configuration suites, bespoke atelier delivery bays, and dedicated roadster concierge concierges in Mumbai, New Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Ahmedabad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => handleOpenReserve()}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2"
            >
              <span>Connect with MG Select</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Flagship Luxury Footer */}
      <footer className="py-16 px-6 sm:px-12 border-t border-neutral-900 bg-black text-neutral-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 pb-12 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <MGLogo className="h-6 sm:h-7 w-auto" />
              <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
              <div>
                <span className="text-base font-bold text-white tracking-widest uppercase font-montserrat block">
                  CYBERSTER
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  JSW MG Motor India • MG Select Luxury Division
                </span>
              </div>
            </div>
            <p className="max-w-md text-[11px] leading-relaxed text-neutral-400">
              Conceived at the Advanced Design Studio in Marylebone, London, UK. Engineered with F1 chassis dynamics by Marco Fainello. The world's first all-electric roadster with frameless scissor doors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-white font-bold uppercase text-[11px] tracking-wider mb-3">Model</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#showcase" className="hover:text-red-500 transition-colors">Cinema 360°</a></li>
                <li><a href="#pricing-section" className="hover:text-red-500 transition-colors">Trophy RWD</a></li>
                <li><a href="#pricing-section" className="hover:text-red-500 transition-colors">GT AWD (3.2s)</a></li>
                <li><a href="#studio-section" className="hover:text-red-500 transition-colors">Colorway Atelier</a></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold uppercase text-[11px] tracking-wider mb-3">MG Select Hubs</div>
              <ul className="space-y-2 text-[11px]">
                <li><span className="hover:text-neutral-300">Mumbai (BKC)</span></li>
                <li><span className="hover:text-neutral-300">New Delhi (CP)</span></li>
                <li><span className="hover:text-neutral-300">Bengaluru (Indiranagar)</span></li>
                <li><span className="hover:text-neutral-300">Hyderabad (Jubilee Hills)</span></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold uppercase text-[11px] tracking-wider mb-3">Engineering</div>
              <ul className="space-y-2 text-[11px]">
                <li><span className="hover:text-neutral-300">Marco Fainello Dynamics</span></li>
                <li><span className="hover:text-neutral-300">Brembo Monobloc</span></li>
                <li><span className="hover:text-neutral-300">77 kWh Rubik's Cube</span></li>
                <li><span className="hover:text-neutral-300">Dual Radar Clearance</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} MG Motor India / JSW MG Motor. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <span>Credits go to <strong className="text-neutral-300">MG Motor</strong></span>
            <span className="text-neutral-700">•</span>
            <span className="text-neutral-400">
              Designed & Developed by <strong className="text-white hover:text-red-500 transition-colors">Naveen</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* VIP Concierge Reservation Modal */}
      <ReserveModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
        defaultVariant={modalVariant}
        defaultCity={modalCity}
      />
    </div>
  );
};

export default Home;
