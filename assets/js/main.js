(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * End Titles sound toggle
   */
  const soundToggle = document.querySelector('[data-sound-toggle]');
  const soundPrompt = document.querySelector('[data-sound-prompt]');
  const endTitlesAudio = document.querySelector('#end-titles-audio');

  function setSoundPromptVisible(isVisible) {
    if (!soundPrompt) return;
    soundPrompt.classList.toggle('is-visible', isVisible);
    soundPrompt.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
    soundPrompt.tabIndex = isVisible ? 0 : -1;
  }

  function setSoundToggleState(isPlaying) {
    if (!soundToggle) return;
    const icon = soundToggle.querySelector('i');
    soundToggle.classList.toggle('is-playing', isPlaying);
    soundToggle.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    soundToggle.setAttribute('aria-label', isPlaying ? 'Pause End Titles' : 'Play End Titles');
    soundToggle.setAttribute('title', isPlaying ? 'Pause End Titles' : 'Play End Titles');
    if (icon) {
      icon.className = isPlaying ? 'bi bi-volume-up' : 'bi bi-volume-mute';
    }
  }

  if (endTitlesAudio) {
    endTitlesAudio.volume = 0.38;

    // Two-track random playlist
    const audioTracks = [
      'assets/audio/end-titles.mp3',
      'assets/audio/I-Built-Myself-A-Life.mp3'
    ];
    let trackOrder = [...audioTracks];
    if (Math.random() > 0.5) trackOrder.reverse();
    let currentTrackIdx = 0;
    endTitlesAudio.src = trackOrder[0];

    function playEndTitles(options = {}) {
      const { keepPromptOnBlock = true } = options;
      return endTitlesAudio.play()
        .then(() => {
          setSoundToggleState(true);
          setSoundPromptVisible(false);
        })
        .catch(() => {
          setSoundToggleState(true);
          setSoundPromptVisible(keepPromptOnBlock);
        });
    }

    setSoundToggleState(true);
    setSoundPromptVisible(true);

    function beginFromPrompt() {
      if (endTitlesAudio.paused) {
        playEndTitles();
      }
    }

    if (soundPrompt) {
      soundPrompt.addEventListener('click', beginFromPrompt);
      soundPrompt.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          beginFromPrompt();
        }
      });
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (endTitlesAudio.paused) {
          playEndTitles({ keepPromptOnBlock: false });
        } else {
          endTitlesAudio.pause();
          setSoundToggleState(false);
          setSoundPromptVisible(false);
        }
      });
    }
    endTitlesAudio.addEventListener('ended', () => {
      currentTrackIdx = (currentTrackIdx + 1) % trackOrder.length;
      if (currentTrackIdx === 0) {
        // Reshuffle order each full cycle
        if (Math.random() > 0.5) trackOrder.reverse();
      }
      endTitlesAudio.src = trackOrder[currentTrackIdx];
      endTitlesAudio.play().then(() => {
        setSoundToggleState(true);
      }).catch(() => {
        setSoundToggleState(false);
      });
    });
    endTitlesAudio.addEventListener('pause', () => setSoundToggleState(false));
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll
   */
  function aosInit() {
    AOS.init({
      duration: 500,
      easing: 'ease-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js — delayed for cinematic reveal
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    setTimeout(function() {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2500
      });
    }, 6500);
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Section dots scrollspy
   */
  const sectionDots = document.querySelectorAll('.section-dot');

  function sectionDotsScrollspy() {
    sectionDots.forEach(dot => {
      const sectionId = dot.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (!section) return;
      const position = window.scrollY + window.innerHeight / 2;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        sectionDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  }

  if (sectionDots.length) {
    window.addEventListener('load', sectionDotsScrollspy);
    document.addEventListener('scroll', sectionDotsScrollspy);
  }

  /**
   * Firefly cursor
   */
  const fireflyCursor = document.getElementById('fireflyCursor');
  const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (fireflyCursor && hasPointer) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let lastParticleTime = 0;
    let lastPx = -100, lastPy = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dx = e.clientX - lastPx;
      const dy = e.clientY - lastPy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const now = Date.now();

      if (dist > 4 && now - lastParticleTime > 40) {
        spawnParticle(e.clientX, e.clientY);
        lastParticleTime = now;
        lastPx = e.clientX;
        lastPy = e.clientY;
      }
    });

    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      fireflyCursor.style.left = cursorX + 'px';
      fireflyCursor.style.top = cursorY + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    function spawnParticle(x, y) {
      const p = document.createElement('div');
      p.className = 'firefly-particle';
      const ox = (Math.random() - 0.5) * 8;
      const oy = (Math.random() - 0.5) * 8;
      const s = 0.6 + Math.random() * 0.8;
      p.style.left = x + ox + 'px';
      p.style.top = y + oy + 'px';
      p.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
      // Randomize warmth
      const hue = 70 + Math.random() * 50; // 70-120 = yellow-green range
      const lum = 70 + Math.random() * 15;
      p.style.background = 'radial-gradient(circle, hsla(' + hue + ',80%,' + lum + '%,0.9), transparent)';
      p.style.boxShadow = '0 0 ' + (3 + Math.random() * 4) + 'px 1px hsla(' + hue + ',70%,60%,0.4)';
      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transition = 'opacity 0.9s ease, transform 1.1s ease';
        p.style.opacity = '0';
        p.style.transform = 'translate(-50%,-50%) translate(' + (ox + (Math.random() - 0.5) * 16) + 'px,' + (oy - 8 - Math.random() * 14) + 'px) scale(0)';
      });

      setTimeout(() => p.remove(), 1200);
    }

    document.addEventListener('mouseleave', () => {
      fireflyCursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      fireflyCursor.style.opacity = '';
    });
  }

  /**
   * Cinematic hero text reveal
   */
  function cinematicReveal() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var status = hero.querySelector('.hero-status');
    var title = hero.querySelector('.hero-title');
    var vine = hero.querySelector('.hero-vine-accent');
    var aspirant = hero.querySelector('.hero-aspirant');
    var flow = hero.querySelector('.hero-flow');
    var stream = hero.querySelector('.hero-stream');

    function reveal(el, delay) {
      if (!el) return;
      setTimeout(function() { el.classList.add('cinematic-visible'); }, delay);
    }

    // Character-by-character title
    if (title) {
      var text = title.textContent;
      title.innerHTML = '';
      var baseDelay = 2.0;
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.className = 'char-reveal';
        span.style.animationDelay = (baseDelay + i * 0.09) + 's';
        title.appendChild(span);
      }
    }

    // Staggered reveals
    reveal(status, 800);
    reveal(vine, 3800);
    reveal(aspirant, 4600);
    reveal(flow, 5400);
    reveal(stream, 6200);
  }

  window.addEventListener('load', function() {
    setTimeout(cinematicReveal, 300);
  });

  /**
   * Section cinematic reveals on scroll
   */
  var revealTargets = document.querySelectorAll('.cinematic-content, .about-banner-card');

  if (revealTargets.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-revealed');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealTargets.forEach(function(el) {
      sectionObserver.observe(el);
    });
  }

})();
