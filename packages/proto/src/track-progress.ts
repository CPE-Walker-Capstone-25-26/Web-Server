import './bar-chart.js';

interface User {
  usage: number[];
}

const SIZES    = [24, 24, 7, 7, 31, 31, 12, 12];
const VARIANTS = ['day','day','week','week','month','month','year','year'] as const;
const IDS      = [
  'daily-left','daily-right',
  'weekly-left','weekly-right',
  'monthly-left','monthly-right',
  'yearly-left','yearly-right'
] as const;

async function boot() {
  const token = localStorage.getItem('token');

  if (!token) {
    // No redirect here—just exit early.
    console.log('No token; skipping data fetch.');
    return;
  }

  // If token exists, try fetching your user data
  const res = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    console.warn('Failed to fetch /api/auth/me; clearing token.');
    // Optionally: localStorage.removeItem('token');
    return;
  }

  const user: User = await res.json();

  // Populate each <bar-chart> with the right slice of user.usage
  let offset = 0;
  for (let i = 0; i < SIZES.length; i++) {
    const count = SIZES[i];
    const slice = user.usage.slice(offset, offset + count);
    offset += count;

    const el = document.getElementById(IDS[i]) as any;
    if (el) {
      el.data    = slice;
      el.variant = VARIANTS[i];
      el.unit    = 'lbs';
    }
  }
}

document.addEventListener('DOMContentLoaded', boot);
