'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Briefcase, Globe } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/language-context';
import { useState } from 'react';

interface RoleSelectionProps {
  onSelectRole: (role: 'buyer' | 'provider') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-500/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-24 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setLanguage('tr')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              language === 'tr'
                ? 'bg-orange-400 text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Türkçe
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-orange-400 text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            English
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl font-bold text-orange-400 mb-2">W</div>
          <h1 className="text-4xl font-bold mb-2">Wanted.pi</h1>
          <p className="text-green-400">Web3 Service Marketplace</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          <Card className="p-6 border-orange-400/40 bg-zinc-950/50 cursor-pointer hover:border-orange-400/70 transition-colors" onClick={() => onSelectRole('buyer')}>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-4 rounded-lg">
                <Users className="text-green-400" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white">{t.serviceBuyer}</h3>
                <p className="text-sm text-zinc-400">{t.findTrustedProfessionals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-orange-400/40 bg-zinc-950/50 cursor-pointer hover:border-orange-400/70 transition-colors" onClick={() => onSelectRole('provider')}>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-4 rounded-lg">
                <Briefcase className="text-green-400" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white">{t.serviceProvider}</h3>
                <p className="text-sm text-zinc-400">{t.submitOffersForJobs}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-500 text-center mt-8">
          {t.canSwitchRoles}
        </p>
      </div>
    </div>
  );
}
