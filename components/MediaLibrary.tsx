import React, { useState, useRef } from 'react';
import { MediaAsset } from '../types';
import { Upload, Link, Trash2, Image as ImageIcon, Box, Film, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface MediaLibraryProps {
  assets: MediaAsset[];
  onAddAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ assets, onAddAsset, onDeleteAsset }) => {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const type = file.type.startsWith('image/') ? 'image' : file.name.endsWith('.glb') || file.name.endsWith('.gltf') ? 'model' : 'video';
      
      const newAsset: MediaAsset = {
        id: Math.random().toString(36).substr(2, 9),
        url: publicUrl,
        name: file.name,
        type: type as 'image' | 'model' | 'video',
        size: file.size,
        createdAt: new Date().toISOString()
      };
      onAddAsset(newAsset);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput) return;
    
    const type = urlInput.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? 'image' : 
                 urlInput.match(/\.(glb|gltf)$/i) ? 'model' : 
                 urlInput.match(/\.(mp4|webm)$/i) ? 'video' : 'image';

    const newAsset: MediaAsset = {
      id: Math.random().toString(36).substr(2, 9),
      url: urlInput,
      name: nameInput || 'External Asset',
      type: type as 'image' | 'model' | 'video',
      createdAt: new Date().toISOString()
    };
    onAddAsset(newAsset);
    setUrlInput('');
    setNameInput('');
    setIsUrlMode(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'External';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Media Library</h2>
          <p className="text-neutral-500">Manage images, 3D models, and videos</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Link size={18} /> Add URL
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />} Upload
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,.glb,.gltf,video/*"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {isUrlMode && (
        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl animate-in slide-in-from-top-2">
          <h3 className="font-bold text-white mb-4">Add External Asset</h3>
          <div className="flex gap-4">
            <input 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Asset Name (Optional)"
              className="flex-1 bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
            />
            <input 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-[2] bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
            />
            <button 
              onClick={handleUrlAdd}
              disabled={!urlInput}
              className="px-6 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map(asset => (
          <div key={asset.id} className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-600 transition-all">
            <div className="aspect-square bg-black/50 relative flex items-center justify-center overflow-hidden">
              {asset.type === 'image' ? (
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
              ) : asset.type === 'model' ? (
                <div className="text-blue-500 flex flex-col items-center">
                  <Box size={48} />
                  <span className="text-[10px] font-mono mt-2 uppercase">3D Model</span>
                </div>
              ) : (
                <div className="text-purple-500 flex flex-col items-center">
                  <Film size={48} />
                  <span className="text-[10px] font-mono mt-2 uppercase">Video</span>
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => copyToClipboard(asset.url, asset.id)}
                  className="p-2 bg-white text-black rounded-lg hover:bg-neutral-200"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={() => onDeleteAsset(asset.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="font-bold text-white text-sm truncate mb-1" title={asset.name}>{asset.name}</div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                <span className="uppercase">{asset.type}</span>
                <span>{formatSize(asset.size)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {assets.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-800 rounded-2xl">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="font-bold">No assets found</p>
            <p className="text-sm">Upload files or add external URLs to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
