import { app } from "./app.js";
import { connectdb } from "./db/index.js";


connectdb()
.then(() => {
    app.listen(5000, () => {
        console.log("Server listening...");
    })
})
.catch((err) => {
    console.log("Error: While initiating the app",err);
    process.exit(1)    
})
