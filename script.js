// script.js — RestoFlow Dashboard
// Handles: auth guard, dynamic profile, charts, billing logic

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────────
  // 1. AUTHENTICATION GUARD
  // Redirect to login if no username is saved in localStorage.
  // ─────────────────────────────────────────────────────────────
  const isLoginPage = document.querySelector('.login-body') !== null;

  if (!isLoginPage) {
    const savedUsername = localStorage.getItem('rf_username');
    if (!savedUsername) {
      // Not logged in — redirect to login page
      window.location.href = 'index.html';
      return; // Stop further execution
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. DYNAMIC ADMIN PROFILE
  // Reads username from localStorage and updates header UI.
  // ─────────────────────────────────────────────────────────────
  const usernameEl  = document.getElementById('headerUsername');
  const avatarEl    = document.getElementById('headerAvatar');

  if (usernameEl) {
    const username = localStorage.getItem('rf_username') || 'Admin';
    usernameEl.textContent = username;

    // Generate a color avatar using the username initials
    if (avatarEl) {
      const encodedName = encodeURIComponent(username);
      avatarEl.src = `https://ui-avatars.com/api/?name=${encodedName}&background=ff6b00&color=fff&size=84&bold=true`;
      avatarEl.alt = `${username} – Avatar`;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CHART.JS GLOBAL DEFAULTS
  // ─────────────────────────────────────────────────────────────
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#9899a6';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
  }

  // Helper: hide chart loader after chart renders
  function hideLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LOGOUT — clear session and return to login
  // ─────────────────────────────────────────────────────────────
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('rf_username');
      window.location.href = 'index.html';
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. DASHBOARD — REVENUE LINE CHART
  // ─────────────────────────────────────────────────────────────
  const revenueChartCtx = document.getElementById('revenueChart');
  if (revenueChartCtx) {
    new Chart(revenueChartCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [1200, 1900, 1500, 2200, 3100, 4200, 3800],
          borderColor: '#ff6b00',
          backgroundColor: 'rgba(255, 107, 0, 0.08)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#181920',
          pointBorderColor: '#ff6b00',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#ff6b00',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f212a',
            borderColor: '#272833',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: ctx => ` $${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            grid: { color: '#272833' },
            beginAtZero: true,
            ticks: { callback: v => `$${v / 1000}k` }
          },
          x: { grid: { display: false } }
        }
      }
    });
    hideLoader('revenueLoader');
  }

  // ─────────────────────────────────────────────────────────────
  // 5. DASHBOARD — TOP ITEMS DOUGHNUT CHART
  // ─────────────────────────────────────────────────────────────
  const itemsChartCtx = document.getElementById('itemsChart');
  if (itemsChartCtx) {
    new Chart(itemsChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Burgers', 'Pizzas', 'Drinks', 'Desserts'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#ff6b00', '#10b981', '#3b82f6', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 18, usePointStyle: true, pointStyleWidth: 10 }
          },
          tooltip: {
            backgroundColor: '#1f212a',
            borderColor: '#272833',
            borderWidth: 1,
            padding: 12,
          }
        }
      }
    });
    hideLoader('itemsLoader');
  }

  // ─────────────────────────────────────────────────────────────
  // 6. REPORTS — ANNUAL SALES VS EXPENSES BAR CHART
  // ─────────────────────────────────────────────────────────────
  const reportsChartCtx = document.getElementById('reportsChart');
  if (reportsChartCtx) {
    new Chart(reportsChartCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Sales ($)',
            data: [12000, 15000, 14000, 18000, 22000, 24000, 26000, 25000, 21000, 19000, 23000, 28000],
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            hoverBackgroundColor: '#10b981',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Expenses ($)',
            data: [8000, 9000, 8500, 10000, 11000, 12000, 13000, 12500, 11000, 10500, 12000, 15000],
            backgroundColor: 'rgba(239, 68, 68, 0.75)',
            hoverBackgroundColor: '#ef4444',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // We use custom HTML legend in the card header
          tooltip: {
            backgroundColor: '#1f212a',
            borderColor: '#272833',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            grid: { color: '#272833' },
            beginAtZero: true,
            ticks: { callback: v => `$${v / 1000}k` },
            title: {
              display: true,
              text: 'Amount ($)',
              color: '#8b8d97',
              font: { size: 11 },
              padding: { bottom: 8 }
            }
          },
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: 'Month',
              color: '#8b8d97',
              font: { size: 11 },
              padding: { top: 8 }
            }
          }
        },
        interaction: {
          mode: 'index', // show both datasets in one tooltip
          intersect: false
        }
      }
    });
    hideLoader('reportsLoader');
  }

  // ─────────────────────────────────────────────────────────────
  // 7. BILLING — ADD ITEM FORM
  // ─────────────────────────────────────────────────────────────
  const billingForm      = document.getElementById('billingForm');
  const billingTableBody = document.getElementById('billingTableBody');
  const totalAmountEl    = document.getElementById('totalAmount');
  let totalAmount = 0;

  if (billingForm) {
    billingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput   = document.getElementById('itemName');
      const amountInput = document.getElementById('itemAmount');

      const name   = nameInput.value.trim();
      const amount = parseFloat(amountInput.value);

      if (name && !isNaN(amount) && amount > 0) {
        addItemToTable(name, amount);
        updateTotal(amount);

        // Reset form fields
        nameInput.value  = '';
        amountInput.value = '';
        nameInput.focus();
      }
    });
  }

  /**
   * Adds a row to the billing table.
   * @param {string} name - Item name
   * @param {number} amount - Item price
   */
  function addItemToTable(name, amount) {
    const tr = document.createElement('tr');
    tr.style.animation = 'fadeInUp 0.3s ease forwards';

    tr.innerHTML = `
      <td><strong>${name}</strong></td>
      <td>$${amount.toFixed(2)}</td>
      <td style="text-align: center;">
        <button class="btn-danger delete-btn" title="Remove Item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;

    // Attach delete handler
    tr.querySelector('.delete-btn').addEventListener('click', () => {
      tr.style.opacity = '0';
      tr.style.transform = 'translateX(10px)';
      tr.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        tr.remove();
        updateTotal(-amount);
      }, 250);
    });

    billingTableBody.appendChild(tr);
  }

  /**
   * Updates the running total displayed in the billing table header.
   * @param {number} delta - Amount to add (positive) or subtract (negative)
   */
  function updateTotal(delta) {
    totalAmount += delta;
    const safeTotal = Math.max(0, totalAmount);
    if (totalAmountEl) {
      totalAmountEl.textContent = `$${safeTotal.toFixed(2)}`;
    }
  }

  // Seed billing table with some demo items
  if (billingTableBody) {
    setTimeout(() => {
      addItemToTable('Margherita Pizza', 15.00);
      addItemToTable('Garlic Bread', 5.50);
      addItemToTable('Coca Cola', 3.00);
    }, 350);
  }

  // ─────────────────────────────────────────────────────────────
  // 8. GENERATE INVOICE BUTTON (placeholder)
  // ─────────────────────────────────────────────────────────────
  const generateInvoiceBtn = document.getElementById('generateInvoiceBtn');
  if (generateInvoiceBtn) {
    generateInvoiceBtn.addEventListener('click', () => {
      generateInvoiceBtn.innerHTML = '<i class="fa-solid fa-check"></i> Invoice Sent!';
      generateInvoiceBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(() => {
        generateInvoiceBtn.innerHTML = '<i class="fa-solid fa-file-invoice"></i> Generate Invoice (AI Auto)';
        generateInvoiceBtn.style.background = '';
      }, 2500);
    });
  }

}); // end DOMContentLoaded
