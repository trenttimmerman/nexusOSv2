// MediaLibrary.tsx - Clean slate for Designer V3
import React from 'react';

// Placeholder - to be rebuilt
export const MEDIA_COMPONENTS: Record<string, React.ComponentType<any>> = {};

export const MEDIA_OPTIONS: any[] = [];

export const MEDIA_FIELDS: Record<string, any> = {};

// MediaLibrary component placeholder
interface MediaLibraryProps {
  assets: any[];
  onAddAsset?: (asset: any) => void;
  onDeleteAsset?: (assetId: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  assets,
  onAddAsset,
  onDeleteAsset
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Media Library</h2>
      <p className="text-gray-600">Coming soon in Designer V3</p>
    </div>
  );
};
