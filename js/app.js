// ============================================
// CREATO — Master Application Orchestrator & 100% Click Handler
// ============================================

import { icon } from './utils/icons.js';
import { escapeHtml } from './utils/helpers.js';
import { 
  getProjects, getTrashedProjects, createProject, 
  getBrandKit, getSettings, getNotifications, markNotificationsRead, getAuthUser 
} from './store.js';

import { renderLandingPage } from './modules/landing.js';
import { renderFullEditorWorkspace } from './editor/editor-view.js';
import { renderAIStudio } from './modules/ai-studio.js';
import { renderAnimationStudio } from './modules/animation.js';
import { renderAdminPanel } from './modules/admin.js';
import { PaymentGateway } from './modules/billing.js';

let activeView = 'landing';
let currentEditingProject = null;

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});

function initRouter() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;
  renderView('landing');
}

export function renderView(viewName, projectData = null) {
  activeView = viewName;
  const container = document.getElementById('app');
  if (!container) return;

  if (viewName === 'landing') {
    renderLandingPage(container, () => renderView('dashboard'));
    return;
  }

  if (viewName === 'editor') {
    const projects = getProjects();
    const targetProject = projectData || currentEditingProject || projects[0] || { name: 'Untitled Design', width: 1080, height: 1080 };
    renderFullEditorWorkspace(container, targetProject, () => renderView('dashboard'));
    return;
  }

  // Render App Shell Dashboard Layout for Dashboard, AI Studio, Animation, Brand Kit, Admin, Settings, Projects, Trash
  renderAppShell(container, viewName);
}

