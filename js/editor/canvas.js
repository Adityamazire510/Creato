// ============================================
// CREATO — Canvas Engine with Blend Modes, Double Exposure & Layer Masking
// Supports: "Word in Image" & "Image in Image" Blending
// ============================================

export class CanvasEngine {
  constructor(canvasElement, width = 1080, height = 1080) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = width;
    this.height = height;

    this.zoom = 1;
    this.elements = [];
    this.selectedElementId = null;
    this.backgroundImageObj = null;

    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Resizing State
    this.isResizing = false;
    this.activeHandle = null;
    this.resizeStartMouseX = 0;
    this.resizeStartMouseY = 0;
    this.resizeInitialX = 0;
    this.resizeInitialY = 0;
    this.resizeInitialW = 0;
    this.resizeInitialH = 0;

    this.initCanvasSize();
    this.bindEvents();
  }

  initCanvasSize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setElements(elements) {
    this.elements = elements.map((el, i) => {
      const item = {
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
        url: el.url || null,
        opacity: el.opacity !== undefined ? el.opacity : 1,
        blendMode: el.blendMode || 'source-over', // Normal, multiply, screen, overlay, etc.
        clipToBelow: el.clipToBelow || false,
        rotation: el.rotation || 0,
        locked: el.locked || false,
        visible: el.visible !== undefined ? el.visible : true,
      };

      if (item.type === 'image' && item.url) {
        this.loadImageObj(item);
      }

      return item;
    });

    this.render();
  }

  loadImageObj(el) {
    if (!el.url) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      el.imageObj = img;
      this.render();
    };
    img.src = el.url;
  }

  setBackgroundImage(url) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.backgroundImageObj = img;
      this.render();
    };
    img.src = url;
  }

  addImageElement(url, name = 'Photo', blendMode = 'source-over') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let w = img.width || 400;
      let h = img.height || 300;
      const maxDim = 450;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const newEl = {
        id: `el_img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: 'image',
        x: Math.round(this.width / 2 - w / 2),
        y: Math.round(this.height / 2 - h / 2),
        width: w,
        height: h,
        url,
        imageObj: img,
        opacity: 1,
        blendMode,
        clipToBelow: false,
        rotation: 0,
        locked: false,
        visible: true,
      };

      this.elements.push(newEl);
      this.selectedElementId = newEl.id;
      this.render();
      if (this.onSelectCallback) this.onSelectCallback(newEl);
    };
    img.src = url;
  }

  addTextOverImage(textStr = 'WORD IN IMAGE', fill = '#FFFFFF', fontSize = 48) {
    const newEl = {
      id: `el_txt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: 'text',
      x: Math.round(this.width / 2 - 200),
      y: Math.round(this.height / 2 - 30),
      width: 400,
      height: 70,
      text: textStr,
      fontSize,
      font: 'Outfit',
      fill,
      opacity: 1,
      blendMode: 'source-over',
      clipToBelow: false,
      rotation: 0,
      locked: false,
      visible: true,
    };
    this.elements.push(newEl);
    this.selectedElementId = newEl.id;
    this.render();
    if (this.onSelectCallback) this.onSelectCallback(newEl);
    return newEl;
  }

  addElement(type, props = {}) {
    const newEl = {
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      x: props.x || this.width / 2 - 100,
      y: props.y || this.height / 2 - 75,
      width: props.width || (type === 'text' ? 320 : 200),
      height: props.height || (type === 'text' ? 60 : 150),
      fill: props.fill || '#7C3AED',
      stroke: props.stroke || null,
      strokeWidth: props.strokeWidth || 2,
      text: props.text || 'Double Click to Edit',
      fontSize: props.fontSize || 36,
      font: props.font || 'Outfit',
      url: props.url || null,
      opacity: props.opacity !== undefined ? props.opacity : 1,
      blendMode: props.blendMode || 'source-over',
      clipToBelow: props.clipToBelow || false,
      rotation: 0,
      locked: false,
      visible: true,
    };

    if (newEl.type === 'image' && newEl.url) {
      this.loadImageObj(newEl);
    }

    this.elements.push(newEl);
    this.selectedElementId = newEl.id;
    this.render();
    if (this.onSelectCallback) this.onSelectCallback(newEl);
    return newEl;
  }

  getSelectedElement() {
    return this.elements.find(el => el.id === this.selectedElementId);
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Canvas Background (Solid / Gradient / Image)
    if (this.backgroundImageObj) {
      this.ctx.drawImage(this.backgroundImageObj, 0, 0, this.width, this.height);
    } else {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Draw Layer Hierarchy with Blend Modes & Double Exposure Composite Operations
    this.elements.forEach(el => {
      if (!el.visible) return;

      this.ctx.save();
      this.ctx.globalAlpha = el.opacity;

      // Set Composite Blend Mode (multiply, screen, overlay, color-dodge, source-over, source-in)
      this.ctx.globalCompositeOperation = el.clipToBelow ? 'source-in' : (el.blendMode || 'source-over');

      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      this.ctx.translate(cx, cy);
      this.ctx.rotate((el.rotation * Math.PI) / 180);
      this.ctx.translate(-cx, -cy);

      if (el.type === 'image' && el.imageObj) {
        this.ctx.drawImage(el.imageObj, el.x, el.y, el.width, el.height);
      } else if (el.type === 'rect') {
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

      // Draw Selection Bounding Box with Cyan Highlight
      if (el.id === this.selectedElementId) {
        this.drawSelectionBox(el);
      }
    });
  }

  getHandles(el) {
    const handleSize = 12;
    return {
      nw: { x: el.x - handleSize / 2, y: el.y - handleSize / 2, size: handleSize },
      ne: { x: el.x + el.width - handleSize / 2, y: el.y - handleSize / 2, size: handleSize },
      sw: { x: el.x - handleSize / 2, y: el.y + el.height - handleSize / 2, size: handleSize },
      se: { x: el.x + el.width - handleSize / 2, y: el.y + el.height - handleSize / 2, size: handleSize },
    };
  }

  drawSelectionBox(el) {
    this.ctx.save();
    this.ctx.strokeStyle = '#06B6D4';
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeRect(el.x - 2, el.y - 2, el.width + 4, el.height + 4);

    // Corner Handles
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#06B6D4';
    this.ctx.lineWidth = 2.5;

    const handles = this.getHandles(el);
    Object.values(handles).forEach(h => {
      this.ctx.fillRect(h.x, h.y, h.size, h.size);
      this.ctx.strokeRect(h.x, h.y, h.size, h.size);
    });

    this.ctx.restore();
  }

  getHitHandle(mouseX, mouseY, el) {
    if (!el || el.id !== this.selectedElementId) return null;
    const handles = this.getHandles(el);

    for (const [key, h] of Object.entries(handles)) {
      if (
        mouseX >= h.x - 4 &&
        mouseX <= h.x + h.size + 4 &&
        mouseY >= h.y - 4 &&
        mouseY <= h.y + h.size + 4
      ) {
        return key;
      }
    }
    return null;
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const selEl = this.getSelectedElement();

      // 1. Check Handle Hit for Resizing
      if (selEl) {
        const handleHit = this.getHitHandle(mouseX, mouseY, selEl);
        if (handleHit) {
          this.isResizing = true;
          this.activeHandle = handleHit;
          this.resizeStartMouseX = mouseX;
          this.resizeStartMouseY = mouseY;
          this.resizeInitialX = selEl.x;
          this.resizeInitialY = selEl.y;
          this.resizeInitialW = selEl.width;
          this.resizeInitialH = selEl.height;
          return;
        }
      }

      // 2. Element Hit Test (Reverse Order to hit top layers first)
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
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const selEl = this.getSelectedElement();

      // Handle Resizing Mouse Drag
      if (this.isResizing && selEl) {
        const dx = mouseX - this.resizeStartMouseX;
        const dy = mouseY - this.resizeStartMouseY;

        if (this.activeHandle === 'se') {
          selEl.width = Math.max(20, Math.round(this.resizeInitialW + dx));
          selEl.height = Math.max(20, Math.round(this.resizeInitialH + dy));
        } else if (this.activeHandle === 'sw') {
          const newW = Math.max(20, Math.round(this.resizeInitialW - dx));
          selEl.x = this.resizeInitialX + (this.resizeInitialW - newW);
          selEl.width = newW;
          selEl.height = Math.max(20, Math.round(this.resizeInitialH + dy));
        } else if (this.activeHandle === 'ne') {
          const newH = Math.max(20, Math.round(this.resizeInitialH - dy));
          selEl.y = this.resizeInitialY + (this.resizeInitialH - newH);
          selEl.width = Math.max(20, Math.round(this.resizeInitialW + dx));
          selEl.height = newH;
        } else if (this.activeHandle === 'nw') {
          const newW = Math.max(20, Math.round(this.resizeInitialW - dx));
          const newH = Math.max(20, Math.round(this.resizeInitialH - dy));
          selEl.x = this.resizeInitialX + (this.resizeInitialW - newW);
          selEl.y = this.resizeInitialY + (this.resizeInitialH - newH);
          selEl.width = newW;
          selEl.height = newH;
        }

        this.render();
        if (this.onSelectCallback) this.onSelectCallback(selEl);
        return;
      }

      // Handle Drag to Move Mouse Drag
      if (this.isDragging && selEl) {
        selEl.x = Math.round(mouseX - this.dragStartX);
        selEl.y = Math.round(mouseY - this.dragStartY);
        this.render();
        if (this.onSelectCallback) this.onSelectCallback(selEl);
        return;
      }

      // Cursor Feedback
      if (selEl) {
        const handleHover = this.getHitHandle(mouseX, mouseY, selEl);
        if (handleHover === 'nw' || handleHover === 'se') {
          this.canvas.style.cursor = 'nwse-resize';
        } else if (handleHover === 'ne' || handleHover === 'sw') {
          this.canvas.style.cursor = 'nesw-resize';
        } else if (
          mouseX >= selEl.x &&
          mouseX <= selEl.x + selEl.width &&
          mouseY >= selEl.y &&
          mouseY <= selEl.y + selEl.height
        ) {
          this.canvas.style.cursor = 'move';
        } else {
          this.canvas.style.cursor = 'crosshair';
        }
      } else {
        this.canvas.style.cursor = 'crosshair';
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.isResizing = false;
      this.activeHandle = null;
    });
  }

  onSelect(cb) {
    this.onSelectCallback = cb;
  }
}
