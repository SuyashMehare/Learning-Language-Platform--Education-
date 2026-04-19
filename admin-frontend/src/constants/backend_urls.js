const BACKEND_URLS = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:2003',
  ADMIN: {
    SIGNUP: '/api/v1/admin/signup',
    LOGIN: '/api/v1/admin/login',
    PROFILE: '/api/v1/admin/profile',
    LECTURES: '/api/v1/admin/lectures'
  },
  PLATFORM: {
    TAGS: '/api/v1/platform/tags',
    QUIZZES: '/api/v1/platform/quizzes'
  }
};

export default BACKEND_URLS;
