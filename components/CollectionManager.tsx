import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { Collection, Product } from '../types';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Search,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Sparkles,
  Tag,
  FolderTree,
  Image as ImageIcon,
  Upload,
  Wand2,
  Loader,
  CheckSquare
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { GoogleGenAI } from '@google/genai';

export const CollectionManager: React.FC = () => {
  const { collections, products, categories, saveCollection, deleteCollection } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Collection>>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    type: 'manual',
    is_featured: false,
    is_visible: true,
    display_order: 0,
    product_ids: [],
    conditions: {},
    seo_title: '',
    seo_description: ''
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<'description' | 'seo' | null>(null);

  // Check if AI is available and create instance
  let genAI: any = null;
  let hasAI = false;
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10) {
      genAI = new GoogleGenAI(apiKey.trim());
      hasAI = true;
    }
  } catch (error) {
    console.warn('AI features disabled:', error);
  }

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

  const handleEdit = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData(collection);
    setSelectedProducts(collection.product_ids || []);
  };

  const handleNew = () => {
    setEditingId('new');
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      type: 'manual',
      is_featured: false,
      is_visible: true,
      display_order: 0,
      product_ids: [],
      conditions: {}
    });
    setSelectedProducts([]);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('Name and slug are required');
      return;
    }

    const collectionData: Collection = {
      id: editingId === 'new' ? Math.random().toString(36).substr(2, 9) : editingId!,
      name: formData.name!,
      slug: formData.slug!,
      description: formData.description || '',
      image_url: formData.image_url,
      type: formData.type || 'manual',
      is_featured: formData.is_featured ?? false,
      is_visible: formData.is_visible ?? true,
      display_order: formData.display_order || 0,
      conditions: formData.conditions || {},
      seo_title: formData.seo_title,
      seo_description: formData.seo_description,
      created_at: formData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_ids: formData.type === 'manual' ? selectedProducts : undefined
    };

    await saveCollection(collectionData);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      type: 'manual',
      is_featured: false,
      is_visible: true,
      display_order: 0,
      product_ids: [],
      conditions: {}
    });
    setSelectedProducts([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) {
      return;
    }
    await deleteCollection(id);
  };

  const handleDuplicate = (collection: Collection) => {
    const duplicated = {
      ...collection,
      id: undefined,
      name: `${collection.name} (Copy)`,
      slug: `${collection.slug}-copy-${Date.now()}`,
      created_at: undefined,
      updated_at: undefined
    };
    setEditingId('new');
    setFormData(duplicated);
    setSelectedProducts(collection.product_ids || []);
  };

  const handleBulkDelete = async () => {
    if (bulkSelected.length === 0) return;
    if (!confirm(`Delete ${bulkSelected.length} collection(s)?`)) return;
    
    for (const id of bulkSelected) {
      await deleteCollection(id);
    }
    setBulkSelected([]);
  };

  const handleBulkToggleVisibility = async () => {
    if (bulkSelected.length === 0) return;
    
    for (const id of bulkSelected) {
      const collection = collections.find(c => c.id === id);
      if (collection) {
        await saveCollection({ ...collection, is_visible: !collection.is_visible });
      }
    }
    setBulkSelected([]);
  };

  const handleBulkToggleFeatured = async () => {
    if (bulkSelected.length === 0) return;
    
    for (const id of bulkSelected) {
      const collection = collections.find(c => c.id === id);
      if (collection) {
        await saveCollection({ ...collection, is_featured: !collection.is_featured });
      }
    }
    setBulkSelected([]);
  };

  const toggleBulkSelect = (id: string) => {
    setBulkSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllCollections = () => {
    setBulkSelected(filteredCollections.map(c => c.id));
  };

  const deselectAllCollections = () => {
    setBulkSelected([]);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      type: 'manual',
      is_featured: false,
      is_visible: true,
      display_order: 0,
      product_ids: [],
      conditions: {},
      seo_title: '',
      seo_description: ''
    });
    setSelectedProducts([]);
  };

  // AI Generate Description
  const generateDescription = async () => {
    if (!genAI || !formData.name) return;
    
    setIsGenerating('description');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = `Write a compelling 2-3 sentence description for a product collection called "${formData.name}". Make it engaging and SEO-friendly. Return ONLY the description text, no quotes or extra formatting.`;
      
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
    if (!genAI || !formData.name) return;
    
    setIsGenerating('seo');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = `Generate SEO metadata for a product collection called "${formData.name}".
      
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `collections/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(filteredProducts.map(p => p.id));
  };

  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  const selectAllFromCategory = (categoryId: string) => {
    const categoryProducts = products.filter(p => p.category_id === categoryId).map(p => p.id);
    setSelectedProducts(prev => [...new Set([...prev, ...categoryProducts])]);
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedProducts.length - 1) return;

    const newProducts = [...selectedProducts];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newProducts[index], newProducts[swapIndex]] = [newProducts[swapIndex], newProducts[index]];
    setSelectedProducts(newProducts);
  };

  const filteredCollections = collections.filter(collection => {
    if (!searchTerm) return true;
    return collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           collection.slug.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredProducts = products.filter(product => {
    if (!productSearch) return true;
    return product.name.toLowerCase().includes(productSearch.toLowerCase());
  });

  const getCollectionProducts = (collection: Collection): Product[] => {
    if (collection.type === 'manual') {
      return (collection.product_ids || [])
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined);
    }
    
    let filtered = [...products];
    
    if (collection.type === 'auto-category' && collection.conditions?.category_id) {
      filtered = filtered.filter(p => p.category_id === collection.conditions.category_id);
    }
    
    if (collection.type === 'auto-tag' && collection.conditions?.tags) {
      filtered = filtered.filter(p => 
        collection.conditions.tags.some(tag => p.tags?.includes(tag))
      );
    }
    
    if (collection.type === 'auto-newest') {
      filtered = filtered.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      const limit = collection.conditions?.limit || 12;
      filtered = filtered.slice(0, limit);
    }
    
    if (collection.type === 'auto-bestsellers') {
      // Sort by total_sales if available, otherwise by id
      filtered = filtered.sort((a, b) => 
        (b.total_sales || 0) - (a.total_sales || 0)
      );
      const limit = collection.conditions?.limit || 12;
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  const getCollectionProductCount = (collection: Collection) => {
    return getCollectionProducts(collection).length;
  };

  const renderCollectionCard = (collection: Collection) => {
    const productCount = getCollectionProductCount(collection);
    const isSelected = bulkSelected.includes(collection.id);
    
    return (
      <div
        key={collection.id}
        className={`group bg-neutral-900 border rounded-xl overflow-hidden hover:border-neutral-600 transition-all ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-neutral-800'
        }`}
      >
        <div className="aspect-[16/9] relative overflow-hidden bg-neutral-800">
          {collection.image_url ? (
            <img
              src={collection.image_url}
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Layers className="w-12 h-12 text-neutral-600" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleBulkSelect(collection.id)}
              className="w-5 h-5 rounded border-neutral-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            {collection.is_featured && (
              <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                Featured
              </span>
            )}
            {!collection.is_visible && (
              <span className="px-2 py-1 bg-neutral-700 text-white text-xs font-bold rounded">
                Hidden
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg truncate">{collection.name}</h3>
              <p className="text-xs text-neutral-500 font-mono">/{collection.slug}</p>
            </div>
            <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded ml-2">
              {collection.type === 'manual' ? 'Manual' : 'Auto'}
            </span>
          </div>
          
          {collection.description && (
            <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{collection.description}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
            <span>{productCount} products</span>
            <span>Order: {collection.display_order}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(collection)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => handleDuplicate(collection)}
              className="px-3 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-colors"
              title="Duplicate"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(collection.id)}
              className="px-3 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditor = () => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">
        {editingId === 'new' ? 'New Collection' : 'Edit Collection'}
      </h3>
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Summer Collection"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="summer-collection"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
        <div className="relative">
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="A curated selection of summer essentials"
          />
          {hasAI && (
            <button
              onClick={generateDescription}
              disabled={!formData.name || isGenerating === 'description'}
              className="absolute top-2 right-2 p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      
      {/* Collection Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-400 mb-2">Collection Image</label>
        <div className="flex gap-4">
          {formData.image_url && (
            <img 
              src={formData.image_url} 
              alt="Collection" 
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
          <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-black border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <Upload className="w-8 h-8 text-neutral-500 mb-2" />
            <span className="text-sm text-neutral-500">Upload image</span>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
            {isUploading && <span className="text-xs text-blue-500 mt-1">Uploading...</span>}
          </label>
        </div>
      </div>
      
      {/* Collection Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="manual">Manual</option>
            <option value="auto-category">Auto - Category</option>
            <option value="auto-tag">Auto - Tag</option>
            <option value="auto-newest">Auto - Newest</option>
            <option value="auto-bestsellers">Auto - Best Sellers</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Display Order</label>
          <input
            type="number"
            value={formData.display_order}
            onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Featured</label>
          <label className="flex items-center gap-2 px-3 py-2 bg-black border border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-900">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-white">{formData.is_featured ? 'Yes' : 'No'}</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Visible</label>
          <label className="flex items-center gap-2 px-3 py-2 bg-black border border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-900">
            <input
              type="checkbox"
              checked={formData.is_visible}
              onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-white">{formData.is_visible ? 'Yes' : 'No'}</span>
          </label>
        </div>
      </div>
      
      {/* Auto Collection Conditions */}
      {formData.type === 'auto-category' && (
        <div className="mb-4 p-4 bg-black border border-neutral-700 rounded-lg">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Category</label>
          <select
            value={formData.conditions?.category_id || ''}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              conditions: { ...prev.conditions, category_id: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}
      
      {formData.type === 'auto-tag' && (
        <div className="mb-4 p-4 bg-black border border-neutral-700 rounded-lg">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.conditions?.tags?.join(', ') || ''}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              conditions: { ...prev.conditions, tags: e.target.value.split(',').map(t => t.trim()) }
            }))}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sale, featured, new"
          />
        </div>
      )}
      
      {(formData.type === 'auto-newest' || formData.type === 'auto-bestsellers') && (
        <div className="mb-4 p-4 bg-black border border-neutral-700 rounded-lg">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Product Limit</label>
          <input
            type="number"
            value={formData.conditions?.limit || 12}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              conditions: { ...prev.conditions, limit: parseInt(e.target.value) || 12 }
            }))}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      
      {/* SEO Metadata */}
      <div className="mb-4 p-4 bg-blue-950/20 border border-blue-800/30 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-neutral-300">SEO Metadata</label>
          {hasAI && (
            <button
              onClick={generateSEO}
              disabled={!formData.name || isGenerating === 'seo'}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-blue-400 hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50"
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
        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">SEO Title</label>
            <input
              type="text"
              value={formData.seo_title || ''}
              onChange={e => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SEO title (60 chars max)"
              maxLength={60}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">SEO Description</label>
            <textarea
              value={formData.seo_description || ''}
              onChange={e => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SEO description (160 chars max)"
              rows={2}
              maxLength={160}
            />
          </div>
          <div className="text-xs text-neutral-500">
            Title: {(formData.seo_title || '').length}/60 • Description: {(formData.seo_description || '').length}/160
          </div>
        </div>
      </div>
      
      {/* Manual Product Selection */}
      {formData.type === 'manual' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Products ({selectedProducts.length})</label>
          {/* Bulk Actions */}
          <div className="flex items-center justify-between mb-4 p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-neutral-500">Quick Select:</span>
              <button
                onClick={selectAllProducts}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                All Visible ({filteredProducts.length})
              </button>
              <button
                onClick={deselectAllProducts}
                className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Clear
              </button>
              {categories && categories.length > 0 && (
                <>
                  <span className="text-xs text-neutral-600">|</span>
                  <select
                    onChange={(e) => e.target.value && selectAllFromCategory(e.target.value)}
                    value=""
                    className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                    style={{ color: '#000000' }}
                  >
                    <option value="">+ Add by Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({products.filter(p => p.category_id === cat.id).length})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Selected: <strong className="text-white">{selectedProducts.length}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Available Products */}
            <div className="bg-black border border-neutral-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-neutral-900 border-0 text-white text-sm focus:outline-none"
                  style={{ color: '#000000' }}
                />
              </div>
              <p className="text-xs text-neutral-500 mb-2">Showing {filteredProducts.length} products</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => {
                  const productCategory = categories.find(c => c.id === product.category_id);
                  return (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedProducts.includes(product.id)
                          ? 'bg-blue-600/20 border border-blue-600'
                          : 'hover:bg-neutral-800 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-4 h-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-0"
                      />
                      <img 
                        src={product.images?.[0]?.url || product.image} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-neutral-500">${product.price}</p>
                          {productCategory && (
                            <span className="text-xs px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded">
                              {productCategory.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {/* Selected Products */}
            <div className="bg-black border border-neutral-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-400 mb-3">Selected Products</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedProducts.map((productId, index) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;
                  
                  return (
                    <div
                      key={productId}
                      className="flex items-center gap-2 p-2 bg-neutral-800 rounded-lg"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveProduct(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 hover:bg-neutral-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-3 h-3 text-neutral-400" />
                        </button>
                        <button
                          onClick={() => moveProduct(index, 'down')}
                          disabled={index === selectedProducts.length - 1}
                          className="p-0.5 hover:bg-neutral-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-3 h-3 text-neutral-400" />
                        </button>
                      </div>
                      <img 
                        src={product.images?.[0]?.url || product.image} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{product.name}</p>
                        <p className="text-xs text-neutral-500">#{index + 1}</p>
                      </div>
                      <button
                        onClick={() => toggleProductSelection(productId)}
                        className="p-1 hover:bg-neutral-700 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {selectedProducts.length === 0 && (
                  <p className="text-sm text-neutral-600 text-center py-8">
                    No products selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-neutral-800">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Collection
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:bg-neutral-700 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white">Collections</h1>
            <p className="text-neutral-400 mt-1">Curate and organize product collections</p>
          </div>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search collections..."
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
              onClick={handleBulkToggleFeatured}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Toggle Featured
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={deselectAllCollections}
              className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {!editingId && filteredCollections.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={bulkSelected.length === filteredCollections.length ? deselectAllCollections : selectAllCollections}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {bulkSelected.length === filteredCollections.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      {editingId && renderEditor()}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCollections.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-neutral-900/50 rounded-xl border border-neutral-800">
            <Layers className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400">No collections yet</p>
            <p className="text-sm text-neutral-600 mt-1">Create your first collection to organize products</p>
          </div>
        ) : (
          filteredCollections
            .sort((a, b) => a.display_order - b.display_order)
            .map(collection => renderCollectionCard(collection))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
        <h4 className="font-medium text-blue-400 mb-2">💡 Collection Types</h4>
        <ul className="text-sm text-blue-300/80 space-y-1">
          <li>• <strong>Manual</strong>: Handpick specific products</li>
          <li>• <strong>Auto - Category</strong>: Automatically include all products from a category</li>
          <li>• <strong>Auto - Tag</strong>: Automatically include products with specific tags</li>
          <li>• <strong>Auto - Newest</strong>: Automatically show newest products</li>
          <li>• <strong>Auto - Best Sellers</strong>: Automatically show top-selling products</li>
        </ul>
      </div>
    </div>
  );
};
