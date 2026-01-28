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
  Loader,
  CheckSquare,
  Copy,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { GoogleGenAI } from '@google/genai';


export const CategoryManager: React.FC = () => {
  const { categories, products, saveCategory, deleteCategory, reorderCategories } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<'description' | 'seo' | null>(null);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'tree' | 'cards'>('tree');
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

  // Check if AI is available - initialize lazily to avoid build-time errors
  const getGenAI = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    console.log('[CategoryManager] API key check:', { 
      exists: !!apiKey, 
      type: typeof apiKey, 
      length: apiKey?.length,
      firstChars: apiKey?.substring(0, 10)
    });
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      throw new Error('VITE_GOOGLE_AI_API_KEY not configured');
    }
    return new GoogleGenAI({ apiKey: apiKey.trim() });
  };
  
  const hasAI = !!(import.meta.env.VITE_GOOGLE_AI_API_KEY?.trim());

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
    if (!formData.name) return;
    
    setIsGenerating('description');
    try {
      const genAI = getGenAI();
      const prompt = `Write a compelling 2-3 sentence description for a product category called "${formData.name}". Make it engaging and SEO-friendly. Return ONLY the description text, no quotes or extra formatting.`;
      
      const result = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
      });
      const description = result.text.trim();
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
    if (!formData.name) return;
    
    setIsGenerating('seo');
    try {
      const genAI = getGenAI();
      const prompt = `Generate SEO metadata for a product category called "${formData.name}".
      
Return in this exact format:
TITLE: [SEO title under 60 characters]
DESCRIPTION: [SEO description under 160 characters]

Return ONLY those two lines, nothing else.`;
      
      const result = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
      });
      const text = result.text.trim();
      
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
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
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

  const handleDuplicate = (category: Category) => {
    const duplicated = {
      ...category,
      id: undefined,
      name: `${category.name} (Copy)`,
      slug: `${category.slug}-copy-${Date.now()}`,
      created_at: undefined,
      updated_at: undefined
    };
    setEditingId('new');
    setFormData(duplicated);
  };

  const toggleBulkSelect = (id: string) => {
    setBulkSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllCategories = () => {
    const allIds = viewMode === 'cards' 
      ? filteredCategories.map(c => c.id)
      : getAllCategoryIds(buildTree(null));
    setBulkSelected(allIds);
  };

  const deselectAllCategories = () => {
    setBulkSelected([]);
  };

  const handleBulkDelete = async () => {
    if (bulkSelected.length === 0) return;
    if (!confirm(`Delete ${bulkSelected.length} category/categories? This will also delete any subcategories.`)) return;
    
    for (const id of bulkSelected) {
      await deleteCategory(id);
    }
    setBulkSelected([]);
  };

  const handleBulkToggleVisibility = async () => {
    if (bulkSelected.length === 0) return;
    
    for (const id of bulkSelected) {
      const category = categories.find(c => c.id === id);
      if (category) {
        await saveCategory({ ...category, is_visible: !category.is_visible });
      }
    }
    setBulkSelected([]);
  };

  const getAllCategoryIds = (categoryList: Category[]): string[] => {
    let ids: string[] = [];
    categoryList.forEach(cat => {
      ids.push(cat.id);
      const children = buildTree(cat.id);
      if (children.length > 0) {
        ids = [...ids, ...getAllCategoryIds(children)];
      }
    });
    return ids;
  };

  const getCategoryProductCount = (categoryId: string): number => {
    return products.filter(p => p.category_id === categoryId).length;
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

  const filteredCategories = categories.filter(c => {
    if (!searchTerm) return true;
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.slug.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderCategoryCard = (category: Category) => {
    const productCount = getCategoryProductCount(category.id);
    const isSelected = bulkSelected.includes(category.id);
    const childCount = categories.filter(c => c.parent_id === category.id).length;
    const parentCategory = category.parent_id ? categories.find(c => c.id === category.parent_id) : null;
    
    return (
      <div
        key={category.id}
        className={`group bg-neutral-900 border rounded-xl overflow-hidden hover:border-neutral-600 transition-all ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-neutral-800'
        }`}
      >
        <div className="aspect-[16/9] relative overflow-hidden bg-neutral-800">
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FolderTree className="w-12 h-12 text-neutral-600" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleBulkSelect(category.id)}
              className="w-5 h-5 rounded border-neutral-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            {!category.is_visible && (
              <span className="px-2 py-1 bg-neutral-700 text-white text-xs font-bold rounded">
                Hidden
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg truncate">{category.name}</h3>
              <p className="text-xs text-neutral-500 font-mono">/{category.slug}</p>
            </div>
          </div>
          
          {category.description && (
            <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{category.description}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
            <span>{productCount} products</span>
            <div className="flex items-center gap-2">
              {parentCategory && (
                <span className="px-2 py-1 bg-neutral-800 text-neutral-400 rounded">
                  in {parentCategory.name}
                </span>
              )}
              {childCount > 0 && (
                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded">
                  {childCount} subcategories
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(category)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => handleDuplicate(category)}
              className="px-3 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="px-3 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCategory = (category: Category, level: number = 0): React.ReactNode => {
    const children = buildTree(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const isEditing = editingId === category.id;
    const isSelected = bulkSelected.includes(category.id);
    const productCount = getCategoryProductCount(category.id);

    return (
      <div key={category.id} className="mb-1">
        {isEditing ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="category-slug"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Optional description"
                />  
                <button
                  onClick={generateDescription}
                  disabled={!hasAI || !formData.name || isGenerating === 'description'}
                  className="absolute top-2 right-2 p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={hasAI ? "Generate with AI" : "AI not available - add VITE_GOOGLE_AI_API_KEY to environment"}
                >
                  {isGenerating === 'description' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Category Image</label>
              <div className="flex gap-3">
                {formData.image_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Image URL or upload..."
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors text-sm text-white">
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

            <div className="mb-3 p-3 bg-blue-950/20 border border-blue-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-300">SEO Metadata</label>
                <button
                  onClick={generateSEO}
                  disabled={!hasAI || !formData.name || isGenerating === 'seo'}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs text-blue-400 hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50"
                  title={hasAI ? "Generate SEO with AI" : "AI not available - add VITE_GOOGLE_AI_API_KEY to environment"}
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
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={e => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="SEO Title (60 chars max)"
                  maxLength={60}
                />
                <textarea
                  value={formData.seo_description || ''}
                  onChange={e => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="SEO Description (160 chars max)"
                  rows={2}
                  maxLength={160}
                />
                <div className="text-xs text-neutral-500">
                  Title: {(formData.seo_title || '').length}/60 • Description: {(formData.seo_description || '').length}/160
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Parent Category</label>
                <select
                  value={formData.parent_id || ''}
                  onChange={e => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-neutral-400 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Visibility</label>
                <label className="flex items-center gap-2 px-3 py-2 bg-black border border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-900">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-white">{formData.is_visible ? 'Visible' : 'Hidden'}</span>
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
                className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:bg-neutral-700 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 p-3 bg-neutral-900 border rounded-lg hover:border-neutral-600 transition-colors group ${
              isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-neutral-800'
            }`}
            style={{ marginLeft: `${level * 32}px` }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleBulkSelect(category.id)}
              className="w-4 h-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-neutral-800 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            )}
            
            {!hasChildren && <div className="w-6" />}
            
            <GripVertical className="w-4 h-4 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <FolderTree className="w-4 h-4 text-neutral-400" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{category.name}</span>
                <span className="text-xs text-neutral-600">/{category.slug}</span>
                {!category.is_visible && (
                  <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-500 rounded">Hidden</span>
                )}
                <span className="text-xs text-neutral-600">• {productCount} products</span>
              </div>
              {category.description && (
                <p className="text-sm text-neutral-500 mt-0.5 truncate">{category.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveCategory(category, 'up')}
                className="p-1.5 hover:bg-neutral-800 rounded transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => moveCategory(category, 'down')}
                className="p-1.5 hover:bg-neutral-800 rounded transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => handleDuplicate(category)}
                className="p-1.5 hover:bg-neutral-800 rounded transition-colors"
                title="Duplicate"
              >
                <Copy className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => handleEdit(category)}
                className="p-1.5 hover:bg-blue-900/50 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-400" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-1.5 hover:bg-red-900/50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white">Categories</h1>
            <p className="text-neutral-400 mt-1">Organize your products into categories</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'tree' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                Tree
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Cards
              </button>
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
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {bulkSelected.length > 0 && (
        <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">{bulkSelected.length} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkToggleVisibility}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Toggle Visibility
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={deselectAllCategories}
              className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {!editingId && (viewMode === 'tree' ? topLevelCategories.length > 0 : filteredCategories.length > 0) && (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={bulkSelected.length > 0 ? deselectAllCategories : selectAllCategories}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {bulkSelected.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      {editingId === 'new' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">New Category</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="category-slug"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Optional description"
              />
              <button
                onClick={generateDescription}
                disabled={!hasAI || !formData.name || isGenerating === 'description'}
                className="absolute top-2 right-2 p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50"
                title={hasAI ? "Generate with AI" : "AI not available - add VITE_GOOGLE_AI_API_KEY to environment"}
              >
                {isGenerating === 'description' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-400 mb-1">Category Image</label>
            <div className="flex gap-3">
              {formData.image_url && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                  <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.image_url || ''}
                  onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Image URL or upload..."
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors text-sm text-white">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Parent Category</label>
              <select
                value={formData.parent_id || ''}
                onChange={e => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None (Top Level)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Visibility</label>
              <label className="flex items-center gap-2 px-3 py-2 bg-black border border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-900">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-white">{formData.is_visible ? 'Visible' : 'Hidden'}</span>
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
              className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:bg-neutral-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-3 text-center py-16 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <FolderTree className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400">No categories yet</p>
              <p className="text-sm text-neutral-600 mt-1">Create your first category to organize products</p>
            </div>
          ) : (
            filteredCategories
              .sort((a, b) => a.display_order - b.display_order)
              .map(category => renderCategoryCard(category))
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {topLevelCategories.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900/50 rounded-lg border border-dashed border-neutral-800">
              <FolderTree className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400">No categories yet</p>
              <p className="text-sm text-neutral-600 mt-1">Create your first category to organize your products</p>
            </div>
          ) : (
            topLevelCategories.map(category => renderCategory(category))
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
        <h4 className="font-medium text-blue-400 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-300/80 space-y-1">
          <li>• Use hierarchical categories by setting a parent category</li>
          <li>• Slugs are used in URLs and must be unique</li>
          <li>• Display order controls the sort order within each level</li>
          <li>• Hidden categories won't appear in your storefront navigation</li>
          <li>• Switch between Tree and Card view for different workflows</li>
          <li>• Use bulk operations to manage multiple categories at once</li>
        </ul>
      </div>
    </div>
  );
};
