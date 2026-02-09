// TEMPORARY COMPATIBILITY STUB
// This file is a placeholder until HeroEditor is rebuilt in Designer V3

import React from 'react';
import { X } from 'lucide-react';

interface HeroEditorProps {
  data?: any;
  onChange?: (updates: any) => void;
  onClose?: () => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ data, onChange, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Hero Editor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Hero Editor</div>
          <p className="text-gray-500 text-sm">Being rebuilt in Designer V3</p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};
