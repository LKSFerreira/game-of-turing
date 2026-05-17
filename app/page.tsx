'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  BrainCircuit,
  Clock3,
  Cpu,
  Eye,
  FlaskConical,
  Lock,
  MessageSquareText,
  Play,
  Shield,
  Sparkles,
  Swords,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

import type { UserProfile } from '@/types/game';

type PreferenciaFila = 'flexivel' | 'deducao' | 'blefe';

const PERFIL_LOCAL_POC: UserProfile = {
  id: 'local-poc-user',
  username: 'Convidado',
  pdr_analyst: 0,
  pdr_player: 0,
  mmr_analyst: 1200,
  mmr_player: 1000,
  currency_balance: 150,
};

const MODOS_LOBBY = [
  {
    titulo: 'Partida local',
    descricao: 'Mesa de teste com preenchimento por IA.',
    ativo: true,
    icone: FlaskConical,
  },
  {
    titulo: 'Partida rápida',
    descricao: 'Fila com humanos e preenchimento por IA.',
    ativo: false,
    icone: Swords,
  },
  {
    titulo: 'Ranqueada',
    descricao: 'Progressão competitiva por PDR.',
    ativo: false,
    icone: BadgeCheck,
  },
  {
    titulo: 'Laboratório de IA',
    descricao: 'Comparação futura entre modelos.',
    ativo: false,
    icone: Cpu,
  },
];

const PREFERENCIAS: Array<{
  id: PreferenciaFila;
  titulo: string;
  descricao: string;
}> = [
  { id: 'flexivel', titulo: 'Qualquer função', descricao: 'Prioriza fechar a mesa' },
  { id: 'deducao', titulo: 'Preferir Analista', descricao: 'Você quer conduzir o veredito' },
  { id: 'blefe', titulo: 'Preferir Jogador', descricao: 'Você quer cumprir missão secreta' },
];

const REGRAS_CHAVE = [
  { texto: 'Sua função é sorteada no fechamento da mesa', icone: Users },
  { texto: 'Analista sempre será humano', icone: Shield },
  { texto: 'IA só preenche Azul ou Vermelho', icone: Cpu },
  { texto: 'Identidades ficam ocultas até a revelação', icone: Eye },
];

