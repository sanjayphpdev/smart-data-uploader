const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");
// Configure Multer for file uploads (store in 'uploads' directory)
const uploadPath = path.resolve(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".csv" || ext === ".xls" || ext === ".xlsx") {
    cb(null, true);
  } else {
    cb(new Error("Only .csv, .xls, or .xlsx files allowed"), false);
  }
};

const uploadViaMulter = multer({ storage, fileFilter });

module.exports = {
  uploadViaMulter,
};
