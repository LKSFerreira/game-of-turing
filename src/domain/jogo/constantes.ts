// ── Regras de Mensagens ───────────────────────────────────────────
/** Quantidade mínima de caracteres permitidos em uma única mensagem do chat. */
export const LIMITE_MINIMO_CARACTERES_MENSAGEM = 10;

/** Quantidade máxima de caracteres permitidos em uma mensagem do chat para evitar spam. */
export const LIMITE_MAXIMO_CARACTERES_MENSAGEM = 200;

/** Limite máximo de vezes que um mesmo caractere pode ser repetido em sequência na mensagem (ex: "kkkkkkkkkk"). */
export const LIMITE_MAXIMO_CARACTERES_REPETIDOS_SEQUENCIA = 10;

/** Lista de termos ou expressões chulas/ofensivas bloqueadas para participantes humanos. */
export const PALAVRAS_BLOQUEADAS = [
  // Termos clássicos e variações
  'porra',
  'porras',
  'porrada',
  'porradaria',
  'caralho',
  'caralhos',
  'caralha',
  'caralhada',
  'foder',
  'foda',
  'fodase',
  'foda-se',
  'fode',
  'fodem',
  'fodendo',
  'merda',
  'merdas',
  'merdoso',
  'merdosa',
  'bosta',
  'bostas',
  'bostinha',
  'bostao',
  'bostão',
  
  // Ofensas pessoais e termos chulos (femininos/masculinos/plurais)
  'puta',
  'putas',
  'puto',
  'putos',
  'putaria',
  'putaqueopariu',
  'puta que pariu',
  'filho da puta',
  'filhos da puta',
  'filho duma puta',
  'filhos duma puta',
  'viado',
  'viados',
  'veado',
  'veados',
  'viadagem',
  'bicha',
  'bichas',
  'bichona',
  'baitola',
  'baitolas',
  'arrombado',
  'arrombada',
  'arrombados',
  'arrombadas',
  'cuzao',
  'cuzão',
  'cuzona',
  'cuzonas',
  'cuzinho',
  'cuzinhos',
  'cu',
  'escroto',
  'escrota',
  'escrotos',
  'escrotas',
  'babaca',
  'babacas',
  'imbecil',
  'imbecis',
  'otario',
  'otário',
  'otaria',
  'otária',
  'otarios',
  'otários',
  'retardado',
  'retardada',
  'retardados',
  'retardadas',
  'corno',
  'cornos',
  'corna',
  'cornas',
  'vagabundo',
  'vagabunda',
  'vagabundos',
  'vagabundas',
  'piranha',
  'piranhas',
  
  // Partes do corpo e atos (termos vulgares)
  'pau',
  'paus',
  'pica',
  'picas',
  'pinto',
  'pintos',
  'cacete',
  'caceta',
  'cacetas',
  'buceta',
  'bucetas',
  'xereca',
  'xoxota',
  'boga',
  'cagar',
  'cagado',
  'cagada',
  'mijar',
  'mijo',
  'chupa',
  'chupar',
  'gozar',
  'gozo',
  'gozada',
  'punheta',
  'punheteiro',
  'siririca',
  'penis',
  'pênis',
  'vagina',
  'anus',
  'ânus',
  
  // Siglas comuns de internet
  'fdp',
  'fdps',
  'pqp',
  'vtnc',
  'vtc',
  'sfd',
  
  // Ofensas em inglês comuns
  'fuck',
  'shit',
  'asshole',
  'bitch',
  'bitches',
  'bastard',
  'bastards',
  'motherfucker',
  'cunt',
  'dick',
  'dicks',
  'pussy',
  'pussies',
  'slut',
  'sluts',
  'faggot'
];

// ── Controle da Partida ───────────────────────────────────────────
/** Duração total padrão da fase de chat em segundos (ex: 3 minutos). */
export const DURACAO_PADRAO_PARTIDA_SEGUNDOS = 180;

/** Duração da tela de veredito/revelação em segundos antes da partida ser fechada automaticamente. */
export const DURACAO_PADRAO_VEREDITO_SEGUNDOS = 15;

/** Tempo de espera obrigatório (cooldown) em segundos entre o envio de mensagens pelo Analista. */
export const COOLDOWN_PADRAO_SEGUNDOS = 3;

/** Orçamento máximo total de caracteres que um bot ou jogador pode gastar durante toda a partida. */
export const ORCAMENTO_PADRAO_JOGADOR = 3000;
