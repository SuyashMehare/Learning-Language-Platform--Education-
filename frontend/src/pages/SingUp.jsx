import { useEffect, useRef, useState } from "react"

import axios from "axios";

function SignUp() {
    const [err, setErr] = useState("");
    const [email, setEmail] = useState("");
    const [lanuages, setLanguages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [labels, setLabels] = useState([]);
    const [difficulty, setDifficulty] = useState([]);
    const [dailyWorkingMin, setDailyWorkingMin] = useState([])
    
    const [preferences, setPreferences] = useState({
        targetLabels: [],
        targetCategories: [],
    });


    const setUserPreferences = (e, candidate) => {   
        setErr("")    
        let value = e.target.value;

        if(candidate === "labels"){
            if(preferences.targetLabels.includes(value)){ // todo:use hashset
                return;
            }
            
            setPreferences({
                ...preferences,
                targetLabels: [...preferences.targetLabels, value.trim()]
            });
        }else if(candidate === "categories") {
            if(preferences.targetCategories.includes(value)){ // todo:use hashset
                return;
            }
            
            setPreferences({
                ...preferences,
                targetCategories: [...preferences.targetCategories, value]
            });
        }else if(candidate === "dailyGoal"){
            setPreferences({
                ...preferences,
                dailyGoalMinutes: value
            });
        }else if(candidate === "lanuage"){
            setPreferences({
                ...preferences,
                lanuage: value
            });
        }else if(candidate === "difficulty"){
            setPreferences({
                ...preferences,
                difficulty: value
            });
        }

    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if(!email) {
            setErr("Please enter the email");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/signup",{
                email,
                preferences
            })

            if(res.data.data.success) {

            }
        } catch (error) {
            console.log("Error",error);
            setErr("Soemthing went wrong please try again latter");
            return;
        }
       

        console.log(res);        
    }
    useEffect(() => {
        axios.get("http://localhost:5000/api/v1/platform/metadata")
            .then((res) => {
                // console.log(res.data.data.metadata);
                
                setLabels(res.data.data.metadata.labels)
                setCategories(res.data.data.metadata.categories)
                setDifficulty(res.data.data.metadata.difficulty)
                setLabels(res.data.data.metadata.labels)
                setDailyWorkingMin(["10","20","30","60"])
                setLanguages(["es", "en"])
            })
            .catch((reson) => console.log(reson))
    }, []);
    
    return (
        <>
            <h3 class="text-center text-4xl mb-5" >Register User</h3>
            {
                (err && (
                    <div class="text-red-300 text-center">{err} </div>
                ))
            }
            <form onSubmit={handleSubmit} class="flex flex-col gap-4 flex-wrap max-w-xl justify-self-center p-3 border rounded-md">
                <div class="flex flex-wrap gap-3">
                    <label htmlFor="user-email" class="self-center">User email: </label>
                    <input 
                        type="text" 
                        name="user-email" 
                        id="user-email" 
                        onChange={(e)=>setEmail(e.target.value)} 
                        placeholder="Enter Email" 
                        class="p-3"
                    />
                </div>

                {/* language */}
                <div class="flex flex-wrap gap-2 ">
                    <h3 class="self-center">Select Language:</h3>
                    {lanuages.length > 0 ? (
                        lanuages.map((candidate, idx) => (
                            <button 
                                key={candidate} 
                                type="button"
                                onClick={(e) => setUserPreferences(e, "lanuage")}
                                value={candidate}
                                class="bg-sky-500/50 p-2 rounded" 
                            >
                            {candidate}
                        </button>
                        ))
                    ) : (
                        <p>Loading Difficulty...</p>
                    )}
                </div>
                
                {/* labels */}
                <div class="flex flex-col flex-wrap gap-3">
                    <h3 >Labels:</h3>
                    <div class="flex flex-wrap gap-3">
                        {labels.length > 0 ? (
                            labels.map((label, idx) => (
                                <button 
                                    key={label}
                                    type="button" 
                                    onClick={(e) => setUserPreferences(e, "labels")}
                                    class="bg-sky-500/50 p-2 rounded" value={label}
                                >
                                    {label}
                                </button>
                            ))
                        ) : (
                            <p>Loading labels...</p>
                        )}
                    </div>
                </div>

                {/* categories */}
                <div class="flex flex-wrap gap-2">
                    <h3>Categories:</h3>
                        <div class="flex flex-wrap gap-3">
                        {categories.length > 0 ? (
                            categories.map((category, idx) => (
                                <button 
                                    key={category} 
                                    type="button"
                                    onClick={(e) => setUserPreferences(e, "categories")}
                                    value={category}
                                    class="bg-sky-500/50 p-2 rounded" 
                                >
                                    {category}
                                </button>
                            ))
                        ) : (
                            <p>Loading Categories...</p>
                        )}
                    </div>
                </div>

                {/* difficulty */}
                <div class="flex flex-wrap gap-2 ">
                    <h3 class="self-center">Difficulty:</h3>
                    {difficulty.length > 0 ? (
                        difficulty.map((candidate, idx) => (
                            <button 
                                key={candidate} 
                                type="button"
                                onClick={(e) => setUserPreferences(e, "difficulty")}
                                value={candidate}
                                class="bg-sky-500/50 p-2 rounded" 
                            >
                            {candidate}
                        </button>
                        ))
                    ) : (
                        <p>Loading Difficulty...</p>
                    )}
                </div>

                {/* dailyWorkingMin */}
                <div class="flex flex-wrap gap-2 ">
                    <h3 class="self-center">Daily Goal in Minutes:</h3>
                    {dailyWorkingMin.length > 0 ? (
                        dailyWorkingMin.map((candidate, idx) => (
                            <button 
                                key={candidate} 
                                type="button"
                                onClick={(e) => setUserPreferences(e, "dailyGoal")}
                                value={candidate}
                                class="bg-sky-500/50 p-2 rounded" 
                            >
                            {candidate}
                        </button>
                        ))
                    ) : (
                        <p>Loading Difficulty...</p>
                    )}
                </div>

                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export {
    SignUp
}
