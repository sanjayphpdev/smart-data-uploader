const path = require("path");

const allowedExtensions = [".xlsx", ".csv"];
const allowedRules = [
  "createNewCompanies",
  "createNewAndUpdateCompanies",
  "createNewAndUpdateCompaniesWithOverwrite",
  "updateExistingCompaniesOnly",
  "updateExistingCompaniesWithOverwrite",
];

function validateUpload(req, res, next) {
  const file = req.file;
  const uploadRule = req.body.upload_rule;

  // Validate file
  if (!file) {
    return res.status(400).json({ message: "File is required." });
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return res
      .status(400)
      .json({ message: "Only .xlsx or .csv files are allowed." });
  }

  // Validate upload_rule
  if (!uploadRule) {
    return res.status(400).json({ message: "upload_rule is required." });
  }

  if (!allowedRules.includes(uploadRule)) {
    return res.status(400).json({ message: "Invalid upload_rule provided." });
  }

  next();
}

module.exports = { validateUpload };
