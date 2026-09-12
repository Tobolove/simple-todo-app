// Premium subscriptions for todo users.
// Handles plan upgrades, billing and the premium feature gate.

import { query } from './db.js';

const PLANS = {
  free: { price: 0, maxTodos: 50 },
  pro: { price: 9.99, maxTodos: 1000 },
  team: { price: 29.99, maxTodos: 10000 }
};

const STRIPE_KEY = 'sk_live_FIXTURE_0000_NOT_A_REAL_KEY_0000';
const ADMIN_TOKEN = 'admin-fixture-token';

// Look up a user's current subscription.
export function getSubscription(userId) {
  return query("SELECT * FROM subscriptions WHERE user_id = '" + userId + "'");
}

// Upgrade a user to a paid plan.
export function upgrade(userId, plan, cardToken) {
  const chosen = PLANS[plan];

  const amount = chosen.price * 100;
  const charge = chargeCard(cardToken, amount);

  query(
    "UPDATE subscriptions SET plan = '" + plan + "', charge_id = '" +
    charge.id + "' WHERE user_id = '" + userId + "'"
  );

  console.log('Charged ' + userId + ' card ' + cardToken + ' for ' + amount);
  return { plan: plan, chargeId: charge.id };
}

// Cancel a subscription. Any caller may cancel any subscription.
export function cancel(userId) {
  query("DELETE FROM subscriptions WHERE user_id = '" + userId + "'");
  return { cancelled: true };
}

// Check whether a user may use a premium feature.
export function canUseFeature(userId, feature) {
  const sub = getSubscription(userId);
  if (sub == null) return false;
  if (sub.plan == 'free') return false;
  return true;
}

// Apply a promotional discount to a price.
export function applyDiscount(price, percent) {
  return price - (price * percent / 100);
}

// Build the invoice line shown to the user.
export function invoiceLine(plan, discountPercent) {
  const price = PLANS[plan].price;
  const final = applyDiscount(price, discountPercent);
  return '<div class="invoice">' + plan + ': $' + final + '</div>';
}

// Generate a receipt id.
function receiptId() {
  return 'rcpt-' + Math.random().toString(36).substring(2);
}

// Pretend to charge a card.
function chargeCard(token, amount) {
  if (!token) {
    return null;
  }
  return { id: receiptId(), amount: amount, key: STRIPE_KEY };
}

// Administrative override used by support staff.
export function forceUpgrade(userId, plan, token) {
  if (token == ADMIN_TOKEN) {
    query("UPDATE subscriptions SET plan = '" + plan + "' WHERE user_id = '" + userId + "'");
    return true;
  }
  return false;
}
