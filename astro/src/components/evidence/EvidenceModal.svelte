<!--
  EvidenceModal.svelte
  Full-screen modal for evidence viewing with complete WCAG 2.1 AA compliance
  Features focus trap, keyboard navigation, and screen reader support
-->
<script>
  import { onMount, createEventDispatcher, tick } from 'svelte';
  import EvidenceAccessibility from './EvidenceAccessibility.svelte';

  const dispatch = createEventDispatcher();

  // Props
  export let evidence;
  export let currentEvidenceIndex;
  export let totalEvidence;
  export let modalTrapElement;

  // Modal state
  let modalElement;
  let isImageLoaded = false;
  let isVideoLoaded = false;
  let imageError = false;
  let previousActiveElement;

  // Focus trap state
  let focusableElements = [];
  let firstFocusable;
  let lastFocusable;

  // Modal accessibility
  const modalId = `evidence-modal-${evidence.id}`;
  const titleId = `modal-title-${evidence.id}`;
  const descriptionId = `modal-description-${evidence.id}`;

  // Announcements for screen reader
  let announcements = '';

  function closeModal() {
    dispatch('closeModal');
  }

  function navigateModal(direction) {
    dispatch('navigateModal', { direction });
  }

  function navigateToTimeline() {
    if (evidence.timelineConnection && evidence.timelineConnection.length > 0) {
      dispatch('navigateTimeline', {
        eventId: evidence.timelineConnection[0],
        evidenceId: evidence.id
      });
      closeModal();
    }
  }

  function navigateToHero() {
    if (evidence.heroConnection && evidence.heroConnection.length > 0) {
      dispatch('navigateHero', {
        sceneId: evidence.heroConnection[0],
        evidenceId: evidence.id
      });
      closeModal();
    }
  }

  function handleKeydown(event) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeModal();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        navigateModal('previous');
        break;

      case 'ArrowRight':
        event.preventDefault();
        navigateModal('next');
        break;

      case 'Tab':
        handleTabNavigation(event);
        break;

      case 'Home':
        event.preventDefault();
        if (firstFocusable) firstFocusable.focus();
        break;

      case 'End':
        event.preventDefault();
        if (lastFocusable) lastFocusable.focus();
        break;
    }
  }

  function handleTabNavigation(event) {
    if (!focusableElements.length) return;

    const activeElement = document.activeElement;
    const currentIndex = focusableElements.indexOf(activeElement);

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (currentIndex <= 0) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab (forward)
      if (currentIndex >= focusableElements.length - 1) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  function updateFocusableElements() {
    if (!modalElement) return;

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      'details:not([disabled])',
      'summary:not(:disabled)'
    ].join(', ');

    focusableElements = Array.from(modalElement.querySelectorAll(focusableSelectors));
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];
  }

  function activateFocusTrap() {
    // Save the element that had focus before the modal opened
    previousActiveElement = document.activeElement;

    // Update focusable elements
    updateFocusableElements();

    // Focus the first focusable element
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      modalElement.focus();
    }

    // Add keyboard listener
    document.addEventListener('keydown', handleKeydown);

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Announce modal opening
    announcements = `Evidence modal opened: ${evidence.title}. Use arrow keys to navigate between evidence, escape to close.`;
  }

  function deactivateFocusTrap() {
    // Remove keyboard listener
    document.removeEventListener('keydown', handleKeydown);

    // Restore background scroll
    document.body.style.overflow = '';

    // Restore focus to the element that opened the modal
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  function handleImageLoad() {
    isImageLoaded = true;
    announcements = `Evidence image loaded: ${evidence.media.alt || evidence.title}`;
  }

  function handleImageError() {
    imageError = true;
    announcements = `Error loading evidence image for: ${evidence.title}`;
  }

  function handleVideoLoad() {
    isVideoLoaded = true;
    announcements = `Evidence video loaded: ${evidence.title}`;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatMetadataValue(value) {
    if (typeof value === 'number' && value >= 1000) {
      // Format large numbers (views, likes, etc.)
      return value.toLocaleString();
    }
    return value;
  }

  onMount(async () => {
    await tick(); // Wait for DOM to update
    activateFocusTrap();

    return () => {
      deactivateFocusTrap();
    };
  });

  // Reactive updates when evidence changes
  $: if (evidence && modalElement) {
    // Reset media loading states
    isImageLoaded = false;
    isVideoLoaded = false;
    imageError = false;

    // Update focus trap when evidence changes
    updateFocusableElements();

    // Announce evidence change
    announcements = `Evidence ${currentEvidenceIndex + 1} of ${totalEvidence}: ${evidence.title}`;
  }
</script>

<!-- Modal Backdrop -->
<div
  class="modal-backdrop"
  on:click={closeModal}
  aria-hidden="true"
></div>

<!-- Modal Container -->
<div
  bind:this={modalElement}
  class="evidence-modal"
  role="dialog"
  aria-labelledby={titleId}
  aria-describedby={descriptionId}
  aria-modal="true"
  tabindex="-1"
  id={modalId}
>
  <!-- Modal Header -->
  <header class="modal-header">
    <div class="modal-title-row">
      <h2 id={titleId} class="modal-title">
        {evidence.title}
      </h2>

      <div class="modal-nav-info">
        <span class="evidence-counter" aria-label={`Evidence ${currentEvidenceIndex + 1} of ${totalEvidence}`}>
          {currentEvidenceIndex + 1} / {totalEvidence}
        </span>
      </div>
    </div>

    <div class="modal-meta">
      <div class="evidence-type-badge" class:evidence-type--{evidence.type}>
        <span class="type-icon" aria-hidden="true">
          {#if evidence.type === 'media'}📁
          {:else if evidence.type === 'legal'}⚖️
          {:else if evidence.type === 'social'}💬
          {:else if evidence.type === 'academic'}🎓
          {:else if evidence.type === 'visual'}🎨
          {:else}📄{/if}
        </span>
        {evidence.type}
      </div>

      <div class="significance-badge" class:significance--{evidence.significance}>
        {evidence.significance}
      </div>

      {#if evidence.date}
        <time class="evidence-date" datetime={evidence.date}>
          {formatDate(evidence.date)}
        </time>
      {/if}
    </div>

    <button
      class="modal-close"
      on:click={closeModal}
      aria-label="Close evidence modal"
      title="Close (Escape)"
    >
      <span aria-hidden="true">×</span>
    </button>
  </header>

  <!-- Modal Content -->
  <main class="modal-main" id={descriptionId}>
    <!-- Media Content -->
    <div class="modal-media">
      {#if evidence.media.type === 'image'}
        <div class="image-container">
          {#if !isImageLoaded && !imageError}
            <div class="media-loading" aria-label="Loading image">
              <div class="loading-spinner" aria-hidden="true"></div>
              <span class="loading-text">Loading image...</span>
            </div>
          {/if}

          {#if !imageError}
            <img
              src={evidence.media.url}
              alt={evidence.media.alt}
              class="evidence-image"
              class:image-loaded={isImageLoaded}
              on:load={handleImageLoad}
              on:error={handleImageError}
              loading="lazy"
            />
          {:else}
            <div class="media-error" role="alert">
              <p>Unable to load image</p>
              <p class="error-details">{evidence.media.url}</p>
            </div>
          {/if}

          {#if evidence.media.caption && isImageLoaded}
            <div class="media-caption">
              {evidence.media.caption}
            </div>
          {/if}
        </div>

      {:else if evidence.media.type === 'video'}
        <div class="video-container">
          <video
            controls
            class="evidence-video"
            on:loadeddata={handleVideoLoad}
            aria-describedby="{descriptionId}-video"
          >
            <source src={evidence.media.url} type="video/mp4">
            <p>Your browser doesn't support video playback. <a href={evidence.media.url}>Download the video</a>.</p>
          </video>

          {#if evidence.media.caption}
            <div class="media-caption" id="{descriptionId}-video">
              {evidence.media.caption}
            </div>
          {/if}
        </div>

      {:else if evidence.media.type === 'audio'}
        <div class="audio-container">
          <audio
            controls
            class="evidence-audio"
            aria-describedby="{descriptionId}-audio"
          >
            <source src={evidence.media.url} type="audio/mpeg">
            <p>Your browser doesn't support audio playback. <a href={evidence.media.url}>Download the audio</a>.</p>
          </audio>

          {#if evidence.media.caption}
            <div class="media-caption" id="{descriptionId}-audio">
              {evidence.media.caption}
            </div>
          {/if}
        </div>

      {:else if evidence.media.type === 'document'}
        <div class="document-container">
          <div class="document-preview">
            <p class="document-type">
              Document: {evidence.media.url.split('.').pop().toUpperCase()}
            </p>
            <a
              href={evidence.media.url}
              class="document-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open document
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      {:else}
        <div class="media-fallback">
          <p>Media type: {evidence.media.type}</p>
          <a href={evidence.media.url} target="_blank" rel="noopener noreferrer">
            View evidence
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      {/if}
    </div>

    <!-- Evidence Details -->
    <div class="modal-details">
      <!-- Description -->
      <div class="evidence-description">
        <h3 class="section-title">Description</h3>
        <p>{evidence.description}</p>
      </div>

      <!-- Cultural Context (if available) -->
      {#if evidence.culturalContext}
        <div class="cultural-context">
          <h3 class="section-title">Cultural Analysis</h3>
          <p>{evidence.culturalContext}</p>
        </div>
      {/if}

      <!-- Source & Attribution -->
      <div class="evidence-attribution">
        <h3 class="section-title">Source & Attribution</h3>
        <dl class="attribution-list">
          <dt>Source:</dt>
          <dd><cite>{evidence.source}</cite></dd>

          {#if evidence.metadata?.verificationLevel}
            <dt>Verification Level:</dt>
            <dd class="verification-level verification-level--{evidence.metadata.verificationLevel}">
              {evidence.metadata.verificationLevel.replace('-', ' ')}
            </dd>
          {/if}
        </dl>
      </div>

      <!-- Metadata -->
      {#if evidence.metadata && Object.keys(evidence.metadata).length > 0}
        <details class="evidence-metadata">
          <summary class="metadata-toggle">Technical Metadata</summary>
          <dl class="metadata-list">
            {#each Object.entries(evidence.metadata) as [key, value]}
              {#if key !== 'verificationLevel'}
                <div class="metadata-item">
                  <dt>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</dt>
                  <dd>{formatMetadataValue(value)}</dd>
                </div>
              {/if}
            {/each}
          </dl>
        </details>
      {/if}

      <!-- Tags -->
      {#if evidence.tags && evidence.tags.length > 0}
        <div class="evidence-tags">
          <h3 class="section-title">Tags</h3>
          <ul class="tags-list">
            {#each evidence.tags as tag}
              <li class="tag">{tag}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </main>

  <!-- Modal Footer -->
  <footer class="modal-footer">
    <!-- Navigation Controls -->
    <div class="modal-navigation">
      <button
        class="nav-btn nav-btn--prev"
        on:click={() => navigateModal('previous')}
        aria-label="Previous evidence"
        title="Previous (Left Arrow)"
      >
        <span aria-hidden="true">←</span>
        Previous
      </button>

      <button
        class="nav-btn nav-btn--next"
        on:click={() => navigateModal('next')}
        aria-label="Next evidence"
        title="Next (Right Arrow)"
      >
        Next
        <span aria-hidden="true">→</span>
      </button>
    </div>

    <!-- Context Navigation -->
    <div class="context-navigation">
      {#if evidence.timelineConnection && evidence.timelineConnection.length > 0}
        <button
          class="context-btn context-btn--timeline"
          on:click={navigateToTimeline}
          aria-label="View related timeline event"
        >
          <span aria-hidden="true">📅</span>
          View on Timeline
        </button>
      {/if}

      {#if evidence.heroConnection && evidence.heroConnection.length > 0}
        <button
          class="context-btn context-btn--hero"
          on:click={navigateToHero}
          aria-label="View related hero scene"
        >
          <span aria-hidden="true">🎬</span>
          View in Hero
        </button>
      {/if}
    </div>
  </footer>
</div>

<!-- Accessibility Component -->
<EvidenceAccessibility {announcements} />

<style>
  /* Modal Backdrop */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(26, 54, 93, 0.8);
    backdrop-filter: blur(4px);
    z-index: 1000;
    cursor: pointer;
  }

  /* Modal Container */
  .evidence-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 60rem;
    max-height: 90vh;
    background-color: var(--color-concrete-light);
    border-radius: var(--space-sm);
    border: 2px solid var(--color-maritime-deep);
    box-shadow: 0 20px 60px rgba(26, 54, 93, 0.3);
    display: flex;
    flex-direction: column;
    z-index: 1001;
    font-family: var(--font-body);
  }

  .evidence-modal:focus {
    outline: none;
  }

  /* Modal Header */
  .modal-header {
    padding: var(--space-lg);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
    background-color: rgba(26, 54, 93, 0.05);
    border-radius: var(--space-sm) var(--space-sm) 0 0;
    position: relative;
  }

  .modal-title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-lg);
    margin-bottom: var(--space-md);
  }

  .modal-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    line-height: var(--line-height-heading);
    color: var(--color-maritime-deep);
    margin: 0;
    flex: 1;
  }

  .evidence-counter {
    font-size: 0.875rem;
    font-weight: 600;
    color: rgba(45, 55, 72, 0.7);
    padding: var(--space-xs) var(--space-sm);
    background-color: rgba(26, 54, 93, 0.1);
    border-radius: var(--space-xs);
  }

  .modal-meta {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
    align-items: center;
  }

  .evidence-type-badge,
  .significance-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: var(--space-xs);
    border: 1px solid;
  }

  .evidence-type-badge {
    background-color: var(--color-amber-warm);
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .significance-badge {
    background-color: var(--color-sage-muted);
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .significance--critical {
    background-color: var(--color-sage-muted);
    box-shadow: 0 0 0 2px rgba(104, 211, 145, 0.3);
  }

  .significance--primary {
    background-color: var(--color-amber-warm);
    box-shadow: 0 0 0 2px rgba(214, 158, 46, 0.3);
  }

  .type-icon {
    font-size: 1rem;
  }

  .evidence-date {
    font-size: 0.875rem;
    color: rgba(45, 55, 72, 0.7);
    font-style: italic;
  }

  .modal-close {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    background-color: transparent;
    color: var(--color-maritime-deep);
    font-size: 1.5rem;
    font-weight: bold;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .modal-close:hover,
  .modal-close:focus {
    background-color: rgba(26, 54, 93, 0.1);
    color: var(--color-amber-warm);
  }

  .modal-close:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  /* Modal Main Content */
  .modal-main {
    flex: 1;
    display: flex;
    gap: var(--space-lg);
    padding: var(--space-lg);
    overflow: hidden;
  }

  /* Media Content */
  .modal-media {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 20rem;
  }

  .image-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    text-align: center;
  }

  .evidence-image {
    max-width: 100%;
    max-height: 50vh;
    height: auto;
    border-radius: var(--space-xs);
    box-shadow: 0 4px 12px rgba(26, 54, 93, 0.15);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .evidence-image.image-loaded {
    opacity: 1;
  }

  .video-container,
  .audio-container {
    width: 100%;
  }

  .evidence-video,
  .evidence-audio {
    width: 100%;
    max-width: 100%;
    border-radius: var(--space-xs);
  }

  .document-container,
  .media-fallback {
    text-align: center;
    padding: var(--space-xl);
    border: 2px dashed rgba(26, 54, 93, 0.3);
    border-radius: var(--space-sm);
    background-color: rgba(26, 54, 93, 0.05);
  }

  .document-link,
  .media-fallback a {
    color: var(--color-maritime-deep);
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-maritime-deep);
    border-radius: var(--space-xs);
    margin-top: var(--space-sm);
    transition: all 0.2s ease;
  }

  .document-link:hover,
  .document-link:focus,
  .media-fallback a:hover,
  .media-fallback a:focus {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .media-caption {
    margin-top: var(--space-sm);
    font-style: italic;
    color: rgba(45, 55, 72, 0.7);
    font-size: 0.875rem;
    text-align: center;
  }

  .media-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xl);
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(26, 54, 93, 0.1);
    border-top: 3px solid var(--color-maritime-deep);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: rgba(45, 55, 72, 0.7);
    font-style: italic;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .media-error {
    text-align: center;
    padding: var(--space-lg);
    color: #e53e3e;
    background-color: rgba(229, 62, 62, 0.1);
    border: 1px solid rgba(229, 62, 62, 0.3);
    border-radius: var(--space-xs);
  }

  .error-details {
    font-size: 0.75rem;
    color: rgba(229, 62, 62, 0.7);
    margin-top: var(--space-xs);
    word-break: break-all;
  }

  /* Modal Details */
  .modal-details {
    flex: 1;
    overflow-y: auto;
    padding-right: var(--space-sm);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-maritime-deep);
    margin-bottom: var(--space-sm);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
    padding-bottom: var(--space-xs);
  }

  .evidence-description,
  .cultural-context,
  .evidence-attribution,
  .evidence-tags {
    margin-bottom: var(--space-lg);
  }

  .evidence-description p,
  .cultural-context p {
    line-height: var(--line-height-body);
    color: var(--color-text-primary);
    margin: 0;
  }

  .attribution-list,
  .metadata-list {
    display: grid;
    gap: var(--space-sm);
    font-size: 0.875rem;
  }

  .attribution-list dt,
  .metadata-item dt {
    font-weight: 600;
    color: var(--color-maritime-deep);
  }

  .attribution-list dd,
  .metadata-item dd {
    margin: 0;
    color: var(--color-text-primary);
  }

  .verification-level {
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--space-xs);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  .verification-level--primary-source {
    background-color: var(--color-sage-muted);
    color: var(--color-maritime-deep);
  }

  .verification-level--secondary-source {
    background-color: var(--color-amber-warm);
    color: var(--color-maritime-deep);
  }

  .evidence-metadata {
    border-top: 1px solid rgba(26, 54, 93, 0.1);
    padding-top: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .metadata-toggle {
    font-weight: 600;
    color: var(--color-maritime-deep);
    cursor: pointer;
    padding: var(--space-xs) 0;
    list-style: none;
  }

  .metadata-toggle::-webkit-details-marker {
    display: none;
  }

  .metadata-toggle::before {
    content: "▶";
    margin-right: var(--space-xs);
    transition: transform 0.2s ease;
  }

  .evidence-metadata[open] .metadata-toggle::before {
    transform: rotate(90deg);
  }

  .metadata-item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-sm);
    align-items: start;
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
    font-size: 0.75rem;
    font-weight: 600;
  }

  /* Modal Footer */
  .modal-footer {
    padding: var(--space-lg);
    border-top: 1px solid rgba(26, 54, 93, 0.1);
    background-color: rgba(26, 54, 93, 0.02);
    border-radius: 0 0 var(--space-sm) var(--space-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-lg);
  }

  .modal-navigation,
  .context-navigation {
    display: flex;
    gap: var(--space-sm);
  }

  .nav-btn,
  .context-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid var(--color-maritime-deep);
    border-radius: var(--space-xs);
    background-color: transparent;
    color: var(--color-maritime-deep);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-btn:hover,
  .nav-btn:focus,
  .context-btn:hover,
  .context-btn:focus {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .nav-btn:focus,
  .context-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  /* Responsive Design */
  @media (max-width: 64rem) {
    .evidence-modal {
      width: 95vw;
      max-height: 95vh;
    }

    .modal-main {
      flex-direction: column;
      gap: var(--space-md);
    }

    .modal-details {
      overflow-y: visible;
      padding-right: 0;
    }

    .modal-footer {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-md);
    }

    .modal-navigation,
    .context-navigation {
      justify-content: center;
    }
  }

  @media (max-width: 48rem) {
    .modal-header {
      padding: var(--space-md);
    }

    .modal-main {
      padding: var(--space-md);
    }

    .modal-footer {
      padding: var(--space-md);
    }

    .modal-title {
      font-size: 1.25rem;
    }

    .modal-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
    }

    .nav-btn,
    .context-btn {
      flex: 1;
      justify-content: center;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .evidence-modal {
      border-width: 3px;
    }

    .evidence-type-badge,
    .significance-badge {
      border-width: 2px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .evidence-image,
    .nav-btn,
    .context-btn,
    .modal-close {
      transition: none;
    }

    .loading-spinner {
      animation: none;
    }
  }
</style>