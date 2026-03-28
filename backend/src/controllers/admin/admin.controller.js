import { Admin } from "../../models/admin.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function signUpAdmin(req, res) {
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
    // TODO: Implement lecture upload with metadata
}

async function updateLecture(req, res) {
    // TODO: Implement lecture update
}

async function deleteLecture(req, res) {
    // TODO: Implement lecture deletion
}

export { signUpAdmin, loginAdmin, getAdminProfile, uploadLecture, updateLecture, deleteLecture };
