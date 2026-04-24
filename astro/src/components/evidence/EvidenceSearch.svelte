<!--
  EvidenceSearch.svelte
  Evidence search and sorting controls with WCAG 2.1 AA compliance
  Features search input, sort options, and keyboard shortcuts
-->
<script>
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props
  export let searchTerm = '';
  export let sortOrder = 'date-desc';
  export let resultCount = 0;

  // Search state
  let searchInput;
  let isSearchFocused = false;
  let searchSuggestions = [];
  let activeSuggestionIndex = -1;
  let showSuggestions = false;

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First', icon: '📅↓' },
    { value: 'date-asc', label: 'Oldest First', icon: '📅↑' },
    { value: 'significance', label: 'By Significance', icon: '⭐' },
    { value: 'title', label: 'By Title (A-Z)', icon: '🔤' },
    { value: 'cultural-impact', label: 'By Cultural Impact', icon: '🌟' }
  ];

  // Search suggestions (could be populated dynamically)
  const searchSuggestionsData = [
    'Oxxxymiron',
    'song release',
    'YouTube',
    'music video',
    'cultural impact',
    'social media',
    'legal documents',
    'academic sources',
    'timeline:2021-11-08',
    'scene:scene-1',
    'type:media',
    'type:legal',
    'significance:critical',
    'significance:primary'
  ];

  function handleSearchInput(event) {
    const value = event.target.value;
    searchTerm = value;

    // Update search suggestions
    if (value.trim().length > 1) {
      searchSuggestions = searchSuggestionsData
        .filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      showSuggestions = searchSuggestions.length > 0;
      activeSuggestionIndex = -1;
    } else {
      showSuggestions = false;
      searchSuggestions = [];
    }

    // Dispatch search event
    dispatch('search', { query: value });
  }

  function handleSearchKeydown(event) {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        activeSuggestionIndex = Math.min(
          activeSuggestionIndex + 1,
          searchSuggestions.length - 1
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, -1);
        break;

      case 'Enter':
        if (activeSuggestionIndex >= 0) {
          event.preventDefault();
          selectSuggestion(searchSuggestions[activeSuggestionIndex]);
        }
        break;

      case 'Escape':
        showSuggestions = false;
        activeSuggestionIndex = -1;
        break;

      case 'Tab':
        showSuggestions = false;
        break;
    }
  }

  function selectSuggestion(suggestion) {
    searchTerm = suggestion;
    showSuggestions = false;
    activeSuggestionIndex = -1;

    // Update the input value and focus
    if (searchInput) {
      searchInput.value = suggestion;
      searchInput.focus();
    }

    dispatch('search', { query: suggestion });
  }

  function clearSearch() {
    searchTerm = '';
    showSuggestions = false;
    searchSuggestions = [];
    activeSuggestionIndex = -1;

    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }

    dispatch('search', { query: '' });
  }

  function handleSortChange(event) {
    sortOrder = event.target.value;
    dispatch('sort', { order: sortOrder });
  }

  function handleSearchFocus() {
    isSearchFocused = true;

    // Show recent suggestions when focusing empty search
    if (!searchTerm.trim()) {
      searchSuggestions = ['type:media', 'significance:critical', 'song release'].slice(0, 3);
      showSuggestions = true;
    }
  }

  function handleSearchBlur(event) {
    isSearchFocused = false;

    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!document.querySelector('.search-suggestions:hover')) {
        showSuggestions = false;
      }
    }, 200);
  }

  function getSearchPlaceholder() {
    const placeholders = [
      'Search evidence...',
      'Try "song release" or "type:media"',
      'Search by title, source, or tag',
      'Use "timeline:2021-11-08" for specific dates'
    ];
    return placeholders[0]; // Could rotate or randomize
  }

  onMount(() => {
    // Focus search input on Ctrl/Cmd + F
    function handleGlobalKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        if (searchInput) {
          searchInput.focus();
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown);
    };
  });

  // Reactive statements
  $: if (searchInput && searchTerm === '') {
    searchInput.value = '';
  }
</script>

