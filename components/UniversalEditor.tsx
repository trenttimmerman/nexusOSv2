import React, { useState } from 'react';
import { ChevronLeft, Layout, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, Palette, Plus, Trash2, ChevronRight, ArrowLeft, Check, Upload, X, Bold, Italic, Link as LinkIcon, List, Loader2, Sparkles, Wand2, Info, ChevronDown, GripVertical, Mail, Phone, MessageSquare, User, FileText, Hash, Calendar, CheckSquare, ToggleLeft, Grid, Columns, Filter, SortAsc, Lightbulb, ExternalLink, Home, ShoppingBag, Users, HelpCircle, Zap, AlertCircle } from 'lucide-react';
import { UniversalSectionData } from '../lib/smartMapper';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabaseClient';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI
const genAI = import.meta.env.VITE_GEMINI_API_KEY ? new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

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
  'system-contact': CONTACT_OPTIONS,
  'system-layout': LAYOUT_OPTIONS,
  'system-collection': COLLECTION_OPTIONS,
  'system-gallery': GALLERY_OPTIONS,
  'system-social': SOCIAL_OPTIONS,
  'system-scroll': SCROLL_OPTIONS,
  'system-grid': PRODUCT_CARD_OPTIONS,
  'system-rich-text': RICH_TEXT_OPTIONS,
  'system-email': EMAIL_SIGNUP_OPTIONS,
  'system-collapsible': COLLAPSIBLE_OPTIONS,
  'system-logo-list': LOGO_LIST_OPTIONS,
  'system-promo': PROMO_BANNER_OPTIONS,
};

