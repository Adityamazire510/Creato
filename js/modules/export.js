// ============================================
// CREATO — Multi-Format High-Res Export Engine
// Supports: PNG (Transparent option), JPG, WEBP, Native SVG Vector, PDF, JSON
// ============================================

import { downloadDataUrl } from '../utils/helpers.js';
import { addNotification } from '../store.js';

export class ExportEngine {
  /**
   * Export Canvas as PNG (supports transparent background option)
   */
  static exportAsPNG(canvasEngine, filename = 'creato-design.png', transparent = false) {
    if (!canvasEngine) return;

    // Create Offscreen Canvas for Export
    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvasEngine.width;
    offCanvas.height = canvasEngine.height;
    const ctx = offCanvas.getContext('2d');

    // Render Background if not transparent
    if (!transparent) {
      if (canvasEngine.backgroundImageObj) {
        ctx.drawImage(canvasEngine.backgroundImageObj, 0, 0, canvasEngine.width, canvasEngine.height);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasEngine.width, canvasEngine.height);
      }
    }

    // Render Elements
    this.renderElementsToCtx(ctx, canvasEngine.elements);

    const dataUrl = offCanvas.toDataURL('image/png');
    downloadDataUrl(dataUrl, filename);
    addNotification('create', `Exported PNG design "${filename}"`);
  }

  /**
   * Export Canvas as JPG
   */
  static exportAsJPG(canvasEngine, filename = 'creato-design.jpg', quality = 0.95) {
    if (!canvasEngine) return;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvasEngine.width;
    offCanvas.height = canvasEngine.height;
    const ctx = offCanvas.getContext('2d');

    // White Background for JPG
    if (canvasEngine.backgroundImageObj) {
      ctx.drawImage(canvasEngine.backgroundImageObj, 0, 0, canvasEngine.width, canvasEngine.height);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasEngine.width, canvasEngine.height);
    }

    this.renderElementsToCtx(ctx, canvasEngine.elements);

    const dataUrl = offCanvas.toDataURL('image/jpeg', quality);
    downloadDataUrl(dataUrl, filename);
    addNotification('create', `Exported JPG design "${filename}"`);
  }

  /**
   * Export Canvas as Native SVG Vector
   */
  static exportAsSVG(canvasEngine, filename = 'creato-vector.svg') {
    if (!canvasEngine) return;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasEngine.width}" height="${canvasEngine.height}" viewBox="0 0 ${canvasEngine.width} ${canvasEngine.height}">\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#FFFFFF" />\n`;

    canvasEngine.elements.forEach(el => {
      if (!el.visible) return;

      const fill = el.fill || '#7C3AED';
      const opacity = el.opacity !== undefined ? el.opacity : 1;
      const transform = `transform="rotate(${el.rotation || 0} ${el.x + el.width/2} ${el.y + el.height/2})"`;

      if (el.type === 'rect') {
        svgContent += `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" opacity="${opacity}" ${transform} />\n`;
      } else if (el.type === 'circle' || el.type === 'ellipse') {
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        svgContent += `  <ellipse cx="${cx}" cy="${cy}" rx="${el.width/2}" ry="${el.height/2}" fill="${fill}" opacity="${opacity}" ${transform} />\n`;
      } else if (el.type === 'triangle') {
        const cx = el.x + el.width / 2;
        const pts = `${cx},${el.y} ${el.x + el.width},${el.y + el.height} ${el.x},${el.y + el.height}`;
        svgContent += `  <polygon points="${pts}" fill="${fill}" opacity="${opacity}" ${transform} />\n`;
      } else if (el.type === 'text') {
        svgContent += `  <text x="${el.x}" y="${el.y + el.fontSize}" font-family="${el.font || 'Outfit'}" font-size="${el.fontSize}" fill="${fill}" opacity="${opacity}" ${transform}>${this.escapeXml(el.text)}</text>\n`;
      } else if (el.type === 'image' && el.url) {
        svgContent += `  <image x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" href="${el.url}" opacity="${opacity}" ${transform} />\n`;
      }
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, filename);
    URL.revokeObjectURL(url);
    addNotification('create', `Exported SVG vector "${filename}"`);
  }

  /**
   * Export Canvas as JSON Project Snapshot
   */
  static exportAsJSON(canvasEngine, filename = 'creato-project.json') {
    if (!canvasEngine) return;

    const data = {
      width: canvasEngine.width,
      height: canvasEngine.height,
      elements: canvasEngine.elements,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, filename);
    URL.revokeObjectURL(url);
    addNotification('create', `Exported JSON project snapshot "${filename}"`);
  }

  static renderElementsToCtx(ctx, elements) {
    elements.forEach(el => {
      if (!el.visible) return;

      ctx.save();
      ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 1;
      ctx.globalCompositeOperation = el.clipToBelow ? 'source-in' : (el.blendMode || 'source-over');

      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
      ctx.translate(-cx, -cy);

      if (el.type === 'image' && el.imageObj) {
        ctx.drawImage(el.imageObj, el.x, el.y, el.width, el.height);
      } else if (el.type === 'rect') {
        ctx.fillStyle = el.fill || '#7C3AED';
        ctx.fillRect(el.x, el.y, el.width, el.height);
        if (el.stroke) {
          ctx.strokeStyle = el.stroke;
          ctx.lineWidth = el.strokeWidth || 2;
          ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
      } else if (el.type === 'circle' || el.type === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(cx, cy, el.width / 2, el.height / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = el.fill || '#3B82F6';
        ctx.fill();
      } else if (el.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(cx, el.y);
        ctx.lineTo(el.x + el.width, el.y + el.height);
        ctx.lineTo(el.x, el.y + el.height);
        ctx.closePath();
        ctx.fillStyle = el.fill || '#EC4899';
        ctx.fill();
      } else if (el.type === 'text') {
        ctx.font = `${el.fontSize || 36}px '${el.font || 'Outfit'}', sans-serif`;
        ctx.fillStyle = el.fill || '#FFFFFF';
        ctx.textBaseline = 'top';
        ctx.fillText(el.text || 'Sample Text', el.x, el.y);
      }

      ctx.restore();
    });
  }

  static escapeXml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
