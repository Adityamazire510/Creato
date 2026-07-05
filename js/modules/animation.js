// ============================================
// CREATO — Animation & Motion Studio Module
// ============================================

import { icon } from '../utils/icons.js';

export function renderAnimationStudio(container) {
  container.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Animation Studio ${icon('film')}</h1>
        <p class="view-subtitle">Animate vector graphics and text with keyframes, preset motion transitions, and video exports</p>
      </div>
    </div>

    <!-- Animation Stage Preview -->
    <div class="brand-section" style="text-align: center;">
      <div id="anim-stage-box" style="width: 100%; height: 320px; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border-radius: var(--radius-xl); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; box-shadow: var(--shadow-xl);">
        <div id="anim-target-element" style="padding: 20px 40px; background: var(--gradient-primary); border-radius: var(--radius-lg); color: #fff; font-weight: 800; font-size: 28px; box-shadow: var(--shadow-glow); transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
          CREATO MOTION
        </div>
      </div>

      <!-- Animation Controls & Preset Pills -->
      <div style="margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-secondary" data-anim-preset="bounce">${icon('play')} Bounce</button>
        <button class="btn btn-secondary" data-anim-preset="pulse">${icon('sparkles')} Pulse Glow</button>
        <button class="btn btn-secondary" data-anim-preset="rotate">${icon('rotateCw')} Spin 360°</button>
        <button class="btn btn-secondary" data-anim-preset="slide">${icon('arrowRight')} Slide In</button>
        <button class="btn btn-primary" id="export-anim-mp4">${icon('download')} Export MP4 / GIF</button>
      </div>
    </div>
  `;

  const target = document.getElementById('anim-target-element');
  container.querySelectorAll('[data-anim-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.animPreset;
      if (!target) return;
      target.style.transform = 'none';

      setTimeout(() => {
        if (preset === 'bounce') target.style.transform = 'translateY(-40px) scale(1.1)';
        else if (preset === 'pulse') target.style.transform = 'scale(1.25)';
        else if (preset === 'rotate') target.style.transform = 'rotate(360deg)';
        else if (preset === 'slide') target.style.transform = 'translateX(100px)';
      }, 50);
    });
  });
}
