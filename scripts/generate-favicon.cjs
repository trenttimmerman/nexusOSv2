#!/usr/bin/env node
/**
 * Generate WebPilot Platform Favicon
 * Run: node scripts/generate-favicon.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon(logoPath, outputDir) {
  try {
    console.log('🎨 Generating WebPilot favicon...\n');
    console.log(`Source: ${logoPath}`);
    console.log(`Output: ${outputDir}\n`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load source image
    const imageBuffer = fs.readFileSync(logoPath);
    const image = sharp(imageBuffer);

    // Define output files
    const favicon16 = path.join(outputDir, 'favicon-16x16.png');
    const favicon32 = path.join(outputDir, 'favicon-32x32.png');
    const favicon192 = path.join(outputDir, 'android-chrome-192x192.png');
    const favicon512 = path.join(outputDir, 'android-chrome-512x512.png');
    const appleTouchIcon = path.join(outputDir, 'apple-touch-icon.png');
    const faviconIco = path.join(outputDir, 'favicon.ico');

    // Generate 16x16
    await image
      .clone()
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon16);
    console.log('✓ Generated favicon-16x16.png');

    // Generate 32x32
    await image
      .clone()
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon32);
    console.log('✓ Generated favicon-32x32.png');

    // Generate 192x192 (Android)
    await image
      .clone()
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon192);
    console.log('✓ Generated android-chrome-192x192.png');

    // Generate 512x512 (Android)
    await image
      .clone()
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon512);
    console.log('✓ Generated android-chrome-512x512.png');

    // Generate 180x180 (Apple Touch Icon)
    await image
      .clone()
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(appleTouchIcon);
    console.log('✓ Generated apple-touch-icon.png');

    // Generate favicon.ico using 32x32
    await sharp(favicon32)
      .resize(32, 32)
      .toFile(faviconIco);
    console.log('✓ Generated favicon.ico');

    console.log('\n✅ Favicon generation successful!\n');
    console.log('Add these to your HTML <head>:');
    console.log(`
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
    `);

    return {
      success: true,
      files: {
        favicon: faviconIco,
        png16: favicon16,
        png32: favicon32,
        png192: favicon192,
        png512: favicon512,
        appleTouchIcon: appleTouchIcon
      }
    };
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Run generation
const logoPath = path.join(__dirname, '../public/Webpilot ecommerce edmonton canada.png');
const outputDir = path.join(__dirname, '../public');

generateFavicon(logoPath, outputDir)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to generate favicon:', error);
    process.exit(1);
  });
