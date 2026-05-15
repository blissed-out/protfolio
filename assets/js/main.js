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

  if (soundToggle && endTitlesAudio) {
    endTitlesAudio.volume = 0.38;

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
      if (soundToggle.getAttribute('aria-pressed') === 'true' && endTitlesAudio.paused) {
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

    soundToggle.addEventListener('click', () => {
      if (endTitlesAudio.paused) {
        playEndTitles({ keepPromptOnBlock: false });
      } else {
        endTitlesAudio.pause();
        setSoundToggleState(false);
        setSoundPromptVisible(false);
      }
    });
    endTitlesAudio.addEventListener('ended', () => setSoundToggleState(false));
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
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2500
    });
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

})();
