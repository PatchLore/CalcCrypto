'use client';

import Link from 'next/link';
import { CALCULATORS, APP_CONFIG } from '@/lib/constants';

export default function Home() {
  const featuredCalculators = CALCULATORS.filter(calc => calc.featured);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-6xl w-full">
        {/* Hero Section with Glassmorphism */}
        <div 
          className="rounded-3xl shadow-2xl animate-fade-in text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '60px'
          }}
        >
          {/* Header Section */}
          <div className="mb-10">
            {/* Floating Bitcoin Icon */}
            <div className="inline-block mb-6 animate-float">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
                }}
              >
                ₿
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-black mb-10 leading-tight" style={{ color: '#ffffff' }}>
              Professional Crypto Calculators
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Calculate profits, losses, DCA strategies, staking rewards, and more with our comprehensive suite of cryptocurrency calculators.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center mb-10" style={{ gap: '20px' }}>
              <Link href="/calculators">
                <button 
                  className="px-10 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ 
                    background: '#ffffff', 
                    color: '#667eea' 
                  }}
                >
                  Get Started
                </button>
              </Link>
              <Link href="/calculators">
                <button 
                  className="px-10 py-4 font-bold text-lg rounded-xl border-2 hover:-translate-y-1 transition-all duration-300"
                  style={{ 
                    background: 'transparent', 
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  View All Calculators
                </button>
              </Link>
            </div>
          </div>

          {/* Calculator Cards Section */}
          <div className="calculator-grid">
            {featuredCalculators.slice(0, 3).map((calculator) => (
              <Link key={calculator.id} href={calculator.path} className="block">
                <div 
                  className="rounded-2xl border transition-all duration-300 cursor-pointer group h-full flex flex-col items-center justify-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '30px',
                    minHeight: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Emoji Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {calculator.icon}
                  </div>
                  
                  {/* Card Title */}
                  <h3 className="font-bold text-lg mb-3 text-center" style={{ color: '#ffffff' }}>
                    {calculator.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-center" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {calculator.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              ⚡
            </div>
            <h4 className="font-bold text-xl mb-3" style={{ color: '#ffffff' }}>Fast & Accurate</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Real-time calculations with precision down to the smallest decimal places.
            </p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              🔒
            </div>
            <h4 className="font-bold text-xl mb-3" style={{ color: '#ffffff' }}>Privacy First</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              All calculations are performed locally. Your data never leaves your device.
            </p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              📱
            </div>
            <h4 className="font-bold text-xl mb-3" style={{ color: '#ffffff' }}>Mobile Ready</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Responsive design that works perfectly on all devices and screen sizes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-2xl">₿</div>
            <span className="font-bold text-xl" style={{ color: '#ffffff' }}>{APP_CONFIG.name}</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © 2024 {APP_CONFIG.name}. Professional crypto calculators for traders and investors.
          </p>
        </footer>
      </div>
    </div>
  );
}
