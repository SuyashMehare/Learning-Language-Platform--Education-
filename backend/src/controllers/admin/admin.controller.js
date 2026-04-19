import { Admin } from "../../models/admin.models.js";
import { Lecture } from "../../models/lecture.models.js";
import { CATEGORIES, DIFFICULTIES, LABELS } from "../../models/enums.js";
import {
    uploadLectureVideoFromBuffer,
    destroyLectureVideo,
} from "../../services/cloudinary/cloudinary.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";

const DEFAULT_POINTS_FOR_DIFFICULTY = {
    A1: 10,
    A2: 13,
    B1: 16,
    B2: 21,
    C1: 25,
    C2: 29,
};

function randomAlpha(len) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const bytes = crypto.randomBytes(len);
    let s = "";
    for (let i = 0; i < len; i++) s += alphabet[bytes[i] % 26];
    return s;
}

function slugSecondSegmentFromName(name) {
    const s = String(name)
        .toLowerCase()
        .replace(/[^a-z]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/_+/g, "_");
    return (s || "untitled").slice(0, 64);
}

async function generateUniqueLectureId(name) {
    const tail = slugSecondSegmentFromName(name);
    for (let attempt = 0; attempt < 8; attempt++) {
        const id = `lecture_${randomAlpha(6)}_${tail}`;
        const exists = await Lecture.findOne({ lectureId: id }).lean();
        if (!exists) return id;
    }
    const id = `lecture_${randomAlpha(8)}_${randomAlpha(6)}_${tail.slice(0, 48)}`;
    const exists = await Lecture.findOne({ lectureId: id }).lean();
    if (!exists) return id;
    throw new Error("Could not generate a unique lectureId");
}

function parseStringList(value) {
    if (value === undefined || value === null) {
        return [];
    }
    if (Array.isArray(value)) {
        return value.map(String).map((s) => s.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            return [];
        }
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map(String).map((s) => s.trim()).filter(Boolean);
            }
        } catch {
            /* comma-separated */
        }
        return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
}

async function signUpAdmin(req, res) {
    console.log("sign up admin");

    const { email, password, firstName, lastName, role = 'admin' } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            message: "Please provide email, password, firstName, and lastName"
        });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long"
        });
    }

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const admin = await Admin.create({
            adminId: "admin_" + email,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role === 'super_admin' ? 'super_admin' : 'admin',
            permissions: ['create_lecture', 'edit_lecture', 'delete_lecture', 'create_quiz', 'edit_quiz', 'delete_quiz', 'manage_users']
        });

        // Return success response without password
        const adminData = admin.toObject();
        delete adminData.password;

        // Issue JWT
        const token = jwt.sign({ adminId: admin.adminId, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: "Admin signed up successfully",
            data: adminData,
            token
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Error during signup",
            error: error.message
        });
    }
}

async function loginAdmin(req, res) {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        });
    }

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "This admin account is inactive"
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Return success response without password
        const adminData = admin.toObject();
        delete adminData.password;

        // Issue JWT
        const token = jwt.sign({ adminId: admin.adminId, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            data: adminData,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Error during login",
            error: error.message
        });
    }
}

async function getAdminProfile(req, res) {
    const adminId = req.body?.adminId || req.user?.adminId || (req.user?.email ? 'admin_' + req.user.email : undefined);

    if (!adminId) {
        return res.status(400).json({
            success: false,
            message: "Please provide adminId or authenticate"
        });
    }

    try {
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const adminData = admin.toObject();
        delete adminData.password;

        res.status(200).json({
            success: true,
            data: adminData
        });

    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message
        });
    }
}

