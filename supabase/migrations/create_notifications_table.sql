create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    surprise_id uuid references public.surprises(id) on delete cascade not null,
    type text check (type in ('created', 'paid', 'viewed')) not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    read boolean default false not null
);

-- Criar índices para melhor performance
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_surprise_id_idx on public.notifications(surprise_id);
create index notifications_created_at_idx on public.notifications(created_at desc);

-- Habilitar RLS
alter table public.notifications enable row level security;

-- Políticas de segurança
create policy "Users can view their own notifications"
    on notifications for select
    using (auth.uid() = user_id);

create policy "System can insert notifications"
    on notifications for insert
    with check (true);

create policy "Users can update their own notifications"
    on notifications for update
    using (auth.uid() = user_id); 