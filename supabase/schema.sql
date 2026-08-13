-- =====================================================================
--  RIFA SOLIDÁRIA — JOSELETE
--  Rode este script inteiro no SQL Editor do Supabase.
--  Pode ser rodado mais de uma vez sem duplicar dados.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Tabela dos 50 números
-- ---------------------------------------------------------------------
create table if not exists public.rifa_numeros (
  id              integer     primary key check (id between 1 and 50),
  status          text        not null default 'disponivel'
                              check (status in ('disponivel', 'reservado', 'pago')),
  nome_comprador  text,
  email_comprador text,
  data_reserva    timestamptz
);

comment on table public.rifa_numeros is
  'As 50 cotas de R$ 1.000,00 da rifa solidária.';


-- ---------------------------------------------------------------------
-- 2. Cria os números de 1 a 50
-- ---------------------------------------------------------------------
insert into public.rifa_numeros (id)
select generate_series(1, 50)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 3. Tranca a tabela
--    Ninguém acessa a tabela direto pelo navegador. O site enxerga
--    apenas a view do passo 4; o painel admin usa a service role key,
--    que roda no servidor e ignora RLS.
-- ---------------------------------------------------------------------
alter table public.rifa_numeros enable row level security;

revoke all on public.rifa_numeros from anon, authenticated;


-- ---------------------------------------------------------------------
-- 4. View pública: só número e status
--    Evita expor nome e e-mail dos compradores para o mundo.
-- ---------------------------------------------------------------------
create or replace view public.rifa_numeros_publico
with (security_invoker = off)
as
  select id, status
    from public.rifa_numeros;

grant select on public.rifa_numeros_publico to anon, authenticated;


-- ---------------------------------------------------------------------
-- 5. Reserva de número
--    O UPDATE com "and status = 'disponivel'" é a trava de concorrência:
--    se duas pessoas clicarem no mesmo número no mesmo instante, a
--    segunda transação reavalia a condição depois do lock e atualiza
--    0 linhas — então ela recebe o aviso em vez de sobrescrever a
--    reserva da primeira.
-- ---------------------------------------------------------------------
create or replace function public.reservar_numero(
  p_id    integer,
  p_nome  text,
  p_email text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nome  text := btrim(coalesce(p_nome, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_linhas integer;
begin
  if length(v_nome) < 3 then
    return json_build_object('ok', false, 'erro', 'Informe seu nome completo.');
  end if;

  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return json_build_object('ok', false, 'erro', 'Informe um e-mail válido.');
  end if;

  if p_id is null or p_id < 1 or p_id > 50 then
    return json_build_object('ok', false, 'erro', 'Número inválido.');
  end if;

  update public.rifa_numeros
     set status          = 'reservado',
         nome_comprador  = left(v_nome, 120),
         email_comprador = left(v_email, 160),
         data_reserva    = now()
   where id     = p_id
     and status = 'disponivel';

  get diagnostics v_linhas = row_count;

  if v_linhas = 0 then
    return json_build_object(
      'ok',   false,
      'erro', 'Este número acabou de ser reservado por outra pessoa. Por favor, escolha outro.'
    );
  end if;

  return json_build_object('ok', true);
end;
$$;

revoke all     on function public.reservar_numero(integer, text, text) from public;
grant  execute on function public.reservar_numero(integer, text, text) to anon, authenticated;
