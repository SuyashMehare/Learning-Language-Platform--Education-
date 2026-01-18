const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://lovely-kheer-efe84f.netlify.app/api/v1";

export const BACKEND_URLS = {
  // User routes
  USER: {
    SIGNUP: `${API_BASE_URL}/user/signup`,
    LOGIN: `${API_BASE_URL}/user/login`,
    PROFILE: `${API_BASE_URL}/user/profile`,
    LECTURE_COMPLETE: `${API_BASE_URL}/user/lecture/complete`,
    QUIZ_SUBMIT: `${API_BASE_URL}/user/quiz/submit`,
    VOCABULARY_SUBMIT: `${API_BASE_URL}/user/vocabulary/submit`,
  },

  // Platform routes
  PLATFORM: {
    LECTURES: `${API_BASE_URL}/platform/lectures`,
    METADATA: `${API_BASE_URL}/platform/metadata`,
    QUIZZES_IN_LECTURE: `${API_BASE_URL}/platform/quizzes/inlecture`,
    QUIZZES_RANDOM: `${API_BASE_URL}/platform/quizzes/random`,
    VOCABULARIES_UNSOLVED: `${API_BASE_URL}/platform/vocabularies/unsolved`,
    VOCABULARIES_SOLVED: `${API_BASE_URL}/platform/vocabularies/solved`,
  },
};