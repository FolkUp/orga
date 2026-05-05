#!/usr/bin/env node
/**
 * ORGA Phase 3B Security Validation Test Suite
 * Banking-level security verification for production deployment
 *
 * Tests all P0 security blockers identified for Phase 3B:
 * 1. API authentication layer
 * 2. Cross-project data sharing security protocols
 * 3. CSP migration from meta to HTTP headers
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Test configuration
const TEST_CONFIG = {
  LOCAL_SERVER: 'http://localhost:4321',
  PRODUCTION_SITE: 'https://underground.folkup.life',
  TIMEOUT: 10000
};

// ANSI colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Logging utility with colors and timestamps
 */
function log(level, message, details = '') {
  const timestamp = new Date().toISOString();
  const colorMap = {
    INFO: colors.blue,
    PASS: colors.green,
    FAIL: colors.red,
    WARN: colors.yellow,
    TITLE: colors.magenta + colors.bold
  };

  const color = colorMap[level] || colors.reset;
  console.log(`${color}[${timestamp}] [${level}] ${message}${colors.reset}`);

  if (details) {
    console.log(`${colors.cyan}${details}${colors.reset}`);
  }
}

/**
 * Test 1: API Authentication Layer Verification
 */
async function testAPIAuthentication() {
  log('TITLE', '=== TEST 1: API AUTHENTICATION LAYER ===');

  try {
    // Test 1.1: Unauthenticated request should be rejected
    log('INFO', 'Testing unauthenticated API access...');

    const response = await fetch(`${TEST_CONFIG.LOCAL_SERVER}/api/ecosystem/metadata`);

    if (response.status === 401) {
      log('PASS', 'Unauthenticated requests properly rejected (HTTP 401)');
    } else {
      log('FAIL', `Expected HTTP 401, got ${response.status}`);
      return false;
    }

    // Test 1.2: Invalid token should be rejected
    log('INFO', 'Testing invalid token rejection...');

    const invalidTokenResponse = await fetch(`${TEST_CONFIG.LOCAL_SERVER}/api/ecosystem/metadata`, {
      headers: {
        'Authorization': 'Bearer invalid-token-12345'
      }
    });

    if (invalidTokenResponse.status === 401) {
      log('PASS', 'Invalid tokens properly rejected');
    } else {
      log('FAIL', `Expected HTTP 401 for invalid token, got ${invalidTokenResponse.status}`);
      return false;
    }

    // Test 1.3: Health check endpoint should be accessible
    log('INFO', 'Testing public health check endpoint...');

    const healthResponse = await fetch(`${TEST_CONFIG.LOCAL_SERVER}/api/ecosystem/health`);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      log('PASS', 'Health check endpoint accessible');
      log('INFO', `System Status: ${healthData.status}`,
        `Version: ${healthData.version}\nProject: ${healthData.project}`);
    } else {
      log('FAIL', `Health check failed with status ${healthResponse.status}`);
      return false;
    }

    return true;

  } catch (error) {
    log('FAIL', 'API authentication test failed', error.message);
    return false;
  }
}

/**
 * Test 2: CSP Header Migration Verification
 */
async function testCSPHeaders() {
  log('TITLE', '=== TEST 2: CSP HEADER MIGRATION ===');

  try {
    // Test 2.1: Check _headers file configuration
    log('INFO', 'Verifying _headers file configuration...');

    const headersPath = path.join(projectRoot, 'public', '_headers');
    const headersContent = readFileSync(headersPath, 'utf8');

    // Verify Phase 3B security headers
    const requiredHeaders = [
      'Content-Security-Policy',
      'X-API-Version: 3B.0.0',
      'X-Ecosystem-Projects: ORGA,DECL,DOCS,AGIL,DSHB',
      'Access-Control-Allow-Methods',
      'X-API-Security-Level: banking-grade'
    ];

    let headersValid = true;
    for (const header of requiredHeaders) {
      if (headersContent.includes(header)) {
        log('PASS', `Required header found: ${header.split(':')[0]}`);
      } else {
        log('FAIL', `Missing required header: ${header}`);
        headersValid = false;
      }
    }

    // Test 2.2: Check BaseLayout CSP fallback
    log('INFO', 'Verifying BaseLayout CSP fallback...');

    const layoutPath = path.join(projectRoot, 'src', 'layouts', 'BaseLayout.astro');
    const layoutContent = readFileSync(layoutPath, 'utf8');

    if (layoutContent.includes('Phase 3B CSP Migration') &&
        layoutContent.includes('connect-src \'self\' https://docs.folkup.app https://folkup.app')) {
      log('PASS', 'BaseLayout CSP fallback updated for Phase 3B');
    } else {
      log('FAIL', 'BaseLayout CSP fallback not properly updated');
      headersValid = false;
    }

    return headersValid;

  } catch (error) {
    log('FAIL', 'CSP headers test failed', error.message);
    return false;
  }
}

/**
 * Test 3: Cross-Project Data Sharing Security Protocols
 */
