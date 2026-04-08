/**
 * Enhanced Cultural Timeline System
 * Advanced interactive timeline with evidence linking, progressive disclosure, and mobile gestures
 * ORGA Investigation - Oxymiron Cultural Seismography
 */

class EnhancedTimeline {
  constructor(options = {}) {
    this.options = {
      container: '.enhanced-cultural-timeline',
      evidenceGallery: '',
      zoom: true,
      gestures: true,
      progressive: true,
      ...options
    };

    this.state = {
      currentEvent: null,
      currentLayer: 'summary',
      zoomLevel: 1,
      isPlaying: false,
      panX: 0,
      panY: 0,
      events: [],
      evidenceImages: new Map(),
      touchStart: null,
      gestureActive: false
    };

    this.elements = {};
    this.eventData = this.getEventData();
    this.init();
  }

  init() {
    this.findElements();
    this.setupEvents();
    this.setupEventData();
    this.setupAccessibility();
    this.setupGestures();
    this.hideGestureHints();
  }

  findElements() {
    this.container = document.querySelector(this.options.container);
    if (!this.container) {
      console.error('Enhanced timeline container not found');
      return;
    }

    this.elements = {
      playBtn: this.container.querySelector('#timeline-play'),
      zoomInBtn: this.container.querySelector('#zoom-in'),
      zoomOutBtn: this.container.querySelector('#zoom-out'),
      zoomResetBtn: this.container.querySelector('#zoom-reset'),
      viewport: this.container.querySelector('#timeline-viewport'),
      svg: this.container.querySelector('.enhanced-timeline-svg'),
      events: this.container.querySelectorAll('.enhanced-event'),
      progressivePanel: this.container.querySelector('#progressive-details'),
      progressiveContent: this.container.querySelector('#progressive-content'),
      closeBtn: this.container.querySelector('#close-progressive'),
      prevBtn: this.container.querySelector('#prev-event'),
      nextBtn: this.container.querySelector('#next-event'),
      currentEventNum: this.container.querySelector('#current-event-num'),
      totalEvents: this.container.querySelector('#total-events'),
      evidenceConnections: this.container.querySelector('#evidence-connections'),
      relatedEvidence: this.container.querySelector('#related-evidence'),
      evidenceThumbnails: this.container.querySelector('#evidence-thumbnails'),
      gestureHints: this.container.querySelector('#gesture-hints')
    };

    // Set total events count
    if (this.elements.totalEvents) {
      this.elements.totalEvents.textContent = this.elements.events.length;
    }
  }

  setupEvents() {
    // Play button
    if (this.elements.playBtn) {
      this.elements.playBtn.addEventListener('click', () => this.toggleAnimation());
    }

    // Zoom controls
    if (this.options.zoom) {
      if (this.elements.zoomInBtn) {
        this.elements.zoomInBtn.addEventListener('click', () => this.zoom(1.5));
      }
      if (this.elements.zoomOutBtn) {
        this.elements.zoomOutBtn.addEventListener('click', () => this.zoom(0.75));
      }
      if (this.elements.zoomResetBtn) {
        this.elements.zoomResetBtn.addEventListener('click', () => this.resetZoom());
      }
    }

    // Timeline events
    this.elements.events.forEach((event, index) => {
      event.addEventListener('click', () => this.selectEvent(index));
      event.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectEvent(index);
        }
      });

