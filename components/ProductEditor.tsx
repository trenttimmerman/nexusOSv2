import React, { useState, useEffect } from 'react';
import { Product, ProductImage, ProductVariantOption, ProductVariant, ProductPageStyleId } from '../types';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Sparkles, Box, Search, Save, ArrowLeft, MoreHorizontal, ShoppingBag, Star, ChevronRight, Monitor, LayoutTemplate, Loader2 } from 'lucide-react';
import { PRODUCT_PAGE_COMPONENTS, PRODUCT_PAGE_OPTIONS } from './ProductPageLibrary';
import { supabase } from '../lib/supabaseClient';
import { useDataContext } from '../context/DataContext';

interface ProductEditorProps {
    product?: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
    const { categories } = useDataContext();
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'variants' | 'seo' | 'inventory' | 'design'>('general');

    // Form State
    const [formData, setFormData] = useState<Product>({
        id: product?.id || Math.random().toString(36).substr(2, 9),
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        compareAtPrice: product?.compareAtPrice,
        image: product?.image || '',
        images: product?.images || [],
        category: product?.category || '',
        category_id: product?.category_id,
        tags: product?.tags || [],
        sku: product?.sku || '',
        stock: product?.stock || 0,
        trackInventory: product?.trackInventory ?? true,
        hasVariants: product?.hasVariants || false,
        variantOptions: product?.variantOptions || [],
        variants: product?.variants || [],
        seo: product?.seo || { title: '', description: '', slug: '' },
        status: product?.status || 'active',
        template: product?.template || 'standard',
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    // AI Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSeoChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
    };

    const generateDescription = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                description: `<p>Experience the future of ${prev.category || 'fashion'} with the ${prev.name}. Engineered for performance and designed for the digital age, this piece features premium materials and a cutting-edge silhouette.</p><ul><li>Premium construction</li><li>Modern fit</li><li>Sustainable materials</li></ul>`
            }));
            setIsGenerating(false);
        }, 1500);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            const newImage: ProductImage = {
                id: Math.random().toString(36).substr(2, 9),
                url: publicUrl,
                isPrimary: formData.images.length === 0
            };
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImage],
                image: prev.images.length === 0 ? publicUrl : prev.image
            }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (id: string) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };

    const setPrimaryImage = (id: string) => {
        const img = formData.images.find(i => i.id === id);
        if (img) {
            setFormData(prev => ({
                ...prev,
                image: img.url,
                images: prev.images.map(i => ({ ...i, isPrimary: i.id === id }))
            }));
        }
    };

    const addVariantOption = () => {
        setFormData(prev => ({
            ...prev,
            variantOptions: [...prev.variantOptions, { id: Math.random().toString(36).substr(2, 9), name: '', values: [] }]
        }));
    };

    const updateVariantOption = (id: string, field: 'name' | 'values', value: any) => {
        setFormData(prev => {
            const newOptions = prev.variantOptions.map(opt => opt.id === id ? { ...opt, [field]: value } : opt);
            
            // Auto-generate variants if options change
            // This is a simplified generation strategy that preserves existing variant data if possible
            if (field === 'values' || field === 'name') {
                // We only regenerate if we have valid options
                const validOptions = newOptions.filter(o => o.name && o.values.length > 0);
                if (validOptions.length > 0) {
                    const generatedVariants = generateVariantsFromOptions(validOptions, prev.variants);
                    return { ...prev, variantOptions: newOptions, variants: generatedVariants, hasVariants: true };
                }
            }
            
            return { ...prev, variantOptions: newOptions };
        });
    };

    // Helper to generate combinatorial variants
    const generateVariantsFromOptions = (options: ProductVariantOption[], existingVariants: ProductVariant[]): ProductVariant[] => {
        if (options.length === 0) return [];

        const cartesian = (...a: any[][]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
        
        const optionValues = options.map(o => o.values);
        // If only one option, cartesian needs special handling or just map directly
        const combinations = options.length === 1 
            ? optionValues[0].map(v => [v]) 
            : cartesian(...optionValues);

        return combinations.map((combo: string[]) => {
            const title = combo.join(' / ');
            // Try to find existing variant to preserve stock/price
            const existing = existingVariants.find(v => v.title === title);
            
            const variantOptions: { [key: string]: string } = {};
            options.forEach((opt, idx) => {
                variantOptions[opt.name] = combo[idx];
            });

            return existing || {
                id: Math.random().toString(36).substr(2, 9),
                title,
                price: formData.price,
                stock: 0,
                sku: `${formData.sku}-${combo.join('-').toUpperCase()}`,
                options: variantOptions
            };
        });
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
    };

    const generateSEO = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                seo: {
                    title: `${prev.name} | Nexus OS`,
                    description: `Discover the ${prev.name}. ${prev.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}... Shop now at Nexus OS.`,
                    slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                }
            }));
            setIsGenerating(false);
        }, 1500);
    };

    // Dynamic Preview Component
    const PreviewComponent = PRODUCT_PAGE_COMPONENTS[formData.template || 'standard'];

    return (
        <div className="fixed inset-0 z-[100] bg-nexus-black flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-white">{product ? 'Edit Product' : 'New Product'}</h2>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-neutral-500'}`}></span>
                            {formData.status === 'active' ? 'Active' : 'Draft'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-neutral-400 hover:text-white font-bold text-sm">Discard</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2">
                        <Save size={16} /> Save Product
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* LEFT COLUMN: Editor (1/3 Width) */}
                <div className="w-1/3 border-r border-neutral-800 bg-neutral-900/30 flex flex-col">
                    {/* Tab Navigation */}
                    <div className="flex overflow-x-auto border-b border-neutral-800 scrollbar-hide">
                        {[
                            { id: 'general', label: 'General', icon: Box },
                            { id: 'media', label: 'Media', icon: ImageIcon },
                            { id: 'variants', label: 'Variants', icon: Search },
                            { id: 'inventory', label: 'Inventory', icon: Box },
                            { id: 'seo', label: 'SEO', icon: Search },
                            { id: 'design', label: 'Design', icon: LayoutTemplate },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="space-y-8">
                            {/* GENERAL TAB */}
                            {activeTab === 'general' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Product Name</label>
                                            <input
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-white font-bold text-lg focus:border-blue-500 outline-none transition-colors"
                                                placeholder="e.g. Cyber Shell Jacket"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-bold text-neutral-500 uppercase">Description</label>
                                                <button onClick={generateDescription} disabled={isGenerating} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-bold" title="Uses AI to generate a compelling product description based on the product name and category">
                                                    <Sparkles size={12} /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                                                </button>
                                            </div>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                className="w-full h-64 bg-black border border-neutral-800 rounded-xl p-4 text-neutral-300 focus:border-blue-500 outline-none resize-none leading-relaxed"
                                                placeholder="Describe your product. You can use basic HTML for formatting..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-white border-b border-neutral-800 pb-2">Pricing</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.price}
                                                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-black border border-neutral-800 rounded-xl p-3 pl-8 text-white font-mono focus:border-blue-500 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <label className="text-xs font-bold text-neutral-500 uppercase">Compare At</label>
                                                    <span className="text-neutral-600 text-xs cursor-help" title="Original price before discount. Shows as crossed-out to display savings.">ⓘ</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.compareAtPrice || ''}
                                                        onChange={(e) => handleInputChange('compareAtPrice', parseFloat(e.target.value) || undefined)}
                                                        className="w-full bg-black border border-neutral-800 rounded-xl p-3 pl-8 text-white font-mono focus:border-blue-500 outline-none"
                                                        placeholder="Original price (optional)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-white border-b border-neutral-800 pb-2">Organization</h3>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Category</label>
                                            <select
                                                value={formData.category_id || ''}
                                                onChange={(e) => {
                                                    const categoryId = e.target.value || undefined;
                                                    const category = categories.find(c => c.id === categoryId);
                                                    handleInputChange('category_id', categoryId);
                                                    // Also update legacy category field for backward compatibility
                                                    if (category) {
                                                        handleInputChange('category', category.name);
                                                    } else {
                                                        handleInputChange('category', '');
                                                    }
                                                }}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                            >
                                                <option value="">Select a category</option>
                                                {categories
                                                    .filter(c => c.is_visible)
                                                    .sort((a, b) => a.display_order - b.display_order)
                                                    .map(category => {
                                                        // Show indentation for subcategories
                                                        const parentCategory = categories.find(c => c.id === category.parent_id);
                                                        const prefix = parentCategory ? `  ${parentCategory.name} → ` : '';
                                                        return (
                                                            <option key={category.id} value={category.id}>
                                                                {prefix}{category.name}
                                                            </option>
                                                        );
                                                    })}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tags</label>
                                            <input
                                                value={formData.tags.join(', ')}
                                                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                                placeholder="Comma separated tags"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MEDIA TAB */}
                            {activeTab === 'media' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white">Media Gallery</h3>
                                            <p className="text-xs text-neutral-500 mt-1">JPG, PNG, WebP • Max 5MB per image</p>
                                        </div>
                                        <label className={`px-4 py-2 bg-white text-black rounded-lg font-bold text-sm cursor-pointer hover:bg-neutral-200 transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
                                            {isUploading ? 'Uploading...' : 'Upload'}
                                            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    </div>

                                    {formData.images.length === 0 ? (
                                        <div className="border-2 border-dashed border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-500"><ImageIcon size={32} /></div>
                                            <p className="text-neutral-400 font-medium">No images uploaded yet</p>
                                            <p className="text-xs text-neutral-600 mt-2">Drag & drop or click Upload above</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            {formData.images.map((img, idx) => (
                                                <div key={img.id} className="relative aspect-square bg-black rounded-xl overflow-hidden border border-neutral-800 group">
                                                    {img.url && <img src={img.url} className="w-full h-full object-cover" />}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button onClick={() => setPrimaryImage(img.id)} className={`p-2 rounded-lg ${img.isPrimary ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-neutral-200'}`} title="Set Primary">
                                                            <Sparkles size={16} />
                                                        </button>
                                                        <button onClick={() => removeImage(img.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    {img.isPrimary && <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">Primary</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* VARIANTS TAB */}
                            {activeTab === 'variants' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white">Product Options</h3>
                                            <p className="text-xs text-neutral-500 mt-1">Add size, color, or other variations</p>
                                        </div>
                                        <button onClick={addVariantOption} className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1"><Plus size={16} /> Add Option</button>
                                    </div>

                                    {formData.variantOptions.length === 0 && (
                                        <div className="p-6 border border-dashed border-neutral-800 rounded-xl text-center">
                                            <p className="text-neutral-400 text-sm">No options yet. Add options like Size (S, M, L) or Color (Red, Blue) to create product variants.</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {formData.variantOptions.map((opt, idx) => (
                                            <div key={opt.id} className="p-4 bg-black border border-neutral-800 rounded-xl space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 mr-4">
                                                        <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Option Name</label>
                                                        <input
                                                            value={opt.name}
                                                            onChange={(e) => updateVariantOption(opt.id, 'name', e.target.value)}
                                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white text-sm"
                                                            placeholder="e.g. Size, Color, Material"
                                                        />
                                                    </div>
                                                    <button onClick={() => {
                                                        setFormData(prev => ({ ...prev, variantOptions: prev.variantOptions.filter(o => o.id !== opt.id) }))
                                                    }} className="text-neutral-500 hover:text-red-500 p-2" title="Remove option"><Trash2 size={16} /></button>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Option Values</label>
                                                    <input
                                                        value={opt.values.join(', ')}
                                                        onChange={(e) => updateVariantOption(opt.id, 'values', e.target.value.split(',').map(v => v.trim()))}
                                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white text-sm"
                                                        placeholder="e.g. Small, Medium, Large (separate with commas)"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Generated Variants Table */}
                                    {formData.variants.length > 0 && (
                                        <div className="mt-8 border-t border-neutral-800 pt-6">
                                            <h4 className="font-bold text-white mb-4">Variant Inventory</h4>
                                            <p className="text-xs text-neutral-500 mb-4">Set individual prices and stock for each combination</p>
                                            <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-neutral-900 text-neutral-500 font-bold uppercase text-xs">
                                                        <tr>
                                                            <th className="p-3">Variant</th>
                                                            <th className="p-3">Price</th>
                                                            <th className="p-3">Stock</th>
                                                            <th className="p-3">SKU</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-800">
                                                        {formData.variants.map((variant) => (
                                                            <tr key={variant.id} className="hover:bg-neutral-900/50">
                                                                <td className="p-3 font-medium text-white">{variant.title}</td>
                                                                <td className="p-3">
                                                                    <input 
                                                                        type="number" 
                                                                        value={variant.price}
                                                                        onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value))}
                                                                        className="w-24 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white focus:border-blue-500 outline-none"
                                                                    />
                                                                </td>
                                                                <td className="p-3">
                                                                    <input 
                                                                        type="number" 
                                                                        value={variant.stock}
                                                                        onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value))}
                                                                        className="w-20 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white focus:border-blue-500 outline-none"
                                                                    />
                                                                </td>
                                                                <td className="p-3">
                                                                    <input 
                                                                        type="text" 
                                                                        value={variant.sku || ''}
                                                                        onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                                                        className="w-32 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white focus:border-blue-500 outline-none font-mono text-xs"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SEO TAB */}
                            {activeTab === 'seo' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white">Search Engine Settings</h3>
                                            <p className="text-xs text-neutral-500 mt-1">Help customers find you on Google</p>
                                        </div>
                                        <button onClick={generateSEO} disabled={isGenerating} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-bold" title="Auto-generate SEO fields from product info">
                                            <Sparkles size={12} /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Page Title</label>
                                            <input
                                                value={formData.seo.title}
                                                onChange={(e) => handleSeoChange('title', e.target.value)}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                                placeholder="Title shown in Google search results"
                                            />
                                            <p className="text-xs text-neutral-600 mt-1">{formData.seo.title?.length || 0}/60 characters recommended</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Meta Description</label>
                                            <textarea
                                                value={formData.seo.description}
                                                onChange={(e) => handleSeoChange('description', e.target.value)}
                                                className="w-full h-24 bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none"
                                                placeholder="Brief description shown in search results..."
                                            />
                                            <p className="text-xs text-neutral-600 mt-1">{formData.seo.description?.length || 0}/160 characters recommended</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <label className="text-xs font-bold text-neutral-500 uppercase">Page Address (URL)</label>
                                                <span className="text-neutral-600 text-xs cursor-help" title="The web address for this product. Use lowercase letters and hyphens only.">ⓘ</span>
                                            </div>
                                            <input
                                                value={formData.seo.slug}
                                                onChange={(e) => handleSeoChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none font-mono text-sm"
                                                placeholder="my-product-name"
                                            />
                                            <p className="text-xs text-neutral-600 mt-1">yourstore.com/products/<span className="text-blue-500">{formData.seo.slug || 'product-name'}</span></p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INVENTORY TAB */}
                            {activeTab === 'inventory' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="font-bold text-white border-b border-neutral-800 pb-2">Inventory Management</h3>

                                    <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-neutral-800">
                                        <div>
                                            <div className="font-bold text-white">Track Inventory</div>
                                            <div className="text-xs text-neutral-500">Automatically reduce stock when orders are placed</div>
                                        </div>
                                        <button onClick={() => handleInputChange('trackInventory', !formData.trackInventory)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.trackInventory ? 'bg-blue-600' : 'bg-neutral-700'}`}>
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.trackInventory ? 'translate-x-6' : ''}`}></div>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <label className="text-xs font-bold text-neutral-500 uppercase">SKU</label>
                                                <span className="text-neutral-600 text-xs cursor-help" title="Stock Keeping Unit - a unique identifier for inventory tracking">ⓘ</span>
                                            </div>
                                            <input
                                                value={formData.sku}
                                                onChange={(e) => handleInputChange('sku', e.target.value)}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white font-mono focus:border-blue-500 outline-none"
                                                placeholder="e.g. TSH-BLK-001"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Stock Quantity</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={formData.stock || 0}
                                                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-white font-mono focus:border-blue-500 outline-none"
                                                placeholder="0"
                                            />
                                            {formData.stock <= 5 && formData.stock > 0 && (
                                                <p className="text-xs text-amber-500 mt-1">⚠️ Low stock warning</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DESIGN TAB */}
                            {activeTab === 'design' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="font-bold text-white border-b border-neutral-800 pb-2">Product Page Design</h3>

                                    {/* Customization Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-neutral-800">
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                <Sparkles size={16} className="text-purple-500" />
                                                Product Customizer
                                            </div>
                                            <div className="text-xs text-neutral-500">Allow customers to personalize this product</div>
                                        </div>
                                        <button onClick={() => handleInputChange('allowCustomization', !formData.allowCustomization)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.allowCustomization ? 'bg-purple-600' : 'bg-neutral-700'}`}>
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.allowCustomization ? 'translate-x-6' : ''}`}></div>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {PRODUCT_PAGE_OPTIONS.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleInputChange('template', option.id)}
                                                className={`text-left p-4 rounded-xl border-2 transition-all ${formData.template === option.id ? 'bg-blue-600/10 border-blue-600' : 'bg-black border-neutral-800 hover:border-neutral-600'}`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-bold ${formData.template === option.id ? 'text-blue-500' : 'text-white'}`}>{option.name}</span>
                                                    {formData.template === option.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                                </div>
                                                <p className="text-xs text-neutral-500">{option.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Live Preview (2/3 Width) */}
                <div className="w-2/3 bg-white text-black overflow-y-auto relative">
                    {/* Preview Badge */}
                    <div className="absolute top-6 right-6 z-50 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                        <Monitor size={14} /> Live Preview
                    </div>

                    {/* Storefront Mockup */}
                    <div className="min-h-full flex flex-col">
                        {/* Mock Header */}
                        <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-12 shrink-0 bg-white z-40">
                            <div className="font-bold text-xl tracking-tight">NEXUS</div>
                            <div className="flex gap-8 text-sm font-medium text-neutral-500">
                                <span>Shop</span>
                                <span>Collections</span>
                                <span>About</span>
                            </div>
                            <div className="flex gap-4 text-neutral-900">
                                <Search size={20} />
                                <ShoppingBag size={20} />
                            </div>
                        </div>

                        {/* Product Detail Content - Dynamic */}
                        <div className="flex-1">
                            {PreviewComponent && <PreviewComponent product={formData} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
