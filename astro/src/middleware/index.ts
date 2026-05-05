/**
 * ORGA Phase 3B Middleware Pipeline
 * Orchestrates authentication, security, and ecosystem integration
 */

import { sequence } from 'astro:middleware';
import { authMiddleware } from './auth.js';

// Middleware execution sequence for Phase 3B
export const onRequest = sequence(
  authMiddleware
);

// Re-export auth utilities for API routes
export { requirePermission, checkRateLimit, type AuthContext } from './auth.js';