<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type {
    TimelineEvent,
    VirtualScrollState,
    TimelineConfig
  } from '../lib/timeline.js';
  import {
    DEFAULT_CONFIG,
    PerformanceMonitor,
    calculateVirtualScroll,
    createEventChunks,
    SVGElementPool,
    createRAFThrottle
  } from '../lib/timeline.js';

  // Props
  const { events = [], config = DEFAULT_CONFIG, height = '600px', className = '' } = $props<{
    events?: TimelineEvent[];
    config?: TimelineConfig;
    height?: string;
    className?: string;
  }>();

  // State variables
  let containerElement: HTMLDivElement;
  let svgElement: SVGSVGElement;
  let scrollTop = $state(0);
  let viewportHeight = $state(600);
  let isLoading = $state(false);
  let loadedChunks = $state(new Set<number>());
  let virtualState = $state<VirtualScrollState>({
    scrollTop: 0,
    viewportHeight: 600,
    itemHeight: config.itemHeight,
    buffer: config.buffer,
    startIndex: 0,
    endIndex: 0,
    totalHeight: 0
  });

  // Performance monitoring
  const perfMonitor = new PerformanceMonitor();
  const elementPool = new SVGElementPool();

  // Reactive calculations
  let visibleEvents = $derived(
    events.slice(virtualState.startIndex, virtualState.endIndex + 1)
  );

  let eventChunks = $derived(
    createEventChunks(events, config.chunkSize)
  );

  // SVG dimensions
  const SVG_WIDTH = 1000;
  const EVENT_SPACING = 120;
  const TIMELINE_X = 100;

  // RAF-throttled scroll handler
  const handleScroll = createRAFThrottle(() => {
    if (!containerElement) return;

    const endTiming = perfMonitor.startTiming('scroll-update');

    const newScrollTop = containerElement.scrollTop;
    const newViewportHeight = containerElement.clientHeight;

    // Update virtual scroll state
    virtualState = calculateVirtualScroll(
      events,
      newScrollTop,
      newViewportHeight,
      config
    );

    scrollTop = newScrollTop;
    viewportHeight = newViewportHeight;

    // Check if we need to load more chunks
    checkAndLoadChunks();

    endTiming();
  });

  // Load event chunks on demand
  function checkAndLoadChunks() {
    const startChunk = Math.floor(virtualState.startIndex / config.chunkSize);
    const endChunk = Math.floor(virtualState.endIndex / config.chunkSize);

    for (let chunkIndex = startChunk; chunkIndex <= endChunk; chunkIndex++) {
      if (!loadedChunks.has(chunkIndex) && chunkIndex < eventChunks.length) {
        loadedChunks.add(chunkIndex);
      }
    }
  }

  // Render SVG timeline event
  function renderTimelineEvent(event: TimelineEvent, index: number): string {
    const y = index * config.itemHeight + config.itemHeight / 2;
    const significance = event.significance;

    // Color coding based on significance
    const colors = {
      critical: '#D32F2F',
      important: '#F57C00',
      supporting: '#388E3C',
      contextual: '#7B1FA2'
    };

    const eventColor = colors[significance] || colors.contextual;

    // Event type icons (using Unicode symbols for better SVG compatibility)
    const icons = {
      meeting: '🤝',
      document: '📄',
      communication: '💬',
      decision: '⚖️',
      evidence: '🔍',
      milestone: '🎯'
    };

    const icon = icons[event.event_type] || '•';

    return `
      <g class="timeline-event" data-event-id="${event.id}" transform="translate(0, ${y})">
        <!-- Timeline connector line -->
        <line x1="${TIMELINE_X - 10}" y1="0" x2="${TIMELINE_X + 10}" y2="0"
              stroke="${eventColor}" stroke-width="2" opacity="0.6"/>

        <!-- Event marker circle -->
        <circle cx="${TIMELINE_X}" cy="0" r="8"
                fill="${eventColor}" stroke="white" stroke-width="2"/>

        <!-- Event content box -->
        <g transform="translate(${TIMELINE_X + 20}, -20)">
          <rect width="280" height="40" rx="4"
                fill="rgba(255,255,255,0.95)" stroke="${eventColor}" stroke-width="1"/>

          <!-- Event title -->
          <text x="8" y="15" fill="#333" font-size="12" font-weight="600"
                textLength="260" lengthAdjust="spacingAndGlyphs">
            ${event.title}
          </text>

          <!-- Event details -->
          <text x="8" y="30" fill="#666" font-size="10">
            ${event.date}${event.time ? ' ' + event.time : ''} • ${icon} ${event.event_type}
          </text>
        </g>

        <!-- Status indicator -->
        <rect x="${TIMELINE_X - 30}" y="-15" width="20" height="30" rx="2"
              fill="${getStatusColor(event.status)}" opacity="0.8"/>
      </g>
    `;
  }

  function getStatusColor(status?: string): string {
    switch (status) {
      case 'verified': return '#4CAF50';
      case 'partially_verified': return '#FF9800';
      case 'unverified': return '#9E9E9E';
      case 'draft': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  // Update SVG content with visible events
  function updateSVGContent() {
    if (!svgElement) return;

    const endTiming = perfMonitor.startTiming('svg-render');

    // Clear existing content
    svgElement.innerHTML = `
      <!-- Timeline background line -->
      <line x1="${TIMELINE_X}" y1="0" x2="${TIMELINE_X}" y2="${virtualState.totalHeight}"
            stroke="#E0E0E0" stroke-width="3" stroke-dasharray="5,5"/>
    `;

    // Render visible events
    visibleEvents.forEach((event, relativeIndex) => {
      const absoluteIndex = virtualState.startIndex + relativeIndex;
      const eventSVG = renderTimelineEvent(event, absoluteIndex);

      // Create temporary container to parse SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = eventSVG;
      const svgFragment = tempDiv.firstElementChild as SVGElement;

      if (svgFragment) {
        svgElement.appendChild(svgFragment);
      }
    });

    endTiming();
  }

  // Initialize timeline on mount
  onMount(() => {
    if (containerElement) {
      viewportHeight = containerElement.clientHeight;

      // Initial virtual scroll calculation
      virtualState = calculateVirtualScroll(
        events,
        0,
        viewportHeight,
        config
      );

      // Load initial chunks
      checkAndLoadChunks();

      // Set up scroll listener
      containerElement.addEventListener('scroll', handleScroll, { passive: true });
    }
  });

  onDestroy(() => {
    if (containerElement) {
      containerElement.removeEventListener('scroll', handleScroll);
    }
    elementPool.clear();
  });

  // Reactive update when visible events change
  $effect(() => {
    if (visibleEvents.length > 0) {
      updateSVGContent();
    }
  });
</script>

<div
  class="timeline-container {className}"
  style="height: {height};"
  bind:this={containerElement}
>
  <div
    class="timeline-content"
    style="height: {virtualState.totalHeight}px;"
  >
    <svg
      bind:this={svgElement}
      class="timeline-svg"
      width="{SVG_WIDTH}"
      height="{virtualState.totalHeight}"
      viewBox="0 0 {SVG_WIDTH} {virtualState.totalHeight}"
    >
      <!-- Content will be dynamically generated -->
    </svg>

    <!-- Scroll offset container -->
    <div
      class="timeline-offset"
      style="transform: translateY({virtualState.startIndex * config.itemHeight}px);"
    >
      <!-- Additional overlay content can go here -->
    </div>
  </div>

  {#if isLoading}
    <div class="timeline-loading">
      <span>Loading events...</span>
    </div>
  {/if}

  <!-- Debug panel (development only) -->
  {#if import.meta.env.DEV}
    <div class="timeline-debug">
      <details>
        <summary>Timeline Debug</summary>
        <div>
          <strong>Virtual State:</strong><br>
          Scroll: {scrollTop}px<br>
          Viewport: {viewportHeight}px<br>
          Visible: {virtualState.startIndex}-{virtualState.endIndex} of {events.length}<br>
          Chunks loaded: {loadedChunks.size}<br>
          <strong>Performance:</strong><br>
          {JSON.stringify(perfMonitor.getAllStats(), null, 2)}
        </div>
      </details>
    </div>
  {/if}
</div>

<style>
  .timeline-container {
    position: relative;
    overflow-y: auto;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
  }

  .timeline-content {
    position: relative;
    width: 100%;
  }

  .timeline-svg {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .timeline-offset {
    position: relative;
    pointer-events: auto;
  }

  .timeline-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    color: #666;
  }

  .timeline-debug {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px;
    border-radius: 4px;
    font-size: 11px;
    font-family: monospace;
    max-width: 300px;
    z-index: 1000;
  }

  .timeline-debug details {
    cursor: pointer;
  }

  .timeline-debug details > div {
    margin-top: 8px;
    line-height: 1.3;
  }

  /* Timeline event interactions */
  :global(.timeline-event) {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  :global(.timeline-event:hover) {
    opacity: 0.8;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .timeline-svg {
      transform: scale(0.8);
      transform-origin: left top;
    }
  }

  /* Performance optimizations */
  .timeline-container {
    contain: layout style paint;
    will-change: scroll-position;
  }

  .timeline-content {
    contain: layout;
  }
</style>