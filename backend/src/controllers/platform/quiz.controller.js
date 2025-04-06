import { Quiz } from "../../models/quiz.models.js";
import { User } from "../../models/user.models.js";


// todo: error not handled
async function getAllInLectureQuizzes(req, res) {
    let  {quizIds} = req.body;

    const quizzes = await Quiz.find(
        {_id: {$in: quizIds}}, 
        {id:1, question: 1, answer: 1, options: 1, feedback: 1, }
    ).lean(); // todo:

    res.json(quizzes)
}


// reason: when user not request quizes via lecutures
async function getAllRandomQuizzes(req, res) {
    const{ email } = req.body;

    if(!email) {
        return res.status(409).json({
            success: false,
            message: "Provide email"
        })
    }

    try {
        const { progress, preferences: {
            targetLabels,
            targetCategories,
            difficulty,
            language
        }} = await User.findOne({email},{preferences: 1, "progress.completed.quizzes": 1});
        
    
        // todo: find alternative
        const minRequiredPoints = { 'A1': 5,'A2': 8,'B1': 11,'B2': 14,'C1': 17,'C2': 20 }
    
        const quizzes = await Quiz.find({ 
            language,
            points: { $gte: minRequiredPoints[difficulty] || 0 },
            id: { $nin: progress.completed.quizzes || [] },
            $or: [
                { categories: { $in: targetCategories} || []},
                { labels: { $in: targetLabels} || []},  
            ],
        },{id:1, question: 1, answer: 1, options: 1, feedback: 1, points: 1})
        .lean().limit(20)
    

        if(quizzes.length == 0){
            const quizes = await Quiz.find({language},
            {id:1, question: 1, answer: 1, options: 1, feedback: 1, points: 1})
            .lean().limit(20)


            return res.status(200)
            .json(quizes);
        }

        return res.json(quizzes)
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({
            success:false, messsage: "Something went wrong..."
        })   
    }
}




export {
    getAllInLectureQuizzes,
    getAllRandomQuizzes
}