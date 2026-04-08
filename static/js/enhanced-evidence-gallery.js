/**
 * Enhanced Evidence Gallery System
 * Advanced evidence gallery with timeline integration, smart filtering, and multiple view modes
 * ORGA Investigation - Oxymiron Cultural Seismography
 */

class EnhancedEvidenceGallery {
  constructor(options = {}) {
    this.options = {
      galleryId: 'evidence-gallery',
      timelineEvents: '',
      smartFilter: true,
      showMetadata: true,
      autoPlay: false,
      playInterval: 5000,
      ...options
    };

    this.state = {
      currentView: 'grid',
      currentFilter: 'all',
      currentIndex: 0,
      isLightboxOpen: false,
      carouselIndex: 0,
      isAutoPlaying: false,
      timelineConnections: new Map(),
      filteredItems: [],
      allItems: []
    };

    this.elements = {};
    this.eventMappings = this.parseEventMappings();
    this.init();
  }

  init() {
    this.findElements();
    this.setupEventListeners();
    this.setupItems();
    this.setupAccessibility();
    this.setupTimelineIntegration();
    this.initializeView();
  }

  findElements() {
    this.container = document.getElementById(this.options.galleryId);
    if (!this.container) {
      console.error(`Enhanced evidence gallery container not found: ${this.options.galleryId}`);
      return;
    }

    this.elements = {
      // Controls
      filterBtns: this.container.querySelectorAll('.filter-btn'),
      viewBtns: this.container.querySelectorAll('.view-btn'),

      // Views
      galleryGrid: this.container.querySelector('.enhanced-gallery-grid'),
      carousel: this.container.querySelector('.gallery-carousel'),
      carouselTrack: this.container.querySelector('.carousel-track'),
      carouselPrev: this.container.querySelector('.carousel-btn.prev'),
      carouselNext: this.container.querySelector('.carousel-btn.next'),
      carouselIndicators: this.container.querySelectorAll('.carousel-indicator'),

      // Items
      galleryItems: this.container.querySelectorAll('.enhanced-gallery-item'),

      // Lightbox
      lightbox: this.container.querySelector('.enhanced-evidence-lightbox'),
      lightboxImage: this.container.querySelector('.lightbox-image'),
      lightboxTitle: this.container.querySelector('#lightbox-image-title'),
      lightboxCounter: this.container.querySelector('#lightbox-image-counter'),
      lightboxClose: this.container.querySelector('#lightbox-close'),
      lightboxPrev: this.container.querySelector('.lightbox-prev'),
      lightboxNext: this.container.querySelector('.lightbox-next'),
      lightboxTimelineLink: this.container.querySelector('#lightbox-timeline-link'),
      lightboxDownload: this.container.querySelector('#lightbox-download'),
      lightboxLoading: this.container.querySelector('#lightbox-loading'),

      // Metadata
      metadataFilename: this.container.querySelector('#metadata-filename'),
      metadataType: this.container.querySelector('#metadata-type'),
      metadataEvents: this.container.querySelector('#metadata-events'),

      // Smart filter
      smartFilterStatus: this.container.querySelector(`#${this.options.galleryId}-filter-status`),
      filterCount: this.container.querySelector('#filter-count'),
      clearFilterBtn: this.container.querySelector('#clear-smart-filter')
    };
  }

