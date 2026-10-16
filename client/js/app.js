/**
 * CampusDesk - Main Dashboard Application Controller
 * Manages request feed, filters, modal dialogues, and status progression
 */

let currentFilter = 'All';
let cachedRequests = [];

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  loadDashboardData();
  setupEventListeners();
});

/**
 * Render user profile info in top bar
 */
function initUserProfile() {
  const userJson = localStorage.getItem('campusdesk_user');
  const userObj = userJson ? JSON.parse(userJson) : {
    fullName: 'Rahul Sharma',
    role: 'student',
    department: 'Computer Applications'
  };

  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role-badge');
  const avatarEl = document.getElementById('user-avatar');

  if (nameEl) nameEl.textContent = userObj.fullName;
  if (roleEl) roleEl.textContent = userObj.role.toUpperCase();
  if (avatarEl) avatarEl.textContent = userObj.fullName.charAt(0);

  // If admin, show admin notice
  if (userObj.role === 'admin') {
    const adminBanner = document.getElementById('admin-banner');
    if (adminBanner) adminBanner.style.display = 'block';
  }
}

/**
 * Fetch requests and summary statistics
 */
async function loadDashboardData() {
  try {
    const [requestsRes, statsRes] = await Promise.all([
      api.getRequests(),
      api.getStats()
    ]);

    cachedRequests = requestsRes.data || [];
    renderStats(statsRes.stats);
    filterAndRender();
  } catch (err) {
    showToast('Failed to load data from server. Running in offline demo mode.', 'error');
  }
}

/**
 * Render quick count cards
 */
function renderStats(stats) {
  if (!stats) return;
  document.getElementById('stat-total').textContent = stats.total ?? cachedRequests.length;
  document.getElementById('stat-pending').textContent = stats.pending ?? 0;
  document.getElementById('stat-progress').textContent = stats.inProgress ?? 0;
  document.getElementById('stat-resolved').textContent = stats.resolved ?? 0;
}

/**
 * Filter requests array and render to DOM
 */
function filterAndRender() {
  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();

  let list = cachedRequests;

  // Filter by status tab
  if (currentFilter !== 'All') {
    list = list.filter(r => r.status.toLowerCase() === currentFilter.toLowerCase());
  }

  // Filter by search query
  if (searchVal) {
    list = list.filter(r => 
      r.title.toLowerCase().includes(searchVal) ||
      r.description.toLowerCase().includes(searchVal) ||
      r.category.toLowerCase().includes(searchVal)
    );
  }

  renderRequestsGrid(list);
}

/**
 * Render request cards
 */
function renderRequestsGrid(requests) {
  const grid = document.getElementById('requests-grid');
  if (!grid) return;

  if (requests.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No service requests found.</p>
        <p style="font-size: 0.85rem;">Click the <strong>"+ New Request"</strong> button to submit an issue.</p>
      </div>
    `;
    return;
  }

  const user = JSON.parse(localStorage.getItem('campusdesk_user') || '{}');
  const isAdmin = user.role === 'admin';

  grid.innerHTML = requests.map(req => {
    const statusClass = getStatusBadgeClass(req.status);
    const dateFormatted = new Date(req.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <div class="request-card" id="card-${req._id}">
        <div>
          <div class="card-top">
            <span class="badge badge-category">${escapeHtml(req.category)}</span>
            <span class="badge ${statusClass}">${escapeHtml(req.status)}</span>
          </div>
          <h3 class="card-title">${escapeHtml(req.title)}</h3>
          <p class="card-desc">${escapeHtml(req.description)}</p>
          
          ${req.adminRemarks ? `
            <div class="card-remarks">
              <strong>Staff Note:</strong> ${escapeHtml(req.adminRemarks)}
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <div>
            <span style="display: block; font-weight: 500; color: var(--text-muted);">${escapeHtml(req.studentName || 'Student')}</span>
            <span>Priority: <strong style="color: #fff;">${escapeHtml(req.priority || 'Medium')}</strong> • ${dateFormatted}</span>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            ${isAdmin ? `
              <button class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="promptUpdateStatus('${req._id}')">
                Update Status
              </button>
            ` : `
              <button class="btn btn-danger" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="handleDeleteRequest('${req._id}')">
                Delete
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getStatusBadgeClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'resolved': return 'badge-resolved';
    case 'in progress':
    case 'under review': return 'badge-progress';
    case 'rejected': return 'badge-rejected';
    default: return 'badge-pending';
  }
}

/**
 * Setup Event Listeners for Filters, Search, Modal, Logout
 */
function setupEventListeners() {
  // Pill filters
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      filterAndRender();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => filterAndRender());
  }

  // Modal open & close
  const openModalBtn = document.getElementById('btn-open-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  const modalOverlay = document.getElementById('modal-overlay');

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
  }
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  }
  if (cancelModalBtn && modalOverlay) {
    cancelModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  }

  // Modal form submit
  const requestForm = document.getElementById('form-new-request');
  if (requestForm) {
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('req-title').value.trim();
      const category = document.getElementById('req-category').value;
      const priority = document.getElementById('req-priority').value;
      const description = document.getElementById('req-description').value.trim();
      const submitBtn = requestForm.querySelector('button[type="submit"]');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const user = JSON.parse(localStorage.getItem('campusdesk_user') || '{}');
        const res = await api.createRequest({
          title,
          category,
          priority,
          description,
          studentName: user.fullName || 'Student'
        });

        cachedRequests.unshift(res.data);
        modalOverlay.classList.remove('active');
        requestForm.reset();
        showToast('Service request submitted successfully!', 'success');
        loadDashboardData();
      } catch (err) {
        showToast(err.message || 'Failed to submit request.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
      }
    });
  }

  // Logout action
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('campusdesk_token');
      localStorage.removeItem('campusdesk_user');
      window.location.href = 'index.html';
    });
  }
}

/**
 * Handle student delete request
 */
async function handleDeleteRequest(id) {
  if (!confirm('Are you sure you want to cancel and delete this request?')) return;

  try {
    await api.deleteRequest(id);
    cachedRequests = cachedRequests.filter(r => r._id !== id);
    showToast('Request deleted successfully.', 'success');
    loadDashboardData();
  } catch (err) {
    showToast('Failed to delete request.', 'error');
  }
}

/**
 * Handle admin status update
 */
async function promptUpdateStatus(id) {
  const newStatus = prompt(
    'Enter new status:\n- Pending\n- Under Review\n- In Progress\n- Resolved\n- Rejected',
    'Resolved'
  );
  if (!newStatus) return;

  const remarks = prompt('Enter official admin remarks:', 'Issue inspected and resolved.');

  try {
    const res = await api.updateRequestStatus(id, newStatus, remarks || '');
    showToast('Request status updated to ' + newStatus, 'success');
    loadDashboardData();
  } catch (err) {
    showToast('Failed to update status.', 'error');
  }
}

/**
 * Toast notification
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
    }
  });
}
