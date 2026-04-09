/**
 * ORGA Astro Migration — i18n Bridge
 *
 * Provides Hugo-compatible internationalization functionality
 * Compatible with Hugo's i18n YAML structure and template functions:
 * - {{ i18n "key" }}
 * - {{ i18n "key" . }}
 * - {{ i18n "key" (dict "Count" 5) }}
 */

import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { join } from 'node:path';

// Types for Hugo i18n structure
interface I18nEntry {
  one?: string;
  other?: string;
  zero?: string;
  [key: string]: any;
}

interface I18nData {
  [section: string]: {
    [key: string]: string | I18nEntry;
  };
}

interface I18nContext {
  Count?: number;
  Date?: string | Date;
  [key: string]: any;
}

// Global cache for loaded i18n data
const i18nCache = new Map<string, I18nData>();

// Default language fallback
const DEFAULT_LANG = 'en';

// Supported languages (based on ORGA's bilingual approach)
const SUPPORTED_LANGS = ['en', 'ru'] as const;
type SupportedLang = typeof SUPPORTED_LANGS[number];

/**
 * Load and parse i18n YAML file
 * Compatible with Hugo's i18n YAML structure
 */
function loadI18nData(lang: string): I18nData {
  const cacheKey = lang;

  if (i18nCache.has(cacheKey)) {
    return i18nCache.get(cacheKey)!;
  }

  try {
    // For Astro migration: try local files first, then Hugo theme as fallback
    const localPath = join(process.cwd(), 'src', 'i18n', `${lang}.yaml`);
    let yamlContent: string;

    try {
      yamlContent = readFileSync(localPath, 'utf-8');
    } catch (localError) {
      // Fallback to Hugo theme i18n files (for compatibility)
      const themePath = join(process.cwd(), '..', 'themes', 'blowfish', 'i18n', `${lang}.yaml`);
      yamlContent = readFileSync(themePath, 'utf-8');
    }

    const data = parseYaml(yamlContent) as I18nData;
    i18nCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`Failed to load i18n data for language "${lang}":`, error);

    // Return empty structure on error
    const emptyData: I18nData = {};
    i18nCache.set(cacheKey, emptyData);
    return emptyData;
  }
}

/**
 * Get nested value from i18n data using dot notation
 * Examples: "article.reading_time", "error.404_title"
 */
