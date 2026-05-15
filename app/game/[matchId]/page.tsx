'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage, MatchParticipant } from '@/types/game';
import { motion, AnimatePresence } from 'motion/react';
// We are skipping the shadcn Select/Dialog and building simple native/tailwind UI to avoid errors.

export default function GameRoom({ params }: { params: Promise<{ matchId: string }> }) {
  const matchId = use(params).matchId;
  const router = useRouter();
  
  // Mock User
  const [myParticipant, setMyParticipant] = useState<MatchParticipant>({
    id: 'mock-1',
    match_id: matchId,
    user_id: 'user-123',
    role: 'interlocutor',
    color: 'red',
    secret_mission: 'A', // Human
    characters_used: 0,
  });

  const [aiParticipant] = useState<MatchParticipant>({
    id: 'mock-2',
    match_id: matchId,
    user_id: null,
    role: 'interlocutor',
    color: 'blue',
    secret_mission: 'B', // AI
    characters_used: 0,
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [verdictPhase, setVerdictPhase] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [verdictBlue, setVerdictBlue] = useState<'human' | 'ai'>('human');
  const [verdictRed, setVerdictRed] = useState<'human' | 'ai'>('human');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Intro message
  useEffect(() => {
    setMessages([
      {
        id: 'sys-1',
        match_id: matchId,
        sender_color: 'system' as any,
        content: 'SISTEMA: Conexão neural estabelecida. Iniciando testes Turing.',
        created_at: new Date().toISOString()
      }
    ]);
  }, [matchId]);

  // Timer
  useEffect(() => {
    if (verdictPhase || matchEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setVerdictPhase(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [verdictPhase, matchEnded]);

  // Cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const triggerAIMessage = async (history: ChatMessage[]) => {
    setTimeout(async () => {
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: history.filter(h => h.sender_color !== 'system' as any).map(h => ({
              role: h.sender_color === aiParticipant.color ? 'model' : 'user',
              parts: [{ text: `${h.sender_color.toUpperCase()}: ${h.content}` }]
            })).slice(-10),
            prompt: "Continue the conversation naturally in Portuguese, try to act human.",
            color: aiParticipant.color,
            secret_mission: aiParticipant.secret_mission
          })
        });

        const data = await response.json();
        if (data.text) {
           const msg: ChatMessage = {
              id: Date.now().toString(),
              match_id: matchId,
              sender_color: aiParticipant.color!,
              content: data.text,
              created_at: new Date().toISOString()
           };
           setMessages(prev => [...prev, msg]);
           setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      } catch (e) {
        console.error("AI Error:", e);
      }
    }, 2000 + Math.random() * 3000);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || cooldown > 0 || verdictPhase || matchEnded) return;

    if (inputValue.length < 2 || inputValue.length > 150) {
        return;
    }

    const text = inputValue.trim();
    setInputValue('');
    setCooldown(3);

    const msg: ChatMessage = {
      id: Date.now().toString(),
      match_id: matchId,
      sender_color: myParticipant.color!,
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => {
        const newHistory = [...prev, msg];
        
        // As a player, wait for AI response
        if (myParticipant.role !== 'analyst') {
            triggerAIMessage(newHistory);
        }

        return newHistory;
    });
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const submitVerdict = () => {
      setVerdictPhase(false);
      setMatchEnded(true);
      setMessages(prev => [...prev, {
          id: Date.now().toString(), 
          match_id: matchId, 
          sender_color: 'system' as any, 
          content: 'SISTEMA: O Analista tomou sua decisão!', 
          created_at: new Date().toISOString()
      }]);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-screen bg-[#050508] text-slate-100 font-sans flex flex-col overflow-hidden">
        {/* Header / Game Status */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-800 bg-[#0A0A12]">
            <div className="flex items-center gap-4 hidden md:flex">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h1 className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">ID Sessão: GT-{matchId.slice(0, 4).toUpperCase()}</h1>
            </div>
            
            <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Temporizador Global</span>
                    <span className={`text-2xl font-mono font-bold leading-none ${timeLeft <= 30 && !matchEnded ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                        {matchEnded ? '00:00' : formatTime(timeLeft)}
                    </span>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Papel</div>
                    <div className={`text-sm font-bold uppercase tracking-widest ${myParticipant.role === 'analyst' ? 'text-yellow-400' : myParticipant.color === 'blue' ? 'text-cyan-400' : 'text-red-500'}`}>
                        {myParticipant.role === 'analyst' ? 'O ANALISTA' : `JOGADOR ${myParticipant.color?.toUpperCase()}`}
                    </div>
                </div>
                
                {myParticipant.role === 'interlocutor' && (
                  <>
                     <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
                     <div className="text-right hidden md:block">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">Diretriz</div>
                        <div className={`text-sm font-bold uppercase tracking-widest ${myParticipant.secret_mission === 'A' ? 'text-blue-400' : 'text-purple-400'}`}>
                            AJA COMO {myParticipant.secret_mission === 'A' ? 'HUMANO' : 'IA'}
                        </div>
                     </div>
                  </>
                )}
            </div>
        </header>

        {/* Main Gameplay Arena */}
        <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 bg-[radial-gradient(circle_at_50%_50%,_#111122_0%,_#050508_100%)] overflow-hidden relative">
            
            {/* Player 1: BLUE (Left sidebar on lg screens) */}
            <div className="hidden lg:flex w-64 flex-col gap-4">
                <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center gap-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-2 border-cyan-400 p-1">
                            <div className="w-full h-full rounded-full bg-cyan-900/20 flex flex-col items-center justify-center overflow-hidden">
                                <svg className="w-12 h-12 text-cyan-400 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-[10px] font-bold px-2 py-1 rounded text-black uppercase">Azul</div>
                    </div>
                </div>
            </div>

            {/* CENTRAL CHAT TERMINAL */}
            <div className="flex-1 flex flex-col bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm min-h-0">
                {/* Chat Feed */}
                <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-4 font-mono">
                    <AnimatePresence initial={false}>
                        {messages.map((m) => {
                            const isSystem = m.sender_color === 'system' as any;
                            const isAnalyst = m.sender_color === 'analyst';
                            const isBlue = m.sender_color === 'blue';
                            const isRed = m.sender_color === 'red';

                            if (isSystem) {
                                return (
                                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center my-2">
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{m.content}</span>
                                    </motion.div>
                                );
                            }

                            return (
                                <motion.div 
                                    key={m.id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className={`text-xs font-bold shrink-0 ${isAnalyst ? 'text-yellow-400' : isBlue ? 'text-cyan-400' : 'text-red-500'}`}>
                                        [{m.sender_color === 'analyst' ? 'Analista' : m.sender_color === 'blue' ? 'Azul' : 'Vermelho'}]
                                    </div>
                                    <div className={`text-slate-100 text-xs px-3 py-2 rounded-lg max-w-[85%] leading-relaxed ${isAnalyst ? 'bg-slate-800/80' : isBlue ? 'bg-cyan-900/20 border border-cyan-500/20' : 'bg-red-900/20 border border-red-500/20'}`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                </div>

                {/* Chat Input Area */}
                {!matchEnded && !verdictPhase && (
                    <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                        <form onSubmit={sendMessage} className="relative flex items-center">
                            <textarea 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as unknown as React.FormEvent); } }}
                                maxLength={150}
                                disabled={cooldown > 0}
                                onPaste={(e) => { e.preventDefault(); alert('Colar conteúdo foi desativado por segurança.'); }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pr-24 text-sm font-mono text-slate-300 resize-none h-16 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                                placeholder={cooldown > 0 ? `SYS_WAIT (${cooldown}s)...` : "Digite a transmissão..."}
                            ></textarea>
                            <div className="absolute right-3 flex items-center gap-3">
                                {myParticipant.role !== 'analyst' && (
                                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{inputValue.length}/150 chars</span>
                                )}
                                <button 
                                    type="submit"
                                    disabled={cooldown > 0 || !inputValue.trim()}
                                    className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:shadow-none ${myParticipant.role === 'analyst' ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : myParticipant.color === 'blue' ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-red-500 hover:bg-red-400 text-black shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}
                                >
                                    Tx
                                </button>
                            </div>
                        </form>
                        <div className="mt-3 flex justify-between items-center px-1">
                            <div className="text-[10px] font-mono text-slate-500">
                                {myParticipant.role !== 'analyst' && "Dica: Respostas curtas parecem mais 'humanas'."}
                            </div>
                            <div className="text-[10px] font-mono text-yellow-500">
                                ESTADO DO SISTEMA: {cooldown > 0 ? 'RESFRIANDO TRANSFORMAÇÃO' : 'PRONTO'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Player 2: RED (Right sidebar on lg screens) */}
            <div className="hidden lg:flex w-64 flex-col gap-4">
                <div className="bg-slate-900/50 border border-red-500/30 rounded-xl p-4 flex flex-col items-center gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-2 border-red-500 p-1">
                            <div className="w-full h-full rounded-full bg-red-900/20 flex flex-col items-center justify-center overflow-hidden">
                                <svg className="w-12 h-12 text-red-500 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-red-500 text-[10px] font-bold px-2 py-1 rounded text-black uppercase">Vermelho</div>
                    </div>
                </div>
            </div>

            {/* Mock Modals (Replacement for shadcn dialog to avoid errors) */}
            {verdictPhase && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#050508] border-slate-800 border-2 rounded-xl text-white w-full max-w-md p-6 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                        <div className="mb-6">
                            <h2 className="text-2xl font-mono text-yellow-400 tracking-widest">TEMPO ESGOTADO</h2>
                            <p className="text-slate-400 font-mono text-xs mt-2">
                                Sistema bloqueado. As identidades devem ser inseridas.
                            </p>
                        </div>
                        
                        {myParticipant.role === 'analyst' ? (
                            <div className="space-y-6 pt-4 font-mono">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">Entidade [Azul]</label>
                                    <select 
                                        value={verdictBlue} 
                                        onChange={(e) => setVerdictBlue(e.target.value as any)}
                                        className="w-full bg-slate-900 border border-slate-700 text-cyan-400 font-bold uppercase rounded-sm h-10 px-3 outline-none"
                                    >
                                        <option value="human">Homo Sapiens (Humano)</option>
                                        <option value="ai">Constructo LLM (IA)</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-red-500 tracking-widest">Entidade [Vermelho]</label>
                                    <select 
                                        value={verdictRed} 
                                        onChange={(e) => setVerdictRed(e.target.value as any)}
                                        className="w-full bg-slate-900 border border-slate-700 text-red-500 font-bold uppercase rounded-sm h-10 px-3 outline-none"
                                    >
                                        <option value="human">Homo Sapiens (Humano)</option>
                                        <option value="ai">Constructo LLM (IA)</option>
                                    </select>
                                </div>
                                <button onClick={submitVerdict} className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-widest h-12 shadow-[0_0_15px_rgba(234,179,8,0.4)] rounded transition-colors">
                                    Finalizar Julgamento
                                </button>
                            </div>
                        ) : (
                            <button onClick={submitVerdict} className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-widest h-12 shadow-[0_0_15px_rgba(234,179,8,0.4)] rounded transition-colors">
                                Avançar SIMULAÇÃO
                            </button>
                        )}
                    </div>
                </div>
            )}

            {matchEnded && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#050508] border-slate-800 border-2 rounded-xl text-white w-full max-w-lg p-6 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black font-mono text-slate-100 tracking-widest uppercase">Conclusão</h2>
                        </div>
                        
                        <div className="space-y-4 py-4 font-mono">
                            <div className="flex flex-col gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-cyan-400 uppercase font-bold">[AZUL] Natureza Real:</span>
                                    <span className="text-white">Constructo IA</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                    <span>Classificado Como:</span>
                                    <span className={verdictBlue === 'ai' ? 'text-green-500' : 'text-red-500'}>
                                        {verdictBlue?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-red-500 uppercase font-bold">[VERMELHO] Natureza Real:</span>
                                    <span className="text-white">Humano</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                    <span>Classificado Como:</span>
                                    <span className={verdictRed === 'human' ? 'text-green-500' : 'text-red-500'}>
                                        {verdictRed?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-6 text-center border-t border-slate-800">
                                <div className="text-green-500 text-lg uppercase font-bold tracking-widest leading-loose">
                                    Avaliação Completa<br/><span className="text-xs font-normal text-slate-400">+25 MMR SIMULADO</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => router.push('/')} className="w-full mt-6 bg-slate-800 hover:bg-cyan-900/50 text-cyan-400 uppercase text-xs font-bold tracking-widest h-12 border border-slate-700 font-mono rounded transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            Retornar ao Lobby
                        </button>
                    </div>
                </div>
            )}
        </main>

        {/* Footer / System Console */}
        <footer className="h-10 px-4 md:px-8 flex items-center justify-between bg-black border-t border-slate-800">
            <div className="flex gap-4 md:gap-6">
                <div className="text-[10px] font-mono text-slate-500 hidden sm:block">PROTOCOLO: <span className="text-slate-300 italic uppercase">Turing-Web-2</span></div>
                <div className="text-[10px] font-mono text-slate-500">CRIPTOGRAFIA: <span className="text-cyan-500 uppercase">AES-256-GCM</span></div>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-[10px] font-mono text-green-500 tracking-widest uppercase hidden sm:block">Conexão Estável</span>
            </div>
        </footer>
    </div>
  );
}
