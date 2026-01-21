const multer = require("multer");
const multerStorageCloudinary = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const CloudinaryStorage =
  multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "events_images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const upload = multer({ storage });

module.exports = upload;