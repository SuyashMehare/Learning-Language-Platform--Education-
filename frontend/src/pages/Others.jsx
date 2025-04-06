import axios from "axios";
import { useState } from "react";
import { CardsOfOthers } from "../Components/CardsOfOthers";

function Others() {
    return(<>
       <div class="flex flex-wrap justify-center gap-10 mt-14">
        <CardsOfOthers 
            label="Solved Vocalbulary" 
            navLink="/client/vocabulary/solved"
            fetchDataEndpoint="api/v1/platform/vocabularies/solved"   
            postDataEndPoint= "api/v1/user/vocabulary/submit"
            customCss={"bg-amber-700 shadow-xl hover:bg-amber-900 cursor-pointer"}
        />
        <CardsOfOthers 
            label="Unsolved Vocalbulary" 
            navLink="/client/vocabulary/unsolved"
            fetchDataEndpoint="api/v1/platform/vocabularies/unsolved"  
            postDataEndPoint="api/v1/user/vocabulary/submit"
            customCss={"bg-lime-700  shadow-xl hover:bg-lime-900 cursor-pointer"}
        />
        <CardsOfOthers 
            label="Random Quiz" 
            navLink="/client/quiz/random" 
            fetchDataEndpoint="api/v1/platform/quizzes/random"   
            postDataEndPoint="api/v1/user/quiz/submit"
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