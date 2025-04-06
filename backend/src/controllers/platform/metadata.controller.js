import { CATEGORIES, DIFFICULTIES, LABELS } from "../../models/enums.js";

async function getMetaData(req, res) {
    const{email} = req.body;

    if(email) {
        // get user metadata and return
    }

    res.status(200).json({
        success: true,
        data: {
           metadata: {
            categories: CATEGORIES,
            difficulty: DIFFICULTIES,
            labels: LABELS
           }
        }    
    })
}

export {
    getMetaData
}