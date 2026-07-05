// ============================================
// CREATO — Interactive Canvas Engine (2D Render, Multi-artboard, Zoom/Pan)
// ============================================

export class CanvasEngine {
  constructor(canvasElement, width = 1080, height = 1080) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = width;
    this.height = height;

    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;

    this.elements = [];
    this.selectedElementId = null;
    this.activeTool = 'select';

    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    this.initCanvasSize();
    this.bindEvents();
  }

  initCanvasSize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setElements(elements) {
    this.elements = elements.map((el, i) => ({
      id: el.id || `el_${Date.now()}_${i}`,
      type: el.type || 'rect',
      x: el.x || 100,
      y: el.y || 100,
      width: el.width || 200,
      height: el.height || 150,
      fill: el.fill || '#7C3AED',
      stroke: el.stroke || null,
      strokeWidth: el.strokeWidth || 2,
      text: el.text || 'Sample Text',
      fontSize: el.fontSize || 32,
      font: el.font || 'Outfit',
      opacity: el.opacity !== undefined ? el.opacity : 1,
      rotation: el.rotation || 0,
      locked: el.locked || false,
      visible: el.visible !== undefined ? el.visible : true,
    }));
    this.render();
  }

  addElement(type, props = {}) {
    const newEl = {
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      x: props.x || this.width / 2 - 100,
      y: props.y || this.height / 2 - 75,
      width: props.width || (type === 'text' ? 300 : 200),
      height: props.height || (type === 'text' ? 60 : 150),
      fill: props.fill || '#7C3AED',
      stroke: props.stroke || null,
      strokeWidth: props.strokeWidth || 2,
      text: props.text || 'Double Click to Edit',
      fontSize: props.fontSize || 36,
      font: props.font || 'Outfit',
      opacity: 1,
      rotation: 0,
      locked: false,
      visible: true,
    };
    this.elements.push(newEl);
    this.selectedElementId = newEl.id;
    this.render();
    return newEl;
  }

  getSelectedElement() {
    return this.elements.find(el => el.id === this.selectedElementId);
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Background
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Render Elements
    this.elements.forEach(el => {
      if (!el.visible) return;

      this.ctx.save();
      this.ctx.globalAlpha = el.opacity;

      // Rotation & Center Transform
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      this.ctx.translate(cx, cy);
      this.ctx.rotate((el.rotation * Math.PI) / 180);
      this.ctx.translate(-cx, -cy);

      if (el.type === 'rect') {
        this.ctx.fillStyle = el.fill;
        this.ctx.fillRect(el.x, el.y, el.width, el.height);
        if (el.stroke) {
          this.ctx.strokeStyle = el.stroke;
          this.ctx.lineWidth = el.strokeWidth;
          this.ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
      } else if (el.type === 'circle' || el.type === 'ellipse') {
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, el.width / 2, el.height / 2, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = el.fill;
        this.ctx.fill();
        if (el.stroke) {
          this.ctx.strokeStyle = el.stroke;
          this.ctx.lineWidth = el.strokeWidth;
          this.ctx.stroke();
        }
      } else if (el.type === 'triangle') {
        this.ctx.beginPath();
        this.ctx.moveTo(cx, el.y);
        this.ctx.lineTo(el.x + el.width, el.y + el.height);
        this.ctx.lineTo(el.x, el.y + el.height);
        this.ctx.closePath();
        this.ctx.fillStyle = el.fill;
        this.ctx.fill();
      } else if (el.type === 'text') {
        this.ctx.font = `${el.fontSize}px '${el.font}', sans-serif`;
        this.ctx.fillStyle = el.fill;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(el.text, el.x, el.y);
      }

      this.ctx.restore();

      // Render Selection Bounding Box
      if (el.id === this.selectedElementId) {
        this.drawSelectionBox(el);
      }
    });
  }

  drawSelectionBox(el) {
    this.ctx.save();
    this.ctx.strokeStyle = '#3B82F6';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeRect(el.x - 4, el.y - 4, el.width + 8, el.height + 8);

    // Corner Handles
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#3B82F6';
    this.ctx.setLineDash([]);

    const handles = [
      { x: el.x - 8, y: el.y - 8 },
      { x: el.x + el.width, y: el.y - 8 },
      { x: el.x - 8, y: el.y + el.height },
      { x: el.x + el.width, y: el.y + el.height },
    ];

    handles.forEach(h => {
      this.ctx.fillRect(h.x, h.y, 8, 8);
      this.ctx.strokeRect(h.x, h.y, 8, 8);
    });

    this.ctx.restore();
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Hit Test (Reverse Order to hit top layers first)
      let hit = null;
      for (let i = this.elements.length - 1; i >= 0; i--) {
        const el = this.elements[i];
        if (
          el.visible &&
          !el.locked &&
          mouseX >= el.x &&
          mouseX <= el.x + el.width &&
          mouseY >= el.y &&
          mouseY <= el.y + el.height
        ) {
          hit = el;
          break;
        }
      }

      if (hit) {
        this.selectedElementId = hit.id;
        this.isDragging = true;
        this.dragStartX = mouseX - hit.x;
        this.dragStartY = mouseY - hit.y;
      } else {
        this.selectedElementId = null;
      }

      this.render();
      if (this.onSelectCallback) this.onSelectCallback(this.getSelectedElement());
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.selectedElementId) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const el = this.getSelectedElement();
      if (el) {
        el.x = Math.round(mouseX - this.dragStartX);
        el.y = Math.round(mouseY - this.dragStartY);
        this.render();
        if (this.onSelectCallback) this.onSelectCallback(el);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  onSelect(cb) {
    this.onSelectCallback = cb;
  }
}
