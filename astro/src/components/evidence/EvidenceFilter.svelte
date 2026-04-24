<!--
  EvidenceFilter.svelte
  Evidence filtering controls with WCAG 2.1 AA compliance
  Provides type, significance, and date range filtering
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props
  export let selectedTypes = [];
  export let significanceFilter = 'all';
  export let dateRange = { start: null, end: null };
  export let availableTypes = [];

  // Filter options
  const significanceOptions = [
    { value: 'all', label: 'All Significance Levels' },
    { value: 'critical', label: 'Critical Evidence' },
    { value: 'primary', label: 'Primary Evidence' },
    { value: 'supporting', label: 'Supporting Evidence' },
    { value: 'contextual', label: 'Contextual Evidence' }
  ];

  const typeLabels = {
    media: 'Media Evidence',
    legal: 'Legal Documents',
    social: 'Social Media',
    academic: 'Academic Sources',
    visual: 'Visual Evidence',
    document: 'Documents'
  };

  // State
  let isFilterExpanded = false;
  let activeFiltersCount = 0;

  // Toggle functions
  function toggleTypeFilter(type) {
    if (selectedTypes.includes(type)) {
      selectedTypes = selectedTypes.filter(t => t !== type);
    } else {
      selectedTypes = [...selectedTypes, type];
    }
    updateActiveFiltersCount();
  }

  function clearAllFilters() {
    selectedTypes = [];
    significanceFilter = 'all';
    dateRange = { start: null, end: null };
    updateActiveFiltersCount();

    // Announce filter clear
    dispatch('filtersChanged', {
      type: 'clear',
      message: 'All filters cleared'
    });
  }

  function clearTypeFilter(type) {
    selectedTypes = selectedTypes.filter(t => t !== type);
    updateActiveFiltersCount();
  }

  function updateActiveFiltersCount() {
    activeFiltersCount =
      selectedTypes.length +
      (significanceFilter !== 'all' ? 1 : 0) +
      (dateRange.start || dateRange.end ? 1 : 0);

    // Announce filter changes
    if (activeFiltersCount === 0) {
      dispatch('filtersChanged', {
        type: 'clear',
        message: 'No active filters'
      });
    } else {
      dispatch('filtersChanged', {
        type: 'apply',
        message: `${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} active`
      });
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isFilterExpanded) {
      isFilterExpanded = false;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-CA'); // YYYY-MM-DD format
  }

  function handleDateRangeChange() {
    updateActiveFiltersCount();

    dispatch('filtersChanged', {
      type: 'dateRange',
      message: `Date range ${dateRange.start || dateRange.end ? 'applied' : 'cleared'}`
    });
  }

  // Reactive statements
  $: if (selectedTypes || significanceFilter) {
    updateActiveFiltersCount();
  }

  $: hasActiveFilters = activeFiltersCount > 0;
</script>

<!-- Evidence Filter Container -->
<div class="evidence-filter" on:keydown={handleKeydown}>
  <!-- Filter Toggle -->
  <div class="filter-header">
    <button
      class="filter-toggle"
      class:filter-toggle--active={isFilterExpanded}
      aria-expanded={isFilterExpanded}
      aria-controls="filter-controls"
      on:click={() => isFilterExpanded = !isFilterExpanded}
    >
      <span class="filter-toggle-text">
        Filters
        {#if activeFiltersCount > 0}
          <span class="active-filters-count" aria-label="{activeFiltersCount} active filters">
            ({activeFiltersCount})
          </span>
        {/if}
      </span>
      <span class="filter-toggle-icon" aria-hidden="true">
        {isFilterExpanded ? '▲' : '▼'}
      </span>
    </button>

    {#if hasActiveFilters}
      <button
        class="clear-all-btn"
        on:click={clearAllFilters}
        aria-label="Clear all active filters"
      >
        <span aria-hidden="true">✕</span>
        Clear All
      </button>
    {/if}
  </div>

  <!-- Active Filters Summary -->
  {#if hasActiveFilters && !isFilterExpanded}
    <div class="active-filters-summary" role="region" aria-label="Active filters">
      <span class="summary-label">Active filters:</span>
      <div class="active-filters">
        {#each selectedTypes as type}
          <button
            class="active-filter-tag"
            on:click={() => clearTypeFilter(type)}
            aria-label="Remove {typeLabels[type] || type} filter"
          >
            {typeLabels[type] || type}
            <span class="remove-icon" aria-hidden="true">✕</span>
          </button>
        {/each}

        {#if significanceFilter !== 'all'}
          <button
            class="active-filter-tag"
            on:click={() => { significanceFilter = 'all'; updateActiveFiltersCount(); }}
            aria-label="Remove significance filter"
          >
            {significanceOptions.find(opt => opt.value === significanceFilter)?.label || significanceFilter}
            <span class="remove-icon" aria-hidden="true">✕</span>
          </button>
        {/if}

        {#if dateRange.start || dateRange.end}
          <button
            class="active-filter-tag"
            on:click={() => { dateRange = { start: null, end: null }; handleDateRangeChange(); }}
            aria-label="Remove date range filter"
          >
            Date Range
            <span class="remove-icon" aria-hidden="true">✕</span>
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Filter Controls -->
  {#if isFilterExpanded}
    <div class="filter-controls" id="filter-controls" role="region" aria-label="Filter controls">
      <!-- Evidence Type Filter -->
      <fieldset class="filter-section">
        <legend class="filter-section-title">Evidence Types</legend>
        <div class="filter-options">
          {#each availableTypes as type}
            <label class="filter-option">
              <input
                type="checkbox"
                bind:group={selectedTypes}
                value={type}
                class="filter-checkbox sr-only"
              />
              <span class="checkbox-custom" aria-hidden="true"></span>
              <span class="filter-option-text">
                {typeLabels[type] || type}
              </span>
            </label>
          {/each}
        </div>
      </fieldset>

      <!-- Significance Filter -->
      <fieldset class="filter-section">
        <legend class="filter-section-title">Significance Level</legend>
        <div class="filter-options">
          {#each significanceOptions as option}
            <label class="filter-option">
              <input
                type="radio"
                bind:group={significanceFilter}
                value={option.value}
                class="filter-radio sr-only"
              />
              <span class="radio-custom" aria-hidden="true"></span>
              <span class="filter-option-text">
                {option.label}
              </span>
            </label>
          {/each}
        </div>
      </fieldset>

      <!-- Date Range Filter -->
      <fieldset class="filter-section">
        <legend class="filter-section-title">Date Range</legend>
        <div class="date-range-controls">
          <div class="date-input-group">
            <label for="start-date" class="date-label">From:</label>
            <input
              type="date"
              id="start-date"
              bind:value={dateRange.start}
              on:change={handleDateRangeChange}
              class="date-input"
              max={dateRange.end || undefined}
            />
          </div>

          <div class="date-input-group">
            <label for="end-date" class="date-label">To:</label>
            <input
              type="date"
              id="end-date"
              bind:value={dateRange.end}
              on:change={handleDateRangeChange}
              class="date-input"
              min={dateRange.start || undefined}
            />
          </div>

          {#if dateRange.start || dateRange.end}
            <button
              class="clear-date-btn"
              on:click={() => { dateRange = { start: null, end: null }; handleDateRangeChange(); }}
              aria-label="Clear date range"
            >
              <span aria-hidden="true">✕</span>
              Clear
            </button>
          {/if}
        </div>

        <!-- Date Range Presets -->
        <div class="date-presets">
          <button
            class="preset-btn"
            on:click={() => {
              const now = new Date();
              const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              dateRange = { start: formatDate(lastWeek), end: formatDate(now) };
              handleDateRangeChange();
            }}
          >
            Last Week
          </button>
          <button
            class="preset-btn"
            on:click={() => {
              const now = new Date();
              const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
              dateRange = { start: formatDate(lastMonth), end: formatDate(now) };
              handleDateRangeChange();
            }}
          >
            Last Month
          </button>
          <button
            class="preset-btn"
            on:click={() => {
              const now = new Date();
              const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
              dateRange = { start: formatDate(lastYear), end: formatDate(now) };
              handleDateRangeChange();
            }}
          >
            Last Year
          </button>
        </div>
      </fieldset>
    </div>
  {/if}
</div>

<style>
  /* Evidence Filter Container */
  .evidence-filter {
    font-family: var(--font-body);
    background-color: var(--color-concrete-light);
    border: 1px solid rgba(26, 54, 93, 0.1);
    border-radius: var(--space-sm);
    overflow: hidden;
  }

  /* Filter Header */
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    background-color: rgba(26, 54, 93, 0.05);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
  }

  .filter-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: var(--space-xs);
    cursor: pointer;
    color: var(--color-maritime-deep);
    transition: all 0.2s ease;
  }

  .filter-toggle:hover,
  .filter-toggle:focus {
    background-color: rgba(26, 54, 93, 0.1);
    border-color: var(--color-maritime-deep);
  }

  .filter-toggle:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  .filter-toggle--active {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .filter-toggle-text {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .active-filters-count {
    background-color: var(--color-amber-warm);
    color: var(--color-maritime-deep);
    padding: 0.125rem var(--space-xs);
    border-radius: var(--space-xs);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .filter-toggle--active .active-filters-count {
    background-color: var(--color-text-inverse);
    color: var(--color-maritime-deep);
  }

  .filter-toggle-icon {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  .clear-all-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    background-color: transparent;
    border: 1px solid rgba(229, 62, 62, 0.5);
    border-radius: var(--space-xs);
    color: #e53e3e;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-all-btn:hover,
  .clear-all-btn:focus {
    background-color: #e53e3e;
    color: var(--color-text-inverse);
  }

  .clear-all-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  /* Active Filters Summary */
  .active-filters-summary {
    padding: var(--space-md);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
  }

  .summary-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(45, 55, 72, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-xs);
    display: block;
  }

  .active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .active-filter-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
    border: none;
    border-radius: var(--space-xs);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .active-filter-tag:hover,
  .active-filter-tag:focus {
    background-color: var(--color-amber-warm);
    color: var(--color-maritime-deep);
  }

  .active-filter-tag:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  .remove-icon {
    font-size: 0.625rem;
    font-weight: bold;
  }

  /* Filter Controls */
  .filter-controls {
    padding: var(--space-md);
  }

  .filter-section {
    border: none;
    margin-bottom: var(--space-lg);
    padding: 0;
  }

  .filter-section:last-child {
    margin-bottom: 0;
  }

  .filter-section-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-maritime-deep);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
  }

  /* Filter Options */
  .filter-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-sm);
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    border: 1px solid transparent;
    border-radius: var(--space-xs);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-option:hover {
    background-color: rgba(26, 54, 93, 0.05);
    border-color: rgba(26, 54, 93, 0.2);
  }

  .filter-option:has(input:checked) {
    background-color: rgba(26, 54, 93, 0.1);
    border-color: var(--color-maritime-deep);
  }

  .filter-option:has(input:focus) {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 1px;
  }

  .checkbox-custom,
  .radio-custom {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--color-maritime-deep);
    background-color: var(--color-concrete-light);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .checkbox-custom {
    border-radius: var(--space-xs);
  }

  .radio-custom {
    border-radius: 50%;
  }

  .filter-option:has(input:checked) .checkbox-custom,
  .filter-option:has(input:checked) .radio-custom {
    background-color: var(--color-maritime-deep);
    border-color: var(--color-maritime-deep);
  }

  .filter-option:has(input:checked) .checkbox-custom::after {
    content: '✓';
    display: block;
    text-align: center;
    color: var(--color-text-inverse);
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 1;
  }

  .filter-option:has(input:checked) .radio-custom::after {
    content: '';
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: var(--color-text-inverse);
    margin: 0.125rem;
  }

  .filter-option-text {
    font-size: 0.875rem;
    color: var(--color-text-primary);
    font-weight: 500;
  }

  /* Date Range Controls */
  .date-range-controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: end;
    margin-bottom: var(--space-md);
  }

  .date-input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
    min-width: 140px;
  }

  .date-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-maritime-deep);
  }

  .date-input {
    padding: var(--space-sm);
    border: 1px solid rgba(26, 54, 93, 0.3);
    border-radius: var(--space-xs);
    font-family: var(--font-body);
    font-size: 0.875rem;
    background-color: var(--color-concrete-light);
    color: var(--color-text-primary);
  }

  .date-input:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 1px;
    border-color: var(--color-maritime-deep);
  }

  .clear-date-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    background-color: transparent;
    border: 1px solid rgba(229, 62, 62, 0.5);
    border-radius: var(--space-xs);
    color: #e53e3e;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-end;
  }

  .clear-date-btn:hover,
  .clear-date-btn:focus {
    background-color: #e53e3e;
    color: var(--color-text-inverse);
  }

  .clear-date-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  /* Date Presets */
  .date-presets {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .preset-btn {
    padding: var(--space-xs) var(--space-sm);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    background-color: transparent;
    border: 1px solid var(--color-maritime-deep);
    border-radius: var(--space-xs);
    color: var(--color-maritime-deep);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .preset-btn:hover,
  .preset-btn:focus {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
  }

  .preset-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
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
    .filter-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-sm);
    }

    .filter-options {
      grid-template-columns: 1fr;
    }

    .date-range-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .date-input-group {
      min-width: auto;
    }

    .clear-date-btn {
      align-self: stretch;
      justify-content: center;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .filter-toggle,
    .clear-all-btn,
    .active-filter-tag,
    .filter-option,
    .date-input,
    .preset-btn {
      border-width: 2px;
    }

    .checkbox-custom,
    .radio-custom {
      border-width: 3px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .filter-toggle,
    .clear-all-btn,
    .active-filter-tag,
    .filter-option,
    .checkbox-custom,
    .radio-custom,
    .date-input,
    .preset-btn,
    .filter-toggle-icon {
      transition: none;
    }
  }
</style>