-- Migration: 0009_notification_preferences.sql
-- Notification preferences for multichannel dispatch (Email, SMS, WhatsApp)

create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone text,
  email_enabled boolean not null default true,
  sms_enabled boolean not null default true,
  whatsapp_enabled boolean not null default true,
  events jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_preferences_user_id_key unique (user_id)
);

create index if not exists notification_preferences_user_id_idx on public.notification_preferences(user_id);
create index if not exists notification_preferences_phone_idx on public.notification_preferences(phone);

alter table public.notification_preferences enable row level security;

create policy "Users can view own notification preferences"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own notification preferences"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notification preferences"
  on public.notification_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
