/**
 * Test script for Component Extraction
 * Run this to verify the extraction logic works before deploying
 */

import { analyzeBlockStructure, generateTemplate, getComponentIdentifier, categorizeComponent, generateComponentName } from './lib/componentAnalyzer';

// Sample PageBlock (like what AI generates)
const sampleHeroBlock = {
  type: 'system-hero',
  variant: 'aurora',
  data: {
    heading: 'Welcome to Our Store',
    subheading: 'Discover amazing products',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1234567890',
    style: {
      backgroundColor: '#1E3A8A',
      textColor: '#FFFFFF',
      buttonColor: '#10B981'
    }
  }
};

const sampleFeatureBlock = {
  type: 'system-features',
  variant: 'grid',
  data: {
    heading: 'Why Choose Us',
    features: [
      { title: 'Fast Shipping', icon: '🚀' },
      { title: 'Quality Products', icon: '⭐' },
      { title: '24/7 Support', icon: '💬' }
    ]
  }
};

console.log('=== Component Analyzer Test ===\n');

// Test 1: Analyze structure
console.log('Test 1: Analyzing Hero Block Structure');
const heroFields = analyzeBlockStructure(sampleHeroBlock.data);
console.log('Detected fields:', heroFields.length);
heroFields.forEach(field => {
  console.log(`  - ${field.label} (${field.type}): ${field.path}`);
});
console.log('');

// Test 2: Generate template
console.log('Test 2: Generating Template');
const heroTemplate = generateTemplate(sampleHeroBlock);
console.log('Template:', JSON.stringify(heroTemplate, null, 2));
console.log('');

// Test 3: Get component identifier
console.log('Test 3: Component Identifier');
const identifier = getComponentIdentifier(sampleHeroBlock);
console.log('Type:', identifier.type);
console.log('Variant:', identifier.variant);
console.log('');

// Test 4: Categorize component
console.log('Test 4: Component Category');
const category = categorizeComponent(identifier.type);
console.log('Category:', category);
console.log('');

// Test 5: Generate name
console.log('Test 5: Component Name');
const name = generateComponentName(sampleHeroBlock);
console.log('Generated Name:', name);
console.log('');

// Test 6: Analyze features block
console.log('Test 6: Analyzing Features Block');
const featureFields = analyzeBlockStructure(sampleFeatureBlock.data);
console.log('Detected fields:', featureFields.length);
featureFields.forEach(field => {
  console.log(`  - ${field.label} (${field.type}): ${field.path}`);
});
console.log('');

console.log('=== All Tests Complete ===');
console.log('\n✅ If you see field detections above, the analyzer is working!');
console.log('✅ Template should have {{placeholder}} values');
console.log('✅ Component name should be human-readable');
