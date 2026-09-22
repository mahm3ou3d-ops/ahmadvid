-- AhmadVid database schema (Supabase)
-- Run this in Supabase Dashboard > SQL Editor.

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 150),
  description text default '',
  category text not null default 'تعليم',
  channel_name text not null,
  video_url text not null,
  thumbnail_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  views integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;
create policy "Published videos are public" on public.videos for select using (status = 'published');
create policy "Users can insert their own videos" on public.videos for insert with check (auth.uid() = user_id);
create policy "Users can update their own videos" on public.videos for update using (auth.uid() = user_id);
create policy "Users can delete their own videos" on public.videos for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict (id) do nothing;
create policy "Public can read videos" on storage.objects for select using (bucket_id = 'videos');
create policy "Authenticated users can upload videos" on storage.objects for insert to authenticated with check (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "Users can update their video files" on storage.objects for update to authenticated using (bucket_id = 'videos' and owner_id = auth.uid()::text);
create policy "Users can delete their video files" on storage.objects for delete to authenticated using (bucket_id = 'videos' and owner_id = auth.uid()::text);
