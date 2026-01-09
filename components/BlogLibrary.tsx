
import React from 'react';
import { EditableText } from './HeroLibrary';
import { ArrowRight, Calendar, User, Clock, ChevronRight, ChevronLeft, Tag, Share2, MessageCircle } from 'lucide-react';

export const BLOG_OPTIONS = [
  { id: 'blog-grid', name: 'Standard Grid', description: 'Clean grid of blog posts' },
  { id: 'blog-list', name: 'Classic List', description: 'Vertical list with side images' },
  { id: 'blog-featured', name: 'Featured Highlight', description: 'Large featured post with smaller grid' },
  { id: 'blog-minimal', name: 'Minimal Text', description: 'Typography focused layout' },
  { id: 'blog-magazine', name: 'Magazine', description: 'Dense, information-rich layout' },
  { id: 'blog-slider', name: 'Post Slider', description: 'Horizontal carousel of posts' },
  { id: 'blog-cards', name: 'Elevated Cards', description: 'Cards with shadows and hover effects' },
  { id: 'blog-sidebar', name: 'With Sidebar', description: 'Main content with sidebar widgets' },
  { id: 'blog-alternating', name: 'Zig-Zag', description: 'Alternating image and text layout' },
  { id: 'blog-overlay', name: 'Image Overlay', description: 'Text overlaid on post images' },
];

