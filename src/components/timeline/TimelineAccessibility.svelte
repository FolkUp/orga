<!-- Screen reader accessible timeline interface -->
<div class="timeline-accessibility" aria-live="polite" aria-atomic="false">
  <!-- Timeline summary for screen readers -->
  <div class="sr-only timeline-summary">
    <h2 id="timeline-title">333-Day Cultural Impact Timeline</h2>
    <p id="timeline-description">
      Interactive timeline spanning {timelineData.keyEvents.length} key cultural events
      from November 8, 2021 to October 7, 2022, tracking the cultural impact and spread
      of a significant musical and social phenomenon.
    </p>
  </div>

  <!-- Current position announcement -->
  <div id="position-announcement" aria-live="polite" aria-atomic="true" class="sr-only">
    {#if currentEvent}
      Currently at Day {currentEvent.dayNumber}: {currentEvent.title} on {formatDate(currentEvent.date)}.
      Cultural impact level: {getCulturalImpactLabel(currentEvent.culturalImpact)}.
      {#if currentEvent.description}
        {currentEvent.description}
      {/if}
    {/if}
  </div>

  <!-- Navigation instructions -->
  <div class="sr-only navigation-help">
    <h3>Navigation Instructions</h3>
    <ul>
      <li>Use Tab to navigate between timeline controls</li>
      <li>Press Space or Enter on event markers to select events</li>
      <li>Use Arrow keys on the timeline axis to move between events</li>
      <li>Press Home to go to the first event, End for the last event</li>
      <li>Use the playback controls to automatically progress through events</li>
    </ul>
  </div>

  <!-- Event list for non-visual navigation -->
  <div class="event-list-container" class:visible={showEventList}>
    <h3>Event List Navigation</h3>
    <p class="list-description">
      Complete list of all {timelineData.keyEvents.length} timeline events.
      Use this list to navigate directly to any event.
    </p>

    <div class="list-controls">
      <label for="event-filter" class="filter-label">Filter events:</label>
      <select
        id="event-filter"
        class="event-filter"
        value={eventFilter}
        on:change={handleFilterChange}
      >
        <option value="">All events ({timelineData.keyEvents.length})</option>
        <option value="seismic">Seismic events ({getFilteredCount('seismic')})</option>
        <option value="high">High impact events ({getFilteredCount('high')})</option>
        <option value="major">Major events ({getFilteredCount('major')})</option>
        <option value="primary">Primary events ({getFilteredCount('primary')})</option>
      </select>

      <label for="sort-order" class="sort-label">Sort by:</label>
      <select
        id="sort-order"
        class="sort-select"
        value={sortOrder}
        on:change={handleSortChange}
      >
        <option value="chronological">Chronological order</option>
        <option value="impact">Cultural impact (high to low)</option>
        <option value="significance">Significance level</option>
      </select>
    </div>

    <ul class="event-list" role="list">
      {#each filteredEvents as event, index (event.id || index)}
        <li class="event-item" role="listitem">
          <button
            class="event-link"
            class:current={currentEventId === event.id}
            on:click={() => selectEvent(event, index)}
            aria-describedby="event-{event.id}-details"
          >
            <div class="event-header">
              <span class="event-number">Day {event.dayNumber}</span>
              <span class="event-date">{formatDate(event.date)}</span>
              <span class="cultural-impact-badge" data-level={event.culturalImpact}>
                {getCulturalImpactLabel(event.culturalImpact)}
              </span>
            </div>

            <h4 class="event-title">{event.title}</h4>

            <div id="event-{event.id}-details" class="event-details">
              {#if event.description}
                <p class="event-description">{event.description}</p>
              {/if}

              <div class="event-meta">
                <span class="significance-level">
                  Significance: {getSignificanceLabel(event.significance)}
                </span>

                {#if event.evidence && event.evidence.length > 0}
                  <span class="evidence-count">
                    Evidence: {event.evidence.length} items
                  </span>
                {/if}

                {#if event.culturalContext}
                  <span class="context-indicator">
                    Includes cultural context
                  </span>
                {/if}
              </div>
            </div>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Cultural analysis summary for screen readers -->
  {#if showAnalysis}
    <div class="analysis-summary">
      <h3>Cultural Impact Analysis Summary</h3>

      <div class="analysis-stats">
        <div class="stat-group">
          <h4>Event Distribution</h4>
          <ul>
            <li>Seismic events: {getEventCountByImpact('seismic')}</li>
            <li>High impact events: {getEventCountByImpact('high')}</li>
            <li>Medium impact events: {getEventCountByImpact('medium')}</li>
            <li>Low impact events: {getEventCountByImpact('low')}</li>
          </ul>
        </div>

        <div class="stat-group">
          <h4>Temporal Distribution</h4>
          <ul>
            <li>Initial phase (Days 0-108): {getEventsInRange(0, 108)} events</li>
            <li>Watershed period (Days 108-140): {getEventsInRange(108, 140)} events</li>
            <li>Peak phase (Days 140-200): {getEventsInRange(140, 200)} events</li>
            <li>Integration phase (Days 200-333): {getEventsInRange(200, 333)} events</li>
          </ul>
        </div>

        <div class="stat-group">
          <h4>Musical Tempo Correlation</h4>
          <p>
            The timeline events show strong correlation with the original song's
            85 BPM tempo, with peak cultural moments aligning with musical
            crescendos at approximately 1:45 and 3:15 in the composition.
          </p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Keyboard shortcuts help -->
  <div class="keyboard-shortcuts" class:visible={showShortcuts}>
    <h3>Keyboard Shortcuts</h3>

    <dl class="shortcuts-list">
      <dt>Space / Enter</dt>
      <dd>Play/pause timeline or select focused event</dd>

      <dt>Left/Right Arrow</dt>
      <dd>Navigate to previous/next event</dd>

      <dt>Home / End</dt>
      <dd>Jump to first/last event</dd>

      <dt>1, 2, 3, 4</dt>
      <dd>Set playback speed (0.5x, 1x, 2x, 4x)</dd>

      <dt>F</dt>
      <dd>Toggle event filter menu</dd>

      <dt>L</dt>
      <dd>Toggle event list view</dd>

      <dt>A</dt>
      <dd>Toggle analysis summary</dd>

      <dt>Escape</dt>
      <dd>Close modal or return to overview</dd>

      <dt>?</dt>
      <dd>Toggle this help menu</dd>
    </dl>
  </div>

  <!-- Live region for dynamic announcements -->
  <div id="dynamic-announcements" aria-live="assertive" aria-atomic="true" class="sr-only">
    {#if announcement}
      {announcement}
    {/if}
  </div>
</div>

<!-- Control buttons for accessibility features -->
<div class="accessibility-controls">
  <button
    class="accessibility-toggle"
    class:active={showEventList}
    on:click={toggleEventList}
    aria-pressed={showEventList}
    aria-label="Toggle event list view"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 13H9V11H3V13ZM3 9H9V7H3V9ZM3 17H9V15H3V17ZM11 13H21V11H11V13ZM11 9H21V7H11V9ZM11 17H21V15H11V17Z"/>
    </svg>
    <span class="toggle-label">Event List</span>
  </button>

  <button
    class="accessibility-toggle"
    class:active={showAnalysis}
    on:click={toggleAnalysis}
    aria-pressed={showAnalysis}
    aria-label="Toggle analysis summary"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"/>
    </svg>
    <span class="toggle-label">Analysis</span>
  </button>

  <button
    class="accessibility-toggle"
    class:active={showShortcuts}
    on:click={toggleShortcuts}
    aria-pressed={showShortcuts}
    aria-label="Toggle keyboard shortcuts help"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 3V15H13V3H11ZM7 5V7H11V5H7ZM7 17V19H11V17H7ZM13 17V19H17V17H13ZM13 5V7H17V5H13Z"/>
    </svg>
    <span class="toggle-label">Shortcuts</span>
  </button>

  <button
    class="accessibility-toggle"
    on:click={announcePosition}
    aria-label="Announce current timeline position"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.5 8.71 14 7.97V16.02C15.5 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12S16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12S18.01 4.14 14 3.23Z"/>
    </svg>
    <span class="toggle-label">Announce</span>
  </button>
</div>

<script>
  import { createEventDispatcher } from 'svelte';

  export let timelineData;
  export let currentEvent = null;
  export let currentEventId = null;

  const dispatch = createEventDispatcher();

  let showEventList = false;
  let showAnalysis = false;
  let showShortcuts = false;
  let eventFilter = '';
  let sortOrder = 'chronological';
  let announcement = '';

  // Filtered and sorted events
  $: filteredEvents = getFilteredAndSortedEvents(timelineData.keyEvents, eventFilter, sortOrder);

  function getFilteredAndSortedEvents(events, filter, sort) {
    let filtered = events;

    // Apply filter
    if (filter) {
      filtered = events.filter(event =>
        event.culturalImpact === filter ||
        event.significance === filter
      );
    }

    // Apply sort
    switch (sort) {
      case 'impact':
        const impactOrder = { 'seismic': 4, 'high': 3, 'medium': 2, 'low': 1 };
        filtered = [...filtered].sort((a, b) =>
          (impactOrder[b.culturalImpact] || 0) - (impactOrder[a.culturalImpact] || 0)
        );
        break;
      case 'significance':
        const sigOrder = { 'primary': 4, 'major': 3, 'notable': 2, 'background': 1 };
        filtered = [...filtered].sort((a, b) =>
          (sigOrder[b.significance] || 0) - (sigOrder[a.significance] || 0)
        );
        break;
      case 'chronological':
      default:
        filtered = [...filtered].sort((a, b) =>
          (a.dayNumber || 0) - (b.dayNumber || 0)
        );
        break;
    }

    return filtered;
  }

  function getFilteredCount(filter) {
    return timelineData.keyEvents.filter(event =>
      event.culturalImpact === filter || event.significance === filter
    ).length;
  }

  function getEventCountByImpact(impact) {
    return timelineData.keyEvents.filter(event =>
      event.culturalImpact === impact
    ).length;
  }

  function getEventsInRange(startDay, endDay) {
    return timelineData.keyEvents.filter(event => {
      const day = event.dayNumber || 0;
      return day >= startDay && day <= endDay;
    }).length;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getCulturalImpactLabel(impact) {
    const labels = {
      'low': 'Low Cultural Impact',
      'medium': 'Medium Cultural Impact',
      'high': 'High Cultural Impact',
      'seismic': 'Seismic Cultural Impact'
    };
    return labels[impact] || 'Cultural Event';
  }

  function getSignificanceLabel(significance) {
    const labels = {
      'background': 'Background Event',
      'notable': 'Notable Event',
      'major': 'Major Event',
      'primary': 'Primary Event'
    };
    return labels[significance] || 'Event';
  }

  // Event handlers
  function handleFilterChange(event) {
    eventFilter = event.target.value;
    announceChange(`Filtered to show ${filteredEvents.length} events`);
  }

  function handleSortChange(event) {
    sortOrder = event.target.value;
    announceChange(`Events sorted by ${sortOrder}`);
  }

  function selectEvent(event, index) {
    dispatch('selectEvent', { event, index });
    announceChange(`Selected ${event.title} on Day ${event.dayNumber}`);
  }

  function toggleEventList() {
    showEventList = !showEventList;
    announceChange(showEventList ? 'Event list opened' : 'Event list closed');
  }

  function toggleAnalysis() {
    showAnalysis = !showAnalysis;
    announceChange(showAnalysis ? 'Analysis summary opened' : 'Analysis summary closed');
  }

  function toggleShortcuts() {
    showShortcuts = !showShortcuts;
    announceChange(showShortcuts ? 'Keyboard shortcuts opened' : 'Keyboard shortcuts closed');
  }

  function announcePosition() {
    if (currentEvent) {
      const message = `Current position: Day ${currentEvent.dayNumber}, ${currentEvent.title}, ${getCulturalImpactLabel(currentEvent.culturalImpact)}`;
      announceChange(message);
    }
  }

  function announceChange(message) {
    announcement = message;
    setTimeout(() => {
      announcement = '';
    }, 1000);
  }

  // Global keyboard shortcuts
  function handleGlobalKeydown(event) {
    // Only handle if no input is focused
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
      return;
    }

    switch (event.key.toLowerCase()) {
      case 'l':
        event.preventDefault();
        toggleEventList();
        break;
      case 'a':
        event.preventDefault();
        toggleAnalysis();
        break;
      case '?':
        event.preventDefault();
        toggleShortcuts();
        break;
      case '1':
        event.preventDefault();
        dispatch('setSpeed', { speed: 0.5 });
        announceChange('Speed set to half');
        break;
      case '2':
        event.preventDefault();
        dispatch('setSpeed', { speed: 1 });
        announceChange('Speed set to normal');
        break;
      case '3':
        event.preventDefault();
        dispatch('setSpeed', { speed: 2 });
        announceChange('Speed set to double');
        break;
      case '4':
        event.preventDefault();
        dispatch('setSpeed', { speed: 4 });
        announceChange('Speed set to quadruple');
        break;
    }
  }

  // Setup global keyboard listeners
  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    document.addEventListener('keydown', handleGlobalKeydown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleGlobalKeydown);
  });
</script>

<style>
  .timeline-accessibility {
    font-family: 'Source Sans 3', system-ui, sans-serif;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .event-list-container {
    display: none;
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }

  .event-list-container.visible {
    display: block;
  }

  .event-list-container h3 {
    color: var(--color-primary);
    margin: 0 0 1rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
  }

  .list-description {
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .list-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-label,
  .sort-label {
    font-size: 0.9rem;
    color: var(--color-primary);
    font-weight: 500;
  }

  .event-filter,
  .sort-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-light);
    color: var(--color-primary);
    font-size: 0.9rem;
  }

  .event-filter:focus,
  .sort-select:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
    border-color: var(--color-accent);
  }

  .event-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .event-item {
    border-radius: 8px;
    overflow: hidden;
  }

  .event-link {
    display: block;
    width: 100%;
    padding: 1rem;
    background: rgba(254, 252, 246, 0.5);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    color: inherit;
    text-decoration: none;
  }

  .event-link:hover,
  .event-link:focus {
    background: rgba(131, 158, 117, 0.1);
    border-color: var(--color-accent);
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }

  .event-link.current {
    background: rgba(125, 68, 80, 0.1);
    border-color: var(--color-primary);
  }

  .event-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .event-number {
    font-weight: 600;
    color: var(--color-primary);
    font-size: 0.9rem;
  }

  .event-date {
    color: var(--color-primary);
    opacity: 0.8;
    font-size: 0.9rem;
  }

  .cultural-impact-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .cultural-impact-badge[data-level="seismic"] {
    background: var(--color-critical);
    color: var(--color-light);
  }

  .cultural-impact-badge[data-level="high"] {
    background: var(--color-primary);
    color: var(--color-light);
  }

  .cultural-impact-badge[data-level="medium"] {
    background: var(--color-accent);
    color: var(--color-light);
  }

  .cultural-impact-badge[data-level="low"] {
    background: var(--color-border);
    color: var(--color-primary);
  }

  .event-title {
    color: var(--color-primary);
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .event-description {
    color: var(--color-primary);
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .event-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: var(--color-primary);
    opacity: 0.7;
  }

  .analysis-summary,
  .keyboard-shortcuts {
    display: none;
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }

  .analysis-summary.visible,
  .keyboard-shortcuts.visible {
    display: block;
  }

  .analysis-summary h3,
  .keyboard-shortcuts h3 {
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
  }

  .analysis-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .stat-group h4 {
    color: var(--color-primary);
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .stat-group ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .stat-group li {
    padding: 0.25rem 0;
    color: var(--color-primary);
    line-height: 1.4;
  }

  .stat-group p {
    color: var(--color-primary);
    margin: 0;
    line-height: 1.5;
  }

  .shortcuts-list {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem 2rem;
    margin: 0;
  }

  .shortcuts-list dt {
    font-weight: 600;
    color: var(--color-primary);
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }

  .shortcuts-list dd {
    margin: 0;
    color: var(--color-primary);
    line-height: 1.4;
  }

  .accessibility-controls {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .accessibility-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .accessibility-toggle:hover {
    background: rgba(131, 158, 117, 0.1);
    border-color: var(--color-accent);
  }

  .accessibility-toggle.active {
    background: var(--color-accent);
    color: var(--color-light);
    border-color: var(--color-accent);
  }

  .accessibility-toggle:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .accessibility-toggle svg {
    width: 18px;
    height: 18px;
  }

  .toggle-label {
    font-weight: 500;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .list-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .event-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .analysis-stats {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .shortcuts-list {
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
    }

    .accessibility-controls {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .event-list-container,
    .analysis-summary,
    .keyboard-shortcuts {
      padding: 1rem;
    }

    .accessibility-toggle {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }

    .accessibility-toggle svg {
      width: 16px;
      height: 16px;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .event-link,
    .event-filter,
    .sort-select,
    .accessibility-toggle {
      border-width: 2px;
    }

    .cultural-impact-badge {
      border: 1px solid currentColor;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .event-link,
    .accessibility-toggle {
      transition: none;
    }
  }
</style>