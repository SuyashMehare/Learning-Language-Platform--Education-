import mongoose from "mongoose";

async function connectdb() {        
    try {       
        console.log("db connected at URI,",process.env.URI);
        
        const db  = await mongoose.connect(process.env.URI);
        console.log("Connected to db");
    } catch (error) {
        console.log("ERROR: While connecting to db",error);
        process.exit(1);
    }
}

export {
    connectdb
}