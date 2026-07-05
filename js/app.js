// ============================================
// CREATO — Master Application Orchestrator & Router
// ============================================

import { icon } from './utils/icons.js';
import { escapeHtml } from './utils/helpers.js';
import { 
  getProjects, getTrashedProjects, createProject, 
  getBrandKit, getSettings, getNotifications, getAuthUser 
} from './store.js';

import { renderLandingPage } from './modules/landing.js';
import { renderFullEditorWorkspace } from './editor/editor-view.js';
import { renderAIStudio } from './modules/ai-studio.js';
import { renderAnimationStudio } from './modules/animation.js';
import { renderAdminPanel } from './modules/admin.js';

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
            <span class="nav-badge">PRO</span>
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

        <div class="sidebar-footer">
          <div class="sidebar-profile">
            <div class="avatar">${user.avatar || 'AM'}</div>
            <div class="profile-info">
              <span class="profile-name">${escapeHtml(user.name)}</span>
              <span class="profile-plan">${user.plan} Plan</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Top Bar -->
      <header class="topbar">
        <div class="search-container">
          <input type="text" class="search-bar" placeholder="Search projects, templates..." />
          <div style="position: absolute; left: 14px; top: 11px; color: var(--text-tertiary);">${icon('cursor')}</div>
        </div>

        <div class="topbar-actions">
          <button class="btn-create" id="shell-new-design-btn">${icon('plus')} Create Design</button>
        </div>
      </header>

      <!-- Main Shell Content area -->
      <main class="main-content" id="shell-view-content"></main>
    </div>
  `;

  // Bind shell navigation
  container.querySelectorAll('[data-nav]').forEach(item => {
    item.addEventListener('click', () => renderView(item.dataset.nav));
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
