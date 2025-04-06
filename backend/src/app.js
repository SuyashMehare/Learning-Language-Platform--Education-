import express from "express";
import { userRouter } from "./routes/user.routes.js";
import { platformRouter } from "./routes/platform.routes.js";
import cors from "cors";

const app = express();
console.log("hitted");

app.use(cors({
    origin: "https://lovely-kheer-efe84f.netlify.app",
}))

app.use(express.json())
// app.get("/api/v1/")
app.use("/api/v1/user", userRouter);
app.use("/api/v1/platform", platformRouter);

// todo: fallback middleware so that not found url handle
export { 
    app 
}