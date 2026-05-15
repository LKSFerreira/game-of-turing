export type UserProfile = {
  id: string;
  username: string;
  mmr_analyst: number;
  mmr_player: number;
  currency_balance: number;
};

export type MatchStatus = 'waiting' | 'in_progress' | 'finished';
export type PlayerType = 'human' | 'ai';
export type PlayerRole = 'analyst' | 'interlocutor';
export type PlayerColor = 'blue' | 'red' | 'analyst';
export type SecretMission = 'A' | 'B';

export type Match = {
  id: string;
  status: MatchStatus;
  created_at: string;
  ended_at: string | null;
  analyst_id: string | null;
  analyst_verdict_blue: PlayerType | null;
  analyst_verdict_red: PlayerType | null;
  blue_player_type: PlayerType | null;
  red_player_type: PlayerType | null;
};

export type MatchParticipant = {
  id: string;
  match_id: string;
  user_id: string | null;
  role: PlayerRole;
  color: PlayerColor | null;
  secret_mission: SecretMission | null;
  characters_used: number;
};

export type ChatMessage = {
  id: string;
  match_id: string;
  sender_color: PlayerColor | 'system';
  content: string;
  created_at: string;
};
