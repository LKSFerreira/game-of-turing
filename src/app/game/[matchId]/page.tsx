'use client';

import { AnimatePresence, motion } from 'motion/react';
import { BrainCircuit, Cpu, User } from 'lucide-react';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  avancarParaVeredito,
  atualizarFasePorTempo,
  buscarParticipanteObrigatorio,
  calcularResultadoPartida,
  calcularSegundosRestantes,
  criarPartidaPoc,
  finalizarPartidaComVeredito,
  finalizarPartidaPorTempoVeredito,
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
import {
  CHANCE_PROATIVIDADE_IA,
  CHANCE_DIGITACAO_FAKE,
  INTERVALO_CHECAGEM_INATIVIDADE_MS,
  LIMITE_INATIVIDADE_SEGUNDOS,
  MAXIMO_MENSAGENS_CONTEXTO_API,
  TEMPO_MAXIMO_DIGITACAO_FAKE_MS,
  TEMPO_MINIMO_DIGITACAO_FAKE_MS,
  CARACTERES_POR_SEGUNDO_LEITURA,
  CARACTERES_POR_SEGUNDO_DIGITACAO,
  TEMPO_MAXIMO_DIGITACAO_UI_MS,
  NOVO_DELAY_BASE_DIGITACAO_MS,
  NOVO_DELAY_VARIACAO_DIGITACAO_MS,
  TEMPO_PENSAMENTO_MINIMO_IA_MS,
  TEMPO_PENSAMENTO_VARIACAO_IA_MS,
  TEMPO_HESITACAO_PROATIVIDADE_MINIMO_MS,
  TEMPO_HESITACAO_PROATIVIDADE_VARIACAO_MS,
} from './constantes';

type CorJogador = Extract<CorParticipante, 'azul' | 'vermelho'>;
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
    icone: User,
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

