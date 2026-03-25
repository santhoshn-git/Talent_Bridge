const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");

const hasCloudinaryConfig = Boolean(
  process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET
);

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    if (hasCloudinaryConfig) {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "talentbridge/resumes",
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({
              message: error.message || "Failed to upload resume.",
            });
          }

          return res.json({ url: result.secure_url });
        }
      );

      stream.end(req.file.buffer);
      return;
    }

    const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeOriginalName}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, req.file.buffer);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return res.json({ url: `${baseUrl}/uploads/resumes/${fileName}` });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Failed to upload resume.",
    });
  }
});

module.exports = router;