function getNestedValue(data: I18nData, key: string): string | I18nEntry | undefined {
  const keys = key.split('.');
  let current: any = data;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Process pluralization based on count
 * Compatible with Hugo's pluralization rules
 */
function handlePluralization(entry: I18nEntry, count?: number): string {
  if (typeof entry === 'string') {
    return entry;
  }

  // If no count provided, use 'other' or first available
  if (count === undefined) {
    return entry.other || entry.one || Object.values(entry)[0] || '';
  }

  // Hugo pluralization rules (simplified)
  if (count === 0 && entry.zero) {
    return entry.zero;
  } else if (count === 1 && entry.one) {
    return entry.one;
  } else if (entry.other) {
    return entry.other;
  }

  // Fallback to any available value
  return entry.one || Object.values(entry)[0] || '';
}

/**
 * Replace template variables in string
 * Compatible with Hugo's template syntax: {{ .Count }}, {{ .Date }}
 */
function replaceVariables(template: string, context?: I18nContext): string {
  if (!context) {
    return template;
  }

  let result = template;

  // Replace {{ .Variable }} patterns
  Object.entries(context).forEach(([key, value]) => {
    const pattern = new RegExp(`\\{\\{\\s*\\.${key}\\s*\\}\\}`, 'g');
    const replacement = value?.toString() || '';
    result = result.replace(pattern, replacement);
  });

  return result;
}

/**
 * Main i18n function - compatible with Hugo's i18n template function
 *
 * Usage:
 * - i18n(lang, 'article.reading_time', { Count: 5 })
 * - i18n(lang, 'error.404_title')
 * - i18n(lang, 'article.date', { Date: new Date() })
 */
export function i18n(lang: string, key: string, context?: I18nContext): string {
  // Ensure language is supported
  const normalizedLang = SUPPORTED_LANGS.includes(lang as SupportedLang)
    ? lang as SupportedLang
    : DEFAULT_LANG;

  // Load i18n data
  const data = loadI18nData(normalizedLang);

  // Get the value for the key
  let value = getNestedValue(data, key);

  // Fallback to default language if not found
  if (value === undefined && normalizedLang !== DEFAULT_LANG) {
    const defaultData = loadI18nData(DEFAULT_LANG);
    value = getNestedValue(defaultData, key);
  }

  // If still not found, return the key itself (Hugo behavior)
  if (value === undefined) {
    console.warn(`i18n key "${key}" not found for language "${normalizedLang}"`);
    return key;
  }

  // Handle pluralization if value is an object
  let result: string;
  if (typeof value === 'object') {
    result = handlePluralization(value, context?.Count);
  } else {
    result = value;
  }

  // Replace template variables
  result = replaceVariables(result, context);

  return result;
}

/**
 * Get current language from Astro context
 * Compatible with Hugo's language detection
 */
export function getCurrentLang(astroUrl?: URL): SupportedLang {
  if (!astroUrl) {
    return DEFAULT_LANG;
  }

  // Extract language from URL pathname
  // Support patterns: /en/path, /ru/path, or path.en.html, path.ru.html
  const pathname = astroUrl.pathname;

  // Check for language prefix
  for (const lang of SUPPORTED_LANGS) {
    if (pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`) {
      return lang;
    }
  }

  // Check for language suffix in filename
  for (const lang of SUPPORTED_LANGS) {
    if (pathname.includes(`.${lang}.`)) {
      return lang;
    }
  }

  return DEFAULT_LANG;
}

/**
 * Hugo-compatible t function alias
 * Usage: t('article.reading_time', { Count: 5 })
 */
export function t(key: string, context?: I18nContext, lang?: string): string {
  const currentLang = lang || DEFAULT_LANG;
  return i18n(currentLang, key, context);
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): readonly SupportedLang[] {
  return SUPPORTED_LANGS;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(lang: string): lang is SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang);
}

/**
 * Get language-specific metadata for HTML
 */
export function getLanguageMeta(lang: string): {
  htmlLang: string;
  dir: 'ltr' | 'rtl';
  name: string;
} {
  const normalizedLang = isLanguageSupported(lang) ? lang : DEFAULT_LANG;

  // Language metadata
  const langMeta = {
    en: { htmlLang: 'en', dir: 'ltr' as const, name: 'English' },
    ru: { htmlLang: 'ru', dir: 'ltr' as const, name: 'Русский' },
  };

  return langMeta[normalizedLang];
}

/**
 * Format date according to language locale
 * Compatible with Hugo's date formatting patterns
 */
export function formatDate(date: Date | string, lang: string, format?: string): string {
  const normalizedLang = isLanguageSupported(lang) ? lang : DEFAULT_LANG;
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format) {
    // Custom format handling could be added here
    // For now, use locale-specific default
    return dateObj.toLocaleDateString(normalizedLang);
  }

  // Default locale formatting
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return dateObj.toLocaleDateString(normalizedLang, options);
}

/**
 * Create i18n-aware URL
 * Handles language prefixes compatible with Hugo's URL structure
 */
export function localizeUrl(path: string, lang: string, currentLang?: string): string {
  const targetLang = isLanguageSupported(lang) ? lang : DEFAULT_LANG;
  const basePath = path.startsWith('/') ? path.slice(1) : path;

  // If targeting default language, return path without prefix
  if (targetLang === DEFAULT_LANG) {
    return `/${basePath}`;
  }

  // Add language prefix
  return `/${targetLang}/${basePath}`;
}

// Export the cache for testing/debugging
export { i18nCache };