/**
 * Local test for crawler product extraction
 * Run with: node test-crawler.js
 */

// Sample HTML with various product markup patterns
const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Product - Amazing Store</title>
  <meta property="og:type" content="product" />
  <meta property="og:title" content="Test Product" />
  <meta property="og:description" content="This is a test product" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="product:price:amount" content="29.99" />
  <meta property="product:price:currency" content="USD" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Amazing Widget",
    "description": "The best widget you'll ever own",
    "image": [
      "https://example.com/widget1.jpg",
      "https://example.com/widget2.jpg"
    ],
    "sku": "WIDGET-001",
    "brand": {
      "@type": "Brand",
      "name": "WidgetCo"
    },
    "offers": {
      "@type": "Offer",
      "price": "49.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "hasVariant": [
      {
        "@type": "Product",
        "name": "Small",
        "sku": "WIDGET-001-S",
        "offers": {
          "@type": "Offer",
          "price": "44.99"
        }
      },
      {
        "@type": "Product",
        "name": "Large",
        "sku": "WIDGET-001-L",
        "offers": {
          "@type": "Offer",
          "price": "54.99"
        }
      }
    ]
  }
  </script>
</head>
<body>
  <h1>Amazing Widget</h1>
  <div class="product-card">Product 1</div>
  <div class="product-card">Product 2</div>
  <a href="/products/widget-1">Widget 1</a>
  <a href="/collections/widgets">Widgets Collection</a>
  <a href="https://example.com/collections/gadgets">Gadgets</a>
</body>
</html>
`;

// Simplified extract function for testing
function extractProducts(html, url) {
  const products = [];
  
  try {
    const productSchemaMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi);
    
    for (const match of productSchemaMatches) {
      try {
        const jsonText = match[1].trim();
        if (!jsonText) continue;
        
        const data = JSON.parse(jsonText);
        const items = Array.isArray(data) ? data : [data];
        
        for (const item of items) {
          try {
            const itemType = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
            const isProduct = itemType.some(t => t === 'Product' || t?.includes?.('Product'));
            
            if (isProduct && item.name) {
              const product = {
                name: item.name || 'Untitled Product',
                description: item.description || '',
                url: item.url || url,
                images: [],
                price: 0,
                sku: item.sku || undefined,
                brand: item.brand?.name || undefined,
                variants: []
              };

              if (item.image) {
                product.images = Array.isArray(item.image) ? item.image : [item.image];
              }

              if (item.offers) {
                const offers = Array.isArray(item.offers) ? item.offers : [item.offers];
                const mainOffer = offers[0];
                
                if (mainOffer) {
                  product.price = parseFloat(mainOffer.price || mainOffer.lowPrice || '0');
                  product.currency = mainOffer.priceCurrency || 'USD';
                  product.availability = mainOffer.availability?.split('/').pop() || 'unknown';
                }
              }

              if (item.hasVariant) {
                const variants = Array.isArray(item.hasVariant) ? item.hasVariant : [item.hasVariant];
                variants.forEach(variant => {
                  if (variant.name || variant.sku) {
                    product.variants.push({
                      name: variant.name,
                      sku: variant.sku,
                      price: parseFloat(variant.offers?.price || product.price)
                    });
                  }
                });
              }

              products.push(product);
            }
          } catch (itemError) {
            console.error('Error parsing item:', itemError.message);
          }
        }
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError.message);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }

  return products;
}

// Run test
console.log('🧪 Testing crawler product extraction...\n');

const products = extractProducts(testHTML, 'https://example.com/products/widget');

console.log(`✅ Extracted ${products.length} product(s)\n`);

products.forEach((product, index) => {
  console.log(`Product ${index + 1}:`);
  console.log(`  Name: ${product.name}`);
  console.log(`  Price: $${product.price} ${product.currency}`);
  console.log(`  SKU: ${product.sku}`);
  console.log(`  Brand: ${product.brand}`);
  console.log(`  Images: ${product.images.length}`);
  console.log(`  Variants: ${product.variants.length}`);
  
  if (product.variants.length > 0) {
    console.log('  Variant details:');
    product.variants.forEach(v => {
      console.log(`    - ${v.name}: $${v.price} (${v.sku})`);
    });
  }
  console.log('');
});

console.log('✅ Test completed successfully!');
