/**
 * Centralized Authentication & Access Control Utilities for Ciné
 * NOTE: This is client-side auth. For production, use a proper auth backend.
 */

// Admin email whitelist (visible in client bundle — for UI gating only, not true security)
export const APPROVED_ADMIN_EMAILS = [
  'admin@cine-glacier.fr',
];

const SESSION_KEY = 'cine_active_user';
const ATTEMPTS_KEY = 'cine_login_attempts';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Hash a password using SHA-256 via Web Crypto API
 * @param {string} password
 * @returns {Promise<string>} hex-encoded hash
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function isApprovedAdmin(user) {
  if (!user || typeof user !== 'object') return false;
  const email = (user.email || '').toLowerCase().trim();
  if (!email) return false;

  const isApproved = APPROVED_ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase().trim() === email
  );

  return isApproved && user.role === 'admin';
}

export function getActiveUser() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const user = JSON.parse(saved);
    // Check session expiration
    if (user.expiresAt && Date.now() > user.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function setActiveUser(user) {
  const session = {
    ...user,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getLoginAttempts() {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordLoginAttempt() {
  const attempts = getLoginAttempts();
  attempts.push(Date.now());
  sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function isRateLimited() {
  const attempts = getLoginAttempts();
  const cutoff = Date.now() - LOCKOUT_DURATION_MS;
  const recentAttempts = attempts.filter(t => t > cutoff);
  return recentAttempts.length >= MAX_ATTEMPTS;
}

export function getRateLimitRemainingSeconds() {
  const attempts = getLoginAttempts();
  const cutoff = Date.now() - LOCKOUT_DURATION_MS;
  const recentAttempts = attempts.filter(t => t > cutoff);
  if (recentAttempts.length < MAX_ATTEMPTS) return 0;
  const oldestRecent = Math.min(...recentAttempts);
  return Math.ceil((oldestRecent + LOCKOUT_DURATION_MS - Date.now()) / 1000);
}
