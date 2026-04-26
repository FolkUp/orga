// ORGA-067: Timeline Enhancement Utility
// Dynamic loading for timeline interactivity with performance optimization
// Expert assessment: Johnny (frontend performance) + ORGA Foundation

export class TimelineEnhancer {
  constructor({ container, data, options = {} }) {
    this.container = container;
    this.data = data;
    this.options = {
      enableTooltips: true,
      enableZoom: false,
      enableFiltering: false,
      enableNavigation: true,
      performance: 'balanced', // 'low' | 'balanced' | 'high'
      ...options
    };
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Performance monitoring start
      const startTime = performance.now();

      // Apply base enhancement styles
      this.container.classList.add('timeline-enhanced');

      // Build interactive overlay
      await this.buildInteractiveLayer();

      // Initialize event handlers
      this.initializeEventHandlers();

      // Mark as enhanced
      this.container.setAttribute('data-enhanced', 'true');
      this.initialized = true;

      // Performance monitoring end
      const endTime = performance.now();
      console.debug(`Timeline enhanced in ${(endTime - startTime).toFixed(2)}ms`);

    } catch (error) {
      console.error('Timeline enhancement initialization failed:', error);
      throw error;
    }
  }

  async buildInteractiveLayer() {
    // Create interactive overlay
    const overlay = document.createElement('div');
    overlay.className = 'timeline-interactive-overlay';
    overlay.innerHTML = this.generateInteractiveHTML();

    this.container.appendChild(overlay);

    // Initialize interactive features based on options
    if (this.options.enableTooltips) {
      await this.initializeTooltips();
    }

    if (this.options.enableNavigation) {
      await this.initializeNavigation();
    }

    if (this.options.enableFiltering) {
      await this.initializeFiltering();
    }

    if (this.options.enableZoom) {
      await this.initializeZoom();
    }
  }

  generateInteractiveHTML() {
    const events = this.data.events || [];

    return `
      <div class="timeline-controls">
        ${this.options.enableFiltering ? `
          <div class="timeline-filter">
            <select class="timeline-filter-select" aria-label="Filter timeline events">
              <option value="all">All Events</option>
              <option value="cultural">Cultural</option>
              <option value="legal">Legal</option>
              <option value="historical">Historical</option>
              <option value="government">Government</option>
            </select>
          </div>
        ` : ''}

        ${this.options.enableZoom ? `
          <div class="timeline-zoom">
            <button type="button" class="timeline-zoom-in" aria-label="Zoom in timeline">+</button>
            <button type="button" class="timeline-zoom-out" aria-label="Zoom out timeline">-</button>
            <button type="button" class="timeline-zoom-reset" aria-label="Reset timeline zoom">Reset</button>
          </div>
        ` : ''}
      </div>

      <div class="timeline-interactive-events">
        ${events.map(event => `
          <div
            class="timeline-event-interactive"
            data-event-id="${event.id}"
            data-event-type="${event.type}"
            data-significance="${event.significance}"
            tabindex="0"
            role="button"
            aria-label="Timeline event: ${event.title}"
          >
            <div class="timeline-event-marker"></div>
            ${this.options.enableTooltips ? `
              <div class="timeline-tooltip" role="tooltip" aria-hidden="true">
                <div class="timeline-tooltip-content">
                  <strong>${event.title}</strong>
                  <p>${event.description}</p>
                  <time>${new Date(event.date).toLocaleDateString()}</time>
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      ${this.options.enableNavigation ? `
        <div class="timeline-navigation">
          <button type="button" class="timeline-nav-prev" aria-label="Previous event">‹</button>
          <span class="timeline-nav-current">1 / ${events.length}</span>
          <button type="button" class="timeline-nav-next" aria-label="Next event">›</button>
        </div>
      ` : ''}
    `;
  }

  async initializeTooltips() {
    // Lightweight tooltip system with performance optimization
    let activeTooltip = null;

    const showTooltip = (event, tooltip) => {
      if (activeTooltip && activeTooltip !== tooltip) {
        this.hideTooltip(activeTooltip);
      }

      tooltip.setAttribute('aria-hidden', 'false');
      tooltip.classList.add('timeline-tooltip--visible');
      activeTooltip = tooltip;

      // Position tooltip
      this.positionTooltip(event, tooltip);
    };

    const hideTooltip = (tooltip) => {
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.classList.remove('timeline-tooltip--visible');
      if (activeTooltip === tooltip) {
        activeTooltip = null;
      }
    };

    // Event delegation for performance
    this.container.addEventListener('mouseenter', (e) => {
      if (!e.target.classList.contains('timeline-event-interactive')) return;
      const tooltip = e.target.querySelector('.timeline-tooltip');
      if (tooltip) showTooltip(e, tooltip);
    });

    this.container.addEventListener('mouseleave', (e) => {
      if (!e.target.classList.contains('timeline-event-interactive')) return;
      const tooltip = e.target.querySelector('.timeline-tooltip');
      if (tooltip) hideTooltip(tooltip);
    });

    // Keyboard support
    this.container.addEventListener('focusin', (e) => {
      if (!e.target.classList.contains('timeline-event-interactive')) return;
      const tooltip = e.target.querySelector('.timeline-tooltip');
      if (tooltip) showTooltip(e, tooltip);
    });

    this.container.addEventListener('focusout', (e) => {
      if (!e.target.classList.contains('timeline-event-interactive')) return;
      const tooltip = e.target.querySelector('.timeline-tooltip');
      if (tooltip) hideTooltip(tooltip);
    });
  }

  positionTooltip(event, tooltip) {
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    let top = rect.top - tooltipRect.height - 10;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    // Boundary checks
    if (top < containerRect.top) {
      top = rect.bottom + 10;
      tooltip.classList.add('timeline-tooltip--below');
    } else {
      tooltip.classList.remove('timeline-tooltip--below');
    }

    if (left < containerRect.left) {
      left = containerRect.left + 10;
    } else if (left + tooltipRect.width > containerRect.right) {
      left = containerRect.right - tooltipRect.width - 10;
    }

    tooltip.style.top = `${top - containerRect.top}px`;
    tooltip.style.left = `${left - containerRect.left}px`;
  }

  async initializeNavigation() {
    const events = this.data.events || [];
    let currentIndex = 0;

    const updateNavigation = () => {
      const currentSpan = this.container.querySelector('.timeline-nav-current');
      if (currentSpan) {
        currentSpan.textContent = `${currentIndex + 1} / ${events.length}`;
      }

      // Highlight current event
      this.container.querySelectorAll('.timeline-event-interactive').forEach((el, index) => {
        el.classList.toggle('timeline-event--current', index === currentIndex);
      });

      // Scroll to current event
      const currentEvent = this.container.querySelectorAll('.timeline-event-interactive')[currentIndex];
      if (currentEvent) {
        currentEvent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        currentEvent.focus();
      }
    };

    // Navigation button handlers
    const prevButton = this.container.querySelector('.timeline-nav-prev');
    const nextButton = this.container.querySelector('.timeline-nav-next');

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateNavigation();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex = Math.min(events.length - 1, currentIndex + 1);
        updateNavigation();
      });
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (!e.target.classList.contains('timeline-event-interactive')) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = Math.max(0, currentIndex - 1);
          updateNavigation();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = Math.min(events.length - 1, currentIndex + 1);
          updateNavigation();
          break;
        case 'Home':
          e.preventDefault();
          currentIndex = 0;
          updateNavigation();
          break;
        case 'End':
          e.preventDefault();
          currentIndex = events.length - 1;
          updateNavigation();
          break;
      }
    });

    // Initialize
    updateNavigation();
  }

  async initializeFiltering() {
    const filterSelect = this.container.querySelector('.timeline-filter-select');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', (e) => {
      const filterValue = e.target.value;

      this.container.querySelectorAll('.timeline-event-interactive').forEach(event => {
        const eventType = event.dataset.eventType;
        const shouldShow = filterValue === 'all' || eventType === filterValue;

        event.style.display = shouldShow ? 'block' : 'none';
        event.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
      });

      // Announce filter change for screen readers
      const announcement = filterValue === 'all'
        ? 'Showing all timeline events'
        : `Showing ${filterValue} events only`;

      this.announce(announcement);
    });
  }

  async initializeZoom() {
    let zoomLevel = 1;
    const minZoom = 0.5;
    const maxZoom = 3;
    const zoomStep = 0.25;

    const timelineEvents = this.container.querySelector('.timeline-interactive-events');
    if (!timelineEvents) return;

    const updateZoom = () => {
      timelineEvents.style.transform = `scale(${zoomLevel})`;
      timelineEvents.style.transformOrigin = 'center top';

      // Update button states
      const zoomIn = this.container.querySelector('.timeline-zoom-in');
      const zoomOut = this.container.querySelector('.timeline-zoom-out');

      if (zoomIn) zoomIn.disabled = zoomLevel >= maxZoom;
      if (zoomOut) zoomOut.disabled = zoomLevel <= minZoom;
    };

    // Zoom controls
    const zoomIn = this.container.querySelector('.timeline-zoom-in');
    const zoomOut = this.container.querySelector('.timeline-zoom-out');
    const zoomReset = this.container.querySelector('.timeline-zoom-reset');

    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
        updateZoom();
        this.announce(`Timeline zoomed to ${Math.round(zoomLevel * 100)}%`);
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
        updateZoom();
        this.announce(`Timeline zoomed to ${Math.round(zoomLevel * 100)}%`);
      });
    }

    if (zoomReset) {
      zoomReset.addEventListener('click', () => {
        zoomLevel = 1;
        updateZoom();
        this.announce('Timeline zoom reset to 100%');
      });
    }

    updateZoom();
  }

  initializeEventHandlers() {
    // Custom event dispatching for cross-component communication
    this.container.addEventListener('click', (e) => {
      if (!e.target.closest('.timeline-event-interactive')) return;

      const eventElement = e.target.closest('.timeline-event-interactive');
      const eventId = eventElement.dataset.eventId;
      const eventData = this.data.events.find(event => event.id === eventId);

      if (eventData) {
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('timeline:eventSelected', {
          detail: { event: eventData, source: 'timeline-enhancer' }
        }));
      }
    });

    // Listen for external timeline navigation
    window.addEventListener('evidence:navigateTimeline', (e) => {
      const { eventId } = e.detail;
      const eventElement = this.container.querySelector(`[data-event-id="${eventId}"]`);

      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        eventElement.focus();
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
      this.container.classList.remove('timeline-enhanced');
      this.container.removeAttribute('data-enhanced');

      const overlay = this.container.querySelector('.timeline-interactive-overlay');
      if (overlay) {
        overlay.remove();
      }

      this.initialized = false;
    }
  }
}