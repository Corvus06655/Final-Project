const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('ps_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiLogin = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  }).then(handle);

export const apiRegister = (name, email, password) =>
  fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  }).then(handle);

export const apiGetMe = () =>
  fetch(`${BASE}/auth/me`, { headers: headers() }).then(handle);

// ── Inventory ─────────────────────────────────────────────────────────────────
export const apiGetInventory = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetch(`${BASE}/inventory${q ? '?' + q : ''}`, {
    headers: headers(),
  }).then(handle);
};

export const apiCreateItem = (body) =>
  fetch(`${BASE}/inventory`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  }).then(handle);

export const apiUpdateItem = (id, body) =>
  fetch(`${BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  }).then(handle);

export const apiDeleteItem = (id) =>
  fetch(`${BASE}/inventory/${id}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(handle);

export const apiUpdateStock = (id, type, quantityChange, note = '') =>
  fetch(`${BASE}/inventory/${id}/stock`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ type, quantityChange, note }),
  }).then(handle);

export const apiGetDashboard = () =>
  fetch(`${BASE}/inventory/dashboard/stats`, {
    headers: headers(),
  }).then(handle);

export const apiGetPredictions = () =>
  fetch(`${BASE}/inventory/predictions/all`, {
    headers: headers(),
  }).then(handle);

export const apiGetProductPrediction = (id) =>
  fetch(`${BASE}/inventory/${id}/predict`, {
    headers: headers(),
  }).then(handle);

export const apiGetHistory = (id) =>
  fetch(`${BASE}/inventory/${id}/history`, {
    headers: headers(),
  }).then(handle);

export const apiGetCategories = () =>
  fetch(`${BASE}/inventory/meta/categories`, {
    headers: headers(),
  }).then(handle);

// ── CSV Import ────────────────────────────────────────────────────────────────
export const apiImportCSV = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return fetch(`${BASE}/inventory/import/csv`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: fd,
  }).then(handle);
};

// ── Health ────────────────────────────────────────────────────────────────────
export const apiHealth = () =>
  fetch(`${BASE}/health`).then(handle).catch(() => ({ success: false }));
