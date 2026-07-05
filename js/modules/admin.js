// ============================================
// CREATO — Enterprise Admin Panel & Analytics
// ============================================

import { icon } from '../utils/icons.js';

export function renderAdminPanel(container) {
  container.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h1 class="view-title">Enterprise Admin Panel ${icon('shield')}</h1>
        <p class="view-subtitle">Platform health, analytics metrics, user permissions, and storage quotas</p>
      </div>
    </div>

    <!-- Analytics Top Cards -->
    <div class="stats-banner" style="margin-bottom: 32px;">
      <div>
        <div class="stat-number">14,280</div>
        <div class="stat-label">Active Users Today</div>
      </div>
      <div>
        <div class="stat-number">98.4%</div>
        <div class="stat-label">AI Generation Health</div>
      </div>
      <div>
        <div class="stat-number">4.2 TB</div>
        <div class="stat-label">Cloud Storage Used</div>
      </div>
      <div>
        <div class="stat-number">Enterprise</div>
        <div class="stat-label">Workspace Plan</div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="brand-section">
      <div class="brand-section-header">
        <h2 class="brand-section-title">${icon('users')} Team Members & Permissions</h2>
      </div>

      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-default); color: var(--text-tertiary);">
            <th style="padding: 12px;">User</th>
            <th style="padding: 12px;">Role</th>
            <th style="padding: 12px;">Status</th>
            <th style="padding: 12px;">Designs</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 12px; font-weight: 600;">Aditya Mazire (Owner)</td>
            <td style="padding: 12px; color: hsl(var(--brand-primary)); font-weight: 600;">Super Admin</td>
            <td style="padding: 12px; color: hsl(var(--brand-green));">Active</td>
            <td style="padding: 12px;">142</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 12px; font-weight: 600;">Sarah Jenkins</td>
            <td style="padding: 12px;">Lead Designer</td>
            <td style="padding: 12px; color: hsl(var(--brand-green));">Active</td>
            <td style="padding: 12px;">89</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 12px; font-weight: 600;">Alex Rivera</td>
            <td style="padding: 12px;">Motion Editor</td>
            <td style="padding: 12px; color: hsl(var(--brand-green));">Active</td>
            <td style="padding: 12px;">54</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
