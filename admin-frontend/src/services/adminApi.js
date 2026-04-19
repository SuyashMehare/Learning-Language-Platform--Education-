import BACKEND_URLS from '../constants/backend_urls';

const TOKEN_KEY = 'admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getAuthHeaders(extraHeaders = {}) {
  const token = getAdminToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export async function loginAdmin(email, password) {
  const response = await fetch(`${BACKEND_URLS.BASE_URL}${BACKEND_URLS.ADMIN.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Login failed');
  }

  if (payload.token) {
    setAdminToken(payload.token);
  }
  return payload;
}

export async function fetchAdminLectures() {
  const response = await fetch(`${BACKEND_URLS.BASE_URL}${BACKEND_URLS.ADMIN.LECTURES}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || 'Unable to fetch lectures');
  }

  return Array.isArray(payload) ? payload : payload?.data || [];
}

export async function uploadLecture(formData) {
  const response = await fetch(`${BACKEND_URLS.BASE_URL}${BACKEND_URLS.ADMIN.LECTURES}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Unable to upload lecture');
  }
  return payload;
}

export async function fetchTagOptions() {
  const response = await fetch(`${BACKEND_URLS.BASE_URL}${BACKEND_URLS.PLATFORM.TAGS}`, {
    method: 'GET',
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Unable to fetch tags');
  }

  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchQuizOptions() {
  const response = await fetch(`${BACKEND_URLS.BASE_URL}${BACKEND_URLS.PLATFORM.QUIZZES}`, {
    method: 'GET',
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Unable to fetch quizzes');
  }

  return Array.isArray(payload.data) ? payload.data : [];
}
