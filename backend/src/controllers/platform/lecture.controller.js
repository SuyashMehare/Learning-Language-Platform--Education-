import { Lecture } from "../../models/lecture.models.js";
import { User } from "../../models/user.models.js";


async function getAllLectures(req, res) {
    const {email} = req.body;
    try {
        const user = await User.findOne(
            {userId: "user_" + email}, 
            {preferences: true}
        )

        let filters = {};
        if(user.preferences) {
            filters.language = user.preferences.language;
        }
        
        const lectures = await Lecture.find({
            ...filters,
            $or: [
                { categories: { $in: preferences.targetCategories } },
                { labels: { $in: preferences.targetLabels } || []},
            ]
            
        }, {
            _id: false,
            lectureId:true,
            name: true,
            videoUrl: true,
            quizzes: true,
            duration: true,
            points: true,
            categories: true,
        }).sort({difficulty: 1})
        
        res.json(lectures)
    } catch (error) {
        console.log(error);
    }
}

export {
    getAllLectures,
}