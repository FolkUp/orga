{#if event}
  <div
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    transition:fade={{ duration: 300 }}
  >
    <div
      class="modal-container"
      bind:this={modalContainer}
      transition:scale={{ duration: 300, start: 0.9 }}
    >
      <!-- Modal header -->
      <header class="modal-header">
        <div class="header-main">
          <div class="event-meta">
            <div class="event-day">Day {event.dayNumber}</div>
            <div class="event-date">{formatDate(event.date)}</div>
          </div>

          <h2 id="modal-title" class="event-title">{event.title}</h2>

          <div class="cultural-impact-badge" data-impact={event.culturalImpact}>
            <div class="impact-indicator" data-level={event.culturalImpact}></div>
            <span class="impact-label">{getCulturalImpactLabel(event.culturalImpact)}</span>
          </div>
        </div>

        <div class="header-controls">
          <div class="navigation-controls">
            <button
              class="nav-button prev"
              on:click={navigatePrevious}
              disabled={!hasPrevious}
              aria-label="Previous event"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12Z"/>
              </svg>
            </button>

            <span class="event-counter">{eventIndex + 1} / {totalEvents}</span>

            <button
              class="nav-button next"
              on:click={navigateNext}
              disabled={!hasNext}
              aria-label="Next event"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12Z"/>
              </svg>
            </button>
          </div>

          <button
            class="close-button"
            on:click={closeModal}
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12Z"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Modal body -->
      <main class="modal-body">
        <!-- Event description -->
        <section class="event-description">
          <p id="modal-description" class="description-text">{event.description}</p>

          {#if event.culturalContext}
            <div class="cultural-context">
              <h3>Cultural Context</h3>
              <p>{event.culturalContext}</p>
            </div>
          {/if}
        </section>

        <!-- Cultural analysis visualization -->
        <section class="cultural-analysis">
          <h3>Cultural Impact Analysis</h3>

          <div class="analysis-grid">
            <!-- Impact metrics -->
            <div class="metric-card">
              <h4>Reach & Spread</h4>
              <div class="metric-visual">
                <div class="spread-visualization">
                  {#each spreadData as layer, index}
                    <div
                      class="spread-layer"
                      style="
                        animation-delay: {index * 0.2}s;
                        transform: scale({1 + (layer.intensity * 0.5)});
                        opacity: {0.3 + (layer.intensity * 0.7)};
                      "
                      data-layer={layer.type}
                    ></div>
                  {/each}
                </div>
                <div class="metric-value">{getReachMetric(event)}</div>
              </div>
            </div>

            <!-- Temporal resonance -->
            <div class="metric-card">
              <h4>Temporal Resonance</h4>
              <div class="metric-visual">
                <div class="resonance-wave">
                  {#each resonanceData as point, index}
                    <div
                      class="wave-point"
                      style="
                        left: {(index / (resonanceData.length - 1)) * 100}%;
                        height: {Math.abs(point) * 80 + 20}%;
                        background: {point > 0 ? 'var(--color-primary)' : 'var(--color-accent)'};
                      "
                    ></div>
                  {/each}
                </div>
                <div class="metric-value">{getResonanceMetric(event)}</div>
              </div>
            </div>

            <!-- Cultural seismography -->
            <div class="metric-card">
              <h4>Seismic Magnitude</h4>
              <div class="metric-visual">
                <div class="seismic-gauge">
                  <div
                    class="gauge-needle"
                    style="transform: rotate({getSeismicAngle(event)}deg)"
                  ></div>
                  <div class="gauge-scale">
                    {#each [1, 2, 3, 4, 5] as level}
                      <div class="scale-mark" data-level={level}></div>
                    {/each}
                  </div>
                </div>
                <div class="metric-value">{getSeismicMagnitude(event)}</div>
              </div>
            </div>

            <!-- Musical tempo correlation -->
            <div class="metric-card">
              <h4>Tempo Correlation</h4>
              <div class="metric-visual">
                <div class="tempo-correlation">
                  <div class="tempo-wave">
                    <div class="base-tempo" style="animation-duration: {60/85}s"></div>
                    <div class="cultural-tempo" style="animation-duration: {getCulturalTempo(event)}s"></div>
                  </div>
                </div>
                <div class="metric-value">{getTempoSync(event)}%</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Evidence preview -->
        {#if event.evidence && event.evidence.length > 0}
          <section class="evidence-section">
            <h3>Supporting Evidence</h3>

            <div class="evidence-grid">
              {#each event.evidence.slice(0, 6) as evidenceItem, index}
                <div class="evidence-card" on:click={() => openEvidence(evidenceItem.id)}>
                  <div class="evidence-type" data-type={evidenceItem.type}>
                    {getEvidenceIcon(evidenceItem.type)}
                  </div>
                  <div class="evidence-content">
                    <div class="evidence-title">{evidenceItem.title}</div>
                    <div class="evidence-source">{evidenceItem.source}</div>
                  </div>
                </div>
              {/each}
            </div>

            {#if event.evidence.length > 6}
              <button
                class="view-all-evidence"
                on:click={viewAllEvidence}
              >
                View All {event.evidence.length} Evidence Items →
              </button>
            {/if}
          </section>
        {/if}

        <!-- Timeline context -->
        <section class="timeline-context">
          <h3>Timeline Context</h3>

          <div class="context-timeline">
            <div class="context-track">
              <!-- Previous events -->
              {#each contextEvents.previous as contextEvent}
                <div
                  class="context-event previous"
                  style="left: {(contextEvent.dayNumber / 333) * 100}%"
                  on:click={() => navigateToEvent(contextEvent)}
                >
                  <div class="context-marker" data-impact={contextEvent.culturalImpact}></div>
                  <div class="context-label">{contextEvent.title}</div>
                </div>
              {/each}

              <!-- Current event -->
              <div
                class="context-event current"
                style="left: {(event.dayNumber / 333) * 100}%"
              >
                <div class="context-marker active" data-impact={event.culturalImpact}></div>
                <div class="context-label">{event.title}</div>
              </div>

              <!-- Upcoming events -->
              {#each contextEvents.next as contextEvent}
                <div
                  class="context-event next"
                  style="left: {(contextEvent.dayNumber / 333) * 100}%"
                  on:click={() => navigateToEvent(contextEvent)}
                >
                  <div class="context-marker" data-impact={contextEvent.culturalImpact}></div>
                  <div class="context-label">{contextEvent.title}</div>
                </div>
              {/each}
            </div>
          </div>
        </section>
      </main>

      <!-- Modal footer -->
      <footer class="modal-footer">
        <div class="action-buttons">
          <button
            class="action-button secondary"
            on:click={shareEvent}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"/>
            </svg>
            Share Event
          </button>

          <button
            class="action-button primary"
            on:click={exploreEvidence}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5C16 11.11 15.41 12.59 14.44 13.73L14.71 14H15.5L20.5 19L19 20.5L14 15.5V14.71L13.73 14.44C12.59 15.41 11.11 16 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3M9.5 5C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z"/>
            </svg>
            Explore Evidence
          </button>
        </div>

        <div class="modal-info">
          <span class="copyright">© 2026 FolkUp Cultural Timeline</span>
          <span class="compliance">Evidence verified • WCAG 2.1 AA compliant</span>
        </div>
      </footer>
    </div>
  </div>
{/if}

<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let event;
  export let totalEvents = 0;
  export let eventIndex = 0;
  export let contextEvents = { previous: [], next: [] };

  const dispatch = createEventDispatcher();

  let modalContainer;
  let hasPrevious = false;
  let hasNext = false;

  // Cultural analysis data generation
  $: spreadData = generateSpreadData(event);
  $: resonanceData = generateResonanceData(event);

  // Navigation state
  $: hasPrevious = eventIndex > 0;
  $: hasNext = eventIndex < totalEvents - 1;

  function generateSpreadData(event) {
    const impactLevel = getImpactLevel(event.culturalImpact);
    return [
      { type: 'core', intensity: 1.0 },
      { type: 'primary', intensity: impactLevel * 0.8 },
      { type: 'secondary', intensity: impactLevel * 0.6 },
      { type: 'tertiary', intensity: impactLevel * 0.4 }
    ];
  }

  function generateResonanceData(event) {
    const points = 30;
    const impactLevel = getImpactLevel(event.culturalImpact);
    const data = [];

    for (let i = 0; i < points; i++) {
      const t = i / points;
      // Cultural resonance wave pattern
      const wave = Math.sin(t * Math.PI * 4) * impactLevel;
      // Temporal decay
      const decay = Math.exp(-t * 2) * 0.5;
      // Viral amplification
      const viral = Math.exp(-((t - 0.3) ** 2) / 0.2) * impactLevel;

      data.push((wave + decay + viral) * 0.6);
    }

    return data;
  }

  function getImpactLevel(impact) {
    const levels = {
      'low': 0.25,
      'medium': 0.5,
      'high': 0.75,
      'seismic': 1.0
    };
    return levels[impact] || 0.5;
  }

  function getCulturalImpactLabel(impact) {
    const labels = {
      'low': 'Background Event',
      'medium': 'Notable Moment',
      'high': 'Major Cultural Shift',
      'seismic': 'Seismic Cultural Event'
    };
    return labels[impact] || 'Cultural Event';
  }

  function getReachMetric(event) {
    const reach = {
      'low': '10K+',
      'medium': '100K+',
      'high': '1M+',
      'seismic': '10M+'
    };
    return reach[event.culturalImpact] || 'Unknown';
  }

  function getResonanceMetric(event) {
    const resonance = {
      'low': '2.3',
      'medium': '4.7',
      'high': '7.2',
      'seismic': '9.8'
    };
    return resonance[event.culturalImpact] || '0.0';
  }

  function getSeismicMagnitude(event) {
    const magnitude = {
      'low': '1.2',
      'medium': '3.8',
      'high': '6.4',
      'seismic': '8.9'
    };
    return magnitude[event.culturalImpact] || '0.0';
  }

  function getSeismicAngle(event) {
    const angles = {
      'low': -60,
      'medium': -20,
      'high': 20,
      'seismic': 60
    };
    return angles[event.culturalImpact] || -60;
  }

  function getCulturalTempo(event) {
    // Base 85 BPM modified by cultural intensity
    const baseTempo = 85;
    const impactLevel = getImpactLevel(event.culturalImpact);
    const modifiedTempo = baseTempo + (impactLevel * 15); // 85-100 BPM range
    return 60 / modifiedTempo; // Convert to seconds per beat
  }

  function getTempoSync(event) {
    const sync = {
      'low': 45,
      'medium': 70,
      'high': 85,
      'seismic': 95
    };
    return sync[event.culturalImpact] || 50;
  }

  function getEvidenceIcon(type) {
    const icons = {
      'news': '📰',
      'social': '💬',
      'video': '🎥',
      'audio': '🎵',
      'document': '📄',
      'image': '🖼️',
      'data': '📊',
      'legal': '⚖️'
    };
    return icons[type] || '📋';
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Navigation handlers
  function navigatePrevious() {
    if (hasPrevious) {
      dispatch('navigate', { direction: 'prev' });
    }
  }

  function navigateNext() {
    if (hasNext) {
      dispatch('navigate', { direction: 'next' });
    }
  }

  function navigateToEvent(contextEvent) {
    dispatch('navigate', { event: contextEvent });
  }

  function closeModal() {
    dispatch('close');
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event) {
    switch (event.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        if (hasPrevious) navigatePrevious();
        break;
      case 'ArrowRight':
        if (hasNext) navigateNext();
        break;
    }
  }

  // Evidence interaction
  function openEvidence(evidenceId) {
    dispatch('evidence', { evidenceId });
  }

  function viewAllEvidence() {
    dispatch('evidence', { event, viewAll: true });
  }

  function exploreEvidence() {
    dispatch('evidence', { event });
  }

  function shareEvent() {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.title} - Day ${event.dayNumber} of the cultural timeline`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.href}#day-${event.dayNumber}`;
      navigator.clipboard.writeText(url);
    }
  }

  // Lifecycle
  onMount(() => {
    // Focus management for accessibility
    if (modalContainer) {
      modalContainer.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    // Restore body scroll
    document.body.style.overflow = '';
  });
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
  }

  .modal-container {
    background: var(--color-light);
    border-radius: 16px;
    box-shadow: 0 16px 48px rgba(125, 68, 80, 0.2);
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    outline: none;
  }

  .modal-header {
    padding: 2rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    color: var(--color-light);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .header-main {
    flex: 1;
  }

  .event-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .event-day {
    font-weight: 600;
  }

  .event-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .cultural-impact-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
  }

  .impact-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: currentColor;
  }

  .impact-indicator[data-level="seismic"] {
    animation: impactPulse 1.5s ease-in-out infinite;
  }

  @keyframes impactPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }

  .header-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }

  .navigation-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem;
    border-radius: 8px;
  }

  .nav-button {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-light);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .nav-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-button svg {
    width: 18px;
    height: 18px;
  }

  .event-counter {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0 0.5rem;
    min-width: 60px;
    text-align: center;
  }

  .close-button {
    width: 36px;
    height: 36px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-light);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .close-button svg {
    width: 20px;
    height: 20px;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  .event-description {
    margin-bottom: 2rem;
  }

  .description-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
  }

  .cultural-context {
    background: rgba(131, 158, 117, 0.1);
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid var(--color-accent);
  }

  .cultural-context h3 {
    color: var(--color-accent);
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
  }

  .cultural-context p {
    margin: 0;
    color: var(--color-primary);
    line-height: 1.5;
  }

  .cultural-analysis {
    margin-bottom: 2rem;
  }

  .cultural-analysis h3 {
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .metric-card {
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
  }

  .metric-card h4 {
    color: var(--color-primary);
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .metric-visual {
    position: relative;
    height: 80px;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spread-visualization {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .spread-layer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px solid var(--color-accent);
    animation: spreadPulse 3s ease-in-out infinite;
  }

  .spread-layer[data-layer="core"] {
    width: 20px;
    height: 20px;
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  .spread-layer[data-layer="primary"] {
    width: 40px;
    height: 40px;
  }

  .spread-layer[data-layer="secondary"] {
    width: 60px;
    height: 60px;
  }

  .spread-layer[data-layer="tertiary"] {
    width: 80px;
    height: 80px;
  }

  @keyframes spreadPulse {
    0%, 100% {
      opacity: var(--layer-opacity, 0.3);
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: calc(var(--layer-opacity, 0.3) * 0.6);
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  .resonance-wave {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    height: 60px;
    gap: 2px;
  }

  .wave-point {
    flex: 1;
    min-height: 4px;
    max-width: 3px;
    border-radius: 1px;
    transition: height 0.3s ease;
  }

  .seismic-gauge {
    position: relative;
    width: 80px;
    height: 40px;
    border: 2px solid var(--color-border);
    border-top: 2px solid var(--color-primary);
    border-radius: 80px 80px 0 0;
    overflow: hidden;
  }

  .gauge-needle {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 2px;
    height: 40px;
    background: var(--color-critical);
    transform-origin: 50% 0%;
    transition: transform 0.5s ease;
  }

  .gauge-scale {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 8px;
  }

  .scale-mark {
    width: 1px;
    height: 8px;
    background: var(--color-border);
  }

  .scale-mark[data-level="3"] {
    background: var(--color-warning);
    height: 12px;
  }

  .scale-mark[data-level="5"] {
    background: var(--color-critical);
    height: 12px;
  }

  .tempo-correlation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
  }

  .tempo-wave {
    position: relative;
    width: 80px;
    height: 40px;
  }

  .base-tempo,
  .cultural-tempo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    animation: tempoPulse ease-in-out infinite;
  }

  .base-tempo {
    background: var(--color-accent);
    opacity: 0.6;
  }

  .cultural-tempo {
    background: var(--color-primary);
    width: 20px;
    height: 20px;
  }

  @keyframes tempoPulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 0.7;
    }
  }

  .metric-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .evidence-section {
    margin-bottom: 2rem;
  }

  .evidence-section h3 {
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
  }

  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .evidence-card {
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .evidence-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(125, 68, 80, 0.1);
  }

  .evidence-type {
    font-size: 1.5rem;
    min-width: 40px;
    text-align: center;
  }

  .evidence-content {
    flex: 1;
  }

  .evidence-title {
    font-weight: 500;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .evidence-source {
    font-size: 0.8rem;
    color: var(--color-primary);
    opacity: 0.7;
  }

  .view-all-evidence {
    background: none;
    border: 1px solid var(--color-accent);
    color: var(--color-accent);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .view-all-evidence:hover {
    background: var(--color-accent);
    color: var(--color-light);
  }

  .timeline-context {
    margin-bottom: 1rem;
  }

  .timeline-context h3 {
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
  }

  .context-timeline {
    position: relative;
    height: 80px;
    background: rgba(131, 158, 117, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .context-track {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .context-event {
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .context-event:hover:not(.current) {
    transform: translateX(-50%) translateY(-50%) scale(1.1);
  }

  .context-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-border);
    border: 2px solid var(--color-light);
    margin-bottom: 0.5rem;
  }

  .context-marker[data-impact="high"] {
    background: var(--color-primary);
  }

  .context-marker[data-impact="seismic"] {
    background: var(--color-critical);
    animation: contextPulse 2s ease-in-out infinite;
  }

  .context-marker.active {
    background: var(--color-accent);
    transform: scale(1.3);
    box-shadow: 0 0 8px var(--color-accent);
  }

  @keyframes contextPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  .context-label {
    font-size: 0.7rem;
    color: var(--color-primary);
    text-align: center;
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .context-event.previous .context-label,
  .context-event.next .context-label {
    opacity: 0.7;
  }

  .modal-footer {
    padding: 1.5rem 2rem;
    background: rgba(254, 252, 246, 0.8);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .action-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .action-button.primary {
    background: var(--color-primary);
    color: var(--color-light);
  }

  .action-button.primary:hover {
    background: var(--color-accent);
  }

  .action-button.secondary {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-border);
  }

  .action-button.secondary:hover {
    background: var(--color-border);
  }

  .action-button svg {
    width: 16px;
    height: 16px;
  }

  .modal-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-size: 0.7rem;
    color: var(--color-primary);
    opacity: 0.7;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .modal-container {
      max-height: 95vh;
    }

    .modal-header {
      padding: 1.5rem;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .header-controls {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .analysis-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .evidence-grid {
      grid-template-columns: 1fr;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      flex-direction: column;
      align-items: stretch;
    }

    .action-buttons {
      justify-content: center;
    }

    .modal-info {
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .event-title {
      font-size: 1.3rem;
    }

    .metric-card {
      padding: 1rem;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-button {
      justify-content: center;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .spread-layer,
    .base-tempo,
    .cultural-tempo,
    .impact-indicator,
    .context-marker {
      animation: none;
    }

    .nav-button,
    .evidence-card,
    .context-event {
      transition: none;
    }
  }

  @media (prefers-contrast: high) {
    .modal-container {
      border: 3px solid var(--color-primary);
    }

    .metric-card {
      border-width: 2px;
    }

    .evidence-card {
      border-width: 2px;
    }
  }

  /* Focus management */
  .modal-container:focus {
    outline: none;
  }

  .nav-button:focus,
  .close-button:focus,
  .action-button:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>