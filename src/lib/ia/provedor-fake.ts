import type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';

const RESPOSTAS_CONVENCER_HUMANO = [
  'Eu responderia com mais contexto, mas prefiro ser direto: isso parece uma pergunta armadilha.',
  'Boa pergunta. Eu pensaria primeiro na intenção de quem está tentando me rotular.',
  'Se eu fosse IA, provavelmente tentaria soar perfeito demais. Não é meu caso.',
  'A resposta curta é: eu erro, hesito e mudo de ideia. Isso também comunica algo.',
];

const RESPOSTAS_CONVENCER_IA = [
  'Processando hipótese: sua pergunta tenta medir espontaneidade, mas o sinal é inconclusivo.',
  'Resposta otimizada: posso simular hesitação, mas isso não prova humanidade.',
  'Classificação difícil. Meu padrão textual pode parecer artificial de propósito.',
  'Eu escolheria a resposta estatisticamente mais segura, mesmo que soe calculada.',
];

function obterUltimaMensagemDoAnalista(parametros: SolicitarRespostaIaParametros): string {
  const mensagem = [...parametros.historico]
    .reverse()
    .find(mensagemAtual => mensagemAtual.remetenteCor === 'analista');

  return mensagem?.conteudo ?? '';
}

function escolherResposta(parametros: SolicitarRespostaIaParametros): string {
  const bancoRespostas =
    parametros.missaoSecreta === 'convencer_humano'
      ? RESPOSTAS_CONVENCER_HUMANO
      : RESPOSTAS_CONVENCER_IA;
  const ultimaMensagemAnalista = obterUltimaMensagemDoAnalista(parametros);
  const indice =
    (ultimaMensagemAnalista.length + parametros.historico.length + parametros.cor.length) %
    bancoRespostas.length;

  return bancoRespostas[indice];
}

function limitarResposta(texto: string, limiteCaracteres: number): string {
  if (texto.length <= limiteCaracteres) {
    return texto;
  }

  return texto.slice(0, limiteCaracteres - 1).trimEnd() + '…';
}

export const provedorFakeIa: ProvedorIa = {
  nome: 'fake',
  async gerarResposta(parametros): Promise<RespostaIa> {
    return {
      texto: limitarResposta(escolherResposta(parametros), parametros.limiteCaracteres),
      provider: this.nome,
    };
  },
};
