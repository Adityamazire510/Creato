// ============================================
// CREATO — Editor Header & Export Menu
// ============================================

import { icon } from '../utils/icons.js';
import { ExportEngine } from '../modules/export.js';

export function renderEditorHeader(container, project, canvasEngine, onBack) {
  container.innerHTML = `
    <div class="editor-topbar">
      <div class="editor-topbar-left">
        <button class="editor-back-btn" id="editor-back-btn" title="Back to Dashboard">${icon('arrowRight')}</button>
        <input type="text" class="editor-project-title-input" id="editor-proj-name" value="${project.name}" />
      </div>

      <div class="editor-topbar-center">
        <button class="editor-history-btn" id="editor-undo-btn" title="Undo (Ctrl+Z)">${icon('rotateCcw')}</button>
        <button class="editor-history-btn" id="editor-redo-btn" title="Redo (Ctrl+Y)">${icon('rotateCw')}</button>
        <div style="width: 1px; height: 20px; background: var(--border-subtle); margin: 0 8px;"></div>
        <span style="font-size: 12px; color: var(--text-tertiary); font-weight: 500;">${project.width} × ${project.height} px</span>
      </div>

      <div class="editor-topbar-right" style="position: relative;">
        <button class="btn-export" id="editor-export-trigger-btn">
          ${icon('download')} Export
        </button>

        <!-- Export Dropdown Menu -->
        <div class="profile-dropdown" id="export-dropdown-menu" style="top: calc(100% + 8px); right: 0; left: auto; width: 220px;">
          <button class="profile-dropdown-item" id="exp-png">
            ${icon('image')} PNG Image
          </button>
          <button class="profile-dropdown-item" id="exp-png-trans">
            ${icon('sparkles')} PNG Transparent
          </button>
          <button class="profile-dropdown-item" id="exp-jpg">
            ${icon('image')} JPG Photo
          </button>
          <div class="profile-dropdown-divider"></div>
          <button class="profile-dropdown-item" id="exp-svg">
            ${icon('square')} SVG Vector XML
          </button>
          <button class="profile-dropdown-item" id="exp-json">
            ${icon('download')} JSON Backup
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('editor-back-btn')?.addEventListener('click', onBack);

  const exportBtn = document.getElementById('editor-export-trigger-btn');
  const exportMenu = document.getElementById('export-dropdown-menu');

  exportBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu?.classList.toggle('visible');
  });

  document.addEventListener('click', () => exportMenu?.classList.remove('visible'));

  // Export Format Triggers
  document.getElementById('exp-png')?.addEventListener('click', () => {
    exportMenu?.classList.remove('visible');
    ExportEngine.exportAsPNG(canvasEngine, `${project.name.toLowerCase().replace(/\s+/g,'-')}.png`, false);
  });

  document.getElementById('exp-png-trans')?.addEventListener('click', () => {
    exportMenu?.classList.remove('visible');
    ExportEngine.exportAsPNG(canvasEngine, `${project.name.toLowerCase().replace(/\s+/g,'-')}-transparent.png`, true);
  });

  document.getElementById('exp-jpg')?.addEventListener('click', () => {
    exportMenu?.classList.remove('visible');
    ExportEngine.exportAsJPG(canvasEngine, `${project.name.toLowerCase().replace(/\s+/g,'-')}.jpg`);
  });

  document.getElementById('exp-svg')?.addEventListener('click', () => {
    exportMenu?.classList.remove('visible');
    ExportEngine.exportAsSVG(canvasEngine, `${project.name.toLowerCase().replace(/\s+/g,'-')}.svg`);
  });

  document.getElementById('exp-json')?.addEventListener('click', () => {
    exportMenu?.classList.remove('visible');
    ExportEngine.exportAsJSON(canvasEngine, `${project.name.toLowerCase().replace(/\s+/g,'-')}.json`);
  });
}
