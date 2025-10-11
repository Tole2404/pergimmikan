const ApiKeyModel = require("../models/api_key.model");

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key diperlukan" });
    }

    const apiKeyData = await ApiKeyModel.findByKey(apiKey);

    if (!apiKeyData) {
      return res.status(401).json({ message: "API key tidak valid" });
    }

    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return res.status(401).json({ message: "API key sudah kedaluwarsa" });
    }

    await ApiKeyModel.updateLastUsed(apiKeyData.id);

    req.apiKey = apiKeyData;

    next();
  } catch (error) {
    console.error("API key auth error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat autentikasi API key: " + error.message });
  }
};

module.exports = apiKeyAuth;
