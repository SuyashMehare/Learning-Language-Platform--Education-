import mongoose from "mongoose";
import { Badge } from "../../models/badges.models.js";
import { User } from "../../models/user.models.js"
import { resetDailyGoalMinutes } from "./helpers/resetDailyGoalMinutes.js";
import { Quiz } from "../../models/quiz.models.js";

async function onLectureComplete(req, res) {
    const { email, lectureId, points, duration } = req.body

    const { _id, progress, preferences } = await User.findOne(
        { userId: 'user_' + email },
        { progress: 1, preferences: 1 }
    ).lean()

    if (progress.completed.lectures.includes(lectureId)) {
        return res.status(400).json({
            success: false,
            message: "Lecture already marked as completed"
        })
    }

    if (!await resetDailyGoalMinutes(_id, preferences, progress)) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

    // user-> completed lect, points to lect, update daily goals->update daily straks, check badge,  
    // note: along with lectures also send completed lectures for all lecture send
    // note: remove .pre bz very early progess points of total deciding factor for badges 

    /**
     * 2. totalMinutesWork = prorgess.trackCurrentDayGoal.completedMinutes += duration
     * 3. totalCompletedLect = prorgess.completed.lectures.push(lectureId).length  + 1 | x2 push, get length
     * 4. totalPoints = progress.points.total + lecturePoints
     * 5. progress.points.lectures += lecturePoints
     * 
     * logic:
     * if(totalMinutesWork >= preferences.dailyGoalMinutes) {
     *  preferences.streaks.current ++
     * }
     * 
     * 
     * if(preferences.streaks.current > preferences.streaks.longest){
     *  preferences.streaks.longest++;
     * }
     * 
     * badges: totalPoints, totalCompletedLect, streaks (when break longest streak)
     * 
     */
    const totalMinutesWork = progress.trackCurrentDayGoal.completedMinutes + (Math.floor(duration / 60));
    const totalPoints = progress.points.total + points;
    const totalCompletedLect = progress.completed.lectures.length + 1;
    let gotACurrentStreak = 0, gotALongestStreak = 0;


    const findBadgesFor = ['lectures', 'points'];

    if (totalMinutesWork >= preferences.dailyGoalMinutes) { // update current strak o
        gotACurrentStreak = 1;
    }

    if (progress.streaks.current + gotACurrentStreak > progress.streaks.longest) {
        findBadgesFor.push('streaks');
        gotALongestStreak = 1;
    }


    //todo
    const badges = await Badge.find({
        $or: [
            { "criteria.type": "lectures", "criteria.threshold": { $lte: totalCompletedLect } },
            { "criteria.type": "points", "criteria.threshold": { $lte: totalPoints } },
            { "criteria.type": "streaks", "criteria.threshold": { $lte: progress.streaks.current + gotACurrentStreak } }
        ]
    });


    const updatedUser = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
            $inc: {
                "progress.trackCurrentDayGoal.completedMinutes": Math.floor(duration / 60),
                "progress.streaks.current": gotACurrentStreak,
                "progress.streaks.longest": gotALongestStreak,
                "progress.points.lectures": points,
                "progress.points.total": points
            },
            $addToSet: {
                "progress.completed.lectures": lectureId,
                "progress.badges": { $each: badges }
            }
        },
        { new: true }
    );

    res.json(updatedUser)
}

async function onQuizSubmit(req, res) {
    const { quizId, email, points, isAnswerCorrect } = req.body;

    // todo: write in one tx or use aggregate pipeline
    try {
        let updatedUser;
    
        if (isAnswerCorrect) {
            updatedUser = await User.findOneAndUpdate(
                { email },
                {
                    $inc: {
                        "progress.points.total": points,
                        "progress.points.quizzes": points,
                    },
                    $addToSet: {
                        "progress.completed.quizzes": quizId
                    },
                    $pull: {
                        "progress.repetition.quizzes": quizId
                    }
                },
                { new: true }
            );  
        } else {
            updatedUser = await User.findOneAndUpdate(
                { email },
                {
                    $addToSet: {
                        "progress.repetition.quizzes": quizId
                    },
                    $pull: {
                        "progress.completed.quizzes": quizId
                    }
                },
                { new:true }
            );
        }
    

        const completedQuizzes = updatedUser.progress.completed?.quizzes || [];
        const repetitionQuizzes = updatedUser.progress.repetition?.quizzes || [];

        const totalAttempted = completedQuizzes.length + repetitionQuizzes.length;
        const proficiencyPoints = completedQuizzes.length/totalAttempted;

        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    "progress.proficiency.grammar": Number.parseFloat(proficiencyPoints < 0 ? 0 : proficiencyPoints * 100).toFixed(2)
                }
            }
        )
    
        res.status(200).json({
            success: true,
            message: "Updated user proficiency points"
        })
    } catch (error) {
        console.log("Error: While handling the quiz submission", error);
        res.status(500).json( {
            success: false,
            message: "Error while quiz submission"
        })
        
    }
}

async function onSubmitVocabulary(req, res) {
    const{vocabularyId, email, points, isAnswerCorrect} = req.body;

    try {
        let updatedUser;
        if (isAnswerCorrect) {
            updatedUser = await User.findOneAndUpdate(
                { email },
                {
                    $inc: {
                        "progress.points.total": points,
                        "progress.points.vocabulary": points,
                    },
                    $addToSet: {
                        "progress.completed.vocabulary": vocabularyId
                    },
                    $pull: {
                        "progress.repetition.vocabulary": vocabularyId
                    }
                },
                { new: true }
            );  
        }else {
            updatedUser = await User.findOneAndUpdate(
                { email },
                {
                    $addToSet: {
                        "progress.repetition.vocabulary": vocabularyId
                    },
                    $pull: {
                        "progress.completed.vocabulary": vocabularyId
                    }
                },
                { new:true }
            );
        }
        
        const completedVocabulary = updatedUser.progress.completed?.vocabulary || [];
        const repetitionVocabulary = updatedUser.progress.repetition?.vocabulary || [];
    
        const totalAttempted = completedVocabulary.length + repetitionVocabulary.length;
        const proficiencyPoints = completedVocabulary.length/totalAttempted;
    
        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    "progress.proficiency.vocabulary": 
                    Number.parseFloat(proficiencyPoints < 0 ? 0 : proficiencyPoints * 100).toFixed(2)
                }
            }
        )
        
        res.status(200).json({
            success: true,
            message: "Updated user proficiency points"
        })
    
    } catch (error) {
        console.log("Error: While handling the vocabulary submission", error);
        res.status(500).json( {
            success: false,
            message: "Error while vocabulary submission"
        })
    }
   
}

export {
    onLectureComplete,
    onQuizSubmit,
    onSubmitVocabulary
}