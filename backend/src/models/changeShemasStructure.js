import { connectdb } from "../db/index.js";
import { User } from "./user.models.js";
import mongoose from "mongoose";

async function exec() {
    try {
        await connectdb();
        console.log("✅ Connected to MongoDB Atlas");

        const test = await User.findOne({email:"user3@gmail.com"},{preferences: 1, "progress.completed.quizzes": 1})
        // const result = await User.updateMany(
        //     { "progress.repetition": { $exists: false } },
        //     {
        //       $set: {
        //         "progress.repetition": {
        //           lectures: [],
        //           quizzes: []
        //         }
        //       }
        //     }
        //   );
          
        console.log("Documents Updated:", test);
          
        console.log(`📥 Updated users`);
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

exec()