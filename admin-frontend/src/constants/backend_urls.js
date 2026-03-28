const BACKEND_URLS = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  ADMIN: {
    SIGNUP: '/api/v1/admin/signup',
    LOGIN: '/api/v1/admin/login',
    PROFILE: '/api/v1/admin/profile'
  }
};

export default BACKEND_URLS;
