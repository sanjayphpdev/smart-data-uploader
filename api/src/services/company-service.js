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

  validData(data) {
    // Email: required + valid format
    if (!data.Email) {
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
      return false;
    }

    // Phone: optional but must be 10-digit number if present
    if (data.Phone) {
      const cleaned = data.Phone.toString().replace(/\D/g, ""); // remove non-digits
      if (!/^\d{10}$/.test(cleaned)) {
        //errors.Phone = "Phone number must be exactly 10 digits.";
        return false;
      }
    }
    return true;
  }

  async ParseAndUploadData(userInput) {
    const { file, upload_rule } = userInput;
    try {
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".csv") {
        const results = [];
        const parser = fs.createReadStream(file.path).pipe(csv());
        for await (const record of parser) {
          if (this.validData(record)) {
            results.push(record);
          }
        }
        fs.unlinkSync(file.path); //remove file after processing
        const response = await this.performDBOperationByRule(
          results,
          upload_rule
        );
        return FormateData(response);
      } else {
        const results = [];
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        fs.unlinkSync(file.path); //remove file after processing
        rows.forEach((row, index) => {
          if (this.validData(row)) {
            results.push(row);
          }
        });

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
