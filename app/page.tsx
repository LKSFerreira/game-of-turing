'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/game';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

const PERFIL_LOCAL_POC: UserProfile = {
  id: 'local-poc-user',
  username: 'Analista Local',
  mmr_analyst: 1200,
  mmr_player: 1000,
  currency_balance: 150
};

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const profile = PERFIL_LOCAL_POC;

  const findMatch = () => {
    setIsSearching(true);
    // Mock navigating to a match
    setTimeout(() => {
      router.push(`/game/mock-match-123`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] bg-[radial-gradient(circle_at_50%_50%,_#111122_0%,_#050508_100%)] text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl grid md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="col-span-1 bg-[#0A0A12] border border-slate-800 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="flex items-center gap-2 text-xl font-bold font-mono tracking-widest text-cyan-400 uppercase">
              <User size={20} className="text-cyan-400" />
              {profile.username}
            </h2>
            <div className="mt-4 space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Patente Analista: <span className="text-white">{profile.mmr_analyst}</span></p>
              <p className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Patente Operador: <span className="text-white">{profile.mmr_player}</span></p>
            </div>
          </div>
          
          <div className="p-6 space-y-4 flex-1">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-md">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Créditos de Energia</span>
              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-[10px] rounded px-2 py-0.5 tracking-wider font-mono">
                ⚡ {profile.currency_balance}
              </span>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <div className="w-full rounded border border-cyan-500/20 bg-cyan-950/20 px-3 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-cyan-300">
              PoC local sem autenticação
            </div>
          </div>
        </div>

        {/* Main Action Area */}
        <div className="col-span-1 md:col-span-2 bg-[#0A0A12] border border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          <div className="z-10 flex flex-col items-center text-center space-y-6 max-w-md p-6">
            <h1 className="text-5xl font-black font-mono tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-slate-500 uppercase">
              Turing Protocol
            </h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Inicialize conexões para descobrir humanidade. Ou simule uma.
            </p>
            
            {isSearching ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="pt-8"
              >
                <div className="flex flex-col items-center gap-6 text-cyan-400">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-cyan-500/30 rounded-full animate-ping absolute inset-0" />
                    <div className="w-16 h-16 border-2 border-t-cyan-400 border-cyan-500/30 rounded-full animate-spin relative flex items-center justify-center">
                      <div className="w-8 h-8 bg-cyan-900/40 rounded-full" />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase">Estabelecendo rede neural...</span>
                </div>
              </motion.div>
            ) : (
              <button 
                onClick={findMatch} 
                className="mt-4 bg-slate-800 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-400 text-sm h-14 px-8 w-full font-bold uppercase tracking-widest relative overflow-hidden transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded"
              >
                <span className="relative z-10 font-mono">INICIAR SIMULAÇÃO</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
