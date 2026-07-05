// ============================================
// CREATO — Main Application & SPA View Router
// Handles: Home, Templates, Projects, Brand Kit, AI Tools, Trash, Settings
// ============================================

import { DESIGN_TYPES, TEMPLATE_CATEGORIES, STARTER_TEMPLATES, searchTemplates, filterTemplatesByCategory, getDesignType } from './templates.js';
import { 
  getProjects, getTrashedProjects, createProject, renameProject, duplicateProject, 
  trashProject, restoreProject, permanentlyDeleteProject, emptyTrash,
  getBrandKit, addBrandColor, removeBrandColor, addBrandFont, removeBrandFont,
  getSettings, updateSettings, getNotifications, markAllNotificationsRead, clearNotifications, getUnreadCount,
  exportAllData, importAllData, clearAllData, formatDate 
} from './projects.js';

// ---- Inline SVG Icons ----
const ICONS = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  grid: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  moreVertical: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 1 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
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
  rotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
  type: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
};

function icon(name) { return ICONS[name] || ''; }

// ---- State ----
let currentView = 'home';
let activeTemplateCategory = 'All';
let projectSortOrder = 'newest';
let openContextMenuId = null;

// DOM Cache
let $mainContent, $searchBar, $searchDropdown, $notificationBtn, $notificationPanel, 
    $notificationList, $notificationBadgeDot, $sidebarProfile, $profileDropdown,
    $createModalOverlay, $customWidth, $customHeight, $customName, $sidebarOverlay, $sidebar, $toastContainer;

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  cacheDOM();
  applySettingsTheme();
  updateBadges();
  bindGlobalEvents();
  navigateTo('home');
});

function cacheDOM() {
  $mainContent = document.getElementById('main-content');
  $searchBar = document.getElementById('search-bar');
  $searchDropdown = document.getElementById('search-dropdown');
  $notificationBtn = document.getElementById('btn-notifications');
  $notificationPanel = document.getElementById('notification-panel');
  $notificationList = document.getElementById('notification-list');
  $notificationBadgeDot = document.getElementById('notification-badge-dot');
  $sidebarProfile = document.getElementById('sidebar-profile');
  $profileDropdown = document.getElementById('profile-dropdown');
  $createModalOverlay = document.getElementById('create-modal-overlay');
  $customWidth = document.getElementById('custom-width');
  $customHeight = document.getElementById('custom-height');
  $customName = document.getElementById('custom-name');
  $sidebarOverlay = document.getElementById('sidebar-overlay');
  $sidebar = document.getElementById('sidebar');
  $toastContainer = document.getElementById('toast-container');
}

function updateBadges() {
  const projCount = getProjects().length;
  const trashCount = getTrashedProjects().length;
  const unreadNotifs = getUnreadCount();

  const projBadge = document.getElementById('projects-count-badge');
  if (projBadge) projBadge.textContent = projCount;

  const trashBadge = document.getElementById('trash-count-badge');
  if (trashBadge) {
    trashBadge.textContent = trashCount;
    trashBadge.style.display = trashCount > 0 ? 'inline-block' : 'none';
  }

  if ($notificationBadgeDot) {
    $notificationBadgeDot.style.display = unreadNotifs > 0 ? 'block' : 'none';
  }

  const settings = getSettings();
  const avatar = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-display-name');
  if (avatar) avatar.textContent = settings.profileInitials || 'AM';
  if (nameEl) nameEl.textContent = settings.profileName || 'Aditya Mazire';
}

function applySettingsTheme() {
  const settings = getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
}

