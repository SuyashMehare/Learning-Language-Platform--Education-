import dotenv from "dotenv";
import { app } from "./app.js";
import { connectdb } from "./db/index.js";
dotenv.config()


connectdb()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server listening at port",process.env.PORT);
    })
})
.catch((err) => {
    console.log("Error: While initiating the app",err);
    process.exit(1)    
})
