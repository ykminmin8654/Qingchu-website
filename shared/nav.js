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

  var NAV_LINKS = [
    { href: '/#features',   label: 'Features',  key: 'features' },
    { href: '/docs.html',   label: 'Language',  key: 'language' },
    { href: '/examples.html', label: 'Examples', key: 'examples' },
    { href: '/#status',     label: 'Status',    key: 'status' },
    {
      href: 'https://github.com/ykminmin8654/Qingchu',
      label: 'GitHub',
      key: 'github',
      external: true
    }
  ];

  var FOOTER_SITE_LINKS = [
    { href: '/',          label: 'Home' },
    { href: '/docs.html', label: 'Language Reference' },
    { href: '/examples.html', label: 'Examples' }
  ];

  var FOOTER_RESOURCE_LINKS = [
    { href: '/#status',   label: 'Project Status' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#get-started', label: 'Get Started' }
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
          '<a class="nav__brand" href="/">' +
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
              '<a class="btn btn--primary btn--sm" ' +
              'href="https://github.com/ykminmin8654/Qingchu" target="_blank" rel="noopener">' +
              '<i class="fab fa-github"></i> Star on GitHub</a>' +
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
            '<h4 class="footer__title">Source</h4>' +
            '<p class="footer__note">Qingchu lives on GitHub — its own project:</p>' +
            '<ul class="footer__list">' +
              '<li><a class="footer__ext" href="https://github.com/ykminmin8654/Qingchu" ' +
                'target="_blank" rel="noopener">ykminmin8654/Qingchu' +
                '<i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>' +
                '<span class="footer__ext-tag">MIT licensed · Java 17+</span></a></li>' +
            '</ul>' +
          '</div>' +

        '</div>' +

        '<div class="container footer__bottom">' +
          '<span>&copy; ' + year + ' Qingchu &middot; Built with a Java interpreter, shipped under MIT.</span>' +
          '<span class="footer__legal">' +
            '<a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT License</a>' +
            '<a href="https://github.com/ykminmin8654/Qingchu" target="_blank" rel="noopener">GitHub</a>' +
          '</span>' +
        '</div>' +
      '</footer>'
    );
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