// ============================================
// SPA VIEW ROUTER
// ============================================
function navigateTo(viewName) {
  currentView = viewName;

  // Highlight active sidebar item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  // Render view into main-content
  $mainContent.innerHTML = '';
  $mainContent.className = 'main-content view-fade-in';

  switch (viewName) {
    case 'home':
      renderHomeView();
      break;
    case 'templates':
      renderTemplatesView();
      break;
    case 'projects':
      renderProjectsView();
      break;
    case 'brand':
      renderBrandKitView();
      break;
    case 'apps':
      renderAIToolsView();
      break;
    case 'trash':
      renderTrashView();
      break;
    case 'settings':
      renderSettingsView();
      break;
    default:
      renderHomeView();
  }

  updateBadges();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// VIEW 1: HOME
// ============================================
function renderHomeView() {
  const settings = getSettings();
  const firstName = settings.profileName ? settings.profileName.split(' ')[0] : 'Aditya';

  $mainContent.innerHTML = `
    <section class="hero-section">
      <h1 class="hero-title">What will you <span class="gradient-text">create</span> today, ${escapeHtml(firstName)}?</h1>
      <p class="hero-subtitle">Design stunning graphics, social media posts, presentations, logos, and motion designs — all in one workspace.</p>
    </section>

    <section class="quick-actions">
      <div class="section-header">
        <div>
          <h2 class="section-title">Start Creating</h2>
          <p class="section-subtitle">Choose a canvas size to get started</p>
        </div>
      </div>
      <div class="quick-actions-grid" id="quick-actions-grid">
        ${DESIGN_TYPES.map(type => `
          <div class="action-card" data-color="${type.color}" data-type-id="${type.id}">
            <div class="action-card-icon">${icon(type.icon)}</div>
            <span class="action-card-label">${type.label}</span>
            <span class="action-card-size">${type.width} × ${type.height} px</span>
          </div>
        `).join('')}
        <div class="action-card" data-color="purple" id="home-action-custom" style="border-style: dashed;">
          <div class="action-card-icon" style="background: hsl(258, 90%, 62%, 0.1); color: hsl(258, 90%, 72%);">${icon('plus')}</div>
          <span class="action-card-label">Custom Size</span>
          <span class="action-card-size">Any dimensions</span>
        </div>
      </div>
    </section>

    <section class="recent-designs">
      <div class="section-header">
        <div>
          <h2 class="section-title">Recent Designs</h2>
          <p class="section-subtitle">Pick up where you left off</p>
        </div>
        <button class="section-link" id="home-see-all-projects">
          See all (${getProjects().length})
          ${icon('arrowRight')}
        </button>
      </div>
      <div class="recent-designs-grid" id="home-recent-grid"></div>
    </section>

    <section class="templates-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Explore Templates</h2>
          <p class="section-subtitle">Start with professionally designed templates</p>
        </div>
        <button class="section-link" id="home-see-all-templates">
          Browse all
          ${icon('arrowRight')}
        </button>
      </div>
      <div class="template-tabs" id="home-template-tabs"></div>
      <div class="templates-grid" id="home-templates-grid"></div>
    </section>
  `;

  // Bind Home sub-events
  renderRecentGrid('home-recent-grid', 6);
  renderHomeTemplateTabs();
  renderHomeTemplates();

  document.getElementById('quick-actions-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.action-card');
    if (!card) return;

    if (card.id === 'home-action-custom') {
      openCreateModal();
      return;
    }

    const type = getDesignType(card.dataset.typeId);
    if (type) {
      const proj = createProject({ name: type.label, width: type.width, height: type.height, typeId: type.id });
      renderRecentGrid('home-recent-grid', 6);
      updateBadges();
      showToast('success', `Created "${proj.name}"`);
    }
  });

  document.getElementById('home-see-all-projects')?.addEventListener('click', () => navigateTo('projects'));
  document.getElementById('home-see-all-templates')?.addEventListener('click', () => navigateTo('templates'));
}

function renderHomeTemplateTabs() {
  const container = document.getElementById('home-template-tabs');
  if (!container) return;
  container.innerHTML = TEMPLATE_CATEGORIES.map(cat => `
    <button class="template-tab${cat === activeTemplateCategory ? ' active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');

  container.addEventListener('click', (e) => {
    const tab = e.target.closest('.template-tab');
    if (!tab) return;
    activeTemplateCategory = tab.dataset.category;
    renderHomeTemplateTabs();
    renderHomeTemplates();
  });
}

function renderHomeTemplates() {
  const grid = document.getElementById('home-templates-grid');
  if (!grid) return;
  const list = filterTemplatesByCategory(activeTemplateCategory).slice(0, 8);

  grid.innerHTML = list.map(tmpl => {
    const type = getDesignType(tmpl.typeId);
    return `
      <div class="template-card" data-template-id="${tmpl.id}">
        <div class="template-card-preview">
          <div class="template-gradient-bg" style="background: ${tmpl.gradient};">
            ${type ? icon(type.icon) : ''}
          </div>
          <div class="template-card-overlay">
            <button class="template-use-btn" data-use-template="${tmpl.id}">Use Template</button>
          </div>
        </div>
        <div class="template-card-info">
          <div class="template-card-title">${escapeHtml(tmpl.title)}</div>
          <div class="template-card-category">${tmpl.category}${type ? ` • ${type.width}×${type.height}` : ''}</div>
        </div>
      </div>
    `;
  }).join('');

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-use-template]');
    if (!btn) return;
    const tmpl = STARTER_TEMPLATES.find(t => t.id === btn.dataset.useTemplate);
    if (tmpl) {
      const type = getDesignType(tmpl.typeId);
      const proj = createProject({
        name: tmpl.title,
        width: type?.width || 1080,
        height: type?.height || 1080,
        typeId: tmpl.typeId,
        templateId: tmpl.id,
        gradient: tmpl.gradient,
      });
      updateBadges();
      showToast('success', `Created "${proj.name}" from template`);
    }
  });
}

// ============================================
// VIEW 2: TEMPLATES BROWSER
// ============================================
function renderTemplatesView() {
  $mainContent.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Template Library</h1>
        <p class="view-subtitle">Browse professionally pre-designed graphics and motion templates</p>
      </div>
    </div>

    <div class="template-tabs" id="full-template-tabs" style="margin-bottom: 24px;">
      ${TEMPLATE_CATEGORIES.map(cat => `
        <button class="template-tab${cat === activeTemplateCategory ? ' active' : ''}" data-category="${cat}">${cat}</button>
      `).join('')}
    </div>

    <div class="templates-grid" id="full-templates-grid"></div>
  `;

  renderFullTemplates();

  document.getElementById('full-template-tabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.template-tab');
    if (!tab) return;
    activeTemplateCategory = tab.dataset.category;
    renderTemplatesView();
  });
}

