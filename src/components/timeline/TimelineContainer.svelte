{#if showAccessibility}
  <TimelineAccessibility {timelineData} />
{/if}

<div
  class="timeline-container"
  bind:this={timelineContainer}
  role="application"
  aria-label="Interactive 333-day cultural impact timeline"
>
  <div class="timeline-header">
    <h2 class="timeline-title">Cultural Timeline: 333 Days of Impact</h2>
    <div class="timeline-meta">
      <span class="timeline-duration">November 8, 2021 — October 7, 2022</span>
      <div class="timeline-stats">
        <span class="total-events">{timelineData.keyEvents.length} key moments</span>
      </div>
    </div>
  </div>

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

  <div class="timeline-viewport">
    <TimelineAxis
      {timelineData}
      {currentEventIndex}
      {visibleEvents}
      {zoomLevel}
      on:scrub={handleAxisScrub}
    />

    <div class="timeline-events" bind:this={eventsContainer}>
      {#each visibleEvents as event, index (event.id)}
        <EventMarker
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

    <div class="timeline-progress-indicator">
      <div
        class="timeline-progress-bar"
        style="width: {progressPercentage}%"
      />
    </div>
  </div>

  <!-- Cultural Impact Legend -->
  <div class="cultural-legend">
    <div class="legend-item">
      <div class="legend-marker" data-impact="seismic"></div>
      <span>Seismic Cultural Shift</span>
    </div>
    <div class="legend-item">
      <div class="legend-marker" data-impact="high"></div>
      <span>Major Cultural Moment</span>
    </div>
    <div class="legend-item">
      <div class="legend-marker" data-impact="medium"></div>
      <span>Notable Development</span>
    </div>
    <div class="legend-item">
      <div class="legend-marker" data-impact="low"></div>
      <span>Background Event</span>
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
  import EventMarker from './EventMarker.svelte';
  import EventModal from './EventModal.svelte';
  import TimelineControls from './TimelineControls.svelte';
  import TimelineAccessibility from './TimelineAccessibility.svelte';

  // Props
  export let timelineData;
  export let evidenceGallery = null;
  export let onEvidence = null;

  // Component state
  let timelineContainer;
  let eventsContainer;
  let visibleEvents = [];
  let currentEventIndex = 0;
  let selectedEvent = null;
  let showAccessibility = false;

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

  // Cultural tempo synchronization (85-90 BPM)
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

      // Apply filters if any
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

  // Timeline navigation
  function selectEvent(index) {
    currentEventIndex = index;
    selectedEvent = timelineData.keyEvents[index];

    // Smooth scroll to event
    animateToEvent(index);

    // Announce to screen reader
    announceEvent(selectedEvent);
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
    // Show preview tooltip or mini-modal
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
      const announcement = `${event.title} on ${formatDate(event.date)}. ${event.description}`;
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
  });

  onDestroy(() => {
    if (intersectionObserver) intersectionObserver.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    if (animationFrame) cancelAnimationFrame(animationFrame);

    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<style>
  .timeline-container {
    --color-primary: #7D4450;
    --color-accent: #839E75;
    --color-warning: #E8AD4A;
    --color-light: #FEFCF6;
    --color-border: rgba(125, 68, 80, 0.2);
    --color-critical: #D32F2F;

    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Source Sans 3', system-ui, sans-serif;
    background: var(--color-light);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(125, 68, 80, 0.1);
    overflow: hidden;
  }

  .timeline-header {
    padding: 2rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    color: var(--color-light);
  }

  .timeline-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
  }

  .timeline-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    opacity: 0.9;
  }

  .timeline-duration {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .timeline-stats {
    font-size: 0.9rem;
  }

  .timeline-viewport {
    position: relative;
    height: 300px;
    overflow-x: auto;
    overflow-y: hidden;
    background: var(--color-light);
    scroll-behavior: smooth;
  }

  .timeline-events {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 2rem;
    min-width: 100%;
  }

  .timeline-progress-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-border);
  }

  .timeline-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    transition: width 0.3s ease;
  }

  .cultural-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1.5rem;
    background: rgba(254, 252, 246, 0.8);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-primary);
  }

  .legend-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid;
  }

  .legend-marker[data-impact="seismic"] {
    border-color: var(--color-critical);
    background: var(--color-critical);
    box-shadow: 0 0 8px var(--color-critical);
    animation: culturalPulse 2s infinite ease-in-out;
  }

  .legend-marker[data-impact="high"] {
    border-color: var(--color-primary);
    background: var(--color-primary);
  }

  .legend-marker[data-impact="medium"] {
    border-color: var(--color-accent);
    background: var(--color-accent);
  }

  .legend-marker[data-impact="low"] {
    border-color: var(--color-border);
    background: transparent;
  }

  @keyframes culturalPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .timeline-header {
      padding: 1rem;
    }

    .timeline-viewport {
      height: 200px;
    }

    .timeline-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .cultural-legend {
      gap: 1rem;
      padding: 1rem;
    }

    .legend-item {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .timeline-events {
      padding: 1rem;
    }

    .cultural-legend {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .timeline-progress-bar,
    .legend-marker {
      transition: none;
      animation: none;
    }

    .timeline-viewport {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: high) {
    .timeline-container {
      border: 2px solid var(--color-primary);
    }

    .legend-marker {
      border-width: 3px;
    }
  }

  /* Focus management */
  .timeline-container:focus-within {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>