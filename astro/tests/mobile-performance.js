/**
 * Protocol 4: Mobile Device Performance Test
 * Target: Timeline component mobile performance validation
 * Framework: Playwright mobile emulation + throttling
 */

import { chromium } from 'playwright';

// Test configuration
const CONFIG = {
  devices: [
    { name: 'iPhone 12 Pro', width: 390, height: 844, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
    { name: 'Pixel 5', width: 393, height: 851, userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36' }
  ],
  throttling: {
    cpu: 4, // 4x slowdown
    network: 'Slow 3G' // ~500kb/s down, 500kb/s up, 400ms latency
  },
  thresholds: {
    scroll: { green: 60, yellow: 30 }, // fps
    touch: { green: 16, yellow: 100 } // ms
  },
  iterations: {
    scroll: 5,
    touch: 3,
    memory: 3
  }
};

async function measureMobilePerformance() {
  console.log('🚀 Protocol 4: Mobile Device Performance');
  console.log('========================================');

  const browser = await chromium.launch({ headless: false });
  const results = {};

  for (const device of CONFIG.devices) {
    console.log(`\n📱 Testing ${device.name}...`);

    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      userAgent: device.userAgent,
      deviceScaleFactor: 3, // Mobile DPR
    });

    const page = await context.newPage();

    // Enable CPU throttling
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: CONFIG.throttling.cpu });

    // Enable network throttling (Slow 3G)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 400,
      downloadThroughput: 500 * 1024 / 8, // 500kb/s
      uploadThroughput: 500 * 1024 / 8
    });

    try {
      // Navigate to timeline demo page
      await page.goto('http://localhost:4321/timeline-demo');
      await page.waitForSelector('.timeline-container', { timeout: 10000 });

      const deviceResults = {
        device: device.name,
        viewport: `${device.width}x${device.height}`,
        scroll: await measureScrollPerformance(page),
        touch: await measureTouchLatency(page),
        memory: await measureMemoryUsage(page, client)
      };

      results[device.name] = deviceResults;

    } catch (error) {
      console.error(`❌ Error testing ${device.name}:`, error.message);
      results[device.name] = { error: error.message };
    }

    await context.close();
  }

  await browser.close();
  return results;
}

async function measureScrollPerformance(page) {
  console.log('  📏 Measuring scroll performance...');

  const scrollResults = [];

  for (let i = 0; i < CONFIG.iterations.scroll; i++) {
    await page.evaluate(() => {
      // Reset scroll position
      document.querySelector('.timeline-container').scrollTop = 0;
    });

    // Start performance measurement
    const startTime = Date.now();
    let frameCount = 0;

    const frames = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const container = document.querySelector('.timeline-container');
        const frames = [];
        let lastTime = performance.now();

        function measureFrame() {
          const currentTime = performance.now();
          const frameDelta = currentTime - lastTime;
          frames.push({ time: currentTime, delta: frameDelta });
          lastTime = currentTime;

          if (frames.length < 60) { // Measure ~1 second at 60fps
            requestAnimationFrame(measureFrame);
          } else {
            resolve(frames);
          }
        }

        // Start scrolling animation
        container.scrollBy({ top: 2000, behavior: 'smooth' });
        requestAnimationFrame(measureFrame);
      });
    });

    // Calculate FPS
    const avgFrameDelta = frames.reduce((sum, frame) => sum + frame.delta, 0) / frames.length;
    const fps = 1000 / avgFrameDelta;

    scrollResults.push({ iteration: i + 1, fps: Math.round(fps) });
    console.log(`    Iteration ${i + 1}: ${Math.round(fps)} fps`);
  }

  const avgFps = scrollResults.reduce((sum, result) => sum + result.fps, 0) / scrollResults.length;
  const status = avgFps >= CONFIG.thresholds.scroll.green ? 'GREEN' :
                avgFps >= CONFIG.thresholds.scroll.yellow ? 'YELLOW' : 'RED';

  return {
    iterations: scrollResults,
    average: Math.round(avgFps),
    status,
    threshold: CONFIG.thresholds.scroll
  };
}

