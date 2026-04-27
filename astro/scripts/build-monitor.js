#!/usr/bin/env node

/**
 * Build Performance Monitor
 * Tracks bundle sizes, build times, and performance metrics
 */

import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const BASELINE_BUILD_TIME = 4250; // 4.25s baseline (ms)
const BASELINE_BUNDLE_SIZE = 600000; // ~600KB baseline (bytes) - full site with assets
const MAX_BUILD_TIME = 8000; // 8s warning threshold (ms)

async function getDirectorySize(dirPath) {
    try {
        const files = await readdir(dirPath, { withFileTypes: true });
        let totalSize = 0;

        for (const file of files) {
            const filePath = join(dirPath, file.name);
            if (file.isDirectory()) {
                totalSize += await getDirectorySize(filePath);
            } else {
                const stats = await stat(filePath);
                totalSize += stats.size;
            }
        }

        return totalSize;
    } catch (error) {
        return 0;
    }
}

async function analyzeBundleSizes() {
    const distPath = './dist';
    const assetsPath = join(distPath, '_assets');

    try {
        const totalSize = await getDirectorySize(distPath);
        const assetsSize = await getDirectorySize(assetsPath);
        const htmlSize = totalSize - assetsSize;

        return {
            total: totalSize,
            assets: assetsSize,
            html: htmlSize
        };
    } catch (error) {
        console.warn('Could not analyze bundle sizes:', error.message);
        return null;
    }
}

async function logMetrics(buildTime, bundleSizes) {
    const timestamp = new Date().toISOString();
    const metrics = {
        timestamp,
        buildTime,
        bundleSizes,
        performance: {
            buildTimeVsBaseline: buildTime / BASELINE_BUILD_TIME,
            bundleSizeVsBaseline: bundleSizes ? bundleSizes.total / BASELINE_BUNDLE_SIZE : null,
            warnings: []
        }
    };

    // Performance warnings
    if (buildTime > MAX_BUILD_TIME) {
        metrics.performance.warnings.push(`Build time ${buildTime}ms exceeds threshold ${MAX_BUILD_TIME}ms`);
    }

    if (bundleSizes && bundleSizes.total > BASELINE_BUNDLE_SIZE * 2) {
        metrics.performance.warnings.push(`Bundle size ${bundleSizes.total} bytes significantly increased`);
    }

    // Output for CI/monitoring
    console.log('BUILD METRICS:', JSON.stringify(metrics, null, 2));

    // Log to file (optional)
    try {
        const logPath = './.build-metrics.json';
        await writeFile(logPath, JSON.stringify(metrics, null, 2));
    } catch (error) {
        // Silent fail - not critical
    }

    return metrics;
}

async function main() {
    // For local development, build time monitoring is simplified
    // CI/CD environments can set BUILD_START_TIME environment variable
    const buildStartTime = process.env.BUILD_START_TIME;
    const buildTime = buildStartTime ? Date.now() - parseInt(buildStartTime) : BASELINE_BUILD_TIME;

    const bundleSizes = await analyzeBundleSizes();
    const metrics = await logMetrics(buildTime, bundleSizes);

    // Exit with warning code if performance degradation detected
    if (metrics.performance.warnings.length > 0) {
        console.warn('Performance warnings detected:', metrics.performance.warnings);
        process.exit(2); // Warning exit code
    }

    console.log('Build performance monitoring completed successfully');
}

main().catch(error => {
    console.error('Build monitoring failed:', error);
    process.exit(1);
});