// ============================================
// CREATO — Right Properties Inspector with Photopea Filters & Adjustments
// ============================================

import { icon } from '../utils/icons.js';
import { ImageProcessor } from './image-processor.js';

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
        <div class="prop-row">
          <span class="prop-label">Zoom Scale</span>
          <input type="text" class="prop-input" value="${Math.round(canvasEngine.zoom * 100)}%" readonly />
        </div>
      </div>
      <div style="padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 13px;">
        Click an element on the canvas to edit its properties
      </div>
    `;
    return;
  }

  const filters = selectedEl.filters || { brightness: 100, contrast: 100, saturate: 100, hueRotate: 0 };

  container.innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">Selected Element (${selectedEl.type.toUpperCase()})</div>

      <!-- Text Content (if text) -->
      ${selectedEl.type === 'text' ? `
        <div style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 11px;">Text Content</label>
          <input type="text" class="form-input" id="prop-text-content" value="${selectedEl.text}" style="height: 34px; font-size: 13px;" />
        </div>
      ` : ''}

      <!-- Blend Mode & Masking -->
      <div class="prop-row">
        <span class="prop-label">Blend Mode</span>
        <select class="sort-select" id="prop-blend-mode" style="height: 28px; padding: 0 8px; font-size: 11px; width: 120px;">
          <option value="source-over"${selectedEl.blendMode === 'source-over' ? ' selected' : ''}>Normal</option>
          <option value="screen"${selectedEl.blendMode === 'screen' ? ' selected' : ''}>Screen (Double Exposure)</option>
          <option value="multiply"${selectedEl.blendMode === 'multiply' ? ' selected' : ''}>Multiply (Darken)</option>
          <option value="overlay"${selectedEl.blendMode === 'overlay' ? ' selected' : ''}>Overlay (Contrast)</option>
          <option value="soft-light"${selectedEl.blendMode === 'soft-light' ? ' selected' : ''}>Soft Light</option>
          <option value="color-dodge"${selectedEl.blendMode === 'color-dodge' ? ' selected' : ''}>Color Dodge</option>
          <option value="darken"${selectedEl.blendMode === 'darken' ? ' selected' : ''}>Darken</option>
          <option value="lighten"${selectedEl.blendMode === 'lighten' ? ' selected' : ''}>Lighten</option>
        </select>
      </div>

      <div class="prop-row">
        <span class="prop-label">Clip to Layer Below</span>
        <input type="checkbox" id="prop-clip-below" ${selectedEl.clipToBelow ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;" />
      </div>

      <!-- Rotation -->
      <div class="prop-row">
        <span class="prop-label">Rotation Angle</span>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" class="prop-input" id="prop-rotation-input" value="${selectedEl.rotation || 0}" min="0" max="360" style="width: 60px;" /> °
        </div>
      </div>

      <!-- Color Fill (Shapes / Text) -->
      ${selectedEl.type !== 'image' ? `
        <div class="prop-row">
          <span class="prop-label">Color Fill</span>
          <input type="color" id="prop-color-fill" value="${selectedEl.fill && selectedEl.fill.startsWith('#') ? selectedEl.fill : '#FFFFFF'}" style="width: 36px; height: 28px; padding: 0; cursor: pointer; border: none; background: none;" />
        </div>
      ` : ''}

      <!-- Opacity Slider -->
      <div class="prop-row">
        <span class="prop-label">Opacity</span>
        <input type="range" id="prop-opacity-range" min="0" max="1" step="0.05" value="${selectedEl.opacity}" style="width: 100px;" />
      </div>

      <!-- Photopea Image Adjustments & Filters (if image) -->
      ${selectedEl.type === 'image' ? `
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
          <div class="panel-section-title">Photopea Image Adjustments</div>

          <div class="prop-row">
            <span class="prop-label">Brightness</span>
            <input type="range" id="prop-img-brightness" min="0" max="200" value="${filters.brightness}" style="width: 90px;" />
          </div>
          <div class="prop-row">
            <span class="prop-label">Contrast</span>
            <input type="range" id="prop-img-contrast" min="0" max="200" value="${filters.contrast}" style="width: 90px;" />
          </div>
          <div class="prop-row">
            <span class="prop-label">Saturation</span>
            <input type="range" id="prop-img-saturate" min="0" max="200" value="${filters.saturate}" style="width: 90px;" />
          </div>
          <div class="prop-row">
            <span class="prop-label">Hue Rotate</span>
            <input type="range" id="prop-img-huerotate" min="0" max="360" value="${filters.hueRotate}" style="width: 90px;" />
          </div>

          <div style="margin-top: 10px;">
            <span class="prop-label" style="display: block; margin-bottom: 6px;">Filter Presets</span>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="btn btn-secondary" data-filter-preset="cinema" style="padding: 4px 8px; font-size: 10px;">Cinema</button>
              <button class="btn btn-secondary" data-filter-preset="cyberpunk" style="padding: 4px 8px; font-size: 10px;">Cyberpunk</button>
              <button class="btn btn-secondary" data-filter-preset="vintage" style="padding: 4px 8px; font-size: 10px;">Vintage</button>
              <button class="btn btn-secondary" data-filter-preset="bw" style="padding: 4px 8px; font-size: 10px;">B&W</button>
              <button class="btn btn-secondary" data-filter-preset="hdr" style="padding: 4px 8px; font-size: 10px;">HDR</button>
              <button class="btn btn-secondary" data-filter-preset="reset" style="padding: 4px 8px; font-size: 10px;">Reset</button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Position X & Y -->
      <div class="prop-row" style="margin-top: 12px;">
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

      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button class="btn btn-secondary" id="btn-delete-element" style="flex: 1; padding: 6px; font-size: 12px; justify-content: center; color: #EF4444;">
          ${icon('trash')} Delete Element
        </button>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('prop-text-content')?.addEventListener('input', (e) => {
    selectedEl.text = e.target.value;
    canvasEngine.render();
  });

  document.getElementById('prop-blend-mode')?.addEventListener('change', (e) => {
    selectedEl.blendMode = e.target.value;
    canvasEngine.render();
  });

  document.getElementById('prop-clip-below')?.addEventListener('change', (e) => {
    selectedEl.clipToBelow = e.target.checked;
    canvasEngine.render();
  });

  document.getElementById('prop-rotation-input')?.addEventListener('change', (e) => {
    selectedEl.rotation = parseInt(e.target.value) || 0;
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

  // Image Filter Adjustment Sliders
  const updateFilters = () => {
    if (!selectedEl.filters) selectedEl.filters = { brightness: 100, contrast: 100, saturate: 100, hueRotate: 0 };
    selectedEl.filters.brightness = parseInt(document.getElementById('prop-img-brightness')?.value || 100);
    selectedEl.filters.contrast = parseInt(document.getElementById('prop-img-contrast')?.value || 100);
    selectedEl.filters.saturate = parseInt(document.getElementById('prop-img-saturate')?.value || 100);
    selectedEl.filters.hueRotate = parseInt(document.getElementById('prop-img-huerotate')?.value || 0);
    canvasEngine.render();
  };

  ['prop-img-brightness', 'prop-img-contrast', 'prop-img-saturate', 'prop-img-huerotate'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateFilters);
  });

  // Filter Presets Click
  container.querySelectorAll('[data-filter-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetName = btn.dataset.filterPreset;
      const preset = ImageProcessor.getFilterPreset(presetName);
      selectedEl.filters = { ...preset };
      renderInspector(container, canvasEngine);
      canvasEngine.render();
    });
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

  document.getElementById('btn-delete-element')?.addEventListener('click', () => {
    canvasEngine.elements = canvasEngine.elements.filter(el => el.id !== selectedEl.id);
    canvasEngine.selectedElementId = null;
    canvasEngine.render();
    renderInspector(container, canvasEngine);
  });
}
