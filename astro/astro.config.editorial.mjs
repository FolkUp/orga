// ORGA Editorial Build Integration Configuration
// Enhanced Alice v2.0 - Astro build process integration

import { validateBuild } from './scripts/build-integration.js';

// Editorial validation plugin for Astro
function editorialValidation(options = {}) {
  return {
    name: 'editorial-validation',
    hooks: {
      'astro:build:start': async ({ buildConfig, logger }) => {
        const enforcement = options.enforcement || 'STRICT';

        logger.info('🔍 Running editorial validation...');

        try {
          const result = await validateBuild({ enforcement });

          if (result.success) {
            logger.info(`✅ Editorial validation passed (${result.exclusions} files filtered)`);
            if (result.exclusions > 0) {
              logger.warn(`⚠️  ${result.exclusions} files excluded from build - see ${result.reportPath}`);
            }
          } else {
            logger.error('❌ Editorial validation failed');
            throw new Error(`Build blocked by editorial quality gates. See: ${result.reportPath}`);
          }
        } catch (error) {
          if (enforcement === 'STRICT') {
            logger.error(`Editorial validation error: ${error.message}`);
            throw error;
          } else {
            logger.warn(`Editorial validation warning: ${error.message}`);
          }
        }
      },

      'astro:build:done': async ({ buildConfig, logger }) => {
        logger.info('📝 Editorial validation complete - build ready for deployment');
      }
    }
  };
}

// Editorial content filtering integration
function editorialContentFilter() {
  return {
    name: 'editorial-content-filter',
    hooks: {
      'astro:build:setup': async ({ vite, buildConfig, logger }) => {
        // Read editorial exclusions if they exist
        const exclusionsPath = new URL('.editorial-exclusions', import.meta.url);
        let exclusions = [];

        try {
          const fs = await import('fs/promises');
          const exclusionContent = await fs.readFile(exclusionsPath, 'utf-8');
          exclusions = exclusionContent.trim().split('\n').filter(line => line.trim());

          if (exclusions.length > 0) {
            logger.info(`🚫 Filtering ${exclusions.length} files based on editorial review`);
          }
        } catch (error) {
          // No exclusions file or read error - proceed normally
        }

        // Configure Vite to exclude files that failed editorial review
        if (exclusions.length > 0) {
          vite.plugins.push({
            name: 'editorial-exclusions',
            resolveId(id) {
              // Check if this file should be excluded
              const isExcluded = exclusions.some(exclusion =>
                id.includes(exclusion) || id.endsWith(exclusion)
              );

              if (isExcluded) {
                logger.warn(`🚫 Excluding from build: ${id}`);
                return false; // Don't resolve - effectively exclude from build
              }
            }
          });
        }
      }
    }
  };
}

// Export plugins for integration into main astro.config.mjs
export {
  editorialValidation,
  editorialContentFilter
};

// Example integration for main astro.config.mjs:
/*
import { defineConfig } from 'astro/config';
import { editorialValidation, editorialContentFilter } from './astro.config.editorial.mjs';

export default defineConfig({
  integrations: [
    // ... other integrations
    editorialValidation({
      enforcement: 'STRICT' // Options: STRICT, MODERATE, PERMISSIVE
    }),
    editorialContentFilter()
  ],
  // ... rest of config
});
*/