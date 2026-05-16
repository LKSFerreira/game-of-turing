'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Bot, BrainCircuit, User } from 'lucide-react';
import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  avancarParaVeredito,
  atualizarFasePorTempo,
  buscarParticipanteObrigatorio,
  calcularResultadoPartida,
  calcularSegundosRestantes,
  criarPartidaPoc,
  finalizarPartidaComVeredito,
  registrarMensagem,
  validarMensagem,
  validarVereditoAnalista,
} from '@/domain/jogo';
import type {
  CorParticipante,
  MensagemPartida,
  NaturezaParticipante,
  ParticipantePartida,
  Partida,
  ResultadoPartida,
} from '@/domain/jogo';

type CorInterlocutor = Extract<CorParticipante, 'azul' | 'vermelho'>;
type CorVisual = Extract<CorParticipante, 'analista' | 'azul' | 'vermelho'>;

type ParticipanteVisivel = {
  id: string;
  cor: CorVisual;
  rotulo: string;
  descricao: string;
};

type RespostaApiIa = {
  texto?: string;
  provider?: string;
  error?: string;
};

const ROTULOS_COR: Record<CorParticipante, string> = {
  analista: 'Analista',
  azul: 'Azul',
  vermelho: 'Vermelho',
  sistema: 'Sistema',
};

const ESTILOS_PARTICIPANTE = {
  analista: {
    borda: 'border-yellow-500/30',
    sombra: 'shadow-[0_0_20px_rgba(234,179,8,0.1)]',
    anel: 'border-yellow-400',
    fundo: 'bg-yellow-900/20',
    texto: 'text-yellow-400',
    etiqueta: 'bg-yellow-400 text-black',
    icone: BrainCircuit,
  },
  azul: {
    borda: 'border-cyan-500/30',
    sombra: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    anel: 'border-cyan-400',
    fundo: 'bg-cyan-900/20',
    texto: 'text-cyan-400',
    etiqueta: 'bg-cyan-500 text-black',
    icone: Bot,
  },
  vermelho: {
    borda: 'border-red-500/30',
    sombra: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    anel: 'border-red-500',
    fundo: 'bg-red-900/20',
    texto: 'text-red-500',
    etiqueta: 'bg-red-500 text-black',
    icone: User,
  },
} as const;

function buscarParticipantePorCor(partida: Partida, cor: CorVisual): ParticipantePartida {
  const participante = partida.participantes.find(
    participanteAtual => participanteAtual.cor === cor,
  );

  if (!participante) {
    throw new Error(`Participante ${cor} não encontrado.`);
  }

  return participante;
}

function isCorInterlocutor(cor: CorParticipante): cor is CorInterlocutor {
  return cor === 'azul' || cor === 'vermelho';
}

function obterRotuloPapel(participante: ParticipantePartida): string {
  if (participante.papel === 'analista') {
    return 'Analista';
  }

  return `Jogador ${ROTULOS_COR[participante.cor]}`;
}

function obterDiretriz(participante: ParticipantePartida): string {
  if (participante.papel === 'analista') {
    return 'Identifique a natureza real de Azul e Vermelho';
  }

  return participante.missaoSecreta === 'convencer_humano'
    ? 'Convença o Analista de que você é humano'
    : 'Convença o Analista de que você é IA';
}

function obterNatureza(natureza: NaturezaParticipante): string {
  return natureza === 'humano' ? 'Humano' : 'IA';
}

function obterResultadoParticipante(
  resultado: ResultadoPartida,
  participante: ParticipantePartida,
) {
  return resultado.participantes.find(
    resultadoParticipante => resultadoParticipante.participanteId === participante.id,
  );
}

function formatarTempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${minutos.toString().padStart(2, '0')}:${segundosRestantes
    .toString()
    .padStart(2, '0')}`;
}

function formatarTimestamp(dataIso: string): string {
  const data = new Date(dataIso);
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const hora = data.getHours().toString().padStart(2, '0');
  const minuto = data.getMinutes().toString().padStart(2, '0');
  const segundo = data.getSeconds().toString().padStart(2, '0');

  return `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;
}

