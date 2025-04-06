import mongoose from "mongoose";
const URI = "mongodb+srv://suyash:suyashAdmin@masaicluster.hsmnxex.mongodb.net/llp"


async function connectdb() {        
    try {
        const db  = await mongoose.connect(URI);
        console.log("Connected to db");
    } catch (error) {
        console.log("ERROR: While connecting to db",error);
        process.exit(1);
    }
}

export {
    connectdb
}