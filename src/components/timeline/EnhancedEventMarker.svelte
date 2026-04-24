<div
  class="enhanced-event-marker"
  class:active
  class:prophecy={event.heroNarrative?.arc === 'prophecy'}
  class:validation={event.heroNarrative?.arc === 'validation'}
  class:recognition={event.heroNarrative?.arc === 'recognition'}
  data-impact={event.culturalImpact}
  data-significance={event.significance}
  data-meme-phase={event.memeLifecycle?.phase}
  data-hero-arc={event.heroNarrative?.arc}
  role="button"
  tabindex="0"
  aria-label="Event: {event.title} on {formatDate(event.date)} - {event.heroNarrative?.arc} phase"
  aria-pressed={active}
  on:click={handleClick}
  on:keydown={handleKeydown}
  on:mouseenter={handleHover}
  on:mouseleave={handleUnhover}
  on:focus={handleFocus}
  on:blur={handleBlur}
  style="
    left: {position}%;
    --cultural-intensity: {culturalIntensity};
    --impact-color: {getImpactColor(event.culturalImpact)};
    --significance-size: {getSignificanceSize(event.significance)};
    --meme-velocity: {event.memeLifecycle?.velocity || 0.3};
    --seismic-magnitude: {event.musicalSeismography?.magnitude || 2.0};
    --hero-tension: {getHeroTension(event.heroNarrative?.tension)};
  "
