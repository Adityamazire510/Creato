// ============================================
// CREATO — AI Studio Module
// ============================================

import { icon } from '../utils/icons.js';
import { addNotification } from '../store.js';

export function renderAIStudio(container, onInsertToCanvas) {
  container.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">AI Studio ${icon('sparkles')}</h1>
        <p class="view-subtitle">Generate photorealistic artwork, logos, graphics & magic edits using generative AI models</p>
      </div>
    </div>

    <div class="ai-tools-grid">

      <!-- Text to Image Generator -->
      <div class="ai-tool-card" style="grid-column: 1 / -1;">
        <div class="ai-tool-header">
          <div class="ai-tool-icon purple">${icon('sparkles')}</div>
          <div>
            <h2 class="ai-tool-title">AI Text-to-Image Generator</h2>
            <p class="ai-tool-desc" style="margin:0;">Turn detailed prompts into high-resolution visual artwork</p>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Prompt</label>
          <textarea class="form-input" id="ai-image-prompt" rows="3" style="height: auto; padding: 12px; resize: vertical;" placeholder="A futuristic cyberpunk city with neon purple lights, flying cars, photorealistic 8k..."></textarea>
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0;">
          <div style="flex: 1; min-width: 200px;">
            <label class="form-label">Artistic Style</label>
            <select class="form-select" id="ai-style-select">
              <option value="cyberpunk">Cyberpunk Neon</option>
              <option value="3d-render" selected>3D Hyperrealistic Render</option>
              <option value="anime">Anime & Manga Vector</option>
              <option value="watercolor">Soft Watercolor</option>
              <option value="photorealistic">8K Photorealistic Studio</option>
              <option value="vector">Minimalist Vector Art</option>
            </select>
          </div>

          <div style="flex: 1; min-width: 200px;">
            <label class="form-label">Aspect Ratio</label>
            <select class="form-select" id="ai-ratio-select">
              <option value="1:1">1:1 Square (1080×1080)</option>
              <option value="16:9">16:9 Landscape (1920×1080)</option>
              <option value="9:16">9:16 Story (1080×1920)</option>
            </select>
          </div>
        </div>

        <div class="ai-tool-actions">
          <button class="generate-btn" id="ai-generate-image-btn">${icon('sparkles')} Generate AI Artwork</button>
        </div>

        <!-- AI Output Preview Container -->
        <div id="ai-image-output" style="margin-top: 20px; display: none; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-lg); border: 1px solid var(--border-default);">
          <h4 style="margin-bottom: 12px; font-size: 14px;">Generated Asset</h4>
          <div id="ai-art-preview-box" style="width: 100%; height: 260px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);"></div>
          <div style="margin-top: 12px; display: flex; gap: 12px;">
            <button class="btn btn-primary" id="ai-art-insert-btn" style="padding: 8px 16px; font-size: 13px;">${icon('plus')} Add to Canvas</button>
          </div>
        </div>
      </div>

      <!-- AI Logo & Graphic Assistant -->
      <div class="ai-tool-card">
        <div class="ai-tool-header">
          <div class="ai-tool-icon cyan">${icon('wand')}</div>
          <h2 class="ai-tool-title">AI Logo & Emblem Creator</h2>
        </div>
        <p class="ai-tool-desc">Enter your brand name to generate modern vector icons and emblems instantly.</p>
        <input type="text" class="form-input" id="ai-brand-name-input" placeholder="e.g. Nexus AI Labs..." style="margin-bottom: 12px;" />
        <button class="generate-btn" id="ai-gen-logo-btn">${icon('sparkles')} Generate Logos</button>
      </div>

      <!-- Magic BG Remover -->
      <div class="ai-tool-card">
        <div class="ai-tool-header">
          <div class="ai-tool-icon pink">${icon('layers')}</div>
          <h2 class="ai-tool-title">Magic Background Remover</h2>
        </div>
        <p class="ai-tool-desc">Remove background from photos and subject images with 1-click precision AI matting.</p>
        <button class="generate-btn" id="ai-remove-bg-btn">${icon('sparkles')} Process Image</button>
      </div>

    </div>
  `;

  // Bind AI Generation Logic
  document.getElementById('ai-generate-image-btn')?.addEventListener('click', () => {
    const prompt = document.getElementById('ai-image-prompt')?.value.trim() || 'Futuristic Studio Graphic';
    const style = document.getElementById('ai-style-select')?.value;
    const outputBox = document.getElementById('ai-image-output');
    const previewBox = document.getElementById('ai-art-preview-box');

    if (outputBox && previewBox) {
      outputBox.style.display = 'block';
      previewBox.style.background = 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)';
      previewBox.textContent = `✨ AI ${style.toUpperCase()}: "${prompt.slice(0, 30)}..."`;
      addNotification('create', `Generated AI Artwork: "${prompt.slice(0, 20)}"`);
    }
  });

  document.getElementById('ai-art-insert-btn')?.addEventListener('click', () => {
    if (onInsertToCanvas) onInsertToCanvas();
  });
}
