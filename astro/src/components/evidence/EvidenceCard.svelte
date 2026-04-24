<!--
  EvidenceCard.svelte
  Individual evidence preview card with thumbnail and metadata
  WCAG 2.1 AA compliant with keyboard navigation and screen reader support
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props
  export let evidence;
  export let index;
  export let viewMode = 'grid'; // 'grid' | 'list'

  // Card state
  let isImageLoaded = false;
  let imageError = false;
  let cardElement;

  // Derived properties
  $: cardId = `evidence-card-${index}`;
  $: thumbnailSrc = evidence.media.thumbnail || evidence.media.url;
  $: hasMedia = evidence.media && evidence.media.url;

  function openModal() {
    dispatch('openModal');
  }

  function navigateToTimeline() {
    if (evidence.timelineConnection && evidence.timelineConnection.length > 0) {
      dispatch('navigateTimeline', {
        eventId: evidence.timelineConnection[0],
        evidenceId: evidence.id
      });
    }
  }

  function navigateToHero() {
    if (evidence.heroConnection && evidence.heroConnection.length > 0) {
      dispatch('navigateHero', {
        sceneId: evidence.heroConnection[0],
        evidenceId: evidence.id
      });
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  }

  function handleImageLoad() {
    isImageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatMetadataValue(key, value) {
    if (key === 'views' || key === 'engagement') {
      return typeof value === 'number' ? value.toLocaleString() : value;
    }
    return value;
  }

  function getTypeIcon(type) {
    const icons = {
      media: '📁',
      legal: '⚖️',
      social: '💬',
      academic: '🎓',
      visual: '🎨',
      document: '📄'
    };
    return icons[type] || '📄';
  }

  function getSignificanceLabel(significance) {
    const labels = {
      critical: 'Critical Evidence',
      primary: 'Primary Evidence',
      supporting: 'Supporting Evidence',
      contextual: 'Contextual Evidence'
    };
    return labels[significance] || significance;
  }
</script>

<!-- Evidence Card -->
<article
  bind:this={cardElement}
  class="evidence-card"
  class:evidence-card--list={viewMode === 'list'}
  class:evidence-card--{evidence.type}
  class:significance--{evidence.significance}
  role="button"
  tabindex="0"
  aria-labelledby="{cardId}-title"
  aria-describedby="{cardId}-description"
  id={cardId}
  on:click={openModal}
  on:keydown={handleKeydown}
>
  <!-- Card Header -->
  <header class="card-header">
    <div class="card-meta">
      <div class="evidence-type" class:evidence-type--{evidence.type}>
        <span class="type-icon" aria-hidden="true">{getTypeIcon(evidence.type)}</span>
        <span class="type-label">{evidence.type}</span>
      </div>

      <div class="significance-indicator" class:significance--{evidence.significance}>
        <span class="sr-only">Significance: </span>
        {evidence.significance}
      </div>

      {#if evidence.date}
        <time class="evidence-date" datetime={evidence.date}>
          {formatDate(evidence.date)}
        </time>
      {/if}
    </div>

    {#if evidence.metadata?.verificationLevel}
      <div class="verification-badge" class:verification--{evidence.metadata.verificationLevel}>
        <span class="sr-only">Verification level: </span>
        {evidence.metadata.verificationLevel.replace('-', ' ')}
      </div>
    {/if}
  </header>

  <!-- Media Thumbnail -->
  {#if hasMedia}
    <div class="card-media">
      {#if evidence.media.type === 'image'}
        <div class="thumbnail-container">
          {#if !isImageLoaded && !imageError}
            <div class="thumbnail-loading" aria-label="Loading thumbnail">
              <div class="loading-placeholder" aria-hidden="true"></div>
            </div>
          {/if}

          {#if !imageError}
            <img
              src={thumbnailSrc}
              alt={evidence.media.alt || `Evidence thumbnail: ${evidence.title}`}
              class="evidence-thumbnail"
              class:thumbnail-loaded={isImageLoaded}
              on:load={handleImageLoad}
              on:error={handleImageError}
              loading="lazy"
            />
          {:else}
            <div class="thumbnail-fallback" role="img" aria-label="Image unavailable">
              <span class="fallback-icon" aria-hidden="true">🖼️</span>
              <span class="fallback-text">Image unavailable</span>
            </div>
          {/if}

          <div class="media-type-overlay">
            <span class="media-type-badge" aria-label="Media type: {evidence.media.type}">
              {#if evidence.media.type === 'video'}📹
              {:else if evidence.media.type === 'audio'}🎵
              {:else if evidence.media.type === 'document'}📄
              {:else}📁{/if}
            </span>
          </div>
        </div>

      {:else if evidence.media.type === 'video' || evidence.media.type === 'audio'}
        <div class="media-placeholder" class:media-placeholder--{evidence.media.type}>
          <div class="placeholder-icon" aria-hidden="true">
            {#if evidence.media.type === 'video'}📹
            {:else}🎵{/if}
          </div>
          <div class="placeholder-text">
            {evidence.media.type} file
          </div>
        </div>

      {:else if evidence.media.type === 'document'}
        <div class="media-placeholder media-placeholder--document">
          <div class="placeholder-icon" aria-hidden="true">📄</div>
          <div class="placeholder-text">
            {evidence.media.url.split('.').pop().toUpperCase()} document
          </div>
        </div>

      {:else}
        <div class="media-placeholder media-placeholder--generic">
          <div class="placeholder-icon" aria-hidden="true">📁</div>
          <div class="placeholder-text">
            {evidence.media.type} file
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Card Content -->
  <div class="card-content">
    <h3 class="card-title" id="{cardId}-title">
      {evidence.title}
    </h3>

    <div class="card-description" id="{cardId}-description">
      <p class="description-text">
        {evidence.description.length > 120
          ? evidence.description.substring(0, 120) + '...'
          : evidence.description}
      </p>
    </div>

    <!-- Source -->
    <div class="card-source">
      <span class="source-label">Source:</span>
      <cite class="source-text">{evidence.source}</cite>
    </div>

    <!-- Key Metadata -->
    {#if evidence.metadata}
      <div class="card-metadata">
        {#if evidence.metadata.views}
          <div class="metadata-item">
            <span class="metadata-label">Views:</span>
            <span class="metadata-value">{formatMetadataValue('views', evidence.metadata.views)}</span>
          </div>
        {/if}

        {#if evidence.metadata.engagement}
          <div class="metadata-item">
            <span class="metadata-label">Engagement:</span>
            <span class="metadata-value">{formatMetadataValue('engagement', evidence.metadata.engagement)}</span>
          </div>
        {/if}

        {#if evidence.metadata.culturalImpact}
          <div class="metadata-item">
            <span class="metadata-label">Cultural Impact:</span>
            <span class="metadata-value impact-{evidence.metadata.culturalImpact}">
              {evidence.metadata.culturalImpact}
            </span>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Tags -->
    {#if evidence.tags && evidence.tags.length > 0}
      <div class="card-tags">
        <span class="sr-only">Tags:</span>
        <ul class="tags-list">
          {#each evidence.tags.slice(0, 3) as tag}
            <li class="tag">{tag}</li>
          {/each}
          {#if evidence.tags.length > 3}
            <li class="tag tag--more">+{evidence.tags.length - 3}</li>
          {/if}
        </ul>
      </div>
    {/if}
  </div>

  <!-- Card Footer -->
  <footer class="card-footer">
    <!-- Quick Actions -->
    <div class="card-actions">
      <button
        class="action-btn action-btn--view"
        on:click|stopPropagation={openModal}
        aria-label="Open evidence modal: {evidence.title}"
      >
        <span class="action-icon" aria-hidden="true">👁️</span>
        <span class="action-text">View</span>
      </button>

      {#if evidence.timelineConnection && evidence.timelineConnection.length > 0}
        <button
          class="action-btn action-btn--timeline"
          on:click|stopPropagation={navigateToTimeline}
          aria-label="View related timeline event"
        >
          <span class="action-icon" aria-hidden="true">📅</span>
          <span class="action-text">Timeline</span>
        </button>
      {/if}

      {#if evidence.heroConnection && evidence.heroConnection.length > 0}
        <button
          class="action-btn action-btn--hero"
          on:click|stopPropagation={navigateToHero}
          aria-label="View related hero scene"
        >
          <span class="action-icon" aria-hidden="true">🎬</span>
          <span class="action-text">Hero</span>
        </button>
      {/if}
    </div>

    <!-- Interaction Hint -->
    <div class="interaction-hint">
      <span class="sr-only">Press Enter or Space to open evidence modal</span>
      <span class="hint-text" aria-hidden="true">Click to view details</span>
    </div>
  </footer>
</article>

<style>
  /* Evidence Card Base */
  .evidence-card {
    background-color: var(--color-concrete-light);
    border: 1px solid rgba(26, 54, 93, 0.2);
    border-radius: var(--space-sm);
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-family: var(--font-body);
    position: relative;
  }

  .evidence-card:hover {
    box-shadow: 0 8px 24px rgba(26, 54, 93, 0.15);
    transform: translateY(-2px);
  }

  .evidence-card:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
    box-shadow: 0 8px 24px rgba(26, 54, 93, 0.2);
  }

  /* Type and Significance Based Styling */
  .evidence-card--media {
    border-left: 4px solid var(--color-amber-warm);
  }

  .evidence-card--legal {
    border-left: 4px solid var(--color-maritime-deep);
  }

  .evidence-card--social {
    border-left: 4px solid var(--color-sage-muted);
  }

  .evidence-card--academic {
    border-left: 4px solid rgba(104, 211, 145, 0.7);
  }

  .evidence-card--visual {
    border-left: 4px solid rgba(214, 158, 46, 0.7);
  }

  .evidence-card--document {
    border-left: 4px solid rgba(26, 54, 93, 0.5);
  }

  /* Significance highlighting */
  .significance--critical {
    box-shadow: 0 0 0 1px rgba(104, 211, 145, 0.3);
  }

  .significance--primary {
    box-shadow: 0 0 0 1px rgba(214, 158, 46, 0.3);
  }

  /* List View Layout */
  .evidence-card--list {
    flex-direction: row;
    align-items: stretch;
  }

  .evidence-card--list .card-media {
    flex: 0 0 200px;
    max-height: none;
  }

  .evidence-card--list .card-content {
    flex: 1;
  }

  /* Card Header */
  .card-header {
    padding: var(--space-md) var(--space-md) var(--space-sm);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    align-items: center;
    flex: 1;
  }

  .evidence-type,
  .significance-indicator {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: var(--space-xs);
    border: 1px solid;
  }

  .evidence-type {
    background-color: var(--color-amber-warm);
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .significance-indicator {
    background-color: var(--color-sage-muted);
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .significance--critical .significance-indicator {
    background-color: var(--color-sage-muted);
    box-shadow: 0 0 0 1px rgba(104, 211, 145, 0.5);
  }

  .significance--primary .significance-indicator {
    background-color: var(--color-amber-warm);
    box-shadow: 0 0 0 1px rgba(214, 158, 46, 0.5);
  }

  .type-icon {
    font-size: 0.875rem;
  }

  .evidence-date {
    font-size: 0.625rem;
    color: rgba(45, 55, 72, 0.7);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .verification-badge {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: var(--space-xs);
    border: 1px solid;
  }

  .verification--primary-source {
    background-color: var(--color-sage-muted);
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .verification--secondary-source {
    background-color: var(--color-amber-warm);
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .verification--tertiary-source {
    background-color: rgba(214, 158, 46, 0.3);
    border-color: var(--color-amber-warm);
    color: var(--color-text-primary);
  }

  /* Card Media */
  .card-media {
    position: relative;
    aspect-ratio: 16 / 9;
    max-height: 200px;
    overflow: hidden;
    background-color: rgba(26, 54, 93, 0.05);
  }

  .thumbnail-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .evidence-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .evidence-thumbnail.thumbnail-loaded {
    opacity: 1;
  }

  .thumbnail-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(26, 54, 93, 0.05);
  }

  .loading-placeholder {
    width: 2rem;
    height: 2rem;
    border: 2px solid rgba(26, 54, 93, 0.2);
    border-top: 2px solid var(--color-maritime-deep);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .thumbnail-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(26, 54, 93, 0.1);
    color: rgba(45, 55, 72, 0.6);
  }

  .fallback-icon {
    font-size: 2rem;
    margin-bottom: var(--space-xs);
  }

  .fallback-text {
    font-size: 0.75rem;
    text-align: center;
  }

  .media-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(26, 54, 93, 0.05);
    color: rgba(45, 55, 72, 0.7);
  }

  .placeholder-icon {
    font-size: 3rem;
    margin-bottom: var(--space-sm);
  }

  .placeholder-text {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .media-type-overlay {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    background-color: rgba(26, 54, 93, 0.8);
    color: var(--color-text-inverse);
    padding: var(--space-xs);
    border-radius: var(--space-xs);
  }

  .media-type-badge {
    font-size: 0.875rem;
  }

  /* Card Content */
  .card-content {
    padding: var(--space-md);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .card-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 700;
    line-height: var(--line-height-heading);
    color: var(--color-maritime-deep);
    margin: 0;
  }

  .description-text {
    line-height: var(--line-height-body);
    color: var(--color-text-primary);
    margin: 0;
    font-size: 0.875rem;
  }

  .card-source {
    display: flex;
    gap: var(--space-xs);
    font-size: 0.75rem;
    color: rgba(45, 55, 72, 0.8);
  }

  .source-label {
    font-weight: 600;
  }

  .source-text {
    font-style: italic;
  }

  .card-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    font-size: 0.75rem;
  }

  .metadata-item {
    display: flex;
    gap: var(--space-xs);
    align-items: center;
  }

  .metadata-label {
    font-weight: 600;
    color: rgba(45, 55, 72, 0.8);
  }

  .metadata-value {
    color: var(--color-text-primary);
  }

  .impact-high {
    color: var(--color-sage-muted);
    font-weight: 600;
  }

  .impact-medium {
    color: var(--color-amber-warm);
    font-weight: 600;
  }

  .impact-low {
    color: rgba(45, 55, 72, 0.6);
  }

  .card-tags {
    margin-top: auto;
  }

  .tags-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .tag {
    background-color: rgba(26, 54, 93, 0.1);
    color: var(--color-maritime-deep);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--space-xs);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tag--more {
    background-color: rgba(26, 54, 93, 0.2);
    font-style: italic;
  }

  /* Card Footer */
  .card-footer {
    padding: var(--space-sm) var(--space-md) var(--space-md);
    border-top: 1px solid rgba(26, 54, 93, 0.1);
    background-color: rgba(26, 54, 93, 0.02);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
  }

  .card-actions {
    display: flex;
    gap: var(--space-xs);
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    font-family: var(--font-body);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid var(--color-maritime-deep);
    border-radius: var(--space-xs);
    background-color: transparent;
    color: var(--color-maritime-deep);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover,
  .action-btn:focus {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .action-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 1px;
  }

  .action-icon {
    font-size: 0.75rem;
  }

  .interaction-hint {
    font-size: 0.625rem;
    color: rgba(45, 55, 72, 0.6);
    font-style: italic;
  }

  /* Accessibility Utilities */
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

  /* Responsive Design */
  @media (max-width: 48rem) {
    .evidence-card--list {
      flex-direction: column;
    }

    .evidence-card--list .card-media {
      flex: none;
      aspect-ratio: 16 / 9;
      max-height: 200px;
    }

    .card-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
    }

    .card-footer {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-sm);
    }

    .card-actions {
      justify-content: center;
    }

    .interaction-hint {
      text-align: center;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .evidence-card {
      border-width: 2px;
    }

    .evidence-type,
    .significance-indicator,
    .verification-badge,
    .action-btn {
      border-width: 2px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .evidence-card,
    .evidence-thumbnail,
    .action-btn {
      transition: none;
    }

    .evidence-card:hover {
      transform: none;
    }

    .loading-placeholder {
      animation: none;
    }
  }

  /* Print Styles */
  @media print {
    .evidence-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #000;
    }

    .card-footer {
      display: none;
    }
  }
</style>