function renderFullTemplates() {
  const grid = document.getElementById('full-templates-grid');
  if (!grid) return;
  const list = filterTemplatesByCategory(activeTemplateCategory);

  grid.innerHTML = list.map(tmpl => {
    const type = getDesignType(tmpl.typeId);
    return `
      <div class="template-card" data-template-id="${tmpl.id}">
        <div class="template-card-preview">
          <div class="template-gradient-bg" style="background: ${tmpl.gradient};">
            ${type ? icon(type.icon) : ''}
          </div>
          <div class="template-card-overlay">
            <button class="template-use-btn" data-use-template="${tmpl.id}">Use Template</button>
          </div>
        </div>
        <div class="template-card-info">
          <div class="template-card-title">${escapeHtml(tmpl.title)}</div>
          <div class="template-card-category">${tmpl.category}${type ? ` • ${type.width}×${type.height}` : ''}</div>
        </div>
      </div>
    `;
  }).join('');

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-use-template]');
    if (!btn) return;
    const tmpl = STARTER_TEMPLATES.find(t => t.id === btn.dataset.useTemplate);
    if (tmpl) {
      const type = getDesignType(tmpl.typeId);
      const proj = createProject({
        name: tmpl.title,
        width: type?.width || 1080,
        height: type?.height || 1080,
        typeId: tmpl.typeId,
        templateId: tmpl.id,
        gradient: tmpl.gradient,
      });
      updateBadges();
      showToast('success', `Created "${proj.name}" from template`);
    }
  });
}

// ============================================
// VIEW 3: PROJECTS MANAGER
// ============================================
function renderProjectsView() {
  const projects = getProjects();

  $mainContent.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Your Projects</h1>
        <p class="view-subtitle">Manage, duplicate, and organize all your graphics & motion designs</p>
      </div>
      <div class="view-header-right">
        <span class="design-count">${projects.length} design${projects.length !== 1 ? 's' : ''}</span>
        <select class="sort-select" id="projects-sort-select">
          <option value="newest"${projectSortOrder === 'newest' ? ' selected' : ''}>Newest first</option>
          <option value="oldest"${projectSortOrder === 'oldest' ? ' selected' : ''}>Oldest first</option>
          <option value="name"${projectSortOrder === 'name' ? ' selected' : ''}>Name A-Z</option>
        </select>
        <button class="btn btn-primary" id="projects-new-btn">${icon('plus')} New Design</button>
      </div>
    </div>

    <div class="recent-designs-grid" id="full-projects-grid"></div>
  `;

  renderSortedProjects();

  document.getElementById('projects-sort-select')?.addEventListener('change', (e) => {
    projectSortOrder = e.target.value;
    renderSortedProjects();
  });

  document.getElementById('projects-new-btn')?.addEventListener('click', openCreateModal);
}

function renderSortedProjects() {
  const grid = document.getElementById('full-projects-grid');
  if (!grid) return;

  let projects = [...getProjects()];
  if (projectSortOrder === 'newest') projects.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (projectSortOrder === 'oldest') projects.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (projectSortOrder === 'name') projects.sort((a,b) => a.name.localeCompare(b.name));

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">${icon('sparkles')}</div>
        <h3 class="empty-state-title">No projects yet</h3>
        <p class="empty-state-text">Create your first design to see it here!</p>
        <button class="btn btn-primary" id="proj-empty-create">${icon('plus')} Create a Design</button>
      </div>
    `;
    document.getElementById('proj-empty-create')?.addEventListener('click', openCreateModal);
    return;
  }

  grid.innerHTML = projects.map(project => {
    const type = getDesignType(project.typeId);
    const typeName = type ? type.label : 'Custom';
    return `
      <div class="design-card" data-project-id="${project.id}">
        <button class="design-card-menu-btn" data-menu-for="${project.id}">${icon('moreVertical')}</button>
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
          <div class="context-menu-item danger" data-action="trash" data-id="${project.id}">${icon('trash')} Move to Trash</div>
        </div>
      </div>
    `;
  }).join('');

  grid.addEventListener('click', handleDesignGridClick);
}

