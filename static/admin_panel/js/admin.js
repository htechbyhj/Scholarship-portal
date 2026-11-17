/* ==========================================================================
   ScholarBridge — Admin Panel Vanilla JavaScript
   ========================================================================== */

(function () {
  'use strict';

  const THEME_KEY = 'sb_theme';
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('admThemeToggle');

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

  // Sidebar Toggle for Mobile & Tablet
  const sidebar = document.getElementById('admSidebar');
  const sidebarToggle = document.getElementById('admSidebarToggle');
  const sidebarClose = document.getElementById('admSidebarClose');
  const backdrop = document.getElementById('admSidebarBackdrop');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Generic Live Search + Filter for Admin Tables
  const searchInput = document.querySelector('[data-adm-table-search]');
  const filterSelects = document.querySelectorAll('[data-adm-table-filter]');

  function filterAdminTable() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const rows = document.querySelectorAll('[data-adm-filterable-row]');
    if (!rows.length) return;

    const activeFilters = {};
    filterSelects.forEach(function (sel) {
      const key = sel.getAttribute('data-adm-table-filter');
      if (sel.value) {
        activeFilters[key] = sel.value.toLowerCase();
      }
    });

    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();
      let matches = !query || text.includes(query);
      Object.keys(activeFilters).forEach(function (key) {
        const attrVal = (row.getAttribute('data-' + key) || '').toLowerCase();
        if (attrVal !== activeFilters[key]) {
          matches = false;
        }
      });
      row.style.display = matches ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterAdminTable);
  filterSelects.forEach(function (sel) {
    sel.addEventListener('change', filterAdminTable);
  });

  // Interactive Approve / Reject / Verify Action Buttons
  document.addEventListener('click', function (e) {
    const actionBtn = e.target.closest('[data-adm-status-action]');
    if (!actionBtn) return;

    const newStatus = actionBtn.getAttribute('data-adm-status-action');
    const targetId = actionBtn.getAttribute('data-target-row');
    const row = targetId ? document.getElementById(targetId) : actionBtn.closest('tr');
    if (!row) return;

    const badge = row.querySelector('[data-status-badge]');
    if (badge) {
      badge.className = 'adm-status';
      if (newStatus === 'Approved' || newStatus === 'Verified') {
        badge.classList.add('adm-status-success');
        badge.innerHTML = '<i class="bi bi-check-circle"></i><span>' + newStatus + '</span>';
      } else if (newStatus === 'Rejected') {
        badge.classList.add('adm-status-danger');
        badge.innerHTML = '<i class="bi bi-x-circle"></i><span>' + newStatus + '</span>';
      }
      row.setAttribute('data-status', newStatus.toLowerCase());
    }
  });

  // Document Preview Switcher
  const docItems = document.querySelectorAll('[data-doc-preview-trigger]');
  const previewTitle = document.getElementById('admDocPreviewTitle');
  const previewMeta = document.getElementById('admDocPreviewMeta');
  const previewSummary = document.getElementById('admDocPreviewSummary');

  docItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (previewTitle) previewTitle.textContent = btn.getAttribute('data-doc-title') || 'Document Preview';
      if (previewMeta) previewMeta.textContent = btn.getAttribute('data-doc-meta') || '';
      if (previewSummary) previewSummary.textContent = btn.getAttribute('data-doc-summary') || '';
    });
  });

  // Admin Dashboard Charts (Chart.js)
  if (typeof Chart !== 'undefined') {
    const scholarshipCanvas = document.getElementById('admScholarshipChart');
    if (scholarshipCanvas) {
      new Chart(scholarshipCanvas, {
        type: 'bar',
        data: {
          labels: ['STEM Merit', 'Need-Based Aid', 'Rural Scholars', 'Women in Tech', 'Research Grant', 'Civic Leaders'],
          datasets: [
            {
              label: 'Applications',
              data: [420, 580, 310, 290, 195, 240],
              backgroundColor: '#2563EB',
              borderRadius: 6
            },
            {
              label: 'Awarded',
              data: [95, 140, 82, 68, 44, 56],
              backgroundColor: '#16A34A',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.16)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const statusCanvas = document.getElementById('admApplicationStatusChart');
    if (statusCanvas) {
      new Chart(statusCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Approved', 'Pending Review', 'Rejected'],
          datasets: [
            {
              data: [485, 312, 168],
              backgroundColor: ['#16A34A', '#F59E0B', '#DC2626'],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }
})();
