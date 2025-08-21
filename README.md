# Learning Language Platform- Education 

## Introduction
This project aims to build a free, student-focused language learning platform designed to make language acquisition engaging, interactive, and accessible. It features a structured library of lessons, interactive quizzes, spaced repetition flashcards, pronunciation feedback using voice recognition, and offline learning support. Learners can track their progress, earn badges through weekly challenges, and practice with real-world conversational scenarios. The platform is initially built for English, with easy scalability to other languages like Spanish.

## Project Type
Frontend | Backend | Fullstack

## Deplolyed App
Frontend: https://lovely-kheer-efe84f.netlify.app/
Backend: https://learning-language-platform-education-kqws.onrender.com

## Directory Structure

```
llp/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ platform/
│  │  │  ├─ user/
│  │  │
│  │  ├─ db/
│  │  ├─ dumpData/
│  │  │  ├─ badges/
│  │  │  ├─ lectures/
│  │  │  ├─ quizz/
│  │  │  ├─ vocabulary/
│  │  │
│  │  ├─ middlewares/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  ├─ app.js
│  │  ├─ index.js
│
├─ frontend/
│  ├─ src/
│  │  ├─ Components/
│  │  │  ├─ Dashboard/
│  │  │  +
│  │  │
│  │  ├─ pages/
│  │  ├─ App.jsx
│  │  ├─ App.css
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ index.html
```

---

## Video Walkthrough of the project
https://youtu.be/VvK7WniAGJg
## Video Walkthrough of the codebase
https://youtu.be/VvK7WniAGJg
## Features
- Comprehensive Lesson Library
- User Progress Tracker
- Daily Practice Goals and Streaks
- Spaced Repetition System helps user to solve quizzes and exercies where they are weak.
- Gamified Learning Experience keeps engage user by earning points, badges and achivements
- Interactive Quizzes and Exercises 
- User Authentication


---



## Technology Stack
List and provide a brief overview of the technologies used in the project.

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemon

- Axios
- React JS
- React DOM
- React Route DOM
- Tailwind Css

---

## API Endpoints
Here is a list of your API endpoints, methods, brief descriptions, and examples of request/response.

---

### Authentication

**POST** `/api1/v1/user/login` – Log in a user  
**Request:**
```json
{
  "email": "user1@gmail.com"
}
```

**POST** `/api/v1/user/signup` – Register a new user with preferences  
**Request:**
```json
{
  "email": "user3@gmail.com",
  "preferences": {
    "targetLabels": ["slang", "conversational"],
    "targetCategories": ["passive_voice", "prepositions"],
    "difficulty": "C1"
  }
}
```

---

### Lectures

**GET** `/api/v1/platform/lectures` – Get all lectures available to a user  
**Request:**
```json
{
  "email": "user2@gmail.com"
}
```

**PATCH** `/api/v1/user/lecture/complete` – Mark a lecture as completed  
**Request:**
```json
{
  "email": "user3@gmail.com",
  "lectureId": "lecture_english_articles_a_the VI",
  "points": 11,
  "duration": 600
}
```

---

### Quizzes

**GET** `/api/v1/platform/quizzes/random` – Get random quizzes  
**Request:**
```json
{
  "email": "user3@gmail.com"
}
```

**GET** `/api/v1/platform/quizzes/inlecture` – Get quizzes linked to lectures  
**Request:**
```json
{
  "quizIds": [
    "67ee30b542adbbf1f0911424",
    "67ee30b542adbbf1f0911426",
    "67ee30b542adbbf1f0911428"
  ]
}
```

**PATCH** `/api/v1/user/quiz/submit` – Submit quiz answer  
**Request:**
```json
{
  "quizId": "quiz_articles_en",
  "email": "user3@gmail.com",
  "isAnswerCorrect": true,
  "points": 7
}
```

---

### Vocabulary

**GET** `/api/v1/platform/vocabularies/unsolved` – Get all unsolved vocabulary for a user  
**Request:**
```json
{
  "email": "user1@gmail.com"
}
```

**GET** `/api/v1/platform/vocabularies/solved` – Get all solved vocabulary for a user  
**Request:**
```json
{
  "email": "user1@gmail.com"
}
```

**PATCH** `/api/v1/user/vocabulary/submit` – Submit vocabulary answer  
**Request:**
```json
{
  "vocabularyId": "vocab_bandwidth",
  "email": "user3@gmail.com",
  "points": 1,
  "isAnswerCorrect": false
}
```

---

### User Profile & Metadata

**GET** `/api/v1/user/profile` – Get user statistics and profile  
**Request:**
```json
{
  "email": "user3@gmail.com"
}
```

**GET** `/api/v1/platform/metadata` – Fetch metadata (labels, categories, difficulty levels)  
**Request:** _None_


