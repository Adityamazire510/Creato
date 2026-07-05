// ============================================
// CREATO — Right Properties Inspector & Layer Tree
// ============================================

import { icon } from '../utils/icons.js';

export function renderInspector(container, canvasEngine) {
  if (!container || !canvasEngine) return;

  const selectedEl = canvasEngine.getSelectedElement();

  if (!selectedEl) {
    container.innerHTML = `
      <div class="panel-section">
        <div class="panel-section-title">Canvas Settings</div>
        <div class="prop-row">
          <span class="prop-label">Width</span>
          <input type="text" class="prop-input" value="${canvasEngine.width}px" readonly />
        </div>
        <div class="prop-row">
          <span class="prop-label">Height</span>
          <input type="text" class="prop-input" value="${canvasEngine.height}px" readonly />
        </div>
      </div>
      <div style="padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 13px;">
        Click an element on the canvas to edit its properties
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">Selected Element</div>

      <!-- Text Editing Input (if text) -->
      ${selectedEl.type === 'text' ? `
        <div style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 11px;">Text Content</label>
          <input type="text" class="form-input" id="prop-text-content" value="${selectedEl.text}" style="height: 32px; font-size: 13px;" />
        </div>
      ` : ''}

      <!-- Color Fill -->
      <div class="prop-row">
        <span class="prop-label">Color Fill</span>
        <input type="color" id="prop-color-fill" value="${selectedEl.fill.startsWith('#') ? selectedEl.fill : '#7C3AED'}" style="width: 36px; height: 28px; padding: 0; cursor: pointer; border: none; background: none;" />
      </div>

      <!-- Opacity Slider -->
      <div class="prop-row">
        <span class="prop-label">Opacity</span>
        <input type="range" id="prop-opacity-range" min="0" max="1" step="0.05" value="${selectedEl.opacity}" style="width: 100px;" />
      </div>

      <!-- Position X & Y -->
      <div class="prop-row">
        <span class="prop-label">Position (X, Y)</span>
        <div style="display: flex; gap: 4px;">
          <input type="number" class="prop-input" id="prop-pos-x" value="${selectedEl.x}" style="width: 50px;" />
          <input type="number" class="prop-input" id="prop-pos-y" value="${selectedEl.y}" style="width: 50px;" />
        </div>
      </div>

      <!-- Dimensions W & H -->
      <div class="prop-row">
        <span class="prop-label">Size (W × H)</span>
        <div style="display: flex; gap: 4px;">
          <input type="number" class="prop-input" id="prop-size-w" value="${selectedEl.width}" style="width: 50px;" />
          <input type="number" class="prop-input" id="prop-size-h" value="${selectedEl.height}" style="width: 50px;" />
        </div>
      </div>

      <!-- Text Font Size (if text) -->
      ${selectedEl.type === 'text' ? `
        <div class="prop-row">
          <span class="prop-label">Font Size</span>
          <input type="number" class="prop-input" id="prop-font-size" value="${selectedEl.fontSize}" style="width: 60px;" />
        </div>
      ` : ''}

      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button class="btn btn-secondary" id="btn-delete-element" style="flex: 1; padding: 6px; font-size: 12px; justify-content: center; color: #EF4444;">
          ${icon('trash')} Delete
        </button>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('prop-text-content')?.addEventListener('input', (e) => {
    selectedEl.text = e.target.value;
    canvasEngine.render();
  });

  document.getElementById('prop-color-fill')?.addEventListener('change', (e) => {
    selectedEl.fill = e.target.value;
    canvasEngine.render();
  });

  document.getElementById('prop-opacity-range')?.addEventListener('input', (e) => {
    selectedEl.opacity = parseFloat(e.target.value);
    canvasEngine.render();
  });

  document.getElementById('prop-pos-x')?.addEventListener('change', (e) => {
    selectedEl.x = parseInt(e.target.value) || 0;
    canvasEngine.render();
  });
  document.getElementById('prop-pos-y')?.addEventListener('change', (e) => {
    selectedEl.y = parseInt(e.target.value) || 0;
    canvasEngine.render();
  });

  document.getElementById('prop-size-w')?.addEventListener('change', (e) => {
    selectedEl.width = parseInt(e.target.value) || 10;
    canvasEngine.render();
  });
  document.getElementById('prop-size-h')?.addEventListener('change', (e) => {
    selectedEl.height = parseInt(e.target.value) || 10;
    canvasEngine.render();
  });

  document.getElementById('prop-font-size')?.addEventListener('change', (e) => {
    selectedEl.fontSize = parseInt(e.target.value) || 16;
    canvasEngine.render();
  });

  document.getElementById('btn-delete-element')?.addEventListener('click', () => {
    canvasEngine.elements = canvasEngine.elements.filter(el => el.id !== selectedEl.id);
    canvasEngine.selectedElementId = null;
    canvasEngine.render();
    renderInspector(container, canvasEngine);
  });
}
