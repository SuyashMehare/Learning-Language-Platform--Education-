import express from "express";
import { userRouter } from "./routes/user.routes.js";
import { platformRouter } from "./routes/platform.routes.js";
import cors from "cors";

const app = express();
console.log("hitted");

// var corsOptions = {
//     origin: 'http://example.com',
// }
app.use(cors())
app.use(express.json())
// app.get("/api/v1/")
app.use("/api/v1/user", userRouter);
app.use("/api/v1/platform", platformRouter);

// todo: fallback middleware so that not found url handle
export { 
    app 
}