// ============================================
// VIEW 4: BRAND KIT
// ============================================
function renderBrandKitView() {
  const kit = getBrandKit();

  $mainContent.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Brand Kit</h1>
        <p class="view-subtitle">Store your brand colors, fonts, and identity presets for consistent designs</p>
      </div>
    </div>

    <!-- Brand Colors -->
    <div class="brand-section">
      <div class="brand-section-header">
        <h2 class="brand-section-title">${icon('palette')} Brand Palette</h2>
      </div>
      <div class="color-swatches" id="brand-swatches">
        ${kit.colors.map(color => `
          <div class="color-swatch" style="background: ${color};" data-color="${color}">
            <button class="color-swatch-remove" data-remove-color="${color}">${icon('trash')}</button>
            <span class="color-swatch-label">${color}</span>
          </div>
        `).join('')}
        <button class="add-swatch" id="add-brand-color-btn">
          ${icon('plus')}
          <span>Add</span>
        </button>
        <input type="color" class="hidden-color-input" id="brand-color-picker" value="#7C3AED" />
      </div>
    </div>

    <!-- Brand Fonts -->
    <div class="brand-section">
      <div class="brand-section-header">
        <h2 class="brand-section-title">${icon('type')} Typography</h2>
      </div>
      <div class="font-list" id="brand-fonts">
        ${kit.fonts.map(font => `
          <div class="font-item">
            <div class="font-item-info">
              <span class="font-item-name" style="font-family: '${font}', sans-serif;">${escapeHtml(font)}</span>
              <span class="font-item-preview">The quick brown fox jumps over the lazy dog</span>
            </div>
            <button class="font-item-remove" data-remove-font="${font}">${icon('trash')}</button>
          </div>
        `).join('')}
      </div>
      <div class="add-font-row">
        <input type="text" class="add-font-input" id="new-font-name" placeholder="Enter font family name (e.g. Montserrat, Poppins)..." />
        <button class="add-font-btn" id="add-font-btn">${icon('plus')} Add Font</button>
      </div>
    </div>
  `;

  // Brand sub-events
  const colorPicker = document.getElementById('brand-color-picker');
  document.getElementById('add-brand-color-btn')?.addEventListener('click', () => colorPicker?.click());
  colorPicker?.addEventListener('change', (e) => {
    addBrandColor(e.target.value);
    renderBrandKitView();
    showToast('success', `Added color ${e.target.value}`);
  });

  document.getElementById('brand-swatches')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-color]');
    if (!btn) return;
    removeBrandColor(btn.dataset.removeColor);
    renderBrandKitView();
    showToast('info', 'Removed brand color');
  });

  document.getElementById('add-font-btn')?.addEventListener('click', handleAddFont);
  document.getElementById('new-font-name')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddFont();
  });

  document.getElementById('brand-fonts')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-font]');
    if (!btn) return;
    removeBrandFont(btn.dataset.removeFont);
    renderBrandKitView();
    showToast('info', 'Removed font');
  });
}

function handleAddFont() {
  const input = document.getElementById('new-font-name');
  const name = input?.value.trim();
  if (name) {
    addBrandFont(name);
    renderBrandKitView();
    showToast('success', `Added font "${name}"`);
  }
}

// ============================================
// VIEW 5: AI TOOLS & GENERATORS
// ============================================
function renderAIToolsView() {
  $mainContent.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">AI & Smart Utilities</h1>
        <p class="view-subtitle">Generate palettes, gradients, placeholder copy, and design assets instantly</p>
      </div>
    </div>

    <div class="ai-tools-grid">

      <!-- Tool 1: AI Palette Generator -->
      <div class="ai-tool-card">
        <div class="ai-tool-header">
          <div class="ai-tool-icon purple">${icon('palette')}</div>
          <h2 class="ai-tool-title">Smart Palette Generator</h2>
        </div>
        <p class="ai-tool-desc">Generate harmonized 5-color palettes using aesthetic color theory (analogous, complementary, triadic).</p>
        <div class="palette-display" id="ai-palette-display"></div>
        <div class="ai-tool-actions">
          <button class="generate-btn" id="gen-palette-btn">${icon('sparkles')} Generate Palette</button>
          <button class="copy-btn" id="copy-palette-btn">${icon('copy')} Copy Hexes</button>
        </div>
      </div>

      <!-- Tool 2: Gradient Builder -->
      <div class="ai-tool-card">
        <div class="ai-tool-header">
          <div class="ai-tool-icon cyan">${icon('zap')}</div>
          <h2 class="ai-tool-title">Gradient Craft</h2>
        </div>
        <p class="ai-tool-desc">Create sleek CSS linear gradients with custom angles and color stops.</p>
        <div class="gradient-preview" id="ai-gradient-preview"></div>
        <div class="gradient-controls">
          <input type="color" class="gradient-color-input" id="grad-c1" value="#7C3AED" />
          <input type="color" class="gradient-color-input" id="grad-c2" value="#3B82F6" />
          <input type="number" class="gradient-angle-input" id="grad-angle" value="135" min="0" max="360" /> deg
        </div>
        <div class="ai-tool-actions">
          <button class="generate-btn" id="gen-gradient-btn">${icon('sparkles')} Random Gradient</button>
          <button class="copy-btn" id="copy-gradient-btn">${icon('copy')} Copy CSS</button>
        </div>
      </div>

      <!-- Tool 3: Lorem Ipsum Generator -->
      <div class="ai-tool-card">
        <div class="ai-tool-header">
          <div class="ai-tool-icon pink">${icon('type')}</div>
          <h2 class="ai-tool-title">Smart Copy Generator</h2>
        </div>
        <p class="ai-tool-desc">Generate realistic placeholder copy for social graphics, UI mockups, and presentations.</p>
        <div class="lorem-controls">
          <select class="sort-select lorem-type-select" id="lorem-type">
            <option value="words">Words</option>
            <option value="sentences" selected>Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
          <input type="number" class="lorem-count" id="lorem-count" value="2" min="1" max="10" />
        </div>
        <div class="lorem-output" id="lorem-output"></div>
        <div class="ai-tool-actions">
          <button class="generate-btn" id="gen-lorem-btn">${icon('sparkles')} Generate Copy</button>
          <button class="copy-btn" id="copy-lorem-btn">${icon('copy')} Copy Text</button>
        </div>
      </div>

    </div>
  `;

  // Bind AI Tool 1: Palette
  let currentPalette = [];
  function generateNewPalette() {
    const hues = [Math.floor(Math.random() * 360)];
    hues.push((hues[0] + 30) % 360, (hues[0] + 60) % 360, (hues[0] + 180) % 360, (hues[0] + 210) % 360);
    currentPalette = hues.map((h, i) => `hsl(${h}, ${70 + i * 5}%, ${50 + (i % 2) * 10}%)`);
    
    const display = document.getElementById('ai-palette-display');
    if (display) {
      display.innerHTML = currentPalette.map(c => `
        <div class="palette-color" style="background: ${c};">
          <span class="palette-color-label">${c}</span>
        </div>
      `).join('');
    }
  }
  generateNewPalette();
  document.getElementById('gen-palette-btn')?.addEventListener('click', generateNewPalette);
  document.getElementById('copy-palette-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(currentPalette.join(', '));
    showToast('success', 'Palette copied to clipboard!');
  });

  // Bind AI Tool 2: Gradient
  function updateGradient() {
    const c1 = document.getElementById('grad-c1')?.value || '#7C3AED';
    const c2 = document.getElementById('grad-c2')?.value || '#3B82F6';
    const angle = document.getElementById('grad-angle')?.value || 135;
    const css = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
    const preview = document.getElementById('ai-gradient-preview');
    if (preview) preview.style.background = css;
  }
  updateGradient();
  ['grad-c1', 'grad-c2', 'grad-angle'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateGradient);
  });
  document.getElementById('gen-gradient-btn')?.addEventListener('click', () => {
    const r1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    const r2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    const ang = Math.floor(Math.random() * 360);
    document.getElementById('grad-c1').value = r1;
    document.getElementById('grad-c2').value = r2;
    document.getElementById('grad-angle').value = ang;
    updateGradient();
  });
  document.getElementById('copy-gradient-btn')?.addEventListener('click', () => {
    const c1 = document.getElementById('grad-c1').value;
    const c2 = document.getElementById('grad-c2').value;
    const angle = document.getElementById('grad-angle').value;
    const css = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
    navigator.clipboard.writeText(css);
    showToast('success', 'Gradient CSS copied!');
  });

  // Bind AI Tool 3: Lorem
  const LOREM = [
    'Creato empowers graphic designers and motion creators to craft stunning visuals effortless.',
    'Build viral social media posts, elegant presentation decks, brand assets, and dynamic animations in minutes.',
    'Design with precision, harmonize brand colors, and unleash your creative potential with AI-assisted tools.',
    'Transform your ideas into high-impact digital experiences with responsive layout controls and instant export.',
  ];
  function generateLorem() {
    const type = document.getElementById('lorem-type')?.value || 'sentences';
    const count = parseInt(document.getElementById('lorem-count')?.value) || 2;
    let text = '';
    if (type === 'words') {
      text = LOREM.join(' ').split(' ').slice(0, count * 5).join(' ');
    } else {
      text = LOREM.slice(0, count).join(' ');
    }
    const output = document.getElementById('lorem-output');
    if (output) output.textContent = text;
  }
  generateLorem();
  document.getElementById('gen-lorem-btn')?.addEventListener('click', generateLorem);
  document.getElementById('copy-lorem-btn')?.addEventListener('click', () => {
    const text = document.getElementById('lorem-output')?.textContent || '';
    navigator.clipboard.writeText(text);
    showToast('success', 'Copy text copied!');
  });
}

