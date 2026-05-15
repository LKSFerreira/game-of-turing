export type FasePartida =
  | 'lobby'
  | 'em_andamento'
  | 'veredito'
  | 'revelacao'
  | 'encerrada';

export type PapelParticipante = 'analista' | 'interlocutor';
export type CorParticipante = 'analista' | 'azul' | 'vermelho' | 'sistema';
export type NaturezaParticipante = 'humano' | 'ia';
export type ControleParticipante = 'humano' | 'ia' | 'sistema';
export type MissaoSecreta = 'convencer_humano' | 'convencer_ia';

export type VereditoAnalista = {
  azul: NaturezaParticipante;
  vermelho: NaturezaParticipante;
};

export type ParticipantePartida = {
  id: string;
  nome: string;
  papel: PapelParticipante;
  cor: CorParticipante;
  natureza: NaturezaParticipante;
  controle: ControleParticipante;
  missaoSecreta: MissaoSecreta | null;
  caracteresUsados: number;
  ultimoEnvioEm: string | null;
};

export type MensagemPartida = {
  id: string;
  partidaId: string;
  remetenteId: string;
  remetenteCor: CorParticipante;
  conteudo: string;
  criadaEm: string;
};

export type Partida = {
  id: string;
  fase: FasePartida;
  criadaEm: string;
  iniciadaEm: string;
  encerradaEm: string | null;
  duracaoSegundos: number;
  faseVereditoSegundos: number;
  cooldownSegundos: number;
  orcamentoCaracteresInterlocutor: number;
  participantes: ParticipantePartida[];
  mensagens: MensagemPartida[];
  vereditoAnalista: VereditoAnalista | null;
};

export type ResultadoValidacao =
  | { valido: true; conteudoNormalizado: string }
  | { valido: false; motivo: string };

export type ResultadoParticipante = {
  participanteId: string;
  venceu: boolean;
  ajusteMmr: number;
  bonusParticipacao: number;
  caracteresUsados: number;
  mensagensEnviadas: number;
  palavrasPorMinuto: number;
};

export type ResultadoPartida = {
  analistaVenceu: boolean;
  vereditoCorretoAzul: boolean;
  vereditoCorretoVermelho: boolean;
  participantes: ResultadoParticipante[];
};
