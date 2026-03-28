import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { signUpAdmin, loginAdmin, getAdminProfile, uploadLecture, updateLecture, deleteLecture } from "../controllers/admin/admin.controller.js";

const route = Router();

route.post("/signup", signUpAdmin);
route.post("/login", loginAdmin);
route.post("/profile", authenticateJWT, authorizeRoles('admin', 'super_admin'), getAdminProfile);

// Lecture Management Endpoints (Admin only)
route.post("/lectures", authenticateJWT, authorizeRoles('admin', 'super_admin'), uploadLecture);
route.put("/lectures/:id", authenticateJWT, authorizeRoles('admin', 'super_admin'), updateLecture);
route.delete("/lectures/:id", authenticateJWT, authorizeRoles('admin', 'super_admin'), deleteLecture);

export { route as adminRouter };
