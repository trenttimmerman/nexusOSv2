
import React from 'react';
import { Instagram, Twitter, Facebook, Youtube, ArrowRight, Heart, MessageCircle, Share2, Play, ExternalLink, Hash, AtSign } from 'lucide-react';
import { EditableText, EditableImage } from './HeroLibrary';

interface SocialProps {
  storeName: string;
  primaryColor: string;
  data?: {
    heading?: string;
    subheading?: string;
    username?: string;
    posts?: Array<{
      id: string;
      image: string;
      likes: string;
      comments: string;
      caption?: string;
    }>;
    [key: string]: any;
  };
  isEditable?: boolean;
  onUpdate?: (data: any) => void;
}

const DEFAULT_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', likes: '1.2k', comments: '45', caption: 'Summer vibes ☀️' },
  { id: '2', image: 'https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=800&q=80', likes: '856', comments: '23', caption: 'New collection drop' },
  { id: '3', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', likes: '2.1k', comments: '112', caption: 'Behind the scenes' },
  { id: '4', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', likes: '3.4k', comments: '201', caption: 'Limited edition' },
  { id: '5', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', likes: '945', comments: '34', caption: 'Style guide' },
  { id: '6', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80', likes: '1.5k', comments: '67', caption: 'Mood board' },
];

export const SOCIAL_OPTIONS = [
  { id: 'grid-classic', name: 'Classic Grid', description: 'Standard 3-column Instagram style layout' },
  { id: 'masonry-wall', name: 'Masonry Wall', description: 'Dynamic staggered grid layout' },
  { id: 'carousel-reel', name: 'Carousel Reel', description: 'Horizontal scrolling feed' },
  { id: 'polaroid-scatter', name: 'Polaroid Scatter', description: 'Playful scattered photo look' },
  { id: 'minimal-feed', name: 'Minimal Feed', description: 'Clean, whitespace-heavy layout' },
  { id: 'dark-mode-glitch', name: 'Cyber Glitch', description: 'Edgy dark mode with glitch effects' },
  { id: 'story-circles', name: 'Story Highlights', description: 'Circular story-style preview' },
  { id: 'featured-hero', name: 'Featured Hero', description: 'One large feature with smaller thumbnails' },
  { id: 'ticker-tape', name: 'Ticker Tape', description: 'Continuous scrolling marquee' },
  { id: 'glass-cards', name: 'Glass Cards', description: 'Modern frosted glass overlay style' }
];

export const SOCIAL_COMPONENTS: Record<string, React.FC<SocialProps>> = {
  'grid-classic': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-4 max-w-7xl mx-auto" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Follow Us @Evolv'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-2"
          style={{ color: data?.headingColor || '#000000' }}
        />
        <EditableText
          value={data?.subheading || 'Join our community for daily inspiration'}
          onChange={(val) => onUpdate?.({ ...data, subheading: val })}
          isEditable={isEditable}
          className="text-sm"
          style={{ color: data?.subheadingColor || '#6b7280' }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(data?.posts || DEFAULT_POSTS).slice(0, 6).map((post, i) => (
          <div key={i} className="group relative aspect-square bg-neutral-100 overflow-hidden">
            <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
              <div className="flex items-center gap-2"><Heart size={20} fill="white" /> <span className="font-bold">{post.likes}</span></div>
              <div className="flex items-center gap-2"><MessageCircle size={20} fill="white" /> <span className="font-bold">{post.comments}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'masonry-wall': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-4" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
      <div className="flex justify-between items-end max-w-7xl mx-auto mb-12">
        <div>
          <EditableText
            value={data?.heading || 'The Wall'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-6xl font-black tracking-tighter uppercase"
            style={{ color: data?.headingColor || '#000000' }}
          />
        </div>
        <button className="flex items-center gap-2 font-bold border-b-2 pb-1" style={{ borderColor: data?.buttonColor || '#000000', color: data?.buttonColor || '#000000' }}>Follow <ArrowRight size={16} /></button>
      </div>
      <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-[1600px] mx-auto">
        {(data?.posts || DEFAULT_POSTS).map((post, i) => (
          <div key={i} className="break-inside-avoid relative group">
            <img src={post.image} className={`w-full object-cover ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium truncate">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'carousel-reel': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 overflow-hidden" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
      <div className="px-8 mb-8 flex items-center gap-4" style={{ color: data?.cardBackgroundColor || '#000000' }}>
        <Instagram size={24} />
        <EditableText
          value={data?.username || '@evolv_official'}
          onChange={(val) => onUpdate?.({ ...data, username: val })}
          isEditable={isEditable}
          className="font-bold text-lg"
        />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-8 px-8 snap-x scrollbar-hide">
        {(data?.posts || DEFAULT_POSTS).map((post, i) => (
          <div key={i} className="snap-center shrink-0 w-72 aspect-[9/16] relative rounded-2xl overflow-hidden group">
            <img src={post.image} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Play size={14} fill="white" className="text-white ml-0.5" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm font-medium">{post.likes} likes</span>
                <Share2 size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'polaroid-scatter': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 overflow-hidden" style={{ backgroundColor: data?.backgroundColor || '#f5f5f5' }}>
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <EditableText
          value={data?.heading || 'Captured Moments'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="font-handwriting text-5xl rotate-[-2deg]"
          style={{ fontFamily: 'cursive', color: data?.headingColor || '#262626' }}
        />
      </div>
      <div className="relative h-[600px] max-w-6xl mx-auto">
        {(data?.posts || DEFAULT_POSTS).slice(0, 5).map((post, i) => {
          const rotation = ['rotate-[-6deg]', 'rotate-[3deg]', 'rotate-[-3deg]', 'rotate-[6deg]', 'rotate-[-2deg]'][i];
          const position = [
            'left-10 top-10',
            'right-20 top-20',
            'left-1/3 top-1/3',
            'left-20 bottom-20',
            'right-1/4 bottom-10'
          ][i];
          return (
            <div key={i} className={`absolute ${position} ${rotation} w-64 p-3 pb-12 shadow-xl hover:scale-110 hover:z-50 transition-all duration-300 cursor-pointer`} style={{ backgroundColor: data?.polaroidBackground || '#ffffff' }}>
              <div className="aspect-square bg-neutral-100 overflow-hidden mb-2">
                <img src={post.image} className="w-full h-full object-cover" />
              </div>
              <div className="font-handwriting text-center text-sm" style={{ fontFamily: 'cursive', color: data?.captionTextColor || '#525252' }}>
                {post.caption}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),

  'minimal-feed': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 max-w-5xl mx-auto px-8" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
      <div className="flex justify-between items-center mb-16 border-b pb-8" style={{ borderColor: data?.buttonColor ? data.buttonColor + '33' : '#e5e5e5' }}>
        <EditableText
          value={data?.heading || 'Journal'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: data?.headingColor || '#000000' }}
        />
        <a href="#" className="text-xs transition-colors" style={{ color: data?.buttonColor ? data.buttonColor + '99' : '#6b7280' }}>VIEW ALL POSTS</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {(data?.posts || DEFAULT_POSTS).slice(0, 3).map((post, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-neutral-50 mb-6 overflow-hidden">
              <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="flex justify-between items-center text-xs" style={{ color: data?.buttonColor ? data.buttonColor + '99' : '#6b7280' }}>
              <span>OCT {12 + i}, 2024</span>
              <span>{post.likes} LIKES</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'dark-mode-glitch': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 text-white overflow-hidden relative" style={{ backgroundColor: data?.backgroundColor || '#000000' }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23333333\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-3 h-3 animate-pulse rounded-full" style={{ backgroundColor: data?.accentColor || '#22c55e' }}></div>
          <EditableText
            value={data?.heading || 'SYSTEM_FEED'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="font-mono text-2xl tracking-widest"
            style={{ color: data?.accentColor || '#22c55e' }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {(data?.posts || DEFAULT_POSTS).slice(0, 8).map((post, i) => (
            <div key={i} className="relative group aspect-square overflow-hidden border" style={{ borderColor: data?.borderColor || '#262626' }}>
              <img src={post.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-100" />
              <div className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: (data?.accentColor || '#22c55e') + '33' }}></div>
              <div className="absolute bottom-2 left-2 font-mono text-[10px] opacity-0 group-hover:opacity-100" style={{ color: data?.accentColor || '#22c55e' }}>
                IMG_{1000 + i}.JPG
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  'story-circles': ({ data, isEditable, onUpdate }) => (
    <div className="py-12 border-y" style={{ backgroundColor: data?.backgroundColor || '#ffffff', borderColor: data?.labelTextColor ? data.labelTextColor + '33' : '#f5f5f5' }}>
      <div className="max-w-7xl mx-auto px-4 flex gap-8 overflow-x-auto scrollbar-hide items-center justify-center">
        {(data?.posts || DEFAULT_POSTS).map((post, i) => (
          <div key={i} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr group-hover:scale-105 transition-transform" style={{ backgroundImage: `linear-gradient(to top right, ${data?.gradientStart || '#fbbf24'}, ${data?.gradientMiddle || '#ef4444'}, ${data?.gradientEnd || '#a855f7'})` }}>
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color: data?.labelTextColor || '#525252' }}>Highlight {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  'featured-hero': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 max-w-7xl mx-auto px-4" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        <div className="lg:col-span-2 h-full relative group overflow-hidden rounded-2xl">
          <img src={(data?.posts || DEFAULT_POSTS)[0].image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8" style={{ color: data?.textColor || '#ffffff' }}>
            <div className="flex items-center gap-2 mb-2 text-sm font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data?.textColor || '#ffffff' }}></span> Featured Post
            </div>
            <h3 className="text-3xl font-bold mb-4" style={{ color: data?.headingColor || '#ffffff' }}>{(data?.posts || DEFAULT_POSTS)[0].caption}</h3>
            <div className="flex gap-6 text-sm">
              <span>{(data?.posts || DEFAULT_POSTS)[0].likes} Likes</span>
              <span>{(data?.posts || DEFAULT_POSTS)[0].comments} Comments</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-full content-start">
          {(data?.posts || DEFAULT_POSTS).slice(1, 5).map((post, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
              <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  'ticker-tape': ({ data, isEditable, onUpdate }) => (
    <div className="py-16 overflow-hidden" style={{ backgroundColor: data?.backgroundColor || '#171717' }}>
      <div className="mb-8 text-center">
        <EditableText
          value={data?.heading || '#EVOLV_STYLE'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="font-bold text-xl tracking-[0.5em]"
          style={{ color: data?.headingColor || '#ffffff' }}
        />
      </div>
      <div className="flex gap-4 animate-scroll whitespace-nowrap">
        {[...(data?.posts || DEFAULT_POSTS), ...(data?.posts || DEFAULT_POSTS)].map((post, i) => (
          <div key={i} className="w-64 aspect-[4/5] shrink-0 relative grayscale hover:grayscale-0 transition-all duration-500">
            <img src={post.image} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 font-bold text-lg drop-shadow-lg" style={{ color: data?.headingColor || '#ffffff' }}>
              @{data?.username || 'evolv'}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'glass-cards': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80')] bg-cover bg-center bg-fixed relative" style={{ backgroundColor: data?.backgroundColor || 'transparent' }}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: (data?.backgroundColor || '#000000') + '33' }}></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data?.posts || DEFAULT_POSTS).slice(0, 3).map((post, i) => (
            <div key={i} className="backdrop-blur-md border p-4 rounded-2xl hover:-translate-y-2 transition-transform duration-300" style={{ backgroundColor: (data?.cardBackgroundColor || '#ffffff') + '1a', borderColor: (data?.textColor || '#ffffff') + '33', color: data?.textColor || '#ffffff' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div>
                  <div className="font-bold text-sm">@evolv_official</div>
                  <div className="text-xs opacity-70">2 hours ago</div>
                </div>
                <ExternalLink size={16} className="ml-auto opacity-70" />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden mb-4">
                <img src={post.image} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm opacity-90 mb-4 line-clamp-2">{post.caption}</p>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center gap-1"><Heart size={16} /> {post.likes}</span>
                <span className="flex items-center gap-1"><MessageCircle size={16} /> {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};
