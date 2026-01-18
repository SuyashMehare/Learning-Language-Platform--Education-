import { useEffect, useState } from "react"
import { StreakAndGoalCard } from "../Components/Dashboard/StreakAndGoalCard"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URLS } from "../constants/backend_urls";

function UserProgress() {
    const navigate = useNavigate()
    const [userProgress, setUserProgress] = useState({})

    async function fetchProgress() {
        const user = localStorage.getItem("llp-user")
        try {
            const res = await axios.post(BACKEND_URLS.USER.PROFILE, { email: user })
            const data = res.data;

            console.log(data[0]);

            setUserProgress(data[0])
        } catch (error) {
            console.log("Error while fetching the user progress", error);
        }

    }

    useEffect(() => {
        const user = localStorage.getItem("llp-user")
        if (!user) {
            navigate("/login")
        }
        fetchProgress()
    }, [])

    return <div>
        <div class="flex flex-wrap justify-between gap-5 mt-10 ">
            <StreakAndGoalCard data={
                {
                    "Daily Goal": userProgress.selectedGoalInMinutes,
                    "Achived": userProgress.todaysAchivedGoal
                }
            } unit="mins" postCss="" />
            <StreakAndGoalCard data={
                {
                    "Completed Lectures": userProgress.streaks?.longest,
                    "Current streak": userProgress.streaks?.current
                }
            } unit="days" postCss="" />
        </div>

        <div class="flex flex-wrap gap-5 mt-10">
            <StreakAndGoalCard data={{ "Completed Lectures": userProgress.completed?.lectures }} postCss="flex-col" />
            <StreakAndGoalCard data={{ "Completed Quizzes": userProgress.completed?.quizzes }} postCss="flex-col" />
            <StreakAndGoalCard data={{ "Completed Vocabulary": userProgress.completed?.vocabulary }} postCss="flex-col" />
        </div>

        <div class="flex flex-wrap self-center gap-5 mt-10">
            <StreakAndGoalCard data={{
                "Grammer ": userProgress.proficiency?.grammar,
                "Listening": userProgress.proficiency?.listening,
                "Speaking": userProgress.proficiency?.speaking,
                "Vocabulary": userProgress.proficiency?.vocabulary,
                "Writing": userProgress.proficiency?.writing || 0
            }} postCss="text-center" unit={"%"} />

        </div>
    </div>
}

export {
    UserProgress
}