import multer from "multer";

const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500MB

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_VIDEO_BYTES },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed (multipart field: video)"));
        }
    },
});

function lectureVideoUploadMiddleware(req, res, next) {
    upload.single("video")(req, res, (err) => {
        if (!err) {
            return next();
        }
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({
                    success: false,
                    message: "Video file is too large (max 500MB)",
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message || "Video upload failed",
        });
    });
}

export { lectureVideoUploadMiddleware };
