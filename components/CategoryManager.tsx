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
  ArrowDown,
  Wand2,
  Upload,
  Image as ImageIcon,
  Loader
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const CategoryManager: React.FC = () => {
  const { categories, saveCategory, deleteCategory, reorderCategories } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<'description' | 'seo' | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    parent_id: null,
    display_order: 0,
    is_visible: true,
    seo_title: '',
    seo_description: ''
  });

  // Access Gemini AI from window (loaded in AdminPanel)
  const getGenAI = () => {
    if (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY) {
      const GoogleGenerativeAI = (window as any).GoogleGenerativeAI;
      if (GoogleGenerativeAI) {
        return new GoogleGenerativeAI((window as any).__GEMINI_API_KEY);
      }
    }
    return null;
  };

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
      image_url: '',
      parent_id: null,
      display_order: 0,
      is_visible: true,
      seo_title: '',
      seo_description: ''
    });
  };

  // AI Generate Description
  const generateDescription = async () => {
    const genAI = getGenAI();
    if (!genAI || !formData.name) return;
    
    setIsGenerating('description');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = `Write a compelling 2-3 sentence description for a product category called "${formData.name}". Make it engaging and SEO-friendly. Return ONLY the description text, no quotes or extra formatting.`;
      
      const result = await model.generateContent(prompt);
      const description = result.response.text().trim();
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  // AI Generate SEO Meta
  const generateSEO = async () => {
    const genAI = getGenAI();
    if (!genAI || !formData.name) return;
    
    setIsGenerating('seo');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = `Generate SEO metadata for a product category called "${formData.name}".
      
Return in this exact format:
TITLE: [SEO title under 60 characters]
DESCRIPTION: [SEO description under 160 characters]

Return ONLY those two lines, nothing else.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      const titleMatch = text.match(/TITLE:\s*(.+)/);
      const descMatch = text.match(/DESCRIPTION:\s*(.+)/);
      
      if (titleMatch && descMatch) {
        setFormData(prev => ({
          ...prev,
          seo_title: titleMatch[1].trim(),
          seo_description: descMatch[1].trim()
        }));
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('Failed to generate SEO. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: '#000000' }}
                  rows={2}
                  placeholder="Optional description"
                />  
                {getGenAI() && (
                  <button
                    onClick={generateDescription}
                    disabled={!formData.name || isGenerating === 'description'}
                    className="absolute top-2 right-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate with AI"
                  >
                    {isGenerating === 'description' ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category Image</label>
              <div className="flex gap-3">
                {formData.image_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    style={{ color: '#000000' }}
                    placeholder="Image URL or upload..."
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer transition-colors text-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">SEO Metadata</label>
                {getGenAI() && (
                  <button
                    onClick={generateSEO}
                    disabled={!formData.name || isGenerating === 'seo'}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded transition-colors disabled:opacity-50"
                  >
                    {isGenerating === 'seo' ? (
                      <>
                        <Loader className="w-3 h-3 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3" />
                        <span>Generate SEO</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={e => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ color: '#000000' }}
                  placeholder="SEO Title (60 chars max)"
                  maxLength={60}
                />
                <textarea
                  value={formData.seo_description || ''}
                  onChange={e => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ color: '#000000' }}
                  placeholder="SEO Description (160 chars max)"
                  rows={2}
                  maxLength={160}
                />
                <div className="text-xs text-neutral-500">
                  Title: {(formData.seo_title || '').length}/60 • Description: {(formData.seo_description || '').length}/160
                </div>
              </div>
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
