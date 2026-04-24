<div
  class="event-marker"
  class:active
  data-impact={event.culturalImpact}
  data-significance={event.significance}
  role="button"
  tabindex="0"
  aria-label="Event: {event.title} on {formatDate(event.date)}"
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
  "
>
  <!-- Cultural impact visualization rings -->
  <div class="impact-rings">
    <div class="impact-ring primary" data-impact={event.culturalImpact}></div>
    <div class="impact-ring secondary" data-impact={event.culturalImpact}></div>
    <div class="impact-ring tertiary" data-impact={event.culturalImpact}></div>
  </div>

  <!-- Core event marker -->
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

    <!-- Event significance indicator -->
    <div class="significance-indicator" data-significance={event.significance}>
      <div class="significance-dot"></div>
    </div>
  </div>

  <!-- Cultural seismograph visualization -->
  <div class="seismograph-trace" class:active={showSeismograph}>
    {#each seismographData as point, index}
      <div
        class="seismic-point"
        style="
          left: {(index / (seismographData.length - 1)) * 100}%;
          height: {Math.abs(point) * 100}%;
          background: {point > 0 ? 'var(--color-primary)' : 'var(--color-accent)'};
        "
      ></div>
    {/each}
  </div>

  <!-- Hover preview -->
  {#if showPreview}
    <div class="event-preview" transition:fade={{ duration: 200 }}>
      <div class="preview-header">
        <h4 class="preview-title">{event.title}</h4>
        <div class="preview-meta">
          <span class="preview-date">{formatDate(event.date)}</span>
          <span class="preview-day">Day {event.dayNumber}</span>
        </div>
      </div>

      <div class="preview-content">
        <p class="preview-description">{event.description}</p>

        <div class="preview-impact">
          <div class="impact-meter">
            <div class="impact-label">Cultural Impact</div>
            <div class="impact-bar" data-level={event.culturalImpact}>
              <div class="impact-fill" style="width: {getImpactPercentage(event.culturalImpact)}%"></div>
            </div>
          </div>

          <div class="evidence-preview">
            {#if event.evidence && event.evidence.length > 0}
              <div class="evidence-count">
                {event.evidence.length} evidence items
              </div>
              <button
                class="evidence-link"
                on:click|stopPropagation={handleEvidenceClick}
              >
                View Evidence →
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Musical tempo sync indicator -->
      <div class="tempo-sync" class:visible={event.tempoSync}>
        <div class="sync-pulse"></div>
        <span class="sync-label">Tempo: {event.tempoSync?.bpm || 85} BPM</span>
      </div>
    </div>
  {/if}

  <!-- Active state ring -->
  {#if active}
    <div class="active-ring" transition:scale={{ duration: 300 }}></div>
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

  // Cultural intensity calculation based on Виленский analysis
  $: culturalIntensity = calculateCulturalIntensity(event);

  // Generate seismograph data for cultural impact visualization
  $: seismographData = generateSeismographData(event);

  function calculateCulturalIntensity(event) {
    const impactWeights = {
      'low': 0.2,
      'medium': 0.5,
      'high': 0.8,
      'seismic': 1.0
    };

    const significanceWeights = {
      'background': 0.1,
      'notable': 0.4,
      'major': 0.7,
      'primary': 1.0
    };

    const impactValue = impactWeights[event.culturalImpact] || 0.3;
    const significanceValue = significanceWeights[event.significance] || 0.3;

    return Math.min(1.0, impactValue * significanceValue * 1.2);
  }

  function generateSeismographData(event) {
    // Generate cultural seismograph pattern based on event characteristics
    const points = 20;
    const baseAmplitude = calculateCulturalIntensity(event);
    const data = [];

    for (let i = 0; i < points; i++) {
      const t = i / points;
      // Musical tempo influence (85 BPM)
      const tempoPhase = Math.sin(t * Math.PI * 4) * 0.3;
      // Cultural resonance
      const culturalPhase = Math.sin(t * Math.PI * 2) * baseAmplitude;
      // Viral spread pattern
      const viralPhase = Math.exp(-((t - 0.6) ** 2) / 0.1) * baseAmplitude;

      data.push((tempoPhase + culturalPhase + viralPhase) * 0.5);
    }

    return data;
  }

  function getImpactColor(impact) {
    const colors = {
      'low': 'var(--color-border)',
      'medium': 'var(--color-accent)',
      'high': 'var(--color-primary)',
      'seismic': 'var(--color-critical)'
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

  function getImpactPercentage(impact) {
    const percentages = {
      'low': 25,
      'medium': 50,
      'high': 75,
      'seismic': 100
    };
    return percentages[impact] || 50;
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
  .event-marker {
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 15;
    transition: all 0.3s ease;
    cursor: pointer;
    touch-action: manipulation;
  }

  .event-marker:hover,
  .event-marker:focus {
    transform: translateX(-50%) translateY(-50%) scale(1.1);
    z-index: 25;
  }

  .event-marker.active {
    transform: translateX(-50%) translateY(-50%) scale(1.2);
    z-index: 30;
  }

  .impact-rings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .impact-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid var(--impact-color);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    animation: impactPulse 3s ease-in-out infinite;
  }

  .impact-ring.primary {
    width: calc(var(--significance-size) * 1.5);
    height: calc(var(--significance-size) * 1.5);
    animation-delay: 0s;
  }

  .impact-ring.secondary {
    width: calc(var(--significance-size) * 2);
    height: calc(var(--significance-size) * 2);
    animation-delay: 1s;
  }

  .impact-ring.tertiary {
    width: calc(var(--significance-size) * 2.5);
    height: calc(var(--significance-size) * 2.5);
    animation-delay: 2s;
  }

  .event-marker[data-impact="seismic"] .impact-ring {
    border-width: 2px;
    animation-duration: 2s;
  }

  .event-marker[data-impact="low"] .impact-ring {
    animation: none;
    opacity: 0.3;
  }

  @keyframes impactPulse {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
      opacity: calc(var(--cultural-intensity) * 0.8);
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.5);
    }
  }

  .marker-core {
    position: relative;
    width: var(--significance-size);
    height: var(--significance-size);
    background: var(--impact-color);
    border-radius: 50%;
    border: 2px solid var(--color-light);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(125, 68, 80, 0.2);
  }

  .marker-icon {
    width: 60%;
    height: 60%;
    color: var(--color-light);
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
    background: var(--color-light);
    border-radius: 50%;
  }

  .significance-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-warning);
    border: 1px solid var(--color-light);
  }

  .significance-indicator[data-significance="primary"] {
    background: var(--color-critical);
    animation: significancePulse 1.5s ease-in-out infinite;
  }

  .significance-indicator[data-significance="major"] {
    background: var(--color-primary);
  }

  .significance-indicator[data-significance="notable"] {
    background: var(--color-accent);
  }

  .significance-indicator[data-significance="background"] {
    display: none;
  }

  @keyframes significancePulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
  }

  .seismograph-trace {
    position: absolute;
    top: calc(var(--significance-size) + 10px);
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 20px;
    display: flex;
    align-items: flex-end;
    gap: 1px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .seismograph-trace.active {
    opacity: 1;
  }

  .seismic-point {
    flex: 1;
    min-height: 2px;
    border-radius: 1px;
    transition: height 0.2s ease;
  }

  .event-preview {
    position: absolute;
    top: calc(var(--significance-size) + 40px);
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    max-width: 80vw;
    background: var(--color-light);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(125, 68, 80, 0.15);
    padding: 1rem;
    z-index: 100;
    pointer-events: none;
  }

  .preview-header {
    margin-bottom: 0.75rem;
  }

  .preview-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  .preview-meta {
    display: flex;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-primary);
    opacity: 0.7;
  }

  .preview-content {
    margin-bottom: 0.75rem;
  }

  .preview-description {
    font-size: 0.8rem;
    color: var(--color-primary);
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
  }

  .preview-impact {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .impact-meter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .impact-label {
    font-size: 0.7rem;
    color: var(--color-primary);
    opacity: 0.8;
    min-width: 80px;
  }

  .impact-bar {
    flex: 1;
    height: 6px;
    background: var(--color-border);
    border-radius: 3px;
    overflow: hidden;
  }

  .impact-fill {
    height: 100%;
    background: var(--impact-color);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .evidence-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .evidence-count {
    font-size: 0.7rem;
    color: var(--color-primary);
    opacity: 0.7;
  }

  .evidence-link {
    font-size: 0.7rem;
    color: var(--color-accent);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    pointer-events: auto;
  }

  .evidence-link:hover {
    color: var(--color-primary);
  }

  .tempo-sync {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tempo-sync.visible {
    opacity: 1;
  }

  .sync-pulse {
    width: 8px;
    height: 8px;
    background: var(--color-accent);
    border-radius: 50%;
    animation: syncPulse 0.706s ease-in-out infinite; /* 85 BPM */
  }

  .sync-label {
    font-size: 0.7rem;
    color: var(--color-primary);
    opacity: 0.8;
  }

  @keyframes syncPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.7;
    }
  }

  .active-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--significance-size) * 3);
    height: calc(var(--significance-size) * 3);
    border: 2px solid var(--color-accent);
    border-radius: 50%;
    pointer-events: none;
    animation: activeRingPulse 2s ease-in-out infinite;
  }

  @keyframes activeRingPulse {
    0%, 100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .event-preview {
      width: 250px;
      font-size: 0.85rem;
      padding: 0.75rem;
    }

    .preview-title {
      font-size: 0.85rem;
    }

    .seismograph-trace {
      width: 40px;
      height: 15px;
    }
  }

  @media (max-width: 480px) {
    .event-preview {
      width: 200px;
      padding: 0.5rem;
    }

    .seismograph-trace {
      width: 30px;
      height: 12px;
    }

    .marker-core {
      box-shadow: 0 1px 4px rgba(125, 68, 80, 0.2);
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .impact-ring,
    .significance-indicator,
    .sync-pulse,
    .active-ring {
      animation: none;
    }

    .event-marker {
      transition: transform 0.1s ease;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .marker-core {
      border-width: 3px;
    }

    .event-preview {
      border-width: 2px;
    }

    .impact-ring {
      border-width: 2px;
    }
  }

  /* Touch targets for mobile */
  @media (pointer: coarse) {
    .marker-core {
      min-width: 44px;
      min-height: 44px;
    }

    .event-marker {
      padding: 10px;
    }
  }
</style>