<!--
  Evidence Item Component - ORGA-066 Implementation
  Individual evidence card with Underground Academia styling

  @component EvidenceItem
  @accessibility WCAG 2.1 AA compliant with keyboard support
  @styling Underground Academia archival document aesthetic
  @performance Lazy loading and intersection observer ready
-->

<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { generateCitation } from '../../data/evidenceGalleryData.js';

  // Component props
  export let evidenceData;
  export let archivalNumber;
  export let focused = false;
  export let accessibilityMode = false;

  // Component state
  const dispatch = createEventDispatcher();
  let evidenceElement;
  let isHovered = false;
  let imageLoaded = false;

  // Evidence type styling mapping
  const evidenceTypeStyles = {
    primary_artifact: {
      borderColor: '#8B4513',
      labelColor: '#8B4513',
      labelText: 'ПЕРВИЧНЫЙ АРТЕФАКТ',
      icon: '📜'
    },
    reception_record: {
      borderColor: '#2F4F4F',
      labelColor: '#2F4F4F',
      labelText: 'ЗАПИСЬ РЕЦЕПЦИИ',
      icon: '📊'
    },
    contextual_document: {
      borderColor: '#6B4423',
      labelColor: '#6B4423',
      labelText: 'КОНТЕКСТНЫЙ ДОКУМЕНТ',
      icon: '📋'
    },
    analytical_synthesis: {
      borderColor: '#FFBF00',
      labelColor: '#B8860B',
      labelText: 'АНАЛИТИЧЕСКИЙ СИНТЕЗ',
      icon: '🔬'
    },
    temporal_anchor: {
      borderColor: '#D32F2F',
      labelColor: '#D32F2F',
      labelText: 'ВРЕМЕННАЯ ПРИВЯЗКА',
      icon: '⚓'
    }
  };

  // Act phase styling
  const actPhaseStyles = {
    prophecy: {
      backgroundColor: 'rgba(139, 69, 19, 0.05)',
      accentColor: '#8B4513',
      phaseLabel: 'ПРОРОЧЕСТВО'
    },
    validation: {
      backgroundColor: 'rgba(47, 79, 79, 0.05)',
      accentColor: '#2F4F4F',
      phaseLabel: 'ВАЛИДАЦИЯ'
    },
    recognition: {
      backgroundColor: 'rgba(255, 191, 0, 0.05)',
      accentColor: '#FFBF00',
      phaseLabel: 'ПРИЗНАНИЕ'
    }
  };

  // Confidence level indicators
  const confidenceLevels = {
    critical: { label: 'КРИТИЧЕСКАЯ', color: '#D32F2F', icon: '🔴' },
    high: { label: 'ВЫСОКАЯ', color: '#FF9800', icon: '🟠' },
    medium: { label: 'СРЕДНЯЯ', color: '#FFC107', icon: '🟡' },
    low: { label: 'НИЗКАЯ', color: '#4CAF50', icon: '🟢' }
  };

  // Get styling for current evidence
  $: evidenceStyle = evidenceTypeStyles[evidenceData.type] || evidenceTypeStyles.contextual_document;
  $: actStyle = actPhaseStyles[evidenceData.act] || actPhaseStyles.prophecy;
  $: confidenceStyle = confidenceLevels[evidenceData.provenance.confidence_level] || confidenceLevels.medium;

  // Generate academic citation
  $: citation = generateCitation(evidenceData);

  // Handle evidence selection
  function handleEvidenceSelect() {
    dispatch('evidence-select', { evidence: evidenceData });
  }

  // Handle focus events
  function handleFocus() {
    dispatch('evidence-focus', { evidence: evidenceData });
  }

  // Keyboard interaction
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEvidenceSelect();
    }
  }

  // Image lazy loading
  function handleImageLoad() {
    imageLoaded = true;
  }

  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format timestamp
  function formatTimestamp(timestamp) {
    if (timestamp === 'Academic Analysis' || timestamp === 'Historical Context' || timestamp === 'Official Documentation') {
      return timestamp;
    }
    return timestamp || 'Время не указано';
  }

  // Truncate description for card view
  function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
</script>

