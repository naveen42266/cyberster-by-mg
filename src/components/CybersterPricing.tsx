import React, { useState } from 'react';

export interface CityPricing {
  id: string;
  name: string;
  state: string;
  rtoPercent: number; // percentage or fixed EV fee
  rtoFixed: number;
  evWaiverNote: string;
  showroomName: string;
}

export const TIER_1_CITIES: CityPricing[] = [
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'Delhi NCR',
    rtoPercent: 0,
    rtoFixed: 15500,
    evWaiverNote: '100% Road Tax Exemption under Delhi EV Policy',
    showroomName: 'MG Select Flagship, Connaught Place & Gurgaon',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    rtoPercent: 0,
    rtoFixed: 22500,
    evWaiverNote: 'Zero Motor Vehicle Tax on EVs in Maharashtra',
    showroomName: 'MG Select Boutique, BKC & Worli',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    rtoPercent: 0.04,
    rtoFixed: 32000,
    evWaiverNote: 'Concessional 4% EV Road Tax & Green Cess',
    showroomName: 'MG Select Experience Center, Indiranagar',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    rtoPercent: 0,
    rtoFixed: 18500,
    evWaiverNote: '100% Road Tax Waiver for EVs registered in Telangana',
    showroomName: 'MG Select Studio, Jubilee Hills',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    rtoPercent: 0,
    rtoFixed: 21000,
    evWaiverNote: '100% Road Tax Exemption on Battery Electric Vehicles',
    showroomName: 'MG Select Lounge, Nungambakkam',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    rtoPercent: 0,
    rtoFixed: 17500,
    evWaiverNote: '100% Exemption on Road Tax & Registration Fees',
    showroomName: 'MG Select Center, Park Street',
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    rtoPercent: 0,
    rtoFixed: 22000,
    evWaiverNote: 'Zero Motor Vehicle Tax on EVs in Maharashtra',
    showroomName: 'MG Select Hub, Koregaon Park',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    rtoPercent: 0.015,
    rtoFixed: 12000,
    evWaiverNote: 'Concessional State EV Registration Policy',
    showroomName: 'MG Select Gallery, SG Highway',
  },
];

export interface Variant {
  id: 'trophy' | 'gt';
  name: string;
  badge: string;
  drivetrain: string;
  power: string;
  torque: string;
  acceleration: string;
  range: string;
  topSpeed: string;
  battery: string;
  exShowroom: number;
}

