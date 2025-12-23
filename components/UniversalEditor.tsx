import React, { useState } from 'react';
import { ChevronLeft, Layout, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, Palette, Plus, Trash2, ChevronRight, ArrowLeft, Check, Upload, X, Bold, Italic, Link as LinkIcon, List, Loader2, Sparkles, Wand2, Info, ChevronDown, GripVertical, Mail, Phone, MessageSquare, User, FileText, Hash, Calendar, CheckSquare, ToggleLeft, Grid, Columns, Filter, SortAsc, Lightbulb, ExternalLink, Home, ShoppingBag, Users, HelpCircle, Zap, AlertCircle, Repeat } from 'lucide-react';
import { UniversalSectionData } from '../lib/smartMapper';
import { supabase } from '../lib/supabaseClient';

// Import Options
import { BLOG_OPTIONS } from './BlogLibrary';
import { VIDEO_OPTIONS } from './VideoLibrary';
import { CONTACT_OPTIONS } from './ContactLibrary';
import { LAYOUT_OPTIONS } from './LayoutLibrary';
import { COLLECTION_OPTIONS } from './CollectionLibrary';
import { HERO_OPTIONS } from './HeroLibrary';
import { GALLERY_OPTIONS } from './GalleryLibrary';
import { SOCIAL_OPTIONS } from './SocialLibrary';
import { SCROLL_OPTIONS } from './ScrollLibrary';
import { PRODUCT_CARD_OPTIONS } from './ProductCardLibrary';
import { RICH_TEXT_OPTIONS, EMAIL_SIGNUP_OPTIONS, COLLAPSIBLE_OPTIONS, LOGO_LIST_OPTIONS, PROMO_BANNER_OPTIONS } from './SectionLibrary';

const ALL_OPTIONS: Record<string, any[]> = {
  'system-hero': HERO_OPTIONS,
  'system-blog': BLOG_OPTIONS,
  'system-video': VIDEO_OPTIONS,
  'system-scroll': SCROLL_OPTIONS,
  'system-grid': PRODUCT_CARD_OPTIONS,
  'system-contact': CONTACT_OPTIONS,
  'system-layout': LAYOUT_OPTIONS,
  'system-collection': COLLECTION_OPTIONS,
  'system-gallery': GALLERY_OPTIONS,
  'system-social': SOCIAL_OPTIONS,
  'system-rich-text': RICH_TEXT_OPTIONS,
  'system-email': EMAIL_SIGNUP_OPTIONS,
  'system-collapsible': COLLAPSIBLE_OPTIONS,
  'system-logo-list': LOGO_LIST_OPTIONS,
  'system-promo': PROMO_BANNER_OPTIONS,
};

// ============== SECTION-SPECIFIC FIELD CONFIGURATIONS ==============
// Each section type gets its own relevant fields instead of generic ones

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'richtext' | 'image' | 'url' | 'select' | 'number' | 'toggle' | 'color' | 'formBuilder' | 'productSelector' | 'linkSelector';
  placeholder?: string;
  maxLength?: number;
  tip?: string;
  examples?: string[];
  options?: { value: string; label: string }[];
  showAI?: boolean;
  required?: boolean;
  group?: string;
  defaultValue?: any;
}

interface SectionFieldConfig {
  title: string;
  description: string;
  groups: { id: string; label: string; icon?: React.ReactNode }[];
  fields: FieldConfig[];
}

