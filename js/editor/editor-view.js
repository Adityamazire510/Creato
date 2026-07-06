// ============================================
// CREATO — Master Editor Workspace (Picsart & Figma Style)
// ============================================

import { icon } from '../utils/icons.js';
import { CanvasEngine } from './canvas.js';
import { EditorDrawer } from './drawer.js';
import { renderInspector } from './inspector.js';
import { renderLayerTree } from './layers.js';
import { renderEditorHeader } from './header.js';

export function renderFullEditorWorkspace(container, project, onBackToDashboard) {
  container.innerHTML = `
    <div class="editor-workspace">
      <!-- Top Header -->
      <div id="editor-header-mount"></div>

      <!-- Editor Main Layout -->
      <div class="editor-main-body">

        <!-- Leftmost Tool Ribbon -->
        <div class="editor-left-tools">
          <button class="tool-btn active" data-ribbon-tab="templates">
            ${icon('grid')}
            <span class="tool-label">Templates</span>
          </button>
          <button class="tool-btn" data-ribbon-tab="photos">
            ${icon('image')}
            <span class="tool-label">Photos</span>
          </button>
          <button class="tool-btn" data-ribbon-tab="text">
            ${icon('type')}
            <span class="tool-label">Text</span>
          </button>
          <button class="tool-btn" data-ribbon-tab="elements">
            ${icon('square')}
            <span class="tool-label">Elements</span>
          </button>
          <button class="tool-btn" data-ribbon-tab="backgrounds">
            ${icon('palette')}
            <span class="tool-label">Background</span>
          </button>
          <button class="tool-btn" data-ribbon-tab="uploads">
            ${icon('download')}
            <span class="tool-label">Uploads</span>
          </button>
          <button class="tool-btn" data-ribbon-tab="ai">
            ${icon('sparkles')}
            <span class="tool-label">AI Studio</span>
          </button>
        </div>

        <!-- Multi-Tab Contextual Drawer Panel -->
        <div class="editor-left-drawer" id="editor-left-drawer-mount"></div>

        <!-- Canvas Viewport Stage -->
        <div class="editor-canvas-viewport">
          <div class="editor-canvas-stage">
            <canvas id="real-picsart-canvas"></canvas>
          </div>

          <!-- Floating Contextual Action Bar -->
          <div id="floating-element-toolbar" style="display:none; position: absolute; top: 20px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-full); padding: 4px 12px; gap: 8px; align-items: center; box-shadow: var(--shadow-lg); z-index: 50;">
            <button class="topbar-btn" id="float-duplicate-btn" title="Duplicate">${icon('copy')}</button>
            <button class="topbar-btn" id="float-delete-btn" title="Delete" style="color: #EF4444;">${icon('trash')}</button>
          </div>

          <!-- Zoom Indicator -->
          <div class="canvas-zoom-bar" id="zoom-bar-text">100% Canvas</div>
        </div>

        <!-- Right Properties & Layers Panel -->
        <div class="editor-right-panel">
          <div class="panel-tabs">
            <div class="panel-tab active" id="tab-props-btn">Properties</div>
            <div class="panel-tab" id="tab-layers-btn">Layers</div>
          </div>

          <div id="right-inspector-mount"></div>
        </div>

      </div>
    </div>
  `;

  // Initialize Canvas
  const canvasEl = document.getElementById('real-picsart-canvas');
  const canvasEngine = new CanvasEngine(canvasEl, project.width || 1080, project.height || 1080);
  canvasEngine.setElements(project.elements || []);

  // Render Header
  const headerMount = document.getElementById('editor-header-mount');
  renderEditorHeader(headerMount, project, canvasEngine, onBackToDashboard);

  // Initialize Left Drawer
  const drawerMount = document.getElementById('editor-left-drawer-mount');
  const drawer = new EditorDrawer(drawerMount, canvasEngine, (template) => {
    canvasEngine.width = template.width;
    canvasEngine.height = template.height;
    canvasEngine.initCanvasSize();
    const stage = document.querySelector('.editor-canvas-stage');
    if (stage) stage.style.background = template.background;
    canvasEngine.setElements(template.elements || []);
    updateRightPanel();
  });

  // Bind Ribbon Switcher
  container.querySelectorAll('[data-ribbon-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-ribbon-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawer.setTab(btn.dataset.ribbonTab);
    });
  });

  // Right Panel Tabs & Inspector
  let activeRightTab = 'props';
  const inspectorMount = document.getElementById('right-inspector-mount');

  function updateRightPanel() {
    if (!inspectorMount) return;
    inspectorMount.innerHTML = '';

    if (activeRightTab === 'props') {
      renderInspector(inspectorMount, canvasEngine);
    } else {
      renderLayerTree(inspectorMount, canvasEngine, updateRightPanel);
    }

    // Toggle Floating Toolbar above selected element
    const floatingBar = document.getElementById('floating-element-toolbar');
    const selected = canvasEngine.getSelectedElement();
    if (selected && floatingBar) {
      floatingBar.style.display = 'flex';
    } else if (floatingBar) {
      floatingBar.style.display = 'none';
    }

    const zoomText = document.getElementById('zoom-bar-text');
    if (zoomText) zoomText.textContent = `${Math.round(canvasEngine.zoom * 100)}% Canvas`;
  }

  canvasEngine.onSelect(() => updateRightPanel());
  updateRightPanel();

  document.getElementById('tab-props-btn')?.addEventListener('click', () => {
    document.getElementById('tab-props-btn').classList.add('active');
    document.getElementById('tab-layers-btn').classList.remove('active');
    activeRightTab = 'props';
    updateRightPanel();
  });

  document.getElementById('tab-layers-btn')?.addEventListener('click', () => {
    document.getElementById('tab-layers-btn').classList.add('active');
    document.getElementById('tab-props-btn').classList.remove('active');
    activeRightTab = 'layers';
    updateRightPanel();
  });

  // Floating toolbar actions
  document.getElementById('float-duplicate-btn')?.addEventListener('click', () => {
    const sel = canvasEngine.getSelectedElement();
    if (sel) {
      canvasEngine.addElement(sel.type, {
        ...sel,
        x: sel.x + 20,
        y: sel.y + 20
      });
      updateRightPanel();
    }
  });

  document.getElementById('float-delete-btn')?.addEventListener('click', () => {
    const sel = canvasEngine.getSelectedElement();
    if (sel) {
      canvasEngine.elements = canvasEngine.elements.filter(el => el.id !== sel.id);
      canvasEngine.selectedElementId = null;
      canvasEngine.render();
      updateRightPanel();
    }
  });
}
