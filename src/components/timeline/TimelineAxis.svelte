<div
  class="timeline-axis"
  bind:this={axisContainer}
  role="slider"
  aria-label="Timeline navigation"
  aria-valuemin="0"
  aria-valuemax="333"
  aria-valuenow={currentDay}
  aria-valuetext="Day {currentDay} of 333"
  tabindex="0"
  on:keydown={handleKeydown}
  on:click={handleClick}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
>
  <!-- Background timeline track -->
  <div class="timeline-track">
    <!-- Major milestone markers every 30 days -->
    {#each milestoneMarkers as milestone, index}
      <div
        class="milestone-marker"
        style="left: {(milestone.day / 333) * 100}%"
        data-milestone={milestone.type}
      >
        <div class="milestone-line"></div>
        <div class="milestone-label">
          {milestone.label}
          <span class="milestone-day">Day {milestone.day}</span>
        </div>
      </div>
    {/each}

    <!-- Cultural intensity background visualization -->
    <div class="cultural-intensity-track">
      {#each intensitySegments as segment}
        <div
          class="intensity-segment"
          style="
            left: {(segment.startDay / 333) * 100}%;
            width: {((segment.endDay - segment.startDay) / 333) * 100}%;
            opacity: {segment.intensity};
            background: {getCulturalColor(segment.type)};
          "
          data-intensity={segment.intensity}
        ></div>
      {/each}
    </div>

    <!-- Month dividers for temporal orientation -->
    {#each monthDividers as month}
      <div
        class="month-divider"
        style="left: {(month.dayOffset / 333) * 100}%"
      >
        <div class="month-line"></div>
        <div class="month-label">{month.name}</div>
      </div>
    {/each}

    <!-- Active scrubber position -->
    <div
      class="timeline-scrubber"
      style="left: {(currentDay / 333) * 100}%"
      data-active={isDragging}
    >
      <div class="scrubber-handle">
        <div class="scrubber-indicator"></div>
      </div>
      <div class="scrubber-tooltip">
        Day {currentDay}
        <br>
        <span class="scrubber-date">{formatDayToDate(currentDay)}</span>
      </div>
    </div>
  </div>

  <!-- Event density visualization (small event markers) -->
  <div class="event-density-track">
    {#each densityEvents as event}
      <div
        class="density-event"
        style="left: {(event.dayNumber / 333) * 100}%"
        data-impact={event.culturalImpact}
        title="{event.title} - Day {event.dayNumber}"
      ></div>
    {/each}
  </div>

  <!-- Tempo synchronization indicator -->
  <div class="tempo-indicator" class:active={showTempoSync}>
    <div class="tempo-pulse" style="animation-duration: {tempoInterval}ms"></div>
    <span class="tempo-label">85 BPM Cultural Tempo</span>
  </div>
</div>

<script>
  import { createEventDispatcher } from 'svelte';

  export let timelineData;
  export let currentEventIndex = 0;
  export let visibleEvents = [];
  export let zoomLevel = 1;

  const dispatch = createEventDispatcher();

  let axisContainer;
  let isDragging = false;
  let touchStartX = 0;
  let showTempoSync = false;

  // Cultural tempo (85-90 BPM) for visual synchronization
  const tempoInterval = (60 / 85) * 1000; // 85 BPM converted to ms

  // Calculate current day from event index
  $: currentDay = timelineData.keyEvents[currentEventIndex]?.dayNumber || 0;

  // Create milestone markers for major cultural moments
  $: milestoneMarkers = [
    { day: 0, label: 'Song Release', type: 'genesis' },
    { day: 108, label: 'Cultural Watershed', type: 'watershed' }, // Feb 24, 2022
    { day: 150, label: 'Peak Virality', type: 'peak' },
    { day: 240, label: 'Cultural Integration', type: 'integration' },
    { day: 333, label: 'Legal Recognition', type: 'recognition' }
  ];

  // Month dividers for temporal orientation
  $: monthDividers = [
    { name: 'Nov 2021', dayOffset: 0 },
    { name: 'Dec 2021', dayOffset: 23 },
    { name: 'Jan 2022', dayOffset: 54 },
    { name: 'Feb 2022', dayOffset: 85 },
    { name: 'Mar 2022', dayOffset: 113 },
    { name: 'Apr 2022', dayOffset: 144 },
    { name: 'May 2022', dayOffset: 174 },
    { name: 'Jun 2022', dayOffset: 205 },
    { name: 'Jul 2022', dayOffset: 235 },
    { name: 'Aug 2022', dayOffset: 266 },
    { name: 'Sep 2022', dayOffset: 296 },
    { name: 'Oct 2022', dayOffset: 327 }
  ];

  // Cultural intensity segments based on Виленский analysis
  $: intensitySegments = [
    { startDay: 0, endDay: 30, intensity: 0.3, type: 'initial' },
    { startDay: 30, endDay: 108, intensity: 0.5, type: 'building' },
    { startDay: 108, endDay: 140, intensity: 0.9, type: 'watershed' },
    { startDay: 140, endDay: 200, intensity: 1.0, type: 'peak' },
    { startDay: 200, endDay: 270, intensity: 0.7, type: 'sustained' },
    { startDay: 270, endDay: 333, intensity: 0.4, type: 'institutional' }
  ];

  // Simplified event density for axis visualization
  $: densityEvents = timelineData.keyEvents.map(event => ({
    dayNumber: event.dayNumber || 0,
    title: event.title,
    culturalImpact: event.culturalImpact
  }));

  function getCulturalColor(segmentType) {
    const colors = {
      initial: 'rgba(131, 158, 117, 0.3)',      // шалфей
      building: 'rgba(232, 173, 74, 0.4)',      // янтарь
      watershed: 'rgba(125, 68, 80, 0.6)',      // бордо
      peak: 'rgba(211, 47, 47, 0.8)',           // критический
      sustained: 'rgba(125, 68, 80, 0.5)',      // бордо
      institutional: 'rgba(131, 158, 117, 0.4)' // шалфей
    };
    return colors[segmentType] || 'rgba(125, 68, 80, 0.3)';
  }

  function formatDayToDate(dayNumber) {
    const startDate = new Date('2021-11-08');
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayNumber);

    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function calculateDayFromPosition(clientX) {
    const rect = axisContainer.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(position * 333);
  }

  function findEventIndexFromDay(dayNumber) {
    return timelineData.keyEvents.findIndex(event =>
      Math.abs((event.dayNumber || 0) - dayNumber) < 5
    );
  }

  // Interaction handlers
  function handleClick(event) {
    const day = calculateDayFromPosition(event.clientX);
    const eventIndex = findEventIndexFromDay(day);

    if (eventIndex !== -1) {
      dispatch('scrub', { position: eventIndex / (timelineData.keyEvents.length - 1) });
    }
  }

  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentEventIndex > 0) {
          dispatch('scrub', { position: (currentEventIndex - 1) / (timelineData.keyEvents.length - 1) });
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentEventIndex < timelineData.keyEvents.length - 1) {
          dispatch('scrub', { position: (currentEventIndex + 1) / (timelineData.keyEvents.length - 1) });
        }
        break;
      case 'Home':
        event.preventDefault();
        dispatch('scrub', { position: 0 });
        break;
      case 'End':
        event.preventDefault();
        dispatch('scrub', { position: 1 });
        break;
    }
  }

  // Touch handling for mobile
  function handleTouchStart(event) {
    isDragging = true;
    touchStartX = event.touches[0].clientX;
    showTempoSync = true;
  }

  function handleTouchMove(event) {
    if (!isDragging) return;
    event.preventDefault();

    const day = calculateDayFromPosition(event.touches[0].clientX);
    const position = day / 333;

    dispatch('scrub', { position });
  }

  function handleTouchEnd() {
    isDragging = false;
    showTempoSync = false;
  }

  // Accessibility announcements
  function announcePosition(dayNumber) {
    const date = formatDayToDate(dayNumber);
    const announcement = `Timeline position: Day ${dayNumber}, ${date}`;

    // Use ARIA live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.textContent = announcement;

    document.body.appendChild(liveRegion);
    setTimeout(() => document.body.removeChild(liveRegion), 1000);
  }

  // Watch for currentDay changes to announce
  $: if (currentDay !== undefined) {
    announcePosition(currentDay);
  }
</script>

<style>
  .timeline-axis {
    position: relative;
    width: 100%;
    height: 120px;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
  }

  .timeline-axis:focus {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  .timeline-track {
    position: relative;
    height: 60px;
    background: linear-gradient(
      to right,
      var(--color-light) 0%,
      rgba(125, 68, 80, 0.05) 32%,
      rgba(211, 47, 47, 0.1) 45%,
      rgba(125, 68, 80, 0.05) 70%,
      var(--color-light) 100%
    );
  }

  .cultural-intensity-track {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    pointer-events: none;
  }

  .intensity-segment {
    position: absolute;
    top: 0;
    height: 100%;
    transition: opacity 0.3s ease;
    border-radius: 2px;
  }

  .milestone-marker {
    position: absolute;
    top: 0;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }

  .milestone-line {
    width: 2px;
    height: 40px;
    background: var(--color-primary);
    margin-top: 10px;
  }

  .milestone-marker[data-milestone="watershed"] .milestone-line,
  .milestone-marker[data-milestone="peak"] .milestone-line {
    background: var(--color-critical);
    width: 3px;
  }

  .milestone-label {
    position: absolute;
    top: -30px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-primary);
    white-space: nowrap;
    text-align: center;
    background: var(--color-light);
    padding: 2px 6px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .milestone-day {
    display: block;
    font-size: 0.7rem;
    font-weight: 400;
    opacity: 0.7;
  }

  .month-divider {
    position: absolute;
    top: 0;
    height: 60px;
    z-index: 5;
  }

  .month-line {
    width: 1px;
    height: 30px;
    background: var(--color-border);
    margin-top: 15px;
  }

  .month-label {
    position: absolute;
    top: 50px;
    font-size: 0.7rem;
    color: var(--color-primary);
    opacity: 0.6;
    white-space: nowrap;
    transform: translateX(-50%);
  }

  .timeline-scrubber {
    position: absolute;
    top: 0;
    height: 60px;
    z-index: 20;
    transform: translateX(-50%);
    transition: all 0.2s ease;
  }

  .timeline-scrubber[data-active="true"] {
    transform: translateX(-50%) scale(1.1);
  }

  .scrubber-handle {
    width: 16px;
    height: 60px;
    background: var(--color-primary);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(125, 68, 80, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
  }

  .scrubber-handle:active {
    cursor: grabbing;
  }

  .scrubber-indicator {
    width: 8px;
    height: 8px;
    background: var(--color-light);
    border-radius: 50%;
  }

  .scrubber-tooltip {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: var(--color-light);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .scrubber-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--color-primary);
  }

  .timeline-scrubber:hover .scrubber-tooltip,
  .timeline-scrubber[data-active="true"] .scrubber-tooltip {
    opacity: 1;
  }

  .scrubber-date {
    font-size: 0.7rem;
    opacity: 0.8;
  }

  .event-density-track {
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .density-event {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-accent);
    transform: translateX(-50%);
  }

  .density-event[data-impact="high"] {
    width: 6px;
    height: 6px;
    background: var(--color-primary);
  }

  .density-event[data-impact="seismic"] {
    width: 8px;
    height: 8px;
    background: var(--color-critical);
    box-shadow: 0 0 4px var(--color-critical);
  }

  .tempo-indicator {
    position: absolute;
    top: 85px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
    font-size: 0.7rem;
    color: var(--color-primary);
  }

  .tempo-indicator.active {
    opacity: 1;
  }

  .tempo-pulse {
    width: 8px;
    height: 8px;
    background: var(--color-accent);
    border-radius: 50%;
    animation: tempoPulse ease-in-out infinite;
  }

  @keyframes tempoPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.6;
    }
  }

  /* Responsive behavior */
  @media (max-width: 768px) {
    .timeline-axis {
      height: 100px;
    }

    .timeline-track {
      height: 50px;
    }

    .milestone-marker {
      height: 50px;
    }

    .milestone-label {
      font-size: 0.7rem;
    }

    .milestone-day {
      display: none;
    }

    .month-label {
      display: none;
    }

    .scrubber-handle {
      width: 20px;
      height: 50px;
    }

    .event-density-track {
      top: 55px;
      height: 15px;
    }

    .tempo-indicator {
      top: 75px;
      right: 5px;
    }
  }

  @media (max-width: 480px) {
    .timeline-axis {
      height: 80px;
    }

    .milestone-label {
      font-size: 0.6rem;
      top: -25px;
    }

    .scrubber-tooltip {
      font-size: 0.7rem;
    }
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .timeline-scrubber,
    .intensity-segment,
    .tempo-pulse {
      transition: none;
      animation: none;
    }
  }

  @media (prefers-contrast: high) {
    .milestone-line,
    .scrubber-handle {
      border: 2px solid var(--color-primary);
    }

    .density-event {
      border: 1px solid var(--color-primary);
    }
  }
</style>