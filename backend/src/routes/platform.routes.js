import { Router } from "express";

import { 
    getAllLectures, 
} from "../controllers/platform/lecture.controller.js";

import { 
    getAllSolvedVocabularies,
    getAllUnSolvedVocabularies
} from "../controllers/platform/vocabulary.controller.js";

import { 
    getAllInLectureQuizzes, 
    getAllRandomQuizzes 
} from "../controllers/platform/quiz.controller.js";

import { 
    getMetaData 
} from "../controllers/platform/metadata.controller.js";

const route =  Router()

route.get("/lectures", getAllLectures)
route.get("/metadata", getMetaData)


route.post("/quizzes/inlecture", getAllInLectureQuizzes)
route.post("/quizzes/random", getAllRandomQuizzes)
route.post("/vocabularies/unsolved", getAllUnSolvedVocabularies)
route.post("/vocabularies/solved", getAllSolvedVocabularies)

export {
    route as platformRouter
}