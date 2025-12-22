import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, Check, Loader2, Trash2, Database } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Default Home Page Blocks (same as what new SaaS customers get)
const DEFAULT_HOME_BLOCKS = [
  {
    id: `starter-hero-${Date.now()}`,
    type: 'system-hero',
    name: 'Hero Section',
    content: '',
    variant: 'impact',
    data: {
      heading: 'Welcome to Your New Store',
      subheading: 'This is your homepage hero section. Click to edit this text and make it your own.',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
    }
  },
  {
    id: `starter-features-${Date.now()}`,
    type: 'system-layout',
    name: 'Features',
    content: '',
    variant: 'layout-features',
    data: {
      heading: 'Why Choose Us',
      subheading: 'Highlight your unique value propositions',
      features: [
        { icon: '🚀', title: 'Fast Shipping', description: 'Get your orders delivered quickly' },
        { icon: '💎', title: 'Premium Quality', description: 'Only the best products for you' },
        { icon: '💬', title: '24/7 Support', description: "We're here to help anytime" },
      ]
    }
  },
  {
    id: `starter-products-${Date.now()}`,
    type: 'system-collection',
    name: 'Featured Products',
    content: '',
    variant: 'collection-grid-tight',
    data: {
      heading: 'Featured Products',
      subheading: 'Check out our latest arrivals',
      productCount: 4,
      gridColumns: '4',
    }
  },
  {
    id: `starter-newsletter-${Date.now()}`,
    type: 'system-email',
    name: 'Newsletter',
    content: '',
    variant: 'email-minimal',
    data: {
      heading: 'Stay in the Loop',
      subheading: 'Subscribe to our newsletter for exclusive offers and updates.',
      buttonText: 'Subscribe',
      placeholder: 'Enter your email',
    }
  }
];

// Default About Page Blocks
const DEFAULT_ABOUT_BLOCKS = [
  {
    id: `about-hero-${Date.now()}`,
    type: 'system-hero',
    name: 'About Hero',
    content: '',
    variant: 'split',
    data: {
      heading: 'Our Story',
      subheading: 'Tell your visitors about your brand, mission, and what makes you special.',
      backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop',
    }
  },
  {
    id: `about-content-${Date.now()}`,
    type: 'system-rich-text',
    name: 'About Content',
    content: '',
    variant: 'rt-centered',
    data: {
      heading: 'Who We Are',
      content: '<p>Share your story here. Talk about how your business started, what drives you, and what you stand for. Customers love to know the people behind the brand.</p><p>This is a rich text section - you can add formatting, links, and more.</p>'
    }
  }
];

interface SettingsProps {
  storeId?: string | null;
}

const Settings: React.FC<SettingsProps> = ({ storeId }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetStore = async () => {
    if (!storeId) {
      setStatusMessage('No store ID found. Please log in again.');
      setResetStatus('error');
      return;
    }

    setIsResetting(true);
    setResetStatus('idle');
    setStatusMessage('');

    try {
      // 1. Delete all existing pages for this store
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('store_id', storeId);

      if (deleteError) {
        throw new Error(`Failed to delete pages: ${deleteError.message}`);
      }

      // 2. Create new default pages with fresh IDs
      const timestamp = Date.now();
      const newPages = [
        {
          id: `home-${timestamp}`,
          store_id: storeId,
          title: 'Home',
          slug: '/',
          type: 'home',
          content: '',
          blocks: DEFAULT_HOME_BLOCKS.map(b => ({ ...b, id: `${b.id.split('-')[0]}-${timestamp}-${Math.random().toString(36).substr(2, 9)}` }))
        },
        {
          id: `about-${timestamp}`,
          store_id: storeId,
          title: 'About',
          slug: 'about',
          type: 'custom',
          content: '',
          blocks: DEFAULT_ABOUT_BLOCKS.map(b => ({ ...b, id: `${b.id.split('-')[0]}-${timestamp}-${Math.random().toString(36).substr(2, 9)}` }))
        }
      ];

      const { error: insertError } = await supabase
        .from('pages')
        .insert(newPages);

      if (insertError) {
        throw new Error(`Failed to create pages: ${insertError.message}`);
      }

      // 3. Reset store config to defaults
      const { error: configError } = await supabase
        .from('store_config')
        .update({
          name: 'My Store',
          header_style: 'clean',
          hero_style: 'impact',
          product_card_style: 'classic',
          footer_style: 'columns',
          scrollbar_style: 'nexus',
          primary_color: '#000000',
        })
        .eq('store_id', storeId);

      if (configError) {
        console.warn('Could not reset store config:', configError);
        // Don't throw - pages are more important
      }

      setResetStatus('success');
      setStatusMessage('Store reset successfully! Refresh the page to see changes.');
      setShowConfirm(false);

      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Reset error:', error);
      setResetStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      
      {/* Store Management Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Database size={20} />
          Store Management
        </h3>
        
        <div className="space-y-4">
          {/* Reset Store Card */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  <RefreshCw size={16} className="text-orange-400" />
                  Reset Store to Default
                </h4>
                <p className="text-sm text-neutral-400 mb-3">
                  Reset your store's pages and design to the default SaaS customer template. 
                  This will delete all current pages and create fresh default Home and About pages.
                </p>
                
                {/* Status Message */}
                {resetStatus !== 'idle' && (
                  <div className={`flex items-center gap-2 text-sm mb-3 ${
                    resetStatus === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {resetStatus === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                    {statusMessage}
                  </div>
                )}

                {/* Confirm Dialog */}
                {showConfirm ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-300 font-medium mb-3">
                          Are you sure? This action cannot be undone. All your current pages and their content will be permanently deleted.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleResetStore}
                            disabled={isResetting}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isResetting ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Resetting...
                              </>
                            ) : (
                              <>
                                <Trash2 size={14} />
                                Yes, Reset Everything
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowConfirm(false)}
                            disabled={isResetting}
                            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Reset to Default Template
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Store Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-neutral-800">
            <span className="text-neutral-400">Store ID</span>
            <span className="text-white font-mono text-xs">{storeId || 'Not connected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
