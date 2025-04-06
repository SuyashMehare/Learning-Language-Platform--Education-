import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

function Quiz() {
    const location = useLocation() ; 
    const [quizData, setQuizData] = useState([]);
    const [fetchFromAPI, setFetchFromAPI] = useState("");
    const [postToAPI, setPostToAPI] = useState("");
    const [isAnswerHidden, setAnswerHidden] = useState(true)
    
    useEffect(() => {
        if(location.state) {
            console.log(location.state.data);
            
            setQuizData(location.state.data);
            setFetchFromAPI(location.state.fetchDataEndpoint);
            setPostToAPI(location.state.postDataEndPoint);
        }
    },[])

    async function handleSubmit(e,option) { 
        
        setAnswerHidden(false)
        const lastQuiz = quizData[quizData.length - 1];
        const correctOption = lastQuiz.answer;
        const selectedOption = option;
        // console.log(`http://localhost:5000/${postToAPI}`, lastQuiz.id, lastQuiz.points);
        // console.log(correctOption,selectedOption, correctOption === selectedOption);
        
        try {
            const res = await axios.patch(`http://localhost:5000/${postToAPI}`, {
                vocabularyId: lastQuiz.id,
                email: "user3@gmail.com",
                points: lastQuiz.points,
                isAnswerCorrect: (correctOption === selectedOption)
            });
            console.log("correct", res);
        } catch (error) {
            console.log("Error while handling the vocabulary submission", error);
        }

    }

    function handleNext() {
        setAnswerHidden(true)
        if(quizData.length == 0) {
            // todo: fetch via AI..
        }

        setQuizData(prev => {
            const newArray = [...prev];
            newArray.pop()
            return newArray;
        })
        console.log("Next clicked");
    }

    
    
    return <>
        <div class="self-center  p-5 bg-emerald-900 min-w-md max-w-md rounded">
            <h3 className="mb-4 text-center text-xl font-extrabold">Quizz</h3>
            {quizData.length > 0 && (
                <>
                    <h3 class="text-center bg-gray-500 p-10 rounded">{quizData[quizData.length - 1].question}</h3>
                    <ul>
                        {quizData[quizData.length - 1].options.map((option, i) => (
                            <li 
                                key={option + i} 
                                id={option+i}
                                onClick={(e) => handleSubmit(e,option)}
                                class="bg-sky-800 mt-3 p-2 hover:bg-sky-950 cursor-pointer "
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                    <div class={`bg-green-600 p-5 my-4 ${isAnswerHidden && "hidden"}`}>
                        <p class="font-medium text-xl">Correct Answer: </p>
                        <p><span>Answer: </span>{quizData[quizData.length - 1].answer}</p>
                        <p><span>Feedback: </span>{quizData[quizData.length - 1].feedback}</p>
                    </div>
                    <button 
                        onClick={handleNext} 
                        class="bg-pink-700 py-1 px-2 rounded cursor-pointer hover:bg-pink-900 mt-5"
                    >Next</button>
                </>
            )}
        </div>
    </>
}

export {
    Quiz
}