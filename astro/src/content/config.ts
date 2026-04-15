import { z, defineCollection } from 'astro:content';

// Investigation schema based on existing Hugo frontmatter
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
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lastmod: z.date().optional(),
    draft: z.boolean().optional().default(false),
    page_type: z.enum(['privacy_policy', 'terms_of_use', 'cookie_policy', 'disclaimer']).optional(),
  })
});

export const collections = {
  'investigations': investigationsCollection,
  'legal': legalCollection,
};