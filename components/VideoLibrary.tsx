
import React, { useState } from 'react';
import { EditableText } from './HeroLibrary';
import { Play, Pause, Volume2, VolumeX, Sparkles, Loader2, X, Maximize2, ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';

export const VIDEO_OPTIONS = [
  { id: 'vid-full', name: 'Full Width', description: 'Cinematic full width video' },
  { id: 'vid-window', name: 'Windowed', description: 'Contained video player' },
  { id: 'vid-bg', name: 'Background', description: 'Silent looping background' },
  { id: 'vid-split', name: 'Split Screen', description: 'Video alongside text content' },
  { id: 'vid-popup', name: 'Popup Modal', description: 'Thumbnail that opens modal' },
  { id: 'vid-slider', name: 'Video Carousel', description: 'Slider of video clips' },
  { id: 'vid-grid', name: 'Video Grid', description: 'Grid of short video clips' },
  { id: 'vid-hero', name: 'Video Hero', description: 'Hero section with video background' },
  { id: 'vid-interactive', name: 'Shoppable Video', description: 'Video with product hotspots' },
  { id: 'vid-story', name: 'Vertical Stories', description: 'Mobile-style vertical videos' },
];

const DEFAULT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-398-large.mp4';
const MOCK_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-398-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32840-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-drinking-coffee-in-the-city-397-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4'
];

export const VIDEO_COMPONENTS: Record<string, React.FC<any>> = {
  'vid-full': ({ data, isEditable, onUpdate }) => (
    <div className="relative w-full aspect-video md:h-[80vh] bg-black overflow-hidden group">
      <video 
        src={data?.videoUrl || DEFAULT_VIDEO} 
        className="w-full h-full object-cover"
        controls={!isEditable}
        autoPlay={false}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={32} fill="white" className="text-white ml-1" />
        </div>
      </div>
      {isEditable && (
        <div className="absolute top-4 right-4 bg-black/80 p-4 rounded-lg backdrop-blur z-20">
          <h4 className="text-white text-xs font-bold mb-2 flex items-center gap-2"><Sparkles size={12} className="text-blue-400" /> AI Video Gen</h4>
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2">
            Generate Video
          </button>
        </div>
      )}
    </div>
  ),

  'vid-window': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Watch the Film'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-4"
        />
      </div>
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
        <video 
          src={data?.videoUrl || DEFAULT_VIDEO} 
          className="w-full h-full object-cover"
          controls={!isEditable}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={24} fill="black" className="text-black ml-1" />
          </div>
        </div>
      </div>
    </div>
  ),

  'vid-bg': ({ data, isEditable, onUpdate }) => (
    <div className="relative h-[600px] overflow-hidden flex items-center justify-center text-center text-white">
      <video 
        src={data?.videoUrl || DEFAULT_VIDEO} 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-2xl px-6">
        <EditableText
          value={data?.heading || 'Motion & Emotion'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
        />
        <EditableText
          value={data?.subheading || 'Experience the new collection in motion.'}
          onChange={(val) => onUpdate?.({ ...data, subheading: val })}
          isEditable={isEditable}
          className="text-xl opacity-90"
        />
      </div>
    </div>
  ),

  'vid-split': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="aspect-square bg-black rounded-2xl overflow-hidden relative group">
            <video 
              src={data?.videoUrl || DEFAULT_VIDEO} 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            />
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur p-2 rounded-full">
              <VolumeX size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <EditableText
            value={data?.heading || 'Behind the Scenes'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl font-bold mb-6"
          />
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Take a look at how we craft our products with care and precision. From the initial sketch to the final stitch, every step is a journey of passion.
          </p>
          <button className="px-8 py-3 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-colors">
            View Full Documentary
          </button>
        </div>
      </div>
    </div>
  ),

  'vid-popup': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 px-6 max-w-7xl mx-auto text-center">
      <div className="relative max-w-4xl mx-auto aspect-video bg-gray-900 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=1200&q=80" 
          alt="Video Thumbnail" 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
            <Play size={32} fill="black" className="text-black ml-2" />
          </div>
          <EditableText
            value={data?.heading || 'Play Showreel'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight"
          />
        </div>
      </div>
    </div>
  ),

  'vid-slider': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 bg-black text-white overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <EditableText
          value={data?.heading || 'Featured Clips'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><ChevronLeft size={20} /></button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="flex gap-6 px-6 max-w-7xl mx-auto overflow-x-auto pb-8 scrollbar-hide">
        {MOCK_VIDEOS.map((vid, i) => (
          <div key={i} className="min-w-[300px] aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer border border-white/10">
            <video src={vid} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" muted loop />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={40} className="text-white opacity-80 group-hover:opacity-0 transition-opacity" />
            </div>
            <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-bold text-sm">Clip Title {i + 1}</h4>
              <p className="text-xs text-gray-400">0:15</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'vid-grid': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <EditableText
          value={data?.heading || 'Community Highlights'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-4"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_VIDEOS.concat(MOCK_VIDEOS).map((vid, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer">
            <video 
              src={vid} 
              className="w-full h-full object-cover" 
              muted 
              loop 
              onMouseOver={e => e.currentTarget.play()} 
              onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            />
            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
              <Maximize2 size={14} className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'vid-hero': ({ data, isEditable, onUpdate }) => (
    <div className="relative h-screen w-full overflow-hidden">
      <video 
        src={data?.videoUrl || DEFAULT_VIDEO} 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <EditableText
          value={data?.heading || 'UNLEASH YOUR POTENTIAL'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-8"
        />
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
            Shop Collection
          </button>
          <button className="px-8 py-4 border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
            <Play size={16} fill="white" /> Watch Film
          </button>
        </div>
      </div>
    </div>
  ),

  'vid-interactive': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video 
          src={data?.videoUrl || DEFAULT_VIDEO} 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
        {/* Mock Hotspots */}
        <div className="absolute top-1/3 left-1/4 group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer animate-pulse hover:animate-none">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <div className="absolute left-10 top-0 bg-white p-3 rounded-lg shadow-xl w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded shrink-0" />
              <div>
                <div className="font-bold text-sm">Neon Jacket</div>
                <div className="text-xs text-gray-500">$129.00</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-1/3 right-1/3 group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer animate-pulse hover:animate-none">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <div className="absolute right-10 top-0 bg-white p-3 rounded-lg shadow-xl w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded shrink-0" />
              <div>
                <div className="font-bold text-sm">Urban Pants</div>
                <div className="text-xs text-gray-500">$89.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  'vid-story': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Stories'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
      </div>
      <div className="flex justify-center gap-6 flex-wrap">
        {MOCK_VIDEOS.slice(0, 3).map((vid, i) => (
          <div key={i} className="w-[280px] aspect-[9/16] bg-black rounded-2xl overflow-hidden relative group cursor-pointer shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <video src={vid} className="w-full h-full object-cover" muted loop autoPlay />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full border border-white/50" />
              <div className="text-white text-xs font-bold pt-1">@nexus_style</div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="font-bold text-lg mb-2">Summer Vibes ☀️</p>
              <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-full">View Collection</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
