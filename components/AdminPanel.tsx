import React, { useState, useEffect } from 'react';
import { ProductEditor } from './ProductEditor';
import { StoreConfig, AdminTab, HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId, ScrollbarStyleId, Product, Page, AdminPanelProps, PageBlock } from '../types';
import { HEADER_OPTIONS, HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_OPTIONS, HERO_COMPONENTS, HERO_FIELDS } from './HeroLibrary';
import { PRODUCT_CARD_OPTIONS, PRODUCT_CARD_COMPONENTS } from './ProductCardLibrary';
import { FOOTER_OPTIONS } from './FooterLibrary';
import { SCROLL_OPTIONS } from './ScrollLibrary';
import { Storefront } from './Storefront';
import { MediaLibrary } from './MediaLibrary';
import { CampaignManager } from './CampaignManager';

const SCROLLBAR_OPTIONS = [
  { id: 'native', name: 'Native', description: 'Default browser scrollbar' },
  { id: 'minimal', name: 'Minimal', description: 'Thin, subtle gray track' },
  { id: 'hidden', name: 'Invisible', description: 'Scrollable but hidden' },
  { id: 'nexus', name: 'Nexus Dark', description: 'Brand-aligned dark theme' },
  { id: 'glow', name: 'Neon Glow', description: 'Cyberpunk accent glow' },
  { id: 'gradient-sunset', name: 'Sunset Drive', description: 'Warm gradient fade' },
  { id: 'gradient-ocean', name: 'Ocean Depths', description: 'Deep blue gradient' },
  { id: 'glass', name: 'Frosted Glass', description: 'Translucent modern look' },
  { id: 'brutalist', name: 'Brutalist', description: 'Stark, blocky contrast' },
  { id: 'neon-pink', name: 'Hot Pink', description: 'Vibrant energetic pop' },
  { id: 'cyber-blue', name: 'Cyber Blue', description: 'Electric future tech' },
  { id: 'luxury', name: 'Luxury Gold', description: 'Premium metallic finish' },
  { id: 'retro', name: 'Retro Terminal', description: 'Old school green phosphor' },
  { id: 'soft', name: 'Soft Pill', description: 'Rounded, floating comfort' },
  { id: 'outline', name: 'Outline', description: 'Minimalist border only' },
  { id: 'glass-crystal', name: 'Crystal Clear', description: 'Ultra-sharp transparent glass' },
  { id: 'glass-blur', name: 'Deep Blur', description: 'Heavy frosted backdrop' },
  { id: 'glass-obsidian', name: 'Obsidian Glass', description: 'Dark smoked transparency' },
  { id: 'glass-milk', name: 'Milky Glass', description: 'Soft white translucent' },
  { id: 'glass-holographic', name: 'Holographic', description: 'Subtle prism color shift' },
  { id: 'glass-borderless', name: 'Floating Shard', description: 'Borderless floating glass' },
  { id: 'glass-fiber', name: 'Fiber Glass', description: 'Textured industrial glass' },
  { id: 'glass-acrylic', name: 'Acrylic Block', description: 'Thick plastic-like finish' },
  { id: 'glass-mirror', name: 'Liquid Mirror', description: 'High gloss reflective feel' },
  { id: 'glass-glacier', name: 'Glacier Ice', description: 'Cool blue frozen tint' },
];
import {
  LayoutDashboard,
  Package,
  Palette,
  Megaphone,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  ShoppingBag,
  Plus,
  Loader2,
  Sparkles,
  CheckCircle2,
  Mail,
  Send,
  MoreHorizontal,
  Eye,
  X,
  LayoutTemplate,
  ChevronDown,
  ArrowDownAZ,
  Calendar,
  Flame,
  Smartphone,
  Monitor,
  Type,
  Image as ImageIcon,
  Upload,
  Link,
  Grid,
  FileText,
  Home,
  Trash2,
  Columns,
  Quote,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Wand2,
  Layers,
  MoveUp,
  MoveDown,
  Edit3,
  Maximize2,
  Sliders,
  Aperture,
  Film,
  RefreshCw,
  BoxSelect,
  PanelBottom,
  PanelTop,
  MousePointerClick,
  Check,
  Pencil,
  AlertTriangle,
  Repeat,
  FolderOpen
} from 'lucide-react';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  activeTab,
  onTabChange,
  config,
  onConfigChange,
  products,
  onAddProduct,
  pages,
  activePageId,
  onAddPage,
  onUpdatePage,
  onSetActivePage,
  onDeletePage,
  mediaAssets,
  onAddAsset,
  onDeleteAsset,
  campaigns,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onLogout
}) => {

  // Product Editor State
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductEditorOpen(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductEditorOpen(true);
  };


  // Campaign State
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  // Design Studio State
  const [designSections, setDesignSections] = useState({
    pages: true,
    pageSections: true,
    intelligence: false
  });

  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPageProperties, setShowPageProperties] = useState(false);

  // MODAL STATES
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [systemModalType, setSystemModalType] = useState<'hero' | 'grid' | 'footer' | null>(null);
  const [isInterfaceModalOpen, setIsInterfaceModalOpen] = useState(false);

  // ADD SECTION STATES
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [addSectionStep, setAddSectionStep] = useState<'categories' | 'options'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<'hero' | 'grid' | 'content' | 'scroll' | null>(null);
  const [previewBlock, setPreviewBlock] = useState<PageBlock | null>(null);

  // BLOCK ARCHITECT STATE (Visual Editor for Content)
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);
  const [architectConfig, setArchitectConfig] = useState({
    layout: 'hero', // hero, split, card, cover
    heading: 'New Section',
    body: 'Write something amazing here. The layout will adapt automatically.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    bgMode: 'clean', // clean, dark, gradient, noise
    alignment: 'center', // left, center, right
    glass: false,
    height: 'medium', // small, medium, large, full
    animation: 'none', // none, fade, zoom, slide
    padding: 'medium'
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Logo Upload State
  const [logoMode, setLogoMode] = useState<'text' | 'image'>(config.logoUrl ? 'image' : 'text');

  // Live Preview State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Sorting State (Local to modals now)
  const [modalSort, setModalSort] = useState<'az' | 'new' | 'hot'>('az');

  // Editor Resize State
  const [editorWidth, setEditorWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Resize relative to the left sidebar (256px / 16rem)
      const newWidth = Math.max(260, Math.min(800, e.clientX - 256));
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Current Active Page Data
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const activeBlock = activePage.blocks?.find(b => b.id === selectedBlockId);

  // --- ARCHITECT GENERATOR ---
  const constructBlockHTML = (cfg: typeof architectConfig) => {
    // ... existing code ...
    const heightClasses: any = { small: 'py-12', medium: 'py-24', large: 'min-h-[600px]', full: 'min-h-screen' };
    const alignClasses: any = { left: 'text-left items-start', center: 'text-center items-center', right: 'text-right items-end' };

    let bgClass = 'bg-white text-neutral-900';
    if (cfg.bgMode === 'dark') bgClass = 'bg-neutral-950 text-white';
    if (cfg.bgMode === 'gradient') bgClass = 'bg-gradient-to-br from-blue-900 via-neutral-900 to-black text-white';
    if (cfg.bgMode === 'noise') bgClass = 'bg-neutral-100 text-neutral-900 bg-[url("https://grainy-gradients.vercel.app/noise.svg")]';

    const glassClass = cfg.glass ? 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl' : '';
    const animClass = cfg.animation === 'fade' ? 'animate-in fade-in duration-1000' :
      cfg.animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' :
        cfg.animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' : '';

    if (cfg.layout === 'hero') {
      return `
          <div class="relative w-full ${heightClasses[cfg.height]} flex flex-col justify-center overflow-hidden">
             <div class="absolute inset-0">
                <img src="${cfg.image}" class="w-full h-full object-cover ${cfg.bgMode === 'dark' ? 'opacity-40' : 'opacity-90'}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             </div>
             <div class="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col ${alignClasses[cfg.alignment]} ${animClass}">
                <div class="${cfg.glass ? 'p-8 rounded-3xl ' + glassClass : ''}">
                   <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">${cfg.heading}</h2>
                   <p class="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">${cfg.body}</p>
                </div>
             </div>
          </div>
        `;
    }
    if (cfg.layout === 'split') {
      const order = cfg.alignment === 'right' ? 'order-first' : 'order-last';
      return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0 w-full ${bgClass} overflow-hidden">
             <div class="relative h-[400px] md:h-auto ${order}">
                <img src="${cfg.image}" class="absolute inset-0 w-full h-full object-cover" />
             </div>
             <div class="p-12 md:p-24 flex flex-col justify-center ${animClass}">
                <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight">${cfg.heading}</h2>
                <p class="text-lg opacity-70 leading-relaxed">${cfg.body}</p>
             </div>
          </div>
        `;
    }
    if (cfg.layout === 'card') {
      return `
          <div class="w-full ${bgClass} ${heightClasses[cfg.height]} flex items-center justify-center px-6">
             <div class="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div class="rounded-3xl overflow-hidden shadow-2xl ${animClass}">
                   <img src="${cfg.image}" class="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div class="flex flex-col ${alignClasses[cfg.alignment]}">
                   <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight">${cfg.heading}</h2>
                   <p class="text-lg opacity-70 leading-relaxed mb-8">${cfg.body}</p>
                   <button class="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">Explore</button>
                </div>
             </div>
          </div>
        `;
    }
    return `
        <div class="w-full ${heightClasses[cfg.height]} ${bgClass} flex flex-col ${alignClasses[cfg.alignment]} justify-center px-6 md:px-24 ${animClass}">
           <h2 class="text-5xl md:text-8xl font-black tracking-tighter mb-4">${cfg.heading}</h2>
           <p class="text-xl md:text-2xl opacity-60 max-w-3xl">${cfg.body}</p>
        </div>
     `;
  };

  const handleOpenArchitect = (blockId: string) => {
    setSelectedBlockId(blockId);
    setIsArchitectOpen(true);
  };

  // Live Update Effect for Architect
  useEffect(() => {
    if (isArchitectOpen && selectedBlockId) {
      const html = constructBlockHTML(architectConfig);
      updateActiveBlock(html);
    }
  }, [architectConfig, isArchitectOpen, selectedBlockId]);

  const simulateImageGen = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      const images = [
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop'
      ];
      setArchitectConfig(prev => ({ ...prev, image: images[Math.floor(Math.random() * images.length)] }));
      setIsGeneratingImage(false);
    }, 2000);
  };

  // -------------------------



  const handleAddNewPage = () => {
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Page',
      slug: '/new-page',
      type: 'custom',
      content: '',
      blocks: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'section',
        name: 'Intro Text',
        content: '<p>Start writing your story here...</p>'
      }]
    };
    onAddPage(newPage);
  };

  // --- BLOCK MANAGEMENT FUNCTIONS ---

  const addBlock = (html: string, name: string, type: PageBlock['type'] = 'section', variant?: string) => {
    const newBlock: PageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      name: name,
      content: html,
      variant: variant,
      data: {}
    };
    const updatedBlocks = [...(activePage.blocks || []), newBlock];
    onUpdatePage(activePageId, { blocks: updatedBlocks });
    setSelectedBlockId(newBlock.id);
    setIsAddSectionOpen(false);
    setPreviewBlock(null);
    setAddSectionStep('categories');
    setSelectedCategory(null);
  };

  const updateActiveBlock = (content: string) => {
    if (!selectedBlockId) return;
    const updatedBlocks = activePage.blocks.map(b =>
      b.id === selectedBlockId ? { ...b, content } : b
    );
    onUpdatePage(activePageId, { blocks: updatedBlocks });
  };

  const updateActiveBlockData = (blockId: string, data: any) => {
    if (!blockId) return;
    const updatedBlocks = activePage.blocks.map(b =>
      b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b
    );
    onUpdatePage(activePageId, { blocks: updatedBlocks });
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    const blocks = [...activePage.blocks];
    if (index + direction < 0 || index + direction >= blocks.length) return;

    const temp = blocks[index];
    blocks[index] = blocks[index + direction];
    blocks[index + direction] = temp;
    onUpdatePage(activePageId, { blocks });
  };

  const deleteBlock = (id: string) => {
    const updatedBlocks = activePage.blocks.filter(b => b.id !== id);
    onUpdatePage(activePageId, { blocks: updatedBlocks });
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handlePreviewBlock = (type: PageBlock['type'], name: string, html: string = '', variant?: string) => {
    setPreviewBlock({
      id: 'preview-temp',
      type: type,
      name: name,
      content: html,
      variant: variant,
      data: {}
    });
  };

  // ----------------------------------

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onConfigChange({ ...config, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // not used directly, passed down
  }

  const generateCampaign = () => {
    setIsGeneratingEmail(true);
    setGeneratedEmail('');
    const fullText = `Subject: Flash Sale: The Cyber Shell Jacket is waiting for you.\n\nHey [Customer Name],\n\nWe noticed you've been eyeing the Cyber Shell Jacket. Good news—it's currently one of our most sought-after pieces this season.\n\nFor the next 24 hours, we're unlocking an exclusive 20% off just for our VIP members. \n\nUse Code: NEXUS20\n\nDon't let this slip into the void.\n\n- The Nexus Team`;

    let i = 0;
    const interval = setInterval(() => {
      setGeneratedEmail((prev) => prev + fullText.charAt(i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setIsGeneratingEmail(false);
      }
    }, 30);
  };

  const sortItems = (items: any[], type: 'az' | 'new' | 'hot') => {
    return [...items].sort((a, b) => {
      if (type === 'az') return a.name.localeCompare(b.name);
      if (type === 'new') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (type === 'hot') return b.popularity - a.popularity;
      return 0;
    });
  };

  const renderSortControls = (currentSort: 'az' | 'new' | 'hot', setSort: (s: 'az' | 'new' | 'hot') => void) => (
    <div className="flex justify-end mb-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-1 flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setSort('az'); }} className={`px-2 py-1 rounded text-[10px] font-bold ${currentSort === 'az' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}><ArrowDownAZ size={12} /></button>
        <button onClick={(e) => { e.stopPropagation(); setSort('new'); }} className={`px-2 py-1 rounded text-[10px] font-bold ${currentSort === 'new' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}><Calendar size={12} /></button>
        <button onClick={(e) => { e.stopPropagation(); setSort('hot'); }} className={`px-2 py-1 rounded text-[10px] font-bold ${currentSort === 'hot' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}><Flame size={12} /></button>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-64 bg-nexus-black border-r border-nexus-gray flex flex-col h-full text-neutral-400 shrink-0 z-20">
      <div className="p-6 border-b border-nexus-gray">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">N</div>
          <span className="font-display font-bold text-xl tracking-tight">Nexus OS</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: AdminTab.DASHBOARD, icon: LayoutDashboard, label: 'Command Center' },
          { id: AdminTab.PRODUCTS, icon: Package, label: 'Products' },
          { id: AdminTab.PAGES, icon: FileText, label: 'Pages' },
          { id: AdminTab.MEDIA, icon: FolderOpen, label: 'Media Library' },
          { id: AdminTab.DESIGN, icon: Palette, label: 'Design Studio' },
          { id: AdminTab.CAMPAIGNS, icon: Megaphone, label: 'Agent Campaigns' },
          { id: AdminTab.SETTINGS, icon: Settings, label: 'Settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setIsHeaderModalOpen(false);
              setIsSystemModalOpen(false);
              setIsInterfaceModalOpen(false);
              setIsAddSectionOpen(false);
              setIsArchitectOpen(false);
              setIsProductEditorOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
              ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
              : 'hover:bg-white/5 hover:text-white'
              }`}
          >
            <item.icon size={18} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-nexus-gray">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
        >
          <div className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></div>
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  // --- HEADER CONFIG MODAL ---
  const renderHeaderModal = () => {
    if (!isHeaderModalOpen) return null;
    const style = { left: editorWidth + 256 }; // 256 is sidebar width
    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <PanelTop size={20} className="text-blue-500" />
            <div><h3 className="text-white font-bold">Header Studio</h3><p className="text-xs text-neutral-500">Global Navigation</p></div>
          </div>
          <button onClick={() => setIsHeaderModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Branding Section */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={14} /> Identity</h4>
            <div className="space-y-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
              <div className="flex bg-black p-1 rounded-lg border border-neutral-800">
                <button onClick={() => { setLogoMode('text'); onConfigChange({ ...config, logoUrl: '' }); }} className={`flex-1 py-2 rounded text-xs font-bold ${logoMode === 'text' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>Text</button>
                <button onClick={() => setLogoMode('image')} className={`flex-1 py-2 rounded text-xs font-bold ${logoMode === 'image' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>Logo</button>
              </div>
              {logoMode === 'image' && (
                <div className="space-y-2">
                  <label className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-neutral-700 rounded bg-black cursor-pointer hover:border-blue-500"><Upload size={14} className="text-neutral-400" /><span className="text-xs text-neutral-400">Upload Image</span><input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" /></label>
                  <input type="range" min="20" max="120" value={config.logoHeight || 32} onChange={(e) => onConfigChange({ ...config, logoHeight: parseInt(e.target.value) })} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              )}
            </div>
          </div>
          {/* Style Grid */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} /> Architecture</h4>
            {renderSortControls(modalSort, setModalSort)}
            <div className="grid grid-cols-2 gap-2">
              {sortItems(HEADER_OPTIONS, modalSort).map((header) => (
                <button key={header.id} onClick={() => onConfigChange({ ...config, headerStyle: header.id as HeaderStyleId })} className={`text-left p-3 rounded-lg border transition-all ${config.headerStyle === header.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                  <div className="font-bold text-xs mb-1 truncate">{header.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SYSTEM BLOCK MODAL (Hero, Grid, Footer) ---
  const [warningFields, setWarningFields] = useState<string[]>([]);
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);

  const renderSystemBlockModal = () => {
    if (!isSystemModalOpen || !systemModalType) return null;

    let options: any[] = [];
    let currentSelection = '';
    let title = '';
    let setSelection: (id: string) => void = () => { };
    let color = 'blue';

    const handleHeroVariantChange = (id: string) => {
      if (!selectedBlockId || !activeBlock || !activeBlock.data) {
        const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b);
        onUpdatePage(activePageId, { blocks: updatedBlocks });
        return;
      }

      const currentFields = Object.keys(activeBlock.data).filter(k => activeBlock.data![k]);
      const targetFields = HERO_FIELDS[id] || [];

      const lostFields = currentFields.filter(field => !targetFields.includes(field));

      if (lostFields.length > 0) {
        setWarningFields(lostFields);
        setPendingVariant(id);
      } else {
        const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b);
        onUpdatePage(activePageId, { blocks: updatedBlocks });
      }
    };

    const confirmVariantChange = () => {
      if (pendingVariant && selectedBlockId) {
        const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: pendingVariant } : b);
        onUpdatePage(activePageId, { blocks: updatedBlocks });
        setPendingVariant(null);
        setWarningFields([]);
      }
    };

    if (systemModalType === 'hero') {
      options = HERO_OPTIONS;
      // If a block is selected, use its variant, otherwise global
      currentSelection = selectedBlockId ? activeBlock?.variant || config.heroStyle : config.heroStyle;
      title = 'Hero Engine';
      setSelection = (id) => {
        if (selectedBlockId) {
          handleHeroVariantChange(id);
        } else {
          onConfigChange({ ...config, heroStyle: id as HeroStyleId });
        }
      };
      color = 'purple';
    } else if (systemModalType === 'grid') {
      options = PRODUCT_CARD_OPTIONS;
      currentSelection = selectedBlockId ? activeBlock?.variant || config.productCardStyle : config.productCardStyle;
      title = 'Product Grid Engine';
      setSelection = (id) => {
        if (selectedBlockId) {
          const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b);
          onUpdatePage(activePageId, { blocks: updatedBlocks });
        } else {
          onConfigChange({ ...config, productCardStyle: id as ProductCardStyleId });
        }
      };
      color = 'green';
    } else if (systemModalType === 'footer') {
      options = FOOTER_OPTIONS;
      currentSelection = config.footerStyle;
      title = 'Footer Architecture';
      setSelection = (id) => onConfigChange({ ...config, footerStyle: id as FooterStyleId });
      color = 'orange';
    }

    const style = { left: editorWidth + 256 }; // 256 is sidebar width

    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <BoxSelect size={20} className={`text-${color}-500`} />
            <div><h3 className="text-white font-bold">{title}</h3><p className="text-xs text-neutral-500">System Component</p></div>
          </div>
          <button onClick={() => { setIsSystemModalOpen(false); setWarningFields([]); setPendingVariant(null); }} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative">
          {/* WARNING OVERLAY */}
          {warningFields.length > 0 && (
            <div className="absolute inset-0 z-50 bg-neutral-950/95 p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-4"><AlertTriangle size={24} /></div>
              <h4 className="text-white font-bold text-lg mb-2">Content Loss Warning</h4>
              <p className="text-neutral-400 text-sm mb-6">Switching to <span className="text-white font-bold">{HERO_OPTIONS.find(o => o.id === pendingVariant)?.name}</span> will hide the following text fields because they are not supported by this style:</p>
              <div className="bg-neutral-900 rounded-lg p-3 w-full mb-6 border border-neutral-800">
                {warningFields.map(field => (
                  <div key={field} className="text-xs text-red-400 font-mono py-1 border-b border-neutral-800 last:border-0">{field}</div>
                ))}
              </div>
              <div className="flex gap-2 w-full">
                <button onClick={() => { setWarningFields([]); setPendingVariant(null); }} className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-sm transition-colors">Cancel</button>
                <button onClick={confirmVariantChange} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors">Confirm</button>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} /> Style Matrix</h4>
            {renderSortControls(modalSort, setModalSort)}
            <div className="grid grid-cols-2 gap-2">
              {sortItems(options, modalSort).map((opt) => (
                <button key={opt.id} onClick={() => setSelection(opt.id)} className={`text-left p-3 rounded-lg border transition-all ${currentSelection === opt.id ? `bg-${color}-600/20 border-${color}-500 text-white` : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                  <div className="font-bold text-xs mb-1 truncate">{opt.name}</div>
                  <div className="text-[10px] opacity-60 truncate">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  // ... rest of the file
  const renderInterfaceModal = () => {
    if (!isInterfaceModalOpen) return null;
    const style = { left: editorWidth + 256 };
    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-blue-500" />
            <div><h3 className="text-white font-bold">Interface Studio</h3><p className="text-xs text-neutral-500">Global UI Settings</p></div>
          </div>
          <button onClick={() => setIsInterfaceModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ArrowDownAZ size={14} /> Scrollbar Style</h4>
            <div className="grid grid-cols-1 gap-2">
              {SCROLLBAR_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => onConfigChange({ ...config, scrollbarStyle: opt.id as ScrollbarStyleId })} className={`text-left p-3 rounded-lg border transition-all ${config.scrollbarStyle === opt.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                  <div className="font-bold text-sm mb-1">{opt.name}</div>
                  <div className="text-[10px] opacity-60">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBlockArchitect = () => {
    if (!isArchitectOpen) return null;

    const style = { left: editorWidth + 256 }; // 256 is sidebar width

    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <Wand2 size={20} className="text-blue-500" />
            <div><h3 className="text-white font-bold">Block Architect</h3><p className="text-xs text-neutral-500">Visual Design Engine</p></div>
          </div>
          <button onClick={() => setIsArchitectOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} /> Layout Matrix</h4>
            <div className="grid grid-cols-2 gap-2">
              {['hero', 'split', 'card', 'cover'].map(l => (
                <button key={l} onClick={() => setArchitectConfig({ ...architectConfig, layout: l })} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${architectConfig.layout === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}>
                  <BoxSelect size={20} /><span className="text-xs font-bold uppercase">{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Type size={14} /> Content Control</h4>
            <div className="space-y-3">
              <input value={architectConfig.heading} onChange={(e) => setArchitectConfig({ ...architectConfig, heading: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white text-sm font-bold focus:border-blue-500 outline-none" placeholder="Heading..." />
              <textarea value={architectConfig.body} onChange={(e) => setArchitectConfig({ ...architectConfig, body: e.target.value })} className="w-full h-24 bg-neutral-900 border border-neutral-800 rounded p-3 text-neutral-400 text-xs focus:border-blue-500 outline-none resize-none" placeholder="Body text..." />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ImageIcon size={14} /> Visual Assets</h4>
            <div className="space-y-3">
              <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img src={architectConfig.image} className="w-full h-full object-cover opacity-50" />
                <button onClick={simulateImageGen} className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 hover:bg-black/40 transition-colors">
                  {isGeneratingImage ? <Loader2 className="animate-spin text-white" /> : <><Sparkles size={16} className="text-blue-400" /><span className="text-xs font-bold text-white">Generate with Nexus AI</span></>}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sliders size={14} /> Atmosphere</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-400">Glassmorphism</span>
                <button onClick={() => setArchitectConfig(prev => ({ ...prev, glass: !prev.glass }))} className={`w-8 h-4 rounded-full transition-colors relative ${architectConfig.glass ? 'bg-blue-600' : 'bg-neutral-700'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${architectConfig.glass ? 'translate-x-4' : ''}`}></div>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['clean', 'dark', 'noise'].map(m => (
                  <button key={m} onClick={() => setArchitectConfig(prev => ({ ...prev, bgMode: m }))} className={`py-2 text-[10px] uppercase font-bold rounded border ${architectConfig.bgMode === m ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddSectionLibrary = () => {
    if (!isAddSectionOpen) return null;

    const style = { left: editorWidth + 256 }; // 256 is sidebar width

    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <Plus size={20} className="text-white" />
            <div>
              <h3 className="text-white font-bold">Add Section</h3>
              <p className="text-xs text-neutral-500">{addSectionStep === 'categories' ? 'Choose Type' : 'Select Style'}</p>
            </div>
          </div>
          <button onClick={() => { setIsAddSectionOpen(false); setPreviewBlock(null); setAddSectionStep('categories'); }} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {addSectionStep === 'categories' ? (
            <div className="space-y-2">
              <button onClick={() => { setSelectedCategory('hero'); setAddSectionStep('options'); }} className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-purple-500 rounded-xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-900/20 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors"><LayoutTemplate size={24} /></div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">Hero Engine</span>
                    <span className="text-xs text-neutral-500">High impact entry sections</span>
                  </div>
                </div>
                <ChevronDown className="-rotate-90 text-neutral-600" />
              </button>

              <button onClick={() => { setSelectedCategory('grid'); setAddSectionStep('options'); }} className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-green-500 rounded-xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-900/20 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors"><Grid size={24} /></div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">Product Grid</span>
                    <span className="text-xs text-neutral-500">Inventory display systems</span>
                  </div>
                </div>
                <ChevronDown className="-rotate-90 text-neutral-600" />
              </button>

              <button onClick={() => { setSelectedCategory('scroll'); setAddSectionStep('options'); }} className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500 rounded-xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-900/20 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"><Repeat size={24} /></div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">Scroll Sections</span>
                    <span className="text-xs text-neutral-500">Marquees and tickers</span>
                  </div>
                </div>
                <ChevronDown className="-rotate-90 text-neutral-600" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => { setAddSectionStep('categories'); setPreviewBlock(null); }} className="text-xs font-bold text-neutral-500 hover:text-white flex items-center gap-1"><ChevronDown className="rotate-90" size={14} /> Back to Categories</button>

              {selectedCategory === 'hero' && (
                <div className="grid grid-cols-1 gap-2">
                  {HERO_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('', opt.name, 'system-hero', opt.id)} className={`text-left p-3 rounded-xl border transition-all ${previewBlock?.variant === opt.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedCategory === 'grid' && (
                <div className="grid grid-cols-1 gap-2">
                  {PRODUCT_CARD_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('', `Grid: ${opt.name}`, 'system-grid', opt.id)} className={`text-left p-3 rounded-xl border transition-all ${previewBlock?.variant === opt.id ? 'bg-green-600/20 border-green-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedCategory === 'scroll' && (
                <div className="grid grid-cols-1 gap-2">
                  {SCROLL_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('', opt.name, 'system-scroll', opt.id)} className={`text-left p-3 rounded-xl border transition-all ${previewBlock?.variant === opt.id ? 'bg-orange-600/20 border-orange-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case AdminTab.DESIGN:
        const isAnyModalOpen = isHeaderModalOpen || isSystemModalOpen || isArchitectOpen || isAddSectionOpen || isInterfaceModalOpen;
        return (
          <div className="flex h-full w-full bg-neutral-950 overflow-hidden">
            {/* LEFT COLUMN: EDITOR */}
            <div style={{ width: editorWidth }} className="relative flex flex-col border-r border-neutral-800 bg-black/50 shrink-0">
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-600 transition-colors z-50"
                onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
              />
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 space-y-3">

                  {/* Pages & Navigation (Kept as requested) */}
                  <div className="bg-neutral-900 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setDesignSections(prev => ({ ...prev, pages: !prev.pages }))} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><FileText size={16} /></div><span className="font-bold text-sm text-white">Pages</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${designSections.pages ? 'rotate-180' : ''}`} />
                    </button>
                    {designSections.pages && (
                      <div className="p-2 border-t border-neutral-800 bg-black/20 space-y-1">
                        {pages.map(page => {
                          const isActive = activePageId === page.id;
                          return (
                            <div key={page.id} className={`rounded-lg transition-colors ${isActive ? 'bg-neutral-900 border border-neutral-800' : ''}`}>
                              <button onClick={() => { onSetActivePage(page.id); setSelectedBlockId(null); setShowPageProperties(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${isActive ? 'text-blue-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
                                <div className="flex items-center gap-3">{page.type === 'home' ? <Home size={14} /> : <FileText size={14} />}<span className="font-medium">{page.title}</span></div>
                                <div className="flex items-center gap-2">{isActive && (<button onClick={(e) => { e.stopPropagation(); setShowPageProperties(!showPageProperties); }} className={`p-1 rounded hover:bg-neutral-800 transition-colors ${showPageProperties ? 'text-white bg-neutral-800' : 'text-neutral-500'}`} title="Page Properties"><Settings size={12} /></button>)}{isActive && <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">EDIT</span>}</div>
                              </button>
                              {isActive && showPageProperties && (
                                <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-2">
                                  <div className="h-px bg-neutral-800 w-full mb-3"></div>
                                  <div><label className="text-[10px] text-neutral-500 uppercase font-bold">Page Title</label><input value={page.title} onChange={(e) => onUpdatePage(page.id, { title: e.target.value })} className="w-full bg-black border border-neutral-700 rounded p-1.5 text-white text-xs mt-1 focus:border-blue-500 outline-none" /></div>
                                  {page.type === 'custom' && (<div><label className="text-[10px] text-neutral-500 uppercase font-bold">URL Slug</label><input value={page.slug} onChange={(e) => onUpdatePage(page.id, { slug: e.target.value })} className="w-full bg-black border border-neutral-700 rounded p-1.5 text-neutral-400 font-mono text-xs mt-1 focus:border-blue-500 outline-none" /></div>)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <button onClick={handleAddNewPage} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-white/5 border border-dashed border-neutral-800 hover:border-neutral-600 transition-all mt-2"><Plus size={14} /> Add New Page</button>
                      </div>
                    )}
                  </div>

                  {/* GLOBAL INTERFACE */}
                  <div className="bg-neutral-900 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl overflow-hidden mb-3">
                    <button onClick={() => setIsInterfaceModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><Monitor size={16} /></div><span className="font-bold text-sm text-white">Interface</span></div>
                      <div className="text-[10px] text-neutral-500 uppercase font-bold">{config.scrollbarStyle}</div>
                    </button>
                  </div>

                  {/* UNIFIED PAGE LAYOUT (The Hub) */}
                  <div className="bg-neutral-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setDesignSections(prev => ({ ...prev, pageSections: !prev.pageSections }))} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><Layers size={16} /></div><span className="font-bold text-sm text-white">Layout</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${designSections.pageSections ? 'rotate-180' : ''}`} />
                    </button>
                    {designSections.pageSections && (
                      <div className="p-4 pt-0 border-t border-neutral-800 bg-black/20">
                        <div className="space-y-2 mb-4 mt-2">
                          {/* 1. FIXED HEADER */}
                          <div className="group flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-blue-900/30 text-blue-400 rounded"><PanelTop size={14} /></div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Header</span>
                                <span className="text-[10px] text-neutral-500">{HEADER_OPTIONS.find(h => h.id === config.headerStyle)?.name}</span>
                              </div>
                            </div>
                            <button onClick={() => setIsHeaderModalOpen(true)} className="px-3 py-1.5 bg-neutral-800 hover:bg-blue-600 text-neutral-400 hover:text-white rounded text-xs font-bold transition-all">Edit</button>
                          </div>

                          {/* 2. DYNAMIC BLOCKS */}
                          {activePage.blocks?.map((block, idx) => (
                            <div key={block.id} className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${selectedBlockId === block.id ? 'bg-neutral-800 border-neutral-700' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="text-[10px] font-bold text-neutral-600 w-4">{idx + 1}</div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-white truncate max-w-[100px]">{block.name}</span>
                                  <span className="text-[10px] text-neutral-500 uppercase">{block.type.replace('system-', '')}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    if (block.type === 'system-hero') { setSelectedBlockId(block.id); setSystemModalType('hero'); setIsSystemModalOpen(true); }
                                    else if (block.type === 'system-grid') { setSelectedBlockId(block.id); setSystemModalType('grid'); setIsSystemModalOpen(true); }
                                    else if (block.type === 'system-footer') { setSelectedBlockId(null); setSystemModalType('footer'); setIsSystemModalOpen(true); }
                                    else { handleOpenArchitect(block.id); }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Edit Section"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <div className="flex flex-col gap-0.5">
                                  <button onClick={() => moveBlock(idx, -1)} className="text-neutral-600 hover:text-white disabled:opacity-30" disabled={idx === 0}><MoveUp size={10} /></button>
                                  <button onClick={() => moveBlock(idx, 1)} className="text-neutral-600 hover:text-white disabled:opacity-30" disabled={idx === (activePage.blocks?.length || 0) - 1}><MoveDown size={10} /></button>
                                </div>
                                <button onClick={() => deleteBlock(block.id)} className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors ml-1"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}

                          {/* 3. FIXED FOOTER */}
                          <div className="group flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-orange-900/30 text-orange-400 rounded"><PanelBottom size={14} /></div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Footer</span>
                                <span className="text-[10px] text-neutral-500">{FOOTER_OPTIONS.find(f => f.id === config.footerStyle)?.name}</span>
                              </div>
                            </div>
                            <button onClick={() => { setSelectedBlockId(null); setSystemModalType('footer'); setIsSystemModalOpen(true); }} className="px-3 py-1.5 bg-neutral-800 hover:bg-orange-600 text-neutral-400 hover:text-white rounded text-xs font-bold transition-all">Edit</button>
                          </div>

                          {/* ADD SECTION BUTTON */}
                          <div className="pt-4">
                            <button onClick={() => setIsAddSectionOpen(true)} className="w-full py-3 border border-dashed border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-white hover:border-neutral-500 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                              <Plus size={14} /> Add Section
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* INLINE BLOCK EDITOR (Restored) */}
                  {selectedBlockId && activeBlock && activeBlock.type === 'section' && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden animate-in slide-in-from-top-2">
                      <div className="p-2 border-b border-neutral-800 flex items-center gap-2 bg-black/20">
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><Bold size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><Italic size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><Link size={14} /></button>
                        <div className="w-px h-4 bg-neutral-800 mx-1"></div>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><AlignLeft size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><AlignCenter size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><AlignRight size={14} /></button>
                      </div>
                      <textarea
                        value={activeBlock.content}
                        onChange={(e) => updateActiveBlock(e.target.value)}
                        className="w-full h-64 bg-transparent p-4 text-xs font-mono text-neutral-300 focus:outline-none resize-none"
                        placeholder="Edit HTML content..."
                      />
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE CANVAS */}
            <div className={`flex-1 bg-[#111] flex flex-col relative transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isAnyModalOpen ? 'pl-96' : ''}`}>
              <div className="h-12 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
                <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800">
                  <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}><Monitor size={14} /></button>
                  <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}><Smartphone size={14} /></button>
                </div>
                <div className="text-xs text-neutral-500 font-mono">Live Preview: 12ms</div>
              </div>
              <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
                <div className={`bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl overflow-hidden relative ${previewDevice === 'mobile' ? 'w-[375px] h-[812px] rounded-[40px] border-[8px] border-neutral-900' : 'w-full h-full max-w-[1400px] rounded-lg border border-neutral-800'}`}>
                  <div className={`w-full h-full overflow-y-auto bg-white scrollbar-${config.scrollbarStyle}`}>
                    <Storefront
                      config={config}
                      products={products}
                      pages={pages}
                      activePageId={activePageId}
                      previewBlock={previewBlock}
                      activeBlockId={selectedBlockId}
                      onUpdateBlock={updateActiveBlockData}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case AdminTab.DASHBOARD:
        return (
          <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-900/20 text-blue-500 rounded-xl"><DollarSign size={24} /></div>
                  <div><div className="text-neutral-500 text-sm font-bold uppercase">Total Revenue</div><div className="text-2xl font-bold text-white">$124,592.00</div></div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[70%] bg-blue-600"></div></div>
              </div>
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-900/20 text-purple-500 rounded-xl"><Users size={24} /></div>
                  <div><div className="text-neutral-500 text-sm font-bold uppercase">Active Users</div><div className="text-2xl font-bold text-white">8,549</div></div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[45%] bg-purple-600"></div></div>
              </div>
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-900/20 text-green-500 rounded-xl"><ShoppingBag size={24} /></div>
                  <div><div className="text-neutral-500 text-sm font-bold uppercase">Orders</div><div className="text-2xl font-bold text-white">1,245</div></div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[80%] bg-green-600"></div></div>
              </div>
            </div>
          </div>
        );

      case AdminTab.PRODUCTS:
        return (
          <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-black text-white tracking-tight">Inventory</h2><p className="text-neutral-500">Manage your products and stock</p></div>
              <button onClick={handleCreateProduct} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"><Plus size={18} /> Add Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all cursor-pointer" onClick={() => handleEditProduct(product)}>
                  <div className="aspect-square relative overflow-hidden">
                    <img src={product.images?.[0]?.url || product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white text-black rounded-lg hover:bg-neutral-200"><Edit3 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white truncate pr-2">{product.name}</h3>
                      <span className="text-green-500 font-mono text-xs">${product.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>{product.category}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isProductEditorOpen && (
              <ProductEditor
                product={editingProduct}
                onSave={(p) => {
                  onAddProduct(p);
                  setIsProductEditorOpen(false);
                }}
                onCancel={() => setIsProductEditorOpen(false)}
              />
            )}
          </div>
        );

      case AdminTab.PAGES:
        return (
          <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-black text-white tracking-tight">Page Management</h2><p className="text-neutral-500">Create and manage your store's content</p></div>
              <button onClick={handleAddNewPage} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"><Plus size={18} /> Add Page</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pages.map(page => (
                <div key={page.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${page.type === 'home' ? 'bg-blue-900/20 text-blue-500' : 'bg-neutral-800 text-neutral-400'}`}>
                      {page.type === 'home' ? <Home size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{page.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                        <span className="uppercase">{page.type}</span>
                        <span>•</span>
                        <span>{page.slug}</span>
                        <span>•</span>
                        <span>{page.blocks?.length || 0} Sections</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { onSetActivePage(page.id); onTabChange(AdminTab.DESIGN); }} className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors text-sm">Open in Editor</button>
                    {page.type !== 'home' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
                            onDeletePage(page.id);
                          }
                        }}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case AdminTab.MEDIA:
        return (
          <MediaLibrary
            assets={mediaAssets}
            onAddAsset={onAddAsset}
            onDeleteAsset={onDeleteAsset}
          />
        );

      case AdminTab.CAMPAIGNS:
        return (
          <CampaignManager
            campaigns={campaigns}
            onAddCampaign={onAddCampaign}
            onUpdateCampaign={onUpdateCampaign}
            onDeleteCampaign={onDeleteCampaign}
          />
        );

      case AdminTab.SETTINGS:
        return (
          <div className="p-8 w-full max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Store Settings</h2>
              <p className="text-neutral-500">Configure your store identity and preferences</p>
            </div>
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4">General Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-neutral-500 uppercase">Store Name</label><input value={config.name} onChange={e => onConfigChange({ ...config, name: e.target.value })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1" /></div>
                  <div><label className="text-xs font-bold text-neutral-500 uppercase">Currency</label><input value={config.currency} onChange={e => onConfigChange({ ...config, currency: e.target.value })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1" /></div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4">Contact & Social</h3>
                <div><label className="text-xs font-bold text-neutral-500 uppercase">Support Email</label><input defaultValue="support@nexus.os" className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1" /></div>
                <div><label className="text-xs font-bold text-neutral-500 uppercase">Instagram</label><input defaultValue="@nexus_os" className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1" /></div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-8"><h2 className="text-white text-2xl">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex h-screen bg-nexus-black text-white font-sans overflow-hidden">
      {renderSidebar()}
      {renderInterfaceModal()}
      {renderBlockArchitect()}
      {renderHeaderModal()}
      {renderSystemBlockModal()}
      {renderAddSectionLibrary()}
      <main className="flex-1 overflow-y-auto relative flex flex-col">{renderContent()}</main>
    </div>
  );
};