const SECTION_FIELD_CONFIGS: Record<string, SectionFieldConfig> = {
  'system-hero': {
    title: 'Hero Section',
    description: 'The first impression visitors see - make it count!',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'buttons', label: 'Buttons', icon: <ExternalLink size={12} /> },
      { id: 'media', label: 'Media', icon: <ImageIcon size={12} /> },
      { id: 'extras', label: 'Extras', icon: <Zap size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Headline', type: 'text', group: 'content', maxLength: 60, showAI: true, 
        placeholder: 'Your main headline (30-60 chars)', 
        tip: 'Start with action verbs, focus on benefits. Keep under 60 characters.',
        examples: ['Transform Your Morning Routine', 'Premium Quality, Everyday Prices', 'Join 10,000+ Happy Customers'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', maxLength: 160, showAI: true,
        placeholder: 'Supporting text that expands on your headline',
        tip: 'Best at 120-160 characters. Explain the value proposition.' },
      { key: 'image', label: 'Background Image', type: 'image', group: 'media',
        tip: 'Recommended: 1920x1080px, under 500KB. High contrast works best.' },
      { key: 'buttonText', label: 'Primary Button', type: 'text', group: 'buttons', showAI: true,
        placeholder: 'e.g., Shop Now, Get Started',
        examples: ['Shop Now', 'Get Started', 'Learn More', 'Browse Collection'] },
      { key: 'buttonLink', label: 'Button Link', type: 'linkSelector', group: 'buttons',
        placeholder: '/shop or https://...' },
      { key: 'secondaryButtonText', label: 'Secondary Button', type: 'text', group: 'buttons',
        placeholder: 'e.g., Learn More (optional)' },
      { key: 'badge', label: 'Badge/Label', type: 'text', group: 'extras', showAI: true,
        placeholder: 'e.g., ✨ New Collection, 🔥 Limited Time',
        examples: ['✨ New Release', '🔥 Best Sellers Inside', '👗 New Season Arrivals'] },
      { key: 'marqueeText', label: 'Scrolling Marquee', type: 'text', group: 'extras',
        placeholder: 'Text that scrolls across the section' },
    ]
  },

  'system-contact': {
    title: 'Contact Form',
    description: 'Let visitors reach out to you',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'form', label: 'Form Settings', icon: <Mail size={12} /> },
      { id: 'info', label: 'Contact Info', icon: <Phone size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Get in Touch, Contact Us',
        examples: ['Get in Touch', 'Let\'s Talk', 'How Can We Help?', 'Send Us a Message'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Brief description of what visitors can expect' },
      { key: 'formFields', label: 'Form Fields', type: 'formBuilder', group: 'form',
        tip: 'Add, remove, and configure your form fields' },
      { key: 'submitButtonText', label: 'Submit Button Text', type: 'text', group: 'form',
        placeholder: 'Send Message', defaultValue: 'Send Message' },
      { key: 'successMessage', label: 'Success Message', type: 'text', group: 'form', showAI: true,
        placeholder: 'Thank you! We\'ll respond within 24 hours.',
        defaultValue: 'Thank you! We\'ll get back to you soon.' },
      { key: 'recipientEmail', label: 'Send Submissions To', type: 'text', group: 'form',
        placeholder: 'support@yourdomain.com',
        tip: 'Email address where form submissions will be sent' },
      { key: 'contactEmail', label: 'Display Email', type: 'text', group: 'info',
        placeholder: 'hello@yourdomain.com' },
      { key: 'contactPhone', label: 'Display Phone', type: 'text', group: 'info',
        placeholder: '+1 (555) 123-4567' },
      { key: 'contactAddress', label: 'Display Address', type: 'richtext', group: 'info',
        placeholder: '123 Main St, City, State 12345' },
    ]
  },

  'system-collection': {
    title: 'Product Grid',
    description: 'Display products from your store',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'products', label: 'Product Selection', icon: <ShoppingBag size={12} /> },
      { id: 'layout', label: 'Grid Layout', icon: <Grid size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Our Products, Featured Collection',
        examples: ['Featured Products', 'New Arrivals', 'Best Sellers', 'Shop the Collection'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Brief description of the products' },
      { key: 'productDisplay', label: 'Display Mode', type: 'select', group: 'products',
        options: [
          { value: 'all', label: 'All Products' },
          { value: 'featured', label: 'Featured Products Only' },
          { value: 'category', label: 'Specific Category' },
          { value: 'manual', label: 'Manual Selection' },
        ],
        defaultValue: 'all' },
      { key: 'productCategory', label: 'Category Filter', type: 'select', group: 'products',
        options: [{ value: '', label: 'All Categories' }],
        tip: 'Filter products by category (only when "Specific Category" is selected)' },
      { key: 'productCount', label: 'Products to Show', type: 'number', group: 'products',
        placeholder: '8', defaultValue: 8,
        tip: 'Number of products to display (4-24 recommended)' },
      { key: 'productSort', label: 'Sort By', type: 'select', group: 'products',
        options: [
          { value: 'newest', label: 'Newest First' },
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'name', label: 'Name A-Z' },
          { value: 'bestselling', label: 'Best Selling' },
        ],
        defaultValue: 'newest' },
      { key: 'gridColumns', label: 'Grid Columns', type: 'select', group: 'layout',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
          { value: '5', label: '5 Columns' },
        ],
        defaultValue: '4' },
      { key: 'showPrices', label: 'Show Prices', type: 'toggle', group: 'layout', defaultValue: true },
      { key: 'showAddToCart', label: 'Show Add to Cart', type: 'toggle', group: 'layout', defaultValue: true },
      { key: 'buttonText', label: 'View All Button', type: 'text', group: 'content',
        placeholder: 'View All Products' },
      { key: 'buttonLink', label: 'View All Link', type: 'linkSelector', group: 'content',
        placeholder: '/shop' },
    ]
  },

  'system-blog': {
    title: 'Blog Posts',
    description: 'Display articles and blog posts',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'posts', label: 'Post Settings', icon: <FileText size={12} /> },
      { id: 'layout', label: 'Layout', icon: <Grid size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Latest Articles, From Our Blog',
        examples: ['Latest Articles', 'From the Blog', 'Stories & Updates', 'Read More'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
      { key: 'postsToShow', label: 'Posts to Show', type: 'number', group: 'posts',
        placeholder: '6', defaultValue: 6 },
      { key: 'postCategory', label: 'Category', type: 'select', group: 'posts',
        options: [{ value: '', label: 'All Categories' }] },
      { key: 'showDate', label: 'Show Date', type: 'toggle', group: 'layout', defaultValue: true },
      { key: 'showAuthor', label: 'Show Author', type: 'toggle', group: 'layout', defaultValue: true },
      { key: 'showExcerpt', label: 'Show Excerpt', type: 'toggle', group: 'layout', defaultValue: true },
      { key: 'gridColumns', label: 'Grid Columns', type: 'select', group: 'layout',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
        ],
        defaultValue: '3' },
    ]
  },

  'system-gallery': {
    title: 'Image Gallery',
    description: 'Display a collection of images',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'layout', label: 'Layout', icon: <Grid size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Our Gallery, Photo Collection' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
      { key: 'gridColumns', label: 'Grid Columns', type: 'select', group: 'layout',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
          { value: '5', label: '5 Columns' },
        ],
        defaultValue: '4' },
      { key: 'enableLightbox', label: 'Enable Lightbox', type: 'toggle', group: 'layout', defaultValue: true,
        tip: 'Click images to view full size' },
      { key: 'aspectRatio', label: 'Image Aspect Ratio', type: 'select', group: 'layout',
        options: [
          { value: 'square', label: 'Square (1:1)' },
          { value: 'landscape', label: 'Landscape (16:9)' },
          { value: 'portrait', label: 'Portrait (3:4)' },
          { value: 'auto', label: 'Original Ratio' },
        ],
        defaultValue: 'square' },
    ]
  },

  'system-video': {
    title: 'Video Section',
    description: 'Embed videos from YouTube, Vimeo, or upload your own',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'video', label: 'Video Settings', icon: <ImageIcon size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
      { key: 'videoUrl', label: 'Video URL', type: 'url', group: 'video',
        placeholder: 'https://youtube.com/watch?v=... or https://vimeo.com/...',
        tip: 'Paste a YouTube or Vimeo URL' },
      { key: 'autoplay', label: 'Autoplay', type: 'toggle', group: 'video', defaultValue: false,
        tip: 'Video will play automatically (muted)' },
      { key: 'loop', label: 'Loop Video', type: 'toggle', group: 'video', defaultValue: false },
      { key: 'showControls', label: 'Show Controls', type: 'toggle', group: 'video', defaultValue: true },
      { key: 'thumbnail', label: 'Custom Thumbnail', type: 'image', group: 'video',
        tip: 'Optional custom preview image before video plays' },
    ]
  },

  'system-email': {
    title: 'Email Signup',
    description: 'Collect email addresses from visitors',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'form', label: 'Form Settings', icon: <Mail size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Join Our Newsletter',
        examples: ['Join Our Newsletter', 'Stay in the Loop', 'Get 10% Off', 'Subscribe for Updates'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Brief description of what subscribers will receive' },
      { key: 'buttonText', label: 'Button Text', type: 'text', group: 'form',
        placeholder: 'Subscribe', defaultValue: 'Subscribe' },
      { key: 'successMessage', label: 'Success Message', type: 'text', group: 'form', showAI: true,
        placeholder: 'Thanks for subscribing!', defaultValue: 'Thanks for subscribing!' },
      { key: 'incentiveText', label: 'Incentive Text', type: 'text', group: 'content',
        placeholder: 'e.g., Get 10% off your first order',
        tip: 'Optional incentive to encourage signups' },
    ]
  },

  'system-rich-text': {
    title: 'Rich Text',
    description: 'A simple text content section',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'Section heading' },
      { key: 'content', label: 'Content', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Your main content text...',
        tip: 'Use formatting tools to style your text' },
    ]
  },

  'system-social': {
    title: 'Social Feed',
    description: 'Display social media content',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'settings', label: 'Settings', icon: <Users size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Follow Us, #YourBrand',
        examples: ['Follow Us', 'Join the Community', '#YourBrand', 'See What\'s Trending'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
      { key: 'instagramHandle', label: 'Instagram Handle', type: 'text', group: 'settings',
        placeholder: '@yourbrand' },
      { key: 'postsToShow', label: 'Posts to Show', type: 'number', group: 'settings',
        placeholder: '6', defaultValue: 6 },
    ]
  },

  'system-collapsible': {
    title: 'FAQ / Accordion',
    description: 'Expandable content sections',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Frequently Asked Questions, Details',
        examples: ['Frequently Asked Questions', 'Product Details', 'Shipping Info', 'How It Works'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
    ]
  },

  'system-layout': {
    title: 'Content Layout',
    description: 'Multi-column or image-text layouts',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'media', label: 'Media', icon: <ImageIcon size={12} /> },
      { id: 'buttons', label: 'Buttons', icon: <ExternalLink size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'Section heading' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
      { key: 'image', label: 'Image', type: 'image', group: 'media' },
      { key: 'buttonText', label: 'Button Text', type: 'text', group: 'buttons', showAI: true },
      { key: 'buttonLink', label: 'Button Link', type: 'linkSelector', group: 'buttons' },
    ]
  },

  'system-scroll': {
    title: 'Scroll Section',
    description: 'Animated scrolling content (marquees, tickers)',
    groups: [
      { id: 'content', label: 'Content', icon: <Repeat size={12} /> },
      { id: 'logos', label: 'Logos', icon: <ImageIcon size={12} /> },
    ],
    fields: [
      { key: 'text', label: 'Ticker Text', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., FREE SHIPPING • NEW ARRIVALS • LIMITED TIME OFFER',
        tip: 'Use • or | to separate items. Text will scroll continuously.',
        examples: ['FREE SHIPPING WORLDWIDE • NEW COLLECTION OUT NOW', '🔥 SALE ENDS SOON • UP TO 50% OFF'] },
      { key: 'logos', label: 'Logo URLs', type: 'text', group: 'logos',
        placeholder: 'Comma-separated image URLs',
        tip: 'Add logo image URLs separated by commas. Logos will scroll horizontally.' },
    ]
  },

  'system-grid': {
    title: 'Product Grid',
    description: 'Display products in a grid layout',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'settings', label: 'Settings', icon: <Grid size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Featured Products, Best Sellers',
        examples: ['Featured Products', 'New Arrivals', 'Best Sellers', 'Shop the Collection'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Optional description for the grid section' },
      { key: 'columns', label: 'Columns', type: 'select', group: 'settings',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
        ],
        defaultValue: '3' },
      { key: 'limit', label: 'Products to Show', type: 'number', group: 'settings',
        placeholder: '6', defaultValue: 6 },
    ]
  },
};

