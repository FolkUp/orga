#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const staticDir = path.join(projectRoot, 'static', 'images');

console.log('🖼️  Optimizing images...\n');

if (!fs.existsSync(staticDir)) {
  console.log('📂 No images directory found, creating...');
  fs.mkdirSync(staticDir, { recursive: true });
  process.exit(0);
}

const imageFiles = getAllImageFiles(staticDir);
let optimized = 0;

for (const file of imageFiles) {
  const ext = path.extname(file).toLowerCase();

  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const webpPath = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    if (!fs.existsSync(webpPath)) {
      try {
        await sharp(file)
          .webp({ quality: 85 })
          .toFile(webpPath);

        console.log(`✅ Converted: ${path.basename(file)} → ${path.basename(webpPath)}`);
        optimized++;
      } catch (error) {
        console.error(`❌ Failed to convert ${path.basename(file)}: ${error.message}`);
      }
    }
  }
}

function getAllImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png|gif|svg)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

console.log(`\n🎯 Optimized ${optimized} images`);