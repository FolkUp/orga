/// <reference path="../.astro/types.d.ts" />

// Phase 3B: Enhanced environment types for ecosystem integration
declare namespace App {
  interface Locals {
    auth: import('./middleware').AuthContext;
  }
}

// Environment variables for Phase 3B
interface ImportMetaEnv {
  readonly ORGA_API_SECRET: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly ADDITIONAL_ORIGINS: string;
  readonly ENABLE_ECOSYSTEM_API: string;
  readonly ENABLE_METADATA_SHARING: string;
  readonly ENABLE_CROSS_PROJECT_AUTH: string;
  readonly API_RATE_LIMIT_DEFAULT: string;
  readonly API_RATE_LIMIT_ECOSYSTEM: string;
  readonly API_RATE_LIMIT_ADMIN: string;
  readonly BUILD_PHASE: string;
  readonly ECOSYSTEM_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Phase 3B: Global constants
declare const __DATE__: string;
declare const __PHASE__: string;
declare const __ECOSYSTEM_VERSION__: string;