import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, ArrowRight, Lock, Globe } from 'lucide-react';
import { VorteqLogo } from '../common/VorteqLogo';

interface SplashScreenProps {
  onFinish: () => void;
  durationSeconds?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  durationSeconds = 4 
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalMs = durationSeconds * 1000;
    const intervalMs = 50;
    const step = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 200);
          return 100;
        }
        return prev + step;
      });
    }, intervalMs);

    const secondCountdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(secondCountdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(secondCountdown);
    };
  }, [durationSeconds, onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] text-[#0B192C] flex flex-col justify-between items-center p-6 select-none animate-fadeIn">
      {/* Background subtle ambient glow effect using Vorteq brand colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00B074]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0B192C]/5 rounded-full blur-3xl" />
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(#00B074 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>

      {/* Top Header: Security badge and Skip button */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#008A5B] bg-[#E6F7F0] border border-[#00B074]/40 px-3 py-1 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#00B074] animate-ping" />
          <span className="font-bold tracking-wider">VORTEQ SECURE CORE</span>
        </div>

        <button
          onClick={onFinish}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0B192C] bg-white hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-all cursor-pointer font-medium"
        >
          <span>Saltar ({secondsLeft}s)</span>
          <ArrowRight className="w-3 h-3 text-[#00B074]" />
        </button>
      </div>

      {/* Center: Hero Branding & Dynamic Holographic Vorteq Logo */}
      <div className="flex flex-col items-center text-center z-10 space-y-6 my-auto">
        <div className="relative">
          {/* Animated concentric rings */}
          <div className="absolute inset-0 -m-6 rounded-full border border-[#00B074]/20 animate-spin" style={{ animationDuration: '14s' }} />
          <div className="absolute inset-0 -m-10 rounded-full border border-[#00B074]/15 animate-ping" style={{ animationDuration: '3.5s' }} />

          {/* Central White Glass Card for High Contrast Logo Display */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-2 shadow-xl shadow-slate-200/60 flex items-center justify-center border-2 border-[#00B074]/30">
            <div className="w-full h-full bg-[#FAFAFA] rounded-[22px] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <VorteqLogo size="lg" variant="icon" theme="light" animated={true} />
            </div>
          </div>
        </div>

        <div className="space-y-2 max-w-xs">
          {/* Official Vorteq B2B Lockup */}
          <div className="flex items-baseline justify-center">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0B192C]">
              Vorteq
            </h1>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#00B074] ml-2 tracking-tight">
              B2B
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Plataforma institucional de comercio mayorista de electrónica. Cotizaciones Spot en vivo, custodia y arbitraje global.
          </p>
        </div>

        {/* Global Hubs active badges */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs font-semibold">
          <Globe className="w-3.5 h-3.5 text-[#00B074]" />
          <span>MIA ⇄ HKG ⇄ DXB ⇄ FRA ⇄ PTY</span>
        </div>
      </div>

      {/* Bottom Loading Progress Bar & Status */}
      <div className="w-full max-w-xs space-y-3 z-10 pb-4">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-600 flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-[#00B074] animate-bounce" />
            {progress < 40 
              ? 'Sincronizando Red Vorteq...' 
              : progress < 75 
              ? 'Cargando Cotizaciones Spot 24h...' 
              : 'Verificando Certificados B2B...'}
          </span>
          <span className="text-[#008A5B] font-bold tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Vorteq Emerald Progress Line */}
        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-[#0B192C] via-[#00B074] to-[#05D68E] rounded-full transition-all duration-75 shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
          <Lock className="w-3 h-3 text-[#00B074]" />
          <span>Conexión cifrada a la red mayorista Vorteq</span>
        </div>
      </div>
    </div>
  );
};
