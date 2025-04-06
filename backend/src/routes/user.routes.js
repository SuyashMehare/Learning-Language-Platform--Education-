import { Router } from "express";

import { 
    getUserProfile, 
    loginUser, 
    signUpUser 
} from "../controllers/user/user.controller.js";

import { 
    onLectureComplete, 
    onQuizSubmit, 
    onSubmitVocabulary 
} from "../controllers/user/userActivites.controller.js";

const route =  Router()

route.post("/signup", signUpUser)
route.post("/login", loginUser)
route.post("/profile", getUserProfile)


route.patch("/lecture/complete", onLectureComplete)
route.patch("/quiz/submit", onQuizSubmit);
route.patch("/vocabulary/submit", onSubmitVocabulary);

export {
    route as userRouter
}