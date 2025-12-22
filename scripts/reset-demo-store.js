import { createClient } from '@supabase/supabase-js';

// Use environment variables - requires SUPABASE_SERVICE_ROLE_KEY for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fwgufmjraxiadtnxkymi.supabase.co';
// For this script, we need the service role key. 
// Get it from Supabase Dashboard > Settings > API > service_role key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('\nTo get your service role key:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the "service_role" key (NOT the anon key)');
  console.log('\nThen run:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/reset-demo-store.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Default Home Page Blocks (same as what new SaaS customers get)
const DEFAULT_HOME_BLOCKS = [
  {
    id: 'starter-hero',
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
    id: 'starter-features',
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
    id: 'starter-products',
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
    id: 'starter-newsletter',
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
    id: 'about-hero',
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
    id: 'about-content',
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

// Default Store Config (same as what new SaaS customers get)
const DEFAULT_STORE_CONFIG = {
  name: 'Demo Store',
  currency: 'CAD',
  header_style: 'clean',
  hero_style: 'impact',
  product_card_style: 'classic',
  footer_style: 'columns',
  scrollbar_style: 'nexus',
  primary_color: '#000000',
  logo_url: null,
  logo_height: 32,
};

async function resetDemoStore() {
  console.log('🔄 Resetting Demo Store to default SaaS customer state...\n');

  // 1. Find the Demo Store
  const { data: demoStore, error: storeError } = await supabase
    .from('stores')
    .select('id, name, slug')
    .eq('slug', 'demo-store')
    .maybeSingle();

  if (storeError) {
    console.error('❌ Error finding demo store:', storeError);
    return;
  }

  if (!demoStore) {
    console.error('❌ Demo store not found. Looking for store with slug "demo-store"');
    
    // List available stores
    const { data: stores } = await supabase.from('stores').select('id, name, slug');
    console.log('\nAvailable stores:', stores);
    return;
  }

  console.log(`✅ Found Demo Store: ${demoStore.name} (${demoStore.id})`);
  const storeId = demoStore.id;

  // 2. Delete all existing pages for this store
  console.log('\n📄 Resetting pages...');
  const { error: deleteError } = await supabase
    .from('pages')
    .delete()
    .eq('store_id', storeId);

  if (deleteError) {
    console.error('❌ Error deleting existing pages:', deleteError);
  } else {
    console.log('   Deleted existing pages');
  }

  // 3. Create new default pages
  const newPages = [
    {
      id: `home-${Date.now()}`,
      store_id: storeId,
      title: 'Home',
      slug: '/',
      type: 'home',
      content: '',
      blocks: DEFAULT_HOME_BLOCKS
    },
    {
      id: `about-${Date.now()}`,
      store_id: storeId,
      title: 'About',
      slug: 'about',
      type: 'custom',
      content: '',
      blocks: DEFAULT_ABOUT_BLOCKS
    }
  ];

  const { data: insertedPages, error: insertError } = await supabase
    .from('pages')
    .insert(newPages)
    .select();

  if (insertError) {
    console.error('❌ Error creating pages:', insertError);
  } else {
    console.log(`   ✅ Created ${insertedPages.length} default pages:`);
    insertedPages.forEach(p => console.log(`      - ${p.title} (${p.type})`));
  }

  // 4. Reset store config
  console.log('\n⚙️  Resetting store config...');
  const { error: configError } = await supabase
    .from('store_config')
    .upsert({
      store_id: storeId,
      ...DEFAULT_STORE_CONFIG
    }, { onConflict: 'store_id' });

  if (configError) {
    console.error('❌ Error resetting store config:', configError);
  } else {
    console.log('   ✅ Store config reset to defaults');
  }

  // 5. Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Demo Store Reset Complete!');
  console.log('='.repeat(50));
  console.log('\nThe demo store now has:');
  console.log('  📄 Home page with:');
  console.log('      - Hero Section');
  console.log('      - Features Section');
  console.log('      - Featured Products Grid');
  console.log('      - Newsletter Signup');
  console.log('  📄 About page with:');
  console.log('      - About Hero');
  console.log('      - About Content (Rich Text)');
  console.log('\nRefresh the admin panel to see the changes!');
}

resetDemoStore().catch(console.error);
