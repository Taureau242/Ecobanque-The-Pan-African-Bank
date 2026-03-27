/* ==============================
   ECOBANK – SCRIPT.JS
   Toutes les interactions et animations
   ============================== */

(function () {
  'use strict';

  /* Ici on gère la navigation entre les pages */
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-page]');

  function showPage(pageId) {
    // Hide all
    pages.forEach(p => p.classList.remove('active'));
    // Show target
    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Close mobile menu
    const navMenu = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      if (page) showPage(page);
    });
  });

  /* Ici on gère le menu hamburger pour mobile */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.has-dropdown .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.closest('.nav-item');
        parent.classList.toggle('open');
      }
    });
  });

  /* ===== STICKY HEADER ===== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Back to top
    const backBtn = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  document.getElementById('back-to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== HERO SLIDER ===== */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('#slide-dots .dot');
  let currentSlide = 0;
  let sliderInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  document.getElementById('slide-next').addEventListener('click', function () {
    nextSlide();
    resetSliderInterval();
  });
  document.getElementById('slide-prev').addEventListener('click', function () {
    prevSlide();
    resetSliderInterval();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', function () {
      goToSlide(i);
      resetSliderInterval();
    });
  });

  function startSliderInterval() {
    sliderInterval = setInterval(nextSlide, 5000);
  }
  function resetSliderInterval() {
    clearInterval(sliderInterval);
    startSliderInterval();
  }
  startSliderInterval();

  /* ===== PRODUCTS TABS ===== */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const tabId = 'tab-' + this.getAttribute('data-tab');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    });
  });

  /* ===== TESTIMONIALS SLIDER ===== */
  const testimonials = document.querySelectorAll('.testimonial');
  const testDots = document.querySelectorAll('#test-dots .dot');
  let currentTest = 0;
  let testInterval;

  function goToTest(index) {
    testimonials[currentTest].classList.remove('active');
    testDots[currentTest].classList.remove('active');
    currentTest = (index + testimonials.length) % testimonials.length;
    testimonials[currentTest].classList.add('active');
    testDots[currentTest].classList.add('active');
  }

  testDots.forEach((dot, i) => {
    dot.addEventListener('click', function () {
      goToTest(i);
      clearInterval(testInterval);
      testInterval = setInterval(() => goToTest(currentTest + 1), 6000);
    });
  });

  testInterval = setInterval(() => goToTest(currentTest + 1), 6000);

  /* ===== STATS COUNTER ANIMATION ===== */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats-section');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(animateCounter);
    }
  }, { threshold: 0.4 });

  if (statsSection) statsObserver.observe(statsSection);

  /* ===== LOAN CALCULATOR ===== */
  const loanAmount = document.getElementById('loan-amount');
  const loanDuration = document.getElementById('loan-duration');
  const loanRate = document.getElementById('loan-rate');

  function formatNumber(n) {
    return Math.round(n).toLocaleString('fr-FR');
  }

  function updateCalculator() {
    if (!loanAmount) return;
    const P = parseFloat(loanAmount.value);
    const n = parseFloat(loanDuration.value);
    const r = parseFloat(loanRate.value) / 100 / 12;

    // Update displays
    document.getElementById('amount-display').textContent = formatNumber(P);
    document.getElementById('duration-display').textContent = loanDuration.value;
    document.getElementById('rate-display').textContent = loanRate.value;

    // Monthly payment formula
    let monthly;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalCost = monthly * n;
    const totalInterest = totalCost - P;

    document.getElementById('monthly-payment').textContent = formatNumber(monthly) + ' FCFA';
    document.getElementById('total-cost').textContent = formatNumber(totalCost) + ' FCFA';
    document.getElementById('total-interest').textContent = formatNumber(totalInterest) + ' FCFA';
  }

  if (loanAmount) {
    loanAmount.addEventListener('input', updateCalculator);
    loanDuration.addEventListener('input', updateCalculator);
    loanRate.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  /* ===== SCROLL REVEAL ANIMATION ===== */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function observeReveal() {
    document.querySelectorAll(
      '.product-card, .qs-card, .biz-card, .news-card, .stat-box, .invest-card, .xpress-feature, .vision-card, .branch-card'
    ).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      revealObserver.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', observeReveal);

  // Add CSS for revealed state
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // Re-observe after page change
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', function () {
      setTimeout(observeReveal, 100);
    });
  });

  /* ===== BRANCH SEARCH (UI simulation) ===== */
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      const city = document.getElementById('city-search').value.trim();
      const country = document.getElementById('country-select').value;

      if (!city && !country) {
        this.textContent = '⚠ Saisissez une ville';
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-search"></i> Rechercher';
        }, 2000);
        return;
      }

      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Résultats affichés';
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-search"></i> Rechercher';
        }, 2000);
      }, 1000);
    });
  }

  /* ===== NEWSLETTER FORM ===== */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.querySelector('button').addEventListener('click', function () {
      const input = form.querySelector('input');
      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#c62828';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }
      this.innerHTML = '<i class="fas fa-check"></i>';
      input.value = '';
      setTimeout(() => { this.innerHTML = '<i class="fas fa-paper-plane"></i>'; }, 3000);
    });
  });

  /* ===== SCROLL STAGGER for product cards ===== */
  function staggerCards() {
    document.querySelectorAll('.products-grid .product-card, .biz-card, .invest-card').forEach((card, i) => {
      card.style.transitionDelay = (i * 80) + 'ms';
    });
  }
  staggerCards();

  /* ===== LOGO HOVER EFFECT ===== */
  document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('mouseenter', function () {
      const icon = this.querySelector('.logo-icon');
      if (icon) icon.style.transform = 'rotate(-10deg) scale(1.1)';
    });
    logo.addEventListener('mouseleave', function () {
      const icon = this.querySelector('.logo-icon');
      if (icon) icon.style.transform = '';
    });
  });
  document.querySelectorAll('.logo-icon').forEach(el => {
    el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  /* ===== SMOOTH INIT ===== */
  window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

})();
