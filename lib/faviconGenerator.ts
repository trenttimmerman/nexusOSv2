/**
 * Favicon Generator Utility for WebPilot
 * Generates favicon.ico and various icon sizes from a source image
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export interface FaviconOptions {
  sourceImage: string; // Path to source image or base64 data URL
  outputDir: string;   // Directory to save favicon files
  sizes?: number[];    // Icon sizes to generate (default: [16, 32, 48, 64, 128, 256])
  backgroundColor?: string; // Background color for padding (if needed)
}

export interface FaviconResult {
  success: boolean;
  files: {
    favicon: string;      // Path to favicon.ico
    png16: string;        // 16x16 PNG
    png32: string;        // 32x32 PNG
    png192: string;       // 192x192 PNG (Android)
    png512: string;       // 512x512 PNG (Android)
    appleTouchIcon: string; // 180x180 PNG (iOS)
  };
  error?: string;
}

/**
 * Generate favicon and related icon files from source image
 */
export async function generateFavicon(options: FaviconOptions): Promise<FaviconResult> {
  const {
    sourceImage,
    outputDir,
    sizes = [16, 32, 48, 64, 128, 256],
    backgroundColor = 'transparent'
  } = options;

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load source image
    let imageBuffer: Buffer;
    
    if (sourceImage.startsWith('data:image/')) {
      // Handle base64 data URL
      const base64Data = sourceImage.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (sourceImage.startsWith('http://') || sourceImage.startsWith('https://')) {
      // Handle URL (fetch image)
      const response = await fetch(sourceImage);
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      // Handle file path
      imageBuffer = fs.readFileSync(sourceImage);
    }

    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Generate standard favicon sizes
    const favicon16 = path.join(outputDir, 'favicon-16x16.png');
    const favicon32 = path.join(outputDir, 'favicon-32x32.png');
    const favicon192 = path.join(outputDir, 'android-chrome-192x192.png');
    const favicon512 = path.join(outputDir, 'android-chrome-512x512.png');
    const appleTouchIcon = path.join(outputDir, 'apple-touch-icon.png');

    // Generate 16x16
    await image
      .clone()
      .resize(16, 16, { fit: 'contain', background: backgroundColor })
      .png()
      .toFile(favicon16);

    // Generate 32x32
    await image
      .clone()
      .resize(32, 32, { fit: 'contain', background: backgroundColor })
      .png()
      .toFile(favicon32);

    // Generate 192x192 (Android)
    await image
      .clone()
      .resize(192, 192, { fit: 'contain', background: backgroundColor })
      .png()
      .toFile(favicon192);

    // Generate 512x512 (Android)
    await image
      .clone()
      .resize(512, 512, { fit: 'contain', background: backgroundColor })
      .png()
      .toFile(favicon512);

    // Generate 180x180 (Apple Touch Icon)
    await image
      .clone()
      .resize(180, 180, { fit: 'contain', background: backgroundColor })
      .png()
      .toFile(appleTouchIcon);

    // Generate multi-size favicon.ico using 32x32 as primary
    const faviconIco = path.join(outputDir, 'favicon.ico');
    await sharp(favicon32)
      .resize(32, 32)
      .toFile(faviconIco);

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
    return {
      success: false,
      files: {
        favicon: '',
        png16: '',
        png32: '',
        png192: '',
        png512: '',
        appleTouchIcon: ''
      },
      error: error instanceof Error ? error.message : 'Unknown error generating favicon'
    };
  }
}

/**
 * Generate favicon specifically for WebPilot platform
 */
export async function generateWebPilotFavicon(logoPath: string, outputDir: string = './public'): Promise<FaviconResult> {
  return generateFavicon({
    sourceImage: logoPath,
    outputDir,
    backgroundColor: 'transparent'
  });
}

/**
 * Client-side favicon preview generator (browser environment)
 * Converts uploaded image to base64 and generates preview
 */
export function generateFaviconPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 32, 32);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file for favicon generation
 */
export function validateFaviconImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PNG, JPG, SVG, or WebP.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.'
    };
  }

  return { valid: true };
}
