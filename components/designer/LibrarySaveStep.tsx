/**
 * LibrarySaveStep - Step 3 of Designer V3 Wizard
 * Optional step to save custom header design to community library
 * 
 * Designer V3 - Phase 5: Library Save
 */

import React, { useState } from 'react';
import { Check, X, Share2, Lock, Globe, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { HeaderConfig } from '../../types/designer';

interface LibrarySaveStepProps {
  storeId: string;
  headerConfig: HeaderConfig;
  headerVariant: string;
  onComplete: (saved: boolean, headerId?: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

export const LibrarySaveStep: React.FC<LibrarySaveStepProps> = ({
  storeId,
  headerConfig,
  headerVariant,
  onComplete,
  onBack,
  onSkip
}) => {
  const [name, setName] = useState(`Custom ${headerVariant} Header`);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'public' | 'private' | 'community'>('private');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your header');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/headers/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          name: name.trim(),
          description: description.trim(),
          config: headerConfig,
          tags,
          status,
          aiGenerated: false,
          designTrends: ['Custom Design 2026']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Save failed: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess(true);
      
      // Complete after short delay to show success message
      setTimeout(() => {
        onComplete(true, data.header?.id);
      }, 1500);

    } catch (err: any) {
      console.error('[Library Save] Save error:', err);
      setError(err.message || 'Failed to save header');
      setIsSaving(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[400] bg-neutral-950 flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50 animate-pulse">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Header Saved!</h2>
          <p className="text-neutral-400 text-lg">
            Your custom header has been saved to the library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[400] bg-neutral-950 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Save to Library</h2>
            <p className="text-sm text-neutral-400">Share your design with the community (optional)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Skip This Step
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save & Complete
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Preview Card */}
          <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="aspect-[3/1] bg-neutral-800 flex items-center justify-center">
              <span className="text-neutral-600 text-sm">Header Preview</span>
            </div>
            <div className="p-4 border-t border-neutral-800">
              <p className="text-neutral-400 text-sm">
                Preview will be generated when saved
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Header Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Modern E-commerce Header"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-neutral-500">
                {name.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your header design, what makes it unique..."
                rows={4}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-neutral-500">
                {description.length}/500 characters
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 bg-neutral-800 border-2 border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-600 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={status === 'private'}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-neutral-400" />
                      <span className="font-medium text-white">Private</span>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Only you can see and use this header
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-neutral-800 border-2 border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-600 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="community"
                    checked={status === 'community'}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-white">Community</span>
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Share with the WebPilot community to help others
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-neutral-800 border-2 border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-600 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={status === 'public'}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-white">Public</span>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Featured in the public library for all users
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
              <p className="text-blue-300 text-sm">
                💡 <strong>Tip:</strong> Sharing your design helps grow our community library 
                and earns you recognition. All shared headers are reviewed for quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
