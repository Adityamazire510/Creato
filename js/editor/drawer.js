// ============================================
// CREATO — Left Drawer Panel (Picsart Style Multi-Tab)
// ============================================

import { icon } from '../utils/icons.js';
import { 
  STOCK_PHOTOS, FONT_PRESETS, SHAPES_LIBRARY, 
  BACKGROUND_PRESETS, PICSART_TEMPLATES 
} from '../modules/assets-data.js';

export class EditorDrawer {
  constructor(drawerElement, canvasEngine, onTemplateLoad) {
    this.drawer = drawerElement;
    this.canvasEngine = canvasEngine;
    this.onTemplateLoad = onTemplateLoad;
    this.activeTab = 'templates';

    this.render();
  }

  setTab(tabName) {
    this.activeTab = tabName;
    this.render();
  }

  render() {
    if (!this.drawer) return;

    let contentHtml = '';

    switch (this.activeTab) {
      case 'templates':
        contentHtml = this.renderTemplatesTab();
        break;
      case 'photos':
        contentHtml = this.renderPhotosTab();
        break;
      case 'text':
        contentHtml = this.renderTextTab();
        break;
      case 'elements':
        contentHtml = this.renderElementsTab();
        break;
      case 'backgrounds':
        contentHtml = this.renderBackgroundsTab();
        break;
      case 'uploads':
        contentHtml = this.renderUploadsTab();
        break;
      case 'ai':
        contentHtml = this.renderAITab();
        break;
      default:
        contentHtml = this.renderTemplatesTab();
    }

    this.drawer.innerHTML = `
      <div class="drawer-header">
        <h3 class="drawer-title" style="text-transform: capitalize;">${this.activeTab}</h3>
      </div>
      <div class="drawer-body">${contentHtml}</div>
    `;

    this.bindEvents();
  }

