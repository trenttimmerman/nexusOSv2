import React, { useState, useEffect } from 'react';
import { StoreDesign, HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId, ScrollbarStyleId } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Palette, Copy, Trash2, Check, Plus, Eye, Edit2, X } from 'lucide-react';

interface DesignLibraryProps {
  storeId: string;
  onDesignActivated?: (design: StoreDesign) => void;
  onNavigateToDesignStudio?: () => void;
}

export const DesignLibrary: React.FC<DesignLibraryProps> = ({ storeId, onDesignActivated, onNavigateToDesignStudio }) => {
  const [designs, setDesigns] = useState<StoreDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesigns();
  }, [storeId]);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_designs')
        .select('*')
        .eq('store_id', storeId)
        .order('is_active', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error loading designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewDesign = async () => {
    const newDesign: Partial<StoreDesign> = {
      store_id: storeId,
      name: `New Design ${new Date().toLocaleDateString()}`,
      is_active: true, // Make it active so user can edit it immediately
      header_style: 'canvas',
      hero_style: 'impact',
      product_card_style: 'classic',
      footer_style: 'columns',
      scrollbar_style: 'native',
      primary_color: '#3b82f6',
      secondary_color: '#8B5CF6',
      background_color: '#FFFFFF',
      store_vibe: 'minimal',
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        headingColor: '#000000',
        bodyColor: '#737373',
        linkColor: '#3b82f6',
        baseFontSize: '16px',
        headingScale: 'default',
        headingWeight: '700',
        bodyWeight: '400',
      },
    };

    try {
      const { data, error } = await supabase
        .from('store_designs')
        .insert([newDesign])
        .select()
        .single();

      if (error) throw error;
      
      // Navigate to Design Studio to customize the new design
      if (onNavigateToDesignStudio) {
        onNavigateToDesignStudio();
      }
    } catch (error) {
      console.error('Error creating design:', error);
      alert('Failed to create design');
    }
  };

  const duplicateDesign = async (design: StoreDesign) => {
    const duplicate = {
      ...design,
      id: undefined,
      name: `${design.name} (Copy)`,
      is_active: false,
      created_at: undefined,
      updated_at: undefined,
    };

    try {
      const { error } = await supabase
        .from('store_designs')
        .insert([duplicate]);

      if (error) throw error;
      await loadDesigns();
    } catch (error) {
      console.error('Error duplicating design:', error);
      alert('Failed to duplicate design');
    }
  };

  const activateDesign = async (design: StoreDesign) => {
    try {
      const { error } = await supabase
        .from('store_designs')
        .update({ is_active: true })
        .eq('id', design.id);

      if (error) throw error;
      
      await loadDesigns();
      if (onDesignActivated) {
        onDesignActivated(design);
      }
      // Reload the page to apply the new design
      window.location.reload();
    } catch (error) {
      console.error('Error activating design:', error);
      alert('Failed to activate design');
    }
  };

  const deleteDesign = async (design: StoreDesign) => {
    if (design.is_active) {
      alert('Cannot delete the active design. Please activate another design first.');
      return;
    }

    if (!confirm(`Delete "${design.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('store_designs')
        .delete()
        .eq('id', design.id);

      if (error) throw error;
      await loadDesigns();
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Failed to delete design');
    }
  };

  const updateDesignName = async (design: StoreDesign, newName: string) => {
    try {
      const { error } = await supabase
        .from('store_designs')
        .update({ name: newName })
        .eq('id', design.id);

      if (error) throw error;
      await loadDesigns();
    } catch (error) {
      console.error('Error updating design name:', error);
      alert('Failed to update design name');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Design Library</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Create and manage multiple website designs. Switch between themes instantly.
          </p>
        </div>
        <button
          onClick={createNewDesign}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          New Design
        </button>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            onActivate={() => activateDesign(design)}
            onDuplicate={() => duplicateDesign(design)}
            onDelete={() => deleteDesign(design)}
            onEdit={() => {
              // Activate the design and navigate to Design Studio
              if (!design.is_active) {
                activateDesign(design);
              } else if (onNavigateToDesignStudio) {
                onNavigateToDesignStudio();
              }
            }}
            onUpdateName={(newName) => updateDesignName(design, newName)}
          />
        ))}
      </div>

      {designs.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl">
          <Palette size={48} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-500 mb-4">No designs yet</p>
          <button
            onClick={createNewDesign}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Your First Design
          </button>
        </div>
      )}
    </div>
  );
};

interface DesignCardProps {
  design: StoreDesign;
  onActivate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onUpdateName: (name: string) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  onActivate,
  onDuplicate,
  onDelete,
  onEdit,
  onUpdateName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(design.name);

  const handleNameSave = () => {
    if (nameInput.trim() && nameInput !== design.name) {
      onUpdateName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div
      className={`border-2 rounded-xl p-4 transition-all ${
        design.is_active
          ? 'border-blue-500 bg-blue-50'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Active Badge */}
      {design.is_active && (
        <div className="flex items-center gap-1 text-xs font-medium text-blue-600 mb-2">
          <Check size={14} />
          ACTIVE
        </div>
      )}

      {/* Name */}
      {isEditingName ? (
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={handleNameSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleNameSave();
            if (e.key === 'Escape') {
              setNameInput(design.name);
              setIsEditingName(false);
            }
          }}
          className="w-full px-2 py-1 border border-blue-500 rounded mb-3 font-semibold"
          autoFocus
        />
      ) : (
        <h3
          className="font-semibold mb-3 cursor-pointer hover:text-blue-600"
          onClick={() => setIsEditingName(true)}
        >
          {design.name}
        </h3>
      )}

      {/* Preview Colors */}
      <div className="flex gap-2 mb-4">
        <div
          className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
          style={{ backgroundColor: design.primary_color }}
          title="Primary"
        />
        <div
          className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
          style={{ backgroundColor: design.secondary_color }}
          title="Secondary"
        />
        <div
          className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
          style={{ backgroundColor: design.background_color }}
          title="Background"
        />
      </div>

      {/* Details */}
      <div className="text-xs text-neutral-500 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Header:</span>
          <span className="font-medium text-neutral-700">{design.header_style}</span>
        </div>
        <div className="flex justify-between">
          <span>Hero:</span>
          <span className="font-medium text-neutral-700">{design.hero_style}</span>
        </div>
        <div className="flex justify-between">
          <span>Vibe:</span>
          <span className="font-medium text-neutral-700">{design.store_vibe}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!design.is_active && (
          <button
            onClick={onActivate}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Activate
          </button>
        )}
        <button
          onClick={onDuplicate}
          className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          title="Duplicate"
        >
          <Copy size={16} />
        </button>
        {!design.is_active && (
          <button
            onClick={onDelete}
            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DesignLibrary;
