const CompanyService = require("../services/company-service");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const { uploadViaMulter } = require("./middleware/multerMiddleWare");
const { validateUpload } = require("./middleware/validateUpload");

module.exports = (app) => {
  const service = new CompanyService();
  app.use(apiKeyAuth);
  app.get("/company/test", async (req, res) => {
    return res.json({ message: "it works" });
  });

  app.post(
    "/company/importdata",
    uploadViaMulter.single("file"),
    validateUpload,
    async (req, res, next) => {
      try {
        const file = req.file;
        const upload_rule = req.body.upload_rule;
        if (!file) return res.status(400).send("No file uploaded");
        const { data } = await service.ParseAndUploadData({
          file,
          upload_rule,
        });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
