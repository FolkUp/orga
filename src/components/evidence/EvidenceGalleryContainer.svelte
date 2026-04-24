<!--
  Evidence Gallery Container - ORGA-066 Implementation
  Multimedia Scholarship Archive with Academic Citation Standards

  @component EvidenceGalleryContainer
  @accessibility WCAG 2.1 AA compliant with full keyboard navigation
  @performance Lazy loading with intersection observers
  @aesthetic Underground Academia visual system integration
-->

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { writable } from 'svelte/store';

  import EvidenceItem from './EvidenceItem.svelte';
  import EvidenceModal from './EvidenceModal.svelte';
  import EvidenceAccessibility from './EvidenceAccessibility.svelte';
  import EvidenceFilters from './EvidenceFilters.svelte';

  import {
    evidenceGalleryStructure,
    getEvidenceByAct,
    getEvidenceByType,
    getEvidenceByCriticalWeight,
    validateEvidenceIntegrity
  } from '../../data/evidenceGalleryData.js';

  // Component props
  export let selectedAct = 'all';
  export let selectedType = 'all';
  export let sortBy = 'chronological';
  export let accessibilityMode = false;
  export let offlineMode = false;

  // Component state
  const dispatch = createEventDispatcher();
  const activeEvidence = writable(null);
  const galleryState = writable({
    loading: true,
    initialized: false,
    error: null,
    viewMode: 'gallery', // 'gallery' | 'table' | 'timeline'
    itemsLoaded: 0
  });

  let evidenceContainer;
  let evidenceItems = [];
  let filteredEvidence = [];
  let intersectionObserver;
  let focusedItemIndex = 0;
  let modalOpen = false;

  // Underground Academia theming
  const undergroundAcademiaTheme = {
    colors: {
      sepia: '#8B4513',
      graphite: '#2F4F4F',
      amber: '#FFBF00',
      ivory: '#FEFCF6',
      archival: '#6B4423'
    },
    typography: {
      typewriter: "'Courier New', 'Liberation Mono', monospace",
      academic: "'Playfair Display', serif",
      marginalia: "'Source Sans 3', sans-serif"
    }
  };

  // Evidence loading and filtering
  async function loadEvidenceData() {
    try {
      $galleryState = { ...$galleryState, loading: true, error: null };

      // Load evidence based on current filters
      let evidence = [];

      if (selectedAct === 'all') {
        evidence = getEvidenceByCriticalWeight();
      } else {
        evidence = getEvidenceByAct(selectedAct);
      }

      if (selectedType !== 'all') {
        evidence = evidence.filter(item => item.type === selectedType);
      }

      // Sort evidence based on selected criteria
      evidence = sortEvidence(evidence, sortBy);

      // Validate evidence integrity
      evidence = evidence.map(item => ({
        ...item,
        validation: validateEvidenceIntegrity(item),
        archival_number: generateArchivalNumber(item),
        scholarly_weight: getScholarlyWeight(item)
      }));

      evidenceItems = evidence;
      filteredEvidence = evidence;

      $galleryState = {
        ...$galleryState,
        loading: false,
        initialized: true,
        itemsLoaded: evidence.length
      };

      // Initialize accessibility features
      if (accessibilityMode) {
        announceGalleryUpdate();
      }

    } catch (error) {
      console.error('Evidence loading error:', error);
      $galleryState = {
        ...$galleryState,
        loading: false,
        error: 'Failed to load evidence archive'
      };
    }
  }

  function sortEvidence(evidence, criteria) {
    switch (criteria) {
      case 'chronological':
        return evidence.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'significance':
        return evidence.sort((a, b) => {
          const aWeight = getScholarlyWeightValue(a);
          const bWeight = getScholarlyWeightValue(b);
          return bWeight - aWeight;
        });
      case 'type':
        return evidence.sort((a, b) => a.type.localeCompare(b.type));
      case 'act':
        return evidence.sort((a, b) => {
          const actOrder = { 'prophecy': 1, 'validation': 2, 'recognition': 3 };
          return actOrder[a.act] - actOrder[b.act];
        });
      default:
        return evidence;
    }
  }

  function getScholarlyWeight(item) {
    const weights = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return weights[item.provenance?.confidence_level] || 1;
  }

  function getScholarlyWeightValue(item) {
    return getScholarlyWeight(item);
  }

  function generateArchivalNumber(item) {
    const typeCode = item.id.split('-')[0];
    const itemNumber = item.id.split('-')[1].padStart(3, '0');
    const actCode = item.act.substring(0, 1).toUpperCase();
    return `${typeCode}-${actCode}-${itemNumber}`;
  }

  // Accessibility functions
  function announceGalleryUpdate() {
    const announcement = `Evidence gallery updated. ${filteredEvidence.length} items loaded. ` +
                        `Sorted by ${sortBy}. Use arrow keys to navigate.`;
    dispatch('accessibility-announce', { message: announcement });
  }

  function handleKeyboardNavigation(event) {
    if (modalOpen) return; // Let modal handle its own navigation

    const { key } = event;
    const currentIndex = focusedItemIndex;
    const maxIndex = filteredEvidence.length - 1;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        focusedItemIndex = Math.min(currentIndex + 1, maxIndex);
        focusEvidenceItem(focusedItemIndex);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        focusedItemIndex = Math.max(currentIndex - 1, 0);
        focusEvidenceItem(focusedItemIndex);
        break;
      case 'Home':
        event.preventDefault();
        focusedItemIndex = 0;
        focusEvidenceItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusedItemIndex = maxIndex;
        focusEvidenceItem(maxIndex);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        openEvidenceModal(filteredEvidence[focusedItemIndex]);
        break;
      case 'Escape':
        if (modalOpen) {
          closeEvidenceModal();
        }
        break;
    }
  }

  function focusEvidenceItem(index) {
    const items = evidenceContainer?.querySelectorAll('.evidence-item');
    if (items && items[index]) {
      items[index].focus();

      // Announce to screen readers
      if (accessibilityMode) {
        const evidence = filteredEvidence[index];
        const announcement = `Evidence ${index + 1} of ${filteredEvidence.length}. ` +
                            `${evidence.title}. Type: ${evidence.type.replace('_', ' ')}. ` +
                            `From ${evidence.act} phase.`;
        dispatch('accessibility-announce', { message: announcement });
      }
    }
  }

  // Modal functions
  function openEvidenceModal(evidenceItem) {
    $activeEvidence = evidenceItem;
    modalOpen = true;
    dispatch('evidence-opened', { evidence: evidenceItem });
  }

  function closeEvidenceModal() {
    $activeEvidence = null;
    modalOpen = false;

    // Return focus to gallery item
    setTimeout(() => {
      focusEvidenceItem(focusedItemIndex);
    }, 100);

    dispatch('evidence-closed');
  }

  // Filter handling
  function handleFilterChange(event) {
    const { filter, value } = event.detail;

    switch (filter) {
      case 'act':
        selectedAct = value;
        break;
      case 'type':
        selectedType = value;
        break;
      case 'sort':
        sortBy = value;
        break;
      case 'view':
        $galleryState = { ...$galleryState, viewMode: value };
        break;
    }

    // Reload evidence with new filters
    loadEvidenceData();
  }

  // Performance optimization
  function initializeIntersectionObserver() {
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const item = entry.target;
              item.classList.add('evidence-visible');
              // Lazy load heavy content here if needed
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
    }
  }

  // Lifecycle
  onMount(async () => {
    await loadEvidenceData();
    initializeIntersectionObserver();

    // Set initial focus
    setTimeout(() => {
      if (filteredEvidence.length > 0) {
        focusEvidenceItem(0);
      }
    }, 100);
  });

  // Reactive statements
  $: if (selectedAct || selectedType || sortBy) {
    loadEvidenceData();
  }
