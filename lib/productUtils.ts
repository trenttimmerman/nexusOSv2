import { Product, Collection } from '../types';

export const getFilteredProducts = (data: any, products: Product[], collections: Collection[]): Product[] => {
  let filteredProducts = [...products];
  const productSource = data?.productSource || 'all';
  
  // Apply filtering based on productSource
  switch (productSource) {
    case 'category':
      if (data?.productCategory) {
        filteredProducts = filteredProducts.filter(p => 
          p.category_id === data.productCategory || 
          p.category?.toLowerCase() === data.productCategory.toLowerCase()
        );
      }
      break;
    case 'collection':
      if (data?.productCollection && collections && collections.length > 0) {
        const collection = collections.find(c => c.id === data.productCollection);
        if (collection) {
          if (collection.type === 'manual' && collection.product_ids) {
            filteredProducts = collection.product_ids
              .map((id: string) => products.find(p => p.id === id))
              .filter(Boolean) as Product[];
          } else if (collection.type === 'auto-category' && collection.conditions?.category_id) {
            filteredProducts = filteredProducts.filter(p => 
              p.category_id === collection.conditions?.category_id
            );
          } else if (collection.type === 'auto-tag' && collection.conditions?.tags) {
            filteredProducts = filteredProducts.filter(p => 
              p.tags?.some((tag: string) => collection.conditions?.tags?.includes(tag))
            );
          } else if (collection.type === 'auto-newest') {
            filteredProducts = [...filteredProducts].sort((a, b) => 
              new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            );
            const limit = collection.conditions?.limit || 12;
            filteredProducts = filteredProducts.slice(0, limit);
          } else if (collection.type === 'auto-bestsellers') {
            filteredProducts = [...filteredProducts].sort((a, b) => 
              (b.total_sales || 0) - (a.total_sales || 0)
            );
            const limit = collection.conditions?.limit || 12;
            filteredProducts = filteredProducts.slice(0, limit);
          }
        }
      }
      break;
    case 'tag':
      if (data?.productTag) {
        filteredProducts = filteredProducts.filter(p => 
          p.tags?.includes(data.productTag)
        );
      }
      break;
    case 'manual':
      if (data?.selectedProducts && data.selectedProducts.length > 0) {
        filteredProducts = data.selectedProducts
          .map((id: string) => products.find(p => p.id === id))
          .filter(Boolean) as Product[];
      } else if (data?.productIds && Array.isArray(data.productIds)) {
        filteredProducts = data.productIds
          .map((id: string) => products.find(p => p.id === id))
          .filter(Boolean) as Product[];
      }
      break;
    default:
      // Default is 'all', no primary filter needed
      break;
  }

  // Common filters
  // 1. Tag filter (multi-tag)
  if (data?.productTags && Array.isArray(data.productTags) && data.productTags.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.tags?.some((tag: string) => data.productTags.includes(tag))
    );
  }

  // Apply sorting
  if (productSource !== 'manual') {
    const sortBy = data?.sortBy || 'newest';
    switch (sortBy) {
      case 'oldest':
        filteredProducts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }

  // 2. Limit count
  const limit = data?.limit || data?.productCount || 8;
  return filteredProducts.slice(0, limit);
};
