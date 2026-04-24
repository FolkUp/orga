<!--
  EvidenceAccessibility.svelte
  Screen reader announcements and accessibility utilities for evidence gallery
  Provides live region announcements and keyboard navigation support
-->
<script>
  import { onMount } from 'svelte';

  // Props
  export let announcements = '';
  export let enableKeyboardHelp = true;
  export let enableFocusManagement = true;

  // State
  let isKeyboardHelpVisible = false;
  let focusHistory = [];
  let currentAnnouncementId = 0;

  // Announcement queue for complex scenarios
  let announcementQueue = [];
  let isProcessingQueue = false;

  function announceImmediate(message, priority = 'polite') {
    if (!message || message.trim() === '') return;

    // Create unique announcement element for complex announcements
    const announcementElement = document.createElement('div');
    announcementElement.setAttribute('aria-live', priority);
    announcementElement.setAttribute('aria-atomic', 'true');
    announcementElement.className = 'sr-only';
    announcementElement.textContent = message;

    document.body.appendChild(announcementElement);

    // Remove after announcement is read
    setTimeout(() => {
      if (document.body.contains(announcementElement)) {
        document.body.removeChild(announcementElement);
      }
    }, 2000);
  }

  function queueAnnouncement(message, delay = 500) {
    announcementQueue.push({ message, timestamp: Date.now() + delay });
    processAnnouncementQueue();
  }

  function processAnnouncementQueue() {
    if (isProcessingQueue || announcementQueue.length === 0) return;

    isProcessingQueue = true;
    const now = Date.now();
    const readyAnnouncements = announcementQueue.filter(item => item.timestamp <= now);

    if (readyAnnouncements.length > 0) {
      const announcement = readyAnnouncements[0];
      announcements = announcement.message;

      // Remove from queue
      announcementQueue = announcementQueue.filter(item => item !== announcement);
    }

    // Schedule next processing
    setTimeout(() => {
      isProcessingQueue = false;
      if (announcementQueue.length > 0) {
        processAnnouncementQueue();
      }
    }, 100);
  }

  function showKeyboardHelp() {
    isKeyboardHelpVisible = true;

    // Focus the help dialog
    const helpDialog = document.getElementById('keyboard-help-dialog');
    if (helpDialog) {
      helpDialog.focus();
    }

    announceImmediate('Keyboard shortcuts dialog opened', 'assertive');
  }

  function hideKeyboardHelp() {
    isKeyboardHelpVisible = false;
    announceImmediate('Keyboard shortcuts dialog closed');
  }

  function handleGlobalKeydown(event) {
    // Global keyboard shortcuts
    switch (event.key) {
      case '?':
        if (!isKeyboardHelpVisible && enableKeyboardHelp) {
          event.preventDefault();
          showKeyboardHelp();
        }
        break;

      case 'Escape':
        if (isKeyboardHelpVisible) {
          event.preventDefault();
          hideKeyboardHelp();
        }
        break;

      case 'h':
        if (event.altKey && enableKeyboardHelp) {
          event.preventDefault();
          showKeyboardHelp();
        }
        break;

      // Skip links
      case 's':
        if (event.altKey) {
          event.preventDefault();
          skipToMainContent();
        }
        break;

      case 'n':
        if (event.altKey) {
          event.preventDefault();
          skipToNavigation();
        }
        break;
    }
  }

  function skipToMainContent() {
    const mainContent = document.getElementById('main-content') ||
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]');

    if (mainContent) {
      mainContent.focus();
      announceImmediate('Skipped to main content');
    }
  }

  function skipToNavigation() {
    const navigation = document.querySelector('nav') ||
                      document.querySelector('[role="navigation"]') ||
                      document.querySelector('.evidence-gallery .gallery-controls');

    if (navigation) {
      const firstFocusable = navigation.querySelector('button, input, select, a[href]');
      if (firstFocusable) {
        firstFocusable.focus();
        announceImmediate('Skipped to navigation controls');
      }
    }
  }

  function manageFocus(element) {
    if (!enableFocusManagement || !element) return;

    // Store focus history for better navigation
    focusHistory.push({
      element: document.activeElement,
      timestamp: Date.now()
    });

    // Limit history size
    if (focusHistory.length > 10) {
      focusHistory = focusHistory.slice(-10);
    }
  }

  function restorePreviousFocus() {
    if (!enableFocusManagement || focusHistory.length === 0) return;

    const lastFocus = focusHistory.pop();
    if (lastFocus && lastFocus.element && document.contains(lastFocus.element)) {
      lastFocus.element.focus();
      return true;
    }
    return false;
  }

  // Utility functions for external use
  export function announceEvidenceChange(evidenceTitle, index, total) {
    queueAnnouncement(`Evidence ${index + 1} of ${total}: ${evidenceTitle}`);
  }

  export function announceFilterChange(filterType, value, resultCount) {
    const messages = {
      search: `Search results updated: ${resultCount} items found for "${value}"`,
      type: `Filtered by type ${value}: ${resultCount} items shown`,
      significance: `Filtered by significance ${value}: ${resultCount} items shown`,
      date: `Filtered by date range: ${resultCount} items shown`,
      clear: `All filters cleared: showing all ${resultCount} items`
    };

    queueAnnouncement(messages[filterType] || `Filter applied: ${resultCount} items shown`);
  }

  export function announceModalStateChange(isOpen, evidenceTitle) {
    if (isOpen) {
      announceImmediate(`Evidence modal opened: ${evidenceTitle}. Use arrow keys to navigate, escape to close.`, 'assertive');
    } else {
      announceImmediate('Evidence modal closed');
    }
  }

  export function announceNavigationChange(target, context) {
    const messages = {
      timeline: `Navigated to timeline event: ${context}`,
      hero: `Navigated to hero scene: ${context}`,
      evidence: `Viewing evidence: ${context}`
    };

    queueAnnouncement(messages[target] || `Navigated to ${target}`);
  }

  export function announceLoadingState(isLoading, context) {
    if (isLoading) {
      announceImmediate(`Loading ${context}...`, 'assertive');
    } else {
      queueAnnouncement(`${context} loaded successfully`);
    }
  }

  onMount(() => {
    // Add global keyboard listeners
    document.addEventListener('keydown', handleGlobalKeydown);

    // Set up focus management
    if (enableFocusManagement) {
      document.addEventListener('focusin', (event) => {
        manageFocus(event.target);
      });
    }

    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown);
    };
  });

  // Reactive announcements
  $: if (announcements) {
    currentAnnouncementId++;
  }
