const ApiKeyModel = require('../models/api_key.model');

// Inisialisasi tabel API key jika belum ada
exports.initApiKeyTable = async () => {
  try {
    await ApiKeyModel.createTable();
  } catch (error) {
    console.error('Error initializing API key table:', error);
  }
};

// Mendapatkan semua API key
exports.getAllApiKeys = async (req, res) => {
  try {
    const apiKeys = await ApiKeyModel.findAll();
    
    // Jangan tampilkan api_key value di response
    const safeApiKeys = apiKeys.map(key => {
      const { api_key, ...safeKey } = key;
      return safeKey;
    });

    return res.status(200).json(safeApiKeys);
  } catch (error) {
    console.error('Error getting API keys:', error);
    return res.status(500).json({ message: 'Gagal mendapatkan API keys' });
  }
};

// Mendapatkan detail API key
exports.getApiKeyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const apiKey = await ApiKeyModel.findById(id);
    
    if (!apiKey) {
      return res.status(404).json({ message: 'API key tidak ditemukan' });
    }
    
    // Jangan tampilkan api_key value di response
    const { api_key, ...safeKey } = apiKey;
    
    return res.status(200).json(safeKey);
  } catch (error) {
    console.error('Error getting API key:', error);
    return res.status(500).json({ message: 'Gagal mendapatkan API key' });
  }
};

// Membuat API key baru
exports.createApiKey = async (req, res) => {
  try {
    const { name, permissions, expiresAt } = req.body;
    const adminId = req.admin.id; // Dari middleware adminAuth
    
    // Validasi input
    if (!name) {
      return res.status(400).json({ message: 'Nama API key diperlukan' });
    }
    
    // Validasi permissions jika ada
    if (permissions) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ message: 'Permissions harus berupa array' });
      }
      
      const validPermissions = ['read', 'write', 'delete'];
      for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
          return res.status(400).json({ message: `Permission tidak valid: ${permission}` });
        }
      }
    }
    
    // Buat API key baru
    const apiKey = await ApiKeyModel.create({
      name,
      permissions: permissions || ['read'],
      expiresAt: expiresAt || null,
      createdBy: adminId,
    });
    
    // Return dengan key (hanya ditampilkan sekali)
    return res.status(201).json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key, // Tampilkan key hanya sekali saat pembuatan
      permissions: apiKey.permissions,
      expiresAt: apiKey.expiresAt,
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return res.status(500).json({ message: 'Gagal membuat API key: ' + error.message });
  }
};

// Memperbarui API key
exports.updateApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions, expiresAt } = req.body;
    
    // Validasi permissions jika ada
    if (permissions) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ message: 'Permissions harus berupa array' });
      }
      
      const validPermissions = ['read', 'write', 'delete'];
      for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
          return res.status(400).json({ message: `Permission tidak valid: ${permission}` });
        }
      }
    }
    
    // Update API key
    const updatedApiKey = await ApiKeyModel.update(id, {
      name,
      permissions,
      expiresAt,
    });
    
    return res.status(200).json(updatedApiKey);
  } catch (error) {
    console.error('Error updating API key:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'API key tidak ditemukan' });
    }
    
    return res.status(500).json({ message: 'Gagal memperbarui API key: ' + error.message });
  }
};

// Menghapus API key
exports.deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await ApiKeyModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ message: 'API key tidak ditemukan' });
    }
    
    return res.status(200).json({ message: 'API key berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return res.status(500).json({ message: 'Gagal menghapus API key: ' + error.message });
  }
};

// Regenerasi API key
exports.regenerateApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    
    const regeneratedKey = await ApiKeyModel.regenerate(id);
    
    // Return dengan key baru (hanya ditampilkan sekali)
    return res.status(200).json({
      id: regeneratedKey.id,
      name: regeneratedKey.name,
      key: regeneratedKey.key, // Tampilkan key baru hanya sekali
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'API key tidak ditemukan' });
    }
    
    return res.status(500).json({ message: 'Gagal meregenerasi API key: ' + error.message });
  }
};

// Verifikasi API key
exports.verifyApiKey = async (req, res) => {
  try {
    // API key sudah diverifikasi oleh middleware
    return res.status(200).json({
      valid: true,
      permissions: req.apiKey.permissions,
    });
  } catch (error) {
    console.error('Error verifying API key:', error);
    return res.status(500).json({ message: 'Gagal memverifikasi API key: ' + error.message });
  }
};