<!-- Evidence item card -->
<article
  class="evidence-item"
  class:focused
  class:accessibility-mode={accessibilityMode}
  class:hovered={isHovered}
  style="--evidence-border-color: {evidenceStyle.borderColor}; --act-background: {actStyle.backgroundColor}; --act-accent: {actStyle.accentColor};"
  bind:this={evidenceElement}
  tabindex="0"
  role="button"
  aria-label="Evidence item: {evidenceData.title}"
  aria-describedby="evidence-{evidenceData.id}-description"
  on:click={handleEvidenceSelect}
  on:keydown={handleKeydown}
  on:focus={handleFocus}
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
>
  <!-- Archival header with document classification -->
  <header class="evidence-header">
    <div class="archival-classification">
      <span class="classification-stamp">{evidenceStyle.labelText}</span>
      <span class="archival-number">{archivalNumber}</span>
    </div>

    <div class="evidence-metadata">
      <span class="act-phase" style="color: {actStyle.accentColor};">
        {actStyle.phaseLabel}
      </span>
      <span class="confidence-indicator" style="color: {confidenceStyle.color};">
        <span class="confidence-icon" aria-hidden="true">{confidenceStyle.icon}</span>
        <span class="confidence-label">{confidenceStyle.label}</span>
      </span>
    </div>
  </header>

  <!-- Evidence content -->
  <div class="evidence-content">
    <!-- Evidence title -->
    <h3 class="evidence-title">
      <span class="type-icon" aria-hidden="true">{evidenceStyle.icon}</span>
      {evidenceData.title}
    </h3>

    <!-- Evidence description -->
    <div class="evidence-description" id="evidence-{evidenceData.id}-description">
      <p class="description-text">
        {truncateText(evidenceData.description)}
      </p>
    </div>

    <!-- Media preview (if applicable) -->
    {#if evidenceData.media}
      <div class="media-preview">
        <div class="media-type-indicator">
          <span class="media-icon" aria-hidden="true">
            {#if evidenceData.media.type === 'video_metadata'}
              🎥
            {:else if evidenceData.media.type === 'forum_collection'}
              💬
            {:else if evidenceData.media.type === 'analytical_synthesis'}
              📊
            {:else if evidenceData.media.type === 'event_documentation'}
              📰
            {:else if evidenceData.media.type === 'analytics_data'}
              📈
            {:else if evidenceData.media.type === 'official_documentation'}
              🏛️
            {:else}
              📄
            {/if}
          </span>
          <span class="media-label">{evidenceData.media.type.replace('_', ' ').toUpperCase()}</span>
        </div>

        <!-- Media-specific details -->
        {#if evidenceData.media.type === 'video_metadata'}
          <div class="media-details">
            <span class="detail-item">Продолжительность: {evidenceData.media.duration}</span>
            <span class="detail-item">Первичные просмотры: {evidenceData.media.views_initial?.toLocaleString() || 'Н/Д'}</span>
          </div>
        {:else if evidenceData.media.type === 'forum_collection'}
          <div class="media-details">
            <span class="detail-item">Платформы: {evidenceData.media.platforms?.length || 0}</span>
            <span class="detail-item">Отклики: {evidenceData.media.total_responses || 0}</span>
          </div>
        {:else if evidenceData.media.type === 'analytics_data'}
          <div class="media-details">
            <span class="detail-item">Метрики: {evidenceData.media.metrics?.length || 0}</span>
            <span class="detail-item">Рост: {evidenceData.media.inflection_magnitude || 'Н/Д'}</span>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Temporal information -->
    <div class="temporal-info">
      <div class="date-timestamp">
        <span class="date-label">Дата:</span>
        <span class="date-value">{formatDate(evidenceData.date)}</span>
      </div>
      {#if evidenceData.timestamp}
        <div class="timestamp-detail">
          <span class="timestamp-label">Время:</span>
          <span class="timestamp-value">{formatTimestamp(evidenceData.timestamp)}</span>
        </div>
      {/if}
    </div>

    <!-- Cultural significance indicators -->
    {#if evidenceData.cultural_significance}
      <div class="cultural-indicators">
        <h4 class="indicators-title">Культурная значимость:</h4>
        <div class="indicators-grid">
          {#each Object.entries(evidenceData.cultural_significance) as [key, value]}
            {#if typeof value === 'boolean' && value}
              <span class="indicator-tag positive">
                {key.replace('_', ' ').toUpperCase()}
              </span>
            {:else if typeof value === 'string'}
              <span class="indicator-tag neutral" title="{key}: {value}">
                {key.replace('_', ' ').toUpperCase()}
              </span>
            {:else if typeof value === 'number' && value > 0}
              <span class="indicator-tag quantitative">
                {key.replace('_', ' ')}: {value}
              </span>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    <!-- Source verification status -->
    <div class="verification-status">
      <div class="verification-indicator" class:verified={evidenceData.provenance.source_verified}>
        <span class="verification-icon" aria-hidden="true">
          {evidenceData.provenance.source_verified ? '✓' : '⚠'}
        </span>
        <span class="verification-text">
          {evidenceData.provenance.source_verified ? 'Источник верифицирован' : 'Требуется верификация'}
        </span>
      </div>

      <div class="verification-method">
        <span class="method-label">Метод:</span>
        <span class="method-value">{evidenceData.provenance.verification_method}</span>
      </div>
    </div>
  </div>

  <!-- Evidence footer with citation preview -->
  <footer class="evidence-footer">
    <div class="citation-preview">
      <span class="citation-label">Цитирование:</span>
      <span class="citation-text">{citation.substring(0, 100)}...</span>
    </div>

    <div class="action-indicators">
      <span class="view-indicator">Нажмите для просмотра</span>
      <span class="keyboard-hint" aria-hidden="true">↵ или Пробел</span>
    </div>
  </footer>

  <!-- Focus indicator for accessibility -->
  {#if focused}
    <div class="focus-indicator" aria-hidden="true"></div>
  {/if}

  <!-- Archival corner decoration -->
  <div class="archival-corner" aria-hidden="true">
    <div class="corner-decoration"></div>
  </div>
</article>

<style>
  /* Evidence item container */
  .evidence-item {
    position: relative;
    background: #FEFCF6;
    border: 2px solid var(--evidence-border-color, #8B4513);
    border-radius: 6px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow:
      0 2px 4px rgba(107, 68, 35, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    overflow: hidden;
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .evidence-item:hover,
  .evidence-item.focused,
  .evidence-item.hovered {
    transform: translateY(-2px);
    box-shadow:
      0 4px 12px rgba(107, 68, 35, 0.2),
      0 0 0 2px var(--evidence-border-color, #8B4513),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .evidence-item.focused {
    outline: 3px solid #FFBF00;
    outline-offset: 2px;
  }

  /* Evidence header */
  .evidence-header {
    background: var(--act-background, rgba(139, 69, 19, 0.05));
    padding: 1rem;
    border-bottom: 1px solid var(--evidence-border-color, #8B4513);
    position: relative;
  }

  .archival-classification {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .classification-stamp {
    background: var(--evidence-border-color, #8B4513);
    color: #FEFCF6;
    padding: 0.25rem 0.5rem;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    font-weight: bold;
    border-radius: 3px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .archival-number {
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: var(--evidence-border-color, #8B4513);
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 3px;
    border: 1px solid var(--evidence-border-color, #8B4513);
  }

  .evidence-metadata {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .act-phase {
    font-family: 'Playfair Display', serif;
    font-size: 0.875rem;
    font-weight: 600;
    font-style: italic;
  }

  .confidence-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .confidence-icon {
    font-size: 0.875rem;
  }

  /* Evidence content */
  .evidence-content {
    padding: 1.25rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .evidence-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.125rem;
    font-weight: 600;
    color: #2F4F4F;
    line-height: 1.3;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .type-icon {
    font-size: 1.25rem;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  .evidence-description {
    flex-grow: 1;
  }

  .description-text {
    margin: 0;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #6B4423;
  }

  /* Media preview */
  .media-preview {
    background: rgba(139, 69, 19, 0.03);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 4px;
    padding: 0.75rem;
  }

  .media-type-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .media-icon {
    font-size: 1.125rem;
  }

  .media-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    font-weight: bold;
    color: #2F4F4F;
    letter-spacing: 0.5px;
  }

  .media-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .detail-item {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    color: #6B4423;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 3px;
    border: 1px solid rgba(139, 69, 19, 0.3);
  }

  /* Temporal information */
  .temporal-info {
    background: rgba(255, 191, 0, 0.05);
    border-left: 3px solid #FFBF00;
    padding: 0.75rem;
    border-radius: 0 4px 4px 0;
  }

  .date-timestamp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.375rem;
  }

  .timestamp-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .date-label,
  .timestamp-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #B8860B;
    font-weight: bold;
  }

  .date-value,
  .timestamp-value {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    color: #6B4423;
  }

  /* Cultural significance indicators */
  .cultural-indicators {
    margin-top: 0.5rem;
  }

  .indicators-title {
    margin: 0 0 0.5rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2F4F4F;
    font-style: italic;
  }

  .indicators-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .indicator-tag {
    font-family: 'Courier New', monospace;
    font-size: 0.625rem;
    padding: 0.25rem 0.375rem;
    border-radius: 3px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.25px;
  }

  .indicator-tag.positive {
    background: #4CAF50;
    color: white;
  }

  .indicator-tag.neutral {
    background: rgba(139, 69, 19, 0.1);
    color: #8B4513;
    border: 1px solid rgba(139, 69, 19, 0.3);
  }

  .indicator-tag.quantitative {
    background: #FFBF00;
    color: #6B4423;
    border: 1px solid #B8860B;
  }

  /* Verification status */
  .verification-status {
    background: rgba(47, 79, 79, 0.05);
    border: 1px solid rgba(47, 79, 79, 0.2);
    border-radius: 4px;
    padding: 0.75rem;
  }

  .verification-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .verification-indicator.verified .verification-icon {
    color: #4CAF50;
  }

  .verification-indicator:not(.verified) .verification-icon {
    color: #FF9800;
  }

  .verification-text {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2F4F4F;
  }

  .verification-method {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .method-label {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: #6B4423;
    font-weight: bold;
  }

  .method-value {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.75rem;
    color: #6B4423;
  }

  /* Evidence footer */
  .evidence-footer {
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.02) 0%, rgba(139, 69, 19, 0.05) 100%);
    border-top: 1px solid rgba(139, 69, 19, 0.2);
    padding: 0.75rem 1.25rem;
    margin-top: auto;
  }

  .citation-preview {
    margin-bottom: 0.5rem;
  }

  .citation-label {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: #8B4513;
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
  }

  .citation-text {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.75rem;
    color: #6B4423;
    font-style: italic;
    line-height: 1.4;
    display: block;
  }

  .action-indicators {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .view-indicator {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.75rem;
    color: #8B4513;
    font-weight: 600;
  }

  .keyboard-hint {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: #B8860B;
    opacity: 0.8;
  }

  /* Focus indicator */
  .focus-indicator {
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #FFBF00, #FFD700);
    border-radius: 8px;
    z-index: -1;
    opacity: 0.3;
    animation: focus-pulse 2s infinite;
  }

  @keyframes focus-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }

  /* Archival corner decoration */
  .archival-corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .corner-decoration {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, transparent 30%, var(--evidence-border-color, #8B4513) 30%, var(--evidence-border-color, #8B4513) 70%, transparent 70%);
    transform: rotate(45deg);
    opacity: 0.1;
  }

  /* Accessibility mode enhancements */
  .accessibility-mode {
    border-width: 3px;
    min-height: auto;
  }

  .accessibility-mode .evidence-title {
    font-size: 1.25rem;
  }

  .accessibility-mode .description-text {
    font-size: 1rem;
    line-height: 1.6;
  }

  .accessibility-mode .action-indicators {
    font-size: 0.9rem;
  }

  .accessibility-mode:focus {
    outline-width: 4px;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .evidence-item {
      min-height: auto;
    }

    .evidence-header {
      padding: 0.75rem;
    }

    .evidence-content {
      padding: 1rem;
      gap: 0.75rem;
    }

    .evidence-title {
      font-size: 1rem;
    }

    .description-text {
      font-size: 0.875rem;
    }

    .archival-classification {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .evidence-metadata {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .media-details {
      flex-direction: column;
      gap: 0.5rem;
    }

    .date-timestamp,
    .timestamp-detail {
      flex-direction: column;
      align-items: stretch;
      gap: 0.25rem;
    }

    .action-indicators {
      flex-direction: column;
      align-items: stretch;
      gap: 0.375rem;
      text-align: center;
    }
  }

  /* Print styles */
  @media print {
    .evidence-item {
      border: 2px solid black;
      box-shadow: none;
      background: white;
      page-break-inside: avoid;
      margin-bottom: 1rem;
    }

    .evidence-item:hover,
    .evidence-item.focused,
    .evidence-item.hovered {
      transform: none;
      box-shadow: none;
    }

    .keyboard-hint {
      display: none;
    }

    .focus-indicator {
      display: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .evidence-item {
      border-color: black;
      background: white;
      color: black;
    }

    .classification-stamp {
      background: black;
      color: white;
    }

    .archival-number {
      border-color: black;
      color: black;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .evidence-item {
      transition: none;
    }

    .evidence-item:hover,
    .evidence-item.focused,
    .evidence-item.hovered {
      transform: none;
    }

    .focus-indicator {
      animation: none;
      opacity: 0.5;
    }
  }
</style>