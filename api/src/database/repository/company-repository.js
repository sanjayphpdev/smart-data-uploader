const { CompanyModel } = require("../models");

//Dealing with data base operations
class CompanyRepository {
  async createNewCompanies(companies) {
    const emails = companies.map((c) => c.Email.toLowerCase());
    const existing = await CompanyModel.find({ email: { $in: emails } }).select(
      "email"
    );
    const existingEmails = new Set(existing.map((e) => e.email.toLowerCase()));

    const newCompanies = companies
      .filter((c) => !existingEmails.has(c.Email.toLowerCase()))
      .map((c) => ({
        name: c.Name,
        industry: c.Industry,
        location: c.Location,
        email: c.Email,
        phone: c.Phone,
      }));

    if (newCompanies.length) await CompanyModel.insertMany(newCompanies);

    return {
      successCount: newCompanies.length,
      skipped: companies.length - newCompanies.length,
    };
  }

  async createNewAndUpdateCompanies(companies) {
    const results = { inserted: 0, updated: 0 };
    const emails = companies.map((c) => c.Email.toLowerCase());
    const existingCompanies = await CompanyModel.find({
      email: { $in: emails },
    });

    const existingMap = new Map(
      existingCompanies.map((c) => [c.email.toLowerCase(), c])
    );

    for (const c of companies) {
      const email = c.Email.toLowerCase();
      const existing = existingMap.get(email);

      if (!existing) {
        await CompanyModel.create({
          name: c.Name,
          industry: c.Industry,
          location: c.Location,
          email: c.Email,
          phone: c.Phone,
        });
        results.inserted++;
      } else {
        let changed = false;
        if (!existing.name && c.Name) {
          existing.name = c.Name;
          changed = true;
        }
        if (!existing.industry && c.Industry) {
          existing.industry = c.Industry;
          changed = true;
        }
        if (!existing.location && c.Location) {
          existing.location = c.Location;
          changed = true;
        }
        if (!existing.phone && c.Phone) {
          existing.phone = c.Phone;
          changed = true;
        }
        if (changed) {
          await existing.save();
          results.updated++;
        }
      }
    }

    return results;
  }

  async createNewAndUpdateCompaniesWithOverwrite(companies) {
    const results = { inserted: 0, updated: 0 };

    for (const c of companies) {
      const email = c.Email.toLowerCase();
      const updated = await CompanyModel.findOneAndUpdate(
        { email },
        {
          name: c.Name,
          industry: c.Industry,
          location: c.Location,
          email: c.Email,
          phone: c.Phone,
        },
        { upsert: true, new: true }
      );

      if (updated.isNew) results.inserted++;
      else results.updated++;
    }

    return results;
  }

  async updateExistingCompaniesOnly(companies) {
    let updated = 0;

    const emails = companies.map((c) => c.Email.toLowerCase());
    const existingCompanies = await CompanyModel.find({
      email: { $in: emails },
    });
    const existingMap = new Map(
      existingCompanies.map((c) => [c.email.toLowerCase(), c])
    );

    for (const c of companies) {
      const email = c.Email.toLowerCase();
      const existing = existingMap.get(email);
      if (!existing) continue;

      let changed = false;
      if (!existing.name && c.Name) {
        existing.name = c.Name;
        changed = true;
      }
      if (!existing.industry && c.Industry) {
        existing.industry = c.Industry;
        changed = true;
      }
      if (!existing.location && c.Location) {
        existing.location = c.Location;
        changed = true;
      }
      if (!existing.phone && c.Phone) {
        existing.phone = c.Phone;
        changed = true;
      }

      if (changed) {
        await existing.save();
        updated++;
      }
    }

    return { updated };
  }

  async updateExistingCompaniesWithOverwrite(companies) {
    let updated = 0;

    for (const c of companies) {
      const result = await CompanyModel.findOneAndUpdate(
        { email: c.Email.toLowerCase() },
        {
          name: c.Name,
          industry: c.Industry,
          location: c.Location,
          phone: c.Phone,
        },
        { new: true }
      );

      if (result) updated++;
    }

    return { updated };
  }
}

module.exports = CompanyRepository;
