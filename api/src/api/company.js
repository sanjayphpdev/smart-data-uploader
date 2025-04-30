const CompanyService = require("../services/company-service");
module.exports = (app) => {
  const service = new CompanyService();
  app.get("/company/test", async (req, res) => {
    return res.json({ message: "it works" });
  });

  app.post("/company/importdata", async (req, res, next) => {
    try {
      return res.json(req.body);
    } catch (err) {
      next(err);
    }
  });
};
