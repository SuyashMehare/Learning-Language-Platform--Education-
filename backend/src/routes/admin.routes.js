import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { lectureVideoUploadMiddleware } from "../middleware/lectureUpload.middleware.js";
import { signUpAdmin, loginAdmin, getAdminProfile, uploadLecture, updateLecture, deleteLecture, getAllLectures } from "../controllers/admin/admin.controller.js";

const route = Router();

route.post("/signup", signUpAdmin);
route.post("/login", loginAdmin);
route.post("/profile",  getAdminProfile);

// Lecture Management Endpoints (Admin only)
route.post(
    "/lectures",
    // authenticateJWT,
    // authorizeRoles("admin", "super_admin"),
    lectureVideoUploadMiddleware,
    uploadLecture
);
route.put("/lectures/:id",  updateLecture);
route.delete("/lectures/:id",  deleteLecture);


route.get("/lectures",  getAllLectures);

export { route as adminRouter };