  renderTemplatesTab() {
    return `
      <input type="text" class="form-input" id="drawer-tmpl-search" placeholder="Search templates..." style="margin-bottom: 12px;" />
      <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
        ${PICSART_TEMPLATES.map(t => `
          <div class="template-card" data-load-template="${t.id}">
            <div class="template-card-preview" style="height: 120px; background: ${t.background}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px;">
              ${t.title}
            </div>
            <div class="template-card-info" style="padding: 8px 0;">
              <div class="template-card-title" style="font-size: 13px;">${t.title}</div>
              <div class="template-card-category" style="font-size: 11px; color: var(--text-tertiary);">${t.category} • ${t.width}×${t.height}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderPhotosTab() {
    return `
      <input type="text" class="form-input" id="drawer-photo-search" placeholder="Search stock photos..." style="margin-bottom: 12px;" />
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${STOCK_PHOTOS.map(p => `
          <div class="photo-asset-item" data-add-photo="${p.url}" style="height: 90px; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; position: relative;">
            <img src="${p.url}" alt="${p.title}" style="width:100%; height:100%; object-fit: cover; transition: transform 0.3s;" />
          </div>
        `).join('')}
      </div>
    `;
  }

  renderTextTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
        <button class="btn btn-primary" id="add-heading-btn" style="justify-content: flex-start; padding: 12px 16px;">
          ${icon('type')} <span style="font-size: 18px; font-weight: 800;">Add a Heading</span>
        </button>
        <button class="btn btn-secondary" id="add-subheading-btn" style="justify-content: flex-start; padding: 10px 16px;">
          ${icon('type')} <span style="font-size: 14px; font-weight: 600;">Add a Subheading</span>
        </button>
        <button class="btn btn-secondary" id="add-body-btn" style="justify-content: flex-start; padding: 8px 16px;">
          ${icon('type')} <span style="font-size: 12px;">Add Body Text</span>
        </button>
      </div>

      <h4 style="font-size: 12px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 8px;">Font Presets</h4>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${FONT_PRESETS.map(f => `
          <div class="preset-font-card" data-add-preset-font="${f.id}" style="padding: 10px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer;">
            <div style="font-size: 14px; font-weight: bold; color: ${f.fill};">${f.text}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderElementsTab() {
    return `
      <h4 style="font-size: 12px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 8px;">Basic Shapes</h4>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
        ${SHAPES_LIBRARY.map(s => `
          <div class="shape-asset-item" data-add-shape="${s.type}" style="height: 60px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; gap: 4px;">
            ${icon(s.type === 'circle' ? 'circle' : s.type === 'triangle' ? 'triangle' : 'square')}
            <span style="font-size: 10px; color: var(--text-secondary);">${s.name}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderBackgroundsTab() {
    return `
      <h4 style="font-size: 12px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 8px;">Color & Gradient Presets</h4>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        ${BACKGROUND_PRESETS.map(bg => `
          <div class="bg-preset-item" data-set-bg="${bg.value}" style="height: 60px; background: ${bg.value}; border-radius: var(--radius-md); cursor: pointer; border: 1px solid var(--border-subtle); display: flex; align-items: flex-end; padding: 4px 6px;">
            <span style="font-size: 10px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.8); font-weight: 600;">${bg.name}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderUploadsTab() {
    return `
      <div style="padding: 24px; border: 2px dashed var(--border-default); border-radius: var(--radius-lg); text-align: center; margin-bottom: 16px;">
        ${icon('upload')}
        <p style="font-size: 13px; margin: 8px 0; color: var(--text-secondary);">Drag and drop files here</p>
        <button class="btn btn-primary" id="upload-file-btn" style="padding: 6px 16px; font-size: 12px; margin: 0 auto;">Upload Image</button>
        <input type="file" id="real-upload-input" style="display:none;" accept="image/*" />
      </div>
    `;
  }

  renderAITab() {
    return `
      <label class="form-label">AI Prompt</label>
      <textarea class="form-input" id="drawer-ai-prompt" rows="3" style="height: auto; padding: 8px; resize: none; margin-bottom: 12px;" placeholder="A neon glowing Cyberpunk badge..."></textarea>
      <button class="btn btn-primary" id="drawer-ai-gen-btn" style="width: 100%; justify-content: center; margin-bottom: 16px;">${icon('sparkles')} Generate Asset</button>
    `;
  }

  bindEvents() {
    // Templates
    this.drawer.querySelectorAll('[data-load-template]').forEach(card => {
      card.addEventListener('click', () => {
        const tmpl = PICSART_TEMPLATES.find(t => t.id === card.dataset.loadTemplate);
        if (tmpl && this.onTemplateLoad) this.onTemplateLoad(tmpl);
      });
    });

    // Text Buttons
    document.getElementById('add-heading-btn')?.addEventListener('click', () => {
      this.canvasEngine.addElement('text', { text: 'ADD A HEADING', fontSize: 48, fill: '#FFFFFF', font: 'Outfit' });
    });
    document.getElementById('add-subheading-btn')?.addEventListener('click', () => {
      this.canvasEngine.addElement('text', { text: 'Add a Subheading', fontSize: 32, fill: '#E2E8F0', font: 'Inter' });
    });
    document.getElementById('add-body-btn')?.addEventListener('click', () => {
      this.canvasEngine.addElement('text', { text: 'Add body text description here', fontSize: 18, fill: '#94A3B8', font: 'Inter' });
    });

    // Font Presets
    this.drawer.querySelectorAll('[data-add-preset-font]').forEach(card => {
      card.addEventListener('click', () => {
        const preset = FONT_PRESETS.find(f => f.id === card.dataset.addPresetFont);
        if (preset) {
          this.canvasEngine.addElement('text', {
            text: preset.text,
            fontSize: preset.fontSize,
            font: preset.font,
            fill: preset.fill
          });
        }
      });
    });

    // Shapes
    this.drawer.querySelectorAll('[data-add-shape]').forEach(item => {
      item.addEventListener('click', () => {
        const shapeType = item.dataset.addShape;
        this.canvasEngine.addElement(shapeType, { fill: '#7C3AED', width: 200, height: 150 });
      });
    });

    // Backgrounds
    this.drawer.querySelectorAll('[data-set-bg]').forEach(item => {
      item.addEventListener('click', () => {
        const bgVal = item.dataset.setBg;
        const stage = document.querySelector('.editor-canvas-stage');
        if (stage) stage.style.background = bgVal;
      });
    });

    // Uploads
    const fileInput = document.getElementById('real-upload-input');
    document.getElementById('upload-file-btn')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.canvasEngine.addElement('rect', { fill: '#3B82F6', width: 300, height: 200 });
      };
      reader.readAsDataURL(file);
    });
  }
}
