-- Add auth_user_id to customers table to link with Supabase Auth
alter table customers add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

-- Add index for performance
create index if not exists idx_customers_auth_user_id on customers(auth_user_id);

-- RLS Policies for Customers

-- 1. Customers can read their own profile
create policy "Customer Read Own Data" on customers
  for select using (auth.uid() = auth_user_id);

-- 2. Customers can update their own profile
create policy "Customer Update Own Data" on customers
  for update using (auth.uid() = auth_user_id);

-- 3. Customers can read their own orders
create policy "Customer Read Own Orders" on orders
  for select using (
    customer_id in (
      select id from customers where auth_user_id = auth.uid()
    )
  );

-- 4. Customers can read their own order items
create policy "Customer Read Own Order Items" on order_items
  for select using (
    order_id in (
      select id from orders where customer_id in (
        select id from customers where auth_user_id = auth.uid()
      )
    )
  );

-- 5. Allow authenticated users to insert a customer record (for signup)
-- We need to ensure they can only insert a record for themselves
create policy "Customer Insert Own Data" on customers
  for insert with check (auth.uid() = auth_user_id);
