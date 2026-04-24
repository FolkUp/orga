<!--
  Evidence Accessibility Component - ORGA-066 Implementation
  Comprehensive accessibility support for evidence gallery

  @component EvidenceAccessibility
  @accessibility WCAG 2.1 AA compliance with screen reader optimization
  @features Live announcements, keyboard shortcuts, focus management
  @performance Optimized for assistive technology users
-->

<script>
  import { createEventDispatcher, onMount } from 'svelte';

  // Component props
  export let accessibilityMode = false;
  export let currentItem = 1;
  export let totalItems = 0;

  // Component state
  const dispatch = createEventDispatcher();
  let announcementElement;
  let shortcutsVisible = false;
  let highContrastMode = false;
  let reducedMotionMode = false;

  // Accessibility preferences detection
  onMount(() => {
    // Detect user preferences
    detectAccessibilityPreferences();

    // Add global keyboard shortcuts
    addGlobalKeyboardShortcuts();

    return () => {
      // Cleanup global listeners
      removeGlobalKeyboardShortcuts();
    };
  });

  function detectAccessibilityPreferences() {
    // Detect reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionMode = reducedMotion.matches;

    // Detect high contrast preference
    const highContrast = window.matchMedia('(prefers-contrast: high)');
    highContrastMode = highContrast.matches;

    // Listen for preference changes
    reducedMotion.addEventListener('change', (e) => {
      reducedMotionMode = e.matches;
      announcePreferenceChange('Режим уменьшенной анимации', e.matches ? 'включен' : 'выключен');
    });

    highContrast.addEventListener('change', (e) => {
      highContrastMode = e.matches;
      announcePreferenceChange('Режим высокого контраста', e.matches ? 'включен' : 'выключен');
    });
  }

  function announcePreferenceChange(setting, status) {
    const message = `${setting} ${status}`;
    announce(message, 'polite');
  }

  // Announcement functions
  function announce(message, priority = 'polite') {
    if (announcementElement) {
      // Clear previous announcement
      announcementElement.textContent = '';

      // Set new announcement with slight delay to ensure screen reader notices
      setTimeout(() => {
        announcementElement.textContent = message;
        announcementElement.setAttribute('aria-live', priority);
      }, 50);

      // Clear announcement after a reasonable time
      setTimeout(() => {
        if (announcementElement.textContent === message) {
          announcementElement.textContent = '';
        }
      }, 5000);
    }

    // Dispatch to parent component
    dispatch('accessibility-announce', { message, priority });
  }

  // Position announcements
  function announcePosition() {
    if (totalItems > 0) {
      const message = `Документ ${currentItem} из ${totalItems}`;
      announce(message, 'polite');
    }
  }

  function announceNavigationHelp() {
    const shortcuts = [
      'Стрелки для навигации',
      'Enter или Пробел для открытия',
      'Escape для закрытия',
      'Tab для перехода между элементами'
    ];
    const message = `Навигация в галерее: ${shortcuts.join(', ')}`;
    announce(message, 'polite');
  }

  // Global keyboard shortcuts
  let globalKeydownHandler;

  function addGlobalKeyboardShortcuts() {
    globalKeydownHandler = function(event) {
      // Alt + combinations for accessibility features
      if (event.altKey) {
        switch (event.key) {
          case 'h':
            event.preventDefault();
            toggleShortcutsHelp();
            break;
          case 'p':
            event.preventDefault();
            announcePosition();
            break;
          case 'n':
            event.preventDefault();
            announceNavigationHelp();
            break;
          case 'i':
            event.preventDefault();
            announceGalleryInfo();
            break;
        }
      }
    };

    document.addEventListener('keydown', globalKeydownHandler);
  }

  function removeGlobalKeyboardShortcuts() {
    if (globalKeydownHandler) {
      document.removeEventListener('keydown', globalKeydownHandler);
    }
  }

  function toggleShortcutsHelp() {
    shortcutsVisible = !shortcutsVisible;
    announce(
      shortcutsVisible ? 'Справка по клавишам открыта' : 'Справка по клавишам закрыта',
      'polite'
    );
  }

  function announceGalleryInfo() {
    const info = [
      `Галерея архивных документов`,
      `${totalItems} элементов`,
      `Текущий документ: ${currentItem}`,
      accessibilityMode ? 'Режим доступности включен' : 'Стандартный режим'
    ];
    announce(info.join('. '), 'polite');
  }

  // Reactive announcements
  $: if (currentItem && totalItems) {
    announcePosition();
  }

  // Skip link functionality
  function skipToContent() {
    const mainContent = document.querySelector('main, [role="main"], .gallery-content');
    if (mainContent) {
      mainContent.focus();
      announce('Переход к основному содержимому', 'polite');
    }
  }

  function skipToFilters() {
    const filters = document.querySelector('.evidence-filters, [role="region"]');
    if (filters) {
      filters.focus();
      announce('Переход к фильтрам', 'polite');
    }
  }
</script>

<!-- Accessibility container -->
<div
  class="accessibility-container"
  class:high-contrast={highContrastMode}
  class:reduced-motion={reducedMotionMode}
  class:accessibility-mode={accessibilityMode}
