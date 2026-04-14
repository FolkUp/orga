// Hero & Visual Storytelling Enhancement - Phase 3
// Advanced scroll interactions and multimedia storytelling

document.addEventListener('DOMContentLoaded', function() {

  // Performance optimizations
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  // Main scroll handler with throttling
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  // Unified scroll update handler
  function updateOnScroll() {
    updateReadingProgress();
    updateParallaxElements();
    updateScrollReveal();
    updateFloatingNav();
    updateSectionIndicators();
    ticking = false;
  }

  // 1. Enhanced Reading Progress
  function initReadingProgress() {
    const progressContainer = document.querySelector('.scroll-progress-container') || createProgressContainer();
    const progressBar = progressContainer.querySelector('.scroll-progress-bar');

    function updateReadingProgress() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = Math.min(Math.max((winScroll / height) * 100, 0), 100);

      progressBar.style.width = scrolled + '%';
      progressBar.parentElement.setAttribute('aria-valuenow', Math.round(scrolled));

      // Show progress after hero section
      const hero = document.querySelector('.hero-platform');
      if (hero && winScroll > hero.offsetHeight * 0.3) {
        progressContainer.classList.add('visible');
      } else if (progressContainer.classList.contains('visible')) {
        progressContainer.classList.remove('visible');
      }
    }

    function createProgressContainer() {
      const container = document.createElement('div');
      container.className = 'scroll-progress-container';
      container.setAttribute('role', 'progressbar');
      container.setAttribute('aria-label', 'Reading progress');
      container.setAttribute('aria-valuenow', '0');
      container.setAttribute('aria-valuemin', '0');
      container.setAttribute('aria-valuemax', '100');

      const bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      container.appendChild(bar);

      document.body.appendChild(container);
      return container;
    }

    window.updateReadingProgress = updateReadingProgress;
  }

  // 2. Advanced Parallax Effects
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function updateParallaxElements() {
      if (isReducedMotion || parallaxElements.length === 0) return;

      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }

    window.updateParallaxElements = updateParallaxElements;
  }

  // 3. Scroll-Triggered Reveal Animations
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    function updateScrollReveal() {
      // Fallback for browsers without IntersectionObserver
      if (!window.IntersectionObserver) {
        revealElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;

          if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
          }
        });
      }
    }

    window.updateScrollReveal = updateScrollReveal;
  }

  // 4. Floating Navigation for Long-form Content
  function initFloatingNav() {
    const sections = document.querySelectorAll('h2[id], h3[id], .timeline-anchor');
    if (sections.length === 0) return;

    const nav = createFloatingNav(sections);

    function updateFloatingNav() {
      const scrollPosition = window.scrollTop || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const hero = document.querySelector('.hero-platform');

      // Show nav after hero section
      if (hero && scrollPosition > hero.offsetHeight * 0.8) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }

      // Update active section
      let activeSection = null;
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.3 && rect.bottom >= 0) {
          activeSection = section;
        }
      });

      nav.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        if (activeSection && link.getAttribute('href') === '#' + activeSection.id) {
          link.classList.add('active');
        }
      });
    }

    function createFloatingNav(sections) {
      const nav = document.createElement('nav');
      nav.className = 'floating-nav';
      nav.setAttribute('aria-label', 'Section navigation');

      const ul = document.createElement('ul');
      nav.appendChild(ul);

      sections.forEach(section => {
        if (!section.id) return;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + section.id;
        a.textContent = getNavLabel(section);
        a.addEventListener('click', handleNavClick);

        li.appendChild(a);
        ul.appendChild(li);
      });

      document.body.appendChild(nav);
      return nav;
    }

    function getNavLabel(section) {
      if (section.classList.contains('timeline-anchor')) {
        return section.id.replace('year-', '') + '';
      }
      return section.textContent.trim().substring(0, 25) + (section.textContent.length > 25 ? '...' : '');
    }

    function handleNavClick(e) {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }

    window.updateFloatingNav = updateFloatingNav;
  }

  // 5. Section Indicators and Visual Enhancements
  function initSectionIndicators() {
    const sections = document.querySelectorAll('.investigation-section, section, article');

    sections.forEach(section => {
      if (!section.querySelector('.section-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        section.style.position = 'relative';
        section.appendChild(indicator);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.3
    });

    sections.forEach(section => observer.observe(section));

    function updateSectionIndicators() {
      // Fallback for browsers without IntersectionObserver
      if (!window.IntersectionObserver) {
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.7) {
            section.classList.add('in-view');
          }
        });
      }
    }

    window.updateSectionIndicators = updateSectionIndicators;
  }

  // 6. Enhanced Smooth Scrolling for Anchor Links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = 80;
        const offsetTop = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        setTimeout(() => {
          targetElement.focus({ preventScroll: true });
        }, 500);
      });
    });
  }

  // 7. Investigation Platform Event Markers Enhancement
  function initEventMarkers() {
    const markers = document.querySelectorAll('.event-marker');

    markers.forEach(marker => {
      marker.addEventListener('click', function() {
        const year = this.dataset.year;
        const targetId = 'year-' + year;
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Visual feedback
          this.style.transform = 'scale(1.3)';
          setTimeout(() => {
            this.style.transform = '';
          }, 300);
        }
      });

      // Enhanced keyboard navigation
      marker.setAttribute('tabindex', '0');
      marker.setAttribute('role', 'button');
      marker.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });

      // Enhanced hover effects
      marker.addEventListener('mouseenter', function() {
        if (!isReducedMotion) {
          this.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
          this.style.transform = 'scale(1.15)';
          this.style.filter = 'brightness(1.2) drop-shadow(0 0 12px currentColor)';
        }
      });

      marker.addEventListener('mouseleave', function() {
        if (!isReducedMotion) {
          this.style.transform = '';
          this.style.filter = '';
        }
      });
    });
  }

  // 8. Typography Enhancement - First Letter Drop Caps
  function initDropCaps() {
    const narrativeElements = document.querySelectorAll('.narrative-text');

    narrativeElements.forEach(element => {
      const firstParagraph = element.querySelector('p:first-of-type') || element;
      const text = firstParagraph.textContent.trim();

      if (text.length > 0 && !firstParagraph.querySelector('.first-letter')) {
        const firstLetter = text.charAt(0);
        const restOfText = text.slice(1);

        firstParagraph.innerHTML = `<span class="first-letter">${firstLetter}</span>${restOfText}`;
      }
    });
  }

  // 9. Performance Monitoring
  function initPerformanceMonitoring() {
    let scrollEvents = 0;
    let lastCheck = Date.now();

    window.addEventListener('scroll', () => {
      scrollEvents++;

      // Log performance metrics every 5 seconds
      if (Date.now() - lastCheck > 5000) {
        const fps = Math.round(scrollEvents / 5);
        if (fps < 30 && !isReducedMotion) {
          console.warn('Low scroll performance detected. Consider reducing animations.');
        }
        scrollEvents = 0;
        lastCheck = Date.now();
      }
    }, { passive: true });
  }

  // Main Initialization
  function init() {
    // Core functionality
    initReadingProgress();
    initParallax();
    initScrollReveal();
    initFloatingNav();
    initSectionIndicators();
    initSmoothScroll();

    // Enhancement features
    initEventMarkers();
    initDropCaps();

    // Development features
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
      initPerformanceMonitoring();
    }

    // Attach scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });

    // Initial update
    requestTick();
  }

  // Initialize everything
  init();

  // Expose utilities for other scripts
  window.ORGA = window.ORGA || {};
  window.ORGA.storytelling = {
    updateReadingProgress,
    updateParallaxElements,
    updateScrollReveal,
    updateFloatingNav,
    updateSectionIndicators
  };
});