function CartaoParticipante({ participante }: { participante: ParticipanteVisivel }) {
  const estilos = ESTILOS_PARTICIPANTE[participante.cor];
  const Icone = estilos.icone;

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-xl border bg-slate-900/50 p-4 ${estilos.borda} ${estilos.sombra}`}
    >
      <div className="relative">
        <div className={`h-24 w-24 rounded-full border-2 p-1 ${estilos.anel}`}>
          <div
            className={`flex h-full w-full items-center justify-center rounded-full ${estilos.fundo}`}
          >
            <Icone className={`h-12 w-12 ${estilos.texto} opacity-70`} />
          </div>
        </div>
        <div
          className={`absolute -bottom-2 -right-2 rounded px-2 py-1 text-[10px] font-bold uppercase ${estilos.etiqueta}`}
        >
          {participante.rotulo}
        </div>
      </div>
      <div className="text-center font-mono">
        <div className={`text-[10px] uppercase tracking-widest ${estilos.texto}`}>
          {participante.rotulo}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
          {participante.descricao}
        </div>
      </div>
    </div>
  );
}

export default function GameRoom({ params }: { params: Promise<{ matchId: string }> }) {
  const matchId = use(params).matchId;
  const router = useRouter();
  const [partida, setPartida] = useState(() => criarPartidaPoc({ id: matchId }));
  const [entradaMensagem, setEntradaMensagem] = useState('');
  const [segundosRestantes, setSegundosRestantes] = useState(partida.duracaoSegundos);
  const [segundosCooldown, setSegundosCooldown] = useState(0);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const [exibirModalPapel, setExibirModalPapel] = useState(true);
  const [vereditoAzul, setVereditoAzul] = useState<NaturezaParticipante | ''>('');
  const [vereditoVermelho, setVereditoVermelho] = useState<NaturezaParticipante | ''>('');
  const [interlocutoresPensando, setInterlocutoresPensando] = useState<CorInterlocutor[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const analista = buscarParticipantePorCor(partida, 'analista');
  const participanteAzul = buscarParticipantePorCor(partida, 'azul');
  const participanteVermelho = buscarParticipantePorCor(partida, 'vermelho');
  const resultado =
    partida.fase === 'revelacao' && partida.vereditoAnalista
      ? calcularResultadoPartida(partida)
      : null;
  const estilosAnalista = ESTILOS_PARTICIPANTE.analista;

  useEffect(() => {
    if (exibirModalPapel || partida.fase !== 'em_andamento') {
      return;
    }

    const intervalo = window.setInterval(() => {
      const proximosSegundosRestantes = calcularSegundosRestantes(partida, new Date());
      setSegundosRestantes(proximosSegundosRestantes);

      if (proximosSegundosRestantes <= 0) {
        setPartida(partidaAtual => atualizarFasePorTempo(partidaAtual, new Date()));
      }
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, [exibirModalPapel, partida]);

  useEffect(() => {
    if (segundosCooldown <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSegundosCooldown(segundosAtuais => Math.max(0, segundosAtuais - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [segundosCooldown]);

  function rolarChatParaFim() {
    window.setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  function agendarRespostaIa(
    partidaReferencia: Partida,
    participanteIa: ParticipantePartida,
    atrasoMs: number,
  ) {
    if (!isCorInterlocutor(participanteIa.cor) || !participanteIa.missaoSecreta) {
      return;
    }

    const corInterlocutor = participanteIa.cor;

    setInterlocutoresPensando(interlocutoresAtuais =>
      interlocutoresAtuais.includes(corInterlocutor)
        ? interlocutoresAtuais
        : [...interlocutoresAtuais, corInterlocutor],
    );

    window.setTimeout(async () => {
      try {
        const resposta = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cor: corInterlocutor,
            missaoSecreta: participanteIa.missaoSecreta,
            historico: partidaReferencia.mensagens.slice(-12),
          }),
        });
        const dados = (await resposta.json()) as RespostaApiIa;

        if (!resposta.ok || !dados.texto) {
          throw new Error(dados.error ?? 'Provider de IA não retornou resposta.');
        }

        setPartida(partidaAtual => {
          if (partidaAtual.fase !== 'em_andamento') {
            return partidaAtual;
          }

          const participanteAtual = buscarParticipanteObrigatorio(
            partidaAtual,
            participanteIa.id,
          );
          const criadaEm = new Date().toISOString();
          const validacao = validarMensagem(
            partidaAtual,
            participanteAtual,
            dados.texto!,
            new Date(criadaEm),
          );

          if (!validacao.valido) {
            return partidaAtual;
          }

          return registrarMensagem(
            partidaAtual,
            participanteAtual,
            validacao.conteudoNormalizado,
            criadaEm,
          );
        });
        rolarChatParaFim();
      } catch (erro) {
        const mensagem = erro instanceof Error ? erro.message : 'Falha ao acionar IA fake.';
        setErroMensagem(mensagem);
      } finally {
        setInterlocutoresPensando(interlocutoresAtuais =>
          interlocutoresAtuais.filter(corAtual => corAtual !== corInterlocutor),
        );
      }
    }, atrasoMs);
  }

  function enviarMensagem(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (partida.fase !== 'em_andamento' || segundosCooldown > 0) {
      return;
    }

    const enviadaEm = new Date();
    const validacao = validarMensagem(partida, analista, entradaMensagem, enviadaEm);

    if (!validacao.valido) {
      setErroMensagem(validacao.motivo);
      return;
    }

    const partidaComMensagem = registrarMensagem(
      partida,
      analista,
      validacao.conteudoNormalizado,
      enviadaEm.toISOString(),
    );

    setPartida(partidaComMensagem);
    setEntradaMensagem('');
    setErroMensagem(null);
    setSegundosCooldown(partida.cooldownSegundos);
    agendarRespostaIa(partidaComMensagem, participanteAzul, 1200);
    agendarRespostaIa(partidaComMensagem, participanteVermelho, 2200);
    rolarChatParaFim();
  }

  function encerrarInterrogatorio() {
    setPartida(partidaAtual => avancarParaVeredito(partidaAtual));
    setSegundosRestantes(0);
  }

  function submeterVeredito() {
    const partidaEmVeredito =
      partida.fase === 'em_andamento' ? avancarParaVeredito(partida) : partida;
    const validacaoVeredito = validarVereditoAnalista({
      azul: vereditoAzul || undefined,
      vermelho: vereditoVermelho || undefined,
    });

    if (!validacaoVeredito.valido) {
      setErroMensagem(validacaoVeredito.motivo);
      return;
    }

    const partidaFinalizada = finalizarPartidaComVeredito(
      partidaEmVeredito,
      validacaoVeredito.veredito,
      new Date().toISOString(),
    );

    setPartida(partidaFinalizada);
    setErroMensagem(null);
    rolarChatParaFim();
  }

  function reiniciarSimulacao() {
    const novaPartida = criarPartidaPoc({ id: matchId });

    setPartida(novaPartida);
    setEntradaMensagem('');
    setSegundosRestantes(novaPartida.duracaoSegundos);
    setSegundosCooldown(0);
    setErroMensagem(null);
    setExibirModalPapel(true);
    setVereditoAzul('');
    setVereditoVermelho('');
    setInterlocutoresPensando([]);
  }

  const participantesDaMesa: ParticipanteVisivel[] = [
    {
      id: participanteAzul.id,
      cor: 'azul',
      rotulo: 'Azul',
      descricao: 'IA fake local',
    },
    {
      id: participanteVermelho.id,
      cor: 'vermelho',
      rotulo: 'Vermelho',
      descricao: 'IA fake local',
    },
  ];

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#050508] font-sans text-slate-100">
      <header className="relative flex h-16 items-center justify-between border-b border-slate-800 bg-[#0A0A12] px-4 md:px-8">
        <div className="absolute left-4 hidden items-center gap-4 md:left-8 md:flex">
          <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
          <h1 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
            ID Sessão: GT-{matchId.slice(0, 4).toUpperCase()}
          </h1>
        </div>

        <div className="flex w-full items-center justify-center gap-6 md:gap-12">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              Temporizador Global
            </span>
            <span
              className={`font-mono text-2xl font-bold leading-none ${
                segundosRestantes <= 30 && partida.fase === 'em_andamento'
                  ? 'animate-pulse text-red-500'
                  : 'text-cyan-400'
              }`}
            >
              {partida.fase === 'revelacao' ? '00:00' : formatarTempo(segundosRestantes)}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Papel</div>
            <div
              className={`text-center text-sm font-bold uppercase tracking-widest ${estilosAnalista.texto}`}
            >
              {obterRotuloPapel(analista)}
            </div>
          </div>
          <div className="hidden h-8 w-px bg-slate-800 md:block" />
          <div className="hidden flex-col items-center md:flex">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Objetivo</div>
            <div className="text-center text-sm font-bold uppercase tracking-widest text-yellow-400">
              Classifique Azul e Vermelho
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col gap-4 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_#111122_0%,_#050508_100%)] p-4 lg:flex-row lg:p-6">
        <div className="hidden w-64 flex-col gap-4 lg:flex">
          <CartaoParticipante participante={participantesDaMesa[0]} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 font-mono lg:p-6">
            <AnimatePresence initial={false}>
              {partida.mensagens.map((mensagem: MensagemPartida) => {
                const remetenteCor = mensagem.remetenteCor;
                const isSistema = remetenteCor === 'sistema';
                const isAnalista = remetenteCor === 'analista';
                const isAzul = remetenteCor === 'azul';
                const isVermelho = remetenteCor === 'vermelho';
                const alinhamentoMensagem = isAnalista
                  ? 'items-center'
                  : isAzul
                    ? 'items-start'
                    : 'items-end';
                const larguraBalao = isAnalista ? 'max-w-[56%]' : 'max-w-[78%]';
                const estiloRemetente = isAnalista
                  ? 'text-yellow-400'
                  : isAzul
                    ? 'text-cyan-400'
                    : 'text-red-500';
                const estiloBalao = isAnalista
                  ? 'rounded-3xl rounded-t-2xl border-yellow-500/35 bg-slate-800/95 shadow-[0_0_20px_rgba(234,179,8,0.14)]'
                  : isAzul
                    ? 'rounded-[22px] rounded-tl-[3px] border-cyan-400/40 bg-cyan-950/50 shadow-[0_0_22px_rgba(6,182,212,0.14)]'
                    : 'rounded-[22px] rounded-tr-[3px] border-red-400/40 bg-red-950/50 shadow-[0_0_22px_rgba(239,68,68,0.14)]';

                if (isSistema) {
                  return (
                    <motion.div
                      key={mensagem.id}
                      animate={{ opacity: 1, y: 0 }}
                      className="my-2 flex justify-center text-center"
                      initial={{ opacity: 0, y: 10 }}
                    >
                      <div className="rounded-full border border-slate-800 bg-slate-950/80 px-4 py-2">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                          {mensagem.conteudo}
                        </div>
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-slate-700">
                          {formatarTimestamp(mensagem.criadaEm)}
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={mensagem.id}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex w-full flex-col ${alinhamentoMensagem}`}
                    initial={{ opacity: 0, y: 10 }}
                  >
                    {isAnalista ? (
                      <div className="mb-2 flex w-full max-w-[56%] flex-col items-center gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                          {formatarTimestamp(mensagem.criadaEm)}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-widest ${estiloRemetente}`}
                        >
                          {ROTULOS_COR[remetenteCor]}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`mb-2 flex w-full max-w-[78%] items-center gap-2 ${
                          isAzul ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {isVermelho && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                            {formatarTimestamp(mensagem.criadaEm)}
                          </span>
                        )}
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-widest ${estiloRemetente}`}
                        >
                          {ROTULOS_COR[remetenteCor]}
                        </span>
                        {isAzul && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                            {formatarTimestamp(mensagem.criadaEm)}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className={`${larguraBalao} border px-5 py-3.5 text-left text-sm leading-relaxed text-slate-100 ${estiloBalao}`}
                    >
                      {mensagem.conteudo}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {interlocutoresPensando.length > 0 && partida.fase === 'em_andamento' && (
              <div className="flex flex-wrap gap-2 px-1">
                {interlocutoresPensando.map(corInterlocutor => {
                  const isAzulPensando = corInterlocutor === 'azul';

                  return (
                    <div
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                        isAzulPensando
                          ? 'border-cyan-500/30 bg-cyan-950/30 text-cyan-400'
                          : 'border-red-500/30 bg-red-950/30 text-red-500'
                      }`}
                      key={corInterlocutor}
                    >
                      {ROTULOS_COR[corInterlocutor]} está digitando...
                    </div>
                  );
                })}
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {partida.fase === 'em_andamento' && (
            <div className="border-t border-slate-800 bg-slate-900/50 p-4">
              <form className="relative flex items-center" onSubmit={enviarMensagem}>
                <textarea
                  className="h-16 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 pr-28 font-mono text-sm text-slate-300 transition-colors focus:border-cyan-500/50 focus:outline-none"
                  disabled={segundosCooldown > 0}
                  maxLength={150}
                  onChange={evento => setEntradaMensagem(evento.target.value)}
                  onKeyDown={evento => {
                    if (evento.key === 'Enter' && !evento.shiftKey) {
                      evento.preventDefault();
                      evento.currentTarget.form?.requestSubmit();
                    }
                  }}
                  onPaste={evento => {
                    evento.preventDefault();
                    setErroMensagem('Colar conteúdo foi desativado por segurança.');
                  }}
                  placeholder={
                    segundosCooldown > 0
                      ? `Aguarde (${segundosCooldown}s)...`
                      : 'Digite a pergunta do Analista...'
                  }
                  value={entradaMensagem}
                />
                <div className="absolute right-3 flex items-center gap-3">
                  <span className="hidden font-mono text-[10px] text-slate-500 sm:inline">
                    {entradaMensagem.length}/150
                  </span>
                  <button
                    className="rounded bg-yellow-500 px-4 py-2 text-xs font-bold uppercase text-black shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-colors hover:bg-yellow-400 disabled:opacity-50 disabled:shadow-none"
                    disabled={segundosCooldown > 0 || !entradaMensagem.trim()}
                    type="submit"
                  >
                    Enviar
                  </button>
                </div>
              </form>
              <div className="mt-3 flex items-center justify-between gap-4 px-1">
                <div className="font-mono text-[10px] text-red-400">
                  {erroMensagem ?? 'Perguntas curtas ajudam a comparar padrões de resposta.'}
                </div>
                <button
                  className="rounded border border-yellow-500/40 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-400 transition-colors hover:bg-yellow-500/10"
                  onClick={encerrarInterrogatorio}
                  type="button"
                >
                  Encerrar interrogatório
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden w-64 flex-col gap-4 lg:flex">
          <CartaoParticipante participante={participantesDaMesa[1]} />
        </div>

        {exibirModalPapel && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`relative w-full max-w-lg overflow-hidden rounded-2xl border ${estilosAnalista.borda} bg-[#050508] p-6 text-white shadow-[0_0_60px_rgba(6,182,212,0.12)]`}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${estilosAnalista.etiqueta}`} />
              <div className="mb-6 text-center font-mono">
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  Partida local encontrada
                </div>
                <h2
                  className={`mt-3 text-3xl font-black uppercase tracking-widest ${estilosAnalista.texto}`}
                >
                  {obterRotuloPapel(analista)}
                </h2>
                <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">
                  {obterDiretriz(analista)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">
                  Objetivo imediato
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  Faça perguntas aos interlocutores e decida se Azul e Vermelho são humanos ou
                  IAs. Nesta PoC, ambos respondem por provider fake local.
                </p>
              </div>

              <button
                className={`mt-6 h-12 w-full rounded font-mono text-xs font-bold uppercase tracking-widest transition-colors ${estilosAnalista.etiqueta} hover:brightness-110`}
                onClick={() => setExibirModalPapel(false)}
              >
                Iniciar interrogatório
              </button>
            </motion.div>
          </div>
        )}

        {partida.fase === 'veredito' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border-2 border-slate-800 bg-[#050508] p-6 text-white shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <div className="mb-6">
                <h2 className="font-mono text-2xl tracking-widest text-yellow-400">
                  VEREDITO DO ANALISTA
                </h2>
                <p className="mt-2 font-mono text-xs text-slate-400">
                  O chat está bloqueado. Classifique a natureza real dos interlocutores.
                </p>
              </div>

              <div className="space-y-6 pt-4 font-mono">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    Entidade [Azul]
                  </label>
                  <select
                    className="h-10 w-full rounded-sm border border-slate-700 bg-slate-900 px-3 font-bold uppercase text-cyan-400 outline-none"
                    onChange={evento =>
                      setVereditoAzul(evento.target.value as NaturezaParticipante | '')
                    }
                    value={vereditoAzul}
                  >
                    <option value="">Selecionar</option>
                    <option value="humano">Humano</option>
                    <option value="ia">IA</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                    Entidade [Vermelho]
                  </label>
                  <select
                    className="h-10 w-full rounded-sm border border-slate-700 bg-slate-900 px-3 font-bold uppercase text-red-500 outline-none"
                    onChange={evento =>
                      setVereditoVermelho(evento.target.value as NaturezaParticipante | '')
                    }
                    value={vereditoVermelho}
                  >
                    <option value="">Selecionar</option>
                    <option value="humano">Humano</option>
                    <option value="ia">IA</option>
                  </select>
                </div>
                {erroMensagem && (
                  <div className="rounded border border-red-500/30 bg-red-950/30 px-3 py-2 text-[10px] uppercase tracking-widest text-red-400">
                    {erroMensagem}
                  </div>
                )}
                <button
                  className="mt-4 h-12 w-full rounded bg-yellow-500 font-bold uppercase tracking-widest text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-colors hover:bg-yellow-400"
                  onClick={submeterVeredito}
                >
                  Finalizar julgamento
                </button>
              </div>
            </div>
          </div>
        )}

        {partida.fase === 'revelacao' && resultado && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border-2 border-slate-800 bg-[#050508] p-6 text-white shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <div className="mb-6 text-center">
                <h2 className="font-mono text-3xl font-black uppercase tracking-widest text-slate-100">
                  Revelação
                </h2>
                <p
                  className={`mt-2 font-mono text-sm uppercase tracking-widest ${
                    resultado.analistaVenceu ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {resultado.analistaVenceu ? 'Analista venceu' : 'Analista perdeu'}
                </p>
              </div>

              <div className="space-y-4 py-4 font-mono">
                {[participanteAzul, participanteVermelho].map(participante => {
                  const veredito =
                    participante.cor === 'azul'
                      ? partida.vereditoAnalista!.azul
                      : partida.vereditoAnalista!.vermelho;
                  const participanteVenceu = obterResultadoParticipante(resultado, participante);
                  const corTexto =
                    participante.cor === 'azul' ? 'text-cyan-400' : 'text-red-500';

                  return (
                    <div
                      className="flex flex-col gap-2 rounded border border-slate-800 bg-slate-900/50 p-4"
                      key={participante.id}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`${corTexto} font-bold uppercase`}>
                          [{ROTULOS_COR[participante.cor]}] Natureza real:
                        </span>
                        <span className="text-white">{obterNatureza(participante.natureza)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Classificado como:</span>
                        <span
                          className={
                            veredito === participante.natureza ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {obterNatureza(veredito)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Missão:</span>
                        <span className="text-slate-300">{obterDiretriz(participante)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Resultado do interlocutor:</span>
                        <span className={participanteVenceu?.venceu ? 'text-green-500' : 'text-red-500'}>
                          {participanteVenceu?.venceu ? 'Venceu' : 'Perdeu'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Atividade:</span>
                        <span className={participanteVenceu?.inativo ? 'text-red-500' : 'text-green-500'}>
                          {participanteVenceu?.inativo ? 'Inativo' : 'Participou'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-slate-800 pt-6 text-center">
                  <div className="text-lg font-bold uppercase leading-loose tracking-widest text-slate-100">
                    MMR do Analista:{' '}
                    <span className={resultado.analistaVenceu ? 'text-green-500' : 'text-red-500'}>
                      {resultado.participantes.find(
                        participante => participante.participanteId === analista.id,
                      )?.ajusteMmr ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  className="h-12 rounded border border-cyan-500/40 bg-cyan-950/20 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:bg-cyan-900/40"
                  onClick={reiniciarSimulacao}
                >
                  Jogar novamente
                </button>
                <button
                  className="h-12 rounded border border-slate-700 bg-slate-800 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors hover:bg-cyan-900/50"
                  onClick={() => router.push('/')}
                >
                  Retornar ao saguão
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="flex h-10 items-center justify-between border-t border-slate-800 bg-black px-4 md:px-8">
        <div className="flex gap-4 md:gap-6">
          <div className="hidden font-mono text-[10px] text-slate-500 sm:block">
            PROTOCOLO:{' '}
            <span className="uppercase italic text-slate-300">Turing-Domain-PoC</span>
          </div>
          <div className="font-mono text-[10px] text-slate-500">
            IA: <span className="uppercase text-cyan-500">fake/server-side</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-green-500 sm:block">
            Domínio conectado
          </span>
        </div>
      </footer>
    </div>
  );
}
