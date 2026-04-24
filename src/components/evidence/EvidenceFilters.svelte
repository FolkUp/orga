<!--
  Evidence Filters Component - ORGA-066 Implementation
  Filtering controls with Underground Academia styling

  @component EvidenceFilters
  @accessibility WCAG 2.1 AA compliant with keyboard navigation
  @styling Underground Academia archival interface aesthetic
  @performance Optimized filter interactions
-->

<script>
  import { createEventDispatcher } from 'svelte';
  import { evidenceGalleryStructure } from '../../data/evidenceGalleryData.js';

  // Component props
  export let selectedAct = 'all';
  export let selectedType = 'all';
  export let sortBy = 'chronological';
  export let viewMode = 'gallery';
  export let itemCount = 0;

  // Component state
  const dispatch = createEventDispatcher();

  // Filter options
  const actOptions = [
    { value: 'all', label: 'Все фазы', count: evidenceGalleryStructure.total_evidence_count },
    {
      value: 'prophecy',
      label: 'Акт I — Пророчество',
      period: 'Ноябрь 2021',
      count: evidenceGalleryStructure.acts.prophecy.evidence_count
    },
    {
      value: 'validation',
      label: 'Акт II — Валидация',
      period: 'Февраль 2022',
      count: evidenceGalleryStructure.acts.validation.evidence_count
    },
    {
      value: 'recognition',
      label: 'Акт III — Признание',
      period: 'Октябрь 2022',
      count: evidenceGalleryStructure.acts.recognition.evidence_count
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'Все типы', icon: '📋' },
    { value: 'primary_artifact', label: 'Первичные артефакты', icon: '📜' },
    { value: 'reception_record', label: 'Записи рецепции', icon: '📊' },
    { value: 'contextual_document', label: 'Контекстные документы', icon: '📄' },
    { value: 'analytical_synthesis', label: 'Аналитические синтезы', icon: '🔬' },
    { value: 'temporal_anchor', label: 'Временные привязки', icon: '⚓' }
  ];

  const sortOptions = [
    { value: 'chronological', label: 'По хронологии', icon: '📅' },
    { value: 'significance', label: 'По значимости', icon: '⭐' },
    { value: 'type', label: 'По типу', icon: '🏷️' },
    { value: 'act', label: 'По фазам', icon: '🎭' }
  ];

  const viewOptions = [
    { value: 'gallery', label: 'Галерея', icon: '🖼️', description: 'Визуальные карточки' },
    { value: 'table', label: 'Таблица', icon: '📋', description: 'Табличный вид для доступности' },
    { value: 'timeline', label: 'Линия времени', icon: '📈', description: 'Хронологическая линия' }
  ];

  // Handle filter changes
  function handleActChange(event) {
    const newValue = event.target.value;
    selectedAct = newValue;
    dispatch('filter-change', { filter: 'act', value: newValue });
  }

  function handleTypeChange(event) {
    const newValue = event.target.value;
    selectedType = newValue;
    dispatch('filter-change', { filter: 'type', value: newValue });
  }

  function handleSortChange(event) {
    const newValue = event.target.value;
    sortBy = newValue;
    dispatch('filter-change', { filter: 'sort', value: newValue });
  }

  function handleViewModeChange(event) {
    const newValue = event.target.value;
    viewMode = newValue;
    dispatch('filter-change', { filter: 'view', value: newValue });
  }

  // Reset all filters
  function resetFilters() {
    selectedAct = 'all';
    selectedType = 'all';
    sortBy = 'chronological';
    viewMode = 'gallery';

    dispatch('filter-change', { filter: 'reset', value: null });
  }

  // Quick filter shortcuts
  function quickFilter(act, type = 'all') {
    selectedAct = act;
    selectedType = type;

    dispatch('filter-change', { filter: 'quick', value: { act, type } });
  }

  // Get active filter count
  function getActiveFilterCount() {
    let count = 0;
    if (selectedAct !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (sortBy !== 'chronological') count++;
    if (viewMode !== 'gallery') count++;
    return count;
  }

  $: activeFilterCount = getActiveFilterCount();
</script>

<!-- Filters container -->
<section
  class="evidence-filters"
  role="region"
  aria-label="Фильтры архива доказательств"
>
  <!-- Filters header -->
  <header class="filters-header">
    <div class="header-content">
      <h2 class="filters-title">
        <span class="title-icon" aria-hidden="true">🔍</span>
        <span class="title-text">Фильтры архива</span>
      </h2>

      <div class="filters-metadata">
        <span class="item-count">{itemCount} документов</span>
        {#if activeFilterCount > 0}
          <span class="active-filters-count">
            {activeFilterCount} активных фильтров
          </span>
        {/if}
      </div>
    </div>

    <div class="header-actions">
      {#if activeFilterCount > 0}
        <button
          class="reset-button"
          on:click={resetFilters}
          aria-label="Сбросить все фильтры"
          title="Сбросить фильтры"
        >
          <span aria-hidden="true">↻</span>
          Сбросить
        </button>
      {/if}
    </div>
  </header>

  <!-- Main filters grid -->
  <div class="filters-grid">
    <!-- Act phase filter -->
    <div class="filter-group act-filter">
      <label class="filter-label" for="act-select">
        <span class="label-icon" aria-hidden="true">🎭</span>
        <span class="label-text">Фаза культурной эволюции</span>
      </label>

      <select
        id="act-select"
        class="filter-select"
        bind:value={selectedAct}
        on:change={handleActChange}
        aria-describedby="act-help"
      >
        {#each actOptions as option}
          <option value={option.value}>
            {option.label}
            {option.period ? `(${option.period})` : ''}
            — {option.count} док.
          </option>
        {/each}
      </select>

      <div id="act-help" class="filter-help">
        Фильтрация по трем фазам культурного цикла: Пророчество → Валидация → Признание
      </div>
    </div>

    <!-- Evidence type filter -->
    <div class="filter-group type-filter">
      <label class="filter-label" for="type-select">
        <span class="label-icon" aria-hidden="true">📋</span>
        <span class="label-text">Тип архивного документа</span>
      </label>

      <select
        id="type-select"
        class="filter-select"
        bind:value={selectedType}
        on:change={handleTypeChange}
        aria-describedby="type-help"
      >
        {#each typeOptions as option}
          <option value={option.value}>
            {option.icon} {option.label}
          </option>
        {/each}
      </select>

      <div id="type-help" class="filter-help">
        Классификация документов по типу академического значения
      </div>
    </div>

    <!-- Sort order filter -->
    <div class="filter-group sort-filter">
      <label class="filter-label" for="sort-select">
        <span class="label-icon" aria-hidden="true">🔄</span>
        <span class="label-text">Порядок сортировки</span>
      </label>

      <select
        id="sort-select"
        class="filter-select"
        bind:value={sortBy}
        on:change={handleSortChange}
        aria-describedby="sort-help"
      >
        {#each sortOptions as option}
          <option value={option.value}>
            {option.icon} {option.label}
          </option>
        {/each}
      </select>

      <div id="sort-help" class="filter-help">
        Критерий упорядочивания архивных документов
      </div>
    </div>

    <!-- View mode filter -->
    <div class="filter-group view-filter">
      <label class="filter-label" for="view-select">
        <span class="label-icon" aria-hidden="true">👁️</span>
        <span class="label-text">Режим просмотра</span>
      </label>

      <select
        id="view-select"
        class="filter-select"
        bind:value={viewMode}
        on:change={handleViewModeChange}
        aria-describedby="view-help"
      >
        {#each viewOptions as option}
          <option value={option.value}>
            {option.icon} {option.label} — {option.description}
          </option>
        {/each}
      </select>

      <div id="view-help" class="filter-help">
        Способ представления архивных документов
      </div>
    </div>
  </div>

  <!-- Quick filter shortcuts -->
  <div class="quick-filters">
    <h3 class="quick-filters-title">Быстрые фильтры:</h3>
    <div class="quick-filters-grid">
      <button
        class="quick-filter-button"
        class:active={selectedAct === 'prophecy' && selectedType === 'primary_artifact'}
        on:click={() => quickFilter('prophecy', 'primary_artifact')}
        aria-label="Первичные артефакты фазы пророчества"
      >
        <span class="quick-icon" aria-hidden="true">📜</span>
        <span class="quick-label">Пророческие артефакты</span>
      </button>

      <button
        class="quick-filter-button"
        class:active={selectedAct === 'validation' && selectedType === 'temporal_anchor'}
        on:click={() => quickFilter('validation', 'temporal_anchor')}
        aria-label="Временные привязки валидации"
      >
        <span class="quick-icon" aria-hidden="true">⚓</span>
        <span class="quick-label">Точки валидации</span>
      </button>

      <button
        class="quick-filter-button"
        class:active={selectedAct === 'recognition' && selectedType === 'analytical_synthesis'}
        on:click={() => quickFilter('recognition', 'analytical_synthesis')}
        aria-label="Аналитические синтезы признания"
      >
        <span class="quick-icon" aria-hidden="true">🔬</span>
        <span class="quick-label">Анализ признания</span>
      </button>

      <button
        class="quick-filter-button"
        class:active={selectedType === 'reception_record'}
        on:click={() => quickFilter('all', 'reception_record')}
        aria-label="Все записи рецепции"
      >
        <span class="quick-icon" aria-hidden="true">📊</span>
        <span class="quick-label">Записи рецепции</span>
      </button>
    </div>
  </div>

  <!-- Filter summary -->
  <div class="filter-summary">
    <div class="summary-content">
      <span class="summary-label">Активные критерии:</span>
      <div class="summary-tags">
        {#if selectedAct !== 'all'}
          <span class="summary-tag act-tag">
            {actOptions.find(opt => opt.value === selectedAct)?.label || selectedAct}
          </span>
        {/if}
        {#if selectedType !== 'all'}
          <span class="summary-tag type-tag">
            {typeOptions.find(opt => opt.value === selectedType)?.label || selectedType}
          </span>
        {/if}
        {#if sortBy !== 'chronological'}
          <span class="summary-tag sort-tag">
            {sortOptions.find(opt => opt.value === sortBy)?.label || sortBy}
          </span>
        {/if}
        {#if viewMode !== 'gallery'}
          <span class="summary-tag view-tag">
            {viewOptions.find(opt => opt.value === viewMode)?.label || viewMode}
          </span>
        {/if}

        {#if activeFilterCount === 0}
          <span class="summary-tag default-tag">Все документы</span>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  /* Evidence filters container */
  .evidence-filters {
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.03) 0%, rgba(139, 69, 19, 0.06) 100%);
    border: 2px solid rgba(139, 69, 19, 0.2);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    font-family: 'Source Sans 3', sans-serif;
  }

  /* Filters header */
  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  }

  .header-content {
    flex-grow: 1;
  }

  .filters-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2F4F4F;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .title-icon {
    font-size: 1.25rem;
  }

  .filters-metadata {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .item-count {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #6B4423;
    background: rgba(139, 69, 19, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    border: 1px solid rgba(139, 69, 19, 0.3);
  }

  .active-filters-count {
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #FF9800;
    background: rgba(255, 152, 0, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .reset-button {
    background: #D32F2F;
    color: #FEFCF6;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .reset-button:hover,
  .reset-button:focus {
    background: #B71C1C;
    outline: 1px solid #FFBF00;
    transform: scale(1.02);
  }

  /* Filters grid */
  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-label {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: #2F4F4F;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .label-icon {
    font-size: 1.125rem;
  }

  .filter-select {
    background: #FEFCF6;
    border: 2px solid rgba(139, 69, 19, 0.3);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.9rem;
    color: #2F4F4F;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }

  .filter-select:hover {
    border-color: rgba(139, 69, 19, 0.5);
    box-shadow: 0 2px 4px rgba(139, 69, 19, 0.1);
  }

  .filter-select:focus {
    border-color: #FFBF00;
    outline: 1px solid #FFBF00;
    box-shadow: 0 0 0 2px rgba(255, 191, 0, 0.2);
  }

  .filter-help {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    color: #8B4513;
    font-style: italic;
    line-height: 1.4;
    opacity: 0.9;
  }

  /* Quick filters */
  .quick-filters {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .quick-filters-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: #2F4F4F;
    margin: 0 0 1rem 0;
  }

  .quick-filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .quick-filter-button {
    background: rgba(139, 69, 19, 0.05);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 6px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .quick-filter-button:hover,
  .quick-filter-button:focus {
    background: rgba(139, 69, 19, 0.1);
    border-color: rgba(139, 69, 19, 0.4);
    outline: 1px solid #FFBF00;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.2);
  }

  .quick-filter-button.active {
    background: #FFBF00;
    border-color: #B8860B;
    color: #6B4423;
  }

  .quick-icon {
    font-size: 1.5rem;
  }

  .quick-label {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2F4F4F;
  }

  .quick-filter-button.active .quick-label {
    color: #6B4423;
    font-weight: 700;
  }

  /* Filter summary */
  .filter-summary {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 6px;
    padding: 1rem;
  }

  .summary-content {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .summary-label {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    font-weight: bold;
    color: #6B4423;
  }

  .summary-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .summary-tag {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-weight: 600;
  }

  .act-tag {
    background: rgba(139, 69, 19, 0.1);
    color: #8B4513;
    border: 1px solid rgba(139, 69, 19, 0.3);
  }

  .type-tag {
    background: rgba(47, 79, 79, 0.1);
    color: #2F4F4F;
    border: 1px solid rgba(47, 79, 79, 0.3);
  }

  .sort-tag {
    background: rgba(255, 152, 0, 0.1);
    color: #E65100;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }

  .view-tag {
    background: rgba(76, 175, 80, 0.1);
    color: #2E7D32;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }

  .default-tag {
    background: rgba(158, 158, 158, 0.1);
    color: #424242;
    border: 1px solid rgba(158, 158, 158, 0.3);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .evidence-filters {
      padding: 1rem;
    }

    .filters-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
      text-align: center;
    }

    .filters-metadata {
      flex-direction: column;
      gap: 0.5rem;
    }

    .filters-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .quick-filters-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .summary-content {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }

    .summary-tags {
      justify-content: center;
    }

    .filters-title {
      font-size: 1.25rem;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .filter-select {
      font-size: 0.85rem;
      padding: 0.65rem 0.85rem;
    }

    .quick-filter-button {
      padding: 0.75rem;
    }

    .quick-icon {
      font-size: 1.25rem;
    }

    .quick-label {
      font-size: 0.8rem;
    }
  }

  /* Print styles */
  @media print {
    .evidence-filters {
      background: white;
      border: 1px solid black;
      page-break-inside: avoid;
      margin-bottom: 1rem;
    }

    .reset-button,
    .quick-filter-button {
      display: none;
    }

    .filter-summary {
      background: white;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .evidence-filters {
      border-color: black;
      background: white;
    }

    .filter-select {
      border-color: black;
      background: white;
      color: black;
    }

    .quick-filter-button {
      border-color: black;
      background: white;
      color: black;
    }

    .quick-filter-button.active {
      background: black;
      color: white;
    }

    .summary-tag {
      border-color: black;
      background: white;
      color: black;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .reset-button,
    .quick-filter-button,
    .filter-select {
      transition: none;
    }

    .reset-button:hover,
    .reset-button:focus,
    .quick-filter-button:hover,
    .quick-filter-button:focus {
      transform: none;
    }
  }
</style>