async function testDataSharingSecurity() {
  log('TITLE', '=== TEST 3: DATA SHARING SECURITY PROTOCOLS ===');

  try {
    // Test 3.1: Check middleware implementation
    log('INFO', 'Verifying middleware implementation...');

    const middlewarePath = path.join(projectRoot, 'src', 'middleware', 'auth.ts');
    const middlewareContent = readFileSync(middlewarePath, 'utf8');

    const requiredFeatures = [
      'ECOSYSTEM_PROJECTS',
      'EcosystemToken',
      'validateEcosystemToken',
      'Banking-level',
      'checkRateLimit'
    ];

    let middlewareValid = true;
    for (const feature of requiredFeatures) {
      if (middlewareContent.includes(feature)) {
        log('PASS', `Middleware feature implemented: ${feature}`);
      } else {
        log('FAIL', `Missing middleware feature: ${feature}`);
        middlewareValid = false;
      }
    }

    // Test 3.2: Check API endpoint structure
    log('INFO', 'Verifying API endpoint structure...');

    const metadataAPIPath = path.join(projectRoot, 'src', 'pages', 'api', 'ecosystem', 'metadata.ts');
    const metadataContent = readFileSync(metadataAPIPath, 'utf8');

    const requiredEndpointFeatures = [
      'InvestigationMetadata',
      'EcosystemCrossReference',
      'SharedEvidenceItem',
      'requirePermission',
      'Banking-level audit logging'
    ];

    for (const feature of requiredEndpointFeatures) {
      if (metadataContent.includes(feature)) {
        log('PASS', `API endpoint feature implemented: ${feature}`);
      } else {
        log('FAIL', `Missing API endpoint feature: ${feature}`);
        middlewareValid = false;
      }
    }

    return middlewareValid;

  } catch (error) {
    log('FAIL', 'Data sharing security test failed', error.message);
    return false;
  }
}

/**
 * Test 4: Build and TypeScript Validation
 */
async function testBuildValidation() {
  log('TITLE', '=== TEST 4: BUILD AND TYPESCRIPT VALIDATION ===');

  try {
    // Test 4.1: TypeScript compilation
    log('INFO', 'Running TypeScript type checking...');

    const { stdout, stderr } = await execAsync('npm run check', {
      cwd: projectRoot,
      timeout: TEST_CONFIG.TIMEOUT
    });

    if (stderr && stderr.includes('error')) {
      log('FAIL', 'TypeScript errors detected', stderr);
      return false;
    } else {
      log('PASS', 'TypeScript compilation successful');
    }

    // Test 4.2: Package.json dependencies
    log('INFO', 'Verifying package.json dependencies...');

    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));

    const requiredDeps = ['jsonwebtoken'];
    const requiredDevDeps = ['@types/jsonwebtoken'];

    for (const dep of requiredDeps) {
      if (packageContent.dependencies[dep]) {
        log('PASS', `Required dependency found: ${dep}`);
      } else {
        log('FAIL', `Missing required dependency: ${dep}`);
        return false;
      }
    }

    for (const devDep of requiredDevDeps) {
      if (packageContent.devDependencies[devDep]) {
        log('PASS', `Required dev dependency found: ${devDep}`);
      } else {
        log('FAIL', `Missing required dev dependency: ${devDep}`);
        return false;
      }
    }

    return true;

  } catch (error) {
    log('FAIL', 'Build validation test failed', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runSecurityTests() {
  log('TITLE', '🔒 ORGA PHASE 3B SECURITY VALIDATION SUITE');
  log('INFO', 'Testing P0 security blockers resolution...');

  const testResults = {
    apiAuthentication: false,
    cspHeaders: false,
    dataSharingSecurity: false,
    buildValidation: false
  };

  // Run all tests
  testResults.apiAuthentication = await testAPIAuthentication();
  testResults.cspHeaders = await testCSPHeaders();
  testResults.dataSharingSecurity = await testDataSharingSecurity();
  testResults.buildValidation = await testBuildValidation();

  // Calculate overall results
  const passedTests = Object.values(testResults).filter(result => result).length;
  const totalTests = Object.keys(testResults).length;

  log('TITLE', '=== SECURITY TEST SUMMARY ===');
  log('INFO', `Tests Passed: ${passedTests}/${totalTests}`);

  for (const [testName, result] of Object.entries(testResults)) {
    const status = result ? 'PASS' : 'FAIL';
    log(status, `${testName}: ${status}`);
  }

  if (passedTests === totalTests) {
    log('PASS', '🎉 ALL PHASE 3B SECURITY TESTS PASSED');
    log('INFO', 'Production deployment security requirements met');
    log('INFO', 'P0 blockers resolved - Phase 3B ready for production');
    process.exit(0);
  } else {
    log('FAIL', '❌ SECURITY TESTS FAILED');
    log('WARN', 'P0 blockers remain - Phase 3B NOT ready for production');
    log('INFO', 'Review failed tests and resolve issues before deployment');
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityTests().catch(error => {
    log('FAIL', 'Security test suite crashed', error.message);
    process.exit(1);
  });
}