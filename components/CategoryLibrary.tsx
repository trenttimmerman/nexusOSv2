import React from 'react';
import { EditableText } from './HeroLibrary';
import { ChevronRight, Grid, List, Layers, FolderTree, Tag } from 'lucide-react';

export const CATEGORY_OPTIONS = [
  { id: 'category-grid', name: 'Category Grid', description: 'Grid layout with category cards' },
  { id: 'category-sidebar', name: 'Category Sidebar', description: 'Vertical navigation list' },
  { id: 'category-tabs', name: 'Category Tabs', description: 'Horizontal tabbed categories' },
  { id: 'category-mega-menu', name: 'Mega Menu', description: 'Multi-column dropdown style' },
  { id: 'category-icon-grid', name: 'Icon Grid', description: 'Categories with custom icons' },
  { id: 'category-banner', name: 'Category Banners', description: 'Large image banners per category' },
  { id: 'category-minimal', name: 'Minimal List', description: 'Simple text links' },
  { id: 'category-cards', name: 'Featured Cards', description: 'Card-based layout with images' },
];

export const CATEGORY_COMPONENTS: Record<string, React.FC<any>> = {
  'category-grid': ({ data, isEditable, onUpdate, categories, onEditBlock, blockId }) => {
    const displayCategories = categories && categories.length > 0 
      ? categories.filter(c => c.is_visible && !c.parent_id).slice(0, data?.limit || 8)
      : [];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <EditableText
              value={data?.heading || 'Shop by Category'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              style={{ color: data?.headingColor || '#000000' }}
              className="text-4xl font-bold mb-4"
              onSelect={() => onEditBlock?.(blockId || '')}
            />
            {data?.subheading && (
              <p style={{ color: data?.subheadingColor || '#737373' }} className="text-lg">
                {data.subheading}
              </p>
            )}
          </div>

          {displayCategories.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <FolderTree size={48} className="mx-auto mb-4 opacity-50" />
              <p>No categories available. Create categories to organize your products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayCategories.map((category) => (
                <div 
                  key={category.id}
                  className="group cursor-pointer"
                >
                  <div 
                    style={{ backgroundColor: data?.cardBgColor || '#f3f4f6' }}
                    className="aspect-square rounded-2xl overflow-hidden mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  >
                    <FolderTree 
                      size={64} 
                      style={{ color: data?.iconColor || '#000000' }}
                      className="opacity-60"
                    />
                  </div>
                  <h3 
                    style={{ color: data?.categoryNameColor || '#000000' }}
                    className="font-bold text-center"
                  >
                    {category.name}
                  </h3>
                  {data?.showDescription && category.description && (
                    <p 
                      style={{ color: data?.descriptionColor || '#737373' }}
                      className="text-sm text-center mt-1"
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },

  'category-sidebar': ({ data, isEditable, onUpdate, categories }) => {
    const buildTree = (parentId: string | null = null): any[] => {
      return categories
        ?.filter(c => c.is_visible && c.parent_id === parentId)
        .sort((a, b) => a.display_order - b.display_order) || [];
    };

    const topLevelCategories = buildTree(null);

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#f9fafb' }}
        className="py-8 px-6"
      >
        <div className="max-w-xs">
          <h3 
            style={{ color: data?.headingColor || '#000000' }}
            className="text-xl font-bold mb-6"
          >
            {data?.heading || 'Categories'}
          </h3>
          
          {topLevelCategories.length === 0 ? (
            <p className="text-neutral-400 text-sm">No categories</p>
          ) : (
            <nav className="space-y-2">
              {topLevelCategories.map((category) => {
                const children = buildTree(category.id);
                return (
                  <div key={category.id}>
                    <div 
                      style={{ 
                        color: data?.linkColor || '#000000',
                        borderColor: data?.borderColor || '#e5e7eb'
                      }}
                      className="flex items-center justify-between py-2 border-b hover:opacity-70 cursor-pointer transition-opacity"
                    >
                      <span className="font-medium">{category.name}</span>
                      {children.length > 0 && <ChevronRight size={16} />}
                    </div>
                    {data?.showSubcategories && children.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1">
                        {children.map((child) => (
                          <div 
                            key={child.id}
                            style={{ color: data?.sublinkColor || '#737373' }}
                            className="py-1 text-sm hover:opacity-70 cursor-pointer transition-opacity"
                          >
                            {child.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    );
  },

  'category-tabs': ({ data, isEditable, onUpdate, categories, onEditBlock, blockId }) => {
    const displayCategories = categories && categories.length > 0 
      ? categories.filter(c => c.is_visible && !c.parent_id).slice(0, data?.limit || 6)
      : [];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <EditableText
              value={data?.heading || 'Browse Categories'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              style={{ color: data?.headingColor || '#000000' }}
              className="text-3xl font-bold"
              onSelect={() => onEditBlock?.(blockId || '')}
            />
          </div>

          {displayCategories.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <FolderTree size={48} className="mx-auto mb-4 opacity-50" />
              <p>No categories to display</p>
            </div>
          ) : (
            <div className="flex justify-center gap-4 flex-wrap">
              {displayCategories.map((category, idx) => (
                <button
                  key={category.id}
                  style={{
                    backgroundColor: idx === 0 ? (data?.activeTabBg || '#000000') : (data?.tabBg || '#f3f4f6'),
                    color: idx === 0 ? (data?.activeTabText || '#ffffff') : (data?.tabText || '#000000')
                  }}
                  className="px-8 py-3 rounded-full font-bold transition-all hover:opacity-80"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },

  'category-mega-menu': ({ data, categories }) => {
    const topLevelCategories = categories
      ?.filter(c => c.is_visible && !c.parent_id)
      .slice(0, data?.limit || 4) || [];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-12 px-6 border-b"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {topLevelCategories.map((category) => {
              const children = categories?.filter(c => c.parent_id === category.id && c.is_visible).slice(0, 6) || [];
              return (
                <div key={category.id}>
                  <h4 
                    style={{ color: data?.headingColor || '#000000' }}
                    className="font-bold mb-4 text-sm uppercase tracking-wide"
                  >
                    {category.name}
                  </h4>
                  {children.length > 0 && (
                    <ul className="space-y-2">
                      {children.map((child) => (
                        <li 
                          key={child.id}
                          style={{ color: data?.linkColor || '#737373' }}
                          className="text-sm hover:opacity-70 cursor-pointer transition-opacity"
                        >
                          {child.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },

  'category-icon-grid': ({ data, isEditable, onUpdate, categories, onEditBlock, blockId }) => {
    const displayCategories = categories && categories.length > 0 
      ? categories.filter(c => c.is_visible && !c.parent_id).slice(0, data?.limit || 8)
      : [];

    const icons = [Grid, List, Layers, FolderTree, Tag, Grid, List, Layers];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <EditableText
              value={data?.heading || 'Shop by Category'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              style={{ color: data?.headingColor || '#000000' }}
              className="text-3xl font-bold"
              onSelect={() => onEditBlock?.(blockId || '')}
            />
          </div>

          {displayCategories.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <FolderTree size={48} className="mx-auto mb-4 opacity-50" />
              <p>No categories to display</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayCategories.map((category, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <div 
                    key={category.id}
                    className="group cursor-pointer text-center"
                  >
                    <div 
                      style={{ 
                        backgroundColor: data?.iconBgColor || '#f3f4f6',
                        borderColor: data?.borderColor || 'transparent'
                      }}
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-2 transition-transform duration-300 group-hover:scale-110"
                    >
                      <Icon 
                        size={32} 
                        style={{ color: data?.iconColor || '#000000' }}
                      />
                    </div>
                    <h3 
                      style={{ color: data?.categoryNameColor || '#000000' }}
                      className="font-bold"
                    >
                      {category.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },

  'category-banner': ({ data, isEditable, onUpdate, categories, onEditBlock, blockId }) => {
    const displayCategories = categories && categories.length > 0 
      ? categories.filter(c => c.is_visible && !c.parent_id).slice(0, data?.limit || 3)
      : [];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <EditableText
              value={data?.heading || 'Featured Categories'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              style={{ color: data?.headingColor || '#000000' }}
              className="text-4xl font-bold"
              onSelect={() => onEditBlock?.(blockId || '')}
            />
          </div>

          {displayCategories.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <FolderTree size={48} className="mx-auto mb-4 opacity-50" />
              <p>No categories to display</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {displayCategories.map((category) => (
                <div 
                  key={category.id}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div 
                    style={{ backgroundColor: data?.overlayColor || '#000000' }}
                    className="absolute inset-0 opacity-40"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <h3 
                      style={{ color: data?.bannerTextColor || '#ffffff' }}
                      className="text-3xl font-bold mb-2"
                    >
                      {category.name}
                    </h3>
                    {category.description && (
                      <p 
                        style={{ color: data?.bannerTextColor || '#ffffff' }}
                        className="opacity-80"
                      >
                        {category.description}
                      </p>
                    )}
                    <button 
                      style={{
                        backgroundColor: data?.buttonBg || '#ffffff',
                        color: data?.buttonText || '#000000'
                      }}
                      className="mt-6 px-8 py-3 rounded-full font-bold transition-opacity hover:opacity-90"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },

  'category-minimal': ({ data, categories }) => {
    const displayCategories = categories && categories.length > 0 
      ? categories.filter(c => c.is_visible && !c.parent_id).slice(0, data?.limit || 12)
      : [];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-12 px-6"
      >
        <div className="max-w-4xl mx-auto">
          {displayCategories.length === 0 ? (
            <p className="text-neutral-400 text-center">No categories</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {displayCategories.map((category) => (
                <a 
                  key={category.id}
                  style={{ 
                    color: data?.linkColor || '#000000',
                    borderColor: data?.borderColor || 'transparent'
                  }}
                  className="text-sm font-medium border-b-2 hover:opacity-70 cursor-pointer transition-opacity pb-1"
                >
                  {category.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },

  'category-cards': ({ data, isEditable, onUpdate, categories, onEditBlock, blockId }) => {
    const displayCategories = categories && categories.length > 0 
      ? categories.filter(c => c.is_visible && !c.parent_id).slice(0, data?.limit || 6)
      : [];

    return (
      <div 
        style={{ backgroundColor: data?.backgroundColor || '#f9fafb' }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <EditableText
              value={data?.heading || 'Popular Categories'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              style={{ color: data?.headingColor || '#000000' }}
              className="text-3xl font-bold"
              onSelect={() => onEditBlock?.(blockId || '')}
            />
          </div>

          {displayCategories.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <FolderTree size={48} className="mx-auto mb-4 opacity-50" />
              <p>No categories to display</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {displayCategories.map((category) => (
                <div 
                  key={category.id}
                  style={{ 
                    backgroundColor: data?.cardBgColor || '#ffffff',
                    borderColor: data?.borderColor || '#e5e7eb'
                  }}
                  className="rounded-xl border p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div 
                    style={{ backgroundColor: data?.iconBgColor || '#f3f4f6' }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FolderTree 
                      size={28} 
                      style={{ color: data?.iconColor || '#000000' }}
                    />
                  </div>
                  <h3 
                    style={{ color: data?.categoryNameColor || '#000000' }}
                    className="text-xl font-bold mb-2"
                  >
                    {category.name}
                  </h3>
                  {category.description && (
                    <p 
                      style={{ color: data?.descriptionColor || '#737373' }}
                      className="text-sm"
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
};
