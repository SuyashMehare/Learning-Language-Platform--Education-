import mongoose from "mongoose";
import { User } from "../../../models/user.models.js";

async function resetDailyGoalMinutes(_id, preferences, progress) {
    let lastUpdateAt = progress.trackCurrentDayGoal.lastUpdateAt;
    let todaysDate = new Date();

    if(lastUpdateAt == todaysDate) {
        return true;
    }

    let goal = preferences.dailyGoalMinutes;
    let minuteWorked = progress.trackCurrentDayGoal.completedMinutes;

    try {
        if(minuteWorked < goal) {
            await User.findOneAndUpdate(
                {_id: new mongoose.Types.ObjectId(_id)},
                { "progress.streaks.current": 0, }
            )
        }
    
        await User.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(_id)},
            {
                $set: {
                    "progress.trackCurrentDayGoal.completedMinutes": 0,
                    "progress.trackCurrentDayGoal.lastUpdateAt": new Date(),
                }
            }
        )
    } catch (error) {
        console.log("Error: While reseting daily goal", error);
        return false;     
    }

    return true;
}

export {
    resetDailyGoalMinutes
}