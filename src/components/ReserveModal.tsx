import React, { useState } from 'react';
import MGLogo from './MGLogo';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVariant?: string;
  defaultCity?: string;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  onClose,
  defaultVariant = 'Cyberster GT Dual Motor AWD',
  defaultCity = 'New Delhi',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [variant, setVariant] = useState(defaultVariant);
  const [city, setCity] = useState(defaultCity);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-red-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <MGLogo className="h-6 sm:h-7 w-auto" glow />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold block">
                  MG SELECT CONCIERGE
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase text-white font-montserrat">
                  Reserve Exclusive Allocation
                </h3>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-mono">
              Be among the first in India to experience the 536 HP electric roadster with scissor doors. Your local MG Select Concierge will contact you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                    Preferred Variant:
                  </label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-red-600 font-mono cursor-pointer"
                  >
                    <option value="Cyberster GT Dual Motor AWD">GT Dual Motor AWD (536 HP)</option>
                    <option value="Cyberster Trophy RWD">Trophy Single Motor RWD (335 HP)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                    Tier-1 City Delivery:
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2"
                >
                  <span>Submit Priority Allocation Request</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>

              <p className="text-[10px] text-neutral-500 text-center leading-relaxed font-mono">
                By submitting, you agree to receive communications from authorized MG Select Luxury Dealership partners in India.
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-2">
              ALLOCATION REQUEST RECEIVED
            </span>

            <h3 className="text-2xl font-black uppercase text-white font-montserrat">
              Welcome to the MG Cyberster Circle
            </h3>

            <p className="text-sm text-neutral-300 max-w-md mx-auto mt-3 leading-relaxed">
              Thank you, <strong className="text-white">{name}</strong>. Your priority reservation for the <strong className="text-red-400">{variant}</strong> in <strong className="text-white">{city}</strong> has been logged with the MG Select Luxury Concierge desk.
            </p>

            <div className="mt-8">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold uppercase tracking-widest rounded-full transition-all"
              >
                Close & Return to Showcase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReserveModal;