function renderAppShell(container, currentTab) {
  const user = getAuthUser();
  const settings = getSettings();
  const unreadNotifs = getNotifications().filter(n => !n.read).length;

  container.innerHTML = `
    <div class="app-shell" data-theme="${settings.theme}">
      <!-- Sidebar -->
      <aside class="sidebar">
        <a href="#" class="sidebar-logo" id="shell-logo">
          <div class="logo-icon">${icon('sparkles')}</div>
          <span class="logo-text">Creato</span>
        </a>

        <nav class="sidebar-nav">
          <span class="nav-section-title">Main</span>
          <div class="nav-item${currentTab === 'dashboard' ? ' active' : ''}" data-nav="dashboard">
            ${icon('home')} <span class="nav-label">Dashboard</span>
          </div>
          <div class="nav-item${currentTab === 'projects' ? ' active' : ''}" data-nav="projects">
            ${icon('folder')} <span class="nav-label">Projects</span>
          </div>
          <div class="nav-item${currentTab === 'ai-studio' ? ' active' : ''}" data-nav="ai-studio">
            ${icon('sparkles')} <span class="nav-label">AI Studio</span>
            <span class="nav-badge" id="ai-upgrade-badge" title="Click to Upgrade Plan">PRO</span>
          </div>

          <span class="nav-section-title">Tools</span>
          <div class="nav-item${currentTab === 'brand-kit' ? ' active' : ''}" data-nav="brand-kit">
            ${icon('palette')} <span class="nav-label">Brand Kit</span>
          </div>
          <div class="nav-item${currentTab === 'animation' ? ' active' : ''}" data-nav="animation">
            ${icon('film')} <span class="nav-label">Animation</span>
          </div>
          <div class="nav-item${currentTab === 'admin' ? ' active' : ''}" data-nav="admin">
            ${icon('shield')} <span class="nav-label">Admin Panel</span>
          </div>

          <div class="sidebar-divider"></div>
          <div class="nav-item${currentTab === 'trash' ? ' active' : ''}" data-nav="trash">
            ${icon('trash')} <span class="nav-label">Trash</span>
          </div>
        </nav>

        <div class="sidebar-footer" style="position: relative;">
          <div class="sidebar-profile" id="shell-sidebar-profile" style="cursor: pointer;">
            <div class="avatar">${user.avatar || 'AM'}</div>
            <div class="profile-info">
              <span class="profile-name">${escapeHtml(user.name)}</span>
              <span class="profile-plan" id="shell-user-plan">${user.plan} Plan</span>
            </div>
          </div>

          <!-- Profile Dropdown -->
          <div class="profile-dropdown" id="shell-profile-dropdown" style="bottom: calc(100% + 8px); left: 12px; right: 12px; width: auto;">
            <button class="profile-dropdown-item" id="prof-upgrade-btn">
              ${icon('sparkles')} Upgrade Plan
            </button>
            <button class="profile-dropdown-item" id="prof-theme-btn">
              ${icon('sun')} Toggle Theme (${settings.theme})
            </button>
            <div class="profile-dropdown-divider"></div>
            <button class="profile-dropdown-item" id="prof-brand-btn">
              ${icon('palette')} Brand Kit
            </button>
          </div>
        </div>
      </aside>

      <!-- Top Bar -->
      <header class="topbar">
        <div class="search-container" style="position: relative;">
          <input type="text" class="search-bar" id="shell-search-input" placeholder="Search designs, templates..." autocomplete="off" />
          <div style="position: absolute; left: 14px; top: 11px; color: var(--text-tertiary);">${icon('cursor')}</div>
          <div class="search-dropdown" id="shell-search-dropdown"></div>
        </div>

        <div class="topbar-actions" style="position: relative;">
          <button class="btn-create" id="shell-new-design-btn">${icon('plus')} Create Design</button>
          <button class="topbar-btn tooltip" data-tooltip="Notifications" id="shell-notif-btn">
            ${icon('bell')}
            ${unreadNotifs > 0 ? `<span class="notification-dot" style="display:block;"></span>` : ''}
          </button>

          <!-- Notifications Dropdown Panel -->
          <div class="notification-panel" id="shell-notif-panel">
            <div class="notification-panel-header">
              <span class="notification-panel-title">Notifications</span>
              <button class="notification-clear-btn" id="shell-clear-notifs">Clear All</button>
            </div>
            <div class="notification-list" id="shell-notif-list"></div>
          </div>
        </div>
      </header>

      <!-- Main Shell Content Area -->
      <main class="main-content" id="shell-view-content"></main>
    </div>
  `;

  // Bind Sidebar Navigation
  container.querySelectorAll('[data-nav]').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('#ai-upgrade-badge')) return;
      renderView(item.dataset.nav);
    });
  });

  document.getElementById('ai-upgrade-badge')?.addEventListener('click', (e) => {
    e.stopPropagation();
    PaymentGateway.renderCheckoutModal('Professional', '$29', (plan) => {
      const planEl = document.getElementById('shell-user-plan');
      if (planEl) planEl.textContent = `${plan} Plan`;
    });
  });

  document.getElementById('shell-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderView('landing');
  });

  document.getElementById('shell-new-design-btn')?.addEventListener('click', () => {
    const proj = createProject({ name: 'Picsart Canvas Design', width: 1080, height: 1080 });
    currentEditingProject = proj;
    renderView('editor', proj);
  });

  // Profile Dropdown Toggle & Actions
  const profileBtn = document.getElementById('shell-sidebar-profile');
  const profileDropdown = document.getElementById('shell-profile-dropdown');

  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown?.classList.toggle('visible');
  });

  document.getElementById('prof-upgrade-btn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('visible');
    PaymentGateway.renderCheckoutModal('Professional', '$29', (plan) => {
      const planEl = document.getElementById('shell-user-plan');
      if (planEl) planEl.textContent = `${plan} Plan`;
    });
  });

  document.getElementById('prof-theme-btn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('visible');
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    settings.theme = newTheme;
    document.querySelector('.app-shell')?.setAttribute('data-theme', newTheme);
  });

  document.getElementById('prof-brand-btn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('visible');
    renderView('brand-kit');
  });

  // Notifications Toggle
  const notifBtn = document.getElementById('shell-notif-btn');
  const notifPanel = document.getElementById('shell-notif-panel');
  const notifList = document.getElementById('shell-notif-list');

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = notifPanel?.classList.contains('visible');
    if (!isVisible) {
      markNotificationsRead();
      renderNotificationList(notifList);
      notifPanel?.classList.add('visible');
    } else {
      notifPanel?.classList.remove('visible');
    }
  });

  document.getElementById('shell-clear-notifs')?.addEventListener('click', () => {
    renderNotificationList(notifList, true);
  });

  // Document Click to Close Dropdowns
  document.addEventListener('click', () => {
    profileDropdown?.classList.remove('visible');
    notifPanel?.classList.remove('visible');
  });

  // Render Inner View Content
  const mainContent = document.getElementById('shell-view-content');
  if (!mainContent) return;

  if (currentTab === 'dashboard') renderDashboardView(mainContent);
  else if (currentTab === 'projects') renderProjectsView(mainContent);
  else if (currentTab === 'ai-studio') renderAIStudio(mainContent, () => renderView('editor'));
  else if (currentTab === 'animation') renderAnimationStudio(mainContent);
  else if (currentTab === 'admin') renderAdminPanel(mainContent);
  else if (currentTab === 'brand-kit') renderBrandKitView(mainContent);
  else if (currentTab === 'trash') renderTrashView(mainContent);
}