async function measureTouchLatency(page) {
  console.log('  👆 Measuring touch latency...');

  const touchResults = [];

  for (let i = 0; i < CONFIG.iterations.touch; i++) {
    const latency = await page.evaluate(() => {
      return new Promise((resolve) => {
        const timeline = document.querySelector('.timeline-container');
        const startTime = performance.now();

        // Use click event as touch interaction fallback (more reliable)
        const clickHandler = () => {
          const latency = performance.now() - startTime;
          timeline.removeEventListener('click', clickHandler);
          resolve(latency);
        };

        timeline.addEventListener('click', clickHandler);

        // Simulate click/touch at center of viewport
        const rect = timeline.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2
        });

        timeline.dispatchEvent(clickEvent);
      });
    });

    touchResults.push({ iteration: i + 1, latency: Math.round(latency) });
    console.log(`    Iteration ${i + 1}: ${Math.round(latency)}ms`);
  }

  const avgLatency = touchResults.reduce((sum, result) => sum + result.latency, 0) / touchResults.length;
  const medianLatency = touchResults.sort((a, b) => a.latency - b.latency)[Math.floor(touchResults.length / 2)].latency;
  const stdev = Math.sqrt(touchResults.reduce((sum, result) => sum + Math.pow(result.latency - avgLatency, 2), 0) / touchResults.length);

  const status = medianLatency <= CONFIG.thresholds.touch.green ? 'GREEN' :
                medianLatency <= CONFIG.thresholds.touch.yellow ? 'YELLOW' : 'RED';

  return {
    iterations: touchResults,
    average: Math.round(avgLatency),
    median: Math.round(medianLatency),
    stdev: Math.round(stdev),
    status,
    threshold: CONFIG.thresholds.touch
  };
}

async function measureMemoryUsage(page, client) {
  console.log('  🧠 Measuring memory usage...');

  const memoryResults = [];

  for (let i = 0; i < CONFIG.iterations.memory; i++) {
    // Trigger timeline interactions
    await page.evaluate(() => {
      const container = document.querySelector('.timeline-container');
      // Simulate heavy scrolling
      for (let j = 0; j < 10; j++) {
        container.scrollTop = j * 200;
      }
    });

    // Get memory metrics
    const metrics = await client.send('Runtime.getHeapUsage');
    const memoryMB = Math.round(metrics.usedSize / 1024 / 1024);

    memoryResults.push({ iteration: i + 1, memory: memoryMB });
    console.log(`    Iteration ${i + 1}: ${memoryMB}MB`);
  }

  const avgMemory = memoryResults.reduce((sum, result) => sum + result.memory, 0) / memoryResults.length;
  const maxMemory = Math.max(...memoryResults.map(r => r.memory));

  return {
    iterations: memoryResults,
    average: Math.round(avgMemory),
    peak: maxMemory,
    unit: 'MB'
  };
}

function generateReport(results) {
  console.log('\n📊 Mobile Performance Report');
  console.log('=============================');

  let overallStatus = 'GREEN';

  Object.entries(results).forEach(([deviceName, data]) => {
    if (data.error) {
      console.log(`\n❌ ${deviceName}: ERROR - ${data.error}`);
      overallStatus = 'RED';
      return;
    }

    console.log(`\n📱 ${deviceName} (${data.viewport})`);
    console.log(`   Scroll: ${data.scroll.average}fps (${data.scroll.status})`);
    console.log(`   Touch: ${data.touch.median}ms ±${data.touch.stdev}ms (${data.touch.status})`);
    console.log(`   Memory: ${data.memory.average}MB avg, ${data.memory.peak}MB peak`);

    // Update overall status
    if (data.scroll.status === 'RED' || data.touch.status === 'RED') {
      overallStatus = 'RED';
    } else if ((data.scroll.status === 'YELLOW' || data.touch.status === 'YELLOW') && overallStatus !== 'RED') {
      overallStatus = 'YELLOW';
    }
  });

  console.log(`\n🎯 DECISION_FRAMEWORK_SCROLL: ${results['iPhone 12 Pro']?.scroll?.status || 'UNKNOWN'}`);
  console.log(`🎯 DECISION_FRAMEWORK_TOUCH: ${results['iPhone 12 Pro']?.touch?.status || 'UNKNOWN'}`);
  console.log(`📊 MOBILE_PERFORMANCE_STATUS: ${overallStatus === 'GREEN' ? 'COMPLETE' : 'BLOCKED'}`);

  // Mobile UX Assessment
  const uxAssessment = overallStatus === 'GREEN'
    ? 'Excellent mobile experience with smooth scrolling and responsive touch interactions'
    : overallStatus === 'YELLOW'
    ? 'Acceptable mobile experience with minor performance impacts'
    : 'Poor mobile experience requiring optimization';

  console.log(`📱 MOBILE_UX_ASSESSMENT: ${uxAssessment}`);

  // Timeline Mobile Readiness
  const mobileReadiness = overallStatus === 'GREEN'
    ? 'Timeline component optimized for mobile devices'
    : 'Timeline component requires mobile performance optimization';

  console.log(`⚡ TIMELINE_MOBILE_READINESS: ${mobileReadiness}`);

  return {
    status: overallStatus === 'GREEN' ? 'COMPLETE' : 'BLOCKED',
    results,
    assessment: {
      scroll: results['iPhone 12 Pro']?.scroll?.status || 'UNKNOWN',
      touch: results['iPhone 12 Pro']?.touch?.status || 'UNKNOWN',
      ux: uxAssessment,
      readiness: mobileReadiness
    }
  };
}

// Main execution
measureMobilePerformance()
  .then(generateReport)
  .catch(console.error);

export { measureMobilePerformance, generateReport };