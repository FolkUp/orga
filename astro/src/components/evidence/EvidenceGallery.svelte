<!--
  EvidenceGallery.svelte
  Main evidence gallery grid with filtering, search, and modal integration
  WCAG 2.1 AA compliant with keyboard navigation and screen reader support
-->
<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import EvidenceCard from './EvidenceCard.svelte';
  import EvidenceModal from './EvidenceModal.svelte';
  import EvidenceFilter from './EvidenceFilter.svelte';
  import EvidenceSearch from './EvidenceSearch.svelte';

  const dispatch = createEventDispatcher();

  // Props
  export let evidenceData = [];
  export let viewMode = 'grid'; // 'grid' | 'list'
  export let initialFilter = 'all';
  export let initialSearch = '';
  export let enableLazyLoading = true;
  export let itemsPerPage = 12;
  export let timelineConnection = null;
  export let heroConnection = null;

  // Gallery state stores
  export const searchTerm = writable(initialSearch);
  export const selectedTypes = writable([]);
  export const significanceFilter = writable(initialFilter);
  export const dateRange = writable({ start: null, end: null });
  export const sortOrder = writable('date-desc'); // 'date-desc', 'date-asc', 'significance', 'title'

  // Modal state
  let isModalOpen = false;
  let currentEvidenceIndex = 0;
  let modalTrapElement;

  // Pagination state
  let currentPage = 1;
  let loadedItems = itemsPerPage;
  let galleryContainer;
  let intersectionObserver;

  // Announcements for screen readers
  const announcements = writable('');

  // Filtered and sorted evidence
  const filteredEvidence = derived(
    [searchTerm, selectedTypes, significanceFilter, dateRange, sortOrder],
    ([$search, $types, $significance, $dates, $sort]) => {
      let filtered = evidenceData
        .filter(item => matchesSearch(item, $search))
        .filter(item => matchesTypes(item, $types))
        .filter(item => matchesSignificance(item, $significance))
        .filter(item => matchesDateRange(item, $dates));

      return sortEvidence(filtered, $sort);
    }
  );

  // Currently displayed evidence (with pagination)
  const displayedEvidence = derived(
    filteredEvidence,
    ($filtered) => {
      if (enableLazyLoading) {
        return $filtered.slice(0, loadedItems);
      }
      return $filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }
  );

  // Search and filter functions
  function matchesSearch(item, search) {
    if (!search.trim()) return true;

    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.source.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  function matchesTypes(item, types) {
    if (!types.length) return true;
    return types.includes(item.type);
  }

  function matchesSignificance(item, significance) {
    if (significance === 'all') return true;
    return item.significance === significance;
  }

  function matchesDateRange(item, dates) {
    if (!dates.start && !dates.end) return true;

    const itemDate = new Date(item.date);
    if (dates.start && itemDate < new Date(dates.start)) return false;
    if (dates.end && itemDate > new Date(dates.end)) return false;
    return true;
  }

  function sortEvidence(evidence, sortOrder) {
    return [...evidence].sort((a, b) => {
      switch (sortOrder) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'significance':
          const sigOrder = { critical: 0, primary: 1, supporting: 2, contextual: 3 };
          return sigOrder[a.significance] - sigOrder[b.significance];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'cultural-impact':
          const impactOrder = { high: 0, medium: 1, low: 2 };
          return impactOrder[a.metadata?.culturalImpact || 'low'] - impactOrder[b.metadata?.culturalImpact || 'low'];
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }

  // Modal functions
  function openModal(evidenceIndex) {
    currentEvidenceIndex = evidenceIndex;
    isModalOpen = true;

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Announce modal opening
    announcements.set(`Evidence modal opened: ${$displayedEvidence[evidenceIndex]?.title}`);

    // Focus management will be handled by EvidenceModal component
  }

  function closeModal() {
    isModalOpen = false;
    document.body.style.overflow = '';

    // Return focus to the card that opened the modal
    const cardId = `evidence-card-${currentEvidenceIndex}`;
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
      cardElement.focus();
    }

    announcements.set('Evidence modal closed');
  }

  function navigateModal(direction) {
    const maxIndex = $displayedEvidence.length - 1;

    if (direction === 'previous') {
      currentEvidenceIndex = currentEvidenceIndex > 0 ? currentEvidenceIndex - 1 : maxIndex;
    } else if (direction === 'next') {
      currentEvidenceIndex = currentEvidenceIndex < maxIndex ? currentEvidenceIndex + 1 : 0;
    }

    announcements.set(`Viewing evidence ${currentEvidenceIndex + 1} of ${maxIndex + 1}: ${$displayedEvidence[currentEvidenceIndex]?.title}`);
  }

  // Lazy loading setup
  function setupLazyLoading() {
    if (!enableLazyLoading || !galleryContainer) return;

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && loadedItems < $filteredEvidence.length) {
          loadedItems = Math.min(loadedItems + itemsPerPage, $filteredEvidence.length);
        }
      });
    }, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    });

    // Observe a sentinel element at the bottom of the gallery
    const sentinel = galleryContainer.querySelector('.lazy-load-sentinel');
    if (sentinel) {
      intersectionObserver.observe(sentinel);
    }
  }

  // External navigation integration
  export function filterByTimelineEvent(eventId) {
    const evidenceForEvent = evidenceData.filter(item =>
      item.timelineConnection && item.timelineConnection.includes(eventId)
    );

    if (evidenceForEvent.length > 0) {
      // Apply filter to show only evidence for this timeline event
      selectedTypes.set([]);
      significanceFilter.set('all');
      searchTerm.set(`timeline:${eventId}`);

      announcements.set(`Showing ${evidenceForEvent.length} evidence items for timeline event ${eventId}`);
    }
  }

  export function filterByHeroScene(sceneId) {
    const evidenceForScene = evidenceData.filter(item =>
      item.heroConnection && item.heroConnection.includes(sceneId)
    );

    if (evidenceForScene.length > 0) {
      selectedTypes.set([]);
      significanceFilter.set('all');
      searchTerm.set(`scene:${sceneId}`);

      announcements.set(`Showing ${evidenceForScene.length} evidence items for hero scene ${sceneId}`);
    }
  }

  export function jumpToEvidence(evidenceId) {
    const evidenceIndex = $displayedEvidence.findIndex(item => item.id === evidenceId);
    if (evidenceIndex !== -1) {
      openModal(evidenceIndex);
    }
  }

  // Performance optimization
  function handleKeyboardNavigation(event) {
    // Gallery-level keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'f':
          event.preventDefault();
          const searchInput = document.querySelector('.evidence-search__input');
          if (searchInput) {
            searchInput.focus();
          }
          break;
        case 'g':
          event.preventDefault();
          viewMode = viewMode === 'grid' ? 'list' : 'grid';
          announcements.set(`View mode changed to ${viewMode}`);
          break;
      }
    }
  }

  onMount(() => {
    setupLazyLoading();

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Performance monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log('[EvidenceGallery] Mounted with', evidenceData.length, 'evidence items');
    }

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  });

  // Reactive statements for announcements
  $: if ($filteredEvidence) {
    if ($filteredEvidence.length === 0) {
      announcements.set('No evidence items match the current filters');
    } else {
      announcements.set(`${$filteredEvidence.length} evidence items found`);
    }
  }
