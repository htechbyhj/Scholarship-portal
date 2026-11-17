/* ==========================================================================
   ScholarBridge — Public Landing Module Vanilla JS
   ========================================================================== */

(function () {
  'use strict';

  // Theme Toggle (Light / Dark)
  const THEME_KEY = 'sb_theme';
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('ldThemeToggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
    if (themeBtn) {
      const icon = themeBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
      }
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('ldMobileToggle');
  const mobileDrawer = document.getElementById('ldMobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // How It Works Tabs
  const tabBtns = document.querySelectorAll('.ld-tab-btn');
  const tabPanels = document.querySelectorAll('.ld-tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-tab-target');
      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) {
        p.classList.remove('active');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  // Contact Form Validation
  const contactForm = document.getElementById('ldContactForm');
  const contactFeedback = document.getElementById('ldContactFeedback');

  if (contactForm && contactFeedback) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      contactFeedback.classList.add('show');
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }
})();
