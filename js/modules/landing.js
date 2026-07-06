// ============================================
// CREATO — SaaS Landing Page Renderer & Checkout Connectors
// ============================================

import { icon } from '../utils/icons.js';
import { PaymentGateway } from './billing.js';

export function renderLandingPage(container, onGetStarted) {
  container.innerHTML = `
    <div class="landing-page">
      <!-- Top Navigation -->
      <nav class="landing-nav">
        <a href="#" class="landing-brand">
          <div class="landing-brand-icon">${icon('sparkles')}</div>
          <span class="gradient-text">Creato</span>
        </a>

        <div class="landing-links">
          <a href="#features" class="landing-link">Features</a>
          <a href="#templates" class="landing-link">Templates</a>
          <a href="#pricing" class="landing-link">Pricing</a>
          <a href="#ai-tools" class="landing-link">AI Studio</a>
        </div>

        <div class="landing-nav-actions">
          <button class="btn-hero-secondary" id="landing-login-btn" style="padding: 8px 20px; font-size: 14px;">Sign In</button>
          <button class="btn-hero-primary" id="landing-get-started" style="padding: 10px 24px; font-size: 14px;">Get Started Free</button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="landing-hero">
        <div class="hero-badge">
          ${icon('sparkles')} Next-Gen AI Graphic & Motion Design Platform
        </div>
        <h1 class="hero-main-title">
          Create, edit & animate graphics <span class="gradient-text">at the speed of light</span>
        </h1>
        <p class="hero-description">
          Creato combines the creative power of Canva, Figma, Photopea, and Kittl with generative AI. Design social content, logos, presentations, and motion graphics seamlessly.
        </p>
        <div class="hero-ctas">
          <button class="btn-hero-primary" id="hero-launch-app">Open Creato Studio ${icon('arrowRight')}</button>
          <button class="btn-hero-secondary" id="hero-watch-demo">${icon('play')} Explore Features</button>
        </div>

        <!-- Interactive Product Showcase Preview -->
        <div class="hero-preview-wrapper">
          <div class="hero-preview-screen">
            <div class="preview-sidebar">
              <div class="preview-sidebar-icon">${icon('cursor')}</div>
              <div class="preview-sidebar-icon">${icon('type')}</div>
              <div class="preview-sidebar-icon">${icon('square')}</div>
              <div class="preview-sidebar-icon">${icon('sparkles')}</div>
              <div class="preview-sidebar-icon">${icon('layers')}</div>
            </div>
            <div class="preview-canvas-area">
              <div class="preview-mock-artboard">
                <span class="mock-badge">✨ AI Design Generated</span>
                <h2 class="mock-title">FUTURE OF GRAPHIC DESIGN</h2>
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 8px;">Vectors • AI Artwork • Animations • Collaborate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="landing-section" style="padding-top: 0;">
        <div class="stats-banner">
          <div>
            <div class="stat-number">2.4M+</div>
            <div class="stat-label">Active Creators</div>
          </div>
          <div>
            <div class="stat-number">18M+</div>
            <div class="stat-label">Designs Generated</div>
          </div>
          <div>
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Cloud Uptime</div>
          </div>
          <div>
            <div class="stat-number">150+</div>
            <div class="stat-label">Design Presets</div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="landing-section" id="features">
        <div class="section-tag">Powerful Suite</div>
        <h2 class="section-main-heading">Everything you need to create <span class="gradient-text">masterpieces</span></h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-card-icon" style="background: rgba(124, 58, 237, 0.15); color: hsl(var(--brand-primary));">${icon('sparkles')}</div>
            <h3 class="feature-card-title">AI Artwork & Photo Studio</h3>
            <p class="feature-card-desc">Generate high-res artwork from prompts, remove backgrounds instantly, and apply Photopea-grade adjustments.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card-icon" style="background: rgba(59, 130, 246, 0.15); color: hsl(var(--brand-secondary));">${icon('cursor')}</div>
            <h3 class="feature-card-title">Vector & Layout Editor</h3>
            <p class="feature-card-desc">Figma-style multi-artboard canvas with vector precision, snap guidelines, and layer hierarchy control.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card-icon" style="background: rgba(6, 182, 212, 0.15); color: hsl(var(--brand-accent));">${icon('film')}</div>
            <h3 class="feature-card-title">Motion & Animation Timeline</h3>
            <p class="feature-card-desc">Animate graphics with keyframes, preset motion dynamics, and export directly to MP4 or GIF.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card-icon" style="background: rgba(236, 72, 153, 0.15); color: hsl(var(--brand-pink));">${icon('palette')}</div>
            <h3 class="feature-card-title">Enterprise Brand Kit</h3>
            <p class="feature-card-desc">Maintain color harmony, custom typography scales, and brand assets across all your team workspaces.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card-icon" style="background: rgba(16, 185, 129, 0.15); color: hsl(var(--brand-green));">${icon('users')}</div>
            <h3 class="feature-card-title">Live Team Collaboration</h3>
            <p class="feature-card-desc">Work together in real-time with live cursor tracking, comments, and role-based permissions.</p>
          </div>

          <div class="feature-card">
            <div class="feature-card-icon" style="background: rgba(245, 158, 11, 0.15); color: hsl(var(--brand-orange));">${icon('download')}</div>
            <h3 class="feature-card-title">Multi-Format Export Engine</h3>
            <p class="feature-card-desc">Export production-ready files in PNG, transparent SVG, PDF, WEBP, GIF, MP4, or JSON backup.</p>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="landing-section" id="pricing">
        <div class="section-tag">Flexible Plans</div>
        <h2 class="section-main-heading">Simple, transparent <span class="gradient-text">pricing</span></h2>

        <div class="pricing-grid">
          <!-- Free Plan -->
          <div class="pricing-card">
            <div class="pricing-plan-name">Free</div>
            <div class="pricing-price">$0 <span>/month</span></div>
            <div class="pricing-features">
              <div class="pricing-feature-item">${icon('check')} 5 Active Projects</div>
              <div class="pricing-feature-item">${icon('check')} Standard Templates</div>
              <div class="pricing-feature-item">${icon('check')} 10 AI Generations/mo</div>
              <div class="pricing-feature-item">${icon('check')} 1GB Storage</div>
            </div>
            <button class="btn-hero-secondary" id="plan-btn-free" style="width: 100%;">Start Free</button>
          </div>

          <!-- Starter Plan -->
          <div class="pricing-card">
            <div class="pricing-plan-name">Starter</div>
            <div class="pricing-price">$12 <span>/month</span></div>
            <div class="pricing-features">
              <div class="pricing-feature-item">${icon('check')} Unlimited Projects</div>
              <div class="pricing-feature-item">${icon('check')} All Premium Templates</div>
              <div class="pricing-feature-item">${icon('check')} 200 AI Generations/mo</div>
              <div class="pricing-feature-item">${icon('check')} SVG Vector Export</div>
            </div>
            <button class="btn-hero-secondary" id="plan-btn-starter" style="width: 100%;">Upgrade to Starter</button>
          </div>

          <!-- Professional Plan -->
          <div class="pricing-card popular">
            <span class="pricing-badge">Most Popular</span>
            <div class="pricing-plan-name">Professional</div>
            <div class="pricing-price">$29 <span>/month</span></div>
            <div class="pricing-features">
              <div class="pricing-feature-item">${icon('check')} Everything in Starter</div>
              <div class="pricing-feature-item">${icon('check')} Unlimited AI Artwork</div>
              <div class="pricing-feature-item">${icon('check')} Motion Animation Studio</div>
              <div class="pricing-feature-item">${icon('check')} Team Collaboration (5 seats)</div>
              <div class="pricing-feature-item">${icon('check')} Brand Kit Manager</div>
            </div>
            <button class="btn-hero-primary" id="plan-btn-pro" style="width: 100%;">Get Professional</button>
          </div>

          <!-- Enterprise Plan -->
          <div class="pricing-card">
            <div class="pricing-plan-name">Enterprise</div>
            <div class="pricing-price">$79 <span>/month</span></div>
            <div class="pricing-features">
              <div class="pricing-feature-item">${icon('check')} Unlimited Team Seats</div>
              <div class="pricing-feature-item">${icon('check')} Dedicated Admin Panel</div>
              <div class="pricing-feature-item">${icon('check')} Priority AI Processing</div>
              <div class="pricing-feature-item">${icon('check')} 24/7 Priority Support</div>
            </div>
            <button class="btn-hero-secondary" id="plan-btn-enterprise" style="width: 100%;">Get Enterprise</button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-top">
          <div>
            <div class="landing-brand" style="margin-bottom: 16px;">
              <div class="landing-brand-icon">${icon('sparkles')}</div>
              <span class="gradient-text">Creato</span>
            </div>
            <p style="color: var(--text-tertiary); font-size: 14px; max-width: 280px; line-height: 1.6;">
              The next-generation AI graphic and motion design platform built for modern creators and teams.
            </p>
          </div>

          <div>
            <div class="footer-col-title">Product</div>
            <div class="footer-list">
              <a href="#">Graphic Editor</a>
              <a href="#">AI Studio</a>
              <a href="#">Animation Studio</a>
              <a href="#">Brand Kit</a>
              <a href="#">Templates</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Resources</div>
            <div class="footer-list">
              <a href="#">Documentation</a>
              <a href="#">Tutorials</a>
              <a href="#">API Reference</a>
              <a href="#">Community</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Company</div>
            <div class="footer-list">
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Connect</div>
            <div class="footer-list">
              <a href="#">GitHub</a>
              <a href="#">Twitter/X</a>
              <a href="#">Discord</a>
              <a href="#">YouTube</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          © 2026 Creato Studio Inc. All rights reserved. Built with precision for modern creators.
        </div>
      </footer>
    </div>
  `;

  // Bind CTAs & Payment Checkout Triggers
  const launch = () => { if (onGetStarted) onGetStarted(); };
  document.getElementById('landing-get-started')?.addEventListener('click', launch);
  document.getElementById('hero-launch-app')?.addEventListener('click', launch);
  document.getElementById('landing-login-btn')?.addEventListener('click', launch);
  document.getElementById('hero-watch-demo')?.addEventListener('click', launch);

  // Pricing Plan Checkout Modal Triggers
  document.getElementById('plan-btn-free')?.addEventListener('click', launch);
  document.getElementById('plan-btn-starter')?.addEventListener('click', () => {
    PaymentGateway.renderCheckoutModal('Starter', '$12', () => launch());
  });
  document.getElementById('plan-btn-pro')?.addEventListener('click', () => {
    PaymentGateway.renderCheckoutModal('Professional', '$29', () => launch());
  });
  document.getElementById('plan-btn-enterprise')?.addEventListener('click', () => {
    PaymentGateway.renderCheckoutModal('Enterprise', '$79', () => launch());
  });
}
