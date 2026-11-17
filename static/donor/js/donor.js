/* ==========================================================================
   ScholarBridge — Donor Portal Vanilla JavaScript
   ========================================================================== */

(function () {
  'use strict';

  const THEME_KEY = 'sb_theme';
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('dnrThemeToggle');

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
  const sidebar = document.getElementById('dnrSidebar');
  const sidebarToggle = document.getElementById('dnrSidebarToggle');
  const sidebarClose = document.getElementById('dnrSidebarClose');
  const backdrop = document.getElementById('dnrSidebarBackdrop');

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

  // Table Search & Filter
  const searchInput = document.querySelector('[data-dnr-search]');
  const filterSelect = document.querySelector('[data-dnr-filter]');

  function filterDonorRows() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = filterSelect ? filterSelect.value.toLowerCase() : '';
    const rows = document.querySelectorAll('[data-dnr-filterable]');

    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();
      const rowStatus = (row.getAttribute('data-status') || '').toLowerCase();
      const matchQuery = !query || text.includes(query);
      const matchStatus = !status || rowStatus === status;
      row.style.display = matchQuery && matchStatus ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterDonorRows);
  if (filterSelect) filterSelect.addEventListener('change', filterDonorRows);

  // Form Validation
  const donorForms = document.querySelectorAll('[data-dnr-form]');
  donorForms.forEach(function (form) {
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

  // Donor Charts (Chart.js)
  if (typeof Chart !== 'undefined') {
    const overviewCanvas = document.getElementById('dnrFundingOverviewChart');
    if (overviewCanvas) {
      new Chart(overviewCanvas, {
        type: 'bar',
        data: {
          labels: ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'],
          datasets: [
            {
              label: 'Committed ($)',
              data: [85000, 110000, 125000, 100000],
              backgroundColor: '#2563EB',
              borderRadius: 6
            },
            {
              label: 'Disbursed ($)',
              data: [78000, 96000, 108500, 63000],
              backgroundColor: '#16A34A',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.16)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const utilCanvas = document.getElementById('dnrUtilizationChart');
    if (utilCanvas) {
      new Chart(utilCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Allocated to Scholars', 'Remaining Balance'],
          datasets: [
            {
              data: [345500, 74500],
              backgroundColor: ['#2563EB', '#E2E8F0'],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }
})();
