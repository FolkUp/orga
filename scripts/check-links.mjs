#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log('🔗 Checking internal links...\n');

let brokenLinks = 0;

// Get all markdown files
const contentDir = path.join(projectRoot, 'content');
if (fs.existsSync(contentDir)) {
  const markdownFiles = getAllMarkdownFiles(contentDir);

  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractInternalLinks(content);

    for (const link of links) {
      if (!validateInternalLink(link, contentDir)) {
        console.error(`❌ ${path.relative(projectRoot, file)}: Broken link "${link}"`);
        brokenLinks++;
      }
    }
  }
}

function getAllMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractInternalLinks(content) {
  const links = [];

  // Hugo relref links: {{< relref "path" >}}
  const relrefMatches = content.matchAll(/\{\{<\s*relref\s+"([^"]+)"\s*>\}\}/g);
  for (const match of relrefMatches) {
    links.push(match[1]);
  }

  // Markdown internal links: [text](path)
  const markdownMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
  for (const match of markdownMatches) {
    const href = match[2];
    if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
      links.push(href);
    }
  }

  return links;
}

function validateInternalLink(link, contentDir) {
  // Remove anchor fragments
  const cleanLink = link.split('#')[0];

  if (!cleanLink) return true; // Just anchor

  // Try different possible file paths
  const possiblePaths = [
    path.join(contentDir, cleanLink),
    path.join(contentDir, cleanLink, 'index.md'),
    path.join(contentDir, cleanLink + '.md')
  ];

  return possiblePaths.some(p => fs.existsSync(p));
}

if (brokenLinks === 0) {
  console.log('✅ All internal links are valid');
  process.exit(0);
} else {
  console.log(`\n❌ Found ${brokenLinks} broken links`);
  process.exit(1);
}