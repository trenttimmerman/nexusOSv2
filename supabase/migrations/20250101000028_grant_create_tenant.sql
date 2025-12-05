-- Grant execute permission on create_tenant to authenticated users
-- This allows newly signed up users to create their own store
grant execute on function create_tenant to authenticated;