// ============================================
// VIEW 6: TRASH
// ============================================
function renderTrashView() {
  const trashed = getTrashedProjects();

  $mainContent.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Trash</h1>
        <p class="view-subtitle">Deleted items remain here until permanently removed</p>
      </div>
      <div class="view-header-right">
        <span class="design-count">${trashed.length} item${trashed.length !== 1 ? 's' : ''}</span>
        ${trashed.length > 0 ? `
          <button class="btn-danger" id="empty-trash-btn">${icon('trash')} Empty Trash</button>
        ` : ''}
      </div>
    </div>

    <div class="recent-designs-grid" id="trash-grid"></div>
  `;

  renderTrashGrid();

  document.getElementById('empty-trash-btn')?.addEventListener('click', () => {
    if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
      emptyTrash();
      renderTrashView();
      showToast('success', 'Trash emptied');
    }
  });
}

function renderTrashGrid() {
  const grid = document.getElementById('trash-grid');
  if (!grid) return;
  const trashed = getTrashedProjects();

  if (trashed.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">${icon('trash')}</div>
        <h3 class="empty-state-title">Trash is empty</h3>
        <p class="empty-state-text">Items moved to trash will appear here.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = trashed.map(project => {
    const type = getDesignType(project.typeId);
    return `
      <div class="design-card" data-project-id="${project.id}">
        <div class="trash-card-overlay">
          <button class="trash-action-btn restore" data-action="restore" data-id="${project.id}">${icon('rotateCcw')} Restore</button>
          <button class="trash-action-btn perm-delete" data-action="perm-delete" data-id="${project.id}">${icon('trash')} Delete</button>
        </div>
        <div class="design-card-preview">
          <div class="preview-gradient" style="background: ${project.gradient};"></div>
        </div>
        <div class="design-card-info">
          <div class="design-card-title">${escapeHtml(project.name)}</div>
          <div class="design-card-meta">
            <span class="design-card-date">Deleted ${formatDate(project.trashedAt)}</span>
            <span class="design-card-type">${type ? type.label : 'Custom'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'restore') {
      restoreProject(id);
      renderTrashView();
      showToast('success', 'Project restored');
    } else if (action === 'perm-delete') {
      if (confirm('Permanently delete this project?')) {
        permanentlyDeleteProject(id);
        renderTrashView();
        showToast('info', 'Project permanently deleted');
      }
    }
  });
}

