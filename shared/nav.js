/* ============================================================
   NAV — shared nav + footer injection for the Qingchu site.
   Pages contain <div id="nav-mount"></div> and
   <div id="footer-mount"></div>; this script fills them in,
   marks the active link from <body data-page="...">, and wires
   the mobile drawer.
   ============================================================ */

(function () {
  'use strict';

  /* ---------------- Config ---------------- */
  var BRAND_MARK = '清楚';
  var BRAND_NAME = 'Qingchu';

  /* ---------------- Path base (GitHub Pages project-site safe) --------- */
  // On innovationearthprojects.org the site is served from the domain root,
  // but this project lives under /Qingchu-website/ on GitHub Pages. Derive
  // the base from shared/nav.js's own URL so internal links never 404 or
  // "leave" the site by jumping to the domain root.
  var BASE = (function () {
    try {
      var src = document.currentScript && document.currentScript.src;
      if (!src) {
        var s = document.getElementsByTagName('script');
        for (var i = s.length - 1; i >= 0; i--) {
          if (/shared\/nav\.js/.test(s[i].src)) { src = s[i].src; break; }
        }
      }
      if (src) return src.replace(/shared\/nav\.js.*$/, '');
    } catch (e) { /* fall through */ }
    return '/';
  })();
  function path(p) { return BASE + p; }

  /* ---------------- External-link policy ---------------- */
  // Any link that leaves this site must point back to the parent site,
  // innovationearthprojects.org — with a graceful fallback if it is down.
  var PARENT_SITE = 'https://innovationearthprojects.org';

  function ext(url, label, iconClass, extraClass) {
    return '<a class="' + (extraClass || 'ext-parent') + '" data-ext="parent" ' +
           'href="' + url + '" target="_blank" rel="noopener">' +
           (iconClass ? '<i class="' + iconClass + '" aria-hidden="true"></i> ' : '') +
           label +
           '<i class="fas fa-arrow-up-right-from-square ext__icon" aria-hidden="true"></i>' +
           '</a>';
  }

  var NAV_LINKS = [
    { href: path('#features'),    label: 'Features', key: 'features' },
    { href: path('docs.html'),    label: 'Language', key: 'language' },
    { href: path('examples.html'), label: 'Examples', key: 'examples' },
    { href: path('#status'),      label: 'Status',   key: 'status' },
    {
      href: PARENT_SITE,
      label: 'Innovation Earth Projects',
      key: 'iep',
      external: true
    }
  ];

  var FOOTER_SITE_LINKS = [
    { href: path(''),            label: 'Home' },
    { href: path('docs.html'),   label: 'Language Reference' },
    { href: path('examples.html'), label: 'Examples' }
  ];

  var FOOTER_RESOURCE_LINKS = [
    { href: path('#status'),      label: 'Project Status' },
    { href: path('#faq'),         label: 'FAQ' },
    { href: path('#get-started'), label: 'Get Started' }
  ];

  /* ---------------- Templates ---------------- */
  function buildNavLinks() {
    var out = '';
    for (var i = 0; i < NAV_LINKS.length; i++) {
      var l = NAV_LINKS[i];
      if (l.external) {
        out += '<a class="nav__ext" href="' + l.href +
               '" target="_blank" rel="noopener">' + l.label +
               '<i class="fas fa-arrow-up-right-from-square nav__ext-icon" aria-hidden="true"></i></a>';
      } else {
        out += '<a href="' + l.href + '" data-key="' + l.key + '">' + l.label + '</a>';
      }
    }
    return out;
  }

  function navTemplate() {
    return (
      '<nav class="nav" aria-label="Primary">' +
        '<div class="nav__inner">' +
          '<a class="nav__brand" href="' + path('') + '">' +
            '<span class="nav__mark" aria-hidden="true">' + BRAND_MARK + '</span>' +
            '<span class="nav__wordmark">' + BRAND_NAME +
              '<span class="nav__wordmark-zh">· a readable language</span>' +
            '</span>' +
          '</a>' +
          '<button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false">' +
            '<i class="fas fa-bars"></i>' +
          '</button>' +
          '<div class="nav__links" id="nav-links">' +
            buildNavLinks() +
            '<span class="nav__cta">' +
              ext(PARENT_SITE, 'Innovation Earth Projects', 'fas fa-globe',
                  'btn btn--primary btn--sm ext-parent ext-parent--nav') +
            '</span>' +
          '</div>' +
        '</div>' +
      '</nav>'
    );
  }

  function linkList(links) {
    var out = '';
    for (var i = 0; i < links.length; i++) {
      out += '<li><a href="' + links[i].href + '">' + links[i].label + '</a></li>';
    }
    return out;
  }

  function footerTemplate() {
    var year = new Date().getFullYear();
    return (
      '<footer class="footer">' +
        '<div class="container footer__inner">' +

          '<div class="footer__col">' +
            '<div class="footer__brand">' +
              '<span class="nav__mark" aria-hidden="true">' + BRAND_MARK + '</span>' +
              '<span>' + BRAND_NAME + '</span>' +
            '</div>' +
            '<p class="footer__tagline">' +
              'A programming language where human notation comes first. ' +
              '清楚 (qīngchu) means <em>clear</em> — that\u2019s the goal.' +
            '</p>' +
          '</div>' +

          '<div class="footer__col">' +
            '<h4 class="footer__title">Explore</h4>' +
            '<ul class="footer__list">' + linkList(FOOTER_SITE_LINKS) + '</ul>' +
          '</div>' +

          '<div class="footer__col">' +
            '<h4 class="footer__title">Learn</h4>' +
            '<ul class="footer__list">' + linkList(FOOTER_RESOURCE_LINKS) + '</ul>' +
          '</div>' +

          '<div class="footer__col">' +
            '<h4 class="footer__title">An Innovation Earth Project</h4>' +
            '<p class="footer__note">Qingchu is part of the Innovation Earth Projects ' +
            'family — this site stays on our network; every way-out leads back home:</p>' +
            '<ul class="footer__list">' +
              '<li>' + ext(PARENT_SITE, 'innovationearthprojects.org', 'fas fa-globe') + '</li>' +
              '<li>' + ext(PARENT_SITE + '/#projects', 'More projects', 'fas fa-rocket') + '</li>' +
              '<li>' + ext(PARENT_SITE + '/#about', 'About us', 'fas fa-seedling') + '</li>' +
            '</ul>' +
          '</div>' +

        '</div>' +

        '<div class="container footer__bottom">' +
          '<span>&copy; ' + year + ' Qingchu &middot; An Innovation Earth Project.</span>' +
          '<span class="footer__legal">' +
            ext(PARENT_SITE, 'Return to innovationearthprojects.org', 'fas fa-house') +
          '</span>' +
        '</div>' +
      '</footer>'
    );
  }

  /* ---------------- Off-site guard ---------------- */
  // Policy: every link that leaves this site must go back to
  // innovationearthprojects.org. This catch-all rewrites any stray
  // off-site href (github.com, opensource.org, …) to the parent site,
  // and adds a graceful fallback if the parent site is unreachable.
  var OFFSITE_OK = [
    'innovationearthprojects.org',   // the allowed destination
    location.hostname                // anything on this very host stays put
  ];

  function isOffsite(url) {
    try {
      var u = new URL(url, location.href);
      if (u.protocol === 'mailto:' || u.protocol === 'tel:') return false;
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
      for (var i = 0; i < OFFSITE_OK.length; i++) {
        if (u.hostname === OFFSITE_OK[i] ||
            u.hostname.endsWith('.' + OFFSITE_OK[i])) return false;
      }
      return true;
    } catch (e) { return false; }
  }

  function enforceParentRedirect() {
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!a) return;
      var raw = a.getAttribute('href');
      if (!raw || raw.charAt(0) === '#') return;
      if (!isOffsite(a.href)) return;
      // Rewrite the stray off-site link to the parent site.
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.href = PARENT_SITE;
      a.dataset.ext = 'parent';
    }, true);

    // Fallback: if innovationearthprojects.org can't be reached from this
    // browser, don't strand visitors on a dead tab — keep them here.
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest ? ev.target.closest('a[data-ext="parent"]') : null;
      if (!a) return;
      if (window.__iepReachable === false) {
        ev.preventDefault();
        var note = document.querySelector('.ext-fallback-note');
        if (!note) {
          note = document.createElement('div');
          note.className = 'ext-fallback-note';
          note.setAttribute('role', 'status');
          note.textContent = 'innovationearthprojects.org is not reachable right now — you’re staying on this site.';
          document.body.appendChild(note);
          setTimeout(function () { note.remove(); }, 4200);
        }
      }
    });

    // Cheap async reachability probe (no-cors opaque response still
    // resolves when the network path exists; only hard failures reject).
    try {
      fetch(PARENT_SITE, { mode: 'no-cors', cache: 'no-store' })
        .then(function () { window.__iepReachable = true; })
        .catch(function () { window.__iepReachable = false; });
    } catch (e) { /* ignore */ }
  }

  /* ---------------- Mounting ---------------- */
  function mountNav() {
    var mount = document.getElementById('nav-mount');
    if (!mount) return;
    if (mount.querySelector('.nav')) return;
    mount.outerHTML = navTemplate();

    // Active link from body[data-page]
    var page = document.body.getAttribute('data-page');
    if (page) {
      var active = document.querySelector('.nav__links a[data-key="' + page + '"]');
      if (active) active.classList.add('is-active');
    }

    // Mobile drawer
    var toggle = document.querySelector('.nav__toggle');
    var links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.innerHTML = open
          ? '<i class="fas fa-xmark"></i>'
          : '<i class="fas fa-bars"></i>';
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    }
  }

  function mountFooter() {
    var mount = document.getElementById('footer-mount');
    if (!mount) return;
    if (mount.previousElementSibling &&
        mount.previousElementSibling.classList.contains('footer')) return;
    mount.outerHTML = footerTemplate();
  }

  function boot() {
    mountNav();
    mountFooter();
    enforceParentRedirect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