function PortalPareamento({
  buscando,
  onJogar,
}: {
  buscando: boolean;
  onJogar: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden [perspective:1200px]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Glows de fundo pulsantes */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.55, 0.25] }}
        className="absolute left-[62%] top-[28%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18)_0%,transparent_65%)] blur-3xl"
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
        className="absolute left-[62%] top-[28%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.12)_0%,transparent_60%)] blur-3xl"
        transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity, delay: 1.5 }}
      />

      {/* ÁTOMO QUÂNTICO */}
      <div className="absolute left-[62%] top-[28%] flex h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 items-center justify-center [transform-style:preserve-3d]">

        {/* Órbita 1 — Grande externa (Cyan, conic) */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(72deg) rotateY(15deg)' }}>
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            className="relative h-[650px] w-[650px] rounded-full border border-cyan-400/20 bg-[conic-gradient(from_0deg,transparent_20%,rgba(34,211,238,0.1)_40%,transparent_60%,rgba(34,211,238,0.06)_80%,transparent)] shadow-[0_0_60px_rgba(34,211,238,0.08)]"
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee,0_0_28px_#22d3ee,0_0_50px_rgba(34,211,238,0.4)]" />
              <div className="absolute top-1/2 left-1/2 h-1 w-12 -translate-x-[85%] -translate-y-1/2 rounded-full bg-gradient-to-l from-cyan-300/80 to-transparent blur-[1px]" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="h-3 w-3 rounded-full bg-cyan-300/80 shadow-[0_0_10px_#22d3ee,0_0_24px_#22d3ee]" />
              <div className="absolute top-1/2 left-1/2 h-1 w-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300/60 to-transparent blur-[1px]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita 2 — Fuchsia média (conic) */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(68deg) rotateY(-45deg)' }}>
          <motion.div
            animate={{ rotateZ: [360, 0] }}
            className="relative h-[540px] w-[540px] rounded-full border border-fuchsia-400/20 bg-[conic-gradient(from_180deg,transparent_15%,rgba(217,70,239,0.08)_35%,transparent_55%,rgba(217,70,239,0.05)_75%,transparent)] shadow-[0_0_50px_rgba(217,70,239,0.08)]"
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-3 w-3 rounded-full bg-fuchsia-300 shadow-[0_0_12px_#d946ef,0_0_28px_#d946ef,0_0_50px_rgba(217,70,239,0.4)]" />
              <div className="absolute top-1/2 left-1/2 h-1 w-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-300/70 to-transparent blur-[1px]" />
            </div>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
              <div className="h-2.5 w-2.5 rounded-full bg-fuchsia-300/70 shadow-[0_0_10px_#d946ef,0_0_20px_#d946ef]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita 3 — Cyan tracejada */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(78deg) rotateY(65deg)' }}>
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            className="relative h-[420px] w-[420px] rounded-full border border-dashed border-cyan-300/20 shadow-[0_0_30px_rgba(34,211,238,0.06)]"
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_10px_#a5f3fc,0_0_22px_#a5f3fc]" />
              <div className="absolute top-1/2 left-1/2 h-0.5 w-8 -translate-x-full -translate-y-1/2 rounded-full bg-gradient-to-l from-cyan-200/60 to-transparent blur-[1px]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita 4 — Fuchsia pontilhada */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(60deg) rotateY(-75deg)' }}>
          <motion.div
            animate={{ rotateZ: [360, 0] }}
            className="relative h-[580px] w-[580px] rounded-full border border-dotted border-fuchsia-500/15"
            transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-2 w-2 rounded-full bg-fuchsia-200/80 shadow-[0_0_8px_#f0abfc]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita 5 — Cyan grande opaca */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(82deg) rotateY(-30deg)' }}>
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            className="relative h-[600px] w-[600px] rounded-full border border-cyan-500/10"
            transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-2 w-2 rounded-full bg-cyan-400/60 shadow-[0_0_8px_#22d3ee]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita 6 — Fuchsia fina interna */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(70deg) rotateY(85deg)' }}>
          <motion.div
            animate={{ rotateZ: [360, 0] }}
            className="relative h-[350px] w-[350px] rounded-full border border-fuchsia-400/15"
            transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="h-2 w-2 rounded-full bg-fuchsia-300/70 shadow-[0_0_10px_#d946ef,0_0_20px_#d946ef]" />
              <div className="absolute top-1/2 left-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-300/50 to-transparent blur-[1px]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita 7 — Cyan rápida interna */}
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(75deg) rotateY(-60deg)' }}>
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            className="relative h-[300px] w-[300px] rounded-full border border-cyan-400/15"
            transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-200/80 shadow-[0_0_6px_#a5f3fc,0_0_14px_#a5f3fc]" />
            </div>
          </motion.div>
        </div>

        {/* Órbita de Aceleração (buscando) */}
        {buscando && (
          <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'rotateX(55deg) rotateY(-15deg)' }}>
            <motion.div
              animate={{ rotateZ: [360, 0] }}
              className="relative h-[280px] w-[280px] rounded-full border border-fuchsia-400/50"
              transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
            >
              <div className="absolute top-0 left-1/2 h-1.5 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent shadow-[0_0_20px_#d946ef] blur-[2px]" />
            </motion.div>
          </div>
        )}

        {/* Pulso do núcleo */}
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.1, 0.25, 0.1] }}
          className="absolute h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2)_0%,transparent_70%)]"
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
        />

        {/* NÚCLEO (Botão Central) */}
        <button
          className="pointer-events-auto group relative z-30 flex h-[130px] w-[130px] flex-col items-center justify-center rounded-full border border-cyan-400/50 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.08),#07131d_70%)] font-mono text-[11px] font-black uppercase tracking-[0.15em] text-cyan-50 shadow-[0_0_60px_rgba(34,211,238,0.25),inset_0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-md transition-all hover:scale-110 hover:border-cyan-300 hover:shadow-[0_0_100px_rgba(34,211,238,0.5)] disabled:cursor-wait disabled:opacity-80 [transform:translateZ(60px)]"
          disabled={buscando}
          onClick={onJogar}
          type="button"
        >
          {buscando ? (
            <motion.span
              animate={{ rotate: 360 }}
              className="mb-2 h-8 w-8 rounded-full border-2 border-cyan-200 border-t-transparent"
              transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
            />
          ) : (
            <Play className="mb-1 h-9 w-9 fill-transparent stroke-cyan-200 stroke-[1.5] transition-transform group-hover:scale-110 group-hover:fill-cyan-200/30" />
          )}
          <span className="mt-1 text-[10px]">{buscando ? 'Conectando' : 'Iniciar'}</span>
        </button>
      </div>
    </div>
  );
}

