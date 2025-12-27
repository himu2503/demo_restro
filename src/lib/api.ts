const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = API_BASE + path;
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    ...opts,
    headers: {
      'content-type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || res.statusText);
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
}

export default apiFetch;
