/* ============================================================
   MOTION — shared micro-interaction engine (all pages)
   Plain ES5, no dependencies. Exposes window.QCmotion.
   All effects respect prefers-reduced-motion automatically.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  function hasIO() { return 'IntersectionObserver' in window; }

  /* ---------------- Scroll reveals ---------------- */
  function initReveals(root) {
    var scope = root || document;
    var reveals = scope.querySelectorAll('.reveal:not(.is-visible)');
    if (!reveals.length) return;
    if (reduceMotion || !hasIO()) {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
  }

  /* ---------------- Stagger children ---------------- */
  function initStagger(root) {
    var scope = root || document;
    var groups = scope.querySelectorAll('[data-stagger]');
    if (!groups.length) return;
    if (reduceMotion || !hasIO()) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var kids = entry.target.children;
        Array.prototype.forEach.call(kids, function (kid, i) {
          kid.style.setProperty('--stagger-delay', (i * 90) + 'ms');
          kid.classList.add('stagger-in');
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(groups, function (el) { observer.observe(el); });
  }

  /* ---------------- Count up numbers ---------------- */
  function initCountUp(root) {
    var scope = root || document;
    var els = scope.querySelectorAll('[data-countup]:not(.counted)');
    if (!els.length) return;
    function run(el) {
      el.classList.add('counted');
      var target = parseFloat(el.getAttribute('data-countup'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!hasIO()) { Array.prototype.forEach.call(els, run); return; }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(els, function (el) { observer.observe(el); });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initProgress() {
    if (document.querySelector('.scroll-progress')) return;
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    if (document.querySelector('.back-to-top')) return;
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', function () {
      var show = (window.pageYOffset || document.documentElement.scrollTop) > 600;
      btn.style.opacity = show ? '1' : '0';
      btn.style.visibility = show ? 'visible' : 'hidden';
      btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    }, { passive: true });
  }

  /* ---------------- Click ripple on primary buttons ---------------- */
  function initRipple(root) {
    var scope = root || document;
    var btns = scope.querySelectorAll('.btn--primary');
    Array.prototype.forEach.call(btns, function (btn) {
      if (btn.dataset.rippleBound) return;
      btn.dataset.rippleBound = '1';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', function (e) {
        if (reduceMotion) return;
        var rect = btn.getBoundingClientRect();
        var span = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        span.style.cssText =
          'position:absolute;border-radius:50%;background:rgba(255,255,255,0.45);' +
          'width:' + size + 'px;height:' + size + 'px;' +
          'left:' + (e.clientX - rect.left - size / 2) + 'px;' +
          'top:' + (e.clientY - rect.top - size / 2) + 'px;' +
          'transform:scale(0);pointer-events:none;animation:rippleAnim 0.6s ease-out forwards;';
        btn.appendChild(span);
        setTimeout(function () { span.remove(); }, 650);
      });
    });
  }

  /* ---------------- Cursor glow (desktop only) ---------------- */
  function initCursorGlow() {
    if (reduceMotion || isTouch) return;
    if (document.querySelector('.cursor-glow')) return;
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    glow.style.cssText =
      'position:fixed;width:400px;height:400px;border-radius:50%;pointer-events:none;z-index:1;' +
      'background:radial-gradient(circle, rgba(0,206,209,0.10) 0%, transparent 60%);' +
      'transform:translate(-50%,-50%);transition:opacity 0.3s ease;opacity:0;will-change:transform;';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
  }

  /* ---------------- Boot everything ---------------- */
  var booted = false;
  function bootAll() {
    if (booted) return;
    booted = true;
    initReveals();
    initStagger();
    initCountUp();
    initProgress();
    initBackToTop();
    initRipple();
    initCursorGlow();
  }

  window.QCmotion = {
    reveals: initReveals,
    stagger: initStagger,
    countUp: initCountUp,
    progress: initProgress,
    backToTop: initBackToTop,
    ripple: initRipple,
    cursorGlow: initCursorGlow,
    bootAll: bootAll
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
