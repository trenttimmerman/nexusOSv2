import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { 
  Package, Search, Plus, Edit2, Trash2, MoreHorizontal,
  Image, Tag, DollarSign, Grid, List, Loader2, X,
  ChevronDown, Filter, Check, AlertCircle
} from 'lucide-react';

interface ProductsProps {
  onEditProduct?: (productId: string) => void;
}

const Products: React.FC<ProductsProps> = ({ onEditProduct }) => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (productData: Partial<Product>) => {
    await addProduct(productData as Omit<Product, 'id' | 'store_id' | 'created_at' | 'updated_at'>);
    setShowAddModal(false);
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, productData);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setDeleteConfirm(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-neutral-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        
        {categories.length > 0 && (
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
          <Package className="mx-auto mb-4 text-neutral-600" size={48} />
          <h3 className="text-lg font-bold text-white mb-2">
            {searchQuery || selectedCategory ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-neutral-500 text-sm mb-4">
            {searchQuery || selectedCategory 
              ? 'Try adjusting your search or filters.' 
              : 'Add your first product to get started.'}
          </p>
          {!searchQuery && !selectedCategory && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
            >
              Add Product
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors">
              <div className="aspect-square bg-neutral-800 relative overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="text-neutral-600" size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEditProduct ? onEditProduct(product.id) : setEditingProduct(product)}
                    className="p-2 bg-white rounded-lg text-black hover:bg-neutral-200 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1 truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-400">{formatPrice(product.price)}</span>
                  {product.category && (
                    <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full">{product.category}</span>
                  )}
                </div>
                {product.stock !== undefined && (
                  <p className={`text-xs mt-2 ${product.stock > 0 ? 'text-neutral-500' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-neutral-800">
              <tr className="text-left text-xs font-bold text-neutral-500 uppercase">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="text-neutral-600" size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-neutral-500 truncate max-w-xs">{product.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {product.category ? (
                      <span className="text-sm bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full">{product.category}</span>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-green-400">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    {product.stock !== undefined ? (
                      <span className={product.stock > 0 ? 'text-white' : 'text-red-400'}>
                        {product.stock > 0 ? product.stock : 'Out of stock'}
                      </span>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditProduct ? onEditProduct(product.id) : setEditingProduct(product)}
                        className="p-2 hover:bg-neutral-800 text-neutral-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 hover:bg-red-900/20 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowAddModal(false); setEditingProduct(null); }}
          onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="text-red-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delete Product?</h2>
                <p className="text-neutral-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ? (product.price / 100).toString() : '',
    category: product?.category || '',
    stock: product?.stock?.toString() || '',
    images: product?.images || []
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description || undefined,
      price: Math.round(parseFloat(formData.price) * 100),
      category: formData.category || undefined,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      images: formData.images
    });
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors resize-none"
              rows={3}
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Price *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., Electronics, Clothing"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Images</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white hover:bg-neutral-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;
