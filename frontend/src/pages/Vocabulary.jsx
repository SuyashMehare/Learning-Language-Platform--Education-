import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Vocabulary() {
    const location = useLocation();
    const [vocabData, setVocabData] = useState([]);
    const [fetchFromAPI, setFetchFromAPI] = useState("");
    const [postToAPI, setPostToAPI] = useState("");
    const [isAnswerHidden, setAnswerHidden] = useState(true)

    useEffect(() => {
        if (location.state) {
            console.log(location.state.data);
            setVocabData(location.state.data);
            setFetchFromAPI(location.state.fetchDataEndpoint);
            setPostToAPI(location.state.postDataEndPoint);
        }
    }, []);

    async function handleSubmit(e,option) {
        console.log(e.target.id);
        
        setAnswerHidden(false)
        const lastWord = vocabData[vocabData.length - 1];
        
        const correctOption = lastWord.synonyms;
        const selectedOption = option;
        // console.log(`http://localhost:5000/${postToAPI}`, lastWord.id);

        try {
            const res = await axios.patch(`https://learning-language-platform-education-kqws.onrender.com/${postToAPI}`, {
                vocabularyId: lastWord.id,
                email: "user3@gmail.com",
                points: 1,
                isAnswerCorrect: correctOption === selectedOption
            });
            console.log("correct", res);
        } catch (error) {
            console.log("Error while handling the vocabulary submission", error);
        }

    }

    function handleNext() {
        setAnswerHidden(true)
        if(vocabData.length == 0) {
            // todo: fetch via AI..
        }

        setVocabData(prev => {
            const newArray = [...prev];
            newArray.pop()
            return newArray;
        })
        console.log("Next clicked");
    }
    console.log(vocabData);
    
    return (
        <>
            <div class="self-center  p-5 bg-emerald-900 min-w-md rounded">
                <h3 className="mb-4 text-center text-xl font-extrabold">Vocabulary</h3>
                {vocabData.length > 0 && (
                    <>
                        <h3 class="text-center bg-gray-500 p-10 rounded">{vocabData[vocabData.length - 1].word}</h3>
                        <ul>
                            {vocabData[vocabData.length - 1].options.map((option, i) => (
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
                            <p><span>Word: </span>{vocabData[vocabData.length - 1].synonyms}</p>
                            <p><span>Meaning: </span>{vocabData[vocabData.length - 1].meaning}</p>
                        </div>
                        <button 
                            onClick={handleNext} 
                            class="bg-pink-700 py-1 px-2 rounded cursor-pointer hover:bg-pink-900 mt-5"
                        >Next</button>
                    </>
                )}
            </div>
        </>
    );
}

export {
    Vocabulary
}