function renderNotificationList(container, clear = false) {
  if (!container) return;
  const list = clear ? [] : getNotifications();

  if (list.length === 0) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 13px;">No notifications</div>`;
    return;
  }

  container.innerHTML = list.map(n => `
    <div class="notification-item" style="padding: 10px; border-bottom: 1px solid var(--border-subtle);">
      <div style="font-size: 13px; font-weight: 500;">${escapeHtml(n.message)}</div>
      <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 2px;">Recently</div>
    </div>
  `).join('');
}

function renderDashboardView(container) {
  const projects = getProjects();
  container.innerHTML = `
    <section class="hero-section">
      <h1 class="hero-title">What will you <span class="gradient-text">create</span> today?</h1>
      <p class="hero-subtitle">Design social graphics, vector logos, presentations, and motion artwork effortlessly.</p>
    </section>

    <section class="quick-actions">
      <div class="section-header">
        <h2 class="section-title">Start Creating</h2>
      </div>
      <div class="quick-actions-grid">
        <div class="action-card" data-create="1080,1080,Instagram Post">
          <div class="action-card-icon" style="background: rgba(236,72,153,0.15); color: hsl(var(--brand-pink));">${icon('square')}</div>
          <span class="action-card-label">Instagram Square</span>
          <span class="action-card-size">1080 × 1080 px</span>
        </div>
        <div class="action-card" data-create="1080,1920,Instagram Story">
          <div class="action-card-icon" style="background: rgba(124,58,237,0.15); color: hsl(var(--brand-primary));">${icon('grid')}</div>
          <span class="action-card-label">Story Format</span>
          <span class="action-card-size">1080 × 1920 px</span>
        </div>
        <div class="action-card" data-create="1280,720,YouTube Thumbnail">
          <div class="action-card-icon" style="background: rgba(239,68,68,0.15); color: #EF4444;">${icon('film')}</div>
          <span class="action-card-label">YouTube Thumbnail</span>
          <span class="action-card-size">1280 × 720 px</span>
        </div>
      </div>
    </section>

    <section class="recent-designs">
      <div class="section-header">
        <h2 class="section-title">Recent Designs</h2>
      </div>
      <div class="recent-designs-grid">
        ${projects.map(p => `
          <div class="design-card" data-open-project="${p.id}">
            <div class="design-card-preview">
              <div class="preview-gradient" style="background: ${p.gradient};"></div>
            </div>
            <div class="design-card-info">
              <div class="design-card-title">${escapeHtml(p.name)}</div>
              <div class="design-card-meta">
                <span class="design-card-date">${p.width}×${p.height} px</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  container.querySelectorAll('[data-create]').forEach(card => {
    card.addEventListener('click', () => {
      const [w, h, name] = card.dataset.create.split(',');
      const proj = createProject({ name, width: parseInt(w), height: parseInt(h) });
      currentEditingProject = proj;
      renderView('editor', proj);
    });
  });

  container.querySelectorAll('[data-open-project]').forEach(card => {
    card.addEventListener('click', () => {
      const proj = getProjects().find(p => p.id === card.dataset.openProject);
      if (proj) {
        currentEditingProject = proj;
        renderView('editor', proj);
      }
    });
  });
}

function renderProjectsView(container) {
  const projects = getProjects();
  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">Your Projects</h1>
    </div>
    <div class="recent-designs-grid">
      ${projects.map(p => `
        <div class="design-card" data-open-project="${p.id}">
          <div class="design-card-preview">
            <div class="preview-gradient" style="background: ${p.gradient};"></div>
          </div>
          <div class="design-card-info">
            <div class="design-card-title">${escapeHtml(p.name)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-open-project]').forEach(card => {
    card.addEventListener('click', () => {
      const proj = getProjects().find(p => p.id === card.dataset.openProject);
      if (proj) {
        currentEditingProject = proj;
        renderView('editor', proj);
      }
    });
  });
}

function renderBrandKitView(container) {
  const kit = getBrandKit();
  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">Brand Kit ${icon('palette')}</h1>
    </div>
    <div class="brand-section">
      <h3 style="margin-bottom: 12px;">Palette Colors</h3>
      <div class="color-swatches">
        ${kit.colors.map(c => `
          <div class="color-swatch" style="background: ${c};">
            <span class="color-swatch-label">${c}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTrashView(container) {
  const trashed = getTrashedProjects();
  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">Trash ${icon('trash')}</h1>
    </div>
    <div class="recent-designs-grid">
      ${trashed.length === 0 ? '<p style="color: var(--text-tertiary);">Trash is empty</p>' : trashed.map(p => `
        <div class="design-card">
          <div class="design-card-info">
            <div class="design-card-title">${escapeHtml(p.name)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
