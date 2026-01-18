import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CardsOfOthers } from "../Components/CardsOfOthers";
import { BACKEND_URLS } from "../constants/backend_urls";

function Others() {
    const navigate = useNavigate()
    useEffect(() => {
        const user = localStorage.getItem("llp-user")
        if (!user) {
            navigate("/login")
        }
    },[])

    return(<>
       <div class="flex flex-wrap justify-center gap-10 mt-14">
        <CardsOfOthers 
            label="Solved Vocalbulary" 
            navLink="/client/vocabulary/solved"
            fetchDataEndpoint={BACKEND_URLS.PLATFORM.VOCABULARIES_SOLVED}   
            postDataEndPoint={BACKEND_URLS.USER.VOCABULARY_SUBMIT}
            customCss={"bg-amber-700 shadow-xl hover:bg-amber-900 cursor-pointer"}
        />
        <CardsOfOthers 
            label="Unsolved Vocalbulary" 
            navLink="/client/vocabulary/unsolved"
            fetchDataEndpoint={BACKEND_URLS.PLATFORM.VOCABULARIES_UNSOLVED}  
            postDataEndPoint={BACKEND_URLS.USER.VOCABULARY_SUBMIT}
            customCss={"bg-lime-700  shadow-xl hover:bg-lime-900 cursor-pointer"}
        />
        <CardsOfOthers 
            label="Random Quiz" 
            navLink="/client/quiz/random" 
            fetchDataEndpoint={BACKEND_URLS.PLATFORM.QUIZZES_RANDOM}   
            postDataEndPoint={BACKEND_URLS.USER.QUIZ_SUBMIT}
            customCss={"bg-yellow-900 shadow-xl hover:bg-yellow-700 cursor-pointer "}
        />
        <CardsOfOthers 
            label="Pronounciation" 
            // navLink="/client/quiz/random" 
            // fetchDataEndpoint="api/v1/platform/quizzes/random"   
            // postDataEndPoint="api/v1/user/quiz/submit"
            customCss={"bg-yellow-900 shadow-xl hover:bg-yellow-700 cursor-pointer "}
        />
       </div>
    </>)
}

export {
    Others
}