-- Collection Analytics Schema
-- Tracks collection performance, views, clicks, and conversions
-- Date: January 16, 2026

-- ========================================
-- 1. COLLECTION EVENTS TABLE
-- ========================================

create table if not exists collection_events (
  id text primary key default gen_random_uuid()::text,
  store_id text not null references stores(id) on delete cascade,
  collection_id text references collections(id) on delete cascade,
  section_id text, -- Which page section displayed the collection
  event_type text not null, -- 'view', 'click', 'add_to_cart', 'purchase'
  product_id text references products(id) on delete set null,
  customer_id text references customers(id) on delete set null,
  session_id text, -- For tracking anonymous users
  revenue numeric(10,2) default 0, -- For purchase events
  metadata jsonb default '{}', -- Additional context
  created_at timestamptz default now()
);

-- Indexes for fast analytics queries
create index if not exists idx_collection_events_collection on collection_events(collection_id);
create index if not exists idx_collection_events_store on collection_events(store_id);
create index if not exists idx_collection_events_type on collection_events(event_type);
create index if not exists idx_collection_events_product on collection_events(product_id);
create index if not exists idx_collection_events_created on collection_events(created_at desc);
create index if not exists idx_collection_events_store_created on collection_events(store_id, created_at desc);

-- Composite index for common queries
create index if not exists idx_collection_events_analytics 
  on collection_events(store_id, collection_id, event_type, created_at desc);

-- ========================================
-- 2. COLLECTION STATISTICS (Materialized View)
-- ========================================

-- Aggregated stats per collection for fast dashboard queries
create table if not exists collection_stats (
  id text primary key default gen_random_uuid()::text,
  store_id text not null references stores(id) on delete cascade,
  collection_id text not null references collections(id) on delete cascade,
  period text not null, -- 'today', 'week', 'month', 'all_time'
  views integer default 0,
  clicks integer default 0,
  add_to_carts integer default 0,
  purchases integer default 0,
  revenue numeric(10,2) default 0,
  conversion_rate numeric(5,2) default 0, -- (purchases / views) * 100
  avg_order_value numeric(10,2) default 0,
  last_updated timestamptz default now(),
  unique (store_id, collection_id, period)
);

create index if not exists idx_collection_stats_collection on collection_stats(collection_id);
create index if not exists idx_collection_stats_store on collection_stats(store_id);
create index if not exists idx_collection_stats_period on collection_stats(period);

-- ========================================
-- 3. PRODUCT PERFORMANCE IN COLLECTIONS
-- ========================================

