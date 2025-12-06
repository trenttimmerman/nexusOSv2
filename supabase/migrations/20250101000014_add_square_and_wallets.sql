
-- Add Square and Wallet config to store_config
alter table store_config
add column if not exists square_application_id text,
add column if not exists square_location_id text,
add column if not exists enable_apple_pay boolean default false,
add column if not exists enable_google_pay boolean default false;

-- Add Square secret to store_secrets
alter table store_secrets
add column if not exists square_access_token text;
