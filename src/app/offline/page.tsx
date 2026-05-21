'use client';

import { useRouter } from 'next/navigation';
import { AlertOctagon, RefreshCw, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#030712] text-slate-100 overflow-hidden font-mono px-4 select-none">
      {/* Grade de fundo cibernética */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Efeito de Scanline de monitor antigo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40" />

      {/* Brilho vermelho de fundo */}
      <div className="absolute h-[300px] w-[300px] rounded-full bg-red-950/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* Ícone de sinal offline */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-950/30 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-8"
        >
          <WifiOff className="h-10 w-10 text-red-500" />
        </motion.div>

        {/* Título Principal */}
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-[0.25em] text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)] mb-2">
          Conexão Neural Rompida
        </h1>
        
        <div className="text-[10px] text-red-400/80 uppercase tracking-widest mb-8 border-y border-red-950/50 py-1 bg-red-950/10">
          Falha Crítica nos Provedores de IA
        </div>

        {/* Texto Informativo */}
        <div className="space-y-4 text-slate-400 text-sm leading-relaxed mb-8">
          <p>
            Não foi possível estabelecer contato estável com as entidades neurais da simulação. 
            Os provedores de IA estão fora do ar ou sobrecarregados.
          </p>
          
          {/* Card de Segurança de Rank */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded border border-red-950/50 bg-red-950/10 p-4 text-left text-xs text-red-300/90"
          >
            <AlertOctagon className="h-5 w-5 shrink-0 text-red-500" />
            <div>
              <span className="font-bold uppercase tracking-wider block mb-1">Salvaguarda Ativada</span>
              Esta partida foi finalizada graciosamente. Seus Pontos de Rank (PDR) e MMR não sofreram alterações ou penalidades.
            </div>
          </motion.div>
        </div>

        {/* Botão de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(239,68,68,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="w-full sm:w-auto px-8 py-3 rounded border border-red-500/40 bg-red-950/20 font-bold uppercase tracking-widest text-xs text-red-400 transition-colors duration-200 hover:bg-red-500 hover:text-black cursor-pointer"
          >
            Retornar ao Saguão
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/game/mock-match-123')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Tentar Novamente
          </motion.button>
        </div>
      </motion.div>

      {/* Rodapé técnico */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[8px] text-slate-600 uppercase tracking-widest pointer-events-none">
        <span>Protocolo: Turing-Offline-Guard</span>
        <span>Código: 503_INDISPONIBILIDADE_IA</span>
      </div>
    </div>
  );
}
