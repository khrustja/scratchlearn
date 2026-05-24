const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5180/api';

function getToken(){ return localStorage.getItem('sl_jwt') || ''; }
function setToken(token){ if(token) localStorage.setItem('sl_jwt', token); else localStorage.removeItem('sl_jwt'); }

export async function api(path, { method='GET', body, auth=false } = {}){
  const headers = { 'Content-Type': 'application/json' };
  if(auth){ const t = getToken(); if(t) headers['Authorization'] = `Bearer ${t}`; }
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export async function register(name, password, role){ const data = await api('/auth/register',{method:'POST',body:{name,password,role}}); setToken(data.token); return data.user; }
export async function login(name, password){ const data = await api('/auth/login',{method:'POST',body:{name,password}}); setToken(data.token); return data.user; }
export async function logout(){ setToken(''); }
export async function me(){ return (await api('/me',{auth:true})).user; }
export async function updateProfile(payload){ return (await api('/profile',{method:'PUT',auth:true,body:payload})).user; }
export async function lessons(){ return (await api('/lessons')).lessons; }
export async function tasks(){ return (await api('/tasks')).tasks; }
export async function leaderboard(){ return (await api('/leaderboard')).students; }
export async function classroom(){ return (await api('/classroom',{auth:true})).students; }
export async function weekly(){ return (await api('/weekly',{auth:true})).weekly; }
export async function submitTask(taskId, checklistAll, quizIndex, projectLink){ return await api('/submit',{method:'POST',auth:true,body:{taskId,checklistAll,quizIndex,projectLink}}); }
export async function createTask(payload){ return (await api('/tasks',{method:'POST',auth:true,body:payload})).task; }
