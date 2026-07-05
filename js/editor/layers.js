// ============================================
// CREATO — Layer Hierarchy Manager
// ============================================

import { icon } from '../utils/icons.js';

export function renderLayerTree(container, canvasEngine, onUpdate) {
  if (!container || !canvasEngine) return;

  const elements = canvasEngine.elements;

  if (elements.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 13px;">
        No layers yet. Add elements to the canvas!
      </div>
    `;
    return;
  }

  // Render from top layer to bottom layer
  container.innerHTML = elements.slice().reverse().map(el => {
    const isSelected = el.id === canvasEngine.selectedElementId;
    const iconName = el.type === 'text' ? 'type' : el.type === 'circle' ? 'circle' : 'square';

    return `
      <div class="layer-item${isSelected ? ' active' : ''}" data-layer-id="${el.id}">
        <span class="layer-item-icon">${icon(iconName)}</span>
        <span class="layer-item-name">${el.type.toUpperCase()}: ${el.text || el.id.slice(0, 8)}</span>
        <button class="layer-action-btn" data-action="toggle-lock" data-id="${el.id}" style="color: ${el.locked ? '#EF4444' : 'var(--text-tertiary)'}">
          ${icon(el.locked ? 'shield' : 'cursor')}
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.layer-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      canvasEngine.selectedElementId = item.dataset.layerId;
      canvasEngine.render();
      renderLayerTree(container, canvasEngine, onUpdate);
      if (onUpdate) onUpdate();
    });
  });

  container.querySelectorAll('[data-action="toggle-lock"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = canvasEngine.elements.find(item => item.id === btn.dataset.id);
      if (el) {
        el.locked = !el.locked;
        canvasEngine.render();
        renderLayerTree(container, canvasEngine, onUpdate);
      }
    });
  });
}
