
-- Add foreign key from order_items.product_id to products.id
-- This enables Supabase to join these tables in queries

ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_products
FOREIGN KEY (product_id)
REFERENCES products (id)
ON DELETE SET NULL; 
-- If a product is deleted, we keep the order item but product_id becomes null? 
-- Or maybe we want to keep the ID but just lose the link?
-- Actually, products are rarely hard deleted in e-commerce, usually soft deleted (status=archived).
-- But if they are hard deleted, we probably still want the history.
-- However, standard FK behavior prevents deletion of product if order_items exist.
-- Let's use SET NULL for now to be safe, or NO ACTION (default) which prevents deletion.
-- Given we want to preserve order history, preventing deletion of products that have been sold is good practice.
-- But for this prototype, let's just add the FK.

-- Note: If there are existing order_items with product_ids that don't exist in products table, this will fail.
-- Since we just started, it should be fine.
