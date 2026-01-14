import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { Category } from '../types';
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ChevronRight, 
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, saveCategory, deleteCategory, reorderCategories } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    parent_id: null,
    display_order: 0,
    is_visible: true
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && editingId === 'new') {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, editingId]);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData(category);
  };

  const handleNew = () => {
    setEditingId('new');
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
      display_order: 0,
      is_visible: true
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('Name and slug are required');
      return;
    }

    const categoryData: Category = {
      id: editingId === 'new' ? Math.random().toString(36).substr(2, 9) : editingId!,
      name: formData.name!,
      slug: formData.slug!,
      description: formData.description || '',
      parent_id: formData.parent_id || null,
      display_order: formData.display_order || 0,
      is_visible: formData.is_visible ?? true,
      created_at: formData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await saveCategory(categoryData);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
      display_order: 0,
      is_visible: true
    });
  };

  const handleDelete = async (id: string) => {
    // Check if category has children
    const hasChildren = categories.some(c => c.parent_id === id);
    if (hasChildren) {
      if (!confirm('This category has subcategories. Deleting it will also delete all subcategories. Continue?')) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this category?')) {
        return;
      }
    }
    
    await deleteCategory(id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
      display_order: 0,
      is_visible: true
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const moveCategory = async (category: Category, direction: 'up' | 'down') => {
    const siblings = categories.filter(c => c.parent_id === category.parent_id)
      .sort((a, b) => a.display_order - b.display_order);
    
    const currentIndex = siblings.findIndex(c => c.id === category.id);
    if (currentIndex === -1) return;
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === siblings.length - 1) return;
    
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapCategory = siblings[swapIndex];
    
    // Swap display orders
    await saveCategory({ ...category, display_order: swapCategory.display_order });
    await saveCategory({ ...swapCategory, display_order: category.display_order });
  };

  // Build hierarchical structure
  const buildTree = (parentId: string | null = null): Category[] => {
    return categories
      .filter(c => c.parent_id === parentId)
      .filter(c => {
        if (!searchTerm) return true;
        return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               c.slug.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => a.display_order - b.display_order);
  };

  const renderCategory = (category: Category, level: number = 0): React.ReactNode => {
    const children = buildTree(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const isEditing = editingId === category.id;

    return (
      <div key={category.id} className="mb-1">
        {isEditing ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-2">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: '#000000' }}
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: '#000000' }}
                  placeholder="category-slug"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#000000' }}
                rows={2}
                placeholder="Optional description"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Category</label>
                <select
                  value={formData.parent_id || ''}
                  onChange={e => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: '#000000' }}
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(c => c.id !== category.id) // Don't allow selecting self
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: '#000000' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Visibility</label>
                <label className="flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">{formData.is_visible ? 'Visible' : 'Hidden'}</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 p-3 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors group"
            style={{ marginLeft: `${level * 32}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-neutral-100 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                )}
              </button>
            )}
            
            {!hasChildren && <div className="w-6" />}
            
            <GripVertical className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <FolderTree className="w-4 h-4 text-neutral-600" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-900">{category.name}</span>
                <span className="text-xs text-neutral-500">/{category.slug}</span>
                {!category.is_visible && (
                  <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">Hidden</span>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-neutral-600 mt-0.5 truncate">{category.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveCategory(category, 'up')}
                className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                onClick={() => moveCategory(category, 'down')}
                className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                onClick={() => handleEdit(category)}
                className="p-1.5 hover:bg-blue-50 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-1.5 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        )}
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const topLevelCategories = buildTree(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Categories</h1>
            <p className="text-neutral-600 mt-1">Organize your products into categories</p>
          </div>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#000000' }}
          />
        </div>
      </div>

      {editingId === 'new' && (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">New Category</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#000000' }}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#000000' }}
                placeholder="category-slug"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#000000' }}
              rows={2}
              placeholder="Optional description"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Category</label>
              <select
                value={formData.parent_id || ''}
                onChange={e => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#000000' }}
              >
                <option value="">None (Top Level)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#000000' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Visibility</label>
              <label className="flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">{formData.is_visible ? 'Visible' : 'Hidden'}</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {topLevelCategories.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
            <FolderTree className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600">No categories yet</p>
            <p className="text-sm text-neutral-500 mt-1">Create your first category to organize your products</p>
          </div>
        ) : (
          topLevelCategories.map(category => renderCategory(category))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use hierarchical categories by setting a parent category</li>
          <li>• Slugs are used in URLs and must be unique</li>
          <li>• Display order controls the sort order within each level</li>
          <li>• Hidden categories won't appear in your storefront navigation</li>
          <li>• Drag and drop to reorder categories (coming soon)</li>
        </ul>
      </div>
    </div>
  );
};
