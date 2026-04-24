<!--
  Evidence Modal Component - ORGA-066 Implementation
  Full academic evidence viewer with citation standards

  @component EvidenceModal
  @accessibility WCAG 2.1 AA with focus management and keyboard navigation
  @styling Underground Academia scholarly apparatus integration
  @performance Optimized for academic document viewing
-->

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { generateCitation } from '../../data/evidenceGalleryData.js';

  // Component props
  export let evidence;

  // Component state
  const dispatch = createEventDispatcher();
  let modalElement;
  let contentElement;
  let previousFocusElement;
  let isClosing = false;

  // Evidence type full names and descriptions
  const evidenceTypeDetails = {
    primary_artifact: {
      fullName: 'Первичный артефакт',
      description: 'Оригинальный исходный материал с прямой культурной значимостью',
      scholarlyWeight: 'Высокий',
      iconClass: 'primary-artifact-icon'
    },
    reception_record: {
      fullName: 'Запись рецепции',
      description: 'Документация культурного отклика и интерпретации',
      scholarlyWeight: 'Средний',
      iconClass: 'reception-record-icon'
    },
    contextual_document: {
      fullName: 'Контекстный документ',
      description: 'Вспомогательный материал, обеспечивающий исторический или культурный контекст',
      scholarlyWeight: 'Средний',
      iconClass: 'contextual-document-icon'
    },
    analytical_synthesis: {
      fullName: 'Аналитический синтез',
      description: 'Научная интерпретация и материал перекрестных ссылок',
      scholarlyWeight: 'Высокий',
      iconClass: 'analytical-synthesis-icon'
    },
    temporal_anchor: {
      fullName: 'Временная привязка',
      description: 'Хронологическая опорная точка с верифицированной временной меткой',
      scholarlyWeight: 'Критический',
      iconClass: 'temporal-anchor-icon'
    }
  };

  // Act phase details
  const actPhaseDetails = {
    prophecy: {
      fullName: 'Акт I — Пророчество',
      period: 'Ноябрь 2021',
      description: 'Подпольная циркуляция и раннее культурное признание',
      culturalPhase: 'Прорастание'
    },
    validation: {
      fullName: 'Акт II — Валидация',
      period: 'Февраль 2022',
      description: 'Внешняя валидация, запускающая вирусный взрыв',
      culturalPhase: 'Активация'
    },
    recognition: {
      fullName: 'Акт III — Признание',
      period: 'Октябрь 2022',
      description: 'Институциональное признание и культурная постоянность',
      culturalPhase: 'Институционализация'
    }
  };

  // Get detailed information for current evidence
  $: evidenceTypeInfo = evidenceTypeDetails[evidence.type] || evidenceTypeDetails.contextual_document;
  $: actPhaseInfo = actPhaseDetails[evidence.act] || actPhaseDetails.prophecy;
  $: fullCitation = generateCitation(evidence);

  // Handle modal close
  function closeModal() {
    if (isClosing) return;
    isClosing = true;
    dispatch('modal-close');
  }

  // Handle keyboard navigation
  function handleKeydown(event) {
    switch (event.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        dispatch('evidence-navigate', { direction: 'previous' });
        break;
      case 'ArrowRight':
        dispatch('evidence-navigate', { direction: 'next' });
        break;
      case 'Tab':
        // Trap focus within modal
        trapFocus(event);
        break;
    }
  }

  // Focus trap implementation
  function trapFocus(event) {
    const focusableElements = modalElement?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  // Format date for academic display
  function formatAcademicDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Format timestamp for academic display
  function formatAcademicTimestamp(timestamp) {
    if (timestamp === 'Academic Analysis' || timestamp === 'Historical Context' || timestamp === 'Official Documentation') {
      return timestamp;
    }
    if (timestamp.includes('UTC')) {
      return timestamp;
    }
    return timestamp || 'Время не указано';
  }

  // Lifecycle management
  onMount(() => {
    // Store previous focus element
    previousFocusElement = document.activeElement;

    // Focus modal container
    if (modalElement) {
      modalElement.focus();
    }

    // Add event listener for outside clicks
    function handleOutsideClick(event) {
      if (modalElement && !modalElement.contains(event.target)) {
        closeModal();
      }
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    document.addEventListener('click', handleOutsideClick);

    return () => {
      // Restore previous focus
      if (previousFocusElement) {
        previousFocusElement.focus();
      }

      // Restore body scroll
      document.body.style.overflow = '';

      document.removeEventListener('click', handleOutsideClick);
    };
  });

  // Handle click on modal backdrop
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

<!-- Modal backdrop -->
<div
  class="modal-backdrop"
  transition:fade={{ duration: 200 }}
  on:click={handleBackdropClick}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <!-- Modal container -->
  <div
    class="modal-container"
    bind:this={modalElement}
    transition:fly={{ y: 50, duration: 300 }}
    tabindex="-1"
    on:keydown={handleKeydown}
  >
    <!-- Modal header with archival styling -->
    <header class="modal-header">
      <div class="header-classification">
        <div class="document-classification">
          <span class="classification-label">КЛАССИФИКАЦИЯ ДОКУМЕНТА:</span>
          <span class="classification-value">{evidenceTypeInfo.fullName.toUpperCase()}</span>
        </div>
        <div class="archival-metadata">
          <span class="archive-series">СЕРИЯ: ORGA-066</span>
          <span class="document-number">№ {evidence.id}</span>
        </div>
      </div>

      <div class="header-controls">
        <button
          class="navigation-button previous"
          on:click={() => dispatch('evidence-navigate', { direction: 'previous' })}
          aria-label="Предыдущий документ"
          title="Предыдущий документ (←)"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          class="navigation-button next"
          on:click={() => dispatch('evidence-navigate', { direction: 'next' })}
          aria-label="Следующий документ"
          title="Следующий документ (→)"
        >
          <span aria-hidden="true">›</span>
        </button>

        <button
          class="close-button"
          on:click={closeModal}
          aria-label="Закрыть модальное окно"
          title="Закрыть (Esc)"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </header>

    <!-- Modal content -->
    <main class="modal-content" bind:this={contentElement}>
      <!-- Document title and metadata -->
      <section class="document-title-section">
        <div class="title-metadata">
          <div class="act-phase-indicator" style="border-left-color: {actPhaseInfo.culturalPhase === 'Прорастание' ? '#8B4513' : actPhaseInfo.culturalPhase === 'Активация' ? '#2F4F4F' : '#FFBF00'};">
            <span class="act-phase-label">{actPhaseInfo.fullName}</span>
            <span class="act-period">({actPhaseInfo.period})</span>
            <span class="cultural-phase">Фаза: {actPhaseInfo.culturalPhase}</span>
          </div>
        </div>

        <h1 class="document-title" id="modal-title">
          {evidence.title}
        </h1>

        <div class="document-subtitle">
          <span class="evidence-type-badge" class:primary={evidence.type === 'primary_artifact'} class:temporal={evidence.type === 'temporal_anchor'}>
            {evidenceTypeInfo.fullName}
          </span>
          <span class="scholarly-weight">Научный вес: {evidenceTypeInfo.scholarlyWeight}</span>
        </div>
      </section>

      <!-- Document description and analysis -->
      <section class="document-content-section">
        <div class="content-grid">
          <!-- Main content column -->
          <div class="main-content-column">
            <!-- Description -->
            <div class="content-block">
              <h2 class="section-title">Описание</h2>
              <div class="description-content" id="modal-description">
                <p class="description-text">{evidence.description}</p>
              </div>
            </div>

            <!-- Academic notes -->
            {#if evidence.academic_notes}
              <div class="content-block academic-analysis">
                <h2 class="section-title">Академический анализ</h2>
                <div class="analysis-content">
                  <p class="analysis-text">{evidence.academic_notes}</p>
                </div>
              </div>
            {/if}

            <!-- Media information -->
            {#if evidence.media}
              <div class="content-block media-analysis">
                <h2 class="section-title">Медиа-анализ</h2>
                <div class="media-content">
                  <div class="media-type-header">
                    <span class="media-type-label">Тип медиа:</span>
                    <span class="media-type-value">{evidence.media.type.replace('_', ' ').toUpperCase()}</span>
                  </div>

                  <!-- Media-specific content -->
                  {#if evidence.media.type === 'video_metadata'}
                    <div class="media-details-grid">
                      <div class="detail-item">
                        <span class="detail-label">Продолжительность:</span>
                        <span class="detail-value">{evidence.media.duration}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Первичные просмотры:</span>
                        <span class="detail-value">{evidence.media.views_initial?.toLocaleString() || 'Н/Д'}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Паттерн вовлечения:</span>
                        <span class="detail-value">{evidence.media.engagement_pattern}</span>
                      </div>
                    </div>
                  {:else if evidence.media.type === 'forum_collection'}
                    <div class="media-details-grid">
                      <div class="detail-item">
                        <span class="detail-label">Платформы:</span>
                        <span class="detail-value">{evidence.media.platforms?.join(', ')}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Всего откликов:</span>
                        <span class="detail-value">{evidence.media.total_responses}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Анализ тональности:</span>
                        <span class="detail-value">{evidence.media.sentiment_analysis}</span>
                      </div>
                    </div>
                  {:else if evidence.media.type === 'analytics_data'}
                    <div class="media-details-grid">
                      <div class="detail-item">
                        <span class="detail-label">Метрики:</span>
                        <span class="detail-value">{evidence.media.metrics?.join(', ')}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Временные рамки:</span>
                        <span class="detail-value">{evidence.media.time_series}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Величина перелома:</span>
                        <span class="detail-value">{evidence.media.inflection_magnitude}</span>
                      </div>
                    </div>
                  {:else if evidence.media.type === 'official_documentation'}
                    <div class="media-details-grid">
                      <div class="detail-item">
                        <span class="detail-label">Источник:</span>
                        <span class="detail-value">{evidence.media.source}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Тип обозначения:</span>
                        <span class="detail-value">{evidence.media.designation_type}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Правовая основа:</span>
                        <span class="detail-value">{evidence.media.legal_framework}</span>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Cultural significance -->
            {#if evidence.cultural_significance}
              <div class="content-block cultural-analysis">
                <h2 class="section-title">Культурная значимость</h2>
                <div class="significance-content">
                  {#each Object.entries(evidence.cultural_significance) as [key, value]}
                    <div class="significance-item">
                      <div class="significance-header">
                        <span class="significance-key">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                      </div>
                      <div class="significance-value">
                        {#if typeof value === 'boolean'}
                          <span class="boolean-value" class:positive={value}>{value ? 'Да' : 'Нет'}</span>
                        {:else if typeof value === 'number'}
                          <span class="numeric-value">{value}</span>
                        {:else if Array.isArray(value)}
                          <ul class="array-value">
                            {#each value as item}
                              <li>{item}</li>
                            {/each}
                          </ul>
                        {:else}
                          <span class="text-value">{value}</span>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Metadata sidebar -->
          <div class="metadata-sidebar">
            <!-- Temporal information -->
            <div class="sidebar-block temporal-block">
              <h3 class="sidebar-title">Временные данные</h3>
              <div class="temporal-data">
                <div class="temporal-item">
                  <span class="temporal-label">Дата:</span>
                  <span class="temporal-value">{formatAcademicDate(evidence.date)}</span>
                </div>
                {#if evidence.timestamp}
                  <div class="temporal-item">
                    <span class="temporal-label">Время:</span>
                    <span class="temporal-value">{formatAcademicTimestamp(evidence.timestamp)}</span>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Provenance information -->
            <div class="sidebar-block provenance-block">
              <h3 class="sidebar-title">Происхождение</h3>
              <div class="provenance-data">
                <div class="provenance-item">
                  <span class="provenance-label">Источник верифицирован:</span>
                  <span class="provenance-value verified" class:verified={evidence.provenance.source_verified}>
                    {evidence.provenance.source_verified ? 'Да ✓' : 'Требуется верификация ⚠'}
                  </span>
                </div>
                <div class="provenance-item">
                  <span class="provenance-label">Цепочка владения:</span>
                  <span class="provenance-value">{evidence.provenance.chain_of_custody}</span>
                </div>
                <div class="provenance-item">
                  <span class="provenance-label">Метод верификации:</span>
                  <span class="provenance-value">{evidence.provenance.verification_method}</span>
                </div>
                <div class="provenance-item">
                  <span class="provenance-label">Уровень достоверности:</span>
                  <span class="provenance-value confidence" class:critical={evidence.provenance.confidence_level === 'critical'} class:high={evidence.provenance.confidence_level === 'high'}>
                    {evidence.provenance.confidence_level.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <!-- Citation information -->
            <div class="sidebar-block citation-block">
              <h3 class="sidebar-title">Цитирование</h3>
              <div class="citation-data">
                <div class="citation-text-container">
                  <textarea
                    class="citation-text"
                    readonly
                    value={fullCitation}
                    aria-label="Академическое цитирование"
                  ></textarea>
                </div>
                <button
                  class="copy-citation-button"
                  on:click={() => navigator.clipboard?.writeText(fullCitation)}
                  title="Скопировать цитату"
                >
                  Скопировать цитату
                </button>
              </div>
            </div>

            <!-- Validation status -->
            {#if evidence.validation}
              <div class="sidebar-block validation-block">
                <h3 class="sidebar-title">Статус валидации</h3>
                <div class="validation-data">
                  <div class="validation-status" class:valid={evidence.validation.status === 'VALID'}>
                    <span class="status-label">Статус:</span>
                    <span class="status-value">{evidence.validation.status}</span>
                  </div>
                  {#if evidence.validation.missing_fields && evidence.validation.missing_fields.length > 0}
                    <div class="missing-fields">
                      <span class="missing-label">Недостающие поля:</span>
                      <ul class="missing-list">
                        {#each evidence.validation.missing_fields as field}
                          <li>{field}</li>
                        {/each}
                      </ul>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </section>
    </main>

    <!-- Modal footer -->
    <footer class="modal-footer">
      <div class="footer-metadata">
        <span class="document-id">Документ ID: {evidence.id}</span>
        <span class="archive-system">Система: ORGA Evidence Gallery v1.0</span>
      </div>
      <div class="footer-actions">
        <button class="action-button secondary" on:click={closeModal}>
          Закрыть
        </button>
      </div>
    </footer>
  </div>
</div>

<style>
  /* Modal backdrop */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  /* Modal container */
  .modal-container {
    background: #FEFCF6;
    border: 3px solid #8B4513;
    border-radius: 8px;
    width: 100%;
    max-width: 1200px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  /* Modal header */
  .modal-header {
    background: linear-gradient(135deg, #8B4513 0%, #6B4423 100%);
    color: #FEFCF6;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #6B4423;
  }

  .header-classification {
    flex-grow: 1;
  }

  .document-classification {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .classification-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    font-weight: bold;
    opacity: 0.8;
    letter-spacing: 1px;
  }

  .classification-value {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    font-weight: bold;
    background: rgba(255, 191, 0, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    border: 1px solid rgba(255, 191, 0, 0.4);
  }

  .archival-metadata {
    display: flex;
    gap: 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    opacity: 0.9;
  }

  .header-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .navigation-button,
  .close-button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #FEFCF6;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .navigation-button:hover,
  .navigation-button:focus,
  .close-button:hover,
  .close-button:focus {
    background: rgba(255, 255, 255, 0.2);
    border-color: #FFBF00;
    outline: 1px solid #FFBF00;
    transform: scale(1.05);
  }

  .close-button {
    background: #D32F2F;
    border-color: #B71C1C;
  }

  .close-button:hover,
  .close-button:focus {
    background: #B71C1C;
  }

  /* Modal content */
  .modal-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 2rem;
    background: #FEFCF6;
  }

  /* Document title section */
  .document-title-section {
    margin-bottom: 2rem;
  }

  .title-metadata {
    margin-bottom: 1rem;
  }

  .act-phase-indicator {
    background: rgba(139, 69, 19, 0.05);
    border-left: 4px solid;
    padding: 0.75rem 1rem;
    border-radius: 0 4px 4px 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .act-phase-label {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    font-style: italic;
    color: #2F4F4F;
  }

  .act-period {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #6B4423;
  }

  .cultural-phase {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    color: #8B4513;
    font-weight: 600;
  }

  .document-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #2F4F4F;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .document-subtitle {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .evidence-type-badge {
    background: #8B4513;
    color: #FEFCF6;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .evidence-type-badge.primary {
    background: #D32F2F;
  }

  .evidence-type-badge.temporal {
    background: #FF5722;
  }

  .scholarly-weight {
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #6B4423;
    background: rgba(139, 69, 19, 0.1);
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    border: 1px solid rgba(139, 69, 19, 0.3);
  }

  /* Document content section */
  .document-content-section {
    margin-bottom: 2rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  .main-content-column {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .content-block {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 6px;
    padding: 1.5rem;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2F4F4F;
    margin: 0 0 1rem 0;
    border-bottom: 2px solid #FFBF00;
    padding-bottom: 0.5rem;
  }

  .description-text,
  .analysis-text {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #2F4F4F;
    margin: 0;
  }

  .academic-analysis {
    background: rgba(255, 191, 0, 0.05);
    border-left: 4px solid #FFBF00;
  }

  .media-analysis {
    background: rgba(47, 79, 79, 0.05);
    border-left: 4px solid #2F4F4F;
  }

  .cultural-analysis {
    background: rgba(139, 69, 19, 0.05);
    border-left: 4px solid #8B4513;
  }

  .media-type-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  }

  .media-type-label {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    font-weight: bold;
    color: #6B4423;
  }

  .media-type-value {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #2F4F4F;
    background: rgba(139, 69, 19, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
  }

  .media-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .detail-item {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 4px;
    padding: 0.75rem;
  }

  .detail-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6B4423;
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
  }

  .detail-value {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    color: #2F4F4F;
  }

  .significance-item {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  }

  .significance-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .significance-header {
    margin-bottom: 0.5rem;
  }

  .significance-key {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    font-weight: bold;
    color: #6B4423;
  }

  .significance-value {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.9rem;
    color: #2F4F4F;
  }

  .boolean-value.positive {
    color: #4CAF50;
    font-weight: 600;
  }

  .numeric-value {
    font-weight: 600;
    color: #FF9800;
  }

  .array-value {
    margin: 0;
    padding-left: 1.5rem;
  }

  .array-value li {
    margin-bottom: 0.25rem;
  }

  /* Metadata sidebar */
  .metadata-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-block {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(139, 69, 19, 0.3);
    border-radius: 6px;
    padding: 1.25rem;
  }

  .sidebar-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: #2F4F4F;
    margin: 0 0 1rem 0;
    border-bottom: 1px solid #FFBF00;
    padding-bottom: 0.5rem;
  }

  .temporal-data,
  .provenance-data,
  .citation-data,
  .validation-data {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .temporal-item,
  .provenance-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .temporal-label,
  .provenance-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6B4423;
    font-weight: bold;
  }

  .temporal-value,
  .provenance-value {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    color: #2F4F4F;
  }

  .provenance-value.verified {
    color: #4CAF50;
    font-weight: 600;
  }

  .provenance-value.confidence.critical {
    color: #D32F2F;
    font-weight: bold;
  }

  .provenance-value.confidence.high {
    color: #FF9800;
    font-weight: 600;
  }

  .citation-text-container {
    margin-bottom: 1rem;
  }

  .citation-text {
    width: 100%;
    min-height: 120px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    line-height: 1.4;
    color: #2F4F4F;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(139, 69, 19, 0.3);
    border-radius: 4px;
    padding: 0.75rem;
    resize: vertical;
  }

  .copy-citation-button {
    background: #8B4513;
    color: #FEFCF6;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }

  .copy-citation-button:hover,
  .copy-citation-button:focus {
    background: #6B4423;
    outline: 1px solid #FFBF00;
  }

  .validation-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: rgba(139, 69, 19, 0.1);
    border-radius: 4px;
  }

  .validation-status.valid {
    background: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }

  .status-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6B4423;
    font-weight: bold;
  }

  .status-value {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2F4F4F;
  }

  .validation-status.valid .status-value {
    color: #4CAF50;
  }

  .missing-fields {
    margin-top: 0.75rem;
  }

  .missing-label {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6B4423;
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }

  .missing-list {
    margin: 0;
    padding-left: 1.5rem;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    color: #D32F2F;
  }

  /* Modal footer */
  .modal-footer {
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(139, 69, 19, 0.1) 100%);
    border-top: 1px solid rgba(139, 69, 19, 0.2);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-metadata {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6B4423;
  }

  .footer-actions {
    display: flex;
    gap: 1rem;
  }

  .action-button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-button.secondary {
    background: #6B4423;
    color: #FEFCF6;
    border: 1px solid #8B4513;
  }

  .action-button.secondary:hover,
  .action-button.secondary:focus {
    background: #8B4513;
    outline: 1px solid #FFBF00;
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .modal-container {
      max-width: 90vw;
    }

    .document-title {
      font-size: 1.75rem;
    }
  }

  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal-container {
      max-width: 100vw;
      max-height: 95vh;
    }

    .modal-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
      text-align: center;
    }

    .header-controls {
      justify-content: center;
    }

    .document-classification {
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .document-subtitle {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .modal-content {
      padding: 1rem;
    }

    .document-title {
      font-size: 1.5rem;
    }

    .media-details-grid {
      grid-template-columns: 1fr;
    }

    .modal-footer {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  /* Print styles */
  @media print {
    .modal-backdrop {
      background: white;
      position: static;
      padding: 0;
    }

    .modal-container {
      border: 2px solid black;
      box-shadow: none;
      max-width: none;
      max-height: none;
      overflow: visible;
    }

    .modal-header {
      background: white;
      color: black;
      border-bottom: 2px solid black;
    }

    .navigation-button,
    .close-button {
      display: none;
    }

    .modal-footer {
      background: white;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .modal-container {
      border-color: black;
      background: white;
    }

    .modal-header {
      background: black;
      color: white;
    }

    .evidence-type-badge {
      background: black;
      color: white;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .modal-container {
      transition: none;
    }

    .navigation-button,
    .close-button,
    .action-button {
      transition: none;
    }

    .navigation-button:hover,
    .navigation-button:focus,
    .close-button:hover,
    .close-button:focus {
      transform: none;
    }
  }
</style>