</script>

<!-- Live Region for Announcements -->
<div
  class="sr-only"
  aria-live="polite"
  aria-atomic="true"
  role="status"
  aria-label="Status announcements"
>
  {#key currentAnnouncementId}
    {announcements}
  {/key}
</div>

<!-- Assertive Live Region for Urgent Announcements -->
<div
  class="sr-only"
  aria-live="assertive"
  aria-atomic="true"
  role="alert"
  aria-label="Important announcements"
  id="assertive-announcements"
>
  <!-- Populated by announceImmediate function -->
</div>

<!-- Skip Links (visible on focus) -->
<div class="skip-links">
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>
  <button
    class="skip-link"
    on:click={skipToNavigation}
  >
    Skip to navigation
  </button>
  {#if enableKeyboardHelp}
    <button
      class="skip-link"
      on:click={showKeyboardHelp}
    >
      Keyboard shortcuts
    </button>
  {/if}
</div>

<!-- Keyboard Help Dialog -->
{#if isKeyboardHelpVisible && enableKeyboardHelp}
  <div class="keyboard-help-overlay" on:click={hideKeyboardHelp}>
    <div
      class="keyboard-help-dialog"
      id="keyboard-help-dialog"
      role="dialog"
      aria-labelledby="keyboard-help-title"
      aria-modal="true"
      tabindex="-1"
      on:click|stopPropagation
    >
      <header class="keyboard-help-header">
        <h2 id="keyboard-help-title">Keyboard Shortcuts</h2>
        <button
          class="close-help-btn"
          on:click={hideKeyboardHelp}
          aria-label="Close keyboard shortcuts"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </header>

      <div class="keyboard-help-content">
        <section class="shortcut-section">
          <h3>Navigation</h3>
          <dl class="shortcuts-list">
            <dt><kbd>Tab</kbd></dt>
            <dd>Move between interactive elements</dd>

            <dt><kbd>Shift + Tab</kbd></dt>
            <dd>Move backwards between elements</dd>

            <dt><kbd>Enter</kbd> / <kbd>Space</kbd></dt>
            <dd>Activate buttons and open evidence</dd>

            <dt><kbd>Escape</kbd></dt>
            <dd>Close modals and dialogs</dd>
          </dl>
        </section>

        <section class="shortcut-section">
          <h3>Evidence Gallery</h3>
          <dl class="shortcuts-list">
            <dt><kbd>Ctrl/Cmd + F</kbd></dt>
            <dd>Focus search input</dd>

            <dt><kbd>Ctrl/Cmd + G</kbd></dt>
            <dd>Toggle grid/list view</dd>

            <dt><kbd>Arrow Keys</kbd></dt>
            <dd>Navigate within modal or suggestions</dd>
          </dl>
        </section>

        <section class="shortcut-section">
          <h3>Accessibility</h3>
          <dl class="shortcuts-list">
            <dt><kbd>?</kbd> / <kbd>Alt + H</kbd></dt>
            <dd>Show this help dialog</dd>

            <dt><kbd>Alt + S</kbd></dt>
            <dd>Skip to main content</dd>

            <dt><kbd>Alt + N</kbd></dt>
            <dd>Skip to navigation</dd>
          </dl>
        </section>
      </div>

      <footer class="keyboard-help-footer">
        <button class="primary-btn" on:click={hideKeyboardHelp}>
          Got it!
        </button>
      </footer>
    </div>
  </div>
{/if}

<!-- Screen Reader Instructions (hidden) -->
<div class="sr-only" id="sr-instructions">
  <h2>Evidence Gallery Instructions for Screen Readers</h2>
  <p>This evidence gallery contains interactive cards that can be opened for detailed viewing. Use Tab to navigate between evidence items, Enter or Space to open details, and Escape to close modals.</p>
  <p>The gallery supports search and filtering. Use Ctrl+F or Cmd+F to quickly focus the search input. Search supports special syntax like "type:media" to filter by evidence type.</p>
  <p>For help with keyboard shortcuts, press the question mark key or Alt+H at any time.</p>
</div>

<style>
  /* Screen Reader Only Content */
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

  /* Skip Links */
  .skip-links {
    position: fixed;
    top: -100px;
    left: var(--space-md);
    z-index: 2000;
    display: flex;
    gap: var(--space-xs);
  }

  .skip-link {
    position: relative;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
    text-decoration: none;
    border: none;
    border-radius: var(--space-xs);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .skip-link:focus {
    top: var(--space-md);
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
    background-color: var(--color-amber-warm);
    color: var(--color-maritime-deep);
  }

  /* Keyboard Help Dialog */
  .keyboard-help-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(26, 54, 93, 0.8);
    backdrop-filter: blur(4px);
    z-index: 1500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
  }

  .keyboard-help-dialog {
    background-color: var(--color-concrete-light);
    border-radius: var(--space-sm);
    border: 2px solid var(--color-maritime-deep);
    box-shadow: 0 20px 60px rgba(26, 54, 93, 0.3);
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: var(--font-body);
  }

  .keyboard-help-dialog:focus {
    outline: none;
  }

  .keyboard-help-header {
    padding: var(--space-lg);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
    background-color: rgba(26, 54, 93, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .keyboard-help-header h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-maritime-deep);
    margin: 0;
  }

  .close-help-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    background-color: transparent;
    color: var(--color-maritime-deep);
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .close-help-btn:hover,
  .close-help-btn:focus {
    background-color: rgba(26, 54, 93, 0.1);
    color: var(--color-amber-warm);
  }

  .close-help-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  .keyboard-help-content {
    padding: var(--space-lg);
    overflow-y: auto;
    flex: 1;
  }

  .shortcut-section {
    margin-bottom: var(--space-lg);
  }

  .shortcut-section:last-child {
    margin-bottom: 0;
  }

  .shortcut-section h3 {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-maritime-deep);
    margin-bottom: var(--space-md);
    border-bottom: 1px solid rgba(26, 54, 93, 0.1);
    padding-bottom: var(--space-xs);
  }

  .shortcuts-list {
    display: grid;
    gap: var(--space-sm);
  }

  .shortcuts-list dt {
    font-weight: 600;
    margin-bottom: var(--space-xs);
  }

  .shortcuts-list dd {
    margin: 0 0 var(--space-sm) var(--space-md);
    color: rgba(45, 55, 72, 0.8);
    line-height: 1.4;
  }

  .shortcuts-list kbd {
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
    padding: 0.125rem var(--space-xs);
    border-radius: var(--space-xs);
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: var(--space-xs);
  }

  .keyboard-help-footer {
    padding: var(--space-md) var(--space-lg);
    border-top: 1px solid rgba(26, 54, 93, 0.1);
    background-color: rgba(26, 54, 93, 0.02);
    text-align: center;
  }

  .primary-btn {
    padding: var(--space-sm) var(--space-lg);
    background-color: var(--color-maritime-deep);
    color: var(--color-text-inverse);
    border: none;
    border-radius: var(--space-xs);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .primary-btn:hover,
  .primary-btn:focus {
    background-color: var(--color-amber-warm);
    color: var(--color-maritime-deep);
  }

  .primary-btn:focus {
    outline: 2px solid var(--color-amber-warm);
    outline-offset: 2px;
  }

  /* Responsive Design */
  @media (max-width: 48rem) {
    .keyboard-help-dialog {
      margin: var(--space-sm);
      max-width: calc(100vw - 2rem);
    }

    .keyboard-help-header,
    .keyboard-help-content,
    .keyboard-help-footer {
      padding: var(--space-md);
    }

    .shortcuts-list dd {
      margin-left: 0;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .keyboard-help-dialog {
      border-width: 3px;
    }

    .skip-link:focus,
    .close-help-btn:focus,
    .primary-btn:focus {
      outline-width: 3px;
    }

    .shortcuts-list kbd {
      border: 1px solid var(--color-text-inverse);
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .skip-link,
    .close-help-btn,
    .primary-btn {
      transition: none;
    }

    .keyboard-help-overlay {
      backdrop-filter: none;
    }
  }

  /* Print Styles */
  @media print {
    .skip-links,
    .keyboard-help-overlay {
      display: none;
    }
  }
</style>