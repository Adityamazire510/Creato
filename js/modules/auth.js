// ============================================
// CREATO — Auth & Session Modal Module
// ============================================

import { icon } from '../utils/icons.js';
import { getAuthUser, saveAuthUser } from '../store.js';

export function renderAuthModal(onSuccess) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay visible';
  overlay.id = 'auth-modal-overlay';

  overlay.innerHTML = `
    <div class="modal" style="max-width: 420px; padding: 32px; text-align: center;">
      <div class="landing-brand-icon" style="margin: 0 auto 16px;">${icon('sparkles')}</div>
      <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Welcome to Creato</h2>
      <p style="color: var(--text-tertiary); font-size: 14px; margin-bottom: 24px;">Sign in to save projects and access AI tools</p>

      <button class="btn btn-secondary" id="oauth-google-btn" style="width: 100%; margin-bottom: 12px; justify-content: center; gap: 8px;">
        Continue with Google
      </button>
      <button class="btn btn-secondary" id="oauth-github-btn" style="width: 100%; margin-bottom: 20px; justify-content: center; gap: 8px;">
        Continue with GitHub
      </button>

      <div style="margin: 16px 0; border-bottom: 1px solid var(--border-subtle);"></div>

      <input type="email" class="form-input" id="auth-email-input" placeholder="Enter your email..." style="margin-bottom: 12px;" value="aditya@creato.design" />
      <button class="btn btn-primary" id="auth-submit-btn" style="width: 100%; justify-content: center;">Sign In / Sign Up</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    if (onSuccess) onSuccess(getAuthUser());
  };

  document.getElementById('auth-submit-btn')?.addEventListener('click', () => {
    const email = document.getElementById('auth-email-input')?.value || 'aditya@creato.design';
    const name = email.split('@')[0];
    saveAuthUser({ isLoggedIn: true, name, email, avatar: name.slice(0,2).toUpperCase(), plan: 'Pro' });
    close();
  });

  document.getElementById('oauth-google-btn')?.addEventListener('click', close);
  document.getElementById('oauth-github-btn')?.addEventListener('click', close);
}
