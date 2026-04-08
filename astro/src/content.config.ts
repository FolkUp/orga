import { defineCollection, z } from 'astro:content';

/**
 * ORGA Content Collections
 * Type-safe content schema for multimedia investigations
 */
const investigations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    date_updated: z.coerce.date().optional(),
    status: z.enum(['draft', 'stub', 'unverified', 'partially_verified', 'verified']).default('draft'),
    confidence: z.enum(['high', 'medium', 'low']).default('low'),
    legal_risk: z.enum(['low', 'medium', 'high']).optional(),
    pii_reviewed: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.string()).default([]),
    // ORGA-specific fields
    subject: z.string().optional(),
    language: z.enum(['ru', 'en', 'pt']).default('ru'),
  }),
});

const legal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    date_updated: z.coerce.date().optional(),
    language: z.enum(['ru', 'en', 'pt']).default('ru'),
  }),
});

export const collections = {
  investigations,
  legal,
};
