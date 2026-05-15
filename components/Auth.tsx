'use client';

import { useState } from 'react';
import { UserProfile } from '@/types/game';

export default function Auth({ onLogin }: { onLogin: (profile: UserProfile) => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Mock login instead of real API call
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mocking delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProfile: UserProfile = {
        id: 'mock-user-123',
        username: isSignUp ? (username || email.split('@')[0]) : 'Analista',
        mmr_analyst: 1200,
        mmr_player: 1000,
        currency_balance: 150
      };
      
      onLogin(mockProfile);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_50%_50%,_#111122_0%,_#050508_100%)] p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header styling like the template */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-[#0A0A12]">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="text-[12px] font-mono tracking-[0.3em] uppercase text-slate-400">Turing Protocol</h1>
          </div>
        </div>

        <form onSubmit={handleAuth} className="p-6 flex flex-col gap-5" suppressHydrationWarning>
           <div className="text-center mb-2">
             <h2 className="text-xl font-bold font-mono tracking-widest text-cyan-400 uppercase">
               {isSignUp ? 'Inicializar Conta' : 'Acesso ao Sistema'}
             </h2>
             <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-2">
               {isSignUp ? 'Registre-se para iniciar simulações' : 'Autentique-se para acessar o lobby'}
             </p>
           </div>
          
          {isSignUp && (
            <div className="space-y-1 relative" suppressHydrationWarning>
              <label htmlFor="username" className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">Apelido</label>
              <input
                id="username"
                placeholder="USUARIO_01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isSignUp}
                data-lpignore="true"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}
          
          <div className="space-y-1 relative" suppressHydrationWarning>
            <label htmlFor="email" className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="agente@sistema.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-lpignore="true"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          
          <div className="space-y-1 relative" suppressHydrationWarning>
            <label htmlFor="password" className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">Senha de Acesso</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-lpignore="true"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit" 
              className="bg-cyan-500 text-black px-4 py-3 rounded text-xs font-bold uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processando...' : isSignUp ? 'Registrar' : 'Autenticar'}
            </button>
            <button
              type="button"
              className="w-full text-slate-500 hover:text-cyan-400 hover:bg-slate-900/50 py-2 rounded text-[10px] uppercase font-bold transition-colors"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Já possui acesso? Conectar' : "Requisitar nova credencial"}
            </button>
          </div>
        </form>

        <div className="h-8 px-6 flex items-center justify-between bg-black border-t border-slate-800">
          <div className="text-[10px] font-mono text-slate-500">MOCK_MODE: <span className="text-yellow-500 uppercase">ACTIVE</span></div>
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
