// ============================================
// CREATO — Centralized Application Store
// ============================================

const KEYS = {
  PROJECTS: 'creato_projects_v2',
  BRAND: 'creato_brand_v2',
  SETTINGS: 'creato_settings_v2',
  NOTIFICATIONS: 'creato_notifs_v2',
  MEDIA: 'creato_media_v2',
  AI_GENS: 'creato_ai_history_v2',
  AUTH: 'creato_auth_v2',
};

function generateId(prefix = 'obj') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ---- Projects ----
export function getProjects() {
  try {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data).filter(p => !p.trashed) : getInitialProjects();
  } catch { return getInitialProjects(); }
}

export function getTrashedProjects() {
  try {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data).filter(p => p.trashed) : [];
  } catch { return []; }
}

function getAllProjectsRaw() {
  try {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data) : getInitialProjects();
  } catch { return getInitialProjects(); }
}

function saveProjectsRaw(list) {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(list));
}

function getInitialProjects() {
  const now = new Date().toISOString();
  return [
    {
      id: 'proj_demo_1',
      name: 'Cyberpunk Cyber Banner',
      width: 1920,
      height: 1080,
      typeId: 'presentation',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
      createdAt: now,
      updatedAt: now,
      trashed: false,
      elements: [
        { type: 'rect', x: 100, y: 100, width: 400, height: 300, fill: '#7C3AED', rx: 16 },
        { type: 'text', x: 140, y: 220, text: 'CREATO GRAPHICS', fontSize: 36, fill: '#FFFFFF', font: 'Outfit' }
      ]
    },
    {
      id: 'proj_demo_2',
      name: 'Summer Glow Instagram Post',
      width: 1080,
      height: 1080,
      typeId: 'instagram-post',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
      createdAt: now,
      updatedAt: now,
      trashed: false,
      elements: []
    }
  ];
}

export function createProject(opts = {}) {
  const list = getAllProjectsRaw();
  const now = new Date().toISOString();
  const proj = {
    id: generateId('proj'),
    name: opts.name || 'Untitled Graphic',
    width: opts.width || 1080,
    height: opts.height || 1080,
    typeId: opts.typeId || 'custom',
    gradient: opts.gradient || 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
    createdAt: now,
    updatedAt: now,
    trashed: false,
    elements: opts.elements || [
      { type: 'text', x: 200, y: 200, text: opts.name || 'Untitled Graphic', fontSize: 42, fill: '#FFFFFF', font: 'Outfit' }
    ]
  };
  list.unshift(proj);
  saveProjectsRaw(list);
  addNotification('create', `Created design "${proj.name}"`);
  return proj;
}

export function updateProject(id, updates) {
  const list = getAllProjectsRaw();
  const proj = list.find(p => p.id === id);
  if (proj) {
    Object.assign(proj, updates, { updatedAt: new Date().toISOString() });
    saveProjectsRaw(list);
  }
  return proj;
}

export function trashProject(id) {
  const list = getAllProjectsRaw();
  const proj = list.find(p => p.id === id);
  if (proj) {
    proj.trashed = true;
    proj.trashedAt = new Date().toISOString();
    saveProjectsRaw(list);
    addNotification('delete', `Moved "${proj.name}" to trash`);
  }
}

export function restoreProject(id) {
  const list = getAllProjectsRaw();
  const proj = list.find(p => p.id === id);
  if (proj) {
    proj.trashed = false;
    saveProjectsRaw(list);
    addNotification('restore', `Restored "${proj.name}"`);
  }
}

export function permanentlyDeleteProject(id) {
  let list = getAllProjectsRaw().filter(p => p.id !== id);
  saveProjectsRaw(list);
}

// ---- Brand Kit ----
export function getBrandKit() {
  try {
    const data = localStorage.getItem(KEYS.BRAND);
    return data ? JSON.parse(data) : {
      colors: ['#7C3AED', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'],
      fonts: ['Outfit', 'Inter', 'Montserrat', 'Poppins'],
      logos: []
    };
  } catch {
    return { colors: ['#7C3AED', '#3B82F6', '#06B6D4'], fonts: ['Outfit', 'Inter'], logos: [] };
  }
}

export function saveBrandKit(kit) {
  localStorage.setItem(KEYS.BRAND, JSON.stringify(kit));
}

// ---- Settings ----
export function getSettings() {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'dark', profileName: 'Aditya Mazire', profileInitials: 'AM' };
  } catch {
    return { theme: 'dark', profileName: 'Aditya Mazire', profileInitials: 'AM' };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// ---- Notifications ----
export function getNotifications() {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addNotification(type, message) {
  const list = getNotifications();
  list.unshift({ id: generateId('notif'), type, message, timestamp: new Date().toISOString(), read: false });
  if (list.length > 25) list.length = 25;
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
}

export function markNotificationsRead() {
  const list = getNotifications();
  list.forEach(n => n.read = true);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
}

// ---- Auth Session ----
export function getAuthUser() {
  try {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : { isLoggedIn: true, name: 'Aditya Mazire', email: 'aditya@creato.design', avatar: 'AM', plan: 'Enterprise' };
  } catch {
    return { isLoggedIn: true, name: 'Aditya Mazire', email: 'aditya@creato.design', avatar: 'AM', plan: 'Enterprise' };
  }
}

export function saveAuthUser(user) {
  localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
}
