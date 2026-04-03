#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Required frontmatter fields for investigation content
const requiredFields = {
  investigations: ['title', 'status', 'confidence', 'tags', 'sources', 'date_created', 'date_updated']
};

let errors = 0;

console.log('🔍 Validating ORGA investigation site...\n');

// Check Hugo configuration
const configPath = path.join(projectRoot, 'config/_default/hugo.yaml');
if (!fs.existsSync(configPath)) {
  console.error('❌ Missing Hugo configuration file');
  errors++;
}

// Validate content files
const contentDir = path.join(projectRoot, 'content');
if (fs.existsSync(contentDir)) {
  const files = getAllMarkdownFiles(contentDir);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) {
      console.error(`❌ ${path.relative(projectRoot, file)}: Missing frontmatter`);
      errors++;
      continue;
    }

    // Determine content type based on path
    const relativePath = path.relative(contentDir, file);
    const contentType = getContentType(relativePath);

    if (contentType && requiredFields[contentType]) {
      const missing = requiredFields[contentType].filter(field => !frontmatter[field]);
      if (missing.length > 0) {
        console.error(`❌ ${path.relative(projectRoot, file)}: Missing required fields: ${missing.join(', ')}`);
        errors++;
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

function extractFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    // Simple YAML parsing for validation
    const yaml = match[1];
    const fields = {};

    yaml.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (value && value !== '[]' && value !== '""' && value !== "''") {
          fields[key] = value;
        }
      }
    });

    return fields;
  } catch (e) {
    return null;
  }
}

function getContentType(relativePath) {
  if (relativePath.startsWith('investigations/')) return 'investigations';
  return null;
}

if (errors === 0) {
  console.log('✅ Site validation passed');
  process.exit(0);
} else {
  console.log(`\n❌ Found ${errors} validation errors`);
  process.exit(1);
}