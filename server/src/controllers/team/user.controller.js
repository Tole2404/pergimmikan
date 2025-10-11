const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../../config/database');
const UserModel = require('../../models/team/user.model');
const ApiError = require('../../utils/apiError');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../public/images/profiles');
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only! (jpeg, jpg, png, gif)'));
  }
}).single('image');

class TeamUserController {
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

      // Log login attempt
      await UserModel.logLogin({
        user_id: user.id,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        status: 'success'
      });

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
          role_id: user.role_id,
          role_name: user.role_name,
          image_url: user.image_url,
          bio: user.bio
        }
      });
    } catch (error) {
      // Log failed login attempt if username exists
      if (error.statusCode === 401 && req.body.username) {
        const user = await UserModel.findByUsername(req.body.username);
        if (user) {
          await UserModel.logLogin({
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            status: 'failed'
          });
        }
      }
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      delete user.password;
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      // Hanya ambil field yang dikirim dalam request body
      const userData = {};
      if (req.body.hasOwnProperty('full_name')) userData.full_name = req.body.full_name;
      if (req.body.hasOwnProperty('bio')) userData.bio = req.body.bio;
      if (req.body.hasOwnProperty('email')) userData.email = req.body.email;
      
      // Jika tidak ada data yang dikirim, kembalikan error
      if (Object.keys(userData).length === 0) {
        return res.status(400).json({ message: 'No data provided for update' });
      }

      const success = await UserModel.update(req.user.id, userData);

      if (!success) {
        throw new ApiError(404, 'User not found');
      }

      // Get updated user data
      const updatedUser = await UserModel.findById(req.user.id);
      delete updatedUser.password;

      res.json({ 
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProfileImage(req, res, next) {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(400, `Upload error: ${err.message}`));
      } else if (err) {
        return next(new ApiError(400, err.message));
      }

      try {
        if (!req.file) {
          throw new ApiError(400, 'No image file provided');
        }

        const imageUrl = `/images/profiles/${req.file.filename}`;
        
        // Update profile image
        const success = await UserModel.updateProfileImage(req.user.id, imageUrl);
        
        if (!success) {
          throw new ApiError(404, 'User not found');
        }

        // Get updated user data
        const updatedUser = await UserModel.findById(req.user.id);
        if (!updatedUser) {
          throw new ApiError(404, 'User not found');
        }

        delete updatedUser.password;

        res.json({
          message: 'Profile image updated successfully',
          user: updatedUser
        });
      } catch (error) {
        // Delete uploaded file if there's an error
        if (req.file) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
        next(error);
      }
    });
  }

  async getProfileImages(req, res, next) {
    try {
      const images = await UserModel.getProfileImages(req.user.id);
      res.json(images);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Validate current password
      const isValidPassword = await UserModel.validatePassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new ApiError(401, 'Current password is incorrect');
      }

      // Update password
      await UserModel.changePassword(req.user.id, newPassword);

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req, res, next) {
    try {
      // Default stats if tables don't exist yet
      const stats = {
        journeys: 0,
        activities: 0,
        events: 0
      };

      try {
        // Get stats from various tables
        const [
          journeyStats,
          activityStats,
          eventStats
        ] = await Promise.all([
          db.execute('SELECT COUNT(*) as count FROM journeys WHERE user_id = ?', [req.user.id])
            .catch(() => [[{ count: 0 }]]),
          db.execute('SELECT COUNT(*) as count FROM activities WHERE user_id = ?', [req.user.id])
            .catch(() => [[{ count: 0 }]]),
          db.execute('SELECT COUNT(*) as count FROM events WHERE user_id = ?', [req.user.id])
            .catch(() => [[{ count: 0 }]])
        ]);

        stats.journeys = journeyStats[0][0].count;
        stats.activities = activityStats[0][0].count;
        stats.events = eventStats[0][0].count;
      } catch (dbError) {
        console.error('Error getting stats:', dbError);
        // Continue with default stats
      }

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamUserController();
