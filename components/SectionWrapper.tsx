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
