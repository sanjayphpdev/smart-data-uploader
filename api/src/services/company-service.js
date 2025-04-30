const { CompanyRepository } = require("../database");
// All Business logic will be here
class CompanyService {
  constructor() {
    this.repository = new CompanyRepository();
  }
}

module.exports = CompanyService;