<!-- Evidence Search Container -->
<div class="evidence-search">
  <!-- Search Input Section -->
  <div class="search-section">
    <div class="search-input-container">
      <div class="search-input-wrapper" class:search-input-wrapper--focused={isSearchFocused}>
        <label for="evidence-search-input" class="sr-only">
          Search evidence by title, source, or tags
        </label>

        <div class="search-icon" aria-hidden="true">🔍</div>

        <input
          bind:this={searchInput}
          type="text"
          id="evidence-search-input"
          class="evidence-search__input"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          on:input={handleSearchInput}
          on:keydown={handleSearchKeydown}
          on:focus={handleSearchFocus}
          on:blur={handleSearchBlur}
          autocomplete="off"
          spellcheck="false"
          aria-describedby="search-help search-results-count"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-owns={showSuggestions ? 'search-suggestions' : undefined}
        />

        {#if searchTerm}
          <button
            class="clear-search-btn"
            on:click={clearSearch}
            aria-label="Clear search"
            title="Clear search"
          >
            <span aria-hidden="true">✕</span>
          </button>
        {/if}
      </div>

      <!-- Search Suggestions -->
      {#if showSuggestions && searchSuggestions.length > 0}
        <div
          class="search-suggestions"
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          {#each searchSuggestions as suggestion, index}
            <button
              class="suggestion-item"
              class:suggestion-item--active={index === activeSuggestionIndex}
              role="option"
              aria-selected={index === activeSuggestionIndex}
              on:click={() => selectSuggestion(suggestion)}
              on:mouseenter={() => activeSuggestionIndex = index}
            >
              <span class="suggestion-text">{suggestion}</span>
              {#if suggestion.startsWith('type:')}
                <span class="suggestion-type" aria-hidden="true">Filter</span>
              {:else if suggestion.startsWith('timeline:') || suggestion.startsWith('scene:')}
                <span class="suggestion-type" aria-hidden="true">Navigate</span>
              {:else}
                <span class="suggestion-type" aria-hidden="true">Search</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Search Help -->
    <div class="search-help" id="search-help">
      <details class="search-help-details">
        <summary class="search-help-toggle">Search Tips</summary>
        <div class="search-help-content">
          <ul class="search-tips">
            <li><strong>Basic:</strong> Type any word or phrase</li>
            <li><strong>Filter by type:</strong> <code>type:media</code>, <code>type:legal</code></li>
            <li><strong>Filter by significance:</strong> <code>significance:critical</code></li>
            <li><strong>Navigate to timeline:</strong> <code>timeline:2021-11-08</code></li>
            <li><strong>Navigate to scene:</strong> <code>scene:scene-1</code></li>
            <li><strong>Keyboard:</strong> <kbd>Ctrl/Cmd + F</kbd> to focus search</li>
          </ul>
        </div>
      </details>
    </div>
  </div>

  <!-- Sort and Results Section -->
  <div class="sort-section">
    <!-- Results Count -->
    <div class="results-count" id="search-results-count" aria-live="polite">
      {#if resultCount === 0}
        No evidence found
      {:else if resultCount === 1}
        1 evidence item
      {:else}
        {resultCount.toLocaleString()} evidence items
      {/if}
      {#if searchTerm.trim()}
        for "{searchTerm}"
      {/if}
    </div>

    <!-- Sort Controls -->
    <div class="sort-controls">
      <label for="evidence-sort-select" class="sort-label">
        Sort by:
      </label>
      <div class="sort-select-wrapper">
        <select
          id="evidence-sort-select"
          class="evidence-sort__select"
          value={sortOrder}
          on:change={handleSortChange}
          aria-describedby="sort-help"
        >
          {#each sortOptions as option}
            <option value={option.value}>
              {option.label}
            </option>
          {/each}
        </select>

        <div class="sort-icon" aria-hidden="true">
          {sortOptions.find(opt => opt.value === sortOrder)?.icon || '📋'}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Sort Help (hidden description) -->
<div id="sort-help" class="sr-only">
  Change how evidence items are ordered in the gallery
</div>

<style>
  /* Evidence Search Container */
  .evidence-search {
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    flex: 1;
  }

  /* Search Section */
  .search-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .search-input-container {
    position: relative;
    flex: 1;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--color-concrete-light);
    border: 2px solid rgba(26, 54, 93, 0.2);
    border-radius: var(--space-sm);
    transition: all 0.2s ease;
  }

  .search-input-wrapper--focused {
    border-color: var(--color-maritime-deep);
    box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
  }

  .search-icon {
    padding: 0 var(--space-sm);
    color: rgba(45, 55, 72, 0.6);
    font-size: 1rem;
    pointer-events: none;
  }

  .evidence-search__input {
    flex: 1;
    padding: var(--space-sm) var(--space-sm) var(--space-sm) 0;
    font-family: var(--font-body);
    font-size: 1rem;
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    outline: none;
  }

  .evidence-search__input::placeholder {
    color: rgba(45, 55, 72, 0.5);
    font-style: italic;
  }

  .clear-search-btn {
    padding: var(--space-xs) var(--space-sm);
    background: transparent;
    border: none;
    color: rgba(45, 55, 72, 0.6);
    cursor: pointer;
    border-radius: var(--space-xs);
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .clear-search-btn:hover,
  .clear-search-btn:focus {
    color: #e53e3e;
    background-color: rgba(229, 62, 62, 0.1);
  }

  .clear-search-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 1px;
  }

  /* Search Suggestions */
  .search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: var(--color-concrete-light);
    border: 1px solid rgba(26, 54, 93, 0.2);
    border-top: none;
    border-radius: 0 0 var(--space-sm) var(--space-sm);
    box-shadow: 0 4px 12px rgba(26, 54, 93, 0.15);
    max-height: 200px;
    overflow-y: auto;
  }

  .suggestion-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: var(--font-body);
    font-size: 0.875rem;
  }

  .suggestion-item:hover,
  .suggestion-item--active {
    background-color: rgba(26, 54, 93, 0.1);
  }

  .suggestion-item:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: -2px;
    background-color: rgba(26, 54, 93, 0.1);
  }

  .suggestion-text {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  .suggestion-type {
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(45, 55, 72, 0.6);
    padding: var(--space-xs) var(--space-sm);
    background-color: rgba(26, 54, 93, 0.1);
    border-radius: var(--space-xs);
  }

  /* Search Help */
  .search-help {
    font-size: 0.875rem;
  }

  .search-help-details {
    background-color: rgba(26, 54, 93, 0.05);
    border: 1px solid rgba(26, 54, 93, 0.1);
    border-radius: var(--space-xs);
  }

  .search-help-toggle {
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    font-weight: 600;
    color: var(--color-maritime-deep);
    list-style: none;
  }

  .search-help-toggle::-webkit-details-marker {
    display: none;
  }

  .search-help-toggle::before {
    content: "💡";
    margin-right: var(--space-xs);
  }

  .search-help-toggle:hover {
    background-color: rgba(26, 54, 93, 0.05);
  }

  .search-help-toggle:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 1px;
  }

  .search-help-content {
    padding: 0 var(--space-md) var(--space-md);
    border-top: 1px solid rgba(26, 54, 93, 0.1);
  }

  .search-tips {
    list-style: none;
    padding: 0;
    margin: var(--space-sm) 0 0;
    display: grid;
    gap: var(--space-xs);
  }

  .search-tips li {
    color: rgba(45, 55, 72, 0.8);
    line-height: 1.4;
  }

  .search-tips strong {
    color: var(--color-maritime-deep);
    font-weight: 600;
  }

  .search-tips code {
    background-color: rgba(26, 54, 93, 0.1);
    color: var(--color-maritime-deep);
    padding: 0.125rem var(--space-xs);
    border-radius: var(--space-xs);
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
  }

  .search-tips kbd {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
    padding: 0.125rem var(--space-xs);
    border-radius: var(--space-xs);
    font-family: var(--font-mono, monospace);
    font-size: 0.625rem;
    font-weight: 600;
  }

  /* Sort and Results Section */
  .sort-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
  }

  .results-count {
    font-size: 0.875rem;
    color: rgba(45, 55, 72, 0.8);
    font-weight: 500;
  }

  .sort-controls {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .sort-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-maritime-deep);
  }

  .sort-select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .evidence-sort__select {
    padding: var(--space-xs) var(--space-lg) var(--space-xs) var(--space-sm);
    border: 1px solid rgba(26, 54, 93, 0.3);
    border-radius: var(--space-xs);
    background-color: var(--color-concrete-light);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: 0.875rem;
    cursor: pointer;
    appearance: none;
    min-width: 160px;
  }

  .evidence-sort__select:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 1px;
    border-color: var(--color-maritime-deep);
  }

  .sort-icon {
    position: absolute;
    right: var(--space-sm);
    pointer-events: none;
    font-size: 0.875rem;
    color: rgba(45, 55, 72, 0.6);
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
  @media (max-width: 64rem) {
    .sort-section {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-sm);
      text-align: center;
    }

    .sort-controls {
      justify-content: center;
    }
  }

  @media (max-width: 48rem) {
    .evidence-search {
      gap: var(--space-sm);
    }

    .search-input-wrapper {
      border-radius: var(--space-xs);
    }

    .search-suggestions {
      border-radius: 0 0 var(--space-xs) var(--space-xs);
    }

    .search-tips {
      grid-template-columns: 1fr;
    }

    .evidence-sort__select {
      min-width: auto;
      width: 100%;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .search-input-wrapper,
    .evidence-sort__select,
    .search-help-details {
      border-width: 2px;
    }

    .suggestion-item:focus,
    .clear-search-btn:focus,
    .search-help-toggle:focus,
    .evidence-sort__select:focus {
      outline-width: 3px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .search-input-wrapper,
    .clear-search-btn,
    .suggestion-item {
      transition: none;
    }
  }

  /* Print Styles */
  @media print {
    .search-help,
    .sort-controls {
      display: none;
    }

    .results-count {
      color: #000;
    }
  }
</style>