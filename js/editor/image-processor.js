// ============================================
// CREATO — Photopea-Grade Image Processor & Filter Matrix
// ============================================

/**
 * Apply Photopea-style adjustments and filters to an HTML Canvas or Image Element
 */
export class ImageProcessor {
  /**
   * Apply CSS filter string to image object or element
   */
  static getFilterCss(opts = {}) {
    const brightness = opts.brightness !== undefined ? opts.brightness : 100;
    const contrast = opts.contrast !== undefined ? opts.contrast : 100;
    const saturate = opts.saturate !== undefined ? opts.saturate : 100;
    const hueRotate = opts.hueRotate !== undefined ? opts.hueRotate : 0;
    const blur = opts.blur || 0;
    const sepia = opts.sepia || 0;
    const invert = opts.invert || 0;

    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) blur(${blur}px) sepia(${sepia}%) invert(${invert}%)`;
  }

  /**
   * Preset Filter Definitions (Cinema, Cyberpunk, Vintage, B&W, HDR, Sepia)
   */
  static getFilterPreset(presetName) {
    switch (presetName) {
      case 'cinema':
        return { brightness: 95, contrast: 130, saturate: 85, hueRotate: -10, sepia: 15 };
      case 'cyberpunk':
        return { brightness: 110, contrast: 140, saturate: 180, hueRotate: 160, sepia: 0 };
      case 'vintage':
        return { brightness: 105, contrast: 90, saturate: 80, hueRotate: 15, sepia: 35 };
      case 'bw':
        return { brightness: 100, contrast: 140, saturate: 0, hueRotate: 0, sepia: 0 };
      case 'hdr':
        return { brightness: 115, contrast: 150, saturate: 140, hueRotate: 0, sepia: 0 };
      case 'retro':
        return { brightness: 100, contrast: 110, saturate: 120, hueRotate: -20, sepia: 25 };
      default:
        return { brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, sepia: 0, blur: 0, invert: 0 };
    }
  }

  /**
   * Apply image filter directly to an offscreen canvas and return a processed data URL
   */
  static processImageToDataUrl(imageObj, width, height, opts = {}) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const ctx = offCanvas.getContext('2d');

    ctx.filter = this.getFilterCss(opts);
    ctx.drawImage(imageObj, 0, 0, width, height);

    return offCanvas.toDataURL('image/png');
  }
}