// ============================================
// VIEW 7: SETTINGS
// ============================================
function renderSettingsView() {
  const settings = getSettings();

  $mainContent.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Settings</h1>
        <p class="view-subtitle">Manage preferences, account settings, and data exports</p>
      </div>
    </div>

    <div class="settings-grid">

      <!-- Profile Settings -->
      <div class="settings-card">
        <h2 class="settings-card-title">${icon('home')} Account Profile</h2>
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Display Name</span>
            <span class="setting-description">Your name shown across the workspace</span>
          </div>
          <input type="text" class="settings-input" id="setting-profile-name" value="${escapeHtml(settings.profileName || '')}" />
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Initials Avatar</span>
            <span class="setting-description">2 letters for your sidebar avatar</span>
          </div>
          <input type="text" class="settings-input" id="setting-profile-initials" value="${escapeHtml(settings.profileInitials || 'AM')}" maxlength="3" style="width: 80px; text-transform: uppercase;" />
        </div>
      </div>

      <!-- Appearance -->
      <div class="settings-card">
        <h2 class="settings-card-title">${icon('palette')} Appearance</h2>
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Dark Theme</span>
            <span class="setting-description">Switch between sleek Dark and crisp Light mode</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-dark-toggle" ${settings.theme === 'dark' ? 'checked' : ''} />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- Data Management -->
      <div class="settings-card" style="grid-column: 1 / -1;">
        <h2 class="settings-card-title">${icon('download')} Data & Backup</h2>
        <div class="data-actions">
          <button class="data-btn" id="setting-export-btn">
            ${icon('download')}
            <div>
              <div style="font-weight: 600;">Export Backup (JSON)</div>
              <div style="font-size: 12px; color: var(--text-tertiary);">Download all your projects, brand kit, and settings</div>
            </div>
          </button>
          <button class="data-btn" id="setting-import-btn">
            ${icon('upload')}
            <div>
              <div style="font-weight: 600;">Import Backup</div>
              <div style="font-size: 12px; color: var(--text-tertiary);">Restore your workspace from a JSON file</div>
            </div>
          </button>
          <button class="data-btn danger" id="setting-clear-btn">
            ${icon('trash')}
            <div>
              <div style="font-weight: 600;">Reset All Data</div>
              <div style="font-size: 12px; color: hsl(0,80%,65%);">Clear all local projects and reset to default state</div>
            </div>
          </button>
        </div>
      </div>

    </div>
  `;

  // Profile save on blur/change
  const saveProfile = () => {
    const name = document.getElementById('setting-profile-name')?.value.trim() || 'Aditya Mazire';
    const initials = document.getElementById('setting-profile-initials')?.value.trim() || 'AM';
    updateSettings({ profileName: name, profileInitials: initials });
    updateBadges();
  };
  document.getElementById('setting-profile-name')?.addEventListener('change', saveProfile);
  document.getElementById('setting-profile-initials')?.addEventListener('change', saveProfile);

  // Theme toggle
  document.getElementById('setting-dark-toggle')?.addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    updateSettings({ theme });
    applySettingsTheme();
    showToast('info', `Switched to ${theme} theme`);
  });

  // Export
  document.getElementById('setting-export-btn')?.addEventListener('click', () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creato-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Backup exported successfully!');
  });

  // Import
  const fileInput = document.getElementById('data-import-input');
  document.getElementById('setting-import-btn')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const ok = importAllData(evt.target.result);
      if (ok) {
        applySettingsTheme();
        updateBadges();
        navigateTo('projects');
        showToast('success', 'Backup imported successfully!');
      } else {
        showToast('error', 'Failed to import backup file.');
      }
    };
    reader.readAsText(file);
  });

  // Clear data
  document.getElementById('setting-clear-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all Creato data? This cannot be undone.')) {
      clearAllData();
      applySettingsTheme();
      updateBadges();
      navigateTo('home');
      showToast('info', 'All data reset to defaults.');
    }
  });
}

// ============================================
// COMMON DESIGN GRID HELPERS
// ============================================
function renderRecentGrid(containerId, limit = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const projects = getProjects().slice(0, limit);

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">${icon('sparkles')}</div>
        <h3 class="empty-state-title">No designs yet</h3>
        <p class="empty-state-text">Create your first design to get started!</p>
        <button class="btn btn-primary" id="empty-create-btn">${icon('plus')} Create a Design</button>
      </div>
    `;
    document.getElementById('empty-create-btn')?.addEventListener('click', openCreateModal);
    return;
  }

  container.innerHTML = projects.map(project => {
    const type = getDesignType(project.typeId);
    return `
      <div class="design-card" data-project-id="${project.id}">
        <button class="design-card-menu-btn" data-menu-for="${project.id}">${icon('moreVertical')}</button>
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
            <span class="design-card-type">${type ? type.label : 'Custom'}</span>
          </div>
        </div>
        <div class="context-menu" id="menu-${project.id}">
          <div class="context-menu-item" data-action="open" data-id="${project.id}">${icon('externalLink')} Open</div>
          <div class="context-menu-item" data-action="rename" data-id="${project.id}">${icon('edit')} Rename</div>
          <div class="context-menu-item" data-action="duplicate" data-id="${project.id}">${icon('copy')} Duplicate</div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item danger" data-action="trash" data-id="${project.id}">${icon('trash')} Move to Trash</div>
        </div>
      </div>
    `;
  }).join('');

  container.addEventListener('click', handleDesignGridClick);
}

