// ============================================
// CREATO — Editor Top Header & Export Modal
// ============================================

import { icon } from '../utils/icons.js';

export function renderEditorHeader(container, project, onBack, onExport) {
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

      <div class="editor-topbar-right">
        <button class="btn-export" id="editor-export-trigger-btn">
          ${icon('download')} Export
        </button>
      </div>
    </div>
  `;

  document.getElementById('editor-back-btn')?.addEventListener('click', onBack);
  document.getElementById('editor-export-trigger-btn')?.addEventListener('click', onExport);
}
