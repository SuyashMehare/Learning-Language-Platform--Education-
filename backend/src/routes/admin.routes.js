import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { signUpAdmin, loginAdmin, getAdminProfile } from "../controllers/admin/admin.controller.js";

const route = Router();

route.post("/signup", signUpAdmin);
route.post("/login", loginAdmin);
route.post("/profile", authenticateJWT, authorizeRoles('admin', 'super_admin'), getAdminProfile);

export { route as adminRouter };
