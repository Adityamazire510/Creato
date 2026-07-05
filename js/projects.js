// ============================================
// CREATO — Project Manager (LocalStorage)
// ============================================

const STORAGE_KEY = 'creato_projects';

/**
 * Generate a unique ID
 */
function generateId() {
  return 'proj_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

/**
 * Get all projects from localStorage
 */
export function getProjects() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save projects to localStorage
 */
function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Create a new project
 * @param {object} opts - { name, width, height, typeId, templateId, gradient }
 * @returns {object} The newly created project
 */
export function createProject(opts) {
  const projects = getProjects();
  const now = new Date().toISOString();

  // Generate a random gradient if none provided
  const gradients = [
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

  const project = {
    id: generateId(),
    name: opts.name || 'Untitled Design',
    width: opts.width || 1080,
    height: opts.height || 1080,
    typeId: opts.typeId || 'custom',
    templateId: opts.templateId || null,
    gradient: opts.gradient || gradients[Math.floor(Math.random() * gradients.length)],
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(project); // newest first
  saveProjects(projects);
  return project;
}

/**
 * Rename a project
 */
export function renameProject(id, newName) {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    project.name = newName;
    project.updatedAt = new Date().toISOString();
    saveProjects(projects);
  }
  return project;
}

/**
 * Duplicate a project
 */
export function duplicateProject(id) {
  const projects = getProjects();
  const original = projects.find(p => p.id === id);
  if (!original) return null;

  const duplicate = {
    ...original,
    id: generateId(),
    name: original.name + ' (Copy)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.unshift(duplicate);
  saveProjects(projects);
  return duplicate;
}

/**
 * Delete a project
 */
export function deleteProject(id) {
  let projects = getProjects();
  projects = projects.filter(p => p.id !== id);
  saveProjects(projects);
}

/**
 * Format a date for display
 */
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
