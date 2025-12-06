-- Fix store_config Primary Key issue
-- The original table had 'id' as PK with default 1, which prevents multiple tenants from being created.

-- 1. Remove legacy default config that has no store_id
delete from store_config where store_id is null;

-- 2. Drop the old Primary Key and ID column
alter table store_config drop constraint if exists store_config_pkey;
alter table store_config drop column if exists id;

-- 3. Make store_id the new Primary Key
alter table store_config add primary key (store_id);

-- 4. Ensure RLS is enabled (just in case)
alter table store_config enable row level security;