function handleDesignGridClick(e) {
  // Context menu toggle
  const menuBtn = e.target.closest('.design-card-menu-btn');
  if (menuBtn) {
    e.stopPropagation();
    toggleContextMenu(menuBtn.dataset.menuFor);
    return;
  }

  // Context menu item click
  const menuItem = e.target.closest('.context-menu-item');
  if (menuItem) {
    e.stopPropagation();
    handleDesignAction(menuItem.dataset.action, menuItem.dataset.id);
    closeAllContextMenus();
    return;
  }

  // Action preview button
  const actionBtn = e.target.closest('.preview-action-btn');
  if (actionBtn) {
    e.stopPropagation();
    handleDesignAction(actionBtn.dataset.action, actionBtn.dataset.id);
    return;
  }

  // Click card body -> open
  const card = e.target.closest('.design-card');
  if (card && !e.target.closest('.trash-card-overlay')) {
    handleDesignAction('open', card.dataset.projectId);
  }
}

function handleDesignAction(action, projectId) {
  switch (action) {
    case 'open':
      showToast('info', 'Editor workspace coming next! ✨');
      break;
    case 'rename': {
      const proj = getProjects().find(p => p.id === projectId);
      if (!proj) return;
      const newName = prompt('Rename design:', proj.name);
      if (newName && newName.trim()) {
        renameProject(projectId, newName.trim());
        navigateTo(currentView);
        showToast('success', 'Design renamed');
      }
      break;
    }
    case 'duplicate':
      duplicateProject(projectId);
      navigateTo(currentView);
      showToast('success', 'Design duplicated');
      break;
    case 'trash':
      trashProject(projectId);
      navigateTo(currentView);
      showToast('info', 'Moved design to trash');
      break;
  }
}

function toggleContextMenu(id) {
  const menu = document.getElementById(`menu-${id}`);
  if (!menu) return;

  if (openContextMenuId === id) {
    closeAllContextMenus();
    return;
  }

  closeAllContextMenus();
  menu.classList.add('visible');
  openContextMenuId = id;
}

function closeAllContextMenus() {
  document.querySelectorAll('.context-menu.visible').forEach(m => m.classList.remove('visible'));
  openContextMenuId = null;
}

// ============================================
// GLOBAL EVENT BINDINGS (SIDEBAR, SEARCH, NOTIFS, MODAL)
// ============================================
function bindGlobalEvents() {
  // Sidebar navigation routing
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.view);
      closeSidebar();
    });
  });

  document.getElementById('logo-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  // Mobile sidebar
  document.getElementById('menu-toggle')?.addEventListener('click', toggleSidebar);
  $sidebarOverlay?.addEventListener('click', closeSidebar);

  // Create Modal
  document.getElementById('btn-create-design')?.addEventListener('click', openCreateModal);
  document.getElementById('modal-close-btn')?.addEventListener('click', closeCreateModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeCreateModal);
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

  // Notifications toggle
  $notificationBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    $profileDropdown?.classList.remove('visible');
    const isVisible = $notificationPanel?.classList.contains('visible');
    if (!isVisible) {
      renderNotificationList();
      markAllNotificationsRead();
      updateBadges();
      $notificationPanel?.classList.add('visible');
    } else {
      $notificationPanel?.classList.remove('visible');
    }
  });

  document.getElementById('clear-notifications-btn')?.addEventListener('click', () => {
    clearNotifications();
    renderNotificationList();
    updateBadges();
    showToast('info', 'Notifications cleared');
  });

  // Profile Dropdown toggle
  $sidebarProfile?.addEventListener('click', (e) => {
    e.stopPropagation();
    $notificationPanel?.classList.remove('visible');
    $profileDropdown?.classList.toggle('visible');
  });

  document.getElementById('prof-btn-settings')?.addEventListener('click', () => {
    $profileDropdown?.classList.remove('visible');
    navigateTo('settings');
  });

  document.getElementById('prof-btn-theme')?.addEventListener('click', () => {
    $profileDropdown?.classList.remove('visible');
    const settings = getSettings();
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
    applySettingsTheme();
    showToast('info', `Switched to ${newTheme} theme`);
  });

  document.getElementById('prof-btn-brand')?.addEventListener('click', () => {
    $profileDropdown?.classList.remove('visible');
    navigateTo('brand');
  });

  // Search Live Dropdown
  let searchTimeout;
  $searchBar?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => handleSearchInput(e.target.value), 150);
  });

  $searchBar?.addEventListener('focus', (e) => {
    if (e.target.value.trim()) handleSearchInput(e.target.value);
  });

  // Global document click to close dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) $searchDropdown?.classList.remove('visible');
    if (!e.target.closest('.topbar-actions')) $notificationPanel?.classList.remove('visible');
    if (!e.target.closest('.sidebar-footer')) $profileDropdown?.classList.remove('visible');
    closeAllContextMenus();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCreateModal();
      closeAllContextMenus();
      closeSidebar();
      $searchDropdown?.classList.remove('visible');
      $notificationPanel?.classList.remove('visible');
      $profileDropdown?.classList.remove('visible');
    }
  });
}

