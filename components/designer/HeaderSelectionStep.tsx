/**
 * HeaderSelectionStep - Step 1 of Designer V3 Wizard
 * Browse library or generate 3 AI header designs
 * 
 * Designer V3 - Phase 3: Header Selection UI
 */

import React, { useState, useEffect } from 'react';
import { Wand2, Sparkles, ChevronRight, Loader2, Search, Filter } from 'lucide-react';
import { SharedHeaderLibrary, HeaderConfig } from '../../types/designer';

interface HeaderSelectionStepProps {
  storeId: string;
  storeName: string;
  onSelectHeader: (header: SharedHeaderLibrary) => void;
  onBack?: () => void;
}

export const HeaderSelectionStep: React.FC<HeaderSelectionStepProps> = ({
  storeId,
  storeName,
  onSelectHeader,
  onBack
}) => {
  const [libraryHeaders, setLibraryHeaders] = useState<SharedHeaderLibrary[]>([]);
  const [generatedHeaders, setGeneratedHeaders] = useState<SharedHeaderLibrary[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAI, setFilterAI] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch library headers on mount
  useEffect(() => {
    fetchLibraryHeaders();
  }, []);

  const fetchLibraryHeaders = async () => {
    setIsLoadingLibrary(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        status: 'public,community',
        limit: '20',
        sortBy: 'times_used',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/headers/library?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch library: ${response.statusText}`);
      }

      const data = await response.json();
      // Normalize headers to ensure proper metadata structure
      const normalizedHeaders = (data.headers || []).map((h: any) => normalizeHeader(h));
      setLibraryHeaders(normalizedHeaders);
    } catch (err: any) {
      console.error('[Header Selection] Library fetch error:', err);
      setError(err.message || 'Failed to load header library');
      setLibraryHeaders([]);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  // Normalize header data structure (database returns flat structure, we need nested metadata)
  const normalizeHeader = (header: any): SharedHeaderLibrary => {
    // If already has nested metadata structure, return as-is
    if (header.metadata && typeof header.metadata === 'object') {
      return {
        ...header,
        metadata: {
          createdBy: header.metadata.createdBy || 'unknown',
          createdAt: header.metadata.createdAt || new Date().toISOString(),
          timesUsed: header.metadata.timesUsed || 0,
          averageRating: header.metadata.averageRating,
          tags: Array.isArray(header.metadata.tags) ? header.metadata.tags : [],
          aiGenerated: header.metadata.aiGenerated || false,
          designTrends: Array.isArray(header.metadata.designTrends) ? header.metadata.designTrends : []
        }
      };
    }

    // Transform flat database structure to nested metadata
    return {
      id: header.id,
      name: header.name || 'Untitled Header',
      description: header.description,
      component: header.component || '',
      config: header.config || {},
      preview: header.preview || '/placeholder-header.png',
      metadata: {
        createdBy: header.created_by || 'unknown',
        createdAt: header.created_at || new Date().toISOString(),
        timesUsed: header.times_used || 0,
        averageRating: header.average_rating,
        tags: Array.isArray(header.tags) ? header.tags : [],
        aiGenerated: header.ai_generated || false,
        designTrends: Array.isArray(header.design_trends) ? header.design_trends : []
      },
      status: header.status || 'private'
    };
  };

  const handleGenerateHeaders = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-headers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          brandName: storeName,
          stylePreferences: ['modern'],
        })
      });

      // Get response text first to avoid parse errors
      const responseText = await response.text();
      
      // Check if response is JSON by parsing
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[AI Generation] Non-JSON response:', responseText.substring(0, 200));
        
        // Check if it's an HTML error page (dev environment)
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
          throw new Error('AI Generation is only available in production (requires Vercel deployment). Please browse the header library instead.');
        }
        
        // Otherwise it's a real production error - show what we can
        throw new Error(`API Error: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Generation failed: ${response.statusText}`);
      }
      
      // Transform API response to SharedHeaderLibrary format
      const headers = data.headers.map((h: any) => ({
        id: h.id,
        name: h.name,
        description: `AI-generated ${h.config.layout || 'modern'} header`,
        component: '', // Will be generated when saved
        config: h.config,
        preview: h.preview,
        metadata: {
          createdBy: 'ai-generated',
          createdAt: h.metadata.generatedAt,
          timesUsed: 0,
          tags: ['AI Generated', h.config.layout || 'modern'],
          aiGenerated: true,
          designTrends: h.metadata.designTrends || []
        },
        status: 'private' as const
      }));

      setGeneratedHeaders(headers);
    } catch (err: any) {
      console.error('[Header Selection] Generation error:', err);
      setError(err.message || 'Failed to generate headers');
    } finally {
      setIsGenerating(false);
    }
  };

  // Combine and filter headers (normalize library headers)
  const normalizedLibraryHeaders = libraryHeaders.map(normalizeHeader);
  const allHeaders = [...generatedHeaders, ...normalizedLibraryHeaders];
  const filteredHeaders = allHeaders.filter(header => {
    const matchesSearch = !searchQuery || 
      header.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      header.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterAI === null || header.metadata?.aiGenerated === filterAI;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-blue-950/20 to-purple-950/20">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Choose Your Header Design
              </h1>
              <p className="text-neutral-400">
                Select from our library or generate 3 unique AI designs
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Back
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headers..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-400" />
              <select
                value={filterAI === null ? 'all' : filterAI ? 'ai' : 'manual'}
                onChange={(e) => setFilterAI(e.target.value === 'all' ? null : e.target.value === 'ai')}
                className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Headers</option>
                <option value="ai">AI Generated</option>
                <option value="manual">Platform Headers</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Generation CTA */}
        {generatedHeaders.length === 0 && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    ✨ Let AI Design Your Header
                  </h2>
                </div>
                <p className="text-blue-50 text-lg max-w-2xl">
                  Our Gemini AI will create 3 unique, professionally designed headers 
                  tailored specifically for <span className="font-semibold">{storeName}</span> in seconds.
                </p>
              </div>
              <button
                onClick={handleGenerateHeaders}
                disabled={isGenerating}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate 3 AI Designs
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={generatedHeaders.length > 0 ? handleGenerateHeaders : fetchLibraryHeaders}
              className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Generated Headers Section */}
        {generatedHeaders.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Your AI-Generated Headers
              </h2>
              <button
                onClick={handleGenerateHeaders}
                disabled={isGenerating}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                Regenerate
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedHeaders.map((header) => (
                <HeaderPreviewCard
                  key={header.id}
                  header={header}
                  onSelect={onSelectHeader}
                  isAIGenerated
                />
              ))}
            </div>
          </div>
        )}

        {/* Library Headers Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {generatedHeaders.length > 0 ? 'Platform Headers' : 'Header Library'}
          </h2>
          
          {isLoadingLibrary ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredHeaders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">
                {searchQuery || filterAI !== null 
                  ? 'No headers match your search criteria' 
                  : 'No headers available in library'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHeaders.map((header) => (
                <HeaderPreviewCard
                  key={header.id}
                  header={header}
                  onSelect={onSelectHeader}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * HeaderPreviewCard - Individual header preview card
 */
interface HeaderPreviewCardProps {
  header: SharedHeaderLibrary;
  onSelect: (header: SharedHeaderLibrary) => void;
  isAIGenerated?: boolean;
}

const HeaderPreviewCard: React.FC<HeaderPreviewCardProps> = ({ 
  header, 
  onSelect,
  isAIGenerated 
}) => {
  const isAI = isAIGenerated || header.metadata?.aiGenerated;
  
  return (
    <div className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      {/* Preview Image */}
      <div className="relative aspect-[3/1] bg-neutral-800 overflow-hidden">
        {header.preview && header.preview !== '/placeholder-header.png' ? (
          <img 
            src={header.preview} 
            alt={header.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
            <span className="text-neutral-600 text-sm font-medium">
              {header.name}
            </span>
          </div>
        )}
        {isAI && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold mb-1 truncate">{header.name}</h3>
        {header.description && (
          <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
            {header.description}
          </p>
        )}

        {/* Tags */}
        {header.metadata?.tags && Array.isArray(header.metadata.tags) && header.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {header.metadata.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
          <span>Used {header.metadata?.timesUsed || 0}×</span>
          {header.metadata?.averageRating && (
            <span>★ {header.metadata.averageRating.toFixed(1)}</span>
          )}
        </div>

        {/* Select Button */}
        <button
          onClick={() => onSelect(header)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-700"
        >
          Choose This Header
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
