(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initIntroLoader();
    initMobileNav();
    initScrollReveal();
    initHeaderScrollState();
    initHeroCarousel();
    initHeroParallax();
  });

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initIntroLoader() {
    const loader = document.getElementById('introLoader');
    if (!loader) { document.body.classList.add('intro-done'); return; }

    document.body.classList.add('intro-active');

    const dismiss = function () {
      loader.classList.add('is-hidden');
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-done');
      setTimeout(function () { loader.remove(); }, 900);
    };

    const delay = prefersReducedMotion() ? 200 : 2400;
    setTimeout(dismiss, delay);
  }

  function initMobileNav() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll('.fade-in, .reveal-up');
    if (!('IntersectionObserver' in window) || !targets.length) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  function initHeaderScrollState() {
    const header = document.querySelector('header');
    if (!header) return;

    const onScroll = function () {
      if (window.scrollY > 20) {
        header.classList.add('shadow-sm');
      } else {
        header.classList.remove('shadow-sm');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const counter = document.getElementById('slideNum');
    if (slides.length < 2) return;

    let idx = 0;
    const pad = function (n) { return n < 10 ? '0' + n : String(n); };

    const advance = function () {
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');

      if (counter) {
        counter.classList.add('is-switching');
        setTimeout(function () {
          counter.textContent = pad(idx + 1);
          counter.classList.remove('is-switching');
        }, 280);
      }
    };

    if (prefersReducedMotion()) return;
    setInterval(advance, 6500);
  }

  function initHeroParallax() {
    if (prefersReducedMotion()) return;
    const targets = document.querySelectorAll('[data-parallax]');
    if (!targets.length) return;

    let ticking = false;
    const update = function () {
      const y = window.scrollY;
      targets.forEach(function (el) {
        const factor = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = 'translate3d(0,' + (y * factor * -1) + 'px,0)';
      });
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }
})();
