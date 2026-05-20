import type { CorParticipante, MensagemPartida, MissaoSecreta } from '@/domain/jogo';

export type SolicitarRespostaIaParametros = {
  cor: Extract<CorParticipante, 'azul' | 'vermelho'>;
  missaoSecreta: MissaoSecreta;
  historico: MensagemPartida[];
  limiteCaracteres: number;
};

export type RespostaIa = {
  texto: string;
  provider: string;
};

export type ProvedorIa = {
  nome: string;
  gerarResposta(parametros: SolicitarRespostaIaParametros): Promise<RespostaIa>;
};
