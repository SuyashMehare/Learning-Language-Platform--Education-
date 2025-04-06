import { User } from "../../models/user.models.js";

function test(req,res) {
    console.log("test");
    console.log(req.body);
    
    res.json("listen")
    return;
}

async function signUpUser(req,res) {
    const{email, preferences: {
        dailyGoalMinutes,
        targetLabels,
        targetCategories,
        difficulty,
        language
    }} = req.body;

    
    if(!email) {
        return res.status(404).json({
            success: false,
            message: "Please provide email id"
        })
    }

    // todo: user is already signed up, redirect to login page

    try {
        const user = await User.create({
            userId: "user_" + email,
            email,
            preferences: {
                language,
                dailyGoalMinutes,
                targetLabels,
                targetCategories,
                difficulty
            },
            progress:{}
        });
    
        console.log(user);
        res.status(200).json({
            success: true,
            message: "User signed up successfully"
        })
    } catch (error) {
        const errorCode = error.errorResponse?.code;
        const errorMessage = error.errorResponse?.errmsg;
        const keyPattern = error.errorResponse?.keyPattern;
        const keyValue = error.errorResponse?.keyValue;

        if(errorCode === 11000){
            return res.status(409).json({ 
                success: false,
                message: "Email already exists" 
            });
        }

        console.log("Error: While signing up the user", 
            {errorCode, errorMessage, "at":{keyPattern, keyValue}}, error);
        
        res.status(500).json({ 
            success: false,
            message: "Something went wrong" 
        })
        
    }
}

async function loginUser(req, res) {
    const{email} = req.body;

    const user = await User.findOne({email});

    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found, please sign up",
        })
    }
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
    })
}

async function getUserProfile(req, res) {
    let{email} = req.body;
    console.log("user progile");
    
   
    const user = await User.aggregate([
        { $match: {email} },
        {
            $lookup: {
                from: "badges",
                localField: "progress.badges",
                foreignField: "_id",
                as: "badgeDetails"
            }
        },
        {
            $project: {
                _id: 0,
                selectedGoalInMinutes: "$preferences.dailyGoalMinutes",
                todaysAchivedGoal: "$progress.trackCurrentDayGoal.completedMinutes",
                streaks: "$progress.streaks",
                badges: {
                    $map: {
                        input: "$badgeDetails",
                        as: "badge",
                        in: { name: "$$badge.name", icon: "$$badge.icon" } // todo: $$
                    }
                },
                completed: {
                    lectures: { $size: "$progress.completed.lectures" },
                    quizzes: { $size: "$progress.completed.quizzes" },
                    vocabulary: { $size: "$progress.completed.vocabulary" },
                },
                proficiency: "$progress.proficiency"

            }
        }
    ])

    res.json(user)
}
export {
    signUpUser,
    loginUser,
    getUserProfile
}