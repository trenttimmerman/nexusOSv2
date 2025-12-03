import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Copy, Layout, Settings, Move } from 'lucide-react';

interface SectionWrapperProps {
  children: React.ReactNode;
  blockId: string;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSwitchLayout?: () => void;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  blockId,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  onSwitchLayout
}) => {
  return (
    <div 
      className={`relative group transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-600 z-10' : 'hover:ring-1 hover:ring-blue-400/50'}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Floating Toolbar */}
      {isSelected && (
        <div className="absolute -top-12 right-4 flex items-center gap-1 bg-white shadow-xl rounded-lg p-1 border border-gray-200 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-1">
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

          <div className="flex items-center gap-1 pl-2 border-l border-gray-200 ml-1">
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

      {/* Label Tag (Visible on Hover) */}
      {!isSelected && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Click to Edit
        </div>
      )}

      {children}
    </div>
  );
};
