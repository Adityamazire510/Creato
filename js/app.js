// ============================================
// CREATO — Master Application Orchestrator & Router
// ============================================

import { icon } from './utils/icons.js';
import { escapeHtml } from './utils/helpers.js';
import { 
  getProjects, getTrashedProjects, createProject, trashProject, 
  getBrandKit, saveBrandKit, getSettings, saveSettings, 
  getNotifications, markNotificationsRead, getAuthUser 
} from './store.js';

import { renderLandingPage } from './modules/landing.js';
import { CanvasEngine } from './editor/canvas.js';
import { renderLayerTree } from './editor/layers.js';
import { renderAIStudio } from './modules/ai-studio.js';
import { renderAnimationStudio } from './modules/animation.js';
import { renderAdminPanel } from './modules/admin.js';
import { renderAuthModal } from './modules/auth.js';

let activeView = 'landing';
let canvasEngine = null;

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});

function initRouter() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  renderView('landing');
}

export function renderView(viewName) {
  activeView = viewName;
  const container = document.getElementById('app');
  if (!container) return;

  if (viewName === 'landing') {
    renderLandingPage(container, () => renderView('dashboard'));
    return;
  }

  if (viewName === 'editor') {
    renderEditorWorkspace(container);
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
    const proj = createProject({ name: 'Untitled Graphic', width: 1080, height: 1080 });
    renderView('editor');
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
          <span class="action-card-label">Instagram Post</span>
          <span class="action-card-size">1080 × 1080 px</span>
        </div>
        <div class="action-card" data-create="1920,1080,Presentation">
          <div class="action-card-icon" style="background: rgba(124,58,237,0.15); color: hsl(var(--brand-primary));">${icon('grid')}</div>
          <span class="action-card-label">Presentation</span>
          <span class="action-card-size">1920 × 1080 px</span>
        </div>
        <div class="action-card" data-create="1280,720,YouTube Thumbnail">
          <div class="action-card-icon" style="background: rgba(239,68,68,0.15); color: #EF4444;">${icon('film')}</div>
          <span class="action-card-label">YouTube Banner</span>
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
      createProject({ name, width: parseInt(w), height: parseInt(h) });
      renderView('editor');
    });
  });

  container.querySelectorAll('[data-open-project]').forEach(card => {
    card.addEventListener('click', () => renderView('editor'));
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
    card.addEventListener('click', () => renderView('editor'));
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

// ============================================
// FIGMA + CANVA + PHOTOPEA STYLE CANVAS EDITOR
// ============================================
function renderEditorWorkspace(container) {
  const activeProjects = getProjects();
  const currentProject = activeProjects[0] || { name: 'Untitled Graphic', width: 1080, height: 1080 };

  container.innerHTML = `
    <div class="editor-workspace">
      <!-- Top Header -->
      <div class="editor-topbar">
        <div class="editor-topbar-left">
          <button class="editor-back-btn" id="editor-back-dashboard">${icon('arrowRight')}</button>
          <input type="text" class="editor-project-title-input" value="${escapeHtml(currentProject.name)}" />
        </div>

        <div class="editor-topbar-center">
          <button class="editor-history-btn" id="tool-undo">${icon('rotateCcw')}</button>
          <button class="editor-history-btn" id="tool-redo">${icon('rotateCw')}</button>
        </div>

        <div class="editor-topbar-right">
          <button class="btn-export" id="editor-export-btn">${icon('download')} Export Asset</button>
        </div>
      </div>

      <!-- Editor Main Body -->
      <div class="editor-main-body">
        <!-- Left Tool Ribbon -->
        <div class="editor-left-tools">
          <button class="tool-btn active" data-tool="select">
            ${icon('cursor')}
            <span class="tool-label">Select</span>
          </button>
          <button class="tool-btn" data-tool="rect">
            ${icon('square')}
            <span class="tool-label">Rect</span>
          </button>
          <button class="tool-btn" data-tool="circle">
            ${icon('circle')}
            <span class="tool-label">Circle</span>
          </button>
          <button class="tool-btn" data-tool="triangle">
            ${icon('triangle')}
            <span class="tool-label">Triangle</span>
          </button>
          <button class="tool-btn" data-tool="text">
            ${icon('type')}
            <span class="tool-label">Text</span>
          </button>
        </div>

        <!-- Canvas Stage -->
        <div class="editor-canvas-viewport">
          <div class="editor-canvas-stage">
            <canvas id="editor-real-canvas"></canvas>
          </div>
          <div class="canvas-zoom-bar">100% Canvas</div>
        </div>

        <!-- Right Properties & Layers Panel -->
        <div class="editor-right-panel">
          <div class="panel-tabs">
            <div class="panel-tab active" id="tab-props">Properties</div>
            <div class="panel-tab" id="tab-layers">Layers</div>
          </div>

          <div class="panel-section" id="inspector-content">
            <div class="panel-section-title">Canvas Dimensions</div>
            <div class="prop-row">
              <span class="prop-label">Width</span>
              <input type="text" class="prop-input" value="${currentProject.width}px" readonly />
            </div>
            <div class="prop-row">
              <span class="prop-label">Height</span>
              <input type="text" class="prop-input" value="${currentProject.height}px" readonly />
            </div>
          </div>

          <div class="panel-section" id="layers-container"></div>
        </div>
      </div>
    </div>
  `;

  // Initialize Interactive Canvas Engine
  const canvasEl = document.getElementById('editor-real-canvas');
  if (canvasEl) {
    canvasEngine = new CanvasEngine(canvasEl, currentProject.width || 1080, currentProject.height || 1080);
    canvasEngine.setElements(currentProject.elements || []);

    const layersContainer = document.getElementById('layers-container');
    renderLayerTree(layersContainer, canvasEngine);

    // Bind Tool Switches
    container.querySelectorAll('[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tool = btn.dataset.tool;

        if (tool === 'rect') canvasEngine.addElement('rect', { fill: '#7C3AED', width: 220, height: 160 });
        else if (tool === 'circle') canvasEngine.addElement('circle', { fill: '#3B82F6', width: 180, height: 180 });
        else if (tool === 'triangle') canvasEngine.addElement('triangle', { fill: '#EC4899', width: 200, height: 200 });
        else if (tool === 'text') canvasEngine.addElement('text', { text: 'CREATO VECTOR TEXT', fill: '#121226', fontSize: 36 });

        renderLayerTree(layersContainer, canvasEngine);
      });
    });
  }

  document.getElementById('editor-back-dashboard')?.addEventListener('click', () => {
    renderView('dashboard');
  });

  document.getElementById('editor-export-btn')?.addEventListener('click', () => {
    if (canvasEl) {
      const dataUrl = canvasEl.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'creato-design.png';
      a.click();
    }
  });
}
