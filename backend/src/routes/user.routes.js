import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";

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
route.post("/profile", authenticateJWT, getUserProfile)


route.patch("/lecture/complete", authenticateJWT, onLectureComplete)
route.patch("/quiz/submit", authenticateJWT, onQuizSubmit);
route.patch("/vocabulary/submit", authenticateJWT, onSubmitVocabulary);

export {
    route as userRouter
}