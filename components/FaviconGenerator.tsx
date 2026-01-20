import React, { useState, useRef } from 'react';
import { Upload, Download, X, Image as ImageIcon, Check } from 'lucide-react';

interface FaviconGeneratorProps {
  onGenerate?: (files: GeneratedFaviconFiles) => void;
}

interface GeneratedFaviconFiles {
  favicon16: string;
  favicon32: string;
  favicon192: string;
  favicon512: string;
  appleTouchIcon: string;
}

export const FaviconGenerator: React.FC<FaviconGeneratorProps> = ({ onGenerate }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFaviconFiles | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PNG, JPG, SVG, or WebP.');
      return;
    }

    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setError(null);

    // Read file and display
    const reader = new FileReader();
    reader.onload = (e) => {
      setSourceImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateFaviconSize = (img: HTMLImageElement, size: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');

    // Calculate scaling to fit and center
    const scale = Math.min(size / img.width, size / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (size - scaledWidth) / 2;
    const y = (size - scaledHeight) / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    return canvas.toDataURL('image/png');
  };

  const handleGenerate = () => {
    if (!sourceImage) return;

    setIsGenerating(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      try {
        const files: GeneratedFaviconFiles = {
          favicon16: generateFaviconSize(img, 16),
          favicon32: generateFaviconSize(img, 32),
          favicon192: generateFaviconSize(img, 192),
          favicon512: generateFaviconSize(img, 512),
          appleTouchIcon: generateFaviconSize(img, 180)
        };

        setGeneratedFavicons(files);
        onGenerate?.(files);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate favicons');
      } finally {
        setIsGenerating(false);
      }
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsGenerating(false);
    };

    img.src = sourceImage;
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    if (!generatedFavicons) return;

    downloadFile(generatedFavicons.favicon16, 'favicon-16x16.png');
    downloadFile(generatedFavicons.favicon32, 'favicon-32x32.png');
    downloadFile(generatedFavicons.favicon192, 'android-chrome-192x192.png');
    downloadFile(generatedFavicons.favicon512, 'android-chrome-512x512.png');
    downloadFile(generatedFavicons.appleTouchIcon, 'apple-touch-icon.png');

    // Also download manifest
    const manifest = {
      name: "Your Store Name",
      short_name: "Store",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ],
      theme_color: "#06b6d4",
      background_color: "#171717",
      display: "standalone"
    };

    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    downloadFile(manifestUrl, 'site.webmanifest');
    URL.revokeObjectURL(manifestUrl);
  };

  const reset = () => {
    setSourceImage(null);
    setGeneratedFavicons(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-white">Favicon Generator</h3>
      <p className="text-gray-400 text-sm mb-6">
        Upload your logo to generate favicons for all devices. Supports PNG, JPG, SVG, and WebP.
      </p>

      {/* Upload Area */}
      {!sourceImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-600 rounded-lg p-12 text-center cursor-pointer hover:border-cyan-500 transition-colors"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-white font-medium mb-2">Click to upload image</p>
          <p className="text-gray-500 text-sm">PNG, JPG, SVG or WebP (max 5MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-neutral-900 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={sourceImage} alt="Source" className="w-16 h-16 object-contain bg-white rounded" />
              <div>
                <p className="text-white font-medium">Source Image</p>
                <p className="text-gray-400 text-sm">Ready to generate</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          {!generatedFavicons && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Generate Favicons
                </>
              )}
            </button>
          )}

          {/* Generated Files */}
          {generatedFavicons && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">Favicons generated successfully!</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-neutral-900 rounded-lg p-4 text-center">
                  <img src={generatedFavicons.favicon16} alt="16x16" className="w-8 h-8 mx-auto mb-2 bg-white rounded" />
                  <p className="text-white text-xs font-medium">16x16</p>
                  <p className="text-gray-500 text-xs">Standard</p>
                </div>
                <div className="bg-neutral-900 rounded-lg p-4 text-center">
                  <img src={generatedFavicons.favicon32} alt="32x32" className="w-8 h-8 mx-auto mb-2 bg-white rounded" />
                  <p className="text-white text-xs font-medium">32x32</p>
                  <p className="text-gray-500 text-xs">Standard</p>
                </div>
                <div className="bg-neutral-900 rounded-lg p-4 text-center">
                  <img src={generatedFavicons.appleTouchIcon} alt="180x180" className="w-8 h-8 mx-auto mb-2 bg-white rounded" />
                  <p className="text-white text-xs font-medium">180x180</p>
                  <p className="text-gray-500 text-xs">Apple</p>
                </div>
                <div className="bg-neutral-900 rounded-lg p-4 text-center">
                  <img src={generatedFavicons.favicon192} alt="192x192" className="w-8 h-8 mx-auto mb-2 bg-white rounded" />
                  <p className="text-white text-xs font-medium">192x192</p>
                  <p className="text-gray-500 text-xs">Android</p>
                </div>
                <div className="bg-neutral-900 rounded-lg p-4 text-center">
                  <img src={generatedFavicons.favicon512} alt="512x512" className="w-8 h-8 mx-auto mb-2 bg-white rounded" />
                  <p className="text-white text-xs font-medium">512x512</p>
                  <p className="text-gray-500 text-xs">Android</p>
                </div>
              </div>

              <button
                onClick={downloadAll}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All Files
              </button>

              <button
                onClick={reset}
                className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Generate New
              </button>

              {/* HTML Code */}
              <div className="bg-neutral-900 rounded-lg p-4">
                <p className="text-white font-medium mb-2 text-sm">Add to your HTML &lt;head&gt;:</p>
                <pre className="text-xs text-gray-400 overflow-x-auto">
{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