>
  <!-- Underground Academia Document Styling -->
  <div class="underground-document" data-document-type={event.undergroundAcademia?.documentType}>

    <!-- Scholarly Apparatus - Archival Code -->
    <div class="archival-metadata">
      <span class="archival-code">{event.undergroundAcademia?.scholarlyApparatus?.archivalCode}</span>
      <span class="footnote-marker">{event.undergroundAcademia?.scholarlyApparatus?.footnoteMarker}</span>
    </div>

    <!-- Meme Lifecycle Propagation Visualization -->
    <div class="meme-propagation-rings" data-phase={event.memeLifecycle?.phase}>
      {#each Array(3) as _, i}
        <div
          class="propagation-ring"
          style="
            animation-delay: {i * 0.6}s;
            animation-duration: {3 / (event.memeLifecycle?.velocity || 0.3)}s;
          "
        ></div>
      {/each}
    </div>

    <!-- Musical Seismograph Trace -->
    <div class="seismograph-apparatus" class:active={showSeismograph}>
      <div class="seismograph-readings">
        {#each seismographTrace as reading, index}
          <div
            class="seismic-trace-point"
            style="
              left: {(index / (seismographTrace.length - 1)) * 100}%;
              height: {Math.abs(reading.amplitude) * 100}%;
              background: {reading.amplitude > 0 ? 'var(--underground-sepia)' : 'var(--underground-graphite)'};
              opacity: {reading.intensity};
            "
          ></div>
        {/each}
      </div>

      <!-- Frequency indicator -->
      <div class="frequency-display">
        <span class="frequency-value">{event.musicalSeismography?.frequency || 85}</span>
        <span class="frequency-unit">Hz</span>
      </div>
    </div>

    <!-- Hero Narrative Arc Indicator -->
    <div class="hero-arc-indicator" data-arc={event.heroNarrative?.arc}>
      <div class="arc-symbol">
        {#if event.heroNarrative?.arc === 'prophecy'}
          <!-- Oracle eye symbol -->
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 5C8.69 5 5.76 7.09 4.81 10.24C4.64 10.75 4.64 11.25 4.81 11.76C5.76 14.91 8.69 17 12 17C15.31 17 18.24 14.91 19.19 11.76C19.36 11.25 19.36 10.75 19.19 10.24C18.24 7.09 15.31 5 12 5Z"/>
          </svg>
        {:else if event.heroNarrative?.arc === 'validation'}
          <!-- Lightning bolt symbol -->
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2V13H10V22L17 10H13L17 2H7Z"/>
          </svg>
        {:else if event.heroNarrative?.arc === 'recognition'}
          <!-- Crown/laurel symbol -->
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5L7.5 10L12 4L16.5 10L21 5L19 16H5ZM12 18C13.1 18 14 18.9 14 20S13.1 22 12 22 10 20.9 10 20 10.9 18 12 18Z"/>
          </svg>
        {/if}
      </div>

      <div class="arc-tension-meter">
        <div
          class="tension-fill"
          style="width: {(event.heroNarrative?.tension === 'anticipation' ? 30 :
                         event.heroNarrative?.tension === 'revelation' ? 80 : 60)}%"
        ></div>
      </div>
    </div>

    <!-- Core Event Marker -->
    <div class="marker-core">
      <div class="marker-icon" data-type={event.iconType || 'default'}>
        {#if event.iconType === 'genesis'}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
        {:else if event.iconType === 'watershed'}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21Z"/>
          </svg>
        {:else if event.iconType === 'viral'}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 10C7.3 10 8 9.3 8 8.5S7.3 7 6.5 7 5 7.7 5 8.5 5.7 10 6.5 10ZM9 13C9.8 13 10.5 12.3 10.5 11.5S9.8 10 9 10 7.5 10.7 7.5 11.5 8.2 13 9 13ZM12 6C12.8 6 13.5 5.3 13.5 4.5S12.8 3 12 3 10.5 3.7 10.5 4.5 11.2 6 12 6ZM17.5 10C18.3 10 19 9.3 19 8.5S18.3 7 17.5 7 16 7.7 16 8.5 16.7 10 17.5 10Z"/>
          </svg>
        {:else if event.iconType === 'legal'}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 7L12 12L23 7L12 2ZM5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
          </svg>
        {:else}
          <div class="default-marker"></div>
        {/if}
      </div>

      <!-- Significance indicator with Underground Academia styling -->
      <div class="significance-indicator" data-significance={event.significance}>
        <div class="significance-dot"></div>
      </div>
    </div>

    <!-- Cultural Intensity Glow -->
    <div class="cultural-intensity-glow"
         style="opacity: {event.musicalSeismography?.tension || 0.3}"></div>
  </div>

  <!-- Enhanced Preview Modal -->
  {#if showPreview}
    <div class="enhanced-event-preview" transition:fade={{ duration: 200 }}>

      <!-- Underground Academia Header -->
      <header class="preview-header underground-header">
        <div class="document-classification">
          <span class="classification-stamp">UNDERGROUND ACADEMIA</span>
          <span class="document-id">{event.undergroundAcademia?.scholarlyApparatus?.archivalCode}</span>
        </div>

        <h4 class="preview-title">{event.title}</h4>

        <div class="preview-meta">
          <span class="preview-date">{formatDate(event.date)}</span>
          <span class="preview-day">Day {event.dayNumber}</span>
          <span class="cultural-magnitude">Magnitude {event.musicalSeismography?.magnitude?.toFixed(1) || '2.0'}</span>
        </div>
      </header>

      <!-- Framework Analysis Panel -->
      <div class="framework-analysis">

        <!-- Meme Lifecycle Status -->
        <div class="analysis-section meme-lifecycle">
          <h5>Meme Lifecycle Phase</h5>
          <div class="phase-indicator" data-phase={event.memeLifecycle?.phase}>
            <span class="phase-name">{event.memeLifecycle?.phase?.toUpperCase() || 'UNKNOWN'}</span>
            <div class="velocity-meter">
              <div class="velocity-bar" style="width: {(event.memeLifecycle?.velocity || 0.3) * 100}%"></div>
            </div>
          </div>
          <div class="propagation-pattern">
            Pattern: <em>{event.memeLifecycle?.propagationPattern?.replace(/_/g, ' ') || 'baseline'}</em>
          </div>
        </div>

        <!-- Musical Seismography -->
        <div class="analysis-section musical-seismography">
          <h5>Cultural Seismography</h5>
          <div class="seismic-readings">
            <div class="reading-item">
              <span class="reading-label">Magnitude:</span>
              <span class="reading-value">{event.musicalSeismography?.magnitude?.toFixed(1) || '2.0'}</span>
            </div>
            <div class="reading-item">
              <span class="reading-label">Frequency:</span>
              <span class="reading-value">{event.musicalSeismography?.frequency || 85} Hz</span>
            </div>
            <div class="reading-item">
              <span class="reading-label">Tension:</span>
              <span class="reading-value">{((event.musicalSeismography?.tension || 0.3) * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div class="seismic-pattern">
            Pattern: <em>{event.musicalSeismography?.pattern?.replace(/_/g, ' ') || 'baseline'}</em>
          </div>
        </div>

        <!-- Hero Narrative Arc -->
        <div class="analysis-section hero-narrative">
          <h5>Hero Narrative Position</h5>
          <div class="narrative-arc" data-arc={event.heroNarrative?.arc}>
            <span class="arc-phase">{event.heroNarrative?.arc?.toUpperCase() || 'UNKNOWN'}</span>
            <div class="tension-indicator">
              Tension: <em>{event.heroNarrative?.tension || 'neutral'}</em>
            </div>
          </div>
          {#if event.heroNarrative?.archetypes}
            <div class="archetypes">
              Archetypes: {event.heroNarrative.archetypes.join(', ')}
            </div>
          {/if}
        </div>
      </div>

      <!-- Event Description -->
      <div class="preview-content">
        <p class="preview-description">{event.description}</p>

        <!-- Cultural Context from Underground Academia -->
        {#if event.culturalContext}
          <div class="cultural-context">
            <h6>Cultural Context</h6>
            <p>{event.culturalContext}</p>
          </div>
        {/if}
      </div>

      <!-- Evidence and Sources -->
      {#if event.evidence && event.evidence.length > 0}
        <div class="evidence-section">
          <h6>Evidence Documentation</h6>
          <div class="evidence-grid">
            {#each event.evidence as evidenceItem}
              <div class="evidence-item" data-type={evidenceItem.type}>
                <span class="evidence-title">{evidenceItem.title}</span>
                <span class="evidence-source">{evidenceItem.source}</span>
                {#if evidenceItem.verified}
                  <span class="verification-badge">✓ VERIFIED</span>
                {/if}
              </div>
            {/each}
          </div>

          <button
            class="evidence-link underground-button"
            on:click|stopPropagation={handleEvidenceClick}
          >
            Open Evidence Gallery →
          </button>
        </div>
      {/if}

      <!-- Scholarly Footnote -->
      <footer class="preview-footer">
        <div class="scholarly-footnote">
          {event.undergroundAcademia?.scholarlyApparatus?.footnoteMarker}
          {event.undergroundAcademia?.scholarlyApparatus?.marginNote}
        </div>
      </footer>
    </div>
  {/if}

  <!-- Active State Enhancement -->
  {#if active}
    <div class="active-enhancement" transition:scale={{ duration: 300 }}>
      <div class="active-ring primary-ring"></div>
      <div class="active-ring secondary-ring"></div>
    </div>
  {/if}
</div>

<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let event;
  export let eventIndex;
  export let active = false;
  export let culturalImpact;
  export let significance;

  const dispatch = createEventDispatcher();

  let showPreview = false;
  let showSeismograph = false;
  let hoverTimeout;

  // Calculate position based on day number in 333-day timeline
  $: position = ((event.dayNumber || 0) / 333) * 100;

  // Enhanced cultural intensity calculation
  $: culturalIntensity = calculateEnhancedCulturalIntensity(event);

  // Generate seismograph trace from musical seismography data
  $: seismographTrace = generateSeismographTrace(event);

  function calculateEnhancedCulturalIntensity(event) {
    const impactWeights = {
      'low': 0.2,
      'medium': 0.5,
      'high': 0.8,
      'seismic': 1.0
    };

    const memeVelocity = event.memeLifecycle?.velocity || 0.3;
    const seismicTension = event.musicalSeismography?.tension || 0.3;
    const heroTension = getHeroTensionValue(event.heroNarrative?.tension);

    const baseIntensity = impactWeights[event.culturalImpact] || 0.3;

    // Combine all framework factors
    return Math.min(1.0, baseIntensity *
                          (memeVelocity * 0.4 +
                           seismicTension * 0.4 +
                           heroTension * 0.2));
  }

  function generateSeismographTrace(event) {
    const points = 24;
    const baseFreq = event.musicalSeismography?.frequency || 85;
    const magnitude = event.musicalSeismography?.magnitude || 2.0;
    const tension = event.musicalSeismography?.tension || 0.3;

    const trace = [];

    for (let i = 0; i < points; i++) {
      const t = i / points;

      // Base seismic wave
      const seismicWave = Math.sin(t * Math.PI * 4) * (magnitude / 10);

      // Cultural tension modulation
      const tensionMod = Math.sin(t * Math.PI * 2) * tension;

      // Musical frequency component
      const freqComponent = Math.sin(t * baseFreq * Math.PI / 42.5) * 0.3;

      const amplitude = seismicWave + tensionMod + freqComponent;
      const intensity = Math.min(1.0, Math.abs(amplitude) + tension);

      trace.push({ amplitude, intensity });
    }

    return trace;
  }

  function getImpactColor(impact) {
    const colors = {
      'low': 'var(--underground-graphite)',
      'medium': 'var(--underground-amber)',
      'high': 'var(--underground-sepia)',
      'seismic': '#D32F2F'
    };
    return colors[impact] || colors['medium'];
  }

  function getSignificanceSize(significance) {
    const sizes = {
      'background': '12px',
      'notable': '16px',
      'major': '20px',
      'primary': '24px'
    };
    return sizes[significance] || sizes['notable'];
  }

  function getHeroTension(tension) {
    return getHeroTensionValue(tension);
  }

  function getHeroTensionValue(tension) {
    const tensionMap = {
      'anticipation': 0.3,
      'revelation': 0.8,
      'resolution': 0.6,
      'neutral': 0.3
    };
    return tensionMap[tension] || 0.3;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Event handlers
  function handleClick() {
    dispatch('select', { event, index: eventIndex });
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }

  function handleHover() {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      showPreview = true;
      showSeismograph = true;
      dispatch('hover', { event });
    }, 300);
  }

  function handleUnhover() {
    clearTimeout(hoverTimeout);
    showPreview = false;
    showSeismograph = false;
  }

  function handleFocus() {
    showPreview = true;
    showSeismograph = true;
  }

  function handleBlur() {
    showPreview = false;
    showSeismograph = false;
  }

  function handleEvidenceClick() {
    dispatch('evidence', { event, evidenceId: event.evidenceId });
  }
</script>

<style>
  .enhanced-event-marker {
    /* Underground Academia Color Palette */
    --underground-sepia: #8B4513;
    --underground-graphite: #2F4F4F;
    --underground-amber: #FFBF00;
    --underground-ivory: #FEFCF6;
    --underground-charcoal: #36454F;

    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 15;
    transition: all 0.3s ease;
    cursor: pointer;
    touch-action: manipulation;
  }

  .enhanced-event-marker:hover,
  .enhanced-event-marker:focus {
    transform: translateX(-50%) translateY(-50%) scale(1.1);
    z-index: 25;
  }

  .enhanced-event-marker.active {
    transform: translateX(-50%) translateY(-50%) scale(1.2);
    z-index: 30;
  }

  /* Underground Document Base */
  .underground-document {
    position: relative;
    padding: 4px;
    background: var(--underground-ivory);
    border-radius: 6px;
    box-shadow:
      0 2px 4px rgba(139, 69, 19, 0.1),
      inset 0 0 0 1px rgba(139, 69, 19, 0.2);
  }

  .underground-document[data-document-type="samizdat"] {
    background: linear-gradient(45deg, var(--underground-ivory), rgba(139, 69, 19, 0.05));
  }

  .underground-document[data-document-type="manuscript"] {
    background: var(--underground-ivory);
    border-left: 3px solid var(--underground-sepia);
  }

  .underground-document[data-document-type="field_notes"] {
    background: var(--underground-ivory);
    border: 1px dashed var(--underground-graphite);
  }

  .underground-document[data-document-type="evidence_dossier"] {
    background: linear-gradient(135deg, var(--underground-ivory), rgba(47, 79, 79, 0.05));
  }

  /* Archival Metadata */
  .archival-metadata {
    position: absolute;
    top: -8px;
    right: -8px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: 'Courier New', monospace;
    font-size: 8px;
    color: var(--underground-graphite);
    opacity: 0.8;
  }

  .archival-code {
    background: var(--underground-ivory);
    padding: 1px 3px;
    border: 1px solid var(--underground-sepia);
    border-radius: 2px;
  }

  .footnote-marker {
    font-size: 10px;
    font-weight: bold;
    color: var(--underground-sepia);
  }

  /* Meme Lifecycle Propagation Rings */
  .meme-propagation-rings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .propagation-ring {
    position: absolute;
    border: 1px solid;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: memePropagate linear infinite;
  }

  .meme-propagation-rings[data-phase="germination"] .propagation-ring {
    border-color: rgba(255, 191, 0, 0.6);
  }

  .meme-propagation-rings[data-phase="incubation"] .propagation-ring {
    border-color: rgba(139, 69, 19, 0.6);
  }

  .meme-propagation-rings[data-phase="activation"] .propagation-ring {
    border-color: rgba(211, 47, 47, 0.8);
  }

  .meme-propagation-rings[data-phase="institutionalization"] .propagation-ring {
    border-color: rgba(47, 79, 79, 0.6);
  }

  @keyframes memePropagate {
    0% {
      width: calc(var(--significance-size) * 0.8);
      height: calc(var(--significance-size) * 0.8);
      opacity: 0;
    }
    20% {
      opacity: calc(var(--meme-velocity) * 0.8);
    }
    100% {
      width: calc(var(--significance-size) * 3);
      height: calc(var(--significance-size) * 3);
      opacity: 0;
    }
  }

  /* Musical Seismograph Apparatus */
  .seismograph-apparatus {
    position: absolute;
    top: calc(var(--significance-size) + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 16px;
    background: var(--underground-ivory);
    border: 1px solid var(--underground-sepia);
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
    overflow: hidden;
  }

  .seismograph-apparatus.active {
    opacity: 1;
  }

  .seismograph-readings {
    position: relative;
    width: 100%;
    height: 12px;
    display: flex;
    align-items: flex-end;
    background: linear-gradient(to right,
      var(--underground-ivory) 0%,
      rgba(139, 69, 19, 0.05) 50%,
      var(--underground-ivory) 100%);
  }

  .seismic-trace-point {
    position: absolute;
    bottom: 0;
    width: 1px;
    min-height: 1px;
    transition: height 0.2s ease;
  }

  .frequency-display {
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Courier New', monospace;
    font-size: 6px;
    color: var(--underground-graphite);
    white-space: nowrap;
  }

  /* Hero Narrative Arc Indicator */
  .hero-arc-indicator {
    position: absolute;
    top: -6px;
    left: -6px;
    width: 16px;
    height: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .arc-symbol {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--underground-ivory);
    font-size: 8px;
  }

  .hero-arc-indicator[data-arc="prophecy"] .arc-symbol {
    background: var(--underground-amber);
    box-shadow: 0 0 4px rgba(255, 191, 0, 0.5);
  }

  .hero-arc-indicator[data-arc="validation"] .arc-symbol {
    background: var(--underground-sepia);
    box-shadow: 0 0 4px rgba(139, 69, 19, 0.5);
    animation: validationPulse 1s ease-in-out infinite;
  }

  .hero-arc-indicator[data-arc="recognition"] .arc-symbol {
    background: var(--underground-graphite);
    box-shadow: 0 0 6px rgba(47, 79, 79, 0.7);
  }

  .arc-symbol svg {
    width: 8px;
    height: 8px;
  }

  .arc-tension-meter {
    width: 12px;
    height: 2px;
    background: rgba(139, 69, 19, 0.2);
    border-radius: 1px;
    margin-top: 1px;
    overflow: hidden;
  }

  .tension-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--underground-amber), var(--underground-sepia));
    border-radius: 1px;
    transition: width 0.3s ease;
  }

  @keyframes validationPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Core Marker Styling */
  .marker-core {
    position: relative;
    width: var(--significance-size);
    height: var(--significance-size);
    background: var(--impact-color);
    border-radius: 50%;
    border: 2px solid var(--underground-ivory);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 2px 8px rgba(139, 69, 19, 0.2),
      inset 0 1px 2px rgba(254, 252, 246, 0.3);
  }

  .marker-icon {
    width: 60%;
    height: 60%;
    color: var(--underground-ivory);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .marker-icon svg {
    width: 100%;
    height: 100%;
  }

  .default-marker {
    width: 8px;
    height: 8px;
    background: var(--underground-ivory);
    border-radius: 50%;
  }

  .significance-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--underground-amber);
    border: 1px solid var(--underground-ivory);
  }

  .significance-indicator[data-significance="primary"] {
    background: var(--underground-sepia);
    animation: significancePulse 1.5s ease-in-out infinite;
  }

  .significance-indicator[data-significance="major"] {
    background: var(--underground-graphite);
  }

  .significance-indicator[data-significance="notable"] {
    background: var(--underground-amber);
  }

  .significance-indicator[data-significance="background"] {
    display: none;
  }

  @keyframes significancePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }

  /* Cultural Intensity Glow */
  .cultural-intensity-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--significance-size) * 2);
    height: calc(var(--significance-size) * 2);
    background: radial-gradient(circle, var(--impact-color) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: culturalGlow 3s ease-in-out infinite;
  }

  @keyframes culturalGlow {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }

  /* Enhanced Preview Modal */
  .enhanced-event-preview {
    position: absolute;
    top: calc(var(--significance-size) + 60px);
    left: 50%;
    transform: translateX(-50%);
    width: 360px;
    max-width: 90vw;
    background: var(--underground-ivory);
    border: 2px solid var(--underground-sepia);
    border-radius: 8px;
    box-shadow:
      0 8px 24px rgba(139, 69, 19, 0.2),
      inset 0 1px 2px rgba(254, 252, 246, 0.5);
    z-index: 100;
    pointer-events: none;
    font-family: 'Source Sans 3', system-ui, sans-serif;
  }

  /* Underground Academia Header */
  .underground-header {
    background: linear-gradient(135deg, var(--underground-sepia), var(--underground-graphite));
    color: var(--underground-ivory);
    padding: 0.75rem;
    border-radius: 6px 6px 0 0;
  }

  .document-classification {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    opacity: 0.9;
  }

  .classification-stamp {
    background: rgba(254, 252, 246, 0.2);
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: bold;
  }

  .document-id {
    background: rgba(254, 252, 246, 0.1);
    padding: 2px 4px;
    border-radius: 2px;
  }

  .preview-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  .preview-meta {
    display: flex;
    gap: 0.75rem;
    font-size: 0.8rem;
    opacity: 0.9;
    flex-wrap: wrap;
  }

  .cultural-magnitude {
    color: var(--underground-amber);
    font-weight: 600;
  }

  /* Framework Analysis Panel */
  .framework-analysis {
    padding: 1rem;
    background: rgba(139, 69, 19, 0.03);
    border-bottom: 1px solid rgba(139, 69, 19, 0.1);
  }

  .analysis-section {
    margin-bottom: 0.75rem;
  }

  .analysis-section:last-child {
    margin-bottom: 0;
  }

  .analysis-section h5 {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--underground-sepia);
    margin: 0 0 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Meme Lifecycle Section */
  .phase-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .phase-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--underground-graphite);
    min-width: 80px;
  }

  .velocity-meter {
    flex: 1;
    height: 4px;
    background: rgba(139, 69, 19, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }

  .velocity-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--underground-amber), var(--underground-sepia));
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .propagation-pattern {
    font-size: 0.7rem;
    color: var(--underground-graphite);
    margin-top: 0.25rem;
    opacity: 0.8;
  }

  /* Musical Seismography Section */
  .seismic-readings {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .reading-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.7rem;
  }

  .reading-label {
    color: var(--underground-graphite);
    opacity: 0.8;
  }

  .reading-value {
    font-weight: 600;
    color: var(--underground-sepia);
    font-family: 'Courier New', monospace;
  }

  .seismic-pattern {
    font-size: 0.7rem;
    color: var(--underground-graphite);
    opacity: 0.8;
  }

  /* Hero Narrative Section */
  .narrative-arc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .arc-phase {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--underground-graphite);
  }

  .tension-indicator {
    font-size: 0.7rem;
    color: var(--underground-sepia);
  }

  .archetypes {
    font-size: 0.7rem;
    color: var(--underground-graphite);
    opacity: 0.8;
    line-height: 1.3;
  }

  /* Content Sections */
  .preview-content {
    padding: 1rem;
  }

  .preview-description {
    font-size: 0.85rem;
    color: var(--underground-graphite);
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
  }

  .cultural-context h6 {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--underground-sepia);
    margin: 0 0 0.25rem 0;
  }

  .cultural-context p {
    font-size: 0.8rem;
    color: var(--underground-graphite);
    margin: 0;
    line-height: 1.4;
  }

  /* Evidence Section */
  .evidence-section {
    padding: 1rem;
    background: rgba(47, 79, 79, 0.03);
    border-top: 1px solid rgba(47, 79, 79, 0.1);
    pointer-events: auto;
  }

  .evidence-section h6 {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--underground-graphite);
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .evidence-grid {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .evidence-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    background: var(--underground-ivory);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 4px;
  }

  .evidence-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--underground-sepia);
  }

  .evidence-source {
    font-size: 0.7rem;
    color: var(--underground-graphite);
    opacity: 0.8;
  }

  .verification-badge {
    font-size: 0.65rem;
    color: #2E7D32;
    font-weight: 600;
    padding: 1px 4px;
    background: rgba(46, 125, 50, 0.1);
    border-radius: 2px;
    align-self: flex-start;
  }

  .underground-button {
    background: linear-gradient(135deg, var(--underground-sepia), var(--underground-graphite));
    color: var(--underground-ivory);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    pointer-events: auto;
  }

  .underground-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
  }

  /* Scholarly Footnote */
  .preview-footer {
    padding: 0.75rem;
    background: rgba(139, 69, 19, 0.05);
    border-top: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 0 0 6px 6px;
  }

  .scholarly-footnote {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: var(--underground-graphite);
    opacity: 0.8;
    text-align: center;
  }

  /* Active State Enhancement */
  .active-enhancement {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .active-ring {
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .primary-ring {
    width: calc(var(--significance-size) * 3);
    height: calc(var(--significance-size) * 3);
    border: 2px solid var(--underground-sepia);
    animation: activePrimaryRing 2s ease-in-out infinite;
  }

  .secondary-ring {
    width: calc(var(--significance-size) * 4);
    height: calc(var(--significance-size) * 4);
    border: 1px solid var(--underground-amber);
    animation: activeSecondaryRing 2s ease-in-out infinite;
  }

  @keyframes activePrimaryRing {
    0%, 100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  @keyframes activeSecondaryRing {
    0%, 100% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1.15);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .enhanced-event-preview {
      width: 300px;
      font-size: 0.9rem;
    }

    .seismograph-apparatus {
      width: 30px;
      height: 12px;
    }

    .framework-analysis {
      padding: 0.75rem;
    }

    .seismic-readings {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .enhanced-event-preview {
      width: 260px;
      padding: 0;
    }

    .underground-header {
      padding: 0.5rem;
    }

    .framework-analysis,
    .preview-content,
    .evidence-section {
      padding: 0.5rem;
    }

    .seismograph-apparatus {
      width: 24px;
      height: 10px;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .propagation-ring,
    .significance-indicator,
    .cultural-intensity-glow,
    .active-ring {
      animation: none;
    }

    .enhanced-event-marker {
      transition: transform 0.1s ease;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .underground-document {
      border-width: 2px;
    }

    .enhanced-event-preview {
      border-width: 3px;
    }

    .propagation-ring,
    .active-ring {
      border-width: 2px;
    }
  }

  /* Touch targets for mobile */
  @media (pointer: coarse) {
    .marker-core {
      min-width: 44px;
      min-height: 44px;
    }

    .enhanced-event-marker {
      padding: 10px;
    }
  }
</style>