-- Track which products perform best in which collections
create table if not exists collection_product_stats (
  id text primary key default gen_random_uuid()::text,
  store_id text not null references stores(id) on delete cascade,
  collection_id text not null references collections(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  period text not null, -- 'today', 'week', 'month', 'all_time'
  views integer default 0,
  clicks integer default 0,
  add_to_carts integer default 0,
  purchases integer default 0,
  revenue numeric(10,2) default 0,
  click_through_rate numeric(5,2) default 0, -- (clicks / views) * 100
  conversion_rate numeric(5,2) default 0, -- (purchases / clicks) * 100
  last_updated timestamptz default now(),
  unique (store_id, collection_id, product_id, period)
);

create index if not exists idx_coll_prod_stats_collection on collection_product_stats(collection_id);
create index if not exists idx_coll_prod_stats_product on collection_product_stats(product_id);
create index if not exists idx_coll_prod_stats_period on collection_product_stats(period);

-- ========================================
-- 4. TRENDING COLLECTIONS
-- ========================================

-- View to identify trending collections (high recent activity)
create or replace view trending_collections as
select 
  c.id,
  c.name,
  c.store_id,
  count(ce.id) filter (where ce.created_at > now() - interval '7 days') as recent_activity,
  count(ce.id) filter (where ce.event_type = 'purchase' and ce.created_at > now() - interval '7 days') as recent_purchases,
  sum(ce.revenue) filter (where ce.created_at > now() - interval '7 days') as recent_revenue,
  count(distinct ce.customer_id) filter (where ce.created_at > now() - interval '7 days') as unique_customers,
  (count(ce.id) filter (where ce.created_at > now() - interval '7 days')::float / 
   nullif(count(ce.id) filter (where ce.created_at > now() - interval '14 days' and ce.created_at <= now() - interval '7 days'), 0)) as growth_rate
from collections c
left join collection_events ce on c.id = ce.collection_id
group by c.id, c.name, c.store_id
having count(ce.id) filter (where ce.created_at > now() - interval '7 days') > 0
order by recent_activity desc;

-- ========================================
-- 5. FUNCTIONS FOR ANALYTICS
-- ========================================

-- Function to track a collection event
create or replace function track_collection_event(
  p_store_id text,
  p_collection_id text,
  p_section_id text,
  p_event_type text,
  p_product_id text default null,
  p_customer_id text default null,
  p_session_id text default null,
  p_revenue numeric default 0,
  p_metadata jsonb default '{}'
) returns text as $$
declare
  v_event_id text;
begin
  insert into collection_events (
    store_id,
    collection_id,
    section_id,
    event_type,
    product_id,
    customer_id,
    session_id,
    revenue,
    metadata
  ) values (
    p_store_id,
    p_collection_id,
    p_section_id,
    p_event_type,
    p_product_id,
    p_customer_id,
    p_session_id,
    p_revenue,
    p_metadata
  ) returning id into v_event_id;
  
  return v_event_id;
end;
$$ language plpgsql;

-- Function to update collection statistics
create or replace function update_collection_stats(p_store_id text, p_collection_id text, p_period text)
returns void as $$
declare
  v_date_filter timestamptz;
  v_views integer;
  v_clicks integer;
  v_add_to_carts integer;
  v_purchases integer;
  v_revenue numeric;
  v_conversion_rate numeric;
  v_avg_order_value numeric;
begin
  -- Determine date filter based on period
  case p_period
    when 'today' then v_date_filter := date_trunc('day', now());
    when 'week' then v_date_filter := date_trunc('week', now());
    when 'month' then v_date_filter := date_trunc('month', now());
    else v_date_filter := '1970-01-01'::timestamptz; -- all_time
  end case;

  -- Calculate metrics
  select
    count(*) filter (where event_type = 'view'),
    count(*) filter (where event_type = 'click'),
    count(*) filter (where event_type = 'add_to_cart'),
    count(*) filter (where event_type = 'purchase'),
    coalesce(sum(revenue) filter (where event_type = 'purchase'), 0)
  into v_views, v_clicks, v_add_to_carts, v_purchases, v_revenue
  from collection_events
  where store_id = p_store_id
    and collection_id = p_collection_id
    and created_at >= v_date_filter;

  -- Calculate derived metrics
  v_conversion_rate := case when v_views > 0 then (v_purchases::numeric / v_views * 100) else 0 end;
  v_avg_order_value := case when v_purchases > 0 then (v_revenue / v_purchases) else 0 end;

  -- Upsert statistics
  insert into collection_stats (
    store_id,
    collection_id,
    period,
    views,
    clicks,
    add_to_carts,
    purchases,
    revenue,
    conversion_rate,
    avg_order_value,
    last_updated
  ) values (
    p_store_id,
    p_collection_id,
    p_period,
    v_views,
    v_clicks,
    v_add_to_carts,
    v_purchases,
    v_revenue,
    v_conversion_rate,
    v_avg_order_value,
    now()
  )
  on conflict (store_id, collection_id, period)
  do update set
    views = excluded.views,
    clicks = excluded.clicks,
    add_to_carts = excluded.add_to_carts,
    purchases = excluded.purchases,
    revenue = excluded.revenue,
    conversion_rate = excluded.conversion_rate,
    avg_order_value = excluded.avg_order_value,
    last_updated = now();
end;
$$ language plpgsql;

-- Function to get top performing products in a collection
create or replace function get_top_collection_products(
  p_collection_id text,
  p_period text default 'all_time',
  p_limit integer default 10
) returns table (
  product_id text,
  product_name text,
  views integer,
  clicks integer,
  purchases integer,
  revenue numeric,
  conversion_rate numeric
) as $$
declare
  v_date_filter timestamptz;
begin
  -- Determine date filter
  case p_period
    when 'today' then v_date_filter := date_trunc('day', now());
    when 'week' then v_date_filter := date_trunc('week', now());
    when 'month' then v_date_filter := date_trunc('month', now());
    else v_date_filter := '1970-01-01'::timestamptz;
  end case;

  return query
  select
    p.id,
    p.name,
    count(*) filter (where ce.event_type = 'view')::integer,
    count(*) filter (where ce.event_type = 'click')::integer,
    count(*) filter (where ce.event_type = 'purchase')::integer,
    coalesce(sum(ce.revenue) filter (where ce.event_type = 'purchase'), 0),
    case 
      when count(*) filter (where ce.event_type = 'click') > 0 
      then (count(*) filter (where ce.event_type = 'purchase')::numeric / 
            count(*) filter (where ce.event_type = 'click') * 100)
      else 0
    end
  from products p
  join collection_events ce on p.id = ce.product_id
  where ce.collection_id = p_collection_id
    and ce.created_at >= v_date_filter
  group by p.id, p.name
  order by count(*) filter (where ce.event_type = 'purchase') desc
  limit p_limit;
end;
$$ language plpgsql;

-- ========================================
-- 6. RLS POLICIES
-- ========================================

-- Enable RLS
alter table collection_events enable row level security;
alter table collection_stats enable row level security;
alter table collection_product_stats enable row level security;

-- Store owners can manage their own analytics
create policy "Store owners manage collection events"
  on collection_events for all
  using (store_id in (select id from stores where owner_id = auth.uid()));

create policy "Store owners view collection stats"
  on collection_stats for select
  using (store_id in (select id from stores where owner_id = auth.uid()));

create policy "Store owners view product stats"
  on collection_product_stats for select
  using (store_id in (select id from stores where owner_id = auth.uid()));

-- Public can track events (for storefront)
create policy "Public can insert collection events"
  on collection_events for insert
  with check (true);

-- ========================================
-- 7. TRIGGERS
-- ========================================

-- Auto-update stats when events are inserted
create or replace function trigger_update_collection_stats()
returns trigger as $$
begin
  -- Update all time periods
  perform update_collection_stats(new.store_id, new.collection_id, 'today');
  perform update_collection_stats(new.store_id, new.collection_id, 'week');
  perform update_collection_stats(new.store_id, new.collection_id, 'month');
  perform update_collection_stats(new.store_id, new.collection_id, 'all_time');
  return new;
end;
$$ language plpgsql;

-- Note: Trigger disabled by default for performance - stats can be updated via cron
-- create trigger update_stats_on_event
--   after insert on collection_events
--   for each row
--   execute function trigger_update_collection_stats();

-- ========================================
-- 8. SAMPLE QUERIES (COMMENTED)
-- ========================================

-- Get collection performance summary
-- select * from collection_stats where store_id = 'your-store-id' and period = 'week' order by revenue desc limit 10;

-- Get trending collections
-- select * from trending_collections where store_id = 'your-store-id' limit 10;

-- Get top products in a collection
-- select * from get_top_collection_products('collection-id', 'week', 10);

-- Get conversion funnel
-- select 
--   collection_id,
--   count(*) filter (where event_type = 'view') as views,
--   count(*) filter (where event_type = 'click') as clicks,
--   count(*) filter (where event_type = 'add_to_cart') as carts,
--   count(*) filter (where event_type = 'purchase') as purchases
-- from collection_events
-- where store_id = 'your-store-id' and created_at > now() - interval '7 days'
-- group by collection_id;
