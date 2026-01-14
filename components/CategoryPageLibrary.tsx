import React from 'react';
import { Category, Collection } from '../types';
import { FolderTree, Grid, Layers, ArrowRight, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  category: Category;
  collections: Collection[];
  onNavigateToCollection?: (collectionSlug: string) => void;
  variant?: string;
}

// Category Page Options for Studio
export const CATEGORY_PAGE_OPTIONS = [
  { id: 'category-standard', name: 'Standard', description: 'Classic category page' },
  { id: 'category-hero', name: 'Hero Banner', description: 'Large hero with collections' },
  { id: 'category-grid', name: 'Collection Grid', description: 'Grid of collections' },
  { id: 'category-featured', name: 'Featured', description: 'Highlight featured collections' },
  { id: 'category-minimal', name: 'Minimal', description: 'Clean minimal design' },
];

// 1. Standard Category Page
const StandardCategoryPage: React.FC<CategoryPageProps> = ({ category, collections, onNavigateToCollection }) => {
  const categoryCollections = collections.filter(c => c.category_id === category.id && c.is_visible);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="hover:text-black cursor-pointer">Home</span>
            <ChevronRight size={14} />
            <span className="hover:text-black cursor-pointer">Categories</span>
            <ChevronRight size={14} />
            <span className="text-black font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-start gap-8">
          {category.image_url && (
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
              <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-black mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-neutral-600 max-w-3xl">{category.description}</p>
            )}
            <div className="mt-6 flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Layers size={16} />
                <span>{categoryCollections.length} Collections</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {categoryCollections.length === 0 ? (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500">No collections in this category yet.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-black mb-8">Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoryCollections.map(collection => (
                <div
                  key={collection.id}
                  onClick={() => onNavigateToCollection?.(collection.slug)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                    {collection.image_url ? (
                      <img
                        src={collection.image_url}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid size={64} className="text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-neutral-600 line-clamp-2">{collection.description}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 2. Hero Banner Category Page
const HeroCategoryPage: React.FC<CategoryPageProps> = ({ category, collections, onNavigateToCollection }) => {
  const categoryCollections = collections.filter(c => c.category_id === category.id && c.is_visible);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-br from-neutral-900 to-neutral-700 overflow-hidden">
        {category.image_url && (
          <img
            src={category.image_url}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold text-white mb-6">{category.name}</h1>
            {category.description && (
              <p className="text-2xl text-neutral-200 max-w-2xl mx-auto">{category.description}</p>
            )}
            <div className="mt-8 flex items-center justify-center gap-3 text-neutral-300">
              <Layers size={20} />
              <span className="text-lg">{categoryCollections.length} Collections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {categoryCollections.length === 0 ? (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500">No collections available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryCollections.map(collection => (
              <div
                key={collection.id}
                onClick={() => onNavigateToCollection?.(collection.slug)}
                className="group cursor-pointer bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-neutral-200 to-neutral-100">
                  {collection.image_url ? (
                    <img
                      src={collection.image_url}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid size={48} className="text-neutral-300" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-neutral-600 line-clamp-2 text-sm">{collection.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium text-sm">
                    <span>Explore Collection</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Grid Category Page
const GridCategoryPage: React.FC<CategoryPageProps> = ({ category, collections, onNavigateToCollection }) => {
  const categoryCollections = collections.filter(c => c.category_id === category.id && c.is_visible);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>

        {/* Collections Grid */}
        {categoryCollections.length === 0 ? (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500">No collections to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryCollections.map(collection => (
              <div
                key={collection.id}
                onClick={() => onNavigateToCollection?.(collection.slug)}
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  {collection.image_url ? (
                    <img
                      src={collection.image_url}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50">
                      <Grid size={48} className="text-neutral-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-black text-center group-hover:text-blue-600 transition-colors">
                  {collection.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Featured Category Page
const FeaturedCategoryPage: React.FC<CategoryPageProps> = ({ category, collections, onNavigateToCollection }) => {
  const categoryCollections = collections.filter(c => c.category_id === category.id && c.is_visible);
  const featuredCollections = categoryCollections.filter(c => c.is_featured);
  const regularCollections = categoryCollections.filter(c => !c.is_featured);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-neutral-600 max-w-3xl">{category.description}</p>
          )}
        </div>

        {categoryCollections.length === 0 ? (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500">No collections available.</p>
          </div>
        ) : (
          <>
            {/* Featured Collections */}
            {featuredCollections.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-black mb-8">Featured Collections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredCollections.map(collection => (
                    <div
                      key={collection.id}
                      onClick={() => onNavigateToCollection?.(collection.slug)}
                      className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white min-h-[300px] flex flex-col justify-end"
                    >
                      {collection.image_url && (
                        <img
                          src={collection.image_url}
                          alt={collection.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-2">{collection.name}</h3>
                        {collection.description && (
                          <p className="text-neutral-100 mb-4">{collection.description}</p>
                        )}
                        <div className="flex items-center gap-2 font-medium">
                          <span>Explore</span>
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Collections */}
            {regularCollections.length > 0 && (
              <div>
                {featuredCollections.length > 0 && (
                  <h2 className="text-3xl font-bold text-black mb-8">All Collections</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {regularCollections.map(collection => (
                    <div
                      key={collection.id}
                      onClick={() => onNavigateToCollection?.(collection.slug)}
                      className="group cursor-pointer bg-neutral-50 rounded-xl p-6 hover:bg-neutral-100 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-neutral-600 text-sm line-clamp-2">{collection.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 5. Minimal Category Page
const MinimalCategoryPage: React.FC<CategoryPageProps> = ({ category, collections, onNavigateToCollection }) => {
  const categoryCollections = collections.filter(c => c.category_id === category.id && c.is_visible);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-black mb-6 tracking-tight">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light">{category.description}</p>
          )}
        </div>

        {/* Collections List */}
        {categoryCollections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 font-light">No collections available.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {categoryCollections.map((collection, idx) => (
              <div
                key={collection.id}
                onClick={() => onNavigateToCollection?.(collection.slug)}
                className="group cursor-pointer border-b border-neutral-200 py-6 hover:bg-neutral-50 transition-colors px-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-neutral-400 font-mono w-8">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-2xl font-light text-black group-hover:text-blue-600 transition-colors">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-sm text-neutral-500 mt-1 font-light">{collection.description}</p>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Export components map
export const CATEGORY_PAGE_COMPONENTS: Record<string, React.FC<CategoryPageProps>> = {
  'category-standard': StandardCategoryPage,
  'category-hero': HeroCategoryPage,
  'category-grid': GridCategoryPage,
  'category-featured': FeaturedCategoryPage,
  'category-minimal': MinimalCategoryPage,
};
