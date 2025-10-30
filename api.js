const API_BASE = 'http://localhost:4000/api';

export function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return fetch(API_BASE + path, { ...opts, headers });
}

export default API_BASE;