function BotaoModo({ modo }: { modo: (typeof MODOS_LOBBY)[number] }) {
  const Icone = modo.icone;

  return (
    <button
      className={`group flex w-full items-center gap-3 border-l-2 px-4 py-4 text-left transition-colors ${
        modo.ativo
          ? 'border-cyan-300 bg-cyan-950/25 text-slate-100'
          : 'border-transparent text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
      }`}
      disabled={!modo.ativo}
      type="button"
    >
      <Icone className={`h-5 w-5 ${modo.ativo ? 'text-cyan-300' : 'text-slate-600'}`} />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] font-black uppercase tracking-widest">
          {modo.titulo}
        </span>
        <span className="mt-1 block font-mono text-[9px] uppercase leading-relaxed tracking-widest text-slate-600">
          {modo.descricao}
        </span>
      </span>
      {!modo.ativo && <Lock className="h-3.5 w-3.5 text-slate-700" />}
    </button>
  );
}

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [preferenciaFila, setPreferenciaFila] = useState<PreferenciaFila>('flexivel');
  const router = useRouter();
  const profile = PERFIL_LOCAL_POC;

  const findMatch = () => {
    setIsSearching(true);

    setTimeout(() => {
      router.push('/game/mock-match-123');
    }, 2000);
  };

  return (
    <main className="grid h-screen grid-cols-[340px_minmax(0,1fr)_340px] grid-rows-[4rem_minmax(0,1fr)] overflow-hidden bg-[#050508] text-slate-100">
        <nav className="col-start-2 row-start-1 flex min-w-0 items-center gap-1 overflow-hidden border-b border-cyan-950/80 bg-[#080a12]/95 px-3 py-2 shadow-[0_1px_0_rgba(148,163,184,0.08)]">
          {['Início', 'Coleção', 'Ranking', 'Histórico', 'Notas'].map((item, indice) => (
            <button
              className={`h-12 px-5 font-mono text-[11px] font-black uppercase tracking-widest transition-colors ${
                indice === 0
                  ? 'bg-slate-800/60 text-slate-100'
                  : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-300'
              }`}
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="col-start-3 row-start-1 flex h-16 items-center justify-end gap-3 border-b border-l border-cyan-950/80 border-l-slate-800 bg-[#080a12]/95 px-4 shadow-[0_1px_0_rgba(148,163,184,0.08)]">
          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 font-mono text-xs font-black text-yellow-200">
              <Zap className="h-3.5 w-3.5" />
              {profile.currency_balance}
            </div>
            <div className="flex h-9 items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/25 px-3 font-mono text-xs font-black text-cyan-200">
              <BrainCircuit className="h-3.5 w-3.5" />
              {profile.pdr_analyst + profile.pdr_player}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-xs font-black uppercase tracking-widest text-slate-100">
                {profile.username}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                Online
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-950/25">
              <User className="h-5 w-5 text-cyan-300" />
            </div>
          </div>
        </div>

        <aside className="col-start-1 row-span-2 row-start-1 border-r border-slate-800 bg-[#070913]/95">
          <div className="border-b border-slate-800 px-5 py-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">
              Modos
            </div>
            <h1 className="mt-2 font-mono text-2xl font-black uppercase tracking-widest text-slate-100">
              Saguão
            </h1>
          </div>
          <div className="py-3">
            {MODOS_LOBBY.map(modo => (
              <BotaoModo key={modo.titulo} modo={modo} />
            ))}
          </div>

          <div className="mx-5 mt-4 border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              Regras da partida
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                  Tempo
                </div>
                <div className="mt-1 font-mono text-lg font-black text-slate-100">03:00</div>
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                  Veredito
                </div>
                <div className="mt-1 font-mono text-lg font-black text-slate-100">15s</div>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative col-start-2 row-start-2 min-h-0 overflow-hidden bg-[#050508]">
          <PortalPareamento buscando={isSearching} onJogar={findMatch} />

          <div className="relative z-10 flex h-full min-h-0 flex-col justify-between p-6 md:p-8 lg:p-10">
            <div className="max-w-2xl pt-8">
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.32em] text-yellow-200">
                Partida local
              </div>
              <h2 className="mt-5 font-serif text-5xl font-black uppercase leading-none tracking-wide text-slate-100 md:text-7xl">
                Game of Turing
              </h2>
              <p className="mt-5 max-w-xl font-mono text-sm uppercase leading-7 tracking-widest text-slate-300">
                Entre na fila como humano. O pareamento decide se você será Analista, Azul ou
                Vermelho; identidades e missões só aparecem dentro da partida.
              </p>
            </div>

            <div className="grid max-w-5xl gap-5 xl:grid-cols-[1fr_340px]">
              <div className="border border-slate-700/80 bg-black/55 p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  <MessageSquareText className="h-4 w-4 text-cyan-300" />
                  Preferência de fila
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {PREFERENCIAS.map(preferencia => {
                    const selecionada = preferenciaFila === preferencia.id;

                    return (
                      <button
                        className={`min-h-24 border p-4 text-left font-mono transition-colors ${
                          selecionada
                            ? 'border-cyan-300/70 bg-cyan-950/45 text-cyan-100 shadow-[0_0_22px_rgba(6,182,212,0.14)]'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900/70'
                        }`}
                        key={preferencia.id}
                        onClick={() => setPreferenciaFila(preferencia.id)}
                        type="button"
                      >
                        <div className="text-xs font-black uppercase tracking-widest">
                          {preferencia.titulo}
                        </div>
                        <div className="mt-3 text-[10px] uppercase leading-relaxed tracking-widest text-slate-500">
                          {preferencia.descricao}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border border-slate-700/80 bg-black/55 p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  <Shield className="h-4 w-4 text-emerald-300" />
                  Pareamento
                </div>
                <div className="space-y-3">
                  {REGRAS_CHAVE.map(regra => {
                    const Icone = regra.icone;

                    return (
                      <div
                        className="flex items-center gap-3 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-slate-300"
                        key={regra.texto}
                      >
                        <Icone className="h-4 w-4 shrink-0 text-cyan-300" />
                        {regra.texto}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-5xl border border-slate-700/80 bg-black/55 px-5 py-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 backdrop-blur">
              {isSearching
                ? 'Buscando mesa local. Preparando função, missão secreta e revelação.'
                : 'Use o botão circular para entrar na fila da partida local.'}
            </div>
          </div>
        </section>

        <aside className="col-start-3 row-start-2 border-l border-slate-800 bg-[#070913]/95">
          <div className="border-b border-slate-800 px-5 py-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Grupo
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-mono text-lg font-black uppercase tracking-widest text-slate-100">
                Solo
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-emerald-300">
                pronto
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div className="border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                <Sparkles className="h-4 w-4 text-yellow-200" />
                Pontos de Rank
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex min-h-24 flex-col justify-between border border-slate-800 bg-black/35 p-3">
                  <div className="min-h-8 font-mono text-[9px] uppercase leading-4 tracking-widest text-slate-600">
                    PDR Analista
                  </div>
                  <div className="font-mono text-2xl font-black leading-none text-slate-100">
                    {profile.pdr_analyst}
                  </div>
                </div>
                <div className="flex min-h-24 flex-col justify-between border border-slate-800 bg-black/35 p-3">
                  <div className="min-h-8 font-mono text-[9px] uppercase leading-4 tracking-widest text-slate-600">
                    PDR Jogador
                  </div>
                  <div className="font-mono text-2xl font-black leading-none text-slate-100">
                    {profile.pdr_player}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                <Users className="h-4 w-4 text-cyan-300" />
                Mesa possível
              </div>
              <div className="space-y-3 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center justify-between border border-slate-800 bg-black/35 px-3 py-3">
                  <span className="text-slate-500">Analista</span>
                  <span className="text-slate-100">Humano</span>
                </div>
                <div className="flex items-center justify-between border border-slate-800 bg-black/35 px-3 py-3">
                  <span className="text-slate-500">Azul</span>
                  <span className="text-cyan-200">Humano/IA</span>
                </div>
                <div className="flex items-center justify-between border border-slate-800 bg-black/35 px-3 py-3">
                  <span className="text-slate-500">Vermelho</span>
                  <span className="text-fuchsia-200">Humano/IA</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
    </main>
  );
}