// Default config for sections not explicitly defined
const DEFAULT_FIELD_CONFIG: SectionFieldConfig = {
  title: 'Section',
  description: 'Configure your section content',
  groups: [
    { id: 'content', label: 'Content', icon: <Type size={12} /> },
    { id: 'media', label: 'Media', icon: <ImageIcon size={12} /> },
    { id: 'buttons', label: 'Buttons', icon: <ExternalLink size={12} /> },
  ],
  fields: [
    { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true, maxLength: 60 },
    { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
    { key: 'image', label: 'Main Image', type: 'image', group: 'media' },
    { key: 'buttonText', label: 'Button Text', type: 'text', group: 'buttons', showAI: true },
    { key: 'buttonLink', label: 'Button Link', type: 'linkSelector', group: 'buttons' },
  ]
};

interface UniversalEditorProps {
  blockId: string;
  blockType: string;
  variant: string;
  data: UniversalSectionData;
  activeField?: string | null;
  onUpdate: (data: UniversalSectionData) => void;
  onSwitchLayout: (newVariant: string) => void;
  pages?: { id: string; name: string; slug: string }[];
}

// Form field types for the form builder
interface FormFieldItem {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const DEFAULT_FORM_FIELDS: FormFieldItem[] = [
  { id: '1', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
  { id: '2', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
  { id: '3', type: 'textarea', label: 'Message', placeholder: 'Your message...', required: true },
];

const FORM_FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: <Type size={14} /> },
  { value: 'email', label: 'Email', icon: <Mail size={14} /> },
  { value: 'phone', label: 'Phone', icon: <Phone size={14} /> },
  { value: 'textarea', label: 'Long Text', icon: <MessageSquare size={14} /> },
  { value: 'number', label: 'Number', icon: <Hash size={14} /> },
  { value: 'date', label: 'Date', icon: <Calendar size={14} /> },
  { value: 'select', label: 'Dropdown', icon: <ChevronDown size={14} /> },
  { value: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={14} /> },
];

export const UniversalEditor: React.FC<UniversalEditorProps> = ({
  blockId,
  blockType,
  variant,
  data,
  activeField,
  onUpdate,
  onSwitchLayout,
  pages = []
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<string | null>(null);
  
  // AI Content Generation (simulated for now - would connect to OpenAI/Claude in production)
  const generateAIContent = async (field: string, context?: string) => {
    setIsGeneratingAI(field);
    
    // Simulate AI generation with realistic delays
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiSuggestions: Record<string, Record<string, string>> = {
      heading: {
        default: 'Transform Your Vision Into Reality',
        ecommerce: 'Discover Products You\'ll Love',
        fashion: 'Elevate Your Style Today',
        tech: 'Innovation Meets Excellence',
        food: 'Taste the Difference',
      },
      subheading: {
        default: 'We help businesses grow with cutting-edge solutions designed for the modern world.',
        ecommerce: 'Shop our curated collection of premium products, handpicked for quality and style.',
        fashion: 'From runway trends to everyday essentials, find your perfect look.',
        tech: 'Discover tools and technologies that power the future of work.',
        food: 'Fresh ingredients, authentic flavors, delivered to your door.',
      },
      buttonText: {
        default: 'Get Started',
        ecommerce: 'Shop Now',
        fashion: 'Browse Collection',
        tech: 'Learn More',
        food: 'Order Now',
      },
      badge: {
        default: '✨ New Release',
        ecommerce: '🔥 Best Sellers Inside',
        fashion: '👗 New Season Arrivals',
        tech: '🚀 Now Available',
        food: '🍃 Farm Fresh Daily',
      }
    };
    
    const suggestions = aiSuggestions[field] || aiSuggestions['default'];
    const types = Object.keys(suggestions);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    updateField(field, suggestions[randomType]);
    setIsGeneratingAI(null);
  };

  // Auto-scroll to active field
  React.useEffect(() => {
    if (activeField) {
      const element = document.getElementById(`editor-field-${activeField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
        // Add a temporary highlight effect
        element.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500'), 2000);
      }
    }
  }, [activeField]);

  const options = ALL_OPTIONS[blockType] || [];
  const currentOption = options.find(o => o.id === variant);

  const updateField = (key: string, value: any) => {
    onUpdate({ ...data, [key]: value });
  };

  const updateStyle = (key: string, value: any) => {
    onUpdate({ ...data, style: { ...data.style, [key]: value } });
  };

  const updateItem = (index: number, key: string, value: any) => {
    if (!data.items) return;
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [key]: value };
    onUpdate({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItems = [...(data.items || []), { id: Date.now().toString(), title: 'New Item', description: 'Description' }];
    onUpdate({ ...data, items: newItems });
    setActiveItemIndex(newItems.length - 1);
  };

  const removeItem = (index: number) => {
    if (!data.items) return;
    const newItems = data.items.filter((_, i) => i !== index);
    onUpdate({ ...data, items: newItems });
    if (activeItemIndex === index) setActiveItemIndex(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (index !== undefined) {
        updateItem(index, field, publicUrl);
      } else {
        updateField(field, publicUrl);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- COMPONENTS ---

  // Get section-specific configuration
  const sectionConfig = SECTION_FIELD_CONFIGS[blockType] || DEFAULT_FIELD_CONFIG;
  const [activeGroup, setActiveGroup] = useState<string>(sectionConfig.groups[0]?.id || 'content');
  const [showExamples, setShowExamples] = useState<string | null>(null);
  const [showLinkPicker, setShowLinkPicker] = useState<string | null>(null);
  const [editingFormField, setEditingFormField] = useState<string | null>(null);

  // Enhanced Image Picker with preview, dimensions, alt text
  const ImagePicker = ({ id, label, value, onChange, onUpload, tip }: { 
    id?: string, 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    onUpload: (e: any) => void,
    tip?: string 
  }) => (
    <div className="space-y-2" id={id}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">{label}</label>
        {value && <button onClick={() => onChange('')} className="text-xs text-red-600 hover:text-red-700">Remove</button>}
      </div>
      
      {tip && (
        <p className="text-xs text-neutral-500">{tip}</p>
      )}
      
      {!value ? (
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 hover:bg-neutral-50 hover:border-neutral-400 transition-all group relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={onUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center text-neutral-400 group-hover:text-neutral-600">
            {isUploading ? <Loader2 size={32} className="animate-spin mb-3 text-blue-600" /> : <Upload size={32} className="mb-3" />}
            <span className="text-sm font-medium mb-1">Drop image here or click to upload</span>
            <span className="text-xs text-neutral-400">PNG, JPG up to 5MB</span>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
          <div className="aspect-video relative">
            <img src={value} className="w-full h-full object-cover" alt={label} />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <label className="px-4 py-2 bg-white hover:bg-neutral-100 rounded-lg cursor-pointer text-neutral-900 transition-colors text-sm font-medium flex items-center gap-2 shadow-lg">
                  <Upload size={16} /> Replace
                  <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
               </label>
               <button 
                 onClick={() => onChange('')}
                 className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors text-sm font-medium shadow-lg"
               >
                 Remove
               </button>
            </div>
          </div>
          {/* Alt text input */}
          <div className="p-3 border-t border-neutral-200 bg-white">
            <input 
              type="text" 
              value={data[`${id?.replace('editor-field-', '')}Alt`] || ''}
              onChange={(e) => updateField(`${id?.replace('editor-field-', '')}Alt`, e.target.value)}
              className="w-full p-2 bg-neutral-50 text-sm text-neutral-700 rounded-lg border border-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Alt text for accessibility"
            />
          </div>
        </div>
      )}
    </div>
  );

  // Enhanced Rich Text with working formatting
  const RichText = ({ id, label, value, onChange, rows = 3, tip, maxLength, showAI, fieldKey }: { 
    id?: string, 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    rows?: number,
    tip?: string,
    maxLength?: number,
    showAI?: boolean,
    fieldKey?: string
  }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      setLocalValue(value || '');
    }, [value]);

    const applyFormat = (format: 'bold' | 'italic' | 'link') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = localValue.substring(start, end);

      let newText = '';
      let cursorOffset = 0;

      switch (format) {
        case 'bold':
          newText = localValue.substring(0, start) + `**${selectedText}**` + localValue.substring(end);
          cursorOffset = selectedText ? 0 : 2;
          break;
        case 'italic':
          newText = localValue.substring(0, start) + `*${selectedText}*` + localValue.substring(end);
          cursorOffset = selectedText ? 0 : 1;
          break;
        case 'link':
          if (selectedText) {
            newText = localValue.substring(0, start) + `[${selectedText}](url)` + localValue.substring(end);
          } else {
            newText = localValue.substring(0, start) + `[link text](url)` + localValue.substring(end);
          }
          break;
      }

      setLocalValue(newText);
      onChange(newText);

      // Restore focus
      setTimeout(() => {
        textarea.focus();
        if (format === 'link') {
          textarea.setSelectionRange(start + (selectedText ? selectedText.length + 3 : 12), start + (selectedText ? selectedText.length + 6 : 15));
        }
      }, 0);
    };

    return (
      <div className="space-y-2" id={id}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">{label}</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-neutral-100 border border-neutral-200 rounded p-0.5">
              <button 
                onClick={() => applyFormat('bold')} 
                className="p-1.5 hover:bg-white rounded text-neutral-500 hover:text-neutral-900 transition-colors"
                title="Bold"
              >
                <Bold size={14} />
              </button>
              <button 
                onClick={() => applyFormat('italic')} 
                className="p-1.5 hover:bg-white rounded text-neutral-500 hover:text-neutral-900 transition-colors"
                title="Italic"
              >
                <Italic size={14} />
              </button>
              <button 
                onClick={() => applyFormat('link')} 
                className="p-1.5 hover:bg-white rounded text-neutral-500 hover:text-neutral-900 transition-colors"
                title="Link"
              >
                <LinkIcon size={14} />
              </button>
            </div>
            {showAI && fieldKey && (
              <button 
                onClick={() => generateAIContent(fieldKey)}
                disabled={isGeneratingAI === fieldKey}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
              >
                {isGeneratingAI === fieldKey ? (
                  <><Loader2 size={12} className="animate-spin" /> Writing...</>
                ) : (
                  <><Sparkles size={12} /> AI Write</>
                )}
              </button>
            )}
          </div>
        </div>
        {tip && (
          <p className="text-xs text-neutral-500">{tip}</p>
        )}
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full p-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all placeholder:text-neutral-400"
          rows={rows}
          maxLength={maxLength}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
        {maxLength && (
          <div className={`text-xs text-right ${(localValue?.length || 0) > maxLength * 0.9 ? 'text-amber-600' : 'text-neutral-400'}`}>
            {localValue?.length || 0}/{maxLength}
          </div>
        )}
      </div>
    );
  };

  // Enhanced Input with tips, examples, and character count
  const Input = ({ label, value, onChange, id, fieldKey, showAI = false, maxLength, placeholder, tip, examples }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    id?: string,
    fieldKey?: string,
    showAI?: boolean,
    maxLength?: number,
    placeholder?: string,
    tip?: string,
    examples?: string[]
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">{label}</label>
        <div className="flex items-center gap-2">
          {examples && examples.length > 0 && (
            <button 
              onClick={() => setShowExamples(showExamples === fieldKey ? null : fieldKey || null)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Examples
            </button>
          )}
          {showAI && fieldKey && (
            <button 
              onClick={() => generateAIContent(fieldKey)}
              disabled={isGeneratingAI === fieldKey}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
            >
              {isGeneratingAI === fieldKey ? (
                <><Loader2 size={12} className="animate-spin" /> Writing...</>
              ) : (
                <><Sparkles size={12} /> AI Write</>
              )}
            </button>
          )}
        </div>
      </div>
      {tip && (
        <p className="text-xs text-neutral-500">{tip}</p>
      )}
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="w-full p-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-400"
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
      />
      {/* Examples dropdown */}
      {showExamples === fieldKey && examples && (
        <div className="bg-white border border-neutral-200 rounded-lg p-2 space-y-1 shadow-lg">
          <p className="text-xs text-neutral-500 mb-2 px-2">Click to use:</p>
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => {
                onChange(example);
                setShowExamples(null);
              }}
              className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}
      {maxLength && (
        <div className={`text-xs text-right ${(value?.length || 0) > maxLength * 0.9 ? 'text-amber-600' : 'text-neutral-400'}`}>
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );

  // Smart Link Selector with page suggestions
  const LinkSelector = ({ label, value, onChange, id, placeholder }: {
    label: string,
    value: string,
    onChange: (val: string) => void,
    id?: string,
    placeholder?: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowLinkPicker(id || 'link')}
          className="w-full p-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-400 pr-10"
          placeholder={placeholder || '/page or https://...'}
        />
        <button 
          onClick={() => setShowLinkPicker(showLinkPicker === id ? null : (id || 'link'))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      
      {showLinkPicker === (id || 'link') && (
        <div className="bg-white border border-neutral-200 rounded-lg p-2 space-y-1 shadow-lg">
          <p className="text-xs text-neutral-500 px-2 py-1 font-medium">Internal Pages</p>
          <button
            onClick={() => { onChange('/'); setShowLinkPicker(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
          >
            <Home size={14} /> Home Page
          </button>
          <button
            onClick={() => { onChange('/shop'); setShowLinkPicker(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
          >
            <ShoppingBag size={14} /> Shop / Products
          </button>
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => { onChange(`/${page.slug}`); setShowLinkPicker(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            >
              <FileText size={14} /> {page.name}
            </button>
          ))}
          <div className="border-t border-neutral-200 mt-2 pt-2">
            <p className="text-xs text-neutral-500 px-2 py-1 font-medium">Scroll To Section</p>
            <button
              onClick={() => { onChange('#contact'); setShowLinkPicker(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            >
              <Hash size={14} /> Contact Section
            </button>
            <button
              onClick={() => { onChange('#products'); setShowLinkPicker(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            >
              <Hash size={14} /> Products Section
            </button>
          </div>
          <div className="border-t border-neutral-200 mt-2 pt-2">
            <p className="text-xs text-neutral-500 px-2 py-1 font-medium">External Link</p>
            <p className="text-xs text-neutral-400 px-2 py-1">Type full URL above (https://...)</p>
          </div>
        </div>
      )}
    </div>
  );

  // Form Builder Component
  const FormBuilder = ({ value, onChange }: { value: FormFieldItem[], onChange: (fields: FormFieldItem[]) => void }) => {
    const fields: FormFieldItem[] = value || DEFAULT_FORM_FIELDS;
    const [addingField, setAddingField] = useState(false);

    const addField = (type: string) => {
      const newField: FormFieldItem = {
        id: Date.now().toString(),
        type: type as FormFieldItem['type'],
        label: FORM_FIELD_TYPES.find(t => t.value === type)?.label || 'Field',
        placeholder: '',
        required: false,
      };
      onChange([...fields, newField]);
      setAddingField(false);
    };

    const updateFormField = (id: string, updates: Partial<FormFieldItem>) => {
      onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeFormField = (id: string) => {
      onChange(fields.filter(f => f.id !== id));
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
      const newFields = [...fields];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= fields.length) return;
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      onChange(newFields);
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">Form Fields</label>
          <button
            onClick={() => setAddingField(!addingField)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={14} /> Add Field
          </button>
        </div>

        {/* Field type selector */}
        {addingField && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 shadow-sm">
            <p className="text-xs text-neutral-600 mb-3 font-medium">Choose field type:</p>
            <div className="grid grid-cols-2 gap-2">
              {FORM_FIELD_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => addField(type.value)}
                  className="flex items-center gap-2 p-2.5 text-sm text-neutral-700 hover:bg-white hover:border-neutral-300 rounded-lg border border-neutral-200 transition-colors"
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Field list */}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div 
              key={field.id}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 group"
            >
              {editingFormField === field.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900"
                    placeholder="Field label"
                  />
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700"
                    placeholder="Placeholder text"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-neutral-600">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                        className="rounded border-neutral-300"
                      />
                      Required field
                    </label>
                    <button
                      onClick={() => setEditingFormField(null)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => moveField(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                    >
                      <ChevronLeft size={12} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => moveField(index, 'down')}
                      disabled={index === fields.length - 1}
                      className="p-0.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                    >
                      <ChevronRight size={12} className="rotate-90" />
                    </button>
                  </div>
                  <GripVertical size={14} className="text-neutral-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-900">{field.label}</span>
                      {field.required && <span className="text-xs text-red-600">Required</span>}
                    </div>
                    <span className="text-xs text-neutral-500">{FORM_FIELD_TYPES.find(t => t.value === field.type)?.label}</span>
                  </div>
                  <button
                    onClick={() => setEditingFormField(field.id)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Type size={14} />
                  </button>
                  <button
                    onClick={() => removeFormField(field.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Toggle Component
  const Toggle = ({ label, value, onChange, tip }: { label: string, value: boolean, onChange: (val: boolean) => void, tip?: string }) => (
    <div className="flex items-center justify-between py-3 px-1">
      <div>
        <label className="text-sm font-medium text-neutral-700">{label}</label>
        {tip && <p className="text-xs text-neutral-500 mt-0.5">{tip}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-neutral-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  // Number Input
  const NumberInput = ({ label, value, onChange, placeholder, tip, min = 1, max = 100 }: {
    label: string,
    value: number,
    onChange: (val: number) => void,
    placeholder?: string,
    tip?: string,
    min?: number,
    max?: number
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      {tip && (
        <p className="text-xs text-neutral-500">{tip}</p>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        min={min}
        max={max}
        className="w-full p-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-400"
        placeholder={placeholder}
      />
    </div>
  );

  // Select Dropdown
  const Select = ({ label, value, onChange, options, tip }: {
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: { value: string, label: string }[],
    tip?: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      {tip && (
        <p className="text-xs text-neutral-500">{tip}</p>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  // --- RENDERERS ---

  if (showLayoutPicker) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <button onClick={() => setShowLayoutPicker(false)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold text-neutral-900">Choose Layout</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                onSwitchLayout(opt.id);
                setShowLayoutPicker(false);
              }}
              className={`text-left border rounded-lg overflow-hidden transition-all group ${variant === opt.id ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'}`}
            >
              <div className={`aspect-video flex items-center justify-center transition-colors ${variant === opt.id ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600'}`}>
                <Layout size={24} />
              </div>
              <div className="p-3">
                <div className={`font-medium text-sm mb-1 transition-colors ${variant === opt.id ? 'text-blue-700' : 'text-neutral-700 group-hover:text-neutral-900'}`}>{opt.name}</div>
                <div className="text-xs text-neutral-500 line-clamp-2">{opt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (activeItemIndex !== null && data.items && data.items[activeItemIndex]) {
    const item = data.items[activeItemIndex];
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <button onClick={() => setActiveItemIndex(null)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold text-neutral-900">Edit Item {activeItemIndex + 1}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <Input 
            label="Title" 
            value={item.title} 
            onChange={(val) => updateItem(activeItemIndex, 'title', val)} 
          />
          <RichText 
            label="Description" 
            value={item.description} 
            onChange={(val) => updateItem(activeItemIndex, 'description', val)} 
          />
          <ImagePicker 
            label="Image" 
            value={item.image} 
            onChange={(val) => updateItem(activeItemIndex, 'image', val)}
            onUpload={(e) => handleImageUpload(e, 'image', activeItemIndex)}
          />
          <Input 
            label="Link URL" 
            value={item.link} 
            onChange={(val) => updateItem(activeItemIndex, 'link', val)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-neutral-900">{sectionConfig.title}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{sectionConfig.description}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowLayoutPicker(true)}
          className="w-full flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-neutral-600 group-hover:text-neutral-900 transition-colors shadow-sm border border-neutral-200">
              <Layout size={16} />
            </div>
            <div className="text-left">
              <span className="font-medium text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors block">{currentOption?.name || 'Select Layout'}</span>
              <span className="text-xs text-neutral-400">Click to change layout</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
        </button>
      </div>

      {/* Group Tabs */}
      {sectionConfig.groups.length > 1 && (
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-2">
          {sectionConfig.groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                activeGroup === group.id 
                  ? 'text-blue-600 border-blue-600 bg-white' 
                  : 'text-neutral-500 border-transparent hover:text-neutral-700'
              }`}
            >
              {group.icon}
              {group.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content - Dynamic Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Render section-specific fields for active group */}
        {sectionConfig.fields
          .filter(field => field.group === activeGroup)
          .map(field => {
            const fieldValue = data[field.key];
            const fieldId = `editor-field-${field.key}`;

            switch (field.type) {
              case 'text':
                return (
                  <React.Fragment key={field.key}>
                    <Input
                      id={fieldId}
                      label={field.label}
                      value={fieldValue || ''}
                      onChange={(val) => updateField(field.key, val)}
                      fieldKey={field.key}
                      showAI={field.showAI}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      tip={field.tip}
                      examples={field.examples}
                    />
                  </React.Fragment>
                );

              case 'richtext':
                return (
                  <React.Fragment key={field.key}>
                    <RichText
                      id={fieldId}
                      label={field.label}
                      value={fieldValue || ''}
                      onChange={(val) => updateField(field.key, val)}
                      fieldKey={field.key}
                      showAI={field.showAI}
                      maxLength={field.maxLength}
                      tip={field.tip}
                    />
                  </React.Fragment>
                );

              case 'image':
                return (
                  <React.Fragment key={field.key}>
                    <ImagePicker
                      id={fieldId}
                      label={field.label}
                      value={fieldValue || ''}
                      onChange={(val) => updateField(field.key, val)}
                      onUpload={(e) => handleImageUpload(e, field.key)}
                      tip={field.tip}
                    />
                  </React.Fragment>
                );

              case 'linkSelector':
                return (
                  <React.Fragment key={field.key}>
                    <LinkSelector
                      id={fieldId}
                      label={field.label}
                      value={fieldValue || ''}
                      onChange={(val) => updateField(field.key, val)}
                      placeholder={field.placeholder}
                    />
                  </React.Fragment>
                );

              case 'select':
                return (
                  <React.Fragment key={field.key}>
                    <Select
                      label={field.label}
                      value={fieldValue || field.defaultValue || ''}
                      onChange={(val) => updateField(field.key, val)}
                      options={field.options || []}
                      tip={field.tip}
                    />
                  </React.Fragment>
                );

              case 'number':
                return (
                  <React.Fragment key={field.key}>
                    <NumberInput
                      label={field.label}
                      value={fieldValue || field.defaultValue || 0}
                      onChange={(val) => updateField(field.key, val)}
                      placeholder={field.placeholder}
                      tip={field.tip}
                    />
                  </React.Fragment>
                );

              case 'toggle':
                return (
                  <React.Fragment key={field.key}>
                    <Toggle
                      label={field.label}
                      value={fieldValue !== undefined ? fieldValue : field.defaultValue}
                      onChange={(val) => updateField(field.key, val)}
                      tip={field.tip}
                    />
                  </React.Fragment>
                );

              case 'url':
                return (
                  <React.Fragment key={field.key}>
                    <Input
                      id={fieldId}
                      label={field.label}
                      value={fieldValue || ''}
                      onChange={(val) => updateField(field.key, val)}
                      placeholder={field.placeholder}
                      tip={field.tip}
                    />
                  </React.Fragment>
                );

              case 'formBuilder':
                return (
                  <React.Fragment key={field.key}>
                    <FormBuilder
                      value={fieldValue || DEFAULT_FORM_FIELDS}
                      onChange={(val) => updateField(field.key, val)}
                    />
                  </React.Fragment>
                );

              default:
                return null;
            }
          })}

        {/* Items List (Drill Down) - for sections with items */}
        {data.items && activeGroup === 'content' && (
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <List size={14} /> Items ({data.items.length})
              </h4>
              <button onClick={addItem} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 transition-colors">
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {data.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <button 
                    onClick={() => setActiveItemIndex(i)}
                    className="flex-1 flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-lg text-left transition-all"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-neutral-200 flex items-center justify-center text-neutral-400">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate text-neutral-900">{item.title || 'Untitled'}</div>
                      <div className="text-xs text-neutral-500 truncate">Item {i + 1}</div>
                    </div>
                    <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </button>
                  <button onClick={() => removeItem(i)} className="p-2 text-neutral-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Settings - always available */}
        {activeGroup === sectionConfig.groups[sectionConfig.groups.length - 1]?.id && (
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <h4 className="text-sm font-medium text-neutral-700 flex items-center gap-2 mb-4">
              <Palette size={14} /> Design Overrides
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Background"
                value={data.style?.background || 'auto'}
                onChange={(val) => updateStyle('background', val)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'white', label: 'White' },
                  { value: 'black', label: 'Black' },
                  { value: 'accent', label: 'Accent' },
                  { value: 'gradient', label: 'Gradient' },
                ]}
              />
              <Select
                label="Padding"
                value={data.style?.padding || 'auto'}
                onChange={(val) => updateStyle('padding', val)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 's', label: 'Small' },
                  { value: 'm', label: 'Medium' },
                  { value: 'l', label: 'Large' },
                  { value: 'xl', label: 'Extra Large' },
                ]}
              />
            </div>

            <Select
              label="Text Alignment"
              value={data.style?.alignment || 'auto'}
              onChange={(val) => updateStyle('alignment', val)}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />

            <Select
              label="Max Width"
              value={data.style?.maxWidth || 'auto'}
              onChange={(val) => updateStyle('maxWidth', val)}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'narrow', label: 'Narrow (800px)' },
                { value: 'medium', label: 'Medium (1200px)' },
                { value: 'wide', label: 'Wide (1400px)' },
                { value: 'full', label: 'Full Width' },
              ]}
            />
          </div>
        )}

      </div>
    </div>
  );
};
