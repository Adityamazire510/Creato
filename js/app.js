// ============================================
// CREATO — Main App Controller
// ============================================

import { DESIGN_TYPES, TEMPLATE_CATEGORIES, STARTER_TEMPLATES, searchTemplates, filterTemplatesByCategory, getDesignType } from './templates.js';
import { getProjects, createProject, renameProject, duplicateProject, deleteProject, formatDate } from './projects.js';

// ---- Lucide icon helper (inline SVGs) ----
const ICONS = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  grid: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  puzzle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 .61.22 2.5 2.5 0 0 1 0 5 1 1 0 0 0-1 1V13a1 1 0 0 0 1 1h2.1a1 1 0 0 0 .61-.22 2.5 2.5 0 0 1 3.79 2.13v.09a2.5 2.5 0 0 1-3.79 2.13 1 1 0 0 0-.61-.22H16a1 1 0 0 0-1 1v2.1a1 1 0 0 1-.22.61 2.5 2.5 0 0 1-2.13 3.79h-.09a2.5 2.5 0 0 1-2.13-3.79 1 1 0 0 1 .61-.22H13a1 1 0 0 0 1-1v-2.1a1 1 0 0 0-.22-.61 2.5 2.5 0 0 1 2.13-3.79h.09a2.5 2.5 0 0 1 2.13 3.79 1 1 0 0 1-.61.22H16a1 1 0 0 1-1-1V11a1 1 0 0 1 .22-.61A2.5 2.5 0 0 0 15.39 4.39z"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  moreVertical: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  // Design type icons
  square: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`,
  smartphone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  'play-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  monitor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  hexagon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  layout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  film: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7.5h4"/><path d="M17 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 16.5h4"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
};

function icon(name) {
  return ICONS[name] || '';
}

// ---- DOM References ----
let $recentGrid, $templatesGrid, $templateTabs, $searchBar, $createModal, $createModalOverlay,
    $customWidth, $customHeight, $customName, $sidebarOverlay, $sidebar, $toastContainer;

// ---- State ----
let activeCategory = 'All';
let openContextMenuId = null;

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  cacheDOM();
  renderQuickActions();
  renderRecentDesigns();
  renderTemplateTabs();
  renderTemplates();
  bindEvents();
  animateEntrance();
});

function cacheDOM() {
  $recentGrid = document.getElementById('recent-designs-grid');
  $templatesGrid = document.getElementById('templates-grid');
  $templateTabs = document.getElementById('template-tabs');
  $searchBar = document.getElementById('search-bar');
  $createModal = document.getElementById('create-modal');
  $createModalOverlay = document.getElementById('create-modal-overlay');
  $customWidth = document.getElementById('custom-width');
  $customHeight = document.getElementById('custom-height');
  $customName = document.getElementById('custom-name');
  $sidebarOverlay = document.getElementById('sidebar-overlay');
  $sidebar = document.getElementById('sidebar');
  $toastContainer = document.getElementById('toast-container');
}

// ============================================
// Quick Actions
// ============================================
function renderQuickActions() {
  const grid = document.getElementById('quick-actions-grid');
  if (!grid) return;

  grid.innerHTML = DESIGN_TYPES.map(type => `
    <div class="action-card" data-color="${type.color}" data-type-id="${type.id}" id="action-${type.id}">
      <div class="action-card-icon">${icon(type.icon)}</div>
      <span class="action-card-label">${type.label}</span>
      <span class="action-card-size">${type.width} × ${type.height} px</span>
    </div>
  `).join('');

  // Add the custom size card
  grid.innerHTML += `
    <div class="action-card" data-color="purple" id="action-custom-size" style="border-style: dashed;">
      <div class="action-card-icon" style="background: hsl(258, 90%, 62%, 0.1); color: hsl(258, 90%, 72%);">${icon('plus')}</div>
      <span class="action-card-label">Custom Size</span>
      <span class="action-card-size">Any dimensions</span>
    </div>
  `;
}

// ============================================
// Recent Designs
// ============================================
function renderRecentDesigns() {
  if (!$recentGrid) return;
  const projects = getProjects();

  if (projects.length === 0) {
    $recentGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">${icon('sparkles')}</div>
        <h3 class="empty-state-title">No designs yet</h3>
        <p class="empty-state-text">Create your first design to get started!</p>
        <button class="btn btn-primary" id="empty-create-btn">${icon('plus')} Create a Design</button>
      </div>
    `;
    const emptyBtn = document.getElementById('empty-create-btn');
    if (emptyBtn) emptyBtn.addEventListener('click', openCreateModal);
    return;
  }

  $recentGrid.innerHTML = projects.map(project => {
    const type = getDesignType(project.typeId);
    const typeName = type ? type.label : 'Custom';
    return `
      <div class="design-card" data-project-id="${project.id}" id="design-${project.id}">
        <button class="design-card-menu-btn" data-menu-for="${project.id}" aria-label="More options">
          ${icon('moreVertical')}
        </button>
        <div class="design-card-preview">
          <div class="preview-gradient" style="background: ${project.gradient};"></div>
          <div class="preview-overlay">
            <button class="preview-action-btn tooltip" data-tooltip="Open" data-action="open" data-id="${project.id}">${icon('externalLink')}</button>
            <button class="preview-action-btn tooltip" data-tooltip="Duplicate" data-action="duplicate" data-id="${project.id}">${icon('copy')}</button>
          </div>
        </div>
        <div class="design-card-info">
          <div class="design-card-title">${escapeHtml(project.name)}</div>
          <div class="design-card-meta">
            <span class="design-card-date">${formatDate(project.updatedAt)}</span>
            <span class="design-card-type">${typeName}</span>
          </div>
        </div>
        <div class="context-menu" id="menu-${project.id}">
          <div class="context-menu-item" data-action="open" data-id="${project.id}">${icon('externalLink')} Open</div>
          <div class="context-menu-item" data-action="rename" data-id="${project.id}">${icon('edit')} Rename</div>
          <div class="context-menu-item" data-action="duplicate" data-id="${project.id}">${icon('copy')} Duplicate</div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item danger" data-action="delete" data-id="${project.id}">${icon('trash')} Delete</div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// Templates
// ============================================
function renderTemplateTabs() {
  if (!$templateTabs) return;

  $templateTabs.innerHTML = TEMPLATE_CATEGORIES.map(cat => `
    <button class="template-tab${cat === activeCategory ? ' active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');
}

function renderTemplates(templates) {
  if (!$templatesGrid) return;
  const list = templates || filterTemplatesByCategory(activeCategory);

  $templatesGrid.innerHTML = list.map(tmpl => {
    const type = getDesignType(tmpl.typeId);
    return `
      <div class="template-card" data-template-id="${tmpl.id}" id="template-${tmpl.id}">
        <div class="template-card-preview">
          <div class="template-gradient-bg" style="background: ${tmpl.gradient};">
            ${type ? icon(type.icon) : ''}
          </div>
          <div class="template-card-overlay">
            <button class="template-use-btn" data-use-template="${tmpl.id}">Use Template</button>
          </div>
        </div>
        <div class="template-card-info">
          <div class="template-card-title">${tmpl.title}</div>
          <div class="template-card-category">${tmpl.category}${type ? ` • ${type.width}×${type.height}` : ''}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// Event Bindings
// ============================================
function bindEvents() {
  // Quick action cards
  document.getElementById('quick-actions-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.action-card');
    if (!card) return;

    if (card.id === 'action-custom-size') {
      openCreateModal();
      return;
    }

    const typeId = card.dataset.typeId;
    const type = getDesignType(typeId);
    if (type) {
      const project = createProject({
        name: type.label,
        width: type.width,
        height: type.height,
        typeId: type.id,
      });
      renderRecentDesigns();
      showToast('success', `Created "${project.name}"`);
    }
  });

  // Template tabs
  $templateTabs?.addEventListener('click', (e) => {
    const tab = e.target.closest('.template-tab');
    if (!tab) return;
    activeCategory = tab.dataset.category;
    renderTemplateTabs();
    renderTemplates();
  });

  // Template use button
  $templatesGrid?.addEventListener('click', (e) => {
    const useBtn = e.target.closest('[data-use-template]');
    if (!useBtn) return;

    const tmpl = STARTER_TEMPLATES.find(t => t.id === useBtn.dataset.useTemplate);
    if (!tmpl) return;

    const type = getDesignType(tmpl.typeId);
    const project = createProject({
      name: tmpl.title,
      width: type?.width || 1080,
      height: type?.height || 1080,
      typeId: tmpl.typeId,
      templateId: tmpl.id,
      gradient: tmpl.gradient,
    });
    renderRecentDesigns();
    showToast('success', `Created "${project.name}" from template`);
  });

  // Search
  let searchTimeout;
  $searchBar?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const q = e.target.value.trim();
      if (q) {
        const results = searchTemplates(q);
        renderTemplates(results);
      } else {
        renderTemplates();
      }
    }, 200);
  });

  // Design card interactions (menu, actions)
  $recentGrid?.addEventListener('click', (e) => {
    // Menu toggle
    const menuBtn = e.target.closest('.design-card-menu-btn');
    if (menuBtn) {
      e.stopPropagation();
      const projectId = menuBtn.dataset.menuFor;
      toggleContextMenu(projectId);
      return;
    }

    // Context menu item
    const menuItem = e.target.closest('.context-menu-item');
    if (menuItem) {
      e.stopPropagation();
      handleDesignAction(menuItem.dataset.action, menuItem.dataset.id);
      closeAllContextMenus();
      return;
    }

    // Preview action button
    const actionBtn = e.target.closest('.preview-action-btn');
    if (actionBtn) {
      e.stopPropagation();
      handleDesignAction(actionBtn.dataset.action, actionBtn.dataset.id);
      return;
    }

    // Click on card itself → open
    const card = e.target.closest('.design-card');
    if (card) {
      handleDesignAction('open', card.dataset.projectId);
    }
  });

  // Close context menus on outside click
  document.addEventListener('click', () => {
    closeAllContextMenus();
  });

  // Create modal
  document.getElementById('btn-create-design')?.addEventListener('click', openCreateModal);
  document.getElementById('modal-close-btn')?.addEventListener('click', closeCreateModal);
  $createModalOverlay?.addEventListener('click', (e) => {
    if (e.target === $createModalOverlay) closeCreateModal();
  });
  document.getElementById('modal-create-btn')?.addEventListener('click', handleCustomCreate);

  // Preset chips in modal
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      $customWidth.value = chip.dataset.w;
      $customHeight.value = chip.dataset.h;
      $customName.value = chip.dataset.name || '';
    });
  });

  // Mobile sidebar toggle
  document.getElementById('menu-toggle')?.addEventListener('click', toggleSidebar);
  $sidebarOverlay?.addEventListener('click', closeSidebar);

  // Keyboard: Escape to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCreateModal();
      closeAllContextMenus();
      closeSidebar();
    }
  });

  // Nav items active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// ============================================
// Design Actions
// ============================================
function handleDesignAction(action, projectId) {
  switch (action) {
    case 'open':
      showToast('info', 'Editor coming soon — stay tuned! ✨');
      break;
    case 'rename': {
      const projects = getProjects();
      const proj = projects.find(p => p.id === projectId);
      if (!proj) return;
      const newName = prompt('Rename design:', proj.name);
      if (newName && newName.trim()) {
        renameProject(projectId, newName.trim());
        renderRecentDesigns();
        showToast('success', 'Design renamed');
      }
      break;
    }
    case 'duplicate':
      duplicateProject(projectId);
      renderRecentDesigns();
      showToast('success', 'Design duplicated');
      break;
    case 'delete':
      if (confirm('Delete this design? This cannot be undone.')) {
        deleteProject(projectId);
        renderRecentDesigns();
        showToast('success', 'Design deleted');
      }
      break;
  }
}

// ============================================
// Context Menus
// ============================================
function toggleContextMenu(projectId) {
  const menu = document.getElementById(`menu-${projectId}`);
  if (!menu) return;

  if (openContextMenuId === projectId) {
    closeAllContextMenus();
    return;
  }

  closeAllContextMenus();
  menu.classList.add('visible');
  openContextMenuId = projectId;
}

function closeAllContextMenus() {
  document.querySelectorAll('.context-menu.visible').forEach(m => m.classList.remove('visible'));
  openContextMenuId = null;
}

// ============================================
// Create Modal
// ============================================
function openCreateModal() {
  $createModalOverlay?.classList.add('visible');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $customName?.focus(), 200);
}

function closeCreateModal() {
  $createModalOverlay?.classList.remove('visible');
  document.body.style.overflow = '';
}

function handleCustomCreate() {
  const width = parseInt($customWidth?.value) || 1080;
  const height = parseInt($customHeight?.value) || 1080;
  const name = $customName?.value.trim() || 'Untitled Design';

  if (width < 1 || height < 1 || width > 10000 || height > 10000) {
    showToast('error', 'Dimensions must be between 1 and 10,000 px');
    return;
  }

  const project = createProject({ name, width, height, typeId: 'custom' });
  renderRecentDesigns();
  closeCreateModal();
  showToast('success', `Created "${project.name}" (${width}×${height})`);

  // Reset form
  if ($customWidth) $customWidth.value = '1080';
  if ($customHeight) $customHeight.value = '1080';
  if ($customName) $customName.value = '';
  document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
}

// ============================================
// Sidebar (Mobile)
// ============================================
function toggleSidebar() {
  $sidebar?.classList.toggle('open');
  $sidebarOverlay?.classList.toggle('visible');
}

function closeSidebar() {
  $sidebar?.classList.remove('open');
  $sidebarOverlay?.classList.remove('visible');
}

// ============================================
// Toast Notifications
// ============================================
function showToast(type, message) {
  if (!$toastContainer) return;

  const iconMap = {
    success: icon('check'),
    error: icon('alertCircle'),
    info: icon('info'),
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${iconMap[type] || ''}<span>${escapeHtml(message)}</span>`;
  $toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

// ============================================
// Entrance Animation
// ============================================
function animateEntrance() {
  const elements = document.querySelectorAll('.hero-section, .quick-actions, .recent-designs, .templates-section');
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

// ============================================
// Utility
// ============================================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
