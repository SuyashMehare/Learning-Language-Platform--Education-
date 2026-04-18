import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            "Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
}

/**
 * Upload a lecture video from an in-memory buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {{ publicId?: string, folder?: string }} [options]
 * @returns {Promise<{ secure_url: string, public_id: string, duration?: number }>}
 */
function uploadLectureVideoFromBuffer(buffer, options = {}) {
    configureCloudinary();
    const { publicId, folder = "lectures" } = options;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "video",
                folder,
                ...(publicId ? { public_id: publicId } : {}),
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
}

/**
 * Best-effort remove of a failed upload (e.g. DB save failed after upload).
 * @param {string} publicId Cloudinary public_id (e.g. lectures/lecture_spanish_greetings)
 */
async function destroyLectureVideo(publicId) {
    if (!publicId) return;
    try {
        configureCloudinary();
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (e) {
        console.error("Cloudinary destroy failed:", e?.message || e);
    }
}

export { uploadLectureVideoFromBuffer, destroyLectureVideo };
