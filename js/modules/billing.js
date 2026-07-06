// ============================================
// CREATO — Payment Gateway & Checkout Subsystem
// Supports: Credit/Debit Card, UPI / QR Scan, PayPal, Invoice Receipt
// ============================================

import { icon } from '../utils/icons.js';
import { getAuthUser, saveAuthUser, addNotification } from '../store.js';

export class PaymentGateway {
  /**
   * Render Interactive Payment Checkout Modal
   */
  static renderCheckoutModal(planName = 'Professional', price = '$29', onSuccess) {
    const existing = document.getElementById('payment-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay visible';
    overlay.id = 'payment-modal-overlay';
    overlay.style.zIndex = '600';

    overlay.innerHTML = `
      <div class="modal" style="max-width: 520px; padding: 28px; border-radius: var(--radius-2xl);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="landing-brand-icon" style="width: 34px; height: 34px;">${icon('sparkles')}</div>
            <div>
              <h3 style="font-size: 18px; font-weight: 800; margin: 0;">Creato Payment Gateway</h3>
              <span style="font-size: 12px; color: var(--text-tertiary);">256-bit Encrypted Checkout</span>
            </div>
          </div>
          <button id="close-payment-modal" style="color: var(--text-tertiary); cursor: pointer;">${icon('x')}</button>
        </div>

        <!-- Order Summary Card -->
        <div style="padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 14px; font-weight: 700;">${planName} Subscription</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Unlimited AI Artwork • Vector Export • Team Seats</div>
          </div>
          <div style="font-size: 22px; font-weight: 800; color: hsl(var(--brand-accent));">${price}<span style="font-size: 12px; color: var(--text-tertiary);">/mo</span></div>
        </div>

        <!-- Payment Method Tabs -->
        <div class="panel-tabs" style="margin-bottom: 16px;">
          <div class="panel-tab active" id="tab-pay-card">💳 Card</div>
          <div class="panel-tab" id="tab-pay-upi">📱 UPI / QR</div>
          <div class="panel-tab" id="tab-pay-paypal">🌐 PayPal</div>
        </div>

        <!-- Tab 1: Credit / Debit Card Form -->
        <div id="pay-form-card">
          <div style="margin-bottom: 12px;">
            <label class="form-label" style="font-size: 11px;">Cardholder Name</label>
            <input type="text" class="form-input" id="card-name" value="Aditya Mazire" style="height: 36px; font-size: 13px;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label class="form-label" style="font-size: 11px;">Card Number</label>
            <input type="text" class="form-input" id="card-number" placeholder="4532 •••• •••• 8892" value="4532 8821 9012 8892" style="height: 36px; font-size: 13px;" />
          </div>
          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label class="form-label" style="font-size: 11px;">Expiry Date</label>
              <input type="text" class="form-input" id="card-expiry" value="08/29" style="height: 36px; font-size: 13px;" />
            </div>
            <div style="flex: 1;">
              <label class="form-label" style="font-size: 11px;">CVC / CVV</label>
              <input type="text" class="form-input" id="card-cvc" value="782" style="height: 36px; font-size: 13px;" />
            </div>
          </div>
        </div>

        <!-- Tab 2: UPI / QR Code Scan -->
        <div id="pay-form-upi" style="display: none; text-align: center; padding: 20px 0;">
          <div style="width: 140px; height: 140px; background: #ffffff; margin: 0 auto 12px; border-radius: var(--radius-md); padding: 10px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md);">
            <!-- QR Simulation -->
            <div style="width: 100%; height: 100%; background: radial-gradient(circle, #080811 20%, transparent 20%) 0 0 / 10px 10px, #ffffff; border: 2px dashed #000;"></div>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Scan with GPay, PhonePe, Paytm or BHIM UPI</p>
          <span style="font-size: 12px; font-weight: 700; color: hsl(var(--brand-accent));">creato.design@upi</span>
        </div>

        <!-- Tab 3: PayPal -->
        <div id="pay-form-paypal" style="display: none; text-align: center; padding: 20px 0;">
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">You will be redirected to PayPal to complete your purchase securely.</p>
          <button class="btn btn-secondary" style="margin: 0 auto; padding: 10px 24px; font-weight: 700; background: #FFC439; color: #000; border: none;">
            Pay with PayPal
          </button>
        </div>

        <!-- Submit Button -->
        <button class="btn btn-primary" id="btn-confirm-payment" style="width: 100%; justify-content: center; padding: 12px; font-size: 14px; margin-top: 10px;">
          ${icon('shield')} Complete Payment (${price})
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind Close
    document.getElementById('close-payment-modal')?.addEventListener('click', () => overlay.remove());

    // Bind Tabs
    const tabCard = document.getElementById('tab-pay-card');
    const tabUpi = document.getElementById('tab-pay-upi');
    const tabPaypal = document.getElementById('tab-pay-paypal');
    const formCard = document.getElementById('pay-form-card');
    const formUpi = document.getElementById('pay-form-upi');
    const formPaypal = document.getElementById('pay-form-paypal');

    tabCard?.addEventListener('click', () => {
      tabCard.classList.add('active'); tabUpi.classList.remove('active'); tabPaypal.classList.remove('active');
      formCard.style.display = 'block'; formUpi.style.display = 'none'; formPaypal.style.display = 'none';
    });

    tabUpi?.addEventListener('click', () => {
      tabUpi.classList.add('active'); tabCard.classList.remove('active'); tabPaypal.classList.remove('active');
      formUpi.style.display = 'block'; formCard.style.display = 'none'; formPaypal.style.display = 'none';
    });

    tabPaypal?.addEventListener('click', () => {
      tabPaypal.classList.add('active'); tabCard.classList.remove('active'); tabUpi.classList.remove('active');
      formPaypal.style.display = 'block'; formCard.style.display = 'none'; formUpi.style.display = 'none';
    });

    // Complete Payment
    document.getElementById('btn-confirm-payment')?.addEventListener('click', () => {
      const user = getAuthUser();
      user.plan = planName;
      saveAuthUser(user);

      addNotification('create', `Payment successful! Upgraded to ${planName} Plan (${price})`);
      overlay.remove();

      if (onSuccess) onSuccess(planName);

      // Show Success Toast
      const toast = document.createElement('div');
      toast.className = 'toast success';
      toast.innerHTML = `${icon('check')} <span>Upgrade successful! You are now on ${planName} Plan.</span>`;
      document.getElementById('toast-container')?.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    });
  }
}