function isCorJogador(cor: CorParticipante): cor is CorJogador {
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

function BotaoNatureza({
  cor,
  natureza,
  selecionado,
  onSelecionar,
}: {
  cor: CorJogador;
  natureza: NaturezaParticipante;
  selecionado: boolean;
  onSelecionar: (natureza: NaturezaParticipante) => void;
}) {
  const Icone = natureza === 'humano' ? User : Cpu;
  const textoCor = cor === 'azul' ? 'text-cyan-300' : 'text-red-400';
  const bordaSelecionada = cor === 'azul' ? 'border-cyan-300/80' : 'border-red-400/80';
  const fundoSelecionado = cor === 'azul' ? 'bg-cyan-950/45' : 'bg-red-950/45';
  const sombraSelecionada =
    cor === 'azul'
      ? 'shadow-[0_0_26px_rgba(34,211,238,0.18)]'
      : 'shadow-[0_0_26px_rgba(239,68,68,0.18)]';

  return (
    <button
      aria-pressed={selecionado}
      className={`flex min-h-20 flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-left font-mono transition-all ${
        selecionado
          ? `${bordaSelecionada} ${fundoSelecionado} ${sombraSelecionada}`
          : 'border-slate-800 bg-slate-950/70 hover:border-slate-600 hover:bg-slate-900/80'
      }`}
      onClick={() => onSelecionar(natureza)}
      type="button"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${
          selecionado ? `${bordaSelecionada} ${textoCor}` : 'border-slate-700 text-slate-500'
        }`}
      >
        <Icone className="h-5 w-5 stroke-[1.8]" />
      </span>
      <span className="min-w-0">
        <span
          className={`block text-sm font-black uppercase tracking-widest ${
            selecionado ? textoCor : 'text-slate-300'
          }`}
        >
          {obterNatureza(natureza)}
        </span>
        <span className="mt-1.5 block text-[9px] font-bold uppercase leading-relaxed tracking-widest text-slate-500">
          {natureza === 'humano' ? 'Pessoa real jogando' : 'LLM simulando'}
        </span>
      </span>
    </button>
  );
}

export default function GameRoom({ params }: { params: Promise<{ matchId: string }> }) {
  const matchId = use(params).matchId;
  const router = useRouter();
  const enviandoMensagemRef = useRef(false);
  const sequenciaIaVersaoRef = useRef(0);
  const [partida, setPartida] = useState(() => criarPartidaPoc({ id: matchId }));
  const partidaRef = useRef(partida);
  partidaRef.current = partida;
  const [entradaMensagem, setEntradaMensagem] = useState('');
  const [segundosRestantes, setSegundosRestantes] = useState(partida.duracaoSegundos);
  const [segundosVereditoRestantes, setSegundosVereditoRestantes] = useState(
    partida.faseVereditoSegundos,
  );
  const [segundosCooldown, setSegundosCooldown] = useState(0);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const [exibirModalPapel, setExibirModalPapel] = useState(true);
  const [vereditoAzul, setVereditoAzul] = useState<NaturezaParticipante | ''>('');
  const [vereditoVermelho, setVereditoVermelho] = useState<NaturezaParticipante | ''>('');
  const [jogadoresPensando, setJogadoresPensando] = useState<CorJogador[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const vereditoAzulRef = useRef(vereditoAzul);
  vereditoAzulRef.current = vereditoAzul;
  const vereditoVermelhoRef = useRef(vereditoVermelho);
  vereditoVermelhoRef.current = vereditoVermelho;
  const jogadoresPensandoRef = useRef(jogadoresPensando);
  jogadoresPensandoRef.current = jogadoresPensando;

  const enviarEventoBackend = useCallback(async (tipoEvento: string, detalhes?: any) => {
    try {
      await fetch('/api/match/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoEvento,
          partidaId: matchId,
          detalhes,
        }),
      });
    } catch (erro) {
      console.error(`Erro ao reportar evento de domínio ${tipoEvento} for o servidor:`, erro);
    }
  }, [matchId]);

  // Envia evento de início da partida ao carregar
  useEffect(() => {
    enviarEventoBackend('PARTIDA_INICIADA');
  }, [enviarEventoBackend]);

  const analista = buscarParticipantePorCor(partida, 'analista');
  const participanteAzul = buscarParticipantePorCor(partida, 'azul');
  const participanteVermelho = buscarParticipantePorCor(partida, 'vermelho');
  const resultado =
    partida.fase === 'revelacao' && (partida.vereditoAnalista || partida.motivoEncerramento === 'wo_inatividade')
      ? calcularResultadoPartida(partida)
      : null;
  const estilosAnalista = ESTILOS_PARTICIPANTE.analista;

  useEffect(() => {
    if (exibirModalPapel || partida.fase !== 'em_andamento') {
      return;
    }

    const intervalo = window.setInterval(() => {
      const partidaAtual = partidaRef.current;
      const proximosSegundosRestantes = calcularSegundosRestantes(partidaAtual, new Date());
      setSegundosRestantes(proximosSegundosRestantes);

      if (proximosSegundosRestantes <= 0) {
        setSegundosVereditoRestantes(partidaAtual.faseVereditoSegundos);
        const proximaPartida = atualizarFasePorTempo(partidaAtual, new Date());

        if (proximaPartida.fase !== partidaAtual.fase) {
          if (proximaPartida.fase === 'veredito') {
            enviarEventoBackend('FASE_VEREDITO');
          } else if (proximaPartida.fase === 'revelacao') {
            const res = calcularResultadoPartida(proximaPartida);
            enviarEventoBackend('PARTIDA_FINALIZADA', {
              analistaVenceu: res.analistaVenceu,
              analistaInativoWo: res.analistaInativoWo,
              participantes: res.participantes,
            });
          }
          setPartida(proximaPartida);
        }
      }
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, [exibirModalPapel, partida.fase, enviarEventoBackend]);

  useEffect(() => {
    if (segundosCooldown <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSegundosCooldown(segundosAtuais => Math.max(0, segundosAtuais - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [segundosCooldown]);

  useEffect(() => {
    if (partida.fase !== 'veredito' || segundosVereditoRestantes <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (segundosVereditoRestantes <= 1) {
        const partidaAtual = partidaRef.current;
        if (partidaAtual.fase === 'veredito') {
          const pAzul = buscarParticipantePorCor(partidaAtual, 'azul');
          const pVermelho = buscarParticipantePorCor(partidaAtual, 'vermelho');

          const obterNaturezaOpostaLocal = (nat: NaturezaParticipante): NaturezaParticipante =>
            nat === 'humano' ? 'ia' : 'humano';

          const escolhaAzul = vereditoAzulRef.current || obterNaturezaOpostaLocal(pAzul.natureza);
          const escolhaVermelho = vereditoVermelhoRef.current || obterNaturezaOpostaLocal(pVermelho.natureza);

          enviarEventoBackend('VEREDITO_SUBMETIDO', {
            azul: vereditoAzulRef.current || 'NENHUM (tempo esgotado)',
            vermelho: vereditoVermelhoRef.current || 'NENHUM (tempo esgotado)',
          });

          const partidaFinalizada = finalizarPartidaComVeredito(
            partidaAtual,
            { azul: escolhaAzul, vermelho: escolhaVermelho },
            new Date().toISOString(),
          );

          const res = calcularResultadoPartida(partidaFinalizada);
          enviarEventoBackend('PARTIDA_FINALIZADA', {
            analistaVenceu: res.analistaVenceu,
            analistaInativoWo: res.analistaInativoWo,
            participantes: res.participantes,
          });

          setPartida(partidaFinalizada);
          setErroMensagem('Tempo esgotado. O Analista perdeu a análise.');
        }
        setSegundosVereditoRestantes(0);
      } else {
        setSegundosVereditoRestantes(segundosAtuais => segundosAtuais - 1);
      }
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [partida.fase, segundosVereditoRestantes, enviarEventoBackend]);

  async function executarMensagemIaEspontanea(corJogador: CorJogador) {
    if (partidaRef.current.fase !== 'em_andamento') return;

    // 1. Delay Cognitivo Silencioso Inicial antes de começar a digitar
    const tempoPensamentoMs = TEMPO_HESITACAO_PROATIVIDADE_MINIMO_MS + Math.random() * TEMPO_HESITACAO_PROATIVIDADE_VARIACAO_MS;
    await new Promise(resolve => window.setTimeout(resolve, tempoPensamentoMs));

    if (partidaRef.current.fase !== 'em_andamento') return;

    // 2. Iniciar Indicação Visual de Digitação ("pensando")
    setJogadoresPensando(atuais =>
      atuais.includes(corJogador) ? atuais : [...atuais, corJogador],
    );

    try {
      const botParticipante = corJogador === 'azul' ? participanteAzul : participanteVermelho;
      const startTempo = Date.now();

      if (partidaRef.current.fase !== 'em_andamento') {
        return;
      }

      const resposta = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cor: corJogador,
          missaoSecreta: botParticipante.missaoSecreta,
          historico: partidaRef.current.mensagens.slice(-MAXIMO_MENSAGENS_CONTEXTO_API),
        }),
      });

      if (partidaRef.current.fase !== 'em_andamento') {
        return;
      }

      const dados = (await resposta.json()) as RespostaApiIa;
      const tempoGastoFetch = Date.now() - startTempo;

      const tamanhoResposta = dados.texto?.length ?? 0;
      const tempoDigitacaoMs = Math.min(TEMPO_MAXIMO_DIGITACAO_UI_MS, (tamanhoResposta / CARACTERES_POR_SEGUNDO_DIGITACAO) * 1000);
      const delayDesejadoMs = NOVO_DELAY_BASE_DIGITACAO_MS + tempoDigitacaoMs + Math.random() * NOVO_DELAY_VARIACAO_DIGITACAO_MS;
      const delayRestante = Math.max(0, delayDesejadoMs - tempoGastoFetch);

      if (delayRestante > 0) {
        await new Promise(resolve => window.setTimeout(resolve, delayRestante));
      }

      if (partidaRef.current.fase !== 'em_andamento') {
        return;
      }

      if (resposta.status === 503 || !resposta.ok || !dados.texto) {
        console.error(`[GAME ESPONTANEO] Falha crítica de IA no bot ${corJogador.toUpperCase()}. Redirecionando para rota offline.`);
        router.push('/offline');
        return;
      }

      const criadaEm = new Date().toISOString();
      const partidaAtual = partidaRef.current;
      if (partidaAtual.fase !== 'em_andamento') return;

      const participanteAtual = buscarParticipanteObrigatorio(
        partidaAtual,
        botParticipante.id,
      );
      const validacao = validarMensagem(
        partidaAtual,
        participanteAtual,
        dados.texto!,
        new Date(criadaEm),
      );

      if (!validacao.valido) {
        console.error(
          `[GAME ESPONTANEO] Mensagem gerada pelo bot ${corJogador.toUpperCase()} foi considerada inválida pelo motor. Motivo: ${validacao.motivo}`,
        );
        router.push('/offline');
        return;
      }

      const partidaNova = registrarMensagem(
        partidaAtual,
        participanteAtual,
        validacao.conteudoNormalizado,
        criadaEm,
      );

      enviarEventoBackend('MENSAGEM_REGISTRADA', {
        remetenteCor: botParticipante.cor,
        conteudo: validacao.conteudoNormalizado,
      });

      setPartida(partidaNova);
      rolarChatParaFim();
    } catch (erro) {
      console.error(`[GAME ESPONTANEO] Falha de conexão de rede ou exceção ao acionar bot ${corJogador.toUpperCase()}:`, erro);
      router.push('/offline');
    } finally {
      setJogadoresPensando(atuais => atuais.filter(corAtual => corAtual !== corJogador));
    }
  }

  // Monitor de inatividade de chat para proatividade de IA (baseado em setTimeout e refs estáveis)
  useEffect(() => {
    if (exibirModalPapel || partida.fase !== 'em_andamento') {
      return;
    }

    if (partida.mensagens.length === 0) return;
    const ultimaMensagemAoIniciarTimer = partida.mensagens[partida.mensagens.length - 1];

    const timerId = window.setTimeout(() => {
      const partidaAtual = partidaRef.current;

      // Valida se ainda está na fase correta
      if (partidaAtual.fase !== 'em_andamento') return;

      // Valida se nenhuma nova mensagem foi adicionada enquanto o timer corria
      const ultimaMensagemAtual = partidaAtual.mensagens[partidaAtual.mensagens.length - 1];
      if (ultimaMensagemAtual.id !== ultimaMensagemAoIniciarTimer.id) return;

      // Valida se nenhuma IA está digitando/pensando no momento
      if (jogadoresPensandoRef.current.length > 0) return;

      // Aplica a chance de proatividade
      if (Math.random() < CHANCE_PROATIVIDADE_IA) {
        const corUltimoRemetente = ultimaMensagemAtual.remetenteCor;
        let botEscolhido: CorJogador = 'azul';

        if (corUltimoRemetente === 'azul') {
          botEscolhido = 'vermelho';
        } else if (corUltimoRemetente === 'vermelho') {
          botEscolhido = 'azul';
        } else {
          botEscolhido = Math.random() < 0.5 ? 'azul' : 'vermelho';
        }

        executarMensagemIaEspontanea(botEscolhido);
      }
    }, LIMITE_INATIVIDADE_SEGUNDOS * 1000);

    return () => window.clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exibirModalPapel, partida.mensagens.length]);

  function rolarChatParaFim() {
    window.setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  async function executarSequenciaRespostasIa(partidaAposAnalista: Partida) {
    const versaoAtual = ++sequenciaIaVersaoRef.current;
    const bots = [
      { participante: participanteAzul, cor: 'azul' },
      { participante: participanteVermelho, cor: 'vermelho' },
    ];

    // Sorteia quem responde primeiro para manter dinâmica humana
    if (Math.random() < 0.5) {
      bots.reverse();
    }

    let partidaAtualizada = partidaAposAnalista;
    let algumBotRespondeu = false;

    for (let indice = 0; indice < bots.length; indice++) {
      const bot = bots[indice];
      const corJogador = bot.cor as CorJogador;

      // 1. Tempo de Leitura Silenciosa e Processamento Cognitivo Realista
      const tamanhoUltimaMensagem = partidaAtualizada.mensagens.length > 0 ? partidaAtualizada.mensagens[partidaAtualizada.mensagens.length - 1].conteudo.length : 0;
      const tempoPensamentoMinimoMs = TEMPO_PENSAMENTO_MINIMO_IA_MS + Math.random() * TEMPO_PENSAMENTO_VARIACAO_IA_MS;
      const tempoLeituraMs = (tamanhoUltimaMensagem / CARACTERES_POR_SEGUNDO_LEITURA) * 1000 + tempoPensamentoMinimoMs;

      await new Promise(resolve => window.setTimeout(resolve, tempoLeituraMs));

      if (versaoAtual !== sequenciaIaVersaoRef.current || partidaRef.current.fase !== 'em_andamento') {
        setJogadoresPensando([]);
        return;
      }

      // 1.5 Simular Hesitação (Digitando Fake)
      // Se for o último bot e ninguém respondeu ainda, nós FORÇAMOS a resposta real (não aplicamos a hesitação).
      const deveForcarResposta = !algumBotRespondeu && indice === bots.length - 1;

      if (!deveForcarResposta && Math.random() < CHANCE_DIGITACAO_FAKE) {
        // Ativa indicador de digitando
        setJogadoresPensando(atuais =>
          atuais.includes(corJogador) ? atuais : [...atuais, corJogador],
        );

        const tempoFakeMs = TEMPO_MINIMO_DIGITACAO_FAKE_MS + Math.random() * (TEMPO_MAXIMO_DIGITACAO_FAKE_MS - TEMPO_MINIMO_DIGITACAO_FAKE_MS);
        await new Promise(resolve => window.setTimeout(resolve, tempoFakeMs));

        // Desativa indicador de digitando
        setJogadoresPensando(atuais => atuais.filter(corAtual => corAtual !== corJogador));

        if (versaoAtual !== sequenciaIaVersaoRef.current || partidaRef.current.fase !== 'em_andamento') {
          setJogadoresPensando([]);
          return;
        }

        // Pula a resposta deste bot simulando que ele desistiu
        continue;
      }

      // 2. Iniciar Indicação Visual de Digitação
      setJogadoresPensando(atuais =>
        atuais.includes(corJogador) ? atuais : [...atuais, corJogador],
      );

      try {
        const startTempo = Date.now();

        if (partidaRef.current.fase !== 'em_andamento') {
          setJogadoresPensando([]);
          return;
        }

        const resposta = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cor: corJogador,
            missaoSecreta: bot.participante.missaoSecreta,
            historico: partidaAtualizada.mensagens.slice(-MAXIMO_MENSAGENS_CONTEXTO_API),
          }),
        });

        if (versaoAtual !== sequenciaIaVersaoRef.current || partidaRef.current.fase !== 'em_andamento') {
          setJogadoresPensando([]);
          return;
        }

        const dados = (await resposta.json()) as RespostaApiIa;
        const tempoGastoFetch = Date.now() - startTempo;

        const tamanhoResposta = dados.texto?.length ?? 0;
        const tempoDigitacaoMs = Math.min(TEMPO_MAXIMO_DIGITACAO_UI_MS, (tamanhoResposta / CARACTERES_POR_SEGUNDO_DIGITACAO) * 1000);
        const delayDesejadoMs = NOVO_DELAY_BASE_DIGITACAO_MS + tempoDigitacaoMs + Math.random() * NOVO_DELAY_VARIACAO_DIGITACAO_MS;
        const delayRestante = Math.max(0, delayDesejadoMs - tempoGastoFetch);

        if (delayRestante > 0) {
          await new Promise(resolve => window.setTimeout(resolve, delayRestante));
        }

        if (versaoAtual !== sequenciaIaVersaoRef.current || partidaRef.current.fase !== 'em_andamento') {
          setJogadoresPensando([]);
          return;
        }

        if (resposta.status === 503 || !resposta.ok || !dados.texto) {
          console.error(`[GAME] Falha crítica de IA no bot ${bot.cor.toUpperCase()}. Redirecionando para rota offline.`);
          router.push('/offline');
          return;
        }

        const criadaEm = new Date().toISOString();
        const participanteAtual = buscarParticipanteObrigatorio(
          partidaAtualizada,
          bot.participante.id,
        );
        const validacao = validarMensagem(
          partidaAtualizada,
          participanteAtual,
          dados.texto,
          new Date(criadaEm),
        );

        if (!validacao.valido) {
          console.error(
            `[GAME] Mensagem gerada pelo bot ${bot.cor.toUpperCase()} foi considerada inválida pelo motor. Motivo: ${validacao.motivo}`,
          );
          router.push('/offline');
          return;
        }

        partidaAtualizada = registrarMensagem(
          partidaAtualizada,
          participanteAtual,
          validacao.conteudoNormalizado,
          criadaEm,
        );

        enviarEventoBackend('MENSAGEM_REGISTRADA', {
          remetenteCor: bot.participante.cor,
          conteudo: validacao.conteudoNormalizado,
        });

        setPartida(stateAnterior => registrarMensagem(
          stateAnterior,
          participanteAtual,
          validacao.conteudoNormalizado,
          criadaEm
        ));
        algumBotRespondeu = true;
        rolarChatParaFim();
      } catch (erro) {
        console.error(`[GAME] Falha de conexão de rede ou exceção ao acionar bot ${bot.cor.toUpperCase()}:`, erro);
        router.push('/offline');
        return;
      } finally {
        setJogadoresPensando(atuais => atuais.filter(corAtual => corAtual !== corJogador));
      }
    }
  }

  function enviarMensagem(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (partida.fase !== 'em_andamento' || segundosCooldown > 0 || enviandoMensagemRef.current) {
      return;
    }

    enviandoMensagemRef.current = true;

    const enviadaEm = new Date();
    const validacao = validarMensagem(partida, analista, entradaMensagem, enviadaEm);

    if (!validacao.valido) {
      setErroMensagem(validacao.motivo);
      enviandoMensagemRef.current = false;
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

    enviarEventoBackend('MENSAGEM_REGISTRADA', {
      remetenteCor: analista.cor,
      conteudo: validacao.conteudoNormalizado,
    });

    executarSequenciaRespostasIa(partidaComMensagem);
    rolarChatParaFim();

    window.setTimeout(() => {
      enviandoMensagemRef.current = false;
    }, 500);
  }

  function encerrarInterrogatorio() {
    setSegundosVereditoRestantes(partida.faseVereditoSegundos);
    setPartida(partidaAtual => avancarParaVeredito(partidaAtual));
    setSegundosRestantes(0);
    enviarEventoBackend('FASE_VEREDITO');
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

    enviarEventoBackend('VEREDITO_SUBMETIDO', {
      azul: vereditoAzul,
      vermelho: vereditoVermelho,
    });

    const partidaFinalizada = finalizarPartidaComVeredito(
      partidaEmVeredito,
      validacaoVeredito.veredito,
      new Date().toISOString(),
    );

    setPartida(partidaFinalizada);
    setErroMensagem(null);
    rolarChatParaFim();

    const res = calcularResultadoPartida(partidaFinalizada);
    enviarEventoBackend('PARTIDA_FINALIZADA', {
      analistaVenceu: res.analistaVenceu,
      analistaInativoWo: res.analistaInativoWo,
      participantes: res.participantes,
    });
  }

  function selecionarVeredito(cor: CorJogador, natureza: NaturezaParticipante) {
    if (cor === 'azul') {
      setVereditoAzul(natureza);
    } else {
      setVereditoVermelho(natureza);
    }

    setErroMensagem(null);
  }

  function reiniciarSimulacao() {
    const novaPartida = criarPartidaPoc({ id: matchId });

    setPartida(novaPartida);
    setEntradaMensagem('');
    setSegundosRestantes(novaPartida.duracaoSegundos);
    setSegundosVereditoRestantes(novaPartida.faseVereditoSegundos);
    setSegundosCooldown(0);
    setErroMensagem(null);
    setExibirModalPapel(true);
    setVereditoAzul('');
    setVereditoVermelho('');
    setJogadoresPensando([]);
    enviarEventoBackend('PARTIDA_INICIADA');
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
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-slate-700" suppressHydrationWarning>
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
                        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600" suppressHydrationWarning>
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
                          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600" suppressHydrationWarning>
                            {formatarTimestamp(mensagem.criadaEm)}
                          </span>
                        )}
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-widest ${estiloRemetente}`}
                        >
                          {ROTULOS_COR[remetenteCor]}
                        </span>
                        {isAzul && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600" suppressHydrationWarning>
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
            {jogadoresPensando.length > 0 && partida.fase === 'em_andamento' && (
              <div className="flex flex-col gap-2 w-full px-1">
                {jogadoresPensando.map(corJogador => {
                  const isAzulPensando = corJogador === 'azul';

                  return (
                    <div
                      className={`flex w-full ${isAzulPensando ? 'justify-start' : 'justify-end'}`}
                      key={corJogador}
                    >
                      <div
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                          isAzulPensando
                            ? 'border-cyan-500/30 bg-cyan-950/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.08)]'
                            : 'border-red-500/30 bg-red-950/30 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.08)]'
                        }`}
                      >
                        {ROTULOS_COR[corJogador]} está digitando...
                      </div>
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
                {/* PREPARAÇÃO MULTIPLAYER: O participante local na PoC atual é sempre o analista, mas essa lógica impedirá fisicamente humanos em outros papéis de interagirem */}
                {(() => {
                  const participanteLocal = analista;
                  const analistaJaInteragiu = partida.mensagens.some(m => m.remetenteCor === 'analista');
                  const bloqueadoEsperandoAnalista = participanteLocal.papel === 'jogador' && !analistaJaInteragiu;
                  const desabilitado = segundosCooldown > 0 || bloqueadoEsperandoAnalista;

                  let placeholder = 'Digite a mensagem...';
                  if (bloqueadoEsperandoAnalista) placeholder = 'Aguarde o Analista iniciar o interrogatório...';
                  else if (segundosCooldown > 0) placeholder = `Aguarde (${segundosCooldown}s)...`;

                  return (
                    <>
                      <textarea
                        className="h-16 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 pr-28 font-mono text-sm text-slate-300 transition-colors focus:border-cyan-500/50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={desabilitado}
                        maxLength={150}
                        onChange={evento => setEntradaMensagem(evento.target.value)}
                        onKeyDown={evento => {
                          if (evento.key === 'Enter' && !evento.shiftKey) {
                            evento.preventDefault();
                            if (!desabilitado) evento.currentTarget.form?.requestSubmit();
                          }
                        }}
                        onPaste={evento => {
                          evento.preventDefault();
                          setErroMensagem('Colar conteúdo foi desativado por segurança.');
                        }}
                        placeholder={placeholder}
                        value={entradaMensagem}
                      />
                      <div className="absolute right-3 flex items-center gap-3">
                        <span className="hidden font-mono text-[10px] text-slate-500 sm:inline">
                          {entradaMensagem.length}/150
                        </span>
                        <button
                          className="rounded bg-yellow-500 px-4 py-2 text-xs font-bold uppercase text-black shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-colors hover:bg-yellow-400 disabled:opacity-50 disabled:shadow-none"
                          disabled={desabilitado || !entradaMensagem.trim()}
                          type="submit"
                        >
                          Enviar
                        </button>
                      </div>
                    </>
                  );
                })()}
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
                  Faça perguntas aos jogadores Azul e Vermelho e decida se são humanos ou IAs.
                  <br />
                  <br />
                  <span className="font-bold text-yellow-400">REGRA DO JOGO:</span> Você obrigatoriamente deve enviar a primeira mensagem do chat. Os Jogadores não conseguem enviar mensagens até a primeira interação do analisa acontecer.
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
            <div className="w-full max-w-lg rounded-xl border-2 border-slate-800 bg-[#050508] p-6 text-white shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <div className="mb-6">
                <h2 className="font-mono text-2xl tracking-widest text-yellow-400">
                  VEREDITO DO ANALISTA
                </h2>
                <p className="mt-2 font-mono text-xs text-slate-400">
                  O chat está bloqueado. Classifique a natureza real dos jogadores.
                </p>
              </div>

              <div className="space-y-6 pt-4 font-mono">
                <div className="space-y-2">
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">
                    Entidade [Azul]
                  </div>
                  <div className="grid gap-3 min-[460px]:grid-cols-2">
                    {(['humano', 'ia'] as NaturezaParticipante[]).map(natureza => (
                      <BotaoNatureza
                        cor="azul"
                        key={natureza}
                        natureza={natureza}
                        onSelecionar={naturezaSelecionada =>
                          selecionarVeredito('azul', naturezaSelecionada)
                        }
                        selecionado={vereditoAzul === natureza}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-red-400">
                    Entidade [Vermelho]
                  </div>
                  <div className="grid gap-3 min-[460px]:grid-cols-2">
                    {(['humano', 'ia'] as NaturezaParticipante[]).map(natureza => (
                      <BotaoNatureza
                        cor="vermelho"
                        key={natureza}
                        natureza={natureza}
                        onSelecionar={naturezaSelecionada =>
                          selecionarVeredito('vermelho', naturezaSelecionada)
                        }
                        selecionado={vereditoVermelho === natureza}
                      />
                    ))}
                  </div>
                </div>
                {erroMensagem && (
                  <div className="rounded border border-red-500/30 bg-red-950/30 px-3 py-2 text-[10px] uppercase tracking-widest text-red-400">
                    {erroMensagem}
                  </div>
                )}
                <button
                  className="mt-4 h-12 w-full rounded bg-yellow-500 font-bold uppercase tracking-widest text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
                  disabled={!vereditoAzul || !vereditoVermelho}
                  onClick={submeterVeredito}
                >
                  ({segundosVereditoRestantes}) Finalizar análise
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
                  {resultado.analistaInativoWo ? 'W.O. Inatividade' : 'Revelação'}
                </h2>
                <p
                  className={`mt-2 font-mono text-sm uppercase tracking-widest ${
                    resultado.analistaVenceu ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {resultado.analistaInativoWo ? 'Analista desclassificado' : resultado.analistaVenceu ? 'Analista venceu' : 'Analista perdeu'}
                </p>
                {resultado.analistaInativoWo && (
                  <p className="mt-2 text-xs text-red-400">
                    O Analista não interagiu na partida. <br/>
                    Jogadores recebem apenas metade da pontuação.
                  </p>
                )}
              </div>

              <div className="space-y-4 py-4 font-mono">
                {[participanteAzul, participanteVermelho].map(participante => {
                  const veredito = partida.vereditoAnalista
                    ? participante.cor === 'azul'
                      ? partida.vereditoAnalista.azul
                      : partida.vereditoAnalista.vermelho
                    : null;
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
                            !veredito ? 'text-slate-400' : veredito === participante.natureza ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {veredito ? obterNatureza(veredito) : 'W.O.'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Missão:</span>
                        <span className="text-slate-300">{obterDiretriz(participante)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Resultado da missão:</span>
                        <span className={participanteVenceu?.venceu ? 'text-green-500' : 'text-red-500'}>
                          {participanteVenceu?.venceu ? 'Sucesso' : 'Fracasso'}
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
                    PDR do Analista:{' '}
                    <span className={resultado.analistaVenceu ? 'text-green-500' : 'text-red-500'}>
                      {resultado.participantes.find(
                        participante => participante.participanteId === analista.id,
                      )?.ajustePdr ?? 0}
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
