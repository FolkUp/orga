{#if showAccessibility}
  <TimelineAccessibility {timelineData} />
{/if}

<div
  class="enhanced-timeline-container"
  bind:this={timelineContainer}
  role="application"
  aria-label="Interactive 333-day cultural prophecy timeline with integrated framework analysis"
>
  <!-- Underground Academia Header -->
  <header class="timeline-header underground-header">
    <div class="document-classification">
      <div class="classification-stamps">
        <span class="classification-stamp primary">UNDERGROUND ACADEMIA</span>
        <span class="classification-stamp secondary">CULTURAL ANALYSIS</span>
      </div>
      <div class="archival-metadata">
        <span class="document-series">UA-TIMELINE-001</span>
        <span class="security-level">DECLASSIFIED</span>
      </div>
    </div>

    <h2 class="timeline-title">333-Day Cultural Prophecy Arc</h2>
    <p class="timeline-subtitle">Integrated Framework Analysis: Nov 8, 2021 — Oct 7, 2022</p>

    <div class="framework-indicators">
      <div class="framework-badge meme-lifecycle">
        <span class="badge-icon">🧬</span>
        <span class="badge-label">Meme Lifecycle</span>
      </div>
      <div class="framework-badge musical-seismography">
        <span class="badge-icon">📊</span>
        <span class="badge-label">Musical Seismography</span>
      </div>
      <div class="framework-badge hero-narrative">
        <span class="badge-icon">⚔️</span>
        <span class="badge-label">Hero Narrative</span>
      </div>
      <div class="framework-badge underground-academia">
        <span class="badge-icon">📜</span>
        <span class="badge-label">Underground Docs</span>
      </div>
    </div>

    <div class="timeline-meta">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{timelineData.keyEvents.length}</span>
          <span class="stat-label">Cultural Events</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">333</span>
          <span class="stat-label">Days Tracked</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{Object.keys(memeLifecyclePhases).length}</span>
          <span class="stat-label">Meme Phases</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{culturalAnalysis.predictionAccuracy.overallAccuracy * 100}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Enhanced Timeline Controls -->
  <div class="enhanced-timeline-controls">
    <TimelineControls
      {playbackState}
      {currentEventIndex}
      totalEvents={timelineData.keyEvents.length}
      on:play={startPlayback}
      on:pause={pausePlayback}
      on:scrub={handleScrub}
      on:speed={changeSpeed}
      on:filter={filterEvents}
    />

    <!-- Framework Filter Controls -->
    <div class="framework-filters">
      <div class="filter-section">
        <label class="filter-label">Meme Phase:</label>
        <select bind:value={selectedMemePhase} on:change={applyFrameworkFilters}>
          <option value="">All Phases</option>
          <option value="germination">Germination</option>
          <option value="incubation">Incubation</option>
          <option value="activation">Activation</option>
          <option value="institutionalization">Institutionalization</option>
        </select>
      </div>

      <div class="filter-section">
        <label class="filter-label">Hero Arc:</label>
        <select bind:value={selectedHeroArc} on:change={applyFrameworkFilters}>
          <option value="">All Arcs</option>
          <option value="prophecy">Prophecy</option>
          <option value="validation">Validation</option>
          <option value="recognition">Recognition</option>
        </select>
      </div>

      <div class="filter-section">
        <label class="filter-label">Seismic Level:</label>
        <select bind:value={selectedSeismicLevel} on:change={applyFrameworkFilters}>
          <option value="">All Levels</option>
          <option value="low">2.0-4.0</option>
          <option value="medium">4.0-6.0</option>
          <option value="high">6.0-8.0</option>
          <option value="seismic">8.0+</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Cultural Phase Visualization -->
  <div class="cultural-phases-overlay">
    {#each Object.entries(memeLifecyclePhases) as [phaseKey, phase]}
      <div
        class="phase-region"
        class:active={isPhaseActive(phase)}
        data-phase={phaseKey}
        style="
          left: {(phase.period.startDay / 333) * 100}%;
          width: {((phase.period.endDay - phase.period.startDay) / 333) * 100}%;
        "
        title="{phase.name}: {phase.description}"
      >
        <div class="phase-label">
          <span class="phase-name">{phase.name}</span>
          <span class="phase-duration">Days {phase.period.startDay}-{phase.period.endDay}</span>
        </div>
        <div class="phase-velocity-indicator" style="height: {phase.velocity * 100}%"></div>
      </div>
    {/each}
  </div>

  <!-- Main Timeline Viewport -->
  <div class="timeline-viewport">
    <!-- Hero Narrative Arc Visualization -->
    <div class="hero-arc-track">
      {#each Object.entries(heroNarrativeArc) as [arcKey, arc]}
        <div
          class="arc-region"
          data-arc={arcKey}
          style="
            left: {(arc.period.startDay / 333) * 100}%;
            width: {((arc.period.endDay - arc.period.startDay) / 333) * 100}%;
          "
          title="{arc.name}: {arc.description}"
        >
          <div class="arc-tension-wave" data-tension={arc.tension}></div>
        </div>
      {/each}
    </div>

    <!-- Musical Seismography Track -->
    <div class="seismography-track">
      <canvas
        bind:this={seismographCanvas}
        class="seismograph-canvas"
        width="1200"
        height="60"
        aria-label="Cultural seismograph showing intensity over time"
      ></canvas>

      <div class="seismograph-scale">
        <div class="scale-marker" data-level="2.0">2.0</div>
        <div class="scale-marker" data-level="4.0">4.0</div>
        <div class="scale-marker" data-level="6.0">6.0</div>
        <div class="scale-marker" data-level="8.0">8.0</div>
        <div class="scale-marker" data-level="10.0">10.0</div>
      </div>
    </div>

    <!-- Enhanced Timeline Axis -->
    <TimelineAxis
      {timelineData}
      {currentEventIndex}
      {visibleEvents}
      {zoomLevel}
      on:scrub={handleAxisScrub}
    />

    <!-- Enhanced Event Markers -->
    <div class="timeline-events" bind:this={eventsContainer}>
      {#each visibleEvents as event, index (event.id)}
        <EnhancedEventMarker
          {event}
          eventIndex={index}
          active={currentEventIndex === index}
          culturalImpact={event.culturalImpact}
          significance={event.significance}
          on:select={() => selectEvent(index)}
          on:hover={() => previewEvent(event)}
          on:evidence={() => openEvidence(event.evidenceId)}
        />
      {/each}
    </div>

    <!-- Timeline Progress Enhancement -->
    <div class="timeline-progress-indicator">
      <div class="progress-track">
        <!-- Meme velocity indicator -->
        <div
          class="velocity-progress"
          style="width: {progressPercentage}%"
          data-velocity={getCurrentMemeVelocity()}
        ></div>

        <!-- Hero tension indicator -->
        <div
          class="tension-progress"
          style="width: {progressPercentage}%"
          data-tension={getCurrentHeroTension()}
        ></div>
      </div>
    </div>
  </div>

  <!-- Enhanced Cultural Legend -->
  <div class="enhanced-cultural-legend">
    <!-- Framework Integration Panel -->
    <div class="framework-integration-panel">
      <h3>Integrated Cultural Analysis</h3>

      <div class="correlation-matrix">
        {#each culturalAnalysis.correlationPatterns as pattern}
          <div class="correlation-item">
            <div class="correlation-name">{pattern.name}</div>
            <div class="correlation-value">{(pattern.correlation * 100).toFixed(0)}%</div>
            <div class="correlation-insight">{pattern.insight}</div>
          </div>
        {/each}
      </div>

      <div class="resonance-display">
        <h4>Cultural Resonance (85 BPM)</h4>
        <div class="resonance-visualizer">
          {#each culturalAnalysis.resonanceMapping.culturalHarmonics as harmonic}
            <div
              class="resonance-bar"
              style="height: {harmonic.amplitude * 100}%"
              title="{harmonic.phase}: {harmonic.frequency} Hz"
            ></div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Traditional Legend -->
    <div class="traditional-legend">
      <div class="legend-section cultural-impact">
        <h4>Cultural Impact</h4>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-marker" data-impact="seismic"></div>
            <span>Seismic Cultural Shift (8.0+ magnitude)</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker" data-impact="high"></div>
            <span>Major Cultural Moment (6.0-8.0)</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker" data-impact="medium"></div>
            <span>Notable Development (4.0-6.0)</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker" data-impact="low"></div>
            <span>Background Event (2.0-4.0)</span>
          </div>
        </div>
      </div>

      <div class="legend-section meme-phases">
        <h4>Meme Lifecycle</h4>
        <div class="legend-items">
          <div class="legend-item">
            <div class="phase-indicator" data-phase="germination"></div>
            <span>Germination (Days 0-45)</span>
          </div>
          <div class="legend-item">
            <div class="phase-indicator" data-phase="incubation"></div>
            <span>Incubation (Days 45-108)</span>
          </div>
          <div class="legend-item">
            <div class="phase-indicator" data-phase="activation"></div>
            <span>Activation (Days 108-200)</span>
          </div>
          <div class="legend-item">
            <div class="phase-indicator" data-phase="institutionalization"></div>
            <span>Institutionalization (Days 200-333)</span>
          </div>
        </div>
      </div>

      <div class="legend-section hero-arc">
        <h4>Hero Narrative Arc</h4>
        <div class="legend-items">
          <div class="legend-item">
            <div class="arc-indicator" data-arc="prophecy"></div>
            <span>Prophecy (Underground Oracle)</span>
          </div>
          <div class="legend-item">
            <div class="arc-indicator" data-arc="validation"></div>
            <span>Validation (Truth Proven)</span>
          </div>
          <div class="legend-item">
            <div class="arc-indicator" data-arc="recognition"></div>
            <span>Recognition (Cultural Monument)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{#if selectedEvent}
  <EventModal
    event={selectedEvent}
    on:close={closeModal}
    on:evidence={openEvidence}
    on:navigate={navigateFromModal}
  />
{/if}

<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import TimelineAxis from './TimelineAxis.svelte';
  import EnhancedEventMarker from './EnhancedEventMarker.svelte';
  import EventModal from './EventModal.svelte';
  import TimelineControls from './TimelineControls.svelte';
  import TimelineAccessibility from './TimelineAccessibility.svelte';

  // Import enhanced data
  import {
    enhancedTimelineData,
    memeLifecyclePhases,
    heroNarrativeArc,
    culturalAnalysis
  } from '../../data/enhancedTimelineData.js';

  // Props
  export let timelineData = enhancedTimelineData;
  export let evidenceGallery = null;
  export let onEvidence = null;

  // Component state
  let timelineContainer;
  let eventsContainer;
  let seismographCanvas;
  let visibleEvents = [];
  let currentEventIndex = 0;
  let selectedEvent = null;
  let showAccessibility = false;

  // Framework filtering state
  let selectedMemePhase = '';
  let selectedHeroArc = '';
  let selectedSeismicLevel = '';

  // Playback state
  let playbackState = writable({
    playing: false,
    speed: 1,
    direction: 1
  });

  // Performance optimization
  let intersectionObserver;
  let resizeObserver;
  let animationFrame;
  let seismographAnimationFrame;

  // Cultural tempo synchronization (85 BPM)
  const culturalTempo = {
    baseBPM: 85,
    timeScale: 1000, // 1 day per second
    get syncFactor() { return this.baseBPM / 60; }
  };

  // Zoom and viewport management
  let zoomLevel = writable(1);
  let viewport = writable({ width: 0, height: 0 });

  // Derived state
  const progressPercentage = derived(
    [playbackState],
    ([$playback]) => (currentEventIndex / (timelineData.keyEvents.length - 1)) * 100
  );

  const filteredEvents = derived(
    [playbackState],
    ([$playback]) => {
      let events = timelineData.keyEvents;

      // Apply framework filters
      if (selectedMemePhase) {
        events = events.filter(event =>
          event.memeLifecycle?.phase === selectedMemePhase
        );
      }

      if (selectedHeroArc) {
        events = events.filter(event =>
          event.heroNarrative?.arc === selectedHeroArc
        );
      }

      if (selectedSeismicLevel) {
        const magnitude = event => event.musicalSeismography?.magnitude || 2.0;
        events = events.filter(event => {
          const mag = magnitude(event);
          switch (selectedSeismicLevel) {
            case 'low': return mag >= 2.0 && mag < 4.0;
            case 'medium': return mag >= 4.0 && mag < 6.0;
            case 'high': return mag >= 6.0 && mag < 8.0;
            case 'seismic': return mag >= 8.0;
            default: return true;
          }
        });
      }

      // Apply standard filters if any
      if ($playback.filter) {
        events = events.filter(event =>
          event.significance === $playback.filter ||
          event.culturalImpact === $playback.filter
        );
      }

      return events;
    }
  );

  // Performance-optimized visible events calculation
  $: {
    updateVisibleEvents();
  }

  $: {
    // Redraw seismograph when data changes
    if (seismographCanvas) {
      drawSeismograph();
    }
  }

  function updateVisibleEvents() {
    if (!timelineContainer || !$filteredEvents.length) return;

    const containerRect = timelineContainer.getBoundingClientRect();
    const margin = containerRect.width * 0.5; // Load events 50% outside viewport

    visibleEvents = $filteredEvents.filter((event, index) => {
      const eventPosition = calculateEventPosition(index);
      return eventPosition >= -margin && eventPosition <= containerRect.width + margin;
    });
  }

  function calculateEventPosition(eventIndex) {
    const totalWidth = timelineContainer?.scrollWidth || 0;
    return (eventIndex / (timelineData.keyEvents.length - 1)) * totalWidth;
  }

  // Enhanced seismograph visualization
  function drawSeismograph() {
    if (!seismographCanvas) return;

    const ctx = seismographCanvas.getContext('2d');
    const width = seismographCanvas.width;
    const height = seismographCanvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal grid lines (magnitude levels)
    for (let mag = 2; mag <= 10; mag += 2) {
      const y = height - (mag / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical grid lines (time divisions)
    for (let day = 0; day <= 333; day += 33.3) {
      const x = (day / 333) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw seismic readings
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#8B4513';

    const seismicData = timelineData.musicalSeismography?.seismicReadings || [];

    if (seismicData.length > 1) {
      ctx.beginPath();

      seismicData.forEach((reading, index) => {
        const x = (reading.day / 333) * width;
        const y = height - (reading.magnitude / 10) * height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw magnitude points
      ctx.fillStyle = '#8B4513';
      seismicData.forEach(reading => {
        const x = (reading.day / 333) * width;
        const y = height - (reading.magnitude / 10) * height;
        const radius = Math.max(2, reading.magnitude / 2);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight seismic events
        if (reading.magnitude >= 8.0) {
          ctx.strokeStyle = '#D32F2F';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 2;
        }
      });
    }

    // Draw current position indicator
    if (currentEventIndex >= 0 && currentEventIndex < timelineData.keyEvents.length) {
      const currentEvent = timelineData.keyEvents[currentEventIndex];
      const x = (currentEvent.dayNumber / 333) * width;

      ctx.strokeStyle = '#FFBF00';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Framework filter application
  function applyFrameworkFilters() {
    // Trigger reactivity
    updateVisibleEvents();
  }

  // Phase activity detection
  function isPhaseActive(phase) {
    if (currentEventIndex < 0 || currentEventIndex >= timelineData.keyEvents.length) {
      return false;
    }

    const currentDay = timelineData.keyEvents[currentEventIndex].dayNumber;
    return currentDay >= phase.period.startDay && currentDay <= phase.period.endDay;
  }

  // Current state getters
  function getCurrentMemeVelocity() {
    if (currentEventIndex < 0 || currentEventIndex >= timelineData.keyEvents.length) {
      return 0.3;
    }
    return timelineData.keyEvents[currentEventIndex].memeLifecycle?.velocity || 0.3;
  }

  function getCurrentHeroTension() {
    if (currentEventIndex < 0 || currentEventIndex >= timelineData.keyEvents.length) {
      return 'neutral';
    }
    return timelineData.keyEvents[currentEventIndex].heroNarrative?.tension || 'neutral';
  }

  // Timeline navigation
  function selectEvent(index) {
    currentEventIndex = index;
    selectedEvent = timelineData.keyEvents[index];

    // Smooth scroll to event
    animateToEvent(index);

    // Announce to screen reader
    announceEvent(selectedEvent);

    // Update seismograph
    if (seismographCanvas) {
      drawSeismograph();
    }
  }

  function animateToEvent(eventIndex, smooth = true) {
    if (!timelineContainer) return;

    const targetPosition = calculateEventPosition(eventIndex);

    if (smooth) {
      timelineContainer.scrollTo({
        left: targetPosition - (timelineContainer.clientWidth / 2),
        behavior: 'smooth'
      });
    } else {
      timelineContainer.scrollLeft = targetPosition - (timelineContainer.clientWidth / 2);
    }
  }

  // Playback controls
  function startPlayback() {
    playbackState.update(state => ({ ...state, playing: true }));

    const playInterval = setInterval(() => {
      playbackState.update(state => {
        if (!state.playing) {
          clearInterval(playInterval);
          return state;
        }

        const nextIndex = currentEventIndex + 1;
        if (nextIndex >= timelineData.keyEvents.length) {
          clearInterval(playInterval);
          return { ...state, playing: false };
        }

        selectEvent(nextIndex);
        return state;
      });
    }, culturalTempo.timeScale / ($playbackState.speed || 1));
  }

  function pausePlayback() {
    playbackState.update(state => ({ ...state, playing: false }));
  }

  function handleScrub(event) {
    const { position } = event.detail;
    const targetIndex = Math.round(position * (timelineData.keyEvents.length - 1));
    selectEvent(targetIndex);
  }

  function handleAxisScrub(event) {
    handleScrub(event);
  }

  function changeSpeed(event) {
    const { speed } = event.detail;
    playbackState.update(state => ({ ...state, speed }));
  }

  function filterEvents(event) {
    const { filter } = event.detail;
    playbackState.update(state => ({ ...state, filter }));
  }

  // Event interaction
  function previewEvent(event) {
    // Enhanced preview with framework data
  }

  function closeModal() {
    selectedEvent = null;
  }

  function openEvidence(evidenceId) {
    if (onEvidence) {
      onEvidence(evidenceId);
    }
  }

  function navigateFromModal(event) {
    const { direction } = event.detail;
    const currentIndex = timelineData.keyEvents.indexOf(selectedEvent);

    if (direction === 'next' && currentIndex < timelineData.keyEvents.length - 1) {
      selectEvent(currentIndex + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      selectEvent(currentIndex - 1);
    }
  }

  // Accessibility
  function announceEvent(event) {
    if ('speechSynthesis' in window) {
      const frameworks = [
        event.memeLifecycle?.phase,
        event.heroNarrative?.arc,
        `magnitude ${event.musicalSeismography?.magnitude?.toFixed(1) || '2.0'}`
      ].filter(Boolean).join(', ');

      const announcement = `${event.title} on ${formatDate(event.date)}. ${frameworks}. ${event.description}`;
      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.rate = 1.2;
      speechSynthesis.speak(utterance);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Keyboard navigation
  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentEventIndex > 0) {
          selectEvent(currentEventIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentEventIndex < timelineData.keyEvents.length - 1) {
          selectEvent(currentEventIndex + 1);
        }
        break;
      case ' ':
        event.preventDefault();
        if ($playbackState.playing) {
          pausePlayback();
        } else {
          startPlayback();
        }
        break;
      case 'Escape':
        event.preventDefault();
        closeModal();
        break;
    }
  }

  // Intersection Observer for performance
  function setupIntersectionObserver() {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Event is visible, ensure it's loaded
          } else {
            // Event is not visible, can be unloaded if needed
          }
        });
      },
      {
        root: timelineContainer,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }

  // Resize observer for responsive behavior
  function setupResizeObserver() {
    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        viewport.update(() => ({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        }));
        updateVisibleEvents();

        // Resize seismograph canvas
        if (seismographCanvas) {
          const rect = seismographCanvas.parentElement.getBoundingClientRect();
          seismographCanvas.width = rect.width;
          drawSeismograph();
        }
      }
    });

    if (timelineContainer) {
      resizeObserver.observe(timelineContainer);
    }
  }

  // Lifecycle
  onMount(() => {
    setupIntersectionObserver();
    setupResizeObserver();

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      culturalTempo.timeScale = 2000; // Slower animations
    }

    // Check for high contrast mode
    showAccessibility = window.matchMedia('(prefers-contrast: high)').matches;

    // Initialize timeline position
    selectEvent(0);

    // Add keyboard listeners
    document.addEventListener('keydown', handleKeydown);

    // Initial seismograph draw
    if (seismographCanvas) {
      setTimeout(() => {
        const rect = seismographCanvas.parentElement.getBoundingClientRect();
        seismographCanvas.width = rect.width;
        drawSeismograph();
      }, 100);
    }
  });

  onDestroy(() => {
    if (intersectionObserver) intersectionObserver.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (seismographAnimationFrame) cancelAnimationFrame(seismographAnimationFrame);

    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<style>
  .enhanced-timeline-container {
    /* Underground Academia Color Palette */
    --underground-sepia: #8B4513;
    --underground-graphite: #2F4F4F;
    --underground-amber: #FFBF00;
    --underground-ivory: #FEFCF6;
    --underground-charcoal: #36454F;

    /* Enhanced color mappings */
    --color-primary: var(--underground-sepia);
    --color-accent: var(--underground-graphite);
    --color-warning: var(--underground-amber);
    --color-light: var(--underground-ivory);
    --color-border: rgba(139, 69, 19, 0.2);
    --color-critical: #D32F2F;

    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Source Sans 3', system-ui, sans-serif;
    background: var(--underground-ivory);
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(139, 69, 19, 0.15);
    overflow: hidden;
  }

  /* Underground Academia Header */
  .underground-header {
    background: linear-gradient(135deg, var(--underground-sepia), var(--underground-graphite));
    color: var(--underground-ivory);
    padding: 2rem;
    position: relative;
  }

  .underground-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(254,252,246,0.05)"/><circle cx="80" cy="40" r="0.5" fill="rgba(254,252,246,0.03)"/><circle cx="40" cy="80" r="1.5" fill="rgba(254,252,246,0.04)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }

  .document-classification {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
  }

  .classification-stamps {
    display: flex;
    gap: 0.5rem;
  }

  .classification-stamp {
    background: rgba(254, 252, 246, 0.2);
    border: 1px solid rgba(254, 252, 246, 0.3);
    padding: 4px 8px;
    border-radius: 3px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .classification-stamp.primary {
    background: rgba(255, 191, 0, 0.2);
    border-color: rgba(255, 191, 0, 0.4);
    color: var(--underground-amber);
  }

  .archival-metadata {
    text-align: right;
    opacity: 0.8;
  }

  .document-series {
    display: block;
    margin-bottom: 2px;
  }

  .security-level {
    color: #4CAF50;
    font-weight: bold;
  }

  .timeline-title {
    position: relative;
    z-index: 1;
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .timeline-subtitle {
    position: relative;
    z-index: 1;
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0 0 2rem 0;
    opacity: 0.9;
  }

  .framework-indicators {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .framework-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(254, 252, 246, 0.15);
    border: 1px solid rgba(254, 252, 246, 0.2);
    border-radius: 20px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }

  .framework-badge:hover {
    background: rgba(254, 252, 246, 0.25);
    transform: translateY(-1px);
  }

  .badge-icon {
    font-size: 1rem;
  }

  .badge-label {
    font-weight: 500;
  }

  .stats-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 2rem;
    margin-top: 1rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--underground-amber);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .stat-label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 0.25rem;
  }

  /* Enhanced Timeline Controls */
  .enhanced-timeline-controls {
    background: rgba(254, 252, 246, 0.8);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--color-border);
    padding: 1.5rem;
  }

  .framework-filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--underground-sepia);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-section select {
    background: var(--underground-ivory);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 0.9rem;
    color: var(--underground-graphite);
    transition: border-color 0.2s ease;
  }

  .filter-section select:focus {
    outline: none;
    border-color: var(--underground-sepia);
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.1);
  }

  /* Cultural Phase Visualization */
  .cultural-phases-overlay {
    position: relative;
    height: 60px;
    background: linear-gradient(to right,
      rgba(255, 191, 0, 0.1) 0%,
      rgba(139, 69, 19, 0.1) 32.4%,
      rgba(211, 47, 47, 0.1) 64.8%,
      rgba(47, 79, 79, 0.1) 100%);
    border-bottom: 1px solid var(--color-border);
    overflow: hidden;
  }

  .phase-region {
    position: absolute;
    top: 0;
    bottom: 0;
    border-right: 1px dashed rgba(139, 69, 19, 0.3);
    transition: all 0.3s ease;
  }

  .phase-region.active {
    background: rgba(139, 69, 19, 0.1);
    box-shadow: inset 0 0 0 2px var(--underground-sepia);
  }

  .phase-region[data-phase="germination"] {
    background: linear-gradient(to bottom, rgba(255, 191, 0, 0.2), rgba(255, 191, 0, 0.05));
  }

  .phase-region[data-phase="incubation"] {
    background: linear-gradient(to bottom, rgba(139, 69, 19, 0.2), rgba(139, 69, 19, 0.05));
  }

  .phase-region[data-phase="activation"] {
    background: linear-gradient(to bottom, rgba(211, 47, 47, 0.2), rgba(211, 47, 47, 0.05));
  }

  .phase-region[data-phase="institutionalization"] {
    background: linear-gradient(to bottom, rgba(47, 79, 79, 0.2), rgba(47, 79, 79, 0.05));
  }

  .phase-label {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--underground-graphite);
    text-shadow: 0 1px 2px rgba(254, 252, 246, 0.8);
  }

  .phase-name {
    display: block;
  }

  .phase-duration {
    display: block;
    font-size: 0.65rem;
    opacity: 0.8;
    margin-top: 1px;
  }

  .phase-velocity-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(139, 69, 19, 0.6), transparent);
    transition: height 0.3s ease;
  }

  /* Main Timeline Viewport */
  .timeline-viewport {
    position: relative;
    height: 400px;
    overflow-x: auto;
    overflow-y: hidden;
    background: var(--underground-ivory);
    scroll-behavior: smooth;
  }

  /* Hero Narrative Arc Track */
  .hero-arc-track {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 5;
  }

  .arc-region {
    position: absolute;
    top: 0;
    bottom: 0;
    opacity: 0.7;
  }

  .arc-region[data-arc="prophecy"] {
    background: linear-gradient(45deg, rgba(255, 191, 0, 0.1), rgba(255, 191, 0, 0.2));
  }

  .arc-region[data-arc="validation"] {
    background: linear-gradient(45deg, rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.2));
  }

  .arc-region[data-arc="recognition"] {
    background: linear-gradient(45deg, rgba(47, 79, 79, 0.1), rgba(47, 79, 79, 0.2));
  }

  .arc-tension-wave {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .arc-tension-wave[data-tension="anticipation"] {
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      rgba(255, 191, 0, 0.1) 10px,
      rgba(255, 191, 0, 0.1) 20px
    );
    animation: anticipationWave 4s ease-in-out infinite;
  }

  .arc-tension-wave[data-tension="revelation"] {
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 5px,
      rgba(139, 69, 19, 0.2) 5px,
      rgba(139, 69, 19, 0.2) 10px
    );
    animation: revelationWave 2s ease-in-out infinite;
  }

  .arc-tension-wave[data-tension="resolution"] {
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 15px,
      rgba(47, 79, 79, 0.15) 15px,
      rgba(47, 79, 79, 0.15) 30px
    );
    animation: resolutionWave 6s ease-in-out infinite;
  }

  @keyframes anticipationWave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-10px); }
  }

  @keyframes revelationWave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-5px); }
  }

  @keyframes resolutionWave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-15px); }
  }

  /* Musical Seismography Track */
  .seismography-track {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    height: 80px;
    background: rgba(254, 252, 246, 0.9);
    border-bottom: 1px solid var(--color-border);
    z-index: 10;
  }

  .seismograph-canvas {
    width: 100%;
    height: 60px;
    display: block;
  }

  .seismograph-scale {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 20px;
    width: 40px;
    background: rgba(139, 69, 19, 0.05);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
  }

  .scale-marker {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: var(--underground-graphite);
    text-align: center;
  }

  /* Timeline Events */
  .timeline-events {
    position: relative;
    top: 120px;
    height: 200px;
    display: flex;
    align-items: center;
    padding: 2rem;
    min-width: 100%;
  }

  /* Enhanced Timeline Progress */
  .timeline-progress-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    z-index: 20;
  }

  .progress-track {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(139, 69, 19, 0.1);
  }

  .velocity-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 50%;
    background: linear-gradient(90deg, var(--underground-amber), var(--underground-sepia));
    transition: width 0.3s ease;
  }

  .tension-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 50%;
    background: linear-gradient(90deg, var(--underground-graphite), var(--underground-sepia));
    transition: width 0.3s ease;
  }

  /* Enhanced Cultural Legend */
  .enhanced-cultural-legend {
    background: rgba(254, 252, 246, 0.95);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--color-border);
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .framework-integration-panel h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--underground-sepia);
    margin: 0 0 1.5rem 0;
    text-align: center;
  }

  .correlation-matrix {
    margin-bottom: 2rem;
  }

  .correlation-item {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: rgba(139, 69, 19, 0.05);
    border-radius: 6px;
  }

  .correlation-name {
    font-weight: 600;
    color: var(--underground-graphite);
  }

  .correlation-value {
    font-family: 'Courier New', monospace;
    font-weight: bold;
    color: var(--underground-sepia);
    text-align: right;
  }

  .correlation-insight {
    grid-column: 1 / -1;
    font-size: 0.85rem;
    color: var(--underground-graphite);
    opacity: 0.8;
    font-style: italic;
  }

  .resonance-display h4 {
    font-size: 1rem;
    color: var(--underground-graphite);
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .resonance-visualizer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    height: 60px;
    background: rgba(139, 69, 19, 0.1);
    border-radius: 6px;
    padding: 8px;
  }

  .resonance-bar {
    flex: 1;
    max-width: 16px;
    background: linear-gradient(to top, var(--underground-sepia), var(--underground-amber));
    border-radius: 2px 2px 0 0;
    transition: height 0.3s ease;
  }

  .traditional-legend {
    display: grid;
    gap: 2rem;
  }

  .legend-section h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--underground-sepia);
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .legend-items {
    display: grid;
    gap: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: var(--underground-graphite);
  }

  .legend-marker,
  .phase-indicator,
  .arc-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid;
    flex-shrink: 0;
  }

  .legend-marker[data-impact="seismic"] {
    border-color: #D32F2F;
    background: #D32F2F;
    box-shadow: 0 0 8px rgba(211, 47, 47, 0.5);
  }

  .legend-marker[data-impact="high"] {
    border-color: var(--underground-sepia);
    background: var(--underground-sepia);
  }

  .legend-marker[data-impact="medium"] {
    border-color: var(--underground-amber);
    background: var(--underground-amber);
  }

  .legend-marker[data-impact="low"] {
    border-color: var(--underground-graphite);
    background: transparent;
  }

  .phase-indicator[data-phase="germination"] {
    border-color: var(--underground-amber);
    background: linear-gradient(45deg, var(--underground-amber), rgba(255, 191, 0, 0.5));
  }

  .phase-indicator[data-phase="incubation"] {
    border-color: var(--underground-sepia);
    background: linear-gradient(45deg, var(--underground-sepia), rgba(139, 69, 19, 0.5));
  }

  .phase-indicator[data-phase="activation"] {
    border-color: #D32F2F;
    background: linear-gradient(45deg, #D32F2F, rgba(211, 47, 47, 0.5));
  }

  .phase-indicator[data-phase="institutionalization"] {
    border-color: var(--underground-graphite);
    background: linear-gradient(45deg, var(--underground-graphite), rgba(47, 79, 79, 0.5));
  }

  .arc-indicator[data-arc="prophecy"] {
    border-color: var(--underground-amber);
    background: var(--underground-amber);
    position: relative;
  }

  .arc-indicator[data-arc="validation"] {
    border-color: var(--underground-sepia);
    background: var(--underground-sepia);
    animation: validationPulse 2s ease-in-out infinite;
  }

  .arc-indicator[data-arc="recognition"] {
    border-color: var(--underground-graphite);
    background: var(--underground-graphite);
    box-shadow: 0 0 8px rgba(47, 79, 79, 0.4);
  }

  @keyframes validationPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .enhanced-cultural-legend {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .framework-filters {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .underground-header {
      padding: 1.5rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .framework-indicators {
      flex-direction: column;
      gap: 0.75rem;
    }

    .timeline-viewport {
      height: 300px;
    }

    .seismography-track {
      height: 60px;
    }

    .timeline-events {
      top: 100px;
      height: 150px;
    }
  }

  @media (max-width: 480px) {
    .enhanced-timeline-container {
      border-radius: 8px;
    }

    .underground-header {
      padding: 1rem;
    }

    .enhanced-timeline-controls {
      padding: 1rem;
    }

    .cultural-phases-overlay {
      height: 40px;
    }

    .seismography-track {
      height: 40px;
    }

    .timeline-events {
      top: 80px;
      height: 120px;
      padding: 1rem;
    }

    .enhanced-cultural-legend {
      padding: 1rem;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .arc-tension-wave,
    .resonance-bar,
    .arc-indicator {
      animation: none;
    }

    .enhanced-timeline-container {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: high) {
    .enhanced-timeline-container {
      border: 2px solid var(--underground-sepia);
    }

    .phase-region,
    .arc-region,
    .legend-marker,
    .phase-indicator,
    .arc-indicator {
      border-width: 3px;
    }
  }

  /* Print styles */
  @media print {
    .enhanced-timeline-controls,
    .framework-filters {
      display: none;
    }

    .enhanced-timeline-container {
      box-shadow: none;
      border: 1px solid #000;
    }

    .underground-header {
      background: #000;
      color: #fff;
    }
  }
</style>