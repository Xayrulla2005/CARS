const API_BASE = `${window.location.origin}/api`;

function getToken() {
  return localStorage.getItem("token") || "";
}

async function api(path, { method = "GET", data, isForm = false } = {}) {
  const headers = {};
  const opts = { method, headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (data && !isForm) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }
  if (data && isForm) {
    opts.body = data;
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok || (body && body.success === false)) {
    throw new Error((body && body.message) || res.statusText || "Request failed");
  }
  return body;
}

function fmtPrice(n) {
  if (typeof n !== "number") n = Number(n);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("uz-UZ");
}

let __meCache = null;
async function me(force=false){
  if (!getToken()) return null;
  if (__meCache && !force) return __meCache;
  try{
    const res = await api('/auth/profile');
    __meCache = res.user;
    return __meCache;
  }catch(e){
    return null;
  }
}

async function requireAuth(){
  if (!getToken()) { window.location.href='/auth.html'; throw new Error('Auth required'); }
  const u = await me();
  if (!u) { localStorage.removeItem('token'); window.location.href='/auth.html'; throw new Error('Auth required'); }
  return u;
}

function isAdmin(u){
  const usr = u || __meCache; return !!usr && usr.role === 'admin';
}

async function requireAdmin(){
  const u = await requireAuth();
  if (!isAdmin(u)) { alert('Admin huquqi talab qilinadi'); window.location.href='/'; throw new Error('Admin required'); }
  return u;
}

window.API = { api, fmtPrice, getToken, API_BASE, me, requireAuth, requireAdmin, isAdmin };
