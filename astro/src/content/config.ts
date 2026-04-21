import { z, defineCollection } from 'astro:content';

// Investigation schema — cultural-analysis articles with source metadata
const investigationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    lastmod: z.date().optional(),
    draft: z.boolean().optional().default(false),

    // Investigation metadata
    investigation_type: z.enum(['cultural_analysis', 'institutional', 'biographical', 'media']),
    status: z.enum(['verified', 'partially_verified', 'unverified', 'draft']),
    confidence: z.enum(['high', 'medium', 'low']),

    // Content classification
    tags: z.array(z.string()),
    categories: z.array(z.string()).optional(),

    // Evidence tracking
    evidence_count: z.number().optional(),
    timeline_span: z.string().optional(),
    featured_image: z.string().optional(),

    // Sources array with typed objects
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().url().optional(),
      date: z.string().optional(),
      archive_url: z.string().url().optional(),
      type: z.enum(['primary', 'secondary', 'media', 'academic', 'government']).optional()
    })).optional(),

    // Legal compliance fields
    pii_reviewed: z.boolean().optional(),
    pii_reviewed_by: z.string().optional(),
    pii_review_date: z.date().optional(),
    naming_justified: z.boolean().optional(),
    legal_risk: z.enum(['low', 'medium', 'high']).optional(),
    legal_approved_by: z.string().optional(),

    // Review metadata
    reviewed_by: z.string().optional(),
    review_date: z.date().optional(),

    // Multi-language support
    languages: z.array(z.string()).optional().default(['en']),

    // SEO
    description: z.string().optional(),
    keywords: z.string().optional()
  })
});

// Legal pages collection (Privacy Policy, Terms, etc.)
// Bilingual via suffix pattern: privacy-policy.md (EN) + privacy-policy.ru.md (RU).
// translations[lang].slug points at sibling entry's collection slug (e.g. "privacy-policy.ru"
// for the RU sibling). Route template: /legal/<slug>/ for EN, /legal/ru/<baseSlug>/ for RU.
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lastmod: z.date().optional(),
    draft: z.boolean().optional().default(false),
    page_type: z.enum(['privacy_policy', 'terms_of_use', 'cookie_policy', 'disclaimer', 'ai_transparency']).optional(),
    language: z.enum(['ru', 'en']).default('en'),
    translations: z.record(z.object({
      status: z.enum(['pending', 'in_progress', 'done']),
      slug: z.string().optional(),
    })).optional(),
  })
});

// Premium Longform collection — personal-essay music/culture criticism
// First entry: organizatsiya.md (Command FolkUp byline, 2026-04-20)
const longformCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    byline: z.string(),
    byline_note: z.string().optional(),

    date: z.date(),
    lastmod: z.date().optional(),
    language: z.enum(['ru', 'en', 'pt']).default('ru'),
    word_count: z.number().optional(),

    // Subject of criticism
    subject_artist: z.string().optional(),
    subject_work: z.string().optional(),
    subject_work_release: z.date().optional(),
    subject_album: z.string().optional(),
    subject_album_release: z.date().optional(),
    subject_director: z.string().optional(),
    subject_duration: z.string().optional(),

    // Classification
    longform_type: z.enum(['personal-essay-criticism', 'reportage', 'hybrid']).default('personal-essay-criticism'),
    genre: z.string(),
    register: z.enum(['premium', 'standard']).default('premium'),
    tags: z.array(z.string()),

    // Banking-level verification metadata
    fact_verified: z.boolean(),
    fact_verified_by: z.string().optional(),
    fact_verified_date: z.date().optional(),
    fact_verification_reports: z.array(z.string()).optional(),

    legal_reviewed: z.boolean(),
    legal_reviewed_by: z.string().optional(),
    legal_risk: z.enum(['low', 'medium', 'high']).default('low'),

    editorial_reviewed: z.boolean(),
    editorial_reviewed_by: z.array(z.string()).optional(),

    hostile_verified: z.boolean(),
    hostile_verified_by: z.array(z.string()).optional(),

    // Compliance
    pii_reviewed: z.boolean(),
    pii_reviewed_by: z.string().optional(),
    pii_review_date: z.date().optional(),
    naming_justified: z.boolean(),
    author_artwork_separation_predicate: z.string().optional(),

    // Sources (typed, superset of investigations schema)
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().url().optional(),
      file: z.string().optional(),
      date: z.union([z.date(), z.string()]).optional(),
      type: z.enum(['primary', 'news', 'government', 'media', 'legislation', 'academic', 'secondary']).optional()
    })).optional(),

    // Audio embed (premium longform specific)
    audio_embed: z.object({
      primary: z.enum(['spotify', 'youtube', 'apple']).default('spotify'),
      spotify_track_id: z.string().optional(),
      youtube_video_id: z.string().optional(),
      platforms: z.array(z.object({
        name: z.string(),
        url: z.string().url()
      })).optional(),
      embed_placement_marker: z.string().optional(),
      consent_required: z.boolean().default(true)
    }).optional(),

    // SEO
    description: z.string().optional(),

    // Social-share / OG image (optional; falls back to site-wide default in BaseLayout).
    // Path is /public-relative, e.g. "/og/organizatsiya.jpg". BaseLayout resolves to
    // absolute URL via Astro.site at build time — must be JPEG/PNG ≥1200×630 for spec.
    og_image: z.string().optional(),
    og_image_alt: z.string().optional(),
    og_image_credit: z.string().optional(),

    // Translation tracking — `slug` points at the sibling entry's collection slug
    // (e.g. "organizatsiya" for RU, "en/organizatsiya" for EN). Required when
    // status === "done" for hreflang/alternates resolution; optional otherwise.
    translations: z.record(z.object({
      status: z.enum(['pending', 'in_progress', 'done']),
      priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
      slug: z.string().optional(),
      notes: z.string().optional()
    })).optional()
  })
});

export const collections = {
  'investigations': investigationsCollection,
  'legal': legalCollection,
  'longform': longformCollection,
};