  setupEventListeners() {
    // Filter controls
    this.elements.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });

    // View controls
    this.elements.viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        this.setView(view);
      });
    });

    // Gallery items
    this.elements.galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(index);
        }
      });

      // Individual zoom buttons
      const viewBtn = item.querySelector('.zoom-btn[data-action="view"]');
      const timelineBtn = item.querySelector('.zoom-btn[data-action="timeline"]');

      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openLightbox(index);
        });
      }

      if (timelineBtn) {
        timelineBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.connectToTimeline(index);
        });
      }
    });

    // Lightbox controls
    if (this.elements.lightboxClose) {
      this.elements.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }

    if (this.elements.lightboxPrev) {
      this.elements.lightboxPrev.addEventListener('click', () => this.navigateLightbox(-1));
    }

    if (this.elements.lightboxNext) {
      this.elements.lightboxNext.addEventListener('click', () => this.navigateLightbox(1));
    }

    if (this.elements.lightboxTimelineLink) {
      this.elements.lightboxTimelineLink.addEventListener('click', () => this.connectCurrentToTimeline());
    }

    if (this.elements.lightboxDownload) {
      this.elements.lightboxDownload.addEventListener('click', () => this.downloadCurrentImage());
    }

    // Carousel controls
    if (this.elements.carouselPrev) {
      this.elements.carouselPrev.addEventListener('click', () => this.navigateCarousel(-1));
    }

    if (this.elements.carouselNext) {
      this.elements.carouselNext.addEventListener('click', () => this.navigateCarousel(1));
    }

    this.elements.carouselIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToCarouselSlide(index));
    });

    // Smart filter clear
    if (this.elements.clearFilterBtn) {
      this.elements.clearFilterBtn.addEventListener('click', () => this.clearSmartFilter());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Lightbox background click
    if (this.elements.lightbox) {
      this.elements.lightbox.addEventListener('click', (e) => {
        if (e.target === this.elements.lightbox) {
          this.closeLightbox();
        }
      });
    }

    // Window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  setupItems() {
    this.state.allItems = Array.from(this.elements.galleryItems).map((element, index) => ({
      element: element,
      index: index,
      filename: element.getAttribute('data-image'),
      fullSrc: element.getAttribute('data-full'),
      thumbSrc: element.getAttribute('data-thumb'),
      microSrc: element.getAttribute('data-micro'),
      timelineEvents: this.getItemTimelineEvents(element.getAttribute('data-image')),
      visible: true
    }));

    this.state.filteredItems = [...this.state.allItems];
  }

  setupAccessibility() {
    // Add live region for dynamic announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = `${this.options.galleryId}-live-region`;
    this.container.appendChild(liveRegion);

    this.liveRegion = liveRegion;

    // Enhance keyboard focus
    this.elements.galleryItems.forEach((item, index) => {
      item.addEventListener('focus', () => {
        this.announceToScreenReader(`Focused on evidence image ${index + 1} of ${this.elements.galleryItems.length}`);
      });
    });
  }

  setupTimelineIntegration() {
    // Listen for timeline events
    document.addEventListener('timeline:event-selected', (e) => {
      this.handleTimelineEventSelected(e.detail);
    });

    document.addEventListener('timeline:event-deselected', () => {
      this.clearTimelineHighlights();
    });

    // Register this gallery with timeline if it exists
    if (window.EnhancedTimeline) {
      this.registerWithTimeline();
    }
  }

  initializeView() {
    this.setView('grid');
    this.setFilter('all');
    this.updateLightboxNavigation();
  }

  setView(viewName) {
    if (!['grid', 'list', 'carousel'].includes(viewName)) return;

    this.state.currentView = viewName;

    // Update view buttons
    this.elements.viewBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Update container
    const container = this.container.querySelector('.gallery-container');
    container.setAttribute('data-view', viewName);

    // Show/hide appropriate elements
    if (viewName === 'carousel') {
      this.elements.galleryGrid.style.display = 'none';
      this.elements.carousel.style.display = 'block';
      this.updateCarousel();
    } else {
      this.elements.galleryGrid.style.display = 'grid';
      this.elements.carousel.style.display = 'none';
    }

    this.announceToScreenReader(`Switched to ${viewName} view`);
  }

  setFilter(filterName) {
    this.state.currentFilter = filterName;

    // Update filter buttons
    this.elements.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filterName);
    });

    // Filter items
    if (filterName === 'all') {
      this.showAllItems();
    } else {
      this.filterItemsByEvent(filterName);
    }

    this.updateSmartFilterStatus();
    this.announceToScreenReader(`Applied ${filterName} filter`);
  }

  showAllItems() {
    this.state.filteredItems = [...this.state.allItems];

    this.elements.galleryItems.forEach(item => {
      item.classList.remove('filtered-out');
      item.classList.add('filtered-in');
    });
  }

  filterItemsByEvent(eventName) {
    this.state.filteredItems = this.state.allItems.filter(item =>
      item.timelineEvents.includes(eventName)
    );

    this.elements.galleryItems.forEach((item, index) => {
      const itemData = this.state.allItems[index];
      const shouldShow = itemData.timelineEvents.includes(eventName);

      item.classList.toggle('filtered-out', !shouldShow);
      item.classList.toggle('filtered-in', shouldShow);
    });
  }

  clearSmartFilter() {
    this.setFilter('all');

    if (this.elements.smartFilterStatus) {
      this.elements.smartFilterStatus.style.display = 'none';
    }
  }

  updateSmartFilterStatus() {
    if (!this.elements.smartFilterStatus || !this.options.smartFilter) return;

    const visibleCount = this.state.filteredItems.length;
    const totalCount = this.state.allItems.length;

    if (visibleCount < totalCount) {
      this.elements.smartFilterStatus.style.display = 'block';
      if (this.elements.filterCount) {
        this.elements.filterCount.textContent = visibleCount;
      }
    } else {
      this.elements.smartFilterStatus.style.display = 'none';
    }
  }

  openLightbox(index) {
    if (index < 0 || index >= this.state.allItems.length) return;

    const item = this.state.allItems[index];
    this.state.currentIndex = index;
    this.state.isLightboxOpen = true;

    // Show lightbox
    this.elements.lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Show loading
    this.elements.lightboxLoading.style.display = 'block';
    this.elements.lightboxImage.style.opacity = '0';

    // Load image
    const img = new Image();
    img.onload = () => {
      this.elements.lightboxImage.src = item.fullSrc;
      this.elements.lightboxImage.style.opacity = '1';
      this.elements.lightboxLoading.style.display = 'none';
    };
    img.onerror = () => {
      this.elements.lightboxLoading.style.display = 'none';
      this.announceToScreenReader('Error loading image');
    };
    img.src = item.fullSrc;

    // Update UI
    this.updateLightboxContent(item);
    this.updateLightboxNavigation();
    this.announceToScreenReader(`Opened lightbox for image ${index + 1} of ${this.state.allItems.length}`);
  }

  updateLightboxContent(item) {
    // Update title and counter
    if (this.elements.lightboxTitle) {
      this.elements.lightboxTitle.textContent = `Evidence Analysis - ${item.filename}`;
    }

    if (this.elements.lightboxCounter) {
      this.elements.lightboxCounter.textContent = `${item.index + 1} / ${this.state.allItems.length}`;
    }

    // Update metadata
    if (this.elements.metadataFilename) {
      this.elements.metadataFilename.textContent = item.filename;
    }

    if (this.elements.metadataEvents) {
      const events = item.timelineEvents.length > 0 ? item.timelineEvents.join(', ') : 'None';
      this.elements.metadataEvents.textContent = events;
    }

    // Update download link
    if (this.elements.lightboxDownload) {
      this.elements.lightboxDownload.onclick = () => {
        const link = document.createElement('a');
        link.href = item.fullSrc;
        link.download = item.filename;
        link.click();
      };
    }
  }

  updateLightboxNavigation() {
    if (this.elements.lightboxPrev) {
      this.elements.lightboxPrev.disabled = this.state.currentIndex === 0;
    }

    if (this.elements.lightboxNext) {
      this.elements.lightboxNext.disabled = this.state.currentIndex === this.state.allItems.length - 1;
    }
  }

  navigateLightbox(direction) {
    const newIndex = this.state.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.state.allItems.length) {
      this.openLightbox(newIndex);
    }
  }

  closeLightbox() {
    this.state.isLightboxOpen = false;
    this.elements.lightbox.style.display = 'none';
    document.body.style.overflow = '';
    this.announceToScreenReader('Closed lightbox');
  }

  updateCarousel() {
    if (!this.elements.carouselTrack) return;

    const translateX = -this.state.carouselIndex * 100;
    this.elements.carouselTrack.style.transform = `translateX(${translateX}%)`;

    // Update indicators
    this.elements.carouselIndicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.state.carouselIndex);
    });

    // Update navigation buttons
    if (this.elements.carouselPrev) {
      this.elements.carouselPrev.disabled = this.state.carouselIndex === 0;
    }

    if (this.elements.carouselNext) {
      this.elements.carouselNext.disabled = this.state.carouselIndex === this.state.allItems.length - 1;
    }
  }

  navigateCarousel(direction) {
    const newIndex = this.state.carouselIndex + direction;
    if (newIndex >= 0 && newIndex < this.state.allItems.length) {
      this.goToCarouselSlide(newIndex);
    }
  }

  goToCarouselSlide(index) {
    if (index < 0 || index >= this.state.allItems.length) return;

    this.state.carouselIndex = index;
    this.updateCarousel();
    this.announceToScreenReader(`Carousel slide ${index + 1} of ${this.state.allItems.length}`);
  }

  connectToTimeline(index) {
    const item = this.state.allItems[index];

    if (item.timelineEvents.length === 0) {
      this.announceToScreenReader('No timeline events connected to this image');
      return;
    }

    // Dispatch event to timeline
    const event = new CustomEvent('evidence:connect-timeline', {
      detail: {
        imageIndex: index,
        filename: item.filename,
        events: item.timelineEvents
      }
    });

    document.dispatchEvent(event);

    // Visual feedback
    item.element.classList.add('timeline-connected');
    const indicator = item.element.querySelector('.timeline-connection-indicator');
    if (indicator) {
      indicator.style.display = 'flex';
    }

    this.announceToScreenReader(`Connected image to timeline events: ${item.timelineEvents.join(', ')}`);
  }

  connectCurrentToTimeline() {
    if (this.state.isLightboxOpen) {
      this.connectToTimeline(this.state.currentIndex);
    }
  }

  downloadCurrentImage() {
    if (this.state.isLightboxOpen) {
      const item = this.state.allItems[this.state.currentIndex];
      const link = document.createElement('a');
      link.href = item.fullSrc;
      link.download = item.filename;
      link.click();
      this.announceToScreenReader(`Downloaded ${item.filename}`);
    }
  }

  handleTimelineEventSelected(eventData) {
    // Highlight evidence related to the selected timeline event
    this.elements.galleryItems.forEach((item, index) => {
      const itemData = this.state.allItems[index];
      const isRelated = itemData.timelineEvents.includes(eventData.eventId);

      item.classList.toggle('timeline-highlighted', isRelated);

      if (isRelated) {
        const indicator = item.querySelector('.timeline-connection-indicator');
        if (indicator) {
          indicator.style.display = 'flex';
        }
      }
    });

    // Auto-filter if smart filtering is enabled
    if (this.options.smartFilter && this.state.currentFilter === 'all') {
      const relatedItems = this.state.allItems.filter(item =>
        item.timelineEvents.includes(eventData.eventId)
      );

      if (relatedItems.length > 0 && relatedItems.length < this.state.allItems.length) {
        this.filterItemsByEvent(eventData.eventId);
        this.updateSmartFilterStatus();
      }
    }

    this.announceToScreenReader(`Highlighted evidence related to ${eventData.eventId}`);
  }

  clearTimelineHighlights() {
    this.elements.galleryItems.forEach(item => {
      item.classList.remove('timeline-highlighted');

      const indicator = item.querySelector('.timeline-connection-indicator');
      if (indicator) {
        indicator.style.display = 'none';
      }
    });
  }

  handleKeyboard(e) {
    if (!this.state.isLightboxOpen) return;

    switch(e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        if (!e.target.matches('input, textarea')) {
          this.navigateLightbox(-1);
        }
        break;
      case 'ArrowRight':
        if (!e.target.matches('input, textarea')) {
          this.navigateLightbox(1);
        }
        break;
      case 'Home':
        if (!e.target.matches('input, textarea')) {
          this.openLightbox(0);
        }
        break;
      case 'End':
        if (!e.target.matches('input, textarea')) {
          this.openLightbox(this.state.allItems.length - 1);
        }
        break;
      case 'd':
      case 'D':
        if (!e.target.matches('input, textarea')) {
          this.downloadCurrentImage();
        }
        break;
      case 't':
      case 'T':
        if (!e.target.matches('input, textarea')) {
          this.connectCurrentToTimeline();
        }
        break;
    }
  }

  handleResize() {
    // Recalculate carousel if in carousel view
    if (this.state.currentView === 'carousel') {
      this.updateCarousel();
    }
  }

  registerWithTimeline() {
    // Register this gallery as an evidence source for timeline integration
    const event = new CustomEvent('evidence:gallery-ready', {
      detail: {
        galleryId: this.options.galleryId,
        items: this.state.allItems,
        connectHandler: (imageFilename) => this.highlightByFilename(imageFilename)
      }
    });

    document.dispatchEvent(event);
  }

  highlightByFilename(filename) {
    const item = this.state.allItems.find(item => item.filename === filename);
    if (item) {
      item.element.classList.add('timeline-highlighted');
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        item.element.classList.remove('timeline-highlighted');
      }, 3000);
    }
  }

  parseEventMappings() {
    // Parse timeline events from options
    if (!this.options.timelineEvents) return new Map();

    const mappings = new Map();
    const events = this.options.timelineEvents.split(',').map(e => e.trim());

    events.forEach(event => {
      mappings.set(event, []);
    });

    return mappings;
  }

  getItemTimelineEvents(filename) {
    // Determine which timeline events this image relates to
    // This could be enhanced with metadata or naming conventions
    const events = [];

    if (filename.includes('oxymiron') || filename.includes('album')) {
      events.push('org-single', 'mixtape');
    }

    if (filename.includes('streaming') || filename.includes('platform')) {
      events.push('org-single', 'mixtape', 'ukraine-invasion');
    }

    if (filename.includes('geopolitical') || filename.includes('ukraine')) {
      events.push('ukraine-invasion');
    }

    if (filename.includes('foreign') || filename.includes('agent') || filename.includes('censorship')) {
      events.push('foreign-agent');
    }

    if (filename.includes('lyrical') || filename.includes('correlation')) {
      events.push('org-single', 'mixtape');
    }

    return events;
  }

  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }

  // Public API methods
  highlightImage(index) {
    if (index >= 0 && index < this.state.allItems.length) {
      const item = this.state.allItems[index];
      item.element.classList.add('timeline-highlighted');
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  showRelatedToEvent(eventId) {
    this.setFilter(eventId);
  }

  getVisibleItems() {
    return this.state.filteredItems;
  }

  getCurrentItem() {
    return this.state.allItems[this.state.currentIndex];
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Find all enhanced evidence galleries
  const galleries = document.querySelectorAll('.enhanced-evidence-gallery');

  galleries.forEach(gallery => {
    if (!gallery.hasAttribute('data-initialized')) {
      const config = {
        galleryId: gallery.id,
        timelineEvents: gallery.getAttribute('data-timeline-events') || '',
        smartFilter: gallery.getAttribute('data-smart-filter') === 'true',
        showMetadata: gallery.getAttribute('data-show-metadata') !== 'false'
      };

      new EnhancedEvidenceGallery(config);
      gallery.setAttribute('data-initialized', 'true');
    }
  });
});

// Export for manual initialization
window.EnhancedEvidenceGallery = EnhancedEvidenceGallery;