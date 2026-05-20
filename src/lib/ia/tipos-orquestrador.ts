import type { ProvedorIa } from './tipos';

export type EstadoCircuitBreaker = 'fechado' | 'aberto' | 'meio_aberto';

export type EstadoSaude = {
  circuitBreaker: EstadoCircuitBreaker;
  falhasConsecutivas: number;
  ultimaFalha: number | null;
  latenciaMedia: number;
  totalRequisicoes: number;
  totalErros: number;
};

export type ConfiguracaoProvider = {
  nome: string;
  peso: number;
  tempoRecuperacao: number;
  limiteErros: number;
};

export type RegistroProvider = {
  provedor: ProvedorIa;
  configuracao: ConfiguracaoProvider;
  saude: EstadoSaude;
};

export type ConfiguracaoOrquestrador = {
  providers: ConfiguracaoProviderComInstancia[];
  tempoRecuperacaoPadrao: number;
  limiteErrosPadrao: number;
};

export type ConfiguracaoProviderComInstancia = {
  provedor: ProvedorIa;
  peso: number;
  tempoRecuperacao?: number;
  limiteErros?: number;
};

export class ErroIndisponibilidadeIa extends Error {
  constructor() {
    super(
      'Todos os provedores de IA estão indisponíveis. A partida será encerrada sem vencedor e sem prejuízo à pontuação.',
    );
    this.name = 'ErroIndisponibilidadeIa';
  }
}
