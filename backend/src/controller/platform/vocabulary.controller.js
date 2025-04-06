import { User } from "../../models/user.models.js";
import { Vocabulary } from "../../models/vocabulary.models.js";

async function getAllUnSolvedVocabularies(req, res) {
    const{email} = req.body;

    if(!email) {
        return res.status(409).json({
            success: false,
            message: "Provide email!"
        })
    }

    
   try {
     const { _id, progress, preferences } = await User.findOne(
         {userId: 'user_' + email}, 
         {progress: true, preferences: true}
     )
     
     if(!progress) {
         return res.status(400).json({   
             success: false,
             message: "Incorrect email"
         })
     }
 
     const vocabularies = await Vocabulary.find(
         { 
             id: { $nin: progress.completed.vocabulary },
             language: preferences.language,
             labels: { $in: preferences.targetLabels  || []},
         },
         { id: 1, word: 1, synonyms: 1, meaning: 1, options: 1, points: 1 }
     )
    
     res.json(vocabularies);    
   } catch (error) {
        console.log("Problem while fetching the unsolved vocabs: ",error);
        
        res.status(400).json({
            success: false,
            message: "Problem while fetching the unsolved vocabs"
        })
   }
}

async function getAllSolvedVocabularies(req, res) {
    const{email} = req.body;

    console.log(req.body);
    
    if(!email) {
        return res.status(409).json({
            success: false,
            message: "Provide email!"
        })
    }

    
   try {
     const { _id, progress } = await User.findOne(
         {userId: 'user_' + email}, 
         {progress: true, preferences: true}
     )
     
     if(!progress) {
         return res.status(400).json({   
             success: false,
             message: "Incorrect email"
         })
     }
 
     const vocabularies = await Vocabulary.find(
         { 
            id: { $in: progress.completed.vocabulary },
         },
         { id: 1, word: 1, synonyms: 1, meaning: 1, options: 1, points: 1 }
     )
    
     res.json(vocabularies);    
   } catch (error) {
        console.log("Problem while fetching the user solved vocabs: ",error);
        
        res.status(400).json({
            success: false,
            message: "Problem while fetching the user unsolved vocabs"
        })
   }
}

export {
    getAllUnSolvedVocabularies,
    getAllSolvedVocabularies
}