// middleware/apiKeyAuth.js
const API_KEY = process.env.API_KEY || "your-default-api-key";

function apiKeyAuth(req, res, next) {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey) {
    return res.status(401).json({ message: "Missing API key." });
  }

  if (clientKey !== API_KEY) {
    return res.status(403).json({ message: "Invalid API key." });
  }

  next();
}

module.exports = apiKeyAuth;
