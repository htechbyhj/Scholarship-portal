/* ==========================================================================
   ScholarBridge — Student Portal Vanilla JavaScript
   ========================================================================== */

(function () {
  'use strict';

  const THEME_KEY = 'sb_theme';
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('stuThemeToggle');

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

  applyTheme(localStorage.getItem(THEME_KEY) || 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // Mobile Sidebar Toggle
  const sidebar = document.getElementById('stuSidebar');
  const sidebarToggle = document.getElementById('stuSidebarToggle');
  const sidebarClose = document.getElementById('stuSidebarClose');
  const backdrop = document.getElementById('stuSidebarBackdrop');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Scholarship & Application Search/Filter
  const searchInput = document.querySelector('[data-stu-search]');
  const filterSelect = document.querySelector('[data-stu-filter]');

  function filterStudentItems() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = filterSelect ? filterSelect.value.toLowerCase() : '';
    const items = document.querySelectorAll('[data-stu-filterable]');

    items.forEach(function (item) {
      const text = item.textContent.toLowerCase();
      const itemStatus = (item.getAttribute('data-status') || '').toLowerCase();
      const matchQuery = !query || text.includes(query);
      const matchStatus = !status || itemStatus === status;
      item.style.display = matchQuery && matchStatus ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterStudentItems);
  if (filterSelect) filterSelect.addEventListener('change', filterStudentItems);

  // File Upload Preview
  const fileInputs = document.querySelectorAll('[data-stu-file-input]');
  fileInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      const previewId = input.getAttribute('data-preview-target');
      const previewEl = previewId ? document.getElementById(previewId) : null;
      if (!previewEl) return;

      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const sizeKb = Math.max(1, Math.round(file.size / 1024));
        previewEl.innerHTML =
          '<div class="d-flex align-items-center justify-content-between p-2 border rounded mt-2 small">' +
          '<span><i class="bi bi-file-earmark-check text-success me-2"></i>' + file.name + '</span>' +
          '<span class="stu-tabular text-muted">' + sizeKb + ' KB</span>' +
          '</div>';
      } else {
        previewEl.innerHTML = '';
      }
    });
  });

  // Form Validation & Feedback
  const validatedForms = document.querySelectorAll('[data-stu-form]');
  validatedForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const feedbackId = form.getAttribute('data-feedback-target');
      const feedbackEl = feedbackId ? document.getElementById(feedbackId) : null;
      if (feedbackEl) {
        feedbackEl.classList.remove('d-none');
      }
      form.classList.remove('was-validated');
    });
  });
})();
