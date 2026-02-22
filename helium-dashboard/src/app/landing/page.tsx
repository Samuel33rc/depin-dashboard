'use client';

import { useState } from 'react';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ff6b35]/10 border border-[#ff6b35]/30 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse"></span>
            <span className="text-xs text-[#ff6b35] uppercase tracking-widest">DePIN Operations Center</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-[#ff6b35]">//</span> Stop Managing Your DePINs Manually
          </h1>
          
          <p className="text-xl text-[#666] max-w-2xl mx-auto">
            The first unified dashboard for Helium + DIMO. Track rewards, monitor hotspots, 
            and get alerts — all in one place.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-[#111] border border-[#333] p-8 rounded-xl">
            <h3 className="text-lg font-bold text-[#ff4444] mb-4">❌ The Old Way</h3>
            <ul className="space-y-3 text-[#666]">
              <li className="flex items-center gap-2">
                <span>✕</span> Check 3 different websites for prices
              </li>
              <li className="flex items-center gap-2">
                <span>✕</span> Manually update spreadsheets
              </li>
              <li className="flex items-center gap-2">
                <span>✕</span> No alerts when hotspots go offline
              </li>
              <li className="flex items-center gap-2">
                <span>✕</span> Check each wallet separately
              </li>
              <li className="flex items-center gap-2">
                <span>✕</span> 32% still use Excel spreadsheets
              </li>
            </ul>
          </div>

          <div className="bg-[#111] border border-[#00d4aa]/50 p-8 rounded-xl">
            <h3 className="text-lg font-bold text-[#00d4aa] mb-4">✓ The New Way</h3>
            <ul className="space-y-3 text-[#e5e5e5]">
              <li className="flex items-center gap-2">
                <span className="text-[#00d4aa]">✓</span> Unified view of all DePINs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00d4aa]">✓</span> Real-time prices + wallet balances
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00d4aa]">✓</span> Telegram alerts for offline hotspots
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00d4aa]">✓</span> Auto-refresh every 5 minutes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00d4aa]">✓</span> Historical tracking & CSV export
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-20">
          <a
            href="https://depin-dashboard.vercel.app"
            className="inline-block bg-[#ff6b35] hover:bg-[#ff8555] text-black font-bold text-lg py-4 px-12 rounded-lg transition-colors"
          >
            Try the Demo →
          </a>
          <p className="text-[#444] text-sm mt-4">No signup required • Free to use</p>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-[#ff6b35]">//</span> Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-[#333] p-8 rounded-xl text-center">
              <h3 className="text-lg font-bold text-[#e5e5e5] mb-2">Free</h3>
              <p className="text-4xl font-bold text-[#e5e5e5] mb-6">$0</p>
              <ul className="text-left space-y-2 text-sm text-[#666] mb-8">
                <li>✓ Real-time prices</li>
                <li>✓ Wallet balance check</li>
                <li>✓ Hotspot status</li>
                <li>✓ Manual refresh</li>
                <li>✓ Telegram alerts</li>
              </ul>
              <a
                href="https://depin-dashboard.vercel.app"
                className="block w-full border border-[#333] text-[#666] py-2 rounded-lg hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors"
              >
                Get Started
              </a>
            </div>

            <div className="bg-gradient-to-b from-[#ff6b35]/20 to-[#111] border border-[#ff6b35] p-8 rounded-xl text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ff6b35] text-black text-xs font-bold px-4 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-lg font-bold text-[#ff6b35] mb-2">Pro</h3>
              <p className="text-4xl font-bold text-[#e5e5e5] mb-6">$9<span className="text-sm text-[#666]">/mo</span></p>
              <ul className="text-left space-y-2 text-sm text-[#e5e5e5] mb-8">
                <li>✓ Everything in Free</li>
                <li>✓ <strong>Unlimited history</strong></li>
                <li>✓ <strong>Auto-refresh</strong></li>
                <li>✓ <strong>Email notifications</strong></li>
                <li>✓ CSV export</li>
                <li>✓ Priority support</li>
              </ul>
              <button
                className="block w-full bg-[#ff6b35] hover:bg-[#ff8555] text-black font-bold py-2 rounded-lg transition-colors"
              >
                Coming Soon
              </button>
            </div>

            <div className="bg-[#111] border border-[#333] p-8 rounded-xl text-center">
              <h3 className="text-lg font-bold text-[#a78bfa] mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-[#e5e5e5] mb-6">Custom</p>
              <ul className="text-left space-y-2 text-sm text-[#666] mb-8">
                <li>✓ Everything in Pro</li>
                <li>✓ Multi-user access</li>
                <li>✓ Custom integrations</li>
                <li>✓ White-label</li>
                <li>✓ Dedicated support</li>
              </ul>
              <button
                className="block w-full border border-[#333] text-[#666] py-2 rounded-lg hover:border-[#a78bfa] hover:text-[#a78bfa] transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-[#ff6b35]">//</span> Join the Waitlist
          </h2>
          
          <div className="max-w-md mx-auto">
            {submitted ? (
              <div className="bg-[#00d4aa]/10 border border-[#00d4aa]/30 p-6 rounded-xl text-center">
                <p className="text-[#00d4aa] font-bold">You're on the list!</p>
                <p className="text-[#666] text-sm mt-2">We'll notify you when Pro features launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#333] px-6 py-4 rounded-xl text-[#e5e5e5] placeholder-[#444] focus:outline-none focus:border-[#ff6b35] text-center"
                />
                <button
                  type="submit"
                  className="w-full bg-[#ff6b35] hover:bg-[#ff8555] text-black font-bold py-4 rounded-xl transition-colors"
                >
                  Join Waitlist
                </button>
              </form>
            )}
            <p className="text-[#444] text-xs text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <footer className="text-center text-[#333] text-sm">
          <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p className="mt-4">DePIN Dashboard © 2026</p>
          <p className="mt-2 text-[#222]">
            Built for DePIN operators, by DePIN operators
          </p>
        </footer>
      </div>
    </div>
  );
}
