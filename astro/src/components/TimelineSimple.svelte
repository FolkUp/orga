<script lang="ts">
  import { onMount } from 'svelte';
  import type { TimelineEvent } from '../lib/timeline.js';

  // Props
  export let events: TimelineEvent[] = [];
  export let height: string = '600px';
  export let className: string = '';

  // State variables
  let containerElement: HTMLDivElement;
  let scrollTop = 0;
  let viewportHeight = 600;

  // Configuration
  const itemHeight = 80;
  const buffer = 5;

  // SVG dimensions
  const SVG_WIDTH = 1000;
  const TIMELINE_X = 100;

  // Reactive calculations
  $: startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  $: visibleCount = Math.ceil(viewportHeight / itemHeight);
  $: endIndex = Math.min(events.length - 1, startIndex + visibleCount + buffer * 2);
  $: visibleEvents = events.slice(startIndex, endIndex + 1);
  $: totalHeight = events.length * itemHeight;

  // Scroll handler
  function handleScroll() {
    if (!containerElement) return;
    scrollTop = containerElement.scrollTop;
    viewportHeight = containerElement.clientHeight;
  }

  // Color coding based on significance
  function getEventColor(significance: string): string {
    const colors: Record<string, string> = {
      critical: '#D32F2F',
      important: '#F57C00',
      supporting: '#388E3C',
      contextual: '#7B1FA2'
    };
    return colors[significance] || colors.contextual;
  }

  // Status color
  function getStatusColor(status?: string): string {
    switch (status) {
      case 'verified': return '#4CAF50';
      case 'partially_verified': return '#FF9800';
      case 'unverified': return '#9E9E9E';
      case 'draft': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  // Event type icons
  function getEventIcon(eventType: string): string {
    const icons: Record<string, string> = {
      meeting: '🤝',
      document: '📄',
      communication: '💬',
      decision: '⚖️',
      evidence: '🔍',
      milestone: '🎯'
    };
    return icons[eventType] || '•';
  }

  // Initialize on mount
  onMount(() => {
    if (containerElement) {
      viewportHeight = containerElement.clientHeight;
    }
  });
</script>

<div
  class="timeline-container {className}"
  style="height: {height};"
  bind:this={containerElement}
  on:scroll={handleScroll}
>
  <div class="timeline-content" style="height: {totalHeight}px;">
    <svg
      class="timeline-svg"
      width="{SVG_WIDTH}"
      height="{totalHeight}"
      viewBox="0 0 {SVG_WIDTH} {totalHeight}"
    >
      <!-- Timeline background line -->
      <line
        x1="{TIMELINE_X}"
        y1="0"
        x2="{TIMELINE_X}"
        y2="{totalHeight}"
        stroke="#E0E0E0"
        stroke-width="3"
        stroke-dasharray="5,5"
      />

      <!-- Visible events -->
      {#each visibleEvents as event, relativeIndex}
        {@const absoluteIndex = startIndex + relativeIndex}
        {@const y = absoluteIndex * itemHeight + itemHeight / 2}
        {@const eventColor = getEventColor(event.significance)}
        {@const statusColor = getStatusColor(event.status)}
        {@const icon = getEventIcon(event.event_type)}

        <g class="timeline-event" data-event-id="{event.id}" transform="translate(0, {y})">
          <!-- Timeline connector line -->
          <line
            x1="{TIMELINE_X - 10}"
            y1="0"
            x2="{TIMELINE_X + 10}"
            y2="0"
            stroke="{eventColor}"
            stroke-width="2"
            opacity="0.6"
          />

          <!-- Event marker circle -->
          <circle
            cx="{TIMELINE_X}"
            cy="0"
            r="8"
            fill="{eventColor}"
            stroke="white"
            stroke-width="2"
          />

          <!-- Status indicator -->
          <rect
            x="{TIMELINE_X - 30}"
            y="-15"
            width="20"
            height="30"
            rx="2"
            fill="{statusColor}"
            opacity="0.8"
          />

          <!-- Event content box -->
          <g transform="translate({TIMELINE_X + 20}, -20)">
            <rect
              width="280"
              height="40"
              rx="4"
              fill="rgba(255,255,255,0.95)"
              stroke="{eventColor}"
              stroke-width="1"
            />

            <!-- Event title -->
            <text
              x="8"
              y="15"
              fill="#333"
              font-size="12"
              font-weight="600"
              textLength="260"
              lengthAdjust="spacingAndGlyphs"
            >
              {event.title}
            </text>

            <!-- Event details -->
            <text x="8" y="30" fill="#666" font-size="10">
              {event.date}{event.time ? ' ' + event.time : ''} • {icon} {event.event_type}
            </text>
          </g>
        </g>
      {/each}
    </svg>

    <!-- Debug info (development only) -->
    <div class="timeline-debug">
      <small>
        Events: {events.length} | Visible: {startIndex}-{endIndex} | Scroll: {scrollTop.toFixed(0)}px
      </small>
    </div>
  </div>
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

  .timeline-debug {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-family: monospace;
    z-index: 1000;
  }

  /* Timeline event interactions */
  :global(.timeline-event) {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  :global(.timeline-event:hover) {
    opacity: 0.8;
  }

  /* Performance optimizations */
  .timeline-container {
    contain: layout style paint;
    will-change: scroll-position;
  }

  .timeline-content {
    contain: layout;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .timeline-svg {
      transform: scale(0.8);
      transform-origin: left top;
    }
  }
</style>