async function uploadLecture(req, res) {
    if (!req.file?.buffer?.length) {
        return res.status(400).json({
            success: false,
            message:
                "Video file is required. Send multipart/form-data with field name \"video\".",
        });
    }

    const {
        name,
        language,
        difficulty,
        points: pointsRaw,
        categories: categoriesRaw,
        labels: labelsRaw,
        quizzes: quizzesRaw,
    } = req.body;

    if (name === undefined || name === null || String(name).trim() === "") {
        return res.status(400).json({
            success: false,
            message:
                "Required: name and video file. Duration comes from the uploaded video (Cloudinary). Optional: language (es|en), difficulty, points, categories, labels, quizzes (ObjectId list). lectureId is assigned by the server.",
        });
    }

    const trimmedName = String(name).trim();

    let languageResolved = "es";
    if (language !== undefined && language !== null && String(language).trim() !== "") {
        const l = String(language).trim();
        if (l !== "es" && l !== "en") {
            return res.status(400).json({
                success: false,
                message: 'language must be "es" or "en"',
            });
        }
        languageResolved = l;
    }

    let difficultyResolved = "A1";
    if (difficulty !== undefined && difficulty !== null && String(difficulty).trim() !== "") {
        const d = String(difficulty).trim();
        if (!DIFFICULTIES.includes(d)) {
            return res.status(400).json({
                success: false,
                message: `difficulty must be one of: ${DIFFICULTIES.join(", ")}`,
            });
        }
        difficultyResolved = d;
    }

    let points;
    if (pointsRaw === undefined || pointsRaw === null || String(pointsRaw).trim() === "") {
        points = DEFAULT_POINTS_FOR_DIFFICULTY[difficultyResolved];
    } else {
        points = Number(pointsRaw);
        if (!Number.isInteger(points)) {
            return res.status(400).json({
                success: false,
                message:
                    "points must be an integer in the allowed range for the chosen difficulty (see schema).",
            });
        }
    }

    const categories = parseStringList(categoriesRaw);
    const badCategory = categories.find((c) => !CATEGORIES.includes(c));
    if (badCategory) {
        return res.status(400).json({
            success: false,
            message: `Invalid category: ${badCategory}.`,
        });
    }

    const labels = parseStringList(labelsRaw);
    const badLabel = labels.find((l) => !LABELS.includes(l));
    if (badLabel) {
        return res.status(400).json({
            success: false,
            message: `Invalid label: ${badLabel}.`,
        });
    }

    const quizIdStrings = parseStringList(quizzesRaw);
    for (const qid of quizIdStrings) {
        if (!mongoose.Types.ObjectId.isValid(qid)) {
            return res.status(400).json({
                success: false,
                message: `Invalid quiz ObjectId: ${qid}`,
            });
        }
    }

    try {
        let trimmedLectureId;
        try {
            trimmedLectureId = await generateUniqueLectureId(trimmedName);
        } catch (genErr) {
            console.error("lectureId generation error:", genErr);
            return res.status(500).json({
                success: false,
                message: "Could not generate a unique lecture id.",
                error: genErr.message,
            });
        }

        let cloudResult;
        try {
            cloudResult = await uploadLectureVideoFromBuffer(req.file.buffer, {
                publicId: trimmedLectureId,
                folder: "lectures",
            });
        } catch (cloudErr) {
            console.error("Cloudinary upload error:", cloudErr);
            return res.status(502).json({
                success: false,
                message: "Video upload to storage failed.",
                error: cloudErr.message,
            });
        }

        const durationSeconds = Number(cloudResult.duration);
        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
            await destroyLectureVideo(cloudResult.public_id);
            return res.status(502).json({
                success: false,
                message:
                    "Video was uploaded but duration metadata was not returned; cannot save lecture. Try re-uploading or a different format.",
            });
        }
        const duration = Math.round(durationSeconds * 100) / 100;

        try {
            const lecture = await Lecture.create({
                lectureId: trimmedLectureId,
                language: languageResolved,
                name: trimmedName,
                videoUrl: cloudResult.secure_url,
                quizzes: quizIdStrings,
                categories,
                labels,
                duration,
                difficulty: difficultyResolved,
                points,
            });

            const payload = lecture.toObject();
            return res.status(201).json({
                success: true,
                message: "Lecture uploaded and created successfully.",
                data: payload,
                cloudinary: {
                    publicId: cloudResult.public_id,
                    duration: cloudResult.duration,
                },
            });
        } catch (dbErr) {
            await destroyLectureVideo(cloudResult.public_id);
            if (dbErr.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "A lecture with this id already exists.",
                });
            }
            if (dbErr.name === "ValidationError") {
                const messages = Object.values(dbErr.errors || {}).map(
                    (e) => e.message
                );
                return res.status(400).json({
                    success: false,
                    message: "Validation failed.",
                    errors: messages.length ? messages : [dbErr.message],
                });
            }
            console.error("Lecture create error:", dbErr);
            return res.status(500).json({
                success: false,
                message: "Could not save lecture after upload.",
                error: dbErr.message,
            });
        }
    } catch (error) {
        console.error("uploadLecture error:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected error while creating lecture.",
            error: error.message,
        });
    }
}

async function getAllLectures(req, res) {
    try {
        const lectures = await Lecture.find({}, {
            _id: false,
            lectureId: true,
            name: true,
            videoUrl: true,
            quizzes: true,
            duration: true,
            points: true,
            categories: true,
            labels: true,
            difficulty: true,
            language: true,
            createdAt: true,
            updatedAt: true,
        }).sort({ createdAt: -1 });
        res.json(lectures);
    } catch (error) {
        console.error("getAllLectures error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching lectures",
            error: error.message
        });
    }
}

async function updateLecture(req, res) {
    // TODO: Implement lecture update
}

async function deleteLecture(req, res) {
    // TODO: Implement lecture deletion
}

export { signUpAdmin, loginAdmin, getAdminProfile, uploadLecture, updateLecture, deleteLecture, getAllLectures };