export const VARIANTS: Variant[] = [
  {
    id: 'trophy',
    name: 'Cyberster Trophy RWD',
    badge: 'Single Motor • Pure Rear-Wheel Drive',
    drivetrain: 'Permanent Magnet Synchronous Rear Motor',
    power: '335 HP (250 kW)',
    torque: '475 Nm',
    acceleration: '5.0 sec',
    range: '508 km (WLTP)',
    topSpeed: '195 km/h',
    battery: '77 kWh Rubik\'s Cube Battery',
    exShowroom: 6500000, // ₹65.00 Lakh
  },
  {
    id: 'gt',
    name: 'Cyberster GT Dual Motor AWD',
    badge: 'Dual Motor • All-Wheel Drive Flagship',
    drivetrain: 'Twin Electric Motors with Smart Dynamic Torque Vectoring',
    power: '536 HP (400 kW)',
    torque: '725 Nm',
    acceleration: '3.2 sec',
    range: '444 km (WLTP) • ~500 km City',
    topSpeed: '200 km/h',
    battery: '77 kWh Rubik\'s Cube Battery',
    exShowroom: 7250000, // ₹72.50 Lakh
  },
];

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CybersterPricing: React.FC<{ onReserveClick?: (variant: string, city: string) => void }> = ({
  onReserveClick,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(VARIANTS[1]); // Default GT
  const [selectedCity, setSelectedCity] = useState<CityPricing>(TIER_1_CITIES[0]); // Default Delhi

  // Calculate pricing breakdown
  const exShowroom = selectedVariant.exShowroom;
  const rtoTax = Math.round(exShowroom * selectedCity.rtoPercent + selectedCity.rtoFixed);
  const insurance = Math.round(exShowroom * 0.034); // ~3.4% comprehensive luxury EV insurance
  const tcs = Math.round(exShowroom * 0.01); // 1% TCS
  const fastagAndHandling = 6500;
  const onRoadPrice = exShowroom + rtoTax + insurance + tcs + fastagAndHandling;

  // Estimated Monthly EMI (8.5% interest, 5 years, 20% down payment)
  const principal = onRoadPrice * 0.8;
  const monthlyRate = 0.085 / 12;
  const months = 60;
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-neutral-900 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase text-red-500 font-bold">
              MG SELECT EXCLUSIVE PRICING • INDIA TIER-1
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-montserrat">
            Variants & On-Road Estimator
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl">
            Select your preferred powertrain configuration and Tier-1 Indian city to view ex-showroom and state-specific on-road investment estimates.
          </p>
        </div>

        {/* City Selector Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Select Delivery City:
          </label>
          <div className="relative">
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = TIER_1_CITIES.find((c) => c.id === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="appearance-none bg-neutral-900/90 text-white border border-neutral-700/80 rounded-xl px-4 py-3 pr-10 text-sm font-semibold tracking-wide focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 cursor-pointer shadow-xl"
            >
              {TIER_1_CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-neutral-950 text-white">
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick City Pills (Horizontal Scroller) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-hidden">
        <span className="text-[11px] font-mono uppercase text-neutral-500 whitespace-nowrap mr-2">
          Popular Cities:
        </span>
        {TIER_1_CITIES.map((c) => {
          const isSelected = selectedCity.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.5)]'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Variant Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {VARIANTS.map((variant) => {
          const isSelected = selectedVariant.id === variant.id;

          return (
            <div
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`relative cursor-pointer rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.25)] ring-1 ring-red-600/50'
                  : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/30'
              }`}
            >
              {/* Highlight ribbon for GT */}
              {variant.id === 'gt' && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                  FLAGSHIP 3.2s
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-white bg-red-600 ring-2 ring-red-600/60'
                        : 'border-neutral-600 bg-transparent'
                    }`}
                  />
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                    {variant.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase font-montserrat mt-1">
                  {variant.name}
                </h3>

                <p className="text-xs text-neutral-400 mt-1 mb-6">{variant.drivetrain}</p>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-neutral-800/80 mb-6 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white font-montserrat">
                      {variant.acceleration}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">
                      0 - 100 km/h
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white font-montserrat">
                      {variant.power}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">
                      Peak Output
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-red-500 font-montserrat">
                      {variant.torque}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">
                      Max Torque
                    </div>
                  </div>
                </div>

                {/* Range & Battery */}
                <div className="flex items-center justify-between text-xs text-neutral-300 font-mono mb-4">
                  <span>Range: <strong className="text-white">{variant.range}</strong></span>
                  <span>Top Speed: <strong className="text-white">{variant.topSpeed}</strong></span>
                </div>
              </div>

              {/* Price footer inside card */}
              <div className="pt-4 border-t border-neutral-800/60 flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    Expected Ex-Showroom
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-montserrat">
                    {formatINR(variant.exShowroom)}*
                  </div>
                </div>

                <button
                  type="button"
                  className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:text-white'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed On-Road Price Breakdown Sheet */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-red-500 font-bold mb-1">
              ESTIMATED ON-ROAD BREAKDOWN • {selectedCity.name.toUpperCase()}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white uppercase font-montserrat">
              {selectedVariant.name}
            </h4>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-mono">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{selectedCity.evWaiverNote}</span>
            </p>
          </div>

          <div className="text-left md:text-right">
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
              Estimated On-Road Total
            </div>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-red-400 font-montserrat">
              {formatINR(onRoadPrice)}*
            </div>
            <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
              Est. EMI starting from <span className="text-white font-bold">{formatINR(emi)}/mo</span>
            </div>
          </div>
        </div>

        {/* Pricing Line Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-neutral-300 font-mono mb-8">
          <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">1. Ex-Showroom Base Price:</span>
            <span className="text-white font-bold">{formatINR(exShowroom)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">
              2. RTO Registration & Cess ({selectedCity.state}):
            </span>
            <span className="text-white font-bold">{formatINR(rtoTax)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">3. Zero-Dep Comprehensive Insurance:</span>
            <span className="text-white font-bold">{formatINR(insurance)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">4. TCS (1% Applicable Govt Tax):</span>
            <span className="text-white font-bold">{formatINR(tcs)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">5. Fastag & Handling Registration:</span>
            <span className="text-white font-bold">{formatINR(fastagAndHandling)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">Authorized Retail Partner:</span>
            <span className="text-red-400 text-xs font-semibold">{selectedCity.showroomName}</span>
          </div>
        </div>

        {/* Bottom Booking Action Strip */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xl">
            *Indicative pricing estimated for India launch via MG Select. Exact on-road pricing may vary based on chosen accessories, corporate vs individual registration, and insurance add-ons.
          </p>

          <button
            onClick={() => onReserveClick?.(selectedVariant.name, selectedCity.name)}
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3 shrink-0 group"
          >
            <span>Reserve {selectedVariant.name.split(' ')[1]} Allocation</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CybersterPricing;
