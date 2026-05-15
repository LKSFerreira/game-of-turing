-- Schema definitions for Game of Turing
-- Paste this script in the Supabase SQL Editor

-- 1. Users Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID references auth.users on delete cascade not null primary key,
  username TEXT unique not null,
  mmr_analyst INTEGER default 1000,
  mmr_player INTEGER default 1000,
  currency_balance INTEGER default 0,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

-- Realtime for profiles
alter publication supabase_realtime add table public.profiles;

-- 2. Matches Table
CREATE TABLE public.matches (
  id UUID default gen_random_uuid() primary key,
  status TEXT not null check (status in ('waiting', 'in_progress', 'finished')),
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null,
  ended_at TIMESTAMP WITH TIME ZONE,
  analyst_id UUID references public.profiles(id),
  analyst_verdict_blue TEXT check (analyst_verdict_blue in ('human', 'ai', null)),
  analyst_verdict_red TEXT check (analyst_verdict_red in ('human', 'ai', null)),
  blue_player_type TEXT check (blue_player_type in ('human', 'ai')),
  red_player_type TEXT check (red_player_type in ('human', 'ai'))
);
alter publication supabase_realtime add table public.matches;

-- 3. Match Participants Table
CREATE TABLE public.match_participants (
  id UUID default gen_random_uuid() primary key,
  match_id UUID references public.matches(id) on delete cascade not null,
  user_id UUID references public.profiles(id), -- null for AI
  role TEXT not null check (role in ('analyst', 'interlocutor')),
  color TEXT check (color in ('blue', 'red', null)),
  secret_mission TEXT check (secret_mission in ('A', 'B', null)), -- A: Convince is human, B: Convince is AI
  characters_used INTEGER default 0,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);
alter publication supabase_realtime add table public.match_participants;

-- 4. Messages Table (for history/auditing, though realtime broadcast handles active chat)
CREATE TABLE public.messages (
  id UUID default gen_random_uuid() primary key,
  match_id UUID references public.matches(id) on delete cascade not null,
  sender_color TEXT check (sender_color in ('blue', 'red', 'analyst', 'system')),
  content TEXT not null,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) - Basic setup for MVP
alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.messages enable row level security;

-- Policies (Permissive for MVP, harden later)
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Matches are viewable by everyone." on public.matches for select using (true);
create policy "Authenticated users can create matches." on public.matches for insert with check (auth.role() = 'authenticated');
create policy "Participants can update match." on public.matches for update using (true); -- For MVP simplicity

create policy "Participants viewable." on public.match_participants for select using (true);
create policy "Auth users can join." on public.match_participants for insert with check (auth.role() = 'authenticated');
create policy "Participants can update." on public.match_participants for update using (true);

create policy "Anyone can read messages." on public.messages for select using (true);
create policy "Auth users can insert messages." on public.messages for insert with check (auth.role() = 'authenticated');
