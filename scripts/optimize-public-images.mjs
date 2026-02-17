import sharp from 'sharp';
import { readdir, mkdir, rm } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const PUBLIC_UPLOADS = 'public/uploads';
const OPTIMIZED_DIR = 'public/uploads/optimized';

// Breakpoint definitions
const BREAKPOINTS = {
  desktop: { width: 1920, height: 1080, label: 'desktop' },
  tablet: { width: 1280, height: 720, label: 'tablet' },
  mobile: { width: 720, height: 480, label: 'mobile' }
};

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  
  // Create optimized directory if it doesn't exist
  if (existsSync(OPTIMIZED_DIR)) {
    await rm(OPTIMIZED_DIR, { recursive: true });
  }
  await mkdir(OPTIMIZED_DIR, { recursive: true });
  
  try {
    const files = await readdir(PUBLIC_UPLOADS);
    const imageFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) && !file.startsWith('.');
    });

    if (imageFiles.length === 0) {
      console.log('No images to optimize');
      return;
    }

    console.log(`📦 Found ${imageFiles.length} images to optimize`);

    for (const file of imageFiles) {
      const inputPath = join(PUBLIC_UPLOADS, file);
      const baseName = basename(file, extname(file));

      // Create optimized versions for each breakpoint
      for (const [breakpointKey, breakpoint] of Object.entries(BREAKPOINTS)) {
        const outputName = `${baseName}-${breakpoint.label}.webp`;
        const outputPath = join(OPTIMIZED_DIR, outputName);

        try {
          await sharp(inputPath)
            .resize(breakpoint.width, breakpoint.height, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .webp({ quality: 80 })
            .toFile(outputPath);

          console.log(`✓ Optimized: ${file} → ${outputName} (${breakpoint.width}x${breakpoint.height})`);
        } catch (error) {
          console.error(`✗ Failed to optimize ${file} for ${breakpoint.label}:`, error.message);
        }
      }
    }

    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error reading upload directory:', error.message);
  }
}

optimizeImages();