const MOCK_POSTS = [
  { id: 1, title: 'The Future of Digital Commerce', excerpt: 'Exploring the trends shaping the next decade of online retail.', date: 'Oct 12, 2023', author: 'Alex Morgan', category: 'Trends', image: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80', link: '' },
  { id: 2, title: 'Sustainable Fashion Choices', excerpt: 'How to build a wardrobe that lasts and helps the planet.', date: 'Oct 08, 2023', author: 'Sarah Chen', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', link: '' },
  { id: 3, title: 'Behind the Design Process', excerpt: 'A look into how we create our signature collections.', date: 'Oct 01, 2023', author: 'Mike Ross', category: 'Design', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', link: '' },
  { id: 4, title: 'Summer Essentials Guide', excerpt: 'Everything you need for the perfect summer getaway.', date: 'Sep 28, 2023', author: 'Emma Wilson', category: 'Guides', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', link: '' },
];

export const BLOG_COMPONENTS: Record<string, React.FC<any>> = {
  'blog-grid': ({ data, isEditable, onUpdate }) => {
    const posts = data?.posts || MOCK_POSTS;
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
        <div className="text-center mb-16">
          <EditableText
            value={data?.heading || 'Latest Stories'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl font-bold mb-4"
            style={{ color: data?.headingColor || '#000000' }}
          />
          <p className="max-w-2xl mx-auto" style={{ color: data?.subheadingColor || '#6b7280' }}>{data?.subheading || 'Insights, thoughts, and trends from our team.'}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {posts.slice(0, 3).map((post: any) => (
            <a key={post.id} href={post.link || '#'} className="group cursor-pointer block">
              <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden mb-6">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex items-center gap-4 text-sm mb-3">
                <span className="font-medium" style={{ color: data?.accentColor || '#2563eb' }}>{post.category}</span>
                <span style={{ color: data?.metaColor || '#9ca3af' }}>{post.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors" style={{ color: data?.titleColor || '#000000' }}>{post.title}</h3>
              <p className="line-clamp-2" style={{ color: data?.excerptColor || '#6b7280' }}>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    );
  },

  'blog-list': ({ data, isEditable, onUpdate }) => {
    const posts = data?.posts || MOCK_POSTS;
    return (
      <div className="py-20 px-6 max-w-5xl mx-auto" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
        <div className="mb-16 pb-8" style={{ borderBottom: `1px solid ${data?.metaColor || '#e5e5e5'}` }}>
          <EditableText
            value={data?.heading || 'The Journal'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl font-serif font-bold"
            style={{ color: data?.headingColor || '#000000' }}
          />
        </div>
        <div className="space-y-12">
          {posts.map((post: any) => (
            <a key={post.id} href={post.link || '#'} className="flex flex-col md:flex-row gap-8 items-start group cursor-pointer">
              <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex-1 py-2">
                <div className="flex items-center gap-3 text-sm mb-3">
                  <span className="uppercase tracking-wider text-xs font-bold" style={{ color: data?.accentColor || '#000000' }}>{post.category}</span>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: data?.metaColor || '#d1d5db' }}></span>
                  <span style={{ color: data?.metaColor || '#6b7280' }}>{post.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:underline decoration-2 underline-offset-4" style={{ color: data?.titleColor || '#000000' }}>{post.title}</h3>
                <p className="mb-4 leading-relaxed" style={{ color: data?.excerptColor || '#6b7280' }}>{post.excerpt}</p>
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: data?.titleColor || '#000000' }}>
                  Read Story <ArrowRight size={16} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  },

  'blog-featured': ({ data, isEditable, onUpdate }) => {
    const posts = data?.posts || MOCK_POSTS;
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <a href={posts[0]?.link || '#'} className="group cursor-pointer block">
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-6">
              <img src={posts[0]?.image} alt={posts[0]?.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-4 text-sm mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: data?.overlayColor || '#000000', color: '#ffffff' }}>Featured</span>
              <span style={{ color: data?.metaColor || '#6b7280' }}>{posts[0]?.date}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: data?.titleColor || '#000000' }}>{posts[0]?.title}</h3>
            <p className="text-lg mb-6" style={{ color: data?.excerptColor || '#6b7280' }}>{posts[0]?.excerpt}</p>
            <button className="px-6 py-3 rounded-full font-bold transition-colors" style={{ backgroundColor: data?.accentColor || '#000000', color: '#ffffff' }}>Read Article</button>
          </a>
          <div className="space-y-8">
            {posts.slice(1).map((post: any) => (
              <a key={post.id} href={post.link || '#'} className="flex gap-6 group cursor-pointer">
                <div className="w-32 aspect-square bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: data?.accentColor || '#2563eb' }}>{post.category}</div>
                  <h4 className="text-xl font-bold mb-2 transition-colors" style={{ color: data?.titleColor || '#000000' }}>{post.title}</h4>
                  <div className="text-sm" style={{ color: data?.metaColor || '#6b7280' }}>{post.date}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  },

  'blog-minimal': ({ data, isEditable, onUpdate }) => {
    const posts = data?.posts || MOCK_POSTS;
    return (
      <div className="py-24 px-6 max-w-3xl mx-auto" style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}>
        <div className="text-center mb-20">
          <EditableText
            value={data?.heading || 'Words & Thoughts'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-5xl font-serif italic mb-4"
            style={{ color: data?.headingColor || '#000000' }}
          />
        </div>
        <div className="space-y-16">
          {posts.map((post: any) => (
            <a key={post.id} href={post.link || '#'} className="group cursor-pointer block pb-16 last:border-0" style={{ borderBottom: `1px solid ${data?.metaColor || '#e5e5e5'}` }}>
              <div className="text-sm mb-4 flex items-center justify-between" style={{ color: data?.metaColor || '#9ca3af' }}>
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 group-hover:opacity-70 transition-opacity" style={{ color: data?.titleColor || '#000000' }}>{post.title}</h3>
              <p className="text-xl font-serif leading-relaxed mb-6" style={{ color: data?.excerptColor || '#6b7280' }}>{post.excerpt}</p>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest" style={{ color: data?.titleColor || '#000000' }}>
                Read More <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  },

  'blog-magazine': ({ data, isEditable, onUpdate }) => (
    <div className="py-16 px-6 max-w-7xl mx-auto bg-white">
      <div className="border-y-4 border-black py-4 mb-12 flex justify-between items-center">
        <EditableText
          value={data?.heading || 'THE DAILY EDIT'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl md:text-6xl font-black tracking-tighter"
        />
        <div className="hidden md:block text-right font-mono text-sm">
          <div>VOL. 24</div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="relative aspect-[16/9] bg-gray-100 mb-6 group cursor-pointer">
            <img src={MOCK_POSTS[0].image} alt={MOCK_POSTS[0].title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 bg-black text-white p-6 max-w-lg">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 text-yellow-400">{MOCK_POSTS[0].category}</div>
              <h3 className="text-3xl font-bold leading-tight">{MOCK_POSTS[0].title}</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {MOCK_POSTS.slice(1, 3).map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="aspect-[3/2] bg-gray-100 mb-4 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h4 className="text-xl font-bold mb-2 leading-tight">{post.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-8 border-l pl-8">
          <div className="font-bold text-xl border-b pb-2 mb-4">Trending Now</div>
          {MOCK_POSTS.map((post, i) => (
            <div key={post.id} className="flex gap-4 group cursor-pointer">
              <div className="text-4xl font-black text-gray-200 group-hover:text-black transition-colors">0{i + 1}</div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">{post.category}</div>
                <h4 className="font-bold leading-snug group-hover:underline">{post.title}</h4>
              </div>
            </div>
          ))}
          <div className="bg-gray-100 p-6 text-center mt-8">
            <h4 className="font-bold mb-2">Subscribe to our Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">Get the latest updates directly to your inbox.</p>
            <input type="email" placeholder="Email address" className="w-full p-2 border mb-2 text-sm" />
            <button className="w-full bg-black text-white py-2 text-sm font-bold uppercase">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  ),

  'blog-slider': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 bg-gray-50 overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <EditableText
          value={data?.heading || 'Trending Posts'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ChevronLeft size={20} /></button>
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="flex gap-6 px-6 max-w-7xl mx-auto overflow-x-auto pb-8 scrollbar-hide snap-x">
        {MOCK_POSTS.concat(MOCK_POSTS).map((post, i) => (
          <div key={i} className="min-w-[300px] md:min-w-[400px] snap-start group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-3 uppercase tracking-wider">
                {post.category}
              </div>
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2"><User size={14} /> {post.author}</div>
                <div className="flex items-center gap-2"><Clock size={14} /> 5 min read</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'blog-cards': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Blog</span>
        <EditableText
          value={data?.heading || 'Latest Updates'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl font-bold mt-2 mb-4"
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_POSTS.slice(0, 3).map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
            <div className="aspect-video bg-gray-100 relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {post.category}
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Calendar size={14} /> {post.date}
              </div>
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <p className="text-gray-600 mb-6">{post.excerpt}</p>
              <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Read More <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'blog-sidebar': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {MOCK_POSTS.slice(0, 3).map((post) => (
            <div key={post.id} className="flex flex-col md:flex-row gap-8 group cursor-pointer">
              <div className="w-full md:w-64 aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm text-blue-600 font-bold mb-2">{post.category}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-10">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h4 className="font-bold text-lg mb-4">Categories</h4>
            <div className="space-y-2">
              {['Design', 'Technology', 'Culture', 'Business', 'Lifestyle'].map(cat => (
                <div key={cat} className="flex justify-between items-center py-2 border-b last:border-0 cursor-pointer hover:text-blue-600">
                  <span>{cat}</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-500 border">12</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-600 text-white p-8 rounded-2xl text-center">
            <h4 className="font-bold text-xl mb-2">Weekly Newsletter</h4>
            <p className="text-blue-100 mb-6 text-sm">No spam, just the best content.</p>
            <input type="email" placeholder="Your email" className="w-full p-3 rounded-lg text-black mb-3" />
            <button className="w-full bg-black py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  ),

  'blog-alternating': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-24">
      {MOCK_POSTS.slice(0, 3).map((post, i) => (
        <div key={post.id} className={`flex flex-col md:flex-row gap-16 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative group cursor-pointer">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold tracking-widest text-gray-500 mb-4 uppercase">{post.category}</div>
            <h3 className="text-4xl font-bold mb-6 leading-tight">{post.title}</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt={post.author} />
                </div>
                <div className="text-sm">
                  <div className="font-bold">{post.author}</div>
                  <div className="text-gray-500">{post.date}</div>
                </div>
              </div>
              <button className="ml-auto w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),

  'blog-overlay': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <EditableText
          value={data?.heading || 'Visual Stories'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl font-bold"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="group cursor-pointer relative aspect-[4/3] rounded-2xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex items-center gap-3 text-white/80 text-sm mb-3">
                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{post.title}</h3>
              <p className="text-white/70 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
