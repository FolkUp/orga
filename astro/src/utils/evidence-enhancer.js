// ORGA-067: Evidence Enhancement Utility
// Dynamic loading for evidence gallery interactivity with multimedia support
// Expert assessment: Johnny (frontend performance) + ORGA Foundation

export class EvidenceEnhancer {
  constructor({ container, data, options = {} }) {
    this.container = container;
    this.data = data;
    this.options = {
      enableFiltering: true,
      enableMultimedia: true,
      enableSearch: true,
      enableModal: true,
      lazyLoadImages: true,
      performance: 'balanced', // 'low' | 'balanced' | 'high'
      ...options
    };
    this.initialized = false;
    this.activeModal = null;
    this.searchIndex = new Map();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Performance monitoring start
      const startTime = performance.now();

      // Apply base enhancement styles
      this.container.classList.add('evidence-enhanced');

      // Build search index
      this.buildSearchIndex();

      // Build interactive overlay
      await this.buildInteractiveLayer();

      // Initialize event handlers
      this.initializeEventHandlers();

      // Initialize multimedia if enabled
      if (this.options.enableMultimedia) {
        await this.initializeMultimedia();
      }

      // Mark as enhanced
      this.container.setAttribute('data-enhanced', 'true');
      this.initialized = true;

      // Performance monitoring end
      const endTime = performance.now();
      console.debug(`Evidence gallery enhanced in ${(endTime - startTime).toFixed(2)}ms`);

    } catch (error) {
      console.error('Evidence enhancement initialization failed:', error);
      throw error;
    }
  }

  buildSearchIndex() {
    const items = this.data.items || [];
    this.searchIndex.clear();

    items.forEach(item => {
      const searchableText = [
        item.title,
        item.description,
        item.source,
        ...(item.tags || [])
      ].filter(Boolean).join(' ').toLowerCase();

      this.searchIndex.set(item.id, {
        item,
        searchText: searchableText
      });
    });
  }

  async buildInteractiveLayer() {
    // Create interactive overlay
    const overlay = document.createElement('div');
    overlay.className = 'evidence-interactive-overlay';
    overlay.innerHTML = this.generateInteractiveHTML();

    this.container.appendChild(overlay);

    // Initialize interactive features based on options
    if (this.options.enableSearch) {
      await this.initializeSearch();
    }

    if (this.options.enableFiltering) {
      await this.initializeFiltering();
    }

    if (this.options.enableModal) {
      await this.initializeModal();
    }
  }

  generateInteractiveHTML() {
    const items = this.data.items || [];
    const types = [...new Set(items.map(item => item.type))];

    return `
      <div class="evidence-controls">
        ${this.options.enableSearch ? `
          <div class="evidence-search">
            <label class="evidence-search-label" for="evidence-search-input">
              Search Evidence:
            </label>
            <input
              type="search"
              id="evidence-search-input"
              class="evidence-search-input"
              placeholder="Search titles, descriptions, tags..."
              aria-describedby="evidence-search-results"
            />
            <div id="evidence-search-results" class="evidence-search-results" aria-live="polite">
              <span class="evidence-search-count">${items.length} items</span>
            </div>
          </div>
        ` : ''}

        ${this.options.enableFiltering ? `
          <div class="evidence-filter">
            <label class="evidence-filter-label" for="evidence-filter-type">
              Filter by Type:
            </label>
            <select id="evidence-filter-type" class="evidence-filter-select">
              <option value="all">All Types</option>
              ${types.map(type => `
                <option value="${type}">${this.capitalizeType(type)}</option>
              `).join('')}
            </select>

            <label class="evidence-filter-label" for="evidence-filter-significance">
              Filter by Significance:
            </label>
            <select id="evidence-filter-significance" class="evidence-filter-select">
              <option value="all">All Significance</option>
              <option value="conclusive">Conclusive</option>
              <option value="founding">Founding</option>
              <option value="watershed">Watershed</option>
              <option value="high">High</option>
              <option value="verification">Verification</option>
              <option value="contextual">Contextual</option>
            </select>
          </div>
        ` : ''}

        <div class="evidence-view-controls">
          <button type="button" class="evidence-view-btn evidence-view-btn--grid" data-view="grid" aria-label="Grid view">
            ⊞
          </button>
          <button type="button" class="evidence-view-btn evidence-view-btn--list" data-view="list" aria-label="List view">
            ≡
          </button>
        </div>
      </div>

      <div class="evidence-interactive-items" data-view="grid">
        ${items.map(item => `
          <article
            class="evidence-item-interactive"
            data-item-id="${item.id}"
            data-item-type="${item.type}"
            data-significance="${item.significance}"
            tabindex="0"
            role="button"
            aria-label="Evidence item: ${item.title}"
          >
            <div class="evidence-item-content">
              <div class="evidence-item-header">
                <h3 class="evidence-item-title">${item.title}</h3>
                <div class="evidence-item-badges">
                  <span class="evidence-badge evidence-badge--type">${item.type}</span>
                  <span class="evidence-badge evidence-badge--significance">${item.significance}</span>
                </div>
              </div>

              <div class="evidence-item-body">
                <p class="evidence-item-description">${item.description}</p>
                ${item.date ? `
                  <time class="evidence-item-date" datetime="${item.date}">
                    ${new Date(item.date).toLocaleDateString()}
                  </time>
                ` : ''}
              </div>

              ${item.media && this.options.enableMultimedia ? `
                <div class="evidence-item-media">
                  <div class="evidence-media-placeholder" data-media-url="${item.media.url}" data-media-type="${item.media.type}">
                    <span class="evidence-media-icon">🔍</span>
                    <span class="evidence-media-label">View Media</span>
                  </div>
                </div>
              ` : ''}

              <div class="evidence-item-footer">
                <cite class="evidence-item-source">${item.source}</cite>
                ${item.tags && item.tags.length > 0 ? `
                  <div class="evidence-item-tags">
                    ${item.tags.slice(0, 3).map(tag => `
                      <span class="evidence-tag">${tag}</span>
                    `).join('')}
                    ${item.tags.length > 3 ? `<span class="evidence-tag evidence-tag--more">+${item.tags.length - 3}</span>` : ''}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="evidence-item-actions">
              <button type="button" class="evidence-action-btn" data-action="view" aria-label="View details">
                👁️
              </button>
              ${item.media ? `
                <button type="button" class="evidence-action-btn" data-action="media" aria-label="View media">
                  🔍
                </button>
              ` : ''}
              <button type="button" class="evidence-action-btn" data-action="timeline" aria-label="Show in timeline">
                ⏱️
              </button>
            </div>
          </article>
        `).join('')}
      </div>

      ${this.options.enableModal ? `
        <div id="evidence-modal" class="evidence-modal" role="dialog" aria-labelledby="evidence-modal-title" aria-hidden="true">
          <div class="evidence-modal-backdrop" data-action="close"></div>
          <div class="evidence-modal-content">
            <div class="evidence-modal-header">
              <h2 id="evidence-modal-title" class="evidence-modal-title"></h2>
              <button type="button" class="evidence-modal-close" data-action="close" aria-label="Close modal">×</button>
            </div>
            <div class="evidence-modal-body">
              <!-- Modal content will be dynamically loaded -->
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  capitalizeType(type) {
    const typeMap = {
      legal: 'Legal',
      verification: 'Verification',
      cultural: 'Cultural',
      historical: 'Historical'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  async initializeSearch() {
    const searchInput = this.container.querySelector('#evidence-search-input');
    const searchResults = this.container.querySelector('#evidence-search-results');
    if (!searchInput || !searchResults) return;

    let searchTimeout;

    const performSearch = (query) => {
      const trimmedQuery = query.trim().toLowerCase();

      if (!trimmedQuery) {
        this.showAllItems();
        searchResults.innerHTML = `<span class="evidence-search-count">${this.data.items.length} items</span>`;
        return;
      }

      const matchingItems = [];
      this.searchIndex.forEach(({ item, searchText }, itemId) => {
        if (searchText.includes(trimmedQuery)) {
          matchingItems.push(item);
        }
      });

      this.filterItemsDisplay(matchingItems.map(item => item.id));
      searchResults.innerHTML = `<span class="evidence-search-count">${matchingItems.length} matching items</span>`;

      // Announce search results for screen readers
      this.announce(`Search found ${matchingItems.length} matching items`);
    };

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300); // Debounce for performance
    });

    // Clear search on escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        performSearch('');
      }
    });
  }

  async initializeFiltering() {
    const typeFilter = this.container.querySelector('#evidence-filter-type');
    const significanceFilter = this.container.querySelector('#evidence-filter-significance');

    const applyFilters = () => {
      const selectedType = typeFilter?.value || 'all';
      const selectedSignificance = significanceFilter?.value || 'all';

      this.container.querySelectorAll('.evidence-item-interactive').forEach(item => {
        const itemType = item.dataset.itemType;
        const itemSignificance = item.dataset.significance;

        const typeMatch = selectedType === 'all' || itemType === selectedType;
        const significanceMatch = selectedSignificance === 'all' || itemSignificance === selectedSignificance;
        const shouldShow = typeMatch && significanceMatch;

        item.style.display = shouldShow ? 'block' : 'none';
        item.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
      });

      // Count visible items
      const visibleItems = this.container.querySelectorAll('.evidence-item-interactive[aria-hidden="false"]').length;
      this.announce(`Filter applied. ${visibleItems} items shown.`);
    };

    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilters);
    }

    if (significanceFilter) {
      significanceFilter.addEventListener('change', applyFilters);
    }
  }

  async initializeModal() {
    const modal = this.container.querySelector('#evidence-modal');
    if (!modal) return;

    const openModal = async (item) => {
      const title = modal.querySelector('#evidence-modal-title');
      const body = modal.querySelector('.evidence-modal-body');

      title.textContent = item.title;
      body.innerHTML = this.generateModalContent(item);

      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('evidence-modal--visible');

      // Focus management
      const closeButton = modal.querySelector('.evidence-modal-close');
      if (closeButton) {
        closeButton.focus();
      }

      // Trap focus within modal
      this.trapFocus(modal);

      this.activeModal = modal;
    };

    const closeModal = () => {
      if (!this.activeModal) return;

      this.activeModal.setAttribute('aria-hidden', 'true');
      this.activeModal.classList.remove('evidence-modal--visible');
      this.activeModal = null;

      // Return focus to triggering element
      const lastFocusedElement = document.querySelector('[data-evidence-focused]');
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement.removeAttribute('data-evidence-focused');
      }
    };

    // Modal event handlers
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'close' || e.target.classList.contains('evidence-modal-backdrop')) {
        closeModal();
      }
    });

    // Keyboard handling for modal
    document.addEventListener('keydown', (e) => {
      if (this.activeModal && e.key === 'Escape') {
        closeModal();
      }
    });

    // Store modal functions for use by other methods
    this.openModal = openModal;
    this.closeModal = closeModal;
  }

  generateModalContent(item) {
    return `
      <div class="evidence-modal-meta">
        <div class="evidence-modal-badges">
          <span class="evidence-badge evidence-badge--type">${item.type}</span>
          <span class="evidence-badge evidence-badge--significance">${item.significance}</span>
        </div>
        ${item.date ? `
          <time class="evidence-modal-date" datetime="${item.date}">
            ${new Date(item.date).toLocaleDateString()}
          </time>
        ` : ''}
      </div>

      <div class="evidence-modal-content-body">
        <p class="evidence-modal-description">${item.description}</p>

        ${item.details ? `
          <div class="evidence-modal-details">
            <h3>Additional Details</h3>
            <p>${item.details}</p>
          </div>
        ` : ''}

        ${item.media && this.options.enableMultimedia ? `
          <div class="evidence-modal-media">
            <h3>Associated Media</h3>
            <div class="evidence-media-container" data-media-url="${item.media.url}" data-media-type="${item.media.type}">
              <div class="evidence-media-loading">Loading media...</div>
            </div>
          </div>
        ` : ''}

        <div class="evidence-modal-source">
          <h3>Source</h3>
          <cite>${item.source}</cite>
        </div>

        ${item.tags && item.tags.length > 0 ? `
          <div class="evidence-modal-tags">
            <h3>Tags</h3>
            <div class="evidence-tags-list">
              ${item.tags.map(tag => `<span class="evidence-tag">${tag}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${item.verifiedBy ? `
          <div class="evidence-modal-verification">
            <h3>Verification</h3>
            <p>Verified by: <strong>${item.verifiedBy}</strong></p>
          </div>
        ` : ''}
      </div>
    `;
  }

  async initializeMultimedia() {
    // Lazy load multimedia content when requested
    const loadMedia = async (container, mediaUrl, mediaType) => {
      const loadingElement = container.querySelector('.evidence-media-loading');
      if (loadingElement) {
        loadingElement.textContent = 'Loading media...';
      }

      try {
        let mediaElement;

        switch (mediaType) {
          case 'image':
            mediaElement = document.createElement('img');
            mediaElement.src = mediaUrl;
            mediaElement.alt = 'Evidence media';
            mediaElement.className = 'evidence-media-image';
            break;

          case 'video':
            mediaElement = document.createElement('video');
            mediaElement.src = mediaUrl;
            mediaElement.controls = true;
            mediaElement.className = 'evidence-media-video';
            break;

          case 'audio':
            mediaElement = document.createElement('audio');
            mediaElement.src = mediaUrl;
            mediaElement.controls = true;
            mediaElement.className = 'evidence-media-audio';
            break;

          default:
            mediaElement = document.createElement('a');
            mediaElement.href = mediaUrl;
            mediaElement.textContent = 'View Media';
            mediaElement.className = 'evidence-media-link';
            mediaElement.target = '_blank';
            mediaElement.rel = 'noopener noreferrer';
        }

        container.innerHTML = '';
        container.appendChild(mediaElement);

      } catch (error) {
        console.warn('Failed to load media:', error);
        container.innerHTML = '<div class="evidence-media-error">Failed to load media</div>';
      }
    };

    // Delegate media loading requests
    this.container.addEventListener('click', async (e) => {
      const mediaContainer = e.target.closest('[data-media-url]');
      if (!mediaContainer) return;

      const mediaUrl = mediaContainer.dataset.mediaUrl;
      const mediaType = mediaContainer.dataset.mediaType || 'image';

      await loadMedia(mediaContainer, mediaUrl, mediaType);
    });
  }

  initializeEventHandlers() {
    // View controls
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('evidence-view-btn')) {
        const viewType = e.target.dataset.view;
        const itemsContainer = this.container.querySelector('.evidence-interactive-items');

        if (itemsContainer) {
          itemsContainer.dataset.view = viewType;

          // Update button states
          this.container.querySelectorAll('.evidence-view-btn').forEach(btn => {
            btn.classList.toggle('evidence-view-btn--active', btn.dataset.view === viewType);
          });
        }
      }

      // Item actions
      if (e.target.classList.contains('evidence-action-btn')) {
        const action = e.target.dataset.action;
        const itemElement = e.target.closest('.evidence-item-interactive');
        const itemId = itemElement?.dataset.itemId;
        const item = this.data.items.find(item => item.id === itemId);

        if (!item) return;

        // Mark focused element for modal return focus
        itemElement.setAttribute('data-evidence-focused', 'true');

        switch (action) {
          case 'view':
            if (this.openModal) {
              this.openModal(item);
            }
            break;

          case 'media':
            if (item.media && this.openModal) {
              this.openModal(item);
            }
            break;

          case 'timeline':
            // Dispatch event for timeline navigation
            window.dispatchEvent(new CustomEvent('evidence:navigateTimeline', {
              detail: { eventId: item.timelineEventId, evidenceId: item.id }
            }));
            break;
        }
      }

      // Direct item interaction
      if (e.target.closest('.evidence-item-interactive') && !e.target.closest('.evidence-item-actions')) {
        const itemElement = e.target.closest('.evidence-item-interactive');
        const itemId = itemElement.dataset.itemId;
        const item = this.data.items.find(item => item.id === itemId);

        if (item && this.openModal) {
          itemElement.setAttribute('data-evidence-focused', 'true');
          this.openModal(item);
        }
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('evidence-item-interactive') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    });

    // Listen for external evidence navigation
    window.addEventListener('timeline:eventSelected', (e) => {
      const { event } = e.detail;
      const relatedEvidence = this.data.items.filter(item => item.timelineEventId === event.id);

      if (relatedEvidence.length > 0) {
        // Highlight related evidence
        this.highlightItems(relatedEvidence.map(item => item.id));
      }
    });
  }

  filterItemsDisplay(itemIds) {
    this.container.querySelectorAll('.evidence-item-interactive').forEach(item => {
      const shouldShow = itemIds.length === 0 || itemIds.includes(item.dataset.itemId);
      item.style.display = shouldShow ? 'block' : 'none';
      item.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    });
  }

  showAllItems() {
    this.container.querySelectorAll('.evidence-item-interactive').forEach(item => {
      item.style.display = 'block';
      item.setAttribute('aria-hidden', 'false');
    });
  }

  highlightItems(itemIds) {
    this.container.querySelectorAll('.evidence-item-interactive').forEach(item => {
      const shouldHighlight = itemIds.includes(item.dataset.itemId);
      item.classList.toggle('evidence-item--highlighted', shouldHighlight);
    });

    // Remove highlights after a delay
    setTimeout(() => {
      this.container.querySelectorAll('.evidence-item--highlighted').forEach(item => {
        item.classList.remove('evidence-item--highlighted');
      });
    }, 3000);
  }

  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Accessibility announcement utility
  announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Cleanup method
  destroy() {
    if (this.initialized) {
      this.container.classList.remove('evidence-enhanced');
      this.container.removeAttribute('data-enhanced');

      if (this.activeModal) {
        this.closeModal();
      }

      const overlay = this.container.querySelector('.evidence-interactive-overlay');
      if (overlay) {
        overlay.remove();
      }

      this.searchIndex.clear();
      this.initialized = false;
    }
  }
}