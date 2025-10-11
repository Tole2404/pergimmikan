const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const ApiError = require('../utils/apiError');

class UserController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        throw new ApiError(400, 'Username and password are required');
      }

      // Find user by username
      const user = await UserModel.findByUsername(username);
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }

      // Check if account is active
      if (user.status === 'inactive') {
        throw new ApiError(401, 'Account is inactive');
      }

      // Validate password
      const isValidPassword = await UserModel.validatePassword(password, user.password);
      if (!isValidPassword) {
        throw new ApiError(401, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          role_id: user.role_id 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove sensitive data
      delete user.password;

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          role_id: user.role_id
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      delete user.password;
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { username, password, email, full_name, role_id } = req.body;

      // Check if username already exists
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        throw new ApiError(400, 'Username already exists');
      }

      // Data dasar untuk user baru
      const userData = {
        username,
        password,
        email,
        full_name,
        role_id,
        status: 'active'
      };

      // Jika ada file gambar yang diupload
      if (req.file) {
        // Simpan path gambar relatif ke database
        const relativePath = `/images/profiles/${req.file.filename}`;
        userData.image_url = relativePath;
      } else {
        // Gunakan gambar default jika tidak ada upload
        userData.image_url = '/images/profiles/default-avatar.jpg';
      }

      // Create new user
      const userId = await UserModel.create(userData);

      res.status(201).json({
        message: 'User created successfully',
        userId
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, full_name, role_id, status } = req.body;
      
      // Data dasar yang akan diupdate
      const userData = {
        username,
        email,
        full_name,
        role_id,
        status
      };
      
      // Jika ada file gambar yang diupload
      if (req.file) {
        // Simpan path gambar relatif ke database
        const relativePath = `/images/profiles/${req.file.filename}`;
        userData.image_url = relativePath;
      }

      const success = await UserModel.update(id, userData);

      if (!success) {
        throw new ApiError(404, 'User not found');
      }

      res.json({ message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const success = await UserModel.delete(id);

      if (!success) {
        throw new ApiError(404, 'User not found');
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const success = await UserModel.changePassword(id, newPassword);
      if (!success) {
        throw new ApiError(404, 'User not found');
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req, res, next) {
    try {
      const roles = await UserModel.getAllRoles();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  }

  // Mendapatkan profil user yang sedang login berdasarkan token JWT
  async getUserProfile(req, res, next) {
    try {
      // Ambil ID dari user yang login (dari decoded JWT token)
      const userId = req.user.id;
      
      console.log('Get profile for user ID:', userId);
      
      const user = await UserModel.findById(userId);
      
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      delete user.password;
      res.json(user);
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      next(error);
    }
  }

  // Update Telegram ID
  async updateTelegram(req, res, next) {
    try {
      const userId = req.user.id;
      const { telegram_id, telegram_username } = req.body;

      console.log('[Update Telegram] User ID:', userId);
      console.log('[Update Telegram] Telegram ID:', telegram_id);

      // Validate input
      if (!telegram_id || !telegram_id.trim()) {
        throw new ApiError(400, 'Telegram ID is required');
      }

      // Check if telegram_id already used by another user
      const existingUser = await UserModel.findByTelegramId(telegram_id.trim());
      if (existingUser && existingUser.id !== userId) {
        throw new ApiError(400, 'Telegram ID already linked to another account');
      }

      // Update telegram ID
      const updated = await UserModel.updateTelegramId(
        userId, 
        telegram_id.trim(), 
        telegram_username ? telegram_username.trim() : null
      );

      if (!updated) {
        throw new ApiError(500, 'Failed to update Telegram ID');
      }

      // Get updated user
      const user = await UserModel.findById(userId);
      delete user.password;

      console.log('[Update Telegram] Success for user:', user.username);

      res.json({
        message: 'Telegram linked successfully',
        user
      });
    } catch (error) {
      console.error('[Update Telegram] Error:', error);
      next(error);
    }
  }
}

module.exports = new UserController();
