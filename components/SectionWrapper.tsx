import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Copy, Layout, Settings, Move, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface SectionWrapperProps {
  children: React.ReactNode;
  blockId: string;
  isSelected: boolean;
  isHidden?: boolean;
  isLocked?: boolean;
  onSelect: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSwitchLayout?: () => void;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  blockId,
  isSelected,
  isHidden,
  isLocked,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  onSwitchLayout,
  onToggleVisibility,
  onToggleLock
}) => {
  return (
    <div 
      className={`relative group transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-600 z-10' : 'hover:ring-1 hover:ring-blue-400/50'} ${isHidden ? 'opacity-40 grayscale' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isLocked) onSelect();
      }}
    >
      {/* Floating Toolbar */}
      {isSelected && (
        <div className="absolute -top-12 right-4 flex items-center gap-1 bg-white shadow-xl rounded-lg p-1 border border-gray-200 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-1">
            <div className="p-2 text-gray-300 cursor-grab active:cursor-grabbing" title="Drag to Reorder">
              <Move size={16} />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
              title="Move Up"
            >
              <ArrowUp size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
              title="Move Down"
            >
              <ArrowDown size={16} />
            </button>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onSwitchLayout?.(); }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 text-blue-600 rounded font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Layout size={14} />
            Switch Layout
          </button>

          <div className="flex items-center gap-1 px-2 border-x border-gray-200 mx-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(); }}
              className={`p-2 rounded transition-colors ${isHidden ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`}
              title={isHidden ? "Show Section" : "Hide Section"}
            >
              {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleLock?.(); }}
              className={`p-2 rounded transition-colors ${isLocked ? 'bg-amber-50 text-amber-600' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`}
              title={isLocked ? "Unlock Section" : "Lock Section"}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-1 pl-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
              title="Duplicate"
            >
              <Copy size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute top-2 left-2 flex gap-1 z-20">
        {isHidden && (
          <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <EyeOff size={10} /> HIDDEN
          </div>
        )}
        {isLocked && (
          <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <Lock size={10} /> LOCKED
          </div>
        )}
      </div>

      {/* Label Tag (Visible on Hover) */}
      {!isSelected && !isLocked && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Click to Edit
        </div>
      )}

      {isLocked && !isSelected && (
        <div className="absolute inset-0 bg-black/5 cursor-not-allowed z-10" />
      )}

      {children}
    </div>
  );
};
