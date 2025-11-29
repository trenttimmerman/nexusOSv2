import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Move, ZoomIn, ZoomOut, RotateCw, Check, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCustomizerProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (customizationData: any) => void;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ product, onClose, onAddToCart }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage
  const [scale, setScale] = useState(0.3);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Convert delta to percentage
    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;

    setPosition(prev => ({
      x: Math.min(100, Math.max(0, prev.x + deltaXPercent)),
      y: Math.min(100, Math.max(0, prev.y + deltaYPercent))
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSave = () => {
    onAddToCart({
      image: uploadedImage,
      position,
      scale,
      rotation
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-[90vh] bg-neutral-900 rounded-3xl border border-neutral-800 flex overflow-hidden shadow-2xl">
        
        {/* LEFT: Canvas Area */}
        <div className="flex-1 relative bg-neutral-800/50 flex items-center justify-center overflow-hidden select-none">
            <div 
                ref={containerRef}
                className="relative w-full h-full max-w-[600px] max-h-[600px] aspect-square bg-white rounded-lg shadow-xl overflow-hidden"
                onMouseMove={handleMouseMove}
            >
                {/* Product Base Image */}
                <img 
                    src={product.images?.[0]?.url || product.image} 
                    className="w-full h-full object-contain pointer-events-none select-none" 
                    alt="Product Base"
                />

                {/* Custom Layer */}
                {uploadedImage && (
                    <div 
                        className="absolute cursor-move origin-center"
                        style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                            width: '100%', // Base width relative to container, scaled down
                            maxWidth: '500px'
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="relative group">
                            <img src={uploadedImage} className="w-full h-auto drop-shadow-xl" draggable={false} />
                            {/* Selection Border (Visible on Hover/Drag) */}
                            <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>
                        </div>
                    </div>
                )}

                {/* Overlay Grid (Optional guide) */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Canvas Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur border border-neutral-700 rounded-full px-6 py-3 flex items-center gap-6">
                <button onClick={() => setScale(s => Math.max(0.1, s - 0.05))} className="text-white hover:text-blue-400 transition-colors"><ZoomOut size={20} /></button>
                <span className="text-xs font-mono text-neutral-400 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(2, s + 0.05))} className="text-white hover:text-blue-400 transition-colors"><ZoomIn size={20} /></button>
                <div className="w-px h-4 bg-neutral-700"></div>
                <button onClick={() => setRotation(r => r + 90)} className="text-white hover:text-blue-400 transition-colors"><RotateCw size={20} /></button>
            </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="w-96 bg-neutral-950 border-l border-neutral-800 flex flex-col">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Customizer</h2>
                    <p className="text-xs text-neutral-500">Personalize your {product.name}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Upload Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">1. Upload Design</h3>
                    <label className="block w-full aspect-video border-2 border-dashed border-neutral-800 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        {uploadedImage ? (
                            <img src={uploadedImage} className="w-full h-full object-contain p-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 group-hover:text-blue-500">
                                <Upload size={32} className="mb-2" />
                                <span className="text-xs font-bold">Click to Upload Image</span>
                                <span className="text-[10px] opacity-60 mt-1">PNG, JPG, SVG supported</span>
                            </div>
                        )}
                    </label>
                    {uploadedImage && (
                        <button onClick={() => setUploadedImage(null)} className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Trash2 size={14} /> Remove Design
                        </button>
                    )}
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">2. Adjust Placement</h3>
                    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-neutral-300">
                            <div className="p-2 bg-neutral-800 rounded-lg"><Move size={16} /></div>
                            <span>Drag to position</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-300">
                            <div className="p-2 bg-neutral-800 rounded-lg"><ZoomIn size={16} /></div>
                            <span>Scale with controls</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-300">
                            <div className="p-2 bg-neutral-800 rounded-lg"><RotateCw size={16} /></div>
                            <span>Rotate to fit</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-neutral-400 text-sm">Base Price</span>
                    <span className="text-white font-bold">${product.price}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-neutral-400 text-sm">Customization Fee</span>
                    <span className="text-white font-bold">+$15.00</span>
                </div>
                <div className="flex justify-between items-center mb-6 pt-4 border-t border-neutral-800">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-2xl font-black text-white">${product.price + 15}</span>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={!uploadedImage}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                    <ShoppingBag size={20} /> Add to Cart
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