</script>

<!-- Evidence Gallery Container -->
<section
  class="evidence-gallery"
  aria-label="Evidence Gallery"
  bind:this={galleryContainer}
>
  <!-- Gallery Controls -->
  <header class="gallery-controls">
    <div class="controls-row">
      <EvidenceSearch
        bind:searchTerm={$searchTerm}
        bind:sortOrder={$sortOrder}
        resultCount={$filteredEvidence.length}
      />

      <div class="view-controls">
        <fieldset class="view-mode-controls">
          <legend class="sr-only">View mode</legend>
          <label class="view-mode-label">
            <input
              type="radio"
              bind:group={viewMode}
              value="grid"
              aria-describedby="view-mode-description"
            />
            <span class="view-mode-text" aria-hidden="true">Grid</span>
          </label>
          <label class="view-mode-label">
            <input
              type="radio"
              bind:group={viewMode}
              value="list"
              aria-describedby="view-mode-description"
            />
            <span class="view-mode-text" aria-hidden="true">List</span>
          </label>
        </fieldset>

        <div id="view-mode-description" class="sr-only">
          Choose between grid layout or list layout for evidence display
        </div>
      </div>
    </div>

    <EvidenceFilter
      bind:selectedTypes={$selectedTypes}
      bind:significanceFilter={$significanceFilter}
      bind:dateRange={$dateRange}
      availableTypes={[...new Set(evidenceData.map(item => item.type))]}
    />
  </header>

  <!-- Results Summary -->
  <div class="results-summary" role="status" aria-live="polite">
    <p>
      Showing {$displayedEvidence.length} of {$filteredEvidence.length} evidence items
      {#if $selectedTypes.length > 0 || $significanceFilter !== 'all' || $searchTerm.trim()}
        (filtered)
      {/if}
    </p>

    {#if $filteredEvidence.length > $displayedEvidence.length && enableLazyLoading}
      <p class="load-more-hint">Scroll down to load more evidence</p>
    {/if}
  </div>

  <!-- Evidence Grid/List -->
  <div
    class="evidence-grid"
    class:evidence-grid--list={viewMode === 'list'}
    role="region"
    aria-label="Evidence items"
  >
    {#each $displayedEvidence as evidence, index (evidence.id)}
      <EvidenceCard
        {evidence}
        {index}
        {viewMode}
        on:openModal={() => openModal(index)}
        on:navigateTimeline={(event) => dispatch('navigateTimeline', event.detail)}
        on:navigateHero={(event) => dispatch('navigateHero', event.detail)}
      />
    {/each}

    <!-- Lazy loading sentinel -->
    {#if enableLazyLoading && $filteredEvidence.length > $displayedEvidence.length}
      <div class="lazy-load-sentinel" aria-hidden="true"></div>
    {/if}
  </div>

  <!-- Empty State -->
  {#if $filteredEvidence.length === 0}
    <div class="empty-state" role="region" aria-label="No results">
      <div class="empty-state__content">
        <h3 class="empty-state__title">No evidence found</h3>
        <p class="empty-state__description">
          Try adjusting your search terms or filters to find relevant evidence.
        </p>
        <button
          class="btn btn--secondary"
          on:click={() => {
            searchTerm.set('');
            selectedTypes.set([]);
            significanceFilter.set('all');
            dateRange.set({ start: null, end: null });
          }}
        >
          Clear all filters
        </button>
      </div>
    </div>
  {/if}

  <!-- Pagination (for non-lazy loading mode) -->
  {#if !enableLazyLoading && $filteredEvidence.length > itemsPerPage}
    <nav class="pagination" aria-label="Evidence gallery pagination">
      <button
        class="pagination-btn"
        disabled={currentPage === 1}
        on:click={() => currentPage = Math.max(1, currentPage - 1)}
        aria-label="Previous page"
      >
        Previous
      </button>

      <span class="pagination-info">
        Page {currentPage} of {Math.ceil($filteredEvidence.length / itemsPerPage)}
      </span>

      <button
        class="pagination-btn"
        disabled={currentPage >= Math.ceil($filteredEvidence.length / itemsPerPage)}
        on:click={() => currentPage = Math.min(Math.ceil($filteredEvidence.length / itemsPerPage), currentPage + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  {/if}

  <!-- Evidence Modal -->
  {#if isModalOpen && $displayedEvidence[currentEvidenceIndex]}
    <EvidenceModal
      evidence={$displayedEvidence[currentEvidenceIndex]}
      {currentEvidenceIndex}
      totalEvidence={$displayedEvidence.length}
      on:closeModal={closeModal}
      on:navigateModal={(event) => navigateModal(event.detail.direction)}
      on:navigateTimeline={(event) => dispatch('navigateTimeline', event.detail)}
      on:navigateHero={(event) => dispatch('navigateHero', event.detail)}
      bind:modalTrapElement
    />
  {/if}
</section>

<!-- Screen Reader Announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  {$announcements}
</div>

<!-- Keyboard shortcuts help (hidden by default, shown on ?) -->
<div class="keyboard-help sr-only" id="keyboard-help">
  <h3>Keyboard Shortcuts</h3>
  <ul>
    <li><kbd>Ctrl/Cmd + F</kbd>: Focus search</li>
    <li><kbd>Ctrl/Cmd + G</kbd>: Toggle grid/list view</li>
    <li><kbd>Tab</kbd>: Navigate between evidence items</li>
    <li><kbd>Enter/Space</kbd>: Open evidence modal</li>
    <li><kbd>Escape</kbd>: Close modal</li>
    <li><kbd>Arrow keys</kbd>: Navigate within modal</li>
  </ul>
</div>

<style>
  /* Evidence Gallery Styles */
  .evidence-gallery {
    font-family: var(--font-body);
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--space-md);
  }

  /* Gallery Controls */
  .gallery-controls {
    margin-bottom: var(--space-xl);
    padding: var(--space-md);
    background-color: var(--color-concrete-light);
    border: 1px solid rgba(26, 54, 93, 0.1);
    border-radius: var(--space-sm);
  }

  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-lg);
    margin-bottom: var(--space-md);
  }

  /* View Mode Controls */
  .view-mode-controls {
    border: none;
    display: flex;
    gap: var(--space-xs);
  }

  .view-mode-label {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--color-maritime-deep);
    border-radius: var(--space-xs);
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s ease;
  }

  .view-mode-label:has(input:checked) {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .view-mode-label:has(input:focus) {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  .view-mode-label input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .view-mode-text {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Results Summary */
  .results-summary {
    margin-bottom: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    background-color: rgba(26, 54, 93, 0.05);
    border-radius: var(--space-xs);
    font-size: 0.875rem;
  }

  .results-summary p {
    margin: 0;
    color: var(--color-text-primary);
  }

  .load-more-hint {
    color: rgba(45, 55, 72, 0.7);
    font-style: italic;
  }

  /* Evidence Grid */
  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .evidence-grid--list {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  /* Responsive Grid */
  @media (max-width: 48rem) {
    .evidence-grid {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }

    .controls-row {
      flex-direction: column;
      gap: var(--space-md);
    }
  }

  @media (min-width: 48.1rem) and (max-width: 64rem) {
    .evidence-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  @media (min-width: 80rem) {
    .evidence-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }

  /* Lazy Loading Sentinel */
  .lazy-load-sentinel {
    grid-column: 1 / -1;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  /* Empty State */
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
  }

  .empty-state__content {
    max-width: 30rem;
    margin: 0 auto;
  }

  .empty-state__title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-maritime-deep);
    margin-bottom: var(--space-md);
  }

  .empty-state__description {
    color: rgba(45, 55, 72, 0.8);
    margin-bottom: var(--space-lg);
    line-height: var(--line-height-body);
  }

  /* Buttons */
  .btn {
    display: inline-block;
    padding: var(--space-sm) var(--space-lg);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    border: 2px solid;
    border-radius: var(--space-xs);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }

  .btn--secondary {
    background-color: transparent;
    border-color: var(--color-maritime-deep);
    color: var(--color-maritime-deep);
  }

  .btn--secondary:hover,
  .btn--secondary:focus {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg) 0;
  }

  .pagination-btn {
    @extend .btn;
    @extend .btn--secondary;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .pagination-info {
    font-weight: 600;
    color: var(--color-maritime-deep);
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

  /* Keyboard Help */
  .keyboard-help {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-concrete-light);
    border: 2px solid var(--color-maritime-deep);
    border-radius: var(--space-sm);
    padding: var(--space-lg);
    max-width: 25rem;
    z-index: 1000;
  }

  .keyboard-help h3 {
    margin-bottom: var(--space-md);
    color: var(--color-maritime-deep);
  }

  .keyboard-help ul {
    list-style: none;
    padding: 0;
  }

  .keyboard-help li {
    margin-bottom: var(--space-sm);
    display: flex;
    justify-content: space-between;
  }

  .keyboard-help kbd {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--space-xs);
    font-size: 0.75rem;
  }

  /* Performance optimizations */
  .evidence-grid {
    contain: layout;
  }

  /* Focus management */
  .evidence-gallery:focus-within {
    /* Visual indicator that gallery has focus */
  }

  /* Print styles */
  @media print {
    .gallery-controls,
    .pagination {
      display: none;
    }

    .evidence-grid {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }
  }
</style>