      // Evidence indicators
      const evidenceIndicator = event.querySelector('.evidence-indicator');
      if (evidenceIndicator) {
        evidenceIndicator.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showRelatedEvidence(index);
        });
      }
    });

    // Progressive disclosure controls
    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.closeDetails());
    }
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', () => this.navigateEvent(-1));
    }
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', () => this.navigateEvent(1));
    }

    // Layer navigation
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('expand-btn')) {
        const targetLayer = e.target.getAttribute('data-layer');
        this.showLayer(targetLayer);
      } else if (e.target.classList.contains('collapse-btn')) {
        const targetLayer = e.target.getAttribute('data-layer');
        this.showLayer(targetLayer);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.elements.progressivePanel.style.display !== 'none') {
        switch(e.key) {
          case 'Escape':
            this.closeDetails();
            break;
          case 'ArrowLeft':
            if (!e.target.matches('input, textarea')) {
              this.navigateEvent(-1);
            }
            break;
          case 'ArrowRight':
            if (!e.target.matches('input, textarea')) {
              this.navigateEvent(1);
            }
            break;
          case '1':
          case '2':
          case '3':
            if (!e.target.matches('input, textarea')) {
              const layers = ['summary', 'details', 'evidence'];
              this.showLayer(layers[parseInt(e.key) - 1]);
            }
            break;
        }
      }
    });

    // Viewport panning (when zoomed)
    if (this.elements.viewport && this.options.zoom) {
      let isDragging = false;
      let lastPanX = 0;
      let lastPanY = 0;

      this.elements.viewport.addEventListener('mousedown', (e) => {
        if (this.state.zoomLevel > 1) {
          isDragging = true;
          this.elements.viewport.classList.add('grabbing');
          lastPanX = e.clientX;
          lastPanY = e.clientY;
          e.preventDefault();
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging && this.state.zoomLevel > 1) {
          const deltaX = e.clientX - lastPanX;
          const deltaY = e.clientY - lastPanY;
          this.pan(deltaX, deltaY);
          lastPanX = e.clientX;
          lastPanY = e.clientY;
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          this.elements.viewport.classList.remove('grabbing');
        }
      });
    }
  }

  setupEventData() {
    this.state.events = Array.from(this.elements.events).map((element, index) => ({
      id: element.getAttribute('data-event'),
      date: element.getAttribute('data-date'),
      evidenceFiles: element.getAttribute('data-evidence')?.split(',') || [],
      element: element,
      index: index
    }));
  }

  setupAccessibility() {
    // Add live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'timeline-live-region';
    this.container.appendChild(liveRegion);

    this.liveRegion = liveRegion;

    // Enhance keyboard focus indicators
    this.elements.events.forEach(event => {
      event.addEventListener('focus', () => {
        this.announceToScreenReader(`Focused on ${event.getAttribute('data-event')} event`);
      });
    });
  }

  setupGestures() {
    if (!this.options.gestures || !this.elements.viewport) return;

    let touchState = {
      initialPinchDistance: 0,
      initialZoom: 1,
      touches: []
    };

    // Touch start
    this.elements.viewport.addEventListener('touchstart', (e) => {
      this.state.touchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };

      if (e.touches.length === 2) {
        // Pinch gesture start
        const distance = this.getTouchDistance(e.touches[0], e.touches[1]);
        touchState.initialPinchDistance = distance;
        touchState.initialZoom = this.state.zoomLevel;
        this.state.gestureActive = true;
        e.preventDefault();
      }

      touchState.touches = Array.from(e.touches);
    });

    // Touch move
    this.elements.viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.state.gestureActive) {
        // Pinch zoom
        const distance = this.getTouchDistance(e.touches[0], e.touches[1]);
        const scale = distance / touchState.initialPinchDistance;
        const newZoom = Math.max(0.5, Math.min(3, touchState.initialZoom * scale));
        this.setZoom(newZoom);
        e.preventDefault();
      } else if (e.touches.length === 1 && this.state.zoomLevel > 1) {
        // Pan when zoomed
        const touch = e.touches[0];
        if (this.state.touchStart) {
          const deltaX = touch.clientX - this.state.touchStart.x;
          const deltaY = touch.clientY - this.state.touchStart.y;
          this.pan(deltaX * 0.5, deltaY * 0.5);
        }
      }
    });

    // Touch end
    this.elements.viewport.addEventListener('touchend', (e) => {
      if (!this.state.touchStart) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.state.touchStart.x;
      const deltaY = touch.clientY - this.state.touchStart.y;
      const deltaTime = Date.now() - this.state.touchStart.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Swipe detection
      if (deltaTime < 500 && distance > 50 && Math.abs(deltaY) < Math.abs(deltaX)) {
        if (deltaX > 0) {
          this.navigateEvent(-1); // Swipe right = previous
        } else {
          this.navigateEvent(1);  // Swipe left = next
        }
        e.preventDefault();
      }

      // Tap detection for timeline events
      if (deltaTime < 300 && distance < 10) {
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const timelineEvent = target?.closest('.enhanced-event');
        if (timelineEvent) {
          const index = Array.from(this.elements.events).indexOf(timelineEvent);
          if (index >= 0) {
            this.selectEvent(index);
          }
        }
      }

      this.state.gestureActive = false;
      this.state.touchStart = null;
    });

    // Prevent default touch behaviors that interfere
    this.elements.viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  getTouchDistance(touch1, touch2) {
    const deltaX = touch2.clientX - touch1.clientX;
    const deltaY = touch2.clientY - touch1.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  hideGestureHints() {
    if (!this.elements.gestureHints) return;

    setTimeout(() => {
      const hints = this.elements.gestureHints.querySelectorAll('.gesture-hint');
      hints.forEach(hint => {
        hint.classList.add('hidden');
      });

      setTimeout(() => {
        this.elements.gestureHints.style.display = 'none';
      }, 500);
    }, 5000); // Hide after 5 seconds
  }

  selectEvent(index) {
    if (index < 0 || index >= this.state.events.length) return;

    const event = this.state.events[index];
    this.state.currentEvent = index;

    // Update visual state
    this.elements.events.forEach(el => el.classList.remove('active'));
    event.element.classList.add('active');

    // Update progressive disclosure
    if (this.options.progressive) {
      this.showProgressiveDetails(event);
    }

    // Show evidence connections
    this.showEvidenceConnections(event);

    // Update navigation
    this.updateNavigation();

    // Announce to screen reader
    this.announceToScreenReader(`Selected event: ${event.id}`);

    // Focus management
    if (this.elements.progressivePanel.style.display === 'none') {
      this.elements.progressivePanel.style.display = 'block';
      this.elements.progressivePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  showProgressiveDetails(event) {
    if (!this.elements.progressivePanel) return;

    const eventData = this.eventData[event.id];
    if (!eventData) return;

    this.elements.progressivePanel.style.display = 'block';
    this.showLayer('summary');

    // Populate content layers
    this.populateContentLayers(eventData);

    // Show related evidence
    if (this.options.evidenceGallery && event.evidenceFiles.length > 0) {
      this.showEvidenceThumbnails(event.evidenceFiles);
    }
  }

  populateContentLayers(data) {
    // Summary layer
    const summaryLayer = this.elements.progressiveContent.querySelector('#layer-summary');
    if (summaryLayer) {
      const content = summaryLayer.querySelector('.summary-content');
      content.innerHTML = `
        <h4>${data.title}</h4>
        <p class="event-date">${data.date}</p>
        <p class="summary-text">${data.summary}</p>
      `;
    }

    // Details layer
    const detailsLayer = this.elements.progressiveContent.querySelector('#layer-details');
    if (detailsLayer) {
      const content = detailsLayer.querySelector('.details-content');
      content.innerHTML = data.content;
    }

    // Evidence layer
    const evidenceLayer = this.elements.progressiveContent.querySelector('#layer-evidence');
    if (evidenceLayer) {
      const content = evidenceLayer.querySelector('.evidence-content');
      content.innerHTML = data.evidence || '<p>Evidence documentation for this event.</p>';
    }
  }

  showLayer(layerName) {
    const layers = ['summary', 'details', 'evidence'];
    if (!layers.includes(layerName)) return;

    this.state.currentLayer = layerName;

    layers.forEach(layer => {
      const element = this.elements.progressiveContent.querySelector(`#layer-${layer}`);
      if (element) {
        element.style.display = layer === layerName ? 'block' : 'none';
      }
    });

    this.announceToScreenReader(`Switched to ${layerName} layer`);
  }

  showEvidenceConnections(event) {
    if (!this.elements.evidenceConnections || !this.options.evidenceGallery) return;

    // Clear existing connections
    this.elements.evidenceConnections.innerHTML = '';

    if (event.evidenceFiles.length === 0) {
      this.elements.evidenceConnections.classList.remove('visible');
      return;
    }

    // Create connection lines to evidence gallery
    const eventRect = event.element.getBoundingClientRect();
    const timelineRect = this.elements.svg.getBoundingClientRect();

    event.evidenceFiles.forEach((file, index) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('class', 'evidence-connection');
      line.setAttribute('d', this.generateConnectionPath(eventRect, timelineRect, index));
      this.elements.evidenceConnections.appendChild(line);
    });

    this.elements.evidenceConnections.classList.add('visible');
  }

  generateConnectionPath(eventRect, timelineRect, index) {
    // Calculate path from event to evidence area
    const startX = eventRect.left - timelineRect.left + eventRect.width / 2;
    const startY = eventRect.top - timelineRect.top + eventRect.height / 2;
    const endX = timelineRect.width - 100;
    const endY = 100 + (index * 30);

    return `M${startX},${startY} Q${(startX + endX) / 2},${startY - 50} ${endX},${endY}`;
  }

  showEvidenceThumbnails(evidenceFiles) {
    if (!this.elements.evidenceThumbnails) return;

    this.elements.evidenceThumbnails.innerHTML = '';

    evidenceFiles.forEach((file, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'evidence-thumbnail';
      thumbnail.innerHTML = `
        <img src="/images/evidence/${file}" alt="Evidence ${index + 1}" loading="lazy">
        <div class="thumb-overlay">Evidence ${index + 1}</div>
      `;

      thumbnail.addEventListener('click', () => {
        this.highlightEvidenceInGallery(file);
        thumbnail.classList.add('highlighted');
      });

      this.elements.evidenceThumbnails.appendChild(thumbnail);
    });
  }

  highlightEvidenceInGallery(filename) {
    // If evidence gallery is connected, highlight the specific image
    const galleryImages = document.querySelectorAll('.evidence-gallery__image');
    galleryImages.forEach(img => {
      if (img.src.includes(filename)) {
        img.scrollIntoView({ behavior: 'smooth', block: 'center' });
        img.parentElement.style.border = '3px solid #10b981';
        setTimeout(() => {
          img.parentElement.style.border = '';
        }, 3000);
      }
    });
  }

  navigateEvent(direction) {
    const newIndex = this.state.currentEvent + direction;
    if (newIndex >= 0 && newIndex < this.state.events.length) {
      this.selectEvent(newIndex);
    }
  }

  updateNavigation() {
    if (this.elements.currentEventNum) {
      this.elements.currentEventNum.textContent = this.state.currentEvent + 1;
    }

    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = this.state.currentEvent === 0;
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = this.state.currentEvent === this.state.events.length - 1;
    }
  }

  closeDetails() {
    if (this.elements.progressivePanel) {
      this.elements.progressivePanel.style.display = 'none';
    }

    // Clear active states
    this.elements.events.forEach(el => el.classList.remove('active'));
    this.state.currentEvent = null;

    // Hide evidence connections
    if (this.elements.evidenceConnections) {
      this.elements.evidenceConnections.classList.remove('visible');
    }

    this.announceToScreenReader('Closed event details');
  }

  toggleAnimation() {
    if (this.state.isPlaying) {
      this.pauseAnimation();
    } else {
      this.playAnimation();
    }
  }

  playAnimation() {
    this.state.isPlaying = true;
    const playIcon = this.elements.playBtn.querySelector('.play-icon');
    const pauseIcon = this.elements.playBtn.querySelector('.pause-icon');

    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline';

    // Animate through events
    this.elements.events.forEach((event, index) => {
      setTimeout(() => {
        event.style.opacity = '0.3';
        setTimeout(() => {
          event.style.opacity = '1';
          event.style.transform = 'scale(1.05)';
          setTimeout(() => {
            event.style.transform = 'scale(1)';
          }, 200);
        }, 50);
      }, index * 600);
    });

    // Auto-pause after animation
    setTimeout(() => {
      this.pauseAnimation();
    }, this.elements.events.length * 600 + 1000);
  }

  pauseAnimation() {
    this.state.isPlaying = false;
    const playIcon = this.elements.playBtn.querySelector('.play-icon');
    const pauseIcon = this.elements.playBtn.querySelector('.pause-icon');

    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
  }

  zoom(factor) {
    const newZoom = Math.max(0.5, Math.min(3, this.state.zoomLevel * factor));
    this.setZoom(newZoom);
  }

  setZoom(zoomLevel) {
    this.state.zoomLevel = zoomLevel;
    if (this.elements.svg) {
      this.elements.svg.style.transform = `translate(${this.state.panX}px, ${this.state.panY}px) scale(${zoomLevel})`;
    }

    if (this.elements.viewport) {
      if (zoomLevel > 1) {
        this.elements.viewport.classList.add('zoomed');
      } else {
        this.elements.viewport.classList.remove('zoomed');
      }
    }

    this.announceToScreenReader(`Zoom level: ${Math.round(zoomLevel * 100)}%`);
  }

  resetZoom() {
    this.state.zoomLevel = 1;
    this.state.panX = 0;
    this.state.panY = 0;
    if (this.elements.svg) {
      this.elements.svg.style.transform = 'translate(0px, 0px) scale(1)';
    }
    if (this.elements.viewport) {
      this.elements.viewport.classList.remove('zoomed');
    }
    this.announceToScreenReader('Zoom reset to 100%');
  }

  pan(deltaX, deltaY) {
    this.state.panX += deltaX;
    this.state.panY += deltaY;

    if (this.elements.svg) {
      this.elements.svg.style.transform = `translate(${this.state.panX}px, ${this.state.panY}px) scale(${this.state.zoomLevel})`;
    }
  }

  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }

  getEventData() {
    return {
      'organization-single': {
        title: 'Single "Организация" Released',
        date: 'November 8, 2021',
        summary: 'The release of "Организация" marked a pivotal moment in Russian underground hip-hop, serving as an early warning signal of impending cultural and political upheaval.',
        content: `
          <div class="event-analysis">
            <h5>Cultural Significance</h5>
            <p>The release of "Организация" marked a pivotal moment in Russian underground hip-hop, serving as an early warning signal of impending cultural and political upheaval.</p>

            <h5>Artistic Context</h5>
            <p>The single contained subtle references to systemic resistance and organizational structures, themes that would become central to the broader cultural discourse following the 2022 geopolitical shift.</p>

            <h5>Platform Response</h5>
            <p>Initial reception on streaming platforms was measured, but underground communities recognized the track's prescient commentary on state-society dynamics.</p>

            <h5>Seismic Prediction</h5>
            <p>The track's themes and timing suggest Oxymiron sensed cultural tensions months before they manifested in mass social and political events.</p>
          </div>
        `,
        evidence: `
          <div class="evidence-documentation">
            <h5>Audio Analysis</h5>
            <p>Lyrical themes analysis reveals organizational structures, state-society tension, cultural resistance, and temporal urgency.</p>

            <h5>Release Timing</h5>
            <p>Released exactly 108 days before Russia's invasion of Ukraine, suggesting remarkable prescience.</p>

            <h5>Underground Reception</h5>
            <p>Initial underground circulation patterns and community response documentation.</p>
          </div>
        `
      },
      'mixtape-release': {
        title: 'Album miXXXtape III',
        date: 'November 12, 2021',
        summary: 'miXXXtape III represented a comprehensive exploration of themes introduced in "Организация," expanding the narrative framework around systemic change and cultural resistance.',
        content: `
          <div class="event-analysis">
            <h5>Complete Artistic Statement</h5>
            <p>miXXXtape III represented a comprehensive exploration of themes introduced in "Организация," expanding the narrative framework around systemic change and cultural resistance.</p>

            <h5>Underground Impact</h5>
            <p>The album became a rallying point for underground cultural movements, with tracks being shared through encrypted channels and alternative platforms.</p>

            <h5>Censorship Precursors</h5>
            <p>Several tracks on the album would later be flagged by platform algorithms, suggesting early automated detection of "sensitive" content.</p>

            <h5>Cultural Prediction</h5>
            <p>The album's thematic arc closely paralleled events that would unfold throughout 2022, demonstrating the artist's ability to sense and articulate emerging social tensions.</p>
          </div>
        `,
        evidence: `
          <div class="evidence-documentation">
            <h5>Track-by-Track Analysis</h5>
            <p>Comprehensive analysis reveals consistent themes of systemic change across the 14-song album.</p>

            <h5>Streaming Patterns</h5>
            <p>Initial streaming data shows steady underground circulation with minimal mainstream penetration.</p>

            <h5>Algorithmic Detection</h5>
            <p>Evidence of early platform algorithmic flagging of specific tracks.</p>
          </div>
        `
      },
      'ukraine-invasion': {
        title: 'Russia Invades Ukraine',
        date: 'February 24, 2022',
        summary: 'The invasion of Ukraine marked a fundamental shift in Russian cultural discourse, validating many of the themes Oxymiron had explored months earlier in his work.',
        content: `
          <div class="event-analysis">
            <h5>Cultural Watershed Moment</h5>
            <p>The invasion of Ukraine marked a fundamental shift in Russian cultural discourse, validating many of the themes Oxymiron had explored months earlier in his work.</p>

            <h5>Platform Censorship Acceleration</h5>
            <p>Following the invasion, Russian content platforms implemented aggressive censorship measures, particularly targeting artists who had previously addressed systemic issues.</p>

            <h5>Underground Amplification</h5>
            <p>The events led to increased circulation of Oxymiron's earlier work through alternative channels, as audiences sought cultural artifacts that had "predicted" the crisis.</p>

            <h5>Seismic Validation</h5>
            <p>The timing and themes of "Организация" and miXXXtape III were retrospectively recognized as early cultural seismography—art sensing and expressing social tensions before they manifested politically.</p>
          </div>
        `,
        evidence: `
          <div class="evidence-documentation">
            <h5>Platform Response Analysis</h5>
            <p>Comprehensive documentation of platform censorship acceleration following February 24, 2022.</p>

            <h5>Underground Circulation Metrics</h5>
            <p>Evidence of increased sharing through alternative channels and decentralized platforms.</p>

            <h5>Cultural Retrospective Analysis</h5>
            <p>Documentation of how earlier works were recontextualized following the invasion.</p>
          </div>
        `
      },
      'foreign-agent': {
        title: 'Oxymiron Designated "Foreign Agent"',
        date: 'October 7, 2022',
        summary: 'The foreign agent designation represented the state\'s formal acknowledgment of Oxymiron\'s cultural influence and an attempt to marginalize his voice in ongoing discourse.',
        content: `
          <div class="event-analysis">
            <h5>Official Silencing Campaign</h5>
            <p>The foreign agent designation represented the state's formal acknowledgment of Oxymiron's cultural influence and an attempt to marginalize his voice in ongoing discourse.</p>

            <h5>Platform Compliance</h5>
            <p>Major streaming platforms began removing or restricting access to Oxymiron's catalog, including the prescient tracks from late 2021.</p>

            <h5>Cultural Martyrdom</h5>
            <p>The designation ironically amplified interest in Oxymiron's work, particularly the earlier tracks that had "predicted" the current crisis.</p>

            <h5>Artistic Vindication</h5>
            <p>The state's response validated the power and accuracy of Oxymiron's cultural seismography, confirming that artists can indeed sense and articulate societal tensions before they reach critical mass.</p>
          </div>
        `,
        evidence: `
          <div class="evidence-documentation">
            <h5>Official Documentation</h5>
            <p>Russian Foreign Agent Registry entry and related legal materials from the Ministry of Justice.</p>

            <h5>Platform Compliance Timeline</h5>
            <p>Documentation of systematic content removal and access restrictions across major platforms.</p>

            <h5>Underground Response</h5>
            <p>Analysis of increased alternative platform migration and cultural canonization of the November 2021 works.</p>
          </div>
        `
      }
    };
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if enhanced timeline container exists
  const timelineContainer = document.querySelector('.enhanced-cultural-timeline');
  if (timelineContainer && typeof EnhancedTimeline !== 'undefined') {
    // Initialize if not already done
    if (!timelineContainer.hasAttribute('data-initialized')) {
      const config = {
        container: '.enhanced-cultural-timeline',
        evidenceGallery: timelineContainer.getAttribute('data-evidence-gallery') || '',
        zoom: timelineContainer.getAttribute('data-zoom') === 'true',
        gestures: timelineContainer.getAttribute('data-gestures') === 'true',
        progressive: timelineContainer.getAttribute('data-progressive') === 'true'
      };

      new EnhancedTimeline(config);
      timelineContainer.setAttribute('data-initialized', 'true');
    }
  }
});

// Export for manual initialization
window.EnhancedTimeline = EnhancedTimeline;