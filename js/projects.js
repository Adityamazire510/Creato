// ============================================
// CREATO — Project Manager (LocalStorage)
// Handles: Projects, Trash, Brand Kit, Settings, Notifications
// ============================================

const STORAGE_KEY = 'creato_projects';
const TRASH_KEY = 'creato_trash';
const BRAND_KEY = 'creato_brand';
const SETTINGS_KEY = 'creato_settings';
const NOTIFICATIONS_KEY = 'creato_notifications';

function generateId() {
  return 'proj_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

// ============================================
// Default gradients for new projects
// ============================================
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
  'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
  'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
];

// ============================================
// PROJECTS — CRUD + Soft Delete
// ============================================

function getAllProjects() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveAllProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Get active (non-trashed) projects */
export function getProjects() {
  return getAllProjects().filter(p => !p.trashed);
}

/** Get trashed projects */
export function getTrashedProjects() {
  return getAllProjects().filter(p => p.trashed);
}

/** Create a new project */
export function createProject(opts) {
  const projects = getAllProjects();
  const now = new Date().toISOString();

  const project = {
    id: generateId(),
    name: opts.name || 'Untitled Design',
    width: opts.width || 1080,
    height: opts.height || 1080,
    typeId: opts.typeId || 'custom',
    templateId: opts.templateId || null,
    gradient: opts.gradient || GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    createdAt: now,
    updatedAt: now,
    trashed: false,
    trashedAt: null,
  };

  projects.unshift(project);
  saveAllProjects(projects);
  addNotification('create', `Created "${project.name}"`);
  return project;
}

/** Rename a project */
export function renameProject(id, newName) {
  const projects = getAllProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    project.name = newName;
    project.updatedAt = new Date().toISOString();
    saveAllProjects(projects);
  }
  return project;
}

/** Duplicate a project */
export function duplicateProject(id) {
  const projects = getAllProjects();
  const original = projects.find(p => p.id === id);
  if (!original) return null;

  const duplicate = {
    ...original,
    id: generateId(),
    name: original.name + ' (Copy)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trashed: false,
    trashedAt: null,
  };

  projects.unshift(duplicate);
  saveAllProjects(projects);
  addNotification('copy', `Duplicated "${original.name}"`);
  return duplicate;
}

/** Soft-delete a project (move to trash) */
export function trashProject(id) {
  const projects = getAllProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    project.trashed = true;
    project.trashedAt = new Date().toISOString();
    saveAllProjects(projects);
    addNotification('delete', `Moved "${project.name}" to trash`);
  }
  return project;
}

/** Restore a project from trash */
export function restoreProject(id) {
  const projects = getAllProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    project.trashed = false;
    project.trashedAt = null;
    project.updatedAt = new Date().toISOString();
    saveAllProjects(projects);
    addNotification('restore', `Restored "${project.name}"`);
  }
  return project;
}

/** Permanently delete a project */
export function permanentlyDeleteProject(id) {
  let projects = getAllProjects();
  const project = projects.find(p => p.id === id);
  projects = projects.filter(p => p.id !== id);
  saveAllProjects(projects);
  if (project) addNotification('delete', `Permanently deleted "${project.name}"`);
}

/** Empty all trash */
export function emptyTrash() {
  let projects = getAllProjects();
  const count = projects.filter(p => p.trashed).length;
  projects = projects.filter(p => !p.trashed);
  saveAllProjects(projects);
  if (count > 0) addNotification('delete', `Emptied trash (${count} designs)`);
  return count;
}

// Keep old deleteProject as alias for trashProject (backward compat)
export function deleteProject(id) {
  return trashProject(id);
}

// ============================================
// BRAND KIT
// ============================================

const DEFAULT_BRAND = {
  colors: ['#7C3AED', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B'],
  fonts: ['Inter', 'Outfit'],
  logos: [],
};

export function getBrandKit() {
  try {
    const data = localStorage.getItem(BRAND_KEY);
    return data ? JSON.parse(data) : { ...DEFAULT_BRAND };
  } catch { return { ...DEFAULT_BRAND }; }
}

function saveBrandKit(kit) {
  localStorage.setItem(BRAND_KEY, JSON.stringify(kit));
}

export function addBrandColor(color) {
  const kit = getBrandKit();
  if (!kit.colors.includes(color)) {
    kit.colors.push(color);
    saveBrandKit(kit);
    addNotification('brand', `Added brand color ${color}`);
  }
  return kit;
}

export function removeBrandColor(color) {
  const kit = getBrandKit();
  kit.colors = kit.colors.filter(c => c !== color);
  saveBrandKit(kit);
  return kit;
}

export function addBrandFont(font) {
  const kit = getBrandKit();
  if (!kit.fonts.includes(font)) {
    kit.fonts.push(font);
    saveBrandKit(kit);
    addNotification('brand', `Added brand font "${font}"`);
  }
  return kit;
}

export function removeBrandFont(font) {
  const kit = getBrandKit();
  kit.fonts = kit.fonts.filter(f => f !== font);
  saveBrandKit(kit);
  return kit;
}

// ============================================
// SETTINGS
// ============================================

const DEFAULT_SETTINGS = {
  theme: 'dark',
  profileName: 'Aditya Mazire',
  profileInitials: 'AM',
  accentColor: '#7C3AED',
};

export function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function updateSettings(updates) {
  const settings = getSettings();
  Object.assign(settings, updates);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}

// ============================================
// NOTIFICATIONS
// ============================================

const MAX_NOTIFICATIONS = 30;

export function getNotifications() {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveNotifications(list) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
}

export function addNotification(type, message) {
  const list = getNotifications();
  list.unshift({
    id: Date.now().toString(36),
    type,
    message,
    timestamp: new Date().toISOString(),
    read: false,
  });
  // Keep only the latest
  if (list.length > MAX_NOTIFICATIONS) list.length = MAX_NOTIFICATIONS;
  saveNotifications(list);
}

export function markAllNotificationsRead() {
  const list = getNotifications();
  list.forEach(n => n.read = true);
  saveNotifications(list);
}

export function clearNotifications() {
  saveNotifications([]);
}

export function getUnreadCount() {
  return getNotifications().filter(n => !n.read).length;
}

// ============================================
// DATA EXPORT / IMPORT
// ============================================

export function exportAllData() {
  return JSON.stringify({
    projects: getAllProjects(),
    brand: getBrandKit(),
    settings: getSettings(),
    notifications: getNotifications(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.projects) localStorage.setItem(STORAGE_KEY, JSON.stringify(data.projects));
    if (data.brand) localStorage.setItem(BRAND_KEY, JSON.stringify(data.brand));
    if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    if (data.notifications) localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data.notifications));
    return true;
  } catch {
    return false;
  }
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BRAND_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(NOTIFICATIONS_KEY);
}

// ============================================
// UTILITY
// ============================================

export function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