>
  <!-- Skip links -->
  <nav class="skip-links" aria-label="Ссылки для быстрого перехода">
    <button
      class="skip-link"
      on:click={skipToContent}
      title="Перейти к содержимому (Alt+C)"
    >
      Перейти к содержимому
    </button>
    <button
      class="skip-link"
      on:click={skipToFilters}
      title="Перейти к фильтрам (Alt+F)"
    >
      Перейти к фильтрам
    </button>
    <button
      class="skip-link"
      on:click={toggleShortcutsHelp}
      title="Справка по клавишам (Alt+H)"
    >
      Справка по клавишам
    </button>
  </nav>

  <!-- Live announcement region -->
  <div
    class="announcement-region"
    aria-live="polite"
    aria-atomic="true"
    bind:this={announcementElement}
    role="status"
  ></div>

  <!-- Keyboard shortcuts help -->
  {#if shortcutsVisible}
    <div
      class="shortcuts-help"
      role="dialog"
      aria-labelledby="shortcuts-title"
      aria-describedby="shortcuts-description"
    >
      <div class="shortcuts-content">
        <header class="shortcuts-header">
          <h2 id="shortcuts-title" class="shortcuts-title">
            Клавиатурные сокращения
          </h2>
          <button
            class="shortcuts-close"
            on:click={toggleShortcutsHelp}
            aria-label="Закрыть справку"
            title="Закрыть (Escape)"
          >
            ✕
          </button>
        </header>

        <div id="shortcuts-description" class="shortcuts-body">
          <section class="shortcuts-section">
            <h3 class="section-title">Навигация по галерее</h3>
            <dl class="shortcuts-list">
              <dt class="shortcut-key">←/→ или ↑/↓</dt>
              <dd class="shortcut-description">Перемещение между документами</dd>

              <dt class="shortcut-key">Enter или Пробел</dt>
              <dd class="shortcut-description">Открыть выбранный документ</dd>

              <dt class="shortcut-key">Home</dt>
              <dd class="shortcut-description">Перейти к первому документу</dd>

              <dt class="shortcut-key">End</dt>
              <dd class="shortcut-description">Перейти к последнему документу</dd>

              <dt class="shortcut-key">Escape</dt>
              <dd class="shortcut-description">Закрыть модальное окно</dd>
            </dl>
          </section>

          <section class="shortcuts-section">
            <h3 class="section-title">Доступность</h3>
            <dl class="shortcuts-list">
              <dt class="shortcut-key">Alt + H</dt>
              <dd class="shortcut-description">Показать/скрыть эту справку</dd>

              <dt class="shortcut-key">Alt + P</dt>
              <dd class="shortcut-description">Объявить текущую позицию</dd>

              <dt class="shortcut-key">Alt + N</dt>
              <dd class="shortcut-description">Справка по навигации</dd>

              <dt class="shortcut-key">Alt + I</dt>
              <dd class="shortcut-description">Информация о галерее</dd>
            </dl>
          </section>

          <section class="shortcuts-section">
            <h3 class="section-title">Модальное окно</h3>
            <dl class="shortcuts-list">
              <dt class="shortcut-key">←</dt>
              <dd class="shortcut-description">Предыдущий документ</dd>

              <dt class="shortcut-key">→</dt>
              <dd class="shortcut-description">Следующий документ</dd>

              <dt class="shortcut-key">Tab</dt>
              <dd class="shortcut-description">Переход между кнопками</dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  {/if}

  <!-- Accessibility status indicator -->
  <div class="accessibility-status" role="status" aria-label="Статус доступности">
    <div class="status-indicators">
      {#if accessibilityMode}
        <span class="status-indicator active" title="Режим доступности включен">
          ♿ Доступность
        </span>
      {/if}

      {#if highContrastMode}
        <span class="status-indicator contrast" title="Высокий контраст">
          🔲 Контраст
        </span>
      {/if}

      {#if reducedMotionMode}
        <span class="status-indicator motion" title="Уменьшенная анимация">
          ⏸️ Анимация
        </span>
      {/if}
    </div>

    <div class="position-indicator">
      <span class="current-position" aria-label="Текущая позиция">
        {currentItem} из {totalItems}
      </span>
    </div>
  </div>

  <!-- Focus indicator enhancement -->
  <div class="focus-enhancement" aria-hidden="true">
    <style>
      .accessibility-mode *:focus {
        outline: 3px solid #FFBF00 !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }

      .high-contrast *:focus {
        outline: 4px solid #FF0000 !important;
        outline-offset: 3px !important;
      }

      .reduced-motion * {
        transition: none !important;
        animation: none !important;
      }
    </style>
  </div>
</div>

<style>
  /* Accessibility container */
  .accessibility-container {
    position: relative;
    font-family: 'Source Sans 3', sans-serif;
  }

  /* Skip links */
  .skip-links {
    position: absolute;
    top: -100px;
    left: 0;
    z-index: 2000;
    display: flex;
    gap: 0.5rem;
  }

  .skip-link {
    background: #2F4F4F;
    color: #FEFCF6;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 4px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .skip-link:focus {
    position: absolute;
    top: 100px;
    outline: 3px solid #FFBF00;
    outline-offset: 2px;
  }

  .skip-link:hover,
  .skip-link:focus {
    background: #1C3333;
    transform: translateY(1px);
  }

  /* Live announcement region */
  .announcement-region {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  /* Keyboard shortcuts help */
  .shortcuts-help {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .shortcuts-content {
    background: #FEFCF6;
    border: 2px solid #8B4513;
    border-radius: 8px;
    max-width: 800px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .shortcuts-header {
    background: linear-gradient(135deg, #8B4513 0%, #6B4423 100%);
    color: #FEFCF6;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #6B4423;
  }

  .shortcuts-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .shortcuts-close {
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

  .shortcuts-close:hover,
  .shortcuts-close:focus {
    background: rgba(255, 255, 255, 0.2);
    outline: 1px solid #FFBF00;
  }

  .shortcuts-body {
    padding: 2rem;
  }

  .shortcuts-section {
    margin-bottom: 2rem;
  }

  .shortcuts-section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.125rem;
    font-weight: 600;
    color: #2F4F4F;
    margin: 0 0 1rem 0;
    border-bottom: 1px solid #FFBF00;
    padding-bottom: 0.5rem;
  }

  .shortcuts-list {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem 1rem;
    margin: 0;
  }

  .shortcut-key {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    font-weight: bold;
    color: #6B4423;
    background: rgba(139, 69, 19, 0.1);
    padding: 0.375rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(139, 69, 19, 0.3);
    text-align: center;
    white-space: nowrap;
  }

  .shortcut-description {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.9rem;
    color: #2F4F4F;
    margin: 0;
    line-height: 1.4;
    display: flex;
    align-items: center;
  }

  /* Accessibility status indicator */
  .accessibility-status {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(139, 69, 19, 0.3);
    border-radius: 6px;
    padding: 0.75rem;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 0.8rem;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 120px;
  }

  .status-indicators {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .status-indicator {
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
  }

  .status-indicator.active {
    background: rgba(76, 175, 80, 0.1);
    color: #2E7D32;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }

  .status-indicator.contrast {
    background: rgba(33, 33, 33, 0.1);
    color: #212121;
    border: 1px solid rgba(33, 33, 33, 0.3);
  }

  .status-indicator.motion {
    background: rgba(255, 152, 0, 0.1);
    color: #E65100;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }

  .position-indicator {
    border-top: 1px solid rgba(139, 69, 19, 0.2);
    padding-top: 0.5rem;
    text-align: center;
  }

  .current-position {
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #6B4423;
    font-weight: bold;
  }

  /* High contrast mode overrides */
  .accessibility-container.high-contrast {
    --color-sepia: #000000;
    --color-graphite: #000000;
    --color-amber: #FFFF00;
    --color-ivory: #FFFFFF;
    --color-archival: #000000;
  }

  .accessibility-container.high-contrast .shortcuts-content {
    border-color: #000000;
    background: #FFFFFF;
    color: #000000;
  }

  .accessibility-container.high-contrast .shortcuts-header {
    background: #000000;
    color: #FFFFFF;
  }

  .accessibility-container.high-contrast .skip-link {
    background: #000000;
    color: #FFFFFF;
    border: 2px solid #FFFFFF;
  }

  .accessibility-container.high-contrast .accessibility-status {
    background: #FFFFFF;
    border: 2px solid #000000;
    color: #000000;
  }

  /* Reduced motion overrides */
  .accessibility-container.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .accessibility-container.reduced-motion .shortcuts-help {
    animation: none;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .shortcuts-help {
      padding: 1rem;
    }

    .shortcuts-content {
      max-height: 90vh;
    }

    .shortcuts-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .shortcuts-body {
      padding: 1.5rem;
    }

    .shortcuts-list {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .shortcut-key {
      text-align: left;
    }

    .accessibility-status {
      bottom: 0.5rem;
      right: 0.5rem;
      min-width: 100px;
    }

    .skip-links {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .shortcuts-title {
      font-size: 1.25rem;
    }

    .section-title {
      font-size: 1rem;
    }

    .shortcut-key {
      font-size: 0.8rem;
    }

    .shortcut-description {
      font-size: 0.85rem;
    }

    .accessibility-status {
      font-size: 0.7rem;
    }
  }

  /* Print styles */
  @media print {
    .shortcuts-help,
    .accessibility-status,
    .skip-links {
      display: none;
    }
  }

  /* Focus styles for keyboard users */
  .accessibility-container :global(*:focus) {
    outline: 2px solid #FFBF00 !important;
    outline-offset: 2px !important;
  }

  .accessibility-mode :global(*:focus) {
    outline-width: 3px !important;
    outline-offset: 3px !important;
  }

  .high-contrast :global(*:focus) {
    outline: 4px solid #FF0000 !important;
    outline-offset: 3px !important;
  }

  /* Screen reader only content */
  .sr-only {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
</style>