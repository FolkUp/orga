<div class="timeline-controls" role="toolbar" aria-label="Timeline playback controls">
  <!-- Playback controls -->
  <div class="playback-section">
    <button
      class="control-button play-pause"
      class:playing={$playbackState.playing}
      on:click={togglePlayback}
      aria-label={$playbackState.playing ? 'Pause timeline' : 'Play timeline'}
      aria-pressed={$playbackState.playing}
    >
      {#if $playbackState.playing}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5V19L19 12L8 5Z"/>
        </svg>
      {/if}
    </button>

    <button
      class="control-button step-back"
      on:click={stepBackward}
      disabled={currentEventIndex <= 0}
      aria-label="Previous event"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6H8V18H6V6ZM9.5 12L18 6V18L9.5 12Z"/>
      </svg>
    </button>

    <button
      class="control-button step-forward"
      on:click={stepForward}
      disabled={currentEventIndex >= totalEvents - 1}
      aria-label="Next event"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 18H18V6H16V18ZM6 18L14.5 12L6 6V18Z"/>
      </svg>
    </button>

    <!-- Current position indicator -->
    <div class="position-indicator">
      <span class="position-text">
        Event {currentEventIndex + 1} of {totalEvents}
      </span>
      <div class="position-progress">
        <div
          class="progress-fill"
          style="width: {((currentEventIndex) / Math.max(1, totalEvents - 1)) * 100}%"
        ></div>
      </div>
    </div>
  </div>

  <!-- Speed control -->
  <div class="speed-section">
    <label for="speed-control" class="speed-label">Speed</label>
    <div class="speed-controls">
      {#each speedOptions as speed}
        <button
          class="speed-button"
          class:active={$playbackState.speed === speed.value}
          on:click={() => setSpeed(speed.value)}
          aria-label="Set playback speed to {speed.label}"
          aria-pressed={$playbackState.speed === speed.value}
        >
          {speed.label}
        </button>
      {/each}
    </div>

    <!-- Cultural tempo indicator -->
    <div class="tempo-indicator" class:synced={isTempoSynced}>
      <div class="tempo-pulse" style="animation-duration: {tempoInterval}ms"></div>
      <span class="tempo-label">85 BPM</span>
      <div class="sync-status" class:active={isTempoSynced}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- Filter controls -->
  <div class="filter-section">
    <label for="filter-select" class="filter-label">Filter Events</label>
    <div class="filter-controls">
      <select
        id="filter-select"
        class="filter-select"
        value={currentFilter}
        on:change={handleFilterChange}
        aria-label="Filter timeline events"
      >
        <option value="">All Events</option>
        <option value="primary">Primary Events</option>
        <option value="major">Major Events</option>
        <option value="seismic">Seismic Events</option>
        <option value="high">High Impact</option>
        <option value="medium">Medium Impact</option>
      </select>

      <div class="filter-chips">
        {#each activeFilters as filter}
          <div class="filter-chip">
            <span class="chip-label">{getFilterLabel(filter)}</span>
            <button
              class="chip-remove"
              on:click={() => removeFilter(filter)}
              aria-label="Remove {getFilterLabel(filter)} filter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12Z"/>
              </svg>
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Zoom controls -->
  <div class="zoom-section">
    <label class="zoom-label">Zoom Level</label>
    <div class="zoom-controls">
      <button
        class="control-button zoom-out"
        on:click={zoomOut}
        disabled={zoomLevel <= minZoom}
        aria-label="Zoom out"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L20 21.49L21.49 20L15.5 14ZM9.5 14C7 14 5 12 5 9.5S7 5 9.5 5S14 7 14 9.5S12 14 9.5 14ZM7 9H12V10H7V9Z"/>
        </svg>
      </button>

      <div class="zoom-slider-container">
        <input
          type="range"
          class="zoom-slider"
          min={minZoom}
          max={maxZoom}
          step="0.1"
          bind:value={zoomLevel}
          on:input={handleZoomSlider}
          aria-label="Timeline zoom level"
        />
        <div class="zoom-labels">
          <span class="zoom-label-min">Overview</span>
          <span class="zoom-label-max">Detail</span>
        </div>
      </div>

      <button
        class="control-button zoom-in"
        on:click={zoomIn}
        disabled={zoomLevel >= maxZoom}
        aria-label="Zoom in"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L20 21.49L21.49 20L15.5 14ZM9.5 14C7 14 5 12 5 9.5S7 5 9.5 5S14 7 14 9.5S12 14 9.5 14ZM7 9H12V10H7V9ZM9 7V12H10V7H9Z"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Timeline scrubber -->
  <div class="scrubber-section">
    <label for="timeline-scrubber" class="scrubber-label">Timeline Position</label>
    <div
      class="timeline-scrubber"
      role="slider"
      aria-label="Timeline position"
      aria-valuemin="0"
      aria-valuemax="1"
      aria-valuenow={scrubberPosition}
      aria-valuetext="Day {currentDay} of 333"
      tabindex="0"
      on:mousedown={startScrubbing}
      on:touchstart={startScrubbing}
      on:keydown={handleScrubberKeydown}
    >
      <div class="scrubber-track">
        <!-- Cultural intensity background -->
        <div class="intensity-background">
          {#each intensitySegments as segment}
            <div
              class="intensity-segment"
              style="
                left: {(segment.start / 333) * 100}%;
                width: {((segment.end - segment.start) / 333) * 100}%;
                background: {segment.color};
                opacity: {segment.intensity};
              "
            ></div>
          {/each}
        </div>

        <!-- Event markers on scrubber -->
        <div class="scrubber-events">
          {#each visibleEvents as event, index}
            <div
              class="scrubber-event"
              style="left: {((event.dayNumber || 0) / 333) * 100}%"
              data-impact={event.culturalImpact}
              title="{event.title} - Day {event.dayNumber}"
            ></div>
          {/each}
        </div>

        <!-- Scrubber handle -->
        <div
          class="scrubber-handle"
          class:active={isScrubbing}
          style="left: {scrubberPosition * 100}%"
        >
          <div class="handle-indicator"></div>
          <div class="handle-tooltip" class:visible={isScrubbing || showTooltip}>
            Day {currentDay}
            <br>
            <span class="tooltip-date">{formatDayToDate(currentDay)}</span>
          </div>
        </div>
      </div>

      <!-- Time markers -->
      <div class="time-markers">
        {#each timeMarkers as marker}
          <div
            class="time-marker"
            style="left: {(marker.day / 333) * 100}%"
            data-type={marker.type}
          >
            <div class="marker-line"></div>
            <div class="marker-label">{marker.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Advanced controls toggle -->
  <div class="advanced-section">
    <button
      class="advanced-toggle"
      class:expanded={showAdvanced}
      on:click={toggleAdvanced}
      aria-label="Toggle advanced controls"
      aria-expanded={showAdvanced}
    >
      <span class="toggle-label">Advanced</span>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"/>
      </svg>
    </button>

    {#if showAdvanced}
      <div class="advanced-controls" transition:slide={{ duration: 300 }}>
        <div class="control-group">
          <label>Auto-scroll</label>
          <label class="switch">
            <input type="checkbox" bind:checked={autoScroll} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="control-group">
          <label>Loop playback</label>
          <label class="switch">
            <input type="checkbox" bind:checked={loopPlayback} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="control-group">
          <label>Cultural tempo sync</label>
          <label class="switch">
            <input type="checkbox" bind:checked={tempoSync} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="control-group">
          <label>Show event previews</label>
          <label class="switch">
            <input type="checkbox" bind:checked={showPreviews} />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    {/if}
  </div>
</div>

<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';

  export let playbackState;
  export let currentEventIndex;
  export let totalEvents;
  export let visibleEvents = [];

  const dispatch = createEventDispatcher();

  // Control state
  let currentFilter = '';
  let activeFilters = [];
  let zoomLevel = 1;
  let isScrubbing = false;
  let showTooltip = false;
  let showAdvanced = false;

  // Advanced settings
  let autoScroll = true;
  let loopPlayback = false;
  let tempoSync = true;
  let showPreviews = true;

  // Constants
  const minZoom = 0.5;
  const maxZoom = 3.0;
  const speedOptions = [
    { value: 0.25, label: '¼×' },
    { value: 0.5, label: '½×' },
    { value: 1, label: '1×' },
    { value: 1.5, label: '1.5×' },
    { value: 2, label: '2×' },
    { value: 4, label: '4×' }
  ];

  // Cultural tempo (85 BPM)
  const tempoInterval = (60 / 85) * 1000;
  $: isTempoSynced = tempoSync && $playbackState.speed === 1;

  // Current position calculations
  $: scrubberPosition = totalEvents > 1 ? currentEventIndex / (totalEvents - 1) : 0;
  $: currentDay = visibleEvents[currentEventIndex]?.dayNumber || 0;

  // Cultural intensity visualization
  $: intensitySegments = [
    { start: 0, end: 30, intensity: 0.3, color: 'var(--color-accent)' },
    { start: 30, end: 108, intensity: 0.5, color: 'var(--color-warning)' },
    { start: 108, end: 140, intensity: 0.9, color: 'var(--color-primary)' },
    { start: 140, end: 200, intensity: 1.0, color: 'var(--color-critical)' },
    { start: 200, end: 270, intensity: 0.7, color: 'var(--color-primary)' },
    { start: 270, end: 333, intensity: 0.4, color: 'var(--color-accent)' }
  ];

  // Time markers for scrubber
  $: timeMarkers = [
    { day: 0, label: 'Nov 8', type: 'start' },
    { day: 108, label: 'Feb 24', type: 'watershed' },
    { day: 150, label: 'Peak', type: 'peak' },
    { day: 240, label: 'Integration', type: 'integration' },
    { day: 333, label: 'Oct 7', type: 'end' }
  ];

  // Playback controls
  function togglePlayback() {
    if ($playbackState.playing) {
      dispatch('pause');
    } else {
      dispatch('play');
    }
  }

  function stepBackward() {
    if (currentEventIndex > 0) {
      dispatch('scrub', { position: (currentEventIndex - 1) / (totalEvents - 1) });
    }
  }

  function stepForward() {
    if (currentEventIndex < totalEvents - 1) {
      dispatch('scrub', { position: (currentEventIndex + 1) / (totalEvents - 1) });
    }
  }

  // Speed control
  function setSpeed(speed) {
    dispatch('speed', { speed });
  }

  // Filter controls
  function handleFilterChange(event) {
    const filter = event.target.value;
    currentFilter = filter;

    if (filter && !activeFilters.includes(filter)) {
      activeFilters = [...activeFilters, filter];
    }

    dispatch('filter', { filter });
  }

  function removeFilter(filter) {
    activeFilters = activeFilters.filter(f => f !== filter);
    if (currentFilter === filter) {
      currentFilter = '';
    }
    dispatch('filter', { filter: '' });
  }

  function getFilterLabel(filter) {
    const labels = {
      'primary': 'Primary',
      'major': 'Major',
      'seismic': 'Seismic',
      'high': 'High Impact',
      'medium': 'Medium Impact',
      'low': 'Low Impact'
    };
    return labels[filter] || filter;
  }

  // Zoom controls
  function zoomIn() {
    if (zoomLevel < maxZoom) {
      zoomLevel = Math.min(maxZoom, zoomLevel + 0.25);
      dispatch('zoom', { level: zoomLevel });
    }
  }

  function zoomOut() {
    if (zoomLevel > minZoom) {
      zoomLevel = Math.max(minZoom, zoomLevel - 0.25);
      dispatch('zoom', { level: zoomLevel });
    }
  }

  function handleZoomSlider(event) {
    zoomLevel = parseFloat(event.target.value);
    dispatch('zoom', { level: zoomLevel });
  }

  // Scrubbing controls
  let scrubStartX = 0;
  let scrubStartPosition = 0;

  function startScrubbing(event) {
    isScrubbing = true;
    showTooltip = true;

    if (event.type === 'mousedown') {
      scrubStartX = event.clientX;
      document.addEventListener('mousemove', handleScrubbing);
      document.addEventListener('mouseup', stopScrubbing);
    } else if (event.type === 'touchstart') {
      scrubStartX = event.touches[0].clientX;
      document.addEventListener('touchmove', handleScrubbing);
      document.addEventListener('touchend', stopScrubbing);
    }

    scrubStartPosition = scrubberPosition;

    // Pause playback while scrubbing
    if ($playbackState.playing) {
      dispatch('pause');
    }
  }

  function handleScrubbing(event) {
    if (!isScrubbing) return;

    const scrubberElement = event.currentTarget?.closest('.timeline-scrubber');
    if (!scrubberElement) return;

    const rect = scrubberElement.getBoundingClientRect();
    const clientX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    dispatch('scrub', { position });
  }

  function stopScrubbing() {
    isScrubbing = false;
    showTooltip = false;

    document.removeEventListener('mousemove', handleScrubbing);
    document.removeEventListener('mouseup', stopScrubbing);
    document.removeEventListener('touchmove', handleScrubbing);
    document.removeEventListener('touchend', stopScrubbing);
  }

  function handleScrubberKeydown(event) {
    const step = 1 / (totalEvents - 1);

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (scrubberPosition > 0) {
          dispatch('scrub', { position: Math.max(0, scrubberPosition - step) });
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (scrubberPosition < 1) {
          dispatch('scrub', { position: Math.min(1, scrubberPosition + step) });
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

  // Utility functions
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

  function toggleAdvanced() {
    showAdvanced = !showAdvanced;
  }
</script>

<style>
  .timeline-controls {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem 1.5rem;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .playback-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .control-button {
    width: 40px;
    height: 40px;
    border: 1px solid var(--color-border);
    background: var(--color-light);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-primary);
  }

  .control-button:hover:not(:disabled) {
    background: var(--color-accent);
    color: var(--color-light);
    border-color: var(--color-accent);
  }

  .control-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .control-button.playing {
    background: var(--color-primary);
    color: var(--color-light);
    border-color: var(--color-primary);
  }

  .control-button svg {
    width: 20px;
    height: 20px;
  }

  .position-indicator {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-left: 1rem;
  }

  .position-text {
    font-size: 0.8rem;
    color: var(--color-primary);
    font-weight: 500;
  }

  .position-progress {
    width: 120px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-accent);
    transition: width 0.3s ease;
  }

  .speed-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .speed-label,
  .filter-label,
  .zoom-label,
  .scrubber-label {
    font-size: 0.8rem;
    color: var(--color-primary);
    font-weight: 500;
    margin: 0;
  }

  .speed-controls {
    display: flex;
    background: var(--color-border);
    border-radius: 6px;
    overflow: hidden;
  }

  .speed-button {
    padding: 0.5rem 0.75rem;
    border: none;
    background: transparent;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8rem;
    font-weight: 500;
    min-width: 40px;
  }

  .speed-button:hover {
    background: rgba(125, 68, 80, 0.1);
  }

  .speed-button.active {
    background: var(--color-primary);
    color: var(--color-light);
  }

  .tempo-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(131, 158, 117, 0.1);
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .tempo-indicator.synced {
    background: rgba(131, 158, 117, 0.2);
    border: 1px solid var(--color-accent);
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
      transform: scale(1.4);
      opacity: 0.6;
    }
  }

  .tempo-label {
    font-size: 0.7rem;
    color: var(--color-primary);
    font-weight: 500;
  }

  .sync-status {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .sync-status.active {
    background: var(--color-accent);
    color: var(--color-light);
  }

  .sync-status svg {
    width: 10px;
    height: 10px;
  }

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-select {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-light);
    color: var(--color-primary);
    font-size: 0.8rem;
    cursor: pointer;
  }

  .filter-select:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
    border-color: var(--color-accent);
  }

  .filter-chips {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-chip {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--color-accent);
    color: var(--color-light);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
  }

  .chip-label {
    font-weight: 500;
  }

  .chip-remove {
    width: 16px;
    height: 16px;
    border: none;
    background: transparent;
    color: var(--color-light);
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  .chip-remove:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .chip-remove svg {
    width: 12px;
    height: 12px;
  }

  .zoom-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .zoom-slider-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
  }

  .zoom-slider {
    width: 80px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .zoom-slider::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .zoom-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  .zoom-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.6rem;
    color: var(--color-primary);
    opacity: 0.7;
  }

  .scrubber-section {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .timeline-scrubber {
    position: relative;
    height: 40px;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    cursor: pointer;
    outline: none;
  }

  .timeline-scrubber:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(131, 158, 117, 0.2);
  }

  .scrubber-track {
    position: relative;
    width: 100%;
    height: 20px;
    top: 10px;
  }

  .intensity-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
  }

  .intensity-segment {
    position: absolute;
    top: 0;
    height: 100%;
    transition: opacity 0.3s ease;
  }

  .scrubber-events {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
  }

  .scrubber-event {
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 4px;
    height: 8px;
    background: var(--color-primary);
    border-radius: 2px;
  }

  .scrubber-event[data-impact="high"] {
    width: 5px;
    height: 10px;
    background: var(--color-primary);
  }

  .scrubber-event[data-impact="seismic"] {
    width: 6px;
    height: 12px;
    background: var(--color-critical);
  }

  .scrubber-handle {
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 16px;
    height: 16px;
    z-index: 10;
    transition: transform 0.2s ease;
  }

  .scrubber-handle.active {
    transform: translateX(-50%) translateY(-50%) scale(1.2);
  }

  .handle-indicator {
    width: 16px;
    height: 16px;
    background: var(--color-primary);
    border: 2px solid var(--color-light);
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(125, 68, 80, 0.3);
  }

  .handle-tooltip {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: var(--color-light);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.7rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 20;
  }

  .handle-tooltip.visible {
    opacity: 1;
  }

  .handle-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--color-primary);
  }

  .tooltip-date {
    font-size: 0.6rem;
    opacity: 0.8;
  }

  .time-markers {
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    height: 15px;
  }

  .time-marker {
    position: absolute;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .marker-line {
    width: 1px;
    height: 8px;
    background: var(--color-border);
  }

  .time-marker[data-type="watershed"] .marker-line,
  .time-marker[data-type="peak"] .marker-line {
    background: var(--color-critical);
    height: 10px;
  }

  .marker-label {
    font-size: 0.6rem;
    color: var(--color-primary);
    opacity: 0.7;
    margin-top: 2px;
  }

  .advanced-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .advanced-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 1px solid var(--color-border);
    color: var(--color-primary);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }

  .advanced-toggle:hover {
    background: var(--color-border);
  }

  .advanced-toggle.expanded svg {
    transform: rotate(180deg);
  }

  .advanced-toggle svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  .advanced-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(254, 252, 246, 0.5);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }

  .control-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .control-group label:first-child {
    font-size: 0.8rem;
    color: var(--color-primary);
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-border);
    transition: 0.3s;
    border-radius: 24px;
  }

  .slider::before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: var(--color-light);
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background: var(--color-accent);
  }

  input:checked + .slider::before {
    transform: translateX(20px);
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .timeline-controls {
      gap: 1.5rem;
    }

    .scrubber-section {
      min-width: 250px;
    }
  }

  @media (max-width: 768px) {
    .timeline-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .playback-section,
    .speed-section,
    .filter-section,
    .zoom-section {
      justify-content: center;
    }

    .scrubber-section {
      min-width: auto;
    }

    .position-indicator {
      margin-left: 0;
      align-items: center;
    }

    .filter-controls,
    .zoom-controls {
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .timeline-controls {
      padding: 1rem;
    }

    .control-button {
      width: 36px;
      height: 36px;
    }

    .playback-section {
      gap: 0.75rem;
    }

    .speed-controls {
      flex-wrap: wrap;
    }

    .speed-button {
      min-width: 36px;
      padding: 0.4rem 0.5rem;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .tempo-pulse,
    .control-button,
    .scrubber-handle {
      animation: none;
      transition: none;
    }
  }

  @media (prefers-contrast: high) {
    .control-button,
    .filter-select,
    .timeline-scrubber {
      border-width: 2px;
    }

    .scrubber-event {
      border: 1px solid var(--color-primary);
    }
  }

  /* Touch targets */
  @media (pointer: coarse) {
    .control-button {
      min-width: 44px;
      min-height: 44px;
    }

    .scrubber-handle {
      width: 20px;
      height: 20px;
    }

    .handle-indicator {
      width: 20px;
      height: 20px;
    }
  }
</style>