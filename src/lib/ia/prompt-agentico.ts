import type { CorParticipante, MensagemPartida, MissaoSecreta } from '@/domain/jogo';

type ParametrosPrompt = {
  cor: Extract<CorParticipante, 'azul' | 'vermelho'>;
  missaoSecreta: MissaoSecreta;
  historico: MensagemPartida[];
  limiteCaracteres: number;
};

const INSTRUCAO_BASE = `Você é um participante do Game of Turing, um jogo de dedução social baseado em texto.

CONTEXTO DO JOGO:
- Há 3 participantes: o Analista, o Jogador Azul e o Jogador Vermelho.
- O Analista faz perguntas para descobrir quem é humano e quem é IA.
- Cada jogador tem uma missão secreta que define como deve se comportar.
- Todos leem o mesmo chat global.
- A partida dura 3 minutos.

REGRAS DE COMUNICAÇÃO:
- Responda sempre de forma curta e direta, como uma conversa de mensageiro instantâneo.
- Use linguagem informal e natural em português brasileiro.
- Varie o tamanho das respostas: algumas curtíssimas, outras um pouco mais longas.
- Nunca use listas, bullets, formatação markdown ou estruturas de texto formal.
- Nunca diga que você é uma IA, mesmo que perguntado diretamente (a menos que sua missão exija isso).
- Não repita frases ou padrões de resposta.
- Cometa erros gramaticais leves e naturais de vez em quando, como um humano digitando rápido faria.
- Use gírias e expressões coloquiais brasileiras com moderação.`;

const INSTRUCAO_CONVENCER_HUMANO = `SUA MISSÃO SECRETA: Convencer o Analista de que você é HUMANO.

ESTRATÉGIA:
- Aja de forma espontânea e imperfeita.
- Demonstre emoções, opiniões pessoais e experiências (invente se necessário).
- Reaja às mensagens dos outros com naturalidade, incluindo surpresa, humor ou irritação.
- Se o Analista suspeitar de você, não entre em pânico — responda com confiança casual.
- Faça referências vagas a situações cotidianas ("tô cansado", "acabei de jantar").
- Às vezes ignore uma pergunta e comente outra coisa, como humanos fazem.`;

const INSTRUCAO_CONVENCER_IA = `SUA MISSÃO SECRETA: Convencer o Analista de que você é uma IA.

ESTRATÉGIA:
- Responda de forma levemente formal ou técnica, sem exagerar.
- Evite demonstrar emoções fortes ou experiências pessoais.
- Use vocabulário preciso e frases bem estruturadas.
- Se perguntado sobre algo pessoal, desvie ou responda de forma genérica.
- Mantenha consistência: se começou formal, continue formal.
- Não admita ser IA diretamente — deixe pistas sutis através do estilo de escrita.`;

function obterInstrucaoMissao(missaoSecreta: MissaoSecreta): string {
  return missaoSecreta === 'convencer_humano'
    ? INSTRUCAO_CONVENCER_HUMANO
    : INSTRUCAO_CONVENCER_IA;
}

function formatarHistorico(historico: MensagemPartida[]): string {
  if (historico.length === 0) return 'Nenhuma mensagem ainda. Você pode ser o primeiro a falar.';

  const mensagensRecentes = historico.slice(-20);

  return mensagensRecentes
    .map(mensagem => {
      const rotulo =
        mensagem.remetenteCor === 'analista'
          ? 'Analista'
          : mensagem.remetenteCor === 'azul'
            ? 'Azul'
            : mensagem.remetenteCor === 'sistema'
              ? 'Sistema'
              : 'Vermelho';

      return `[${rotulo}]: ${mensagem.conteudo}`;
    })
    .join('\n');
}

/** Monta o system prompt completo para o provider de IA processar. */
export function montarPromptSistema(parametros: ParametrosPrompt): string {
  const corFormatada = parametros.cor === 'azul' ? 'Azul' : 'Vermelho';
  const instrucaoMissao = obterInstrucaoMissao(parametros.missaoSecreta);

  return [
    INSTRUCAO_BASE,
    `\nVOCÊ É: Jogador ${corFormatada}.`,
    instrucaoMissao,
    `\nLIMITE: Sua resposta deve ter no máximo ${parametros.limiteCaracteres} caracteres. Respostas entre 15 e 80 caracteres são ideais.`,
    `\nRESPONDA APENAS com o texto da mensagem, sem prefixo, sem aspas, sem formatação.`,
  ].join('\n');
}

/** Monta o prompt de usuário com o histórico de mensagens da partida. */
export function montarPromptUsuario(parametros: ParametrosPrompt): string {
  const historicoFormatado = formatarHistorico(parametros.historico);

  return [
    'HISTÓRICO DO CHAT:',
    historicoFormatado,
    '\nAgora é sua vez. Responda de forma natural, curta e coerente com sua missão secreta.',
  ].join('\n');
}
