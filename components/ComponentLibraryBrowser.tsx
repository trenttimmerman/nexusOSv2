/**
 * Component Library Browser
 * Dynamic, database-driven component library that grows from AI generations
 */

import React, { useState, useEffect } from 'react';
import { 
  fetchComponentLibrary, 
  searchComponentLibrary,
  getPopularComponents,
  getRecentComponents 
} from '../lib/componentExtractor';
import { Loader2, Search, TrendingUp, Clock, Grid, List, Filter } from 'lucide-react';

interface ComponentLibraryBrowserProps {
  type?: string;  // Filter by component type (hero, header, footer, etc.)
  onSelect: (component: any) => void;
  selectedId?: string;
}

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'popular' | 'recent';

export default function ComponentLibraryBrowser({
  type,
  onSelect,
  selectedId
}: ComponentLibraryBrowserProps) {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadComponents();
  }, [type, filterMode, categoryFilter]);

  const loadComponents = async () => {
    setLoading(true);
    try {
      let results: any[] = [];

      if (filterMode === 'popular') {
        results = await getPopularComponents(50);
      } else if (filterMode === 'recent') {
        results = await getRecentComponents(50);
      } else {
        results = await fetchComponentLibrary({
          type,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          limit: 100,
          sortBy: 'usage_count',
          sortOrder: 'desc'
        });
      }

      // Filter by type if specified
      if (type) {
        results = results.filter(c => c.type === type);
      }

      setComponents(results);
    } catch (error) {
      console.error('Error loading components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      loadComponents();
      return;
    }

    setLoading(true);
    try {
      const results = await searchComponentLibrary(term);
      
      // Filter by type if specified
      if (type) {
        setComponents(results.filter(c => c.type === type));
      } else {
        setComponents(results);
      }
    } catch (error) {
      console.error('Error searching components:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'layout', name: 'Layout' },
    { id: 'content', name: 'Content' },
    { id: 'commerce', name: 'Commerce' },
    { id: 'forms', name: 'Forms' },
    { id: 'other', name: 'Other' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            style={{ color: '#000000' }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Filter Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              All
            </button>
            <button
              onClick={() => setFilterMode('popular')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterMode === 'popular'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Popular
            </button>
            <button
              onClick={() => setFilterMode('recent')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterMode === 'recent'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Recent
            </button>
          </div>

          {/* Category Filter */}
          {!type && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white"
              style={{ color: '#000000' }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}

          {/* View Mode */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Components Grid/List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600 max-w-sm">
              {searchTerm 
                ? 'Try a different search term or clear filters'
                : 'Components will appear here as they are generated from AI websites'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                onSelect={onSelect}
                isSelected={selectedId === component.id}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((component) => (
              <ComponentListItem
                key={component.id}
                component={component}
                onSelect={onSelect}
                isSelected={selectedId === component.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Component Card (Grid View)
function ComponentCard({ 
  component, 
  onSelect, 
  isSelected 
}: { 
  component: any; 
  onSelect: (c: any) => void; 
  isSelected: boolean;
}) {
  const usageCount = component.metadata?.usage_count || 0;
  
  return (
    <button
      onClick={() => onSelect(component)}
      className={`group relative bg-white border-2 rounded-lg p-3 text-left transition-all hover:shadow-lg ${
        isSelected 
          ? 'border-purple-500 shadow-lg' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {component.thumbnail_url ? (
          <img 
            src={component.thumbnail_url} 
            alt={component.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">
            {getComponentEmoji(component.type)}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-medium text-sm text-gray-900 mb-1 truncate">
          {component.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-0.5 bg-gray-100 rounded">
            {component.type}
          </span>
          {usageCount > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {usageCount}
            </span>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Component List Item (List View)
function ComponentListItem({ 
  component, 
  onSelect, 
  isSelected 
}: { 
  component: any; 
  onSelect: (c: any) => void; 
  isSelected: boolean;
}) {
  const usageCount = component.metadata?.usage_count || 0;
  const createdDate = new Date(component.created_at).toLocaleDateString();
  
  return (
    <button
      onClick={() => onSelect(component)}
      className={`w-full flex items-center gap-4 p-4 bg-white border-2 rounded-lg text-left transition-all hover:shadow-md ${
        isSelected 
          ? 'border-purple-500 shadow-md' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {component.thumbnail_url ? (
          <img 
            src={component.thumbnail_url} 
            alt={component.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-3xl">
            {getComponentEmoji(component.type)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">
          {component.name}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="px-2 py-0.5 bg-gray-100 rounded">
            {component.type}
          </span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
            {component.category}
          </span>
          {usageCount > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {usageCount} uses
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {createdDate}
          </span>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Helper to get emoji for component type
function getComponentEmoji(type: string): string {
  const emojis: Record<string, string> = {
    'hero': '🎯',
    'header': '📋',
    'footer': '📍',
    'rich-text': '📝',
    'features': '⭐',
    'testimonials': '💬',
    'gallery': '🖼️',
    'product-grid': '🛍️',
    'product-card': '🏷️',
    'cta': '🎯',
    'contact': '📧'
  };
  
  return emojis[type] || '📦';
}
