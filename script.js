/* ==========================================================================
   WE3X — Global Script
   Sticky header, mobile nav, scroll reveal, counters, laptop scroll animation,
   typing effect, FAQ accordion, ripple buttons, back-to-top, active nav.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ Sticky Header ------------------------------ */
  const header = document.querySelector('.site-header');
  const toTopBtn = document.querySelector('.totop-btn');

  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (toTopBtn) {
      if (window.scrollY > 500) toTopBtn.classList.add('show');
      else toTopBtn.classList.remove('show');
    }
  }
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ------------------------------ Mobile Nav ------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const navBackdrop = document.querySelector('.nav-backdrop');
  const menuClose = document.querySelector('.menu-close');

  function closeMobileNav() {
    hamburger && hamburger.classList.remove('active');
    navMobile && navMobile.classList.remove('open');
    navBackdrop && navBackdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
 function toggleMobileNav() {

    const isOpen = navMobile && navMobile.classList.contains('open');

    if (isOpen) {

        closeMobileNav();

    } else {

        hamburger.classList.add('active');

        navMobile.classList.add('open');

        navBackdrop.classList.add('open');

        document.body.classList.add('menu-open');

    }

}
  hamburger && hamburger.addEventListener('click', toggleMobileNav);
  navBackdrop && navBackdrop.addEventListener('click', closeMobileNav);
  menuClose && menuClose.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.nav-mobile a').forEach(a => a.addEventListener('click', closeMobileNav));
  document.addEventListener("keydown", function(e){

    if(e.key==="Escape"){

        closeMobileNav();

    }

});


  /* ------------------------------ Active Nav Highlight ------------------------------ */
  (function markActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ------------------------------ Smooth Scroll (in-page anchors) ------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - (window.innerWidth > 768 ? 84 : 72);
          window.scrollTo({ top, behavior: 'smooth' });
          closeMobileNav();
        }
      }
    });
  });

  /* ------------------------------ Back To Top ------------------------------ */
  toTopBtn && toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------ Scroll Reveal (Intersection Observer) ------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.setProperty('--delay', (i % 4) * 0.1 + 's');
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ------------------------------ Counters ------------------------------ */
  const counters = document.querySelectorAll('.counter-item .num[data-target]');
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ------------------------------ Progress Bars ------------------------------ */
  const progressFills = document.querySelectorAll('.progress-fill[data-value]');
  if ('IntersectionObserver' in window && progressFills.length) {
    const progIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-value') + '%';
          progIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    progressFills.forEach(p => progIO.observe(p));
  }

  /* ------------------------------ Hero Typing Effect ------------------------------ */
  const typedEl = document.querySelector('.typed');
  if (typedEl) {
    const words = JSON.parse(typedEl.getAttribute('data-words') || '[]');
    let wi = 0, ci = 0, deleting = false;
    function typeLoop() {
      if (!words.length) return;
      const word = words[wi];
      if (!deleting) {
        ci++;
        typedEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        ci--;
        typedEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }
    typeLoop();
  }

  /* ------------------------------ FAQ Accordion ------------------------------ */
  document.querySelectorAll('.faq-item .faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ------------------------------ Button Ripple ------------------------------ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  
  /* ------------------------------ Parallax (hero bg) ------------------------------ */
  const parallaxEls = document.querySelectorAll('.parallax-layer');
  if (parallaxEls.length) {
    let pTicking = false;
    function updateParallax() {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0.3');
        el.style.transform = `translate3d(0, ${y * speed}px, 0) scale(1.08)`;
      });
      pTicking = false;
    }
    document.addEventListener('scroll', () => {
      if (!pTicking) { requestAnimationFrame(updateParallax); pTicking = true; }
    }, { passive: true });
    updateParallax();
  }

})();