// ============================================
// SEARCH DROPDOWN LOGIC
// ============================================
function handleSearchInput(query) {
  const q = query.toLowerCase().trim();
  if (!q || !$searchDropdown) {
    $searchDropdown?.classList.remove('visible');
    return;
  }

  const projectMatches = getProjects().filter(p => p.name.toLowerCase().includes(q));
  const templateMatches = searchTemplates(q);

  if (projectMatches.length === 0 && templateMatches.length === 0) {
    $searchDropdown.innerHTML = `<div class="search-no-results">No designs or templates found for "${escapeHtml(q)}"</div>`;
    $searchDropdown.classList.add('visible');
    return;
  }

  let html = '';

  if (projectMatches.length > 0) {
    html += `<div class="search-dropdown-section">
      <div class="search-dropdown-title">Your Designs</div>
      ${projectMatches.slice(0, 4).map(p => `
        <div class="search-result-item" data-search-project="${p.id}">
          <div class="search-result-preview" style="background: ${p.gradient};"></div>
          <div class="search-result-info">
            <div class="search-result-name">${escapeHtml(p.name)}</div>
            <div class="search-result-meta">${p.width}×${p.height} px • ${formatDate(p.updatedAt)}</div>
          </div>
          <span class="search-result-type">Design</span>
        </div>
      `).join('')}
    </div>`;
  }

  if (projectMatches.length > 0 && templateMatches.length > 0) {
    html += `<div class="search-divider"></div>`;
  }

  if (templateMatches.length > 0) {
    html += `<div class="search-dropdown-section">
      <div class="search-dropdown-title">Templates</div>
      ${templateMatches.slice(0, 4).map(t => `
        <div class="search-result-item" data-search-template="${t.id}">
          <div class="search-result-preview" style="background: ${t.gradient};"></div>
          <div class="search-result-info">
            <div class="search-result-name">${escapeHtml(t.title)}</div>
            <div class="search-result-meta">${t.category}</div>
          </div>
          <span class="search-result-type" style="background: hsl(174,80%,52%,0.1); color: hsl(174,80%,52%);">Template</span>
        </div>
      `).join('')}
    </div>`;
  }

  $searchDropdown.innerHTML = html;
  $searchDropdown.classList.add('visible');

  // Bind clicks
  $searchDropdown.querySelectorAll('[data-search-project]').forEach(item => {
    item.addEventListener('click', () => {
      $searchDropdown.classList.remove('visible');
      $searchBar.value = '';
      showToast('info', 'Editor coming next! ✨');
    });
  });

  $searchDropdown.querySelectorAll('[data-search-template]').forEach(item => {
    item.addEventListener('click', () => {
      const tmpl = STARTER_TEMPLATES.find(t => t.id === item.dataset.searchTemplate);
      if (tmpl) {
        const type = getDesignType(tmpl.typeId);
        const proj = createProject({
          name: tmpl.title,
          width: type?.width || 1080,
          height: type?.height || 1080,
          typeId: tmpl.typeId,
          templateId: tmpl.id,
          gradient: tmpl.gradient,
        });
        $searchDropdown.classList.remove('visible');
        $searchBar.value = '';
        updateBadges();
        showToast('success', `Created "${proj.name}" from template`);
      }
    });
  });
}

// ============================================
// NOTIFICATIONS RENDER
// ============================================
function renderNotificationList() {
  if (!$notificationList) return;
  const list = getNotifications();

  if (list.length === 0) {
    $notificationList.innerHTML = `
      <div class="notification-empty">
        ${icon('info')}
        <p>No notifications yet</p>
      </div>
    `;
    return;
  }

  $notificationList.innerHTML = list.map(n => `
    <div class="notification-item${!n.read ? ' unread' : ''}">
      <div class="notification-dot-indicator ${n.type || 'default'}"></div>
      <div class="notification-content">
        <div class="notification-text">${escapeHtml(n.message)}</div>
        <div class="notification-time">${formatDate(n.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

// ============================================
// CREATE MODAL LOGIC
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
  closeCreateModal();
  updateBadges();
  navigateTo(currentView);
  showToast('success', `Created "${project.name}" (${width}×${height})`);

  // Reset form
  if ($customWidth) $customWidth.value = '1080';
  if ($customHeight) $customHeight.value = '1080';
  if ($customName) $customName.value = '';
  document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
}

// Mobile sidebar
function toggleSidebar() {
  $sidebar?.classList.toggle('open');
  $sidebarOverlay?.classList.toggle('visible');
}

function closeSidebar() {
  $sidebar?.classList.remove('open');
  $sidebarOverlay?.classList.remove('visible');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(type, message) {
  if (!$toastContainer) return;
  const iconMap = { success: icon('check'), error: icon('alertCircle'), info: icon('info') };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${iconMap[type] || ''}<span>${escapeHtml(message)}</span>`;
  $toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