// Hero variant field visibility - defines which fields appear for each hero style
const HERO_VARIANT_FIELDS: Record<string, string[]> = {
  impact: ['heading', 'badge', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink', 'image', 'overlayOpacity'],
  split: ['heading', 'subheading', 'buttonText', 'buttonLink', 'image', 'overlayOpacity'],
  kinetik: ['heading', 'buttonText', 'buttonLink', 'marqueeText', 'image', 'overlayOpacity'],
  grid: ['heading', 'subheading', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink', 'imageBadge', 'featureCardTitle', 'featureCardSubtitle', 'image', 'sideImage', 'overlayOpacity'],
  typographic: ['heading', 'subheading', 'topBadge', 'link1Label', 'link1Url', 'link1Image', 'link2Label', 'link2Url', 'link2Image', 'link3Label', 'link3Url', 'link3Image'],
};

// Product grid variant field visibility
const GRID_VARIANT_FIELDS: Record<string, string[]> = {
  classic: ['heading', 'subheading', 'productSource', 'productCategory', 'productCollection', 'productTag', 'selectedProducts', 'columns', 'limit', 'sortBy', 'showPrices', 'showQuickAdd', 'buttonText', 'buttonLink'],
  industrial: ['heading', 'subheading', 'productSource', 'productCategory', 'productCollection', 'productTag', 'selectedProducts', 'columns', 'limit', 'sortBy', 'showPrices', 'showQuickAdd', 'showStock', 'showSku', 'buttonText', 'buttonLink'],
  focus: ['heading', 'subheading', 'productSource', 'productCategory', 'productCollection', 'productTag', 'selectedProducts', 'columns', 'limit', 'sortBy', 'showPrices', 'showQuickAdd', 'buttonText', 'buttonLink'],
  hype: ['heading', 'subheading', 'productSource', 'productCategory', 'productCollection', 'productTag', 'selectedProducts', 'columns', 'limit', 'sortBy', 'showPrices', 'showQuickAdd', 'showBadges', 'buttonText', 'buttonLink'],
  magazine: ['heading', 'subheading', 'productSource', 'productCategory', 'productCollection', 'productTag', 'selectedProducts', 'columns', 'limit', 'sortBy', 'showPrices', 'showQuickAdd', 'buttonText', 'buttonLink'],
  glass: ['heading', 'subheading', 'productSource', 'productCategory', 'productCollection', 'productTag', 'selectedProducts', 'columns', 'limit', 'sortBy', 'showPrices', 'showQuickAdd', 'buttonText', 'buttonLink'],
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
      // === CONTENT GROUP ===
      { key: 'heading', label: 'Headline', type: 'text', group: 'content', maxLength: 60, showAI: true, 
        placeholder: 'Your main headline (30-60 chars)', 
        tip: 'Start with action verbs, focus on benefits. Keep under 60 characters.',
        examples: ['Transform Your Morning Routine', 'Premium Quality, Everyday Prices', 'Join 10,000+ Happy Customers'],
        defaultValue: 'REDEFINE REALITY' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', maxLength: 160, showAI: true,
        placeholder: 'Supporting text that expands on your headline',
        tip: 'Best at 120-160 characters. Explain the value proposition.',
        defaultValue: 'Elevating the standard of modern living through curated design.' },
      { key: 'badge', label: 'Badge/Label', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., ✨ New Collection, 🔥 Limited Time',
        examples: ['✨ New Release', '🔥 Best Sellers Inside', '👗 New Season Arrivals'],
        defaultValue: 'New Collection 2024' },
      { key: 'topBadge', label: 'Top Badge', type: 'text', group: 'content', showAI: true,
        placeholder: 'Badge text above headline',
        tip: 'Small text badge that appears above your headline.',
        defaultValue: 'Premium Collection' },
      { key: 'imageBadge', label: 'Image Badge', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Best Seller, New Arrival',
        tip: 'Badge that overlays on the main image.',
        defaultValue: 'Featured' },
      { key: 'featureCardTitle', label: 'Feature Card Title', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Free Shipping',
        tip: 'Title for the promotional feature card.',
        defaultValue: 'Free Shipping' },
      { key: 'featureCardSubtitle', label: 'Feature Card Subtitle', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., On orders over $50',
        tip: 'Subtitle text for the feature card.',
        defaultValue: 'On orders over $50' },
      { key: 'marqueeText', label: 'Scrolling Marquee', type: 'text', group: 'content',
        placeholder: 'Text that scrolls across the section',
        defaultValue: 'DISCOVER THE DIFFERENCE • ELEVATE YOUR STYLE •' },
      
      // === BUTTONS GROUP ===
      { key: 'buttonText', label: 'Primary Button', type: 'text', group: 'buttons', showAI: true,
        placeholder: 'e.g., Shop Now, Get Started',
        examples: ['Shop Now', 'Get Started', 'Learn More', 'Browse Collection'],
        defaultValue: 'Shop Now' },
      { key: 'buttonLink', label: 'Primary Button Link', type: 'linkSelector', group: 'buttons',
        placeholder: '/shop or https://...',
        defaultValue: '/shop' },
      { key: 'secondaryButtonText', label: 'Secondary Button', type: 'text', group: 'buttons',
        placeholder: 'e.g., Learn More (optional)',
        defaultValue: 'Learn More' },
      { key: 'secondaryButtonLink', label: 'Secondary Button Link', type: 'linkSelector', group: 'buttons',
        placeholder: '/about or https://...',
        defaultValue: '/about' },
      // Typographic hero links
      { key: 'link1Label', label: 'Category 1 Label', type: 'text', group: 'buttons',
        placeholder: 'e.g., New Arrivals',
        tip: 'First category link label.',
        defaultValue: 'New Arrivals' },
      { key: 'link1Url', label: 'Category 1 Link', type: 'linkSelector', group: 'buttons',
        placeholder: '/new-arrivals',
        defaultValue: '/collections/new' },
      { key: 'link2Label', label: 'Category 2 Label', type: 'text', group: 'buttons',
        placeholder: 'e.g., Best Sellers',
        defaultValue: 'Best Sellers' },
      { key: 'link2Url', label: 'Category 2 Link', type: 'linkSelector', group: 'buttons',
        placeholder: '/best-sellers',
        defaultValue: '/collections/best-sellers' },
      { key: 'link3Label', label: 'Category 3 Label', type: 'text', group: 'buttons',
        placeholder: 'e.g., Sale Items',
        defaultValue: 'Sale Items' },
      { key: 'link3Url', label: 'Category 3 Link', type: 'linkSelector', group: 'buttons',
        placeholder: '/sale',
        defaultValue: '/collections/sale' },
      
      // === MEDIA GROUP ===
      { key: 'image', label: 'Background Image', type: 'image', group: 'media',
        tip: 'Recommended: 1920x1080px, under 500KB. High contrast works best.' },
      { key: 'sideImage', label: 'Side Image', type: 'image', group: 'media',
        tip: 'Secondary image for grid-style heroes.' },
      { key: 'link1Image', label: 'Category 1 Image', type: 'image', group: 'media',
        tip: 'Image for the first category link.' },
      { key: 'link2Image', label: 'Category 2 Image', type: 'image', group: 'media',
        tip: 'Image for the second category link.' },
      { key: 'link3Image', label: 'Category 3 Image', type: 'image', group: 'media',
        tip: 'Image for the third category link.' },
      { key: 'overlayOpacity', label: 'Image Darkness', type: 'select', group: 'media',
        tip: 'How dark the overlay on the background image should be.',
        options: [
          { value: '0', label: 'None (0%)' },
          { value: '0.1', label: 'Very Light (10%)' },
          { value: '0.2', label: 'Light (20%)' },
          { value: '0.3', label: 'Medium Light (30%)' },
          { value: '0.4', label: 'Medium (40%)' },
          { value: '0.5', label: 'Medium Dark (50%)' },
          { value: '0.6', label: 'Dark (60%)' },
          { value: '0.7', label: 'Very Dark (70%)' },
        ],
        defaultValue: '0.4' },
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
        examples: ['Get in Touch', 'Let\'s Talk', 'How Can We Help?', 'Send Us a Message'],
        defaultValue: 'Get in Touch' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Brief description of what visitors can expect',
        defaultValue: 'Have a question or want to work together? Drop us a message and we\'ll get back to you within 24 hours.' },
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
        placeholder: 'hello@yourdomain.com',
        defaultValue: 'hello@yourstore.com' },
      { key: 'contactPhone', label: 'Display Phone', type: 'text', group: 'info',
        placeholder: '+1 (555) 123-4567',
        defaultValue: '+1 (555) 123-4567' },
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
        examples: ['Featured Products', 'New Arrivals', 'Best Sellers', 'Shop the Collection'],
        defaultValue: 'Featured Products' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Brief description of the products',
        defaultValue: 'Discover our handpicked selection of premium products.' },
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
        examples: ['Latest Articles', 'From the Blog', 'Stories & Updates', 'Read More'],
        defaultValue: 'From the Blog' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        defaultValue: 'Insights, stories, and updates from our team.' },
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
        placeholder: 'e.g., Our Gallery, Photo Collection',
        defaultValue: 'Gallery' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        defaultValue: 'A collection of our favorite moments and creations.' },
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
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        defaultValue: 'Watch the Story' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        defaultValue: 'See what makes us different.' },
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
        examples: ['Join Our Newsletter', 'Stay in the Loop', 'Get 10% Off', 'Subscribe for Updates'],
        defaultValue: 'Join Our Newsletter' },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Brief description of what subscribers will receive',
        defaultValue: 'Subscribe to get special offers, free giveaways, and updates on new arrivals.' },
      { key: 'buttonText', label: 'Button Text', type: 'text', group: 'form',
        placeholder: 'Subscribe', defaultValue: 'Subscribe' },
      { key: 'successMessage', label: 'Success Message', type: 'text', group: 'form', showAI: true,
        placeholder: 'Thanks for subscribing!', defaultValue: 'Thanks for subscribing!' },
      { key: 'incentiveText', label: 'Incentive Text', type: 'text', group: 'content',
        placeholder: 'e.g., Get 10% off your first order',
        tip: 'Optional incentive to encourage signups',
        defaultValue: 'Get 10% off your first order' },
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
        placeholder: 'Section heading',
        defaultValue: 'About Us' },
      { key: 'content', label: 'Content', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Your main content text...',
        tip: 'Use formatting tools to style your text',
        defaultValue: 'Add your content here. Use the rich text editor to format your text with headings, lists, and links.' },
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
    title: 'Scrolling Section',
    description: 'Animated scrolling content like marquees and tickers',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'logos', label: 'Logos', icon: <ImageIcon size={12} /> },
      { id: 'style', label: 'Style', icon: <Palette size={12} /> },
    ],
    fields: [
      { key: 'text', label: 'Ticker Text', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., FREE SHIPPING • NEW ARRIVALS • LIMITED TIME OFFER',
        tip: 'Use • or | to separate items. Text will scroll continuously.',
        examples: ['FREE SHIPPING WORLDWIDE • NEW COLLECTION OUT NOW', '🔥 SALE ENDS SOON • UP TO 50% OFF', '✨ PREMIUM QUALITY • HANDCRAFTED'] },
      { key: 'logos', label: 'Logo URLs', type: 'text', group: 'logos',
        placeholder: 'Comma-separated image URLs',
        tip: 'Add logo image URLs separated by commas. Logos will scroll horizontally.' },
      { key: 'speed', label: 'Scroll Speed', type: 'select', group: 'style',
        options: [
          { value: 'slow', label: 'Slow' },
          { value: 'normal', label: 'Normal' },
          { value: 'fast', label: 'Fast' },
        ],
        defaultValue: 'normal' },
      { key: 'pauseOnHover', label: 'Pause on Hover', type: 'toggle', group: 'style', defaultValue: true,
        tip: 'Animation pauses when user hovers over the section' },
    ]
  },

  'system-grid': {
    title: 'Product Grid',
    description: 'Display products in a customizable grid layout',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'products', label: 'Products', icon: <ShoppingBag size={12} /> },
      { id: 'settings', label: 'Layout', icon: <Grid size={12} /> },
      { id: 'style', label: 'Style', icon: <Palette size={12} /> },
    ],
    fields: [
      // === CONTENT GROUP ===
      { key: 'heading', label: 'Section Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Featured Products, Best Sellers',
        examples: ['Featured Products', 'New Arrivals', 'Best Sellers', 'Shop the Collection'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true,
        placeholder: 'Optional description for the grid section' },
      { key: 'buttonText', label: 'View All Button', type: 'text', group: 'content',
        placeholder: 'View All Products' },
      { key: 'buttonLink', label: 'View All Link', type: 'linkSelector', group: 'content',
        placeholder: '/shop' },
      
      // === PRODUCTS GROUP ===
      { key: 'productSource', label: 'Product Source', type: 'select', group: 'products',
        tip: 'Choose which products to display in this grid',
        options: [
          { value: 'all', label: 'All Products' },
          { value: 'category', label: 'By Category' },
          { value: 'collection', label: 'By Collection' },
          { value: 'tag', label: 'By Tag (Featured, Sale, etc.)' },
          { value: 'manual', label: 'Manual Selection' },
        ],
        defaultValue: 'all' },
      { key: 'productCategory', label: 'Category', type: 'select', group: 'products',
        tip: 'Filter products by category',
        options: [{ value: '', label: 'Select a category...' }] },
      { key: 'productCollection', label: 'Collection', type: 'select', group: 'products',
        tip: 'Show products from a specific collection',
        options: [{ value: '', label: 'Select a collection...' }] },
      { key: 'productTag', label: 'Tag', type: 'select', group: 'products',
        tip: 'Filter products by tag',
        options: [
          { value: '', label: 'Select a tag...' },
          { value: 'featured', label: 'Featured' },
          { value: 'new', label: 'New Arrival' },
          { value: 'sale', label: 'On Sale' },
          { value: 'bestseller', label: 'Best Seller' },
        ] },
      { key: 'selectedProducts', label: 'Select Products', type: 'productSelector', group: 'products',
        tip: 'Manually choose which products to display' },
      { key: 'sortBy', label: 'Sort By', type: 'select', group: 'products',
        options: [
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'name-asc', label: 'Name: A to Z' },
          { value: 'name-desc', label: 'Name: Z to A' },
        ],
        defaultValue: 'newest' },
      
      // === SETTINGS/LAYOUT GROUP ===
      { key: 'columns', label: 'Columns', type: 'select', group: 'settings',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
          { value: '5', label: '5 Columns' },
        ],
        defaultValue: '4' },
      { key: 'limit', label: 'Max Products', type: 'number', group: 'settings',
        placeholder: '8', defaultValue: 8,
        tip: 'Maximum number of products to display' },
      
      // === STYLE GROUP ===
      { key: 'showPrices', label: 'Show Prices', type: 'toggle', group: 'style', defaultValue: true },
      { key: 'showQuickAdd', label: 'Show Quick Add', type: 'toggle', group: 'style', defaultValue: true,
        tip: 'Show add to cart button on hover' },
      { key: 'showStock', label: 'Show Stock Count', type: 'toggle', group: 'style', defaultValue: false,
        tip: 'Display inventory count (Industrial style)' },
      { key: 'showSku', label: 'Show SKU', type: 'toggle', group: 'style', defaultValue: false,
        tip: 'Display product SKU (Industrial style)' },
      { key: 'showBadges', label: 'Show Badges', type: 'toggle', group: 'style', defaultValue: true,
        tip: 'Display New Drop, Low Stock badges (Hype style)' },
    ]
  },

  'system-logo-list': {
    title: 'Logo List',
    description: 'Display partner, client, or brand logos',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'logos', label: 'Logos', icon: <ImageIcon size={12} /> },
      { id: 'style', label: 'Style', icon: <Palette size={12} /> },
    ],
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Trusted By, As Seen In',
        examples: ['Trusted By', 'As Seen In', 'Our Partners', 'Featured In'] },
      { key: 'subheading', label: 'Subheading', type: 'richtext', group: 'content', showAI: true },
      { key: 'grayscale', label: 'Grayscale Logos', type: 'toggle', group: 'style', defaultValue: true,
        tip: 'Display logos in grayscale (color on hover)' },
    ]
  },

  'system-promo': {
    title: 'Promo Banner',
    description: 'Announcement or promotional banner',
    groups: [
      { id: 'content', label: 'Content', icon: <Type size={12} /> },
      { id: 'style', label: 'Style', icon: <Palette size={12} /> },
    ],
    fields: [
      { key: 'text', label: 'Banner Text', type: 'text', group: 'content', showAI: true,
        placeholder: 'e.g., Free shipping on orders over $50!',
        examples: ['🎉 Free shipping on orders over $50!', '⏰ Sale ends tonight!', '✨ New arrivals just dropped'] },
      { key: 'link', label: 'Link URL', type: 'linkSelector', group: 'content',
        placeholder: '/shop' },
      { key: 'linkText', label: 'Link Text', type: 'text', group: 'content',
        placeholder: 'Shop Now' },
      { key: 'dismissible', label: 'Can Dismiss', type: 'toggle', group: 'style', defaultValue: true,
        tip: 'Allow visitors to close the banner' },
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
  products?: { id: string; name: string; image: string; price: number; category: string; tags?: string[] }[];
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
  pages = [],
  products = []
}) => {
  // Get categories and collections from context (avoids prop drilling TDZ issues)
  const { categories, collections } = useData();
  
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<string | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  
  // AI Content Generation (simulated for now - would connect to OpenAI/Claude in production)
  const generateAIContent = async (field: string, context?: string) => {
    setIsGeneratingAI(field);
    
    try {
      if (!genAI) {
        // Fallback to simulated generation if no API key
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
      } else {
        // Real AI generation with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const sectionType = activeSection?.type || 'general';
        const prompt = `You are an expert copywriter for a modern e-commerce platform. 
        Generate a short, compelling ${field} for a ${sectionType} section of a website.
        Context: ${context || 'A professional business website'}
        Field type: ${field}
        Requirements:
        - Compelling and professional
        - Maximum 60 characters for headings
        - Maximum 160 characters for subheadings
        - Just return the text, no quotes or extra commentary.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        updateField(field, text);
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
    } finally {
      setIsGeneratingAI(null);
    }
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
    // Convert overlayOpacity from string to number for hero sections
    let processedValue = value;
    if (key === 'overlayOpacity' && typeof value === 'string') {
      processedValue = parseFloat(value);
    }
    onUpdate({ ...data, [key]: processedValue });
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
  const [showStockPhotos, setShowStockPhotos] = useState<string | null>(null);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [isSearchingStock, setIsSearchingStock] = useState(false);
  const [stockResults, setStockResults] = useState<string[]>([]);
  const [showImageTools, setShowImageTools] = useState<string | null>(null);
  const [openStyleEditors, setOpenStyleEditors] = useState<Set<string>>(new Set());

  // Stock photo search (using Unsplash API - simulated for now)
  const searchStockPhotos = async (query: string) => {
    setIsSearchingStock(true);
    
    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (accessKey) {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${accessKey}`);
        const data = await response.json();
        if (data.results) {
          setStockResults(data.results.map((img: any) => img.urls.regular));
        }
      } else {
        // Improved simulation if no API key
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use predefined relevant images for common searches
        const stockImages: Record<string, string[]> = {
          'hero': [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fit=crop',
          ],
          'product': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1491553895911-0055uj8a866?w=800&q=80&fit=crop',
          ],
          'office': [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800&q=80&fit=crop',
          ],
          'nature': [
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1518173946687-a4c036bc0a04?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80&fit=crop',
          ],
          'food': [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop',
          ],
          'fashion': [
            'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80&fit=crop',
            'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80&fit=crop',
          ],
        };
        
        // Find matching category or use default
        const lowerQuery = query.toLowerCase();
        const matchedKey = Object.keys(stockImages).find(key => lowerQuery.includes(key));
        setStockResults(matchedKey ? stockImages[matchedKey] : stockImages['hero']);
      }
    } catch (error) {
      console.error('Stock Photo Search Error:', error);
    } finally {
      setIsSearchingStock(false);
    }
  };

  // Generate AI alt text
  const generateAltText = async (imageUrl: string, fieldKey: string) => {
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const altTexts = [
      'Professional workspace with modern design elements',
      'High-quality product photography on clean background',
      'Vibrant lifestyle image showcasing brand aesthetics',
      'Team collaboration in contemporary office setting',
      'Stunning visual that captures brand essence',
    ];
    const randomAlt = altTexts[Math.floor(Math.random() * altTexts.length)];
    updateField(`${fieldKey}Alt`, randomAlt);
  };

  // Simple text input with local state to prevent focus loss
  const DebouncedInput = ({ value, onChange, placeholder, className }: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
  }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      setLocalValue(value || '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    };

    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <input 
        type="text" 
        value={localValue}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
      />
    );
  };

  // Enhanced Image Picker with preview, dimensions, alt text, stock photos, AI tools
  const ImagePicker = ({ id, label, value, onChange, onUpload, tip }: { 
    id?: string, 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    onUpload: (e: any) => void,
    tip?: string 
  }) => {
    const fieldKey = id?.replace('editor-field-', '') || '';
    
    return (
    <div className="space-y-2" id={id}>
      <label className="text-xs font-bold uppercase text-neutral-500 flex items-center justify-between">
        {label}
        {value && <button onClick={() => onChange('')} className="text-red-500 hover:text-red-400 text-[10px]">Remove</button>}
      </label>
      
      {tip && (
        <p className="text-[10px] text-neutral-600 flex items-center gap-1">
          <Info size={10} /> {tip}
        </p>
      )}
      
      {!value ? (
        <div className="space-y-3">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-neutral-800 rounded-lg p-6 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all group relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={onUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center text-neutral-500 group-hover:text-neutral-400">
              {isUploading ? <Loader2 size={24} className="animate-spin mb-2" /> : <Upload size={24} className="mb-2" />}
              <span className="text-xs font-medium mb-1">Drop image here or click to upload</span>
              <span className="text-[10px] text-neutral-600">PNG, JPG up to 5MB</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                setShowStockPhotos(showStockPhotos === fieldKey ? null : fieldKey);
                setStockSearchQuery('');
                setStockResults([]);
              }}
              className="flex items-center justify-center gap-2 p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <ImageIcon size={14} /> Stock Photos
            </button>
            <button 
              onClick={() => {
                // Simulate AI image generation prompt
                const prompt = window.prompt('Describe the image you want AI to generate:');
                if (prompt) {
                  // In production, this would call DALL-E/Midjourney API
                  const randomImg = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&q=80&fit=crop`;
                  onChange(randomImg);
                }
              }}
              className="flex items-center justify-center gap-2 p-2 bg-purple-900/30 border border-purple-800/50 rounded-lg text-xs text-purple-400 hover:bg-purple-900/50 transition-colors"
            >
              <Sparkles size={14} /> AI Generate
            </button>
          </div>
          
          {/* Stock Photo Search */}
          {showStockPhotos === fieldKey && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchStockPhotos(stockSearchQuery)}
                  placeholder="Search free photos..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                />
                <button
                  onClick={() => searchStockPhotos(stockSearchQuery)}
                  disabled={isSearchingStock}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {isSearchingStock ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
                </button>
              </div>
              
              {/* Quick categories */}
              <div className="flex flex-wrap gap-1 mb-3">
                {['Hero', 'Product', 'Office', 'Nature', 'Food', 'Fashion'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setStockSearchQuery(cat); searchStockPhotos(cat); }}
                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] text-neutral-400"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Results grid */}
              {stockResults.length > 0 && (
                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                  {stockResults.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onChange(url);
                        setShowStockPhotos(null);
                      }}
                      className="aspect-square rounded-lg overflow-hidden border border-neutral-800 hover:border-blue-500 transition-colors"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              {stockResults.length === 0 && !isSearchingStock && stockSearchQuery && (
                <p className="text-xs text-neutral-500 text-center py-4">No results. Try a different search.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative group rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
          <div className="aspect-video relative">
            <img src={value} className="w-full h-full object-cover" alt={label} />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <label className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer text-white backdrop-blur-sm transition-colors text-xs font-medium flex items-center gap-2">
                  <Upload size={14} /> Replace
                  <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
               </label>
               <button 
                 onClick={() => setShowImageTools(showImageTools === fieldKey ? null : fieldKey)}
                 className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors text-xs font-medium flex items-center gap-2"
               >
                 <Wand2 size={14} /> Tools
               </button>
               <button 
                 onClick={() => onChange('')}
                 className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 backdrop-blur-sm transition-colors text-xs font-medium"
               >
                 Remove
               </button>
            </div>
          </div>
          
          {/* Image Tools Panel */}
          {showImageTools === fieldKey && (
            <div className="p-3 border-t border-neutral-800 bg-neutral-900 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">AI Image Tools</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-300 transition-colors">
                  <Sparkles size={12} /> Enhance
                </button>
                <button className="flex items-center gap-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-300 transition-colors">
                  <Wand2 size={12} /> Remove BG
                </button>
              </div>
            </div>
          )}
          
          {/* Alt text input with AI generation */}
          <div className="p-2 border-t border-neutral-800">
            <div className="flex gap-2">
              <DebouncedInput 
                value={data[`${fieldKey}Alt`] || ''}
                onChange={(val) => updateField(`${fieldKey}Alt`, val)}
                className="flex-1 p-2 bg-neutral-900 text-xs text-neutral-400 rounded border border-neutral-800 focus:outline-none focus:border-blue-500"
                placeholder="Alt text for accessibility"
              />
              <button
                onClick={() => generateAltText(value, fieldKey)}
                className="px-2 py-1 text-purple-400 hover:text-purple-300 text-[10px] font-bold flex items-center gap-1"
                title="Generate alt text with AI"
              >
                <Sparkles size={10} /> AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };

  // Text Style Editor - collapsible panel for font size and color
  interface TextStyle {
    fontSize?: string;
    color?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
  }
  
  const TextStyleEditor = ({ style, onChange, isOpen, onToggle }: {
    style?: TextStyle;
    onChange: (style: TextStyle) => void;
    isOpen: boolean;
    onToggle: () => void;
  }) => {
    const currentStyle = style || {};
    
    const fontSizes = [
      { value: '0.75rem', label: 'XS' },
      { value: '0.875rem', label: 'SM' },
      { value: '1rem', label: 'Base' },
      { value: '1.125rem', label: 'LG' },
      { value: '1.25rem', label: 'XL' },
      { value: '1.5rem', label: '2XL' },
      { value: '1.875rem', label: '3XL' },
      { value: '2.25rem', label: '4XL' },
      { value: '3rem', label: '5XL' },
      { value: '3.75rem', label: '6XL' },
      { value: '4.5rem', label: '7XL' },
      { value: '6rem', label: '8XL' },
    ];

    const fontWeights = [
      { value: '300', label: 'Light' },
      { value: '400', label: 'Normal' },
      { value: '500', label: 'Medium' },
      { value: '600', label: 'Semibold' },
      { value: '700', label: 'Bold' },
      { value: '800', label: 'Extra Bold' },
    ];

    return (
      <div className="mt-2">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <Palette size={10} />
          <span>Style Options</span>
          <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="mt-2 p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-500 font-medium">Font Size</label>
              <select
                value={currentStyle.fontSize || ''}
                onChange={(e) => onChange({ ...currentStyle, fontSize: e.target.value || undefined })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="">Default</option>
                {fontSizes.map(size => (
                  <option key={size.value} value={size.value}>{size.label} ({size.value})</option>
                ))}
              </select>
            </div>
            
            {/* Font Weight */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-500 font-medium">Font Weight</label>
              <select
                value={currentStyle.fontWeight || ''}
                onChange={(e) => onChange({ ...currentStyle, fontWeight: e.target.value || undefined })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="">Default</option>
                {fontWeights.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </div>
            
            {/* Text Color */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-500 font-medium">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyle.color || '#ffffff'}
                  onChange={(e) => onChange({ ...currentStyle, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-neutral-700 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={currentStyle.color || ''}
                  onChange={(e) => onChange({ ...currentStyle, color: e.target.value || undefined })}
                  className="flex-1 px-2 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white focus:border-blue-500 outline-none font-mono"
                  placeholder="#ffffff or inherit"
                />
                {currentStyle.color && (
                  <button
                    onClick={() => onChange({ ...currentStyle, color: undefined })}
                    className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                    title="Reset to default"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Text Alignment */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-500 font-medium">Alignment</label>
              <div className="flex gap-1">
                {[
                  { value: 'left', icon: <AlignLeft size={14} /> },
                  { value: 'center', icon: <AlignCenter size={14} /> },
                  { value: 'right', icon: <AlignRight size={14} /> },
                ].map(align => (
                  <button
                    key={align.value}
                    onClick={() => onChange({ ...currentStyle, textAlign: align.value as 'left' | 'center' | 'right' })}
                    className={`flex-1 p-2 rounded border transition-colors ${
                      currentStyle.textAlign === align.value
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600'
                    }`}
                  >
                    {align.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Rich Text with working formatting
  // Uses local state + debounce to prevent focus loss
  const RichText = ({ id, label, value, onChange, rows = 3, tip, maxLength, showAI, fieldKey, style, onStyleChange, showStyleEditor = false }: { 
    id?: string, 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    rows?: number,
    tip?: string,
    maxLength?: number,
    showAI?: boolean,
    fieldKey?: string,
    style?: { fontSize?: string; color?: string; fontWeight?: string; textAlign?: 'left' | 'center' | 'right' },
    onStyleChange?: (style: { fontSize?: string; color?: string; fontWeight?: string; textAlign?: 'left' | 'center' | 'right' }) => void,
    showStyleEditor?: boolean
  }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      setLocalValue(value || '');
    }, [value]);
    
    const handleChange = (newValue: string) => {
      setLocalValue(newValue);
      
      // Debounce the parent update
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    };
    
    // Cleanup debounce on unmount
    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

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
      onChange(newText); // Immediate update for formatting actions

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
          <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-neutral-950 border border-neutral-800 rounded p-0.5">
              <button 
                onClick={() => applyFormat('bold')} 
                className="p-1.5 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white transition-colors"
                title="Bold (**text**)"
              >
                <Bold size={12} />
              </button>
              <button 
                onClick={() => applyFormat('italic')} 
                className="p-1.5 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white transition-colors"
                title="Italic (*text*)"
              >
                <Italic size={12} />
              </button>
              <button 
                onClick={() => applyFormat('link')} 
                className="p-1.5 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white transition-colors"
                title="Link [text](url)"
              >
                <LinkIcon size={12} />
              </button>
            </div>
            {showAI && fieldKey && (
              <button 
                onClick={() => generateAIContent(fieldKey)}
                disabled={isGeneratingAI === fieldKey}
                className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 font-bold transition-colors disabled:opacity-50"
              >
                {isGeneratingAI === fieldKey ? (
                  <><Loader2 size={10} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={10} /> AI Write</>
                )}
              </button>
            )}
          </div>
        </div>
        {tip && (
          <p className="text-[10px] text-neutral-600 flex items-center gap-1">
            <Lightbulb size={10} /> {tip}
          </p>
        )}
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => onChange(localValue)}
          className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none resize-none transition-all placeholder:text-neutral-700"
          style={style ? { color: style.color } : undefined}
          rows={rows}
          maxLength={maxLength}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
        {maxLength && (
          <div className={`text-[10px] text-right ${(localValue?.length || 0) > maxLength * 0.9 ? 'text-yellow-500' : 'text-neutral-600'}`}>
            {localValue?.length || 0}/{maxLength} characters
          </div>
        )}
        {/* Style Editor */}
        {showStyleEditor && onStyleChange && (
          <TextStyleEditor
            style={style}
            onChange={onStyleChange}
            isOpen={fieldKey ? openStyleEditors.has(fieldKey) : false}
            onToggle={() => {
              if (!fieldKey) return;
              setOpenStyleEditors(prev => {
                const newSet = new Set(prev);
                if (newSet.has(fieldKey)) {
                  newSet.delete(fieldKey);
                } else {
                  newSet.add(fieldKey);
                }
                return newSet;
              });
            }}
          />
        )}
      </div>
    );
  };

  // Enhanced Input with tips, examples, and character count
  // Uses local state to prevent focus loss on every keystroke
  const Input = ({ label, value, onChange, id, fieldKey, showAI = false, maxLength, placeholder, tip, examples, style, onStyleChange, showStyleEditor = false }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    id?: string,
    fieldKey?: string,
    showAI?: boolean,
    maxLength?: number,
    placeholder?: string,
    tip?: string,
    examples?: string[],
    style?: { fontSize?: string; color?: string; fontWeight?: string; textAlign?: 'left' | 'center' | 'right' },
    onStyleChange?: (style: { fontSize?: string; color?: string; fontWeight?: string; textAlign?: 'left' | 'center' | 'right' }) => void,
    showStyleEditor?: boolean
  }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
    
    // Sync from parent when value changes externally (e.g., AI generation)
    React.useEffect(() => {
      setLocalValue(value || '');
    }, [value]);
    
    const handleChange = (newValue: string) => {
      setLocalValue(newValue);
      
      // Debounce the parent update to prevent excessive re-renders
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    };
    
    // Cleanup debounce on unmount
    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    const isStyleEditorOpen = fieldKey ? openStyleEditors.has(fieldKey) : false;
    const toggleStyleEditor = () => {
      if (!fieldKey) return;
      setOpenStyleEditors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(fieldKey)) {
          newSet.delete(fieldKey);
        } else {
          newSet.add(fieldKey);
        }
        return newSet;
      });
    };
    
    return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
        <div className="flex items-center gap-2">
          {examples && examples.length > 0 && (
            <button 
              onClick={() => setShowExamples(showExamples === fieldKey ? null : fieldKey || null)}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-medium"
            >
              Examples
            </button>
          )}
          {showAI && fieldKey && (
            <button 
              onClick={() => generateAIContent(fieldKey)}
              disabled={isGeneratingAI === fieldKey}
              className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 font-bold transition-colors disabled:opacity-50"
            >
              {isGeneratingAI === fieldKey ? (
                <><Loader2 size={10} className="animate-spin" /> Generating...</>
              ) : (
                <><Sparkles size={10} /> AI Write</>
              )}
            </button>
          )}
        </div>
      </div>
      {tip && (
        <p className="text-[10px] text-neutral-600 flex items-center gap-1">
          <Lightbulb size={10} /> {tip}
        </p>
      )}
      <input
        id={id}
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => onChange(localValue)} // Ensure final value is synced
        maxLength={maxLength}
        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-700"
        style={style ? { color: style.color } : undefined}
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
      />
      {/* Examples dropdown */}
      {showExamples === fieldKey && examples && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[10px] text-neutral-500 mb-2">Click to use:</p>
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => {
                setLocalValue(example);
                onChange(example);
                setShowExamples(null);
              }}
              className="w-full text-left px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}
      {maxLength && (
        <div className={`text-[10px] text-right ${(localValue?.length || 0) > maxLength * 0.9 ? 'text-yellow-500' : 'text-neutral-600'}`}>
          {localValue?.length || 0}/{maxLength}
        </div>
      )}
      {/* Style Editor */}
      {showStyleEditor && onStyleChange && (
        <TextStyleEditor
          style={style}
          onChange={onStyleChange}
          isOpen={isStyleEditorOpen}
          onToggle={toggleStyleEditor}
        />
      )}
    </div>
  );
  };

  // Smart Link Selector with page suggestions
  // Uses local state to prevent focus loss
  const LinkSelector = ({ label, value, onChange, id, placeholder }: {
    label: string,
    value: string,
    onChange: (val: string) => void,
    id?: string,
    placeholder?: string
  }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
    
    React.useEffect(() => {
      setLocalValue(value || '');
    }, [value]);
    
    const handleChange = (newValue: string) => {
      setLocalValue(newValue);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(newValue), 300);
    };
    
    React.useEffect(() => {
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, []);
    
    return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => onChange(localValue)}
          onFocus={() => setShowLinkPicker(id || 'link')}
          className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-700 pr-8"
          placeholder={placeholder || '/page or https://...'}
        />
        <button 
          onClick={() => setShowLinkPicker(showLinkPicker === id ? null : (id || 'link'))}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      
      {showLinkPicker === (id || 'link') && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[10px] text-neutral-500 px-2 py-1 font-bold uppercase">Internal Pages</p>
          <button
            onClick={() => { onChange('/'); setShowLinkPicker(null); }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
          >
            <Home size={12} /> Home Page
          </button>
          <button
            onClick={() => { onChange('/shop'); setShowLinkPicker(null); }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
          >
            <ShoppingBag size={12} /> Shop / Products
          </button>
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => { onChange(`/${page.slug}`); setShowLinkPicker(null); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
            >
              <FileText size={12} /> {page.name}
            </button>
          ))}
          <div className="border-t border-neutral-800 mt-2 pt-2">
            <p className="text-[10px] text-neutral-500 px-2 py-1 font-bold uppercase">Scroll To Section</p>
            <button
              onClick={() => { onChange('#contact'); setShowLinkPicker(null); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
            >
              <Hash size={12} /> Contact Section
            </button>
            <button
              onClick={() => { onChange('#products'); setShowLinkPicker(null); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
            >
              <Hash size={12} /> Products Section
            </button>
          </div>
          <div className="border-t border-neutral-800 mt-2 pt-2">
            <p className="text-[10px] text-neutral-500 px-2 py-1 font-bold uppercase">External Link</p>
            <p className="text-[10px] text-neutral-600 px-2 py-1">Type full URL above (https://...)</p>
          </div>
        </div>
      )}
    </div>
  );
  };

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
          <label className="text-xs font-bold uppercase text-neutral-500">Form Fields</label>
          <button
            onClick={() => setAddingField(!addingField)}
            className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-bold"
          >
            <Plus size={12} /> Add Field
          </button>
        </div>

        {/* Field type selector */}
        {addingField && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[10px] text-neutral-500 mb-2 font-bold uppercase">Choose field type:</p>
            <div className="grid grid-cols-2 gap-2">
              {FORM_FIELD_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => addField(type.value)}
                  className="flex items-center gap-2 p-2 text-xs text-neutral-300 hover:bg-neutral-800 rounded border border-neutral-800 transition-colors"
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
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 group"
            >
              {editingFormField === field.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                    className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-sm text-white"
                    placeholder="Field label"
                  />
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                    className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-xs text-neutral-400"
                    placeholder="Placeholder text"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-neutral-400">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                        className="rounded border-neutral-700"
                      />
                      Required field
                    </label>
                    <button
                      onClick={() => setEditingFormField(null)}
                      className="text-xs text-blue-400 hover:text-blue-300"
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
                      className="p-0.5 text-neutral-600 hover:text-neutral-400 disabled:opacity-30"
                    >
                      <ChevronLeft size={12} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => moveField(index, 'down')}
                      disabled={index === fields.length - 1}
                      className="p-0.5 text-neutral-600 hover:text-neutral-400 disabled:opacity-30"
                    >
                      <ChevronRight size={12} className="rotate-90" />
                    </button>
                  </div>
                  <GripVertical size={14} className="text-neutral-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-300">{field.label}</span>
                      {field.required && <span className="text-[10px] text-red-400">Required</span>}
                    </div>
                    <span className="text-[10px] text-neutral-600">{FORM_FIELD_TYPES.find(t => t.value === field.type)?.label}</span>
                  </div>
                  <button
                    onClick={() => setEditingFormField(field.id)}
                    className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Type size={12} />
                  </button>
                  <button
                    onClick={() => removeFormField(field.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Product Selector Component - allows manual selection of products to display
  const ProductSelector = ({ 
    products, 
    selectedIds, 
    onChange, 
    searchQuery, 
    onSearchChange,
    tip 
  }: { 
    products: { id: string; name: string; image: string; price: number; category: string; tags?: string[] }[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    tip?: string;
  }) => {
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleProduct = (productId: string) => {
      if (selectedIds.includes(productId)) {
        onChange(selectedIds.filter(id => id !== productId));
      } else {
        onChange([...selectedIds, productId]);
      }
    };

    const moveProduct = (productId: string, direction: 'up' | 'down') => {
      const index = selectedIds.indexOf(productId);
      if (index === -1) return;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= selectedIds.length) return;
      const newIds = [...selectedIds];
      [newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]];
      onChange(newIds);
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-neutral-500">Select Products</label>
          <span className="text-[10px] text-neutral-600">{selectedIds.length} selected</span>
        </div>
        {tip && <p className="text-[10px] text-neutral-600">{tip}</p>}
        
        {/* Selected Products List */}
        {selectedIds.length > 0 && (
          <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] font-bold uppercase text-neutral-500">Display Order</span>
            {selectedIds.map((id, index) => {
              const product = products.find(p => p.id === id);
              if (!product) return null;
              return (
                <div key={id} className="flex items-center gap-2 group">
                  <div className="flex flex-col">
                    <button 
                      onClick={() => moveProduct(id, 'up')} 
                      disabled={index === 0}
                      className="p-0.5 text-neutral-600 hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft size={10} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => moveProduct(id, 'down')} 
                      disabled={index === selectedIds.length - 1}
                      className="p-0.5 text-neutral-600 hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight size={10} className="rotate-90" />
                    </button>
                  </div>
                  <div className="w-8 h-8 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                    {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-neutral-300 truncate">{product.name}</div>
                    <div className="text-[10px] text-neutral-600">${product.price.toFixed(2)}</div>
                  </div>
                  <button 
                    onClick={() => toggleProduct(id)}
                    className="p-1 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-neutral-600 text-sm">
              {products.length === 0 ? 'No products found' : 'No matching products'}
            </div>
          ) : (
            filteredProducts.map(product => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`relative p-2 rounded-lg border transition-all text-left ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                  <div className="w-full aspect-square bg-neutral-800 rounded mb-2 overflow-hidden">
                    {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="text-[10px] text-neutral-300 truncate">{product.name}</div>
                  <div className="text-[10px] text-neutral-600">${product.price.toFixed(2)}</div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Toggle Component
  const Toggle = ({ label, value, onChange, tip }: { label: string, value: boolean, onChange: (val: boolean) => void, tip?: string }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <label className="text-sm text-neutral-300">{label}</label>
        {tip && <p className="text-[10px] text-neutral-600">{tip}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-neutral-700'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
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
      <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
      {tip && (
        <p className="text-[10px] text-neutral-600 flex items-center gap-1">
          <Info size={10} /> {tip}
        </p>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        min={min}
        max={max}
        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-700"
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
      <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
      {tip && (
        <p className="text-[10px] text-neutral-600 flex items-center gap-1">
          <Info size={10} /> {tip}
        </p>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
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
      <div className="h-full flex flex-col bg-neutral-900 border-l border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <button onClick={() => setShowLayoutPicker(false)} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold text-white">Choose Layout</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 custom-scrollbar">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                onSwitchLayout(opt.id);
                setShowLayoutPicker(false);
              }}
              className={`text-left border rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all group ${variant === opt.id ? 'ring-2 ring-blue-600 bg-blue-900/20 border-blue-500' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}
            >
              <div className={`aspect-video flex items-center justify-center transition-colors ${variant === opt.id ? 'bg-blue-900/30 text-blue-400' : 'bg-neutral-900 text-neutral-600 group-hover:bg-neutral-800 group-hover:text-neutral-500'}`}>
                <Layout size={24} />
              </div>
              <div className="p-3">
                <div className={`font-bold text-sm mb-1 transition-colors ${variant === opt.id ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>{opt.name}</div>
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
      <div className="h-full flex flex-col bg-neutral-900 border-l border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <button onClick={() => setActiveItemIndex(null)} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold text-white">Edit Item {activeItemIndex + 1}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
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
    <div className="h-full flex flex-col bg-neutral-900 border-l border-neutral-800">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-white text-sm">{sectionConfig.title}</h3>
            <p className="text-[10px] text-neutral-500">{sectionConfig.description}</p>
          </div>
          <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 border border-neutral-700">{variant}</span>
        </div>
        <button 
          onClick={() => setShowLayoutPicker(true)}
          className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-neutral-900 rounded-lg text-neutral-400 group-hover:text-white transition-colors">
              <Layout size={16} />
            </div>
            <span className="font-bold text-sm text-neutral-300 group-hover:text-white transition-colors">{currentOption?.name || 'Select Layout'}</span>
          </div>
          <ChevronRight size={16} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
        </button>
      </div>

      {/* Group Tabs */}
      {sectionConfig.groups.length > 1 && (
        <div className="flex border-b border-neutral-800 bg-neutral-950/50">
          {sectionConfig.groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors border-b-2 ${
                activeGroup === group.id 
                  ? 'text-white border-blue-500 bg-blue-500/5' 
                  : 'text-neutral-500 border-transparent hover:text-neutral-300'
              }`}
            >
              {group.icon}
              {group.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content - Dynamic Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        
        {/* Render section-specific fields for active group */}
        {/* Filter fields based on block type and current variant */}
        {sectionConfig.fields
          .filter(field => field.group === activeGroup)
          .filter(field => {
            // If this is a hero section, only show fields relevant to the current variant
            if (blockType === 'system-hero' && variant) {
              const variantFields = HERO_VARIANT_FIELDS[variant];
              if (variantFields) {
                return variantFields.includes(field.key);
              }
            }
            // If this is a product grid section, filter by variant and product source
            if (blockType === 'system-grid' && variant) {
              const variantFields = GRID_VARIANT_FIELDS[variant];
              if (variantFields) {
                // Check if field is in variant fields
                if (!variantFields.includes(field.key)) return false;
                
                // Additional filtering based on productSource selection
                const productSource = data.productSource || 'all';
                if (field.key === 'productCategory' && productSource !== 'category') return false;
                if (field.key === 'productCollection' && productSource !== 'collection') return false;
                if (field.key === 'productTag' && productSource !== 'tag') return false;
                if (field.key === 'selectedProducts' && productSource !== 'manual') return false;
              }
            }
            return true;
          })
          .map(field => {
            const fieldValue = data[field.key] ?? field.defaultValue;
            const fieldId = `editor-field-${field.key}`;
            const styleKey = `${field.key}_style`;
            const styleValue = data[styleKey];

            switch (field.type) {
              case 'text':
                return (
                  <Input
                    key={field.key}
                    id={fieldId}
                    label={field.label}
                    value={fieldValue ?? ''}
                    onChange={(val) => updateField(field.key, val)}
                    fieldKey={field.key}
                    showAI={field.showAI}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    tip={field.tip}
                    examples={field.examples}
                    style={styleValue}
                    onStyleChange={(style) => updateField(styleKey, style)}
                    showStyleEditor={true}
                  />
                );

              case 'richtext':
                return (
                  <RichText
                    key={field.key}
                    id={fieldId}
                    label={field.label}
                    value={fieldValue ?? ''}
                    onChange={(val) => updateField(field.key, val)}
                    fieldKey={field.key}
                    showAI={field.showAI}
                    maxLength={field.maxLength}
                    tip={field.tip}
                    style={styleValue}
                    onStyleChange={(style) => updateField(styleKey, style)}
                    showStyleEditor={true}
                  />
                );

              case 'image':
                return (
                  <ImagePicker
                    key={field.key}
                    id={fieldId}
                    label={field.label}
                    value={fieldValue ?? ''}
                    onChange={(val) => updateField(field.key, val)}
                    onUpload={(e) => handleImageUpload(e, field.key)}
                    tip={field.tip}
                  />
                );

              case 'linkSelector':
                return (
                  <LinkSelector
                    key={field.key}
                    id={fieldId}
                    label={field.label}
                    value={fieldValue ?? ''}
                    onChange={(val) => updateField(field.key, val)}
                    placeholder={field.placeholder}
                  />
                );

              case 'select':
                // For productCategory, dynamically generate options from categories
                let selectOptions = field.options || [];
                if (field.key === 'productCategory' && categories && categories.length > 0) {
                  // Use categories from database context
                  selectOptions = [
                    { value: '', label: 'Select a category...' },
                    ...categories
                      .filter(c => c.parent_id === undefined || c.parent_id === null)
                      .map(cat => ({ value: cat.id, label: cat.name }))
                  ];
                } else if (field.key === 'productCategory' && products && products.length > 0) {
                  // Fallback to extracting categories from products
                  const productCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
                  selectOptions = [
                    { value: '', label: 'Select a category...' },
                    ...productCategories.map(cat => ({ value: cat, label: cat }))
                  ];
                } else if (field.key === 'productCollection' && collections && collections.length > 0) {
                  // Use collections from database context
                  selectOptions = [
                    { value: '', label: 'Select a collection...' },
                    ...collections.map(col => ({ value: col.id, label: col.name }))
                  ];
                }
                
                return (
                  <Select
                    key={field.key}
                    label={field.label}
                    value={fieldValue ?? ''}
                    onChange={(val) => updateField(field.key, val)}
                    options={selectOptions}
                    tip={field.tip}
                  />
                );

              case 'number':
                return (
                  <NumberInput
                    key={field.key}
                    label={field.label}
                    value={fieldValue || field.defaultValue || 0}
                    onChange={(val) => updateField(field.key, val)}
                    placeholder={field.placeholder}
                    tip={field.tip}
                  />
                );

              case 'toggle':
                return (
                  <Toggle
                    key={field.key}
                    label={field.label}
                    value={fieldValue !== undefined ? fieldValue : field.defaultValue}
                    onChange={(val) => updateField(field.key, val)}
                    tip={field.tip}
                  />
                );

              case 'url':
                return (
                  <Input
                    key={field.key}
                    id={fieldId}
                    label={field.label}
                    value={fieldValue ?? ''}
                    onChange={(val) => updateField(field.key, val)}
                    placeholder={field.placeholder}
                    tip={field.tip}
                  />
                );

              case 'formBuilder':
                return (
                  <FormBuilder
                    key={field.key}
                    value={fieldValue || DEFAULT_FORM_FIELDS}
                    onChange={(val) => updateField(field.key, val)}
                  />
                );

              case 'productSelector':
                return (
                  <ProductSelector
                    key={field.key}
                    products={products}
                    selectedIds={fieldValue || []}
                    onChange={(val) => updateField(field.key, val)}
                    searchQuery={productSearchQuery}
                    onSearchChange={setProductSearchQuery}
                    tip={field.tip}
                  />
                );

              default:
                return null;
            }
          })}

        {/* Items List (Drill Down) - for sections with items */}
        {data.items && activeGroup === 'content' && (
          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <List size={12} /> Items ({data.items.length})
              </h4>
              <button onClick={addItem} className="p-1.5 hover:bg-blue-500/10 rounded text-blue-500 hover:text-blue-400 transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {data.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <button 
                    onClick={() => setActiveItemIndex(i)}
                    className="flex-1 flex items-center gap-3 p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg text-left transition-all group-hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-neutral-900 rounded-md overflow-hidden shrink-0 border border-neutral-800 flex items-center justify-center text-neutral-700">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={16} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate text-neutral-300 group-hover:text-white transition-colors">{item.title || 'Untitled'}</div>
                      <div className="text-[10px] text-neutral-600 truncate">Item {i + 1}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                  </button>
                  <button onClick={() => removeItem(i)} className="p-2 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Settings - always available */}
        {activeGroup === sectionConfig.groups[sectionConfig.groups.length - 1]?.id && (
          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2 mb-4">
              <Palette size={12} /> Design Overrides
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
                label="Container Width"
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

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Vertical Padding"
                value={data.style?.padding || 'auto'}
                onChange={(val) => updateStyle('padding', val)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'none', label: 'None' },
                  { value: 's', label: 'Small' },
                  { value: 'm', label: 'Medium' },
                  { value: 'l', label: 'Large' },
                  { value: 'xl', label: 'Extra Large' },
                ]}
              />
              <Select
                label="Horizontal Padding"
                value={data.style?.paddingX || 'auto'}
                onChange={(val) => updateStyle('paddingX', val)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'none', label: 'None' },
                  { value: 's', label: 'Small' },
                  { value: 'm', label: 'Medium' },
                  { value: 'l', label: 'Large' },
                  { value: 'xl', label: 'Extra Large' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Section Height"
                value={data.style?.height || 'auto'}
                onChange={(val) => updateStyle('height', val)}
                options={[
                  { value: 'auto', label: 'Auto (Content)' },
                  { value: 'sm', label: 'Small (300px)' },
                  { value: 'md', label: 'Medium (500px)' },
                  { value: 'lg', label: 'Large (700px)' },
                  { value: 'screen', label: 'Full Screen' },
                ]}
              />
              <Select
                label="Image Fit"
                value={data.style?.imageFit || 'auto'}
                onChange={(val) => updateStyle('imageFit', val)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'cover', label: 'Cover (Fill)' },
                  { value: 'contain', label: 'Contain (Fit)' },
                  { value: 'scale', label: 'Scale Down' },
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
          </div>
        )}

      </div>
    </div>
  );
};
