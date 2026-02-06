import React, { useState } from 'react';
import { X, Check, Crown, Sparkles } from 'lucide-react';
import { HeroData, AI_HERO_COMPONENTS } from './AiHeroLibrary';

interface GeneratedHero {
  id: string;
  name: string;
  description: string;
  layout: NonNullable<HeroData['variant']>;
  data: HeroData;
  exclusivePrice?: number;
}

interface AIHeroPreviewProps {
  heroes: GeneratedHero[];
  onSelect: (hero: GeneratedHero, makeExclusive: boolean) => void;
  onClose: () => void;
  isGenerating?: boolean;
}

export default function AIHeroPreview({ 
  heroes, 
  onSelect, 
  onClose,
  isGenerating = false 
}: AIHeroPreviewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exclusiveFlags, setExclusiveFlags] = useState<Record<string, boolean>>({});

  const handleSelect = (hero: GeneratedHero) => {
    const makeExclusive = exclusiveFlags[hero.id] || false;
    onSelect(hero, makeExclusive);
  };

  const toggleExclusive = (heroId: string) => {
    setExclusiveFlags(prev => ({
      ...prev,
      [heroId]: !prev[heroId]
    }));
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-purple-600 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Generating Your Custom Heroes</h3>
            <p className="text-gray-600 text-center">
              Our AI is crafting 3 unique hero sections tailored to your requirements...
            </p>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Perfect Hero</h2>
              <p className="text-sm text-gray-600 mt-1">Select one of these AI-generated designs for your page</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Hero Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {heroes.map((hero, index) => (
              <div
                key={hero.id}
                className={`relative border-4 rounded-xl overflow-hidden transition-all ${
                  selectedId === hero.id
                    ? 'border-purple-600 shadow-2xl shadow-purple-300 scale-105'
                    : 'border-gray-300 hover:border-purple-400 hover:shadow-xl'
                }`}
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-base font-bold text-gray-800 shadow-lg">
                  Design {index + 1}
                </div>

                {/* Preview - MUCH BIGGER */}
                <div className="relative bg-gray-50 overflow-hidden" style={{ height: '500px' }}>
                  <div className="absolute inset-0 scale-[0.75] origin-top" style={{ width: '133%', height: '133%', left: '-16.5%' }}>
                    {(() => {
                      const HeroComponent = AI_HERO_COMPONENTS[hero.layout] || AI_HERO_COMPONENTS['centered'];
                      return <HeroComponent data={hero.data} />;
                    })()}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{hero.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{hero.description}</p>

                  {/* Exclusive Option */}
                  {hero.exclusivePrice && (
                    <div className="mb-3">
                      <button
                        onClick={() => toggleExclusive(hero.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                          exclusiveFlags[hero.id]
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Crown className={`w-5 h-5 ${exclusiveFlags[hero.id] ? 'text-yellow-600' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${exclusiveFlags[hero.id] ? 'text-yellow-900' : 'text-gray-700'}`}>
                            Make Exclusive
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${exclusiveFlags[hero.id] ? 'text-yellow-600' : 'text-gray-500'}`}>
                          ${hero.exclusivePrice}
                        </span>
                      </button>
                      {exclusiveFlags[hero.id] && (
                        <p className="text-xs text-gray-500 mt-2 px-1">
                          This design will be removed from the community library and yours exclusively.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelect(hero)}
                    onMouseEnter={() => setSelectedId(hero.id)}
                    onMouseLeave={() => setSelectedId(null)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      selectedId === hero.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedId === hero.id && <Check className="w-5 h-5" />}
                    Select This One
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <Sparkles className="w-4 h-4 inline mr-1 text-purple-600" />
            All designs are automatically optimized for mobile and desktop
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
