const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema(
  {
    name: String,
    industry: String,
    location: String,
    phone: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("company", CompanySchema);
