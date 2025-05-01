const { CompanyRepository } = require("../database");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("node:fs");
const path = require("node:path");
const { FormateData } = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-errors");
// All Business logic will be here
class CompanyService {
  constructor() {
    this.repository = new CompanyRepository();
  }

  async ParseAndUploadData(userInput) {
    const { file, upload_rule } = userInput;
    try {
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".csv") {
        const results = [];
        const parser = fs.createReadStream(file.path).pipe(csv());
        for await (const record of parser) {
          results.push(record);
        }
        fs.unlinkSync(file.path); //remove file after processing
        const response = await this.performDBOperationByRule(
          results,
          upload_rule
        );
        return FormateData(response);
      } else {
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const results = xlsx.utils.sheet_to_json(sheet);
        fs.unlinkSync(file.path); //remove file after processing
        const response = await this.performDBOperationByRule(
          results,
          upload_rule
        );
        return FormateData(response);
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      throw new APIError("Fail to import data", error.message);
    }
  }

  async performDBOperationByRule(data, rule) {
    if (!data || !rule) return false;
    let dbResponse = {};
    switch (rule) {
      case "createNewCompanies":
        dbResponse = await this.repository.createNewCompanies(data);
        break;
      case "createNewAndUpdateCompanies":
        dbResponse = await this.repository.createNewAndUpdateCompanies(data);
        break;
      case "createNewAndUpdateCompaniesWithOverwrite":
        dbResponse =
          await this.repository.createNewAndUpdateCompaniesWithOverwrite(data);
        break;
      case "updateExistingCompaniesOnly":
        dbResponse = await this.repository.updateExistingCompaniesOnly(data);
        break;
      case "updateExistingCompaniesWithOverwrite":
        dbResponse = await this.repository.updateExistingCompaniesWithOverwrite(
          data
        );
        break;
    }
    return dbResponse;
  }
}

module.exports = CompanyService;