</script>

<!-- Keyboard navigation handler -->
<svelte:window on:keydown={handleKeyboardNavigation} />

<!-- Main gallery container -->
<div
  class="evidence-gallery-container"
  class:accessibility-mode={accessibilityMode}
  class:offline-mode={offlineMode}
  bind:this={evidenceContainer}
  role="main"
  aria-label="Evidence Gallery - Academic Archive"
>
  <!-- Gallery header with Underground Academia styling -->
  <header class="gallery-header">
    <div class="archival-stamp">
      <span class="stamp-text">АКАДЕМИЧЕСКИЙ АРХИВ</span>
      <span class="stamp-number">СЕРИЯ-ORGA-066</span>
    </div>

    <h1 class="gallery-title">
      <span class="typewriter-text">Evidence Gallery</span>
      <span class="academic-subtitle">Multimedia Scholarship Archive</span>
    </h1>

    <div class="archival-metadata">
      <span class="document-class">CLASSIFICATION: АКАДЕМИЧЕСКАЯ ИССЛЕДОВАТЕЛЬСКАЯ</span>
      <span class="document-date">ДАТА КАТАЛОГИЗАЦИИ: {new Date().toISOString().split('T')[0]}</span>
    </div>
  </header>

  <!-- Filters and controls -->
  <EvidenceFilters
    {selectedAct}
    {selectedType}
    {sortBy}
    viewMode={$galleryState.viewMode}
    itemCount={filteredEvidence.length}
    on:filter-change={handleFilterChange}
  />

  <!-- Loading state -->
  {#if $galleryState.loading}
    <div class="loading-container" aria-live="polite">
      <div class="archival-loading">
        <div class="typewriter-loading">
          <span>Загрузка архивных документов</span>
          <span class="loading-dots">...</span>
        </div>
        <div class="loading-progress" role="progressbar" aria-label="Loading evidence archive"></div>
      </div>
    </div>
  {/if}

  <!-- Error state -->
  {#if $galleryState.error}
    <div class="error-container" role="alert">
      <div class="archival-error">
        <h2 class="error-title">Ошибка доступа к архиву</h2>
        <p class="error-message">{$galleryState.error}</p>
        <button
          class="retry-button"
          on:click={loadEvidenceData}
        >
          Повторить загрузку
        </button>
      </div>
    </div>
  {/if}

  <!-- Evidence gallery content -->
  {#if $galleryState.initialized && !$galleryState.loading && !$galleryState.error}
    <div class="gallery-content">
      <!-- Gallery view mode -->
      {#if $galleryState.viewMode === 'gallery'}
        <div
          class="evidence-grid"
          role="grid"
          aria-label="Evidence items grid"
        >
          {#each filteredEvidence as evidence, index (evidence.id)}
            <div
              class="evidence-item-wrapper"
              role="gridcell"
              aria-rowindex={Math.floor(index / 3) + 1}
              aria-colindex={(index % 3) + 1}
              in:fly={{ y: 20, delay: index * 50 }}
            >
              <EvidenceItem
                evidenceData={evidence}
                archivalNumber={evidence.archival_number}
                focused={index === focusedItemIndex}
                accessibilityMode={accessibilityMode}
                on:evidence-select={() => openEvidenceModal(evidence)}
                on:evidence-focus={() => focusedItemIndex = index}
              />
            </div>
          {/each}
        </div>
      {/if}

      <!-- Table view mode (accessibility alternative) -->
      {#if $galleryState.viewMode === 'table'}
        <div class="evidence-table-container">
          <table
            class="evidence-table"
            role="table"
            aria-label="Evidence archive table view"
          >
            <caption class="table-caption">
              Evidence Archive - {filteredEvidence.length} items
            </caption>
            <thead>
              <tr>
                <th scope="col">Архивный №</th>
                <th scope="col">Название</th>
                <th scope="col">Тип</th>
                <th scope="col">Фаза</th>
                <th scope="col">Дата</th>
                <th scope="col">Достоверность</th>
                <th scope="col">Действия</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredEvidence as evidence, index (evidence.id)}
                <tr
                  class="evidence-row"
                  class:focused-row={index === focusedItemIndex}
                >
                  <td class="archival-number">{evidence.archival_number}</td>
                  <td class="evidence-title">
                    <button
                      class="title-link"
                      on:click={() => openEvidenceModal(evidence)}
                      on:focus={() => focusedItemIndex = index}
                    >
                      {evidence.title}
                    </button>
                  </td>
                  <td class="evidence-type">{evidence.type.replace('_', ' ')}</td>
                  <td class="evidence-act">{evidence.act}</td>
                  <td class="evidence-date">{evidence.date}</td>
                  <td class="confidence-level">{evidence.provenance.confidence_level}</td>
                  <td class="evidence-actions">
                    <button
                      class="view-button"
                      on:click={() => openEvidenceModal(evidence)}
                      aria-label="View {evidence.title} details"
                    >
                      Просмотр
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- Empty state -->
      {#if filteredEvidence.length === 0}
        <div class="empty-state" role="status">
          <div class="archival-empty">
            <h2 class="empty-title">Архив пуст</h2>
            <p class="empty-message">Документы с заданными критериями не найдены</p>
            <button
              class="reset-filters-button"
              on:click={() => {
                selectedAct = 'all';
                selectedType = 'all';
                sortBy = 'chronological';
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Evidence modal -->
  {#if modalOpen && $activeEvidence}
    <EvidenceModal
      evidence={$activeEvidence}
      on:modal-close={closeEvidenceModal}
      on:evidence-navigate={(event) => {
        const { direction } = event.detail;
        const currentIndex = filteredEvidence.findIndex(e => e.id === $activeEvidence.id);
        let nextIndex;

        if (direction === 'next') {
          nextIndex = Math.min(currentIndex + 1, filteredEvidence.length - 1);
        } else {
          nextIndex = Math.max(currentIndex - 1, 0);
        }

        $activeEvidence = filteredEvidence[nextIndex];
        focusedItemIndex = nextIndex;
      }}
    />
  {/if}

  <!-- Accessibility support component -->
  <EvidenceAccessibility
    {accessibilityMode}
    currentItem={focusedItemIndex + 1}
    totalItems={filteredEvidence.length}
    on:accessibility-announce={(event) => {
      dispatch('accessibility-announce', event.detail);
    }}
  />
</div>

<style>
  /* Underground Academia Visual System Integration */
  .evidence-gallery-container {
    --color-sepia: #8B4513;
    --color-graphite: #2F4F4F;
    --color-amber: #FFBF00;
    --color-ivory: #FEFCF6;
    --color-archival: #6B4423;

    --font-typewriter: 'Courier New', 'Liberation Mono', monospace;
    --font-academic: 'Playfair Display', serif;
    --font-marginalia: 'Source Sans 3', sans-serif;

    background: var(--color-ivory);
    color: var(--color-archival);
    font-family: var(--font-marginalia);
    min-height: 100vh;
    padding: 2rem;
  }

  /* Gallery header with archival styling */
  .gallery-header {
    position: relative;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, var(--color-ivory) 0%, #f5f1e8 100%);
    border: 2px solid var(--color-sepia);
    border-radius: 4px;
    box-shadow:
      0 4px 6px rgba(107, 68, 35, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .archival-stamp {
    position: absolute;
    top: -10px;
    right: -10px;
    background: var(--color-amber);
    color: var(--color-archival);
    padding: 0.5rem 1rem;
    border: 2px solid var(--color-archival);
    border-radius: 50%;
    transform: rotate(15deg);
    font-family: var(--font-typewriter);
    font-size: 0.75rem;
    font-weight: bold;
    text-align: center;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .stamp-text {
    display: block;
    line-height: 1;
  }

  .stamp-number {
    display: block;
    font-size: 0.6rem;
    margin-top: 0.25rem;
    line-height: 1;
  }

  .gallery-title {
    margin: 0 0 1rem 0;
  }

  .typewriter-text {
    display: block;
    font-family: var(--font-typewriter);
    font-size: 2.5rem;
    color: var(--color-graphite);
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .academic-subtitle {
    display: block;
    font-family: var(--font-academic);
    font-size: 1.25rem;
    font-style: italic;
    color: var(--color-sepia);
  }

  .archival-metadata {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: var(--font-typewriter);
    font-size: 0.75rem;
    color: var(--color-graphite);
    opacity: 0.8;
    margin-top: 1rem;
  }

  .document-class,
  .document-date {
    padding: 0.25rem 0.5rem;
    background: rgba(139, 69, 19, 0.1);
    border-left: 3px solid var(--color-sepia);
  }

  /* Loading states with archival theming */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 4rem;
  }

  .archival-loading {
    text-align: center;
    padding: 2rem;
    border: 1px solid var(--color-sepia);
    background: var(--color-ivory);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(107, 68, 35, 0.1);
  }

  .typewriter-loading {
    font-family: var(--font-typewriter);
    font-size: 1.1rem;
    color: var(--color-graphite);
    margin-bottom: 1rem;
  }

  .loading-dots {
    animation: loading-pulse 1.5s infinite;
  }

  @keyframes loading-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  .loading-progress {
    width: 200px;
    height: 4px;
    background: rgba(139, 69, 19, 0.2);
    border-radius: 2px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  .loading-progress::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--color-sepia);
    animation: loading-slide 2s infinite;
  }

  @keyframes loading-slide {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  /* Error states */
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 4rem;
  }

  .archival-error {
    text-align: center;
    padding: 2rem;
    border: 2px solid #d32f2f;
    background: #fef5f5;
    color: #b71c1c;
    border-radius: 4px;
    max-width: 500px;
  }

  .error-title {
    font-family: var(--font-academic);
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }

  .error-message {
    font-family: var(--font-marginalia);
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }

  .retry-button {
    background: #d32f2f;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-family: var(--font-marginalia);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .retry-button:hover {
    background: #b71c1c;
  }

  /* Gallery content */
  .gallery-content {
    margin-top: 2rem;
  }

  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
  }

  .evidence-item-wrapper {
    position: relative;
  }

  /* Table view for accessibility */
  .evidence-table-container {
    overflow-x: auto;
    background: var(--color-ivory);
    border: 1px solid var(--color-sepia);
    border-radius: 4px;
    margin: 1rem 0;
  }

  .evidence-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-marginalia);
  }

  .table-caption {
    caption-side: top;
    padding: 1rem;
    font-family: var(--font-academic);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-graphite);
    background: rgba(139, 69, 19, 0.05);
  }

  .evidence-table th {
    background: var(--color-sepia);
    color: var(--color-ivory);
    padding: 0.75rem;
    text-align: left;
    font-family: var(--font-typewriter);
    font-size: 0.875rem;
    border-bottom: 2px solid var(--color-archival);
  }

  .evidence-table td {
    padding: 0.75rem;
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
    vertical-align: top;
  }

  .evidence-row:hover {
    background: rgba(139, 69, 19, 0.05);
  }

  .focused-row {
    background: rgba(255, 191, 0, 0.1) !important;
    outline: 2px solid var(--color-amber);
  }

  .title-link {
    background: none;
    border: none;
    color: var(--color-graphite);
    font-family: inherit;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    text-align: left;
  }

  .title-link:hover,
  .title-link:focus {
    color: var(--color-sepia);
    outline: 1px solid var(--color-amber);
  }

  .view-button {
    background: var(--color-sepia);
    color: var(--color-ivory);
    border: none;
    padding: 0.375rem 0.75rem;
    border-radius: 3px;
    font-family: var(--font-marginalia);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .view-button:hover,
  .view-button:focus {
    background: var(--color-archival);
    outline: 1px solid var(--color-amber);
  }

  /* Empty state */
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 4rem;
  }

  .archival-empty {
    text-align: center;
    padding: 3rem;
    border: 2px dashed var(--color-sepia);
    background: rgba(139, 69, 19, 0.02);
    border-radius: 4px;
    max-width: 500px;
  }

  .empty-title {
    font-family: var(--font-academic);
    font-size: 1.5rem;
    color: var(--color-graphite);
    margin: 0 0 1rem 0;
  }

  .empty-message {
    font-family: var(--font-marginalia);
    color: var(--color-sepia);
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }

  .reset-filters-button {
    background: var(--color-amber);
    color: var(--color-archival);
    border: 1px solid var(--color-sepia);
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-family: var(--font-marginalia);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-filters-button:hover,
  .reset-filters-button:focus {
    background: var(--color-sepia);
    color: var(--color-ivory);
    outline: 1px solid var(--color-amber);
  }

  /* Accessibility mode enhancements */
  .accessibility-mode .evidence-grid {
    grid-template-columns: 1fr;
    max-width: 800px;
    margin: 0 auto;
  }

  .accessibility-mode .evidence-item-wrapper {
    border: 2px solid var(--color-sepia);
    border-radius: 4px;
    background: var(--color-ivory);
  }

  .accessibility-mode .evidence-item-wrapper:focus-within {
    outline: 3px solid var(--color-amber);
    outline-offset: 2px;
  }

  /* Offline mode styling */
  .offline-mode {
    position: relative;
  }

  .offline-mode::before {
    content: 'ОФЛАЙН-РЕЖИМ';
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: #ff5722;
    color: white;
    padding: 0.5rem 1rem;
    font-family: var(--font-typewriter);
    font-size: 0.75rem;
    border-radius: 4px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .evidence-gallery-container {
      padding: 1rem;
    }

    .typewriter-text {
      font-size: 2rem;
    }

    .academic-subtitle {
      font-size: 1.1rem;
    }

    .evidence-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .archival-metadata {
      font-size: 0.7rem;
    }
  }

  /* Print styles for academic documentation */
  @media print {
    .evidence-gallery-container {
      background: white;
      color: black;
    }

    .evidence-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .archival-stamp {
      position: relative;
      top: 0;
      right: 0;
      transform: none;
      display: inline-block;
      margin-left: 1rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .evidence-gallery-container {
      --color-sepia: #000000;
      --color-graphite: #000000;
      --color-amber: #ffff00;
      --color-ivory: #ffffff;
      --color-archival: #000000;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>