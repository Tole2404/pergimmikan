const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin.model");
const ApiError = require("../utils/apiError");
const Savings = require("../models/savings.model");
const TelegramService = require("../services/telegram.service");

class AdminController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
      }

      const admin = await AdminModel.findByUsername(username);
      if (!admin) {
        throw new ApiError(401, "Invalid credentials");
      }

      if (admin.status === "inactive") {
        throw new ApiError(401, "Account is inactive");
      }

      const isValidPassword = await AdminModel.validatePassword(password, admin.password);
      if (!isValidPassword) {
        throw new ApiError(401, "Invalid credentials");
      }

      const token = jwt.sign(
        {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      delete admin.password;

      res.json({
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nama_lengkap: admin.nama_lengkap,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    res.json({ message: "Logout successful" });
  }

  async getProfile(req, res) {
    const admin = await AdminModel.findById(req.admin.id);
    delete admin.password;
    res.json(admin);
  }

  async updateProfile(req, res, next) {
    try {
      const { nama_lengkap, email } = req.body;
      const adminId = req.admin.id;

      const success = await AdminModel.updateAdmin(adminId, {
        nama_lengkap,
        email,
      });

      if (!success) {
        throw new ApiError(404, "Admin not found");
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminId = req.admin.id;

      const admin = await AdminModel.findById(adminId);
      if (!admin) {
        throw new ApiError(404, "Admin not found");
      }

      const isValidPassword = await AdminModel.validatePassword(currentPassword, admin.password);
      if (!isValidPassword) {
        throw new ApiError(401, "Current password is incorrect");
      }

      await AdminModel.changePassword(adminId, newPassword);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res) {
    res.json({ message: "Get all users" });
  }

  async createUser(req, res) {
    res.json({ message: "Create user" });
  }

  async getUserById(req, res) {
    res.json({ message: "Get user by id" });
  }

  async updateUser(req, res) {
    res.json({ message: "Update user" });
  }

  async deleteUser(req, res) {
    res.json({ message: "Delete user" });
  }

  async updateUserStatus(req, res) {
    res.json({ message: "Update user status" });
  }

  async getAllContent(req, res) {
    res.json({ message: "Get all content" });
  }

  async createContent(req, res) {
    res.json({ message: "Create content" });
  }

  async getContentById(req, res) {
    res.json({ message: "Get content by id" });
  }

  async updateContent(req, res) {
    res.json({ message: "Update content" });
  }

  async deleteContent(req, res) {
    res.json({ message: "Delete content" });
  }

  async updateContentStatus(req, res) {
    res.json({ message: "Update content status" });
  }

  // Approve savings transaction
  async approveSavings(req, res, next) {
    try {
      const { id } = req.params;
      const admin_id = req.user.id;
      const { admin_notes } = req.body;

      const savings = await Savings.findById(id);
      if (!savings) {
        throw new ApiError(404, "Savings transaction not found");
      }

      if (savings.status !== 'pending') {
        throw new ApiError(400, "Transaction already processed");
      }

      // Update status to approved
      await Savings.updateStatus(id, {
        status: 'approved',
        admin_id,
        admin_notes: admin_notes || 'Approved'
      });

      const updatedSavings = await Savings.findById(id);

      // Send response immediately
      res.json({
        message: "Savings transaction approved",
        data: updatedSavings
      });

      // Send Telegram confirmation asynchronously
      setImmediate(() => {
        TelegramService.sendApprovalConfirmation({
          transaction_id: id,
          amount: savings.amount,
          user_name: savings.user_full_name || savings.user_name,
          admin_name: req.user.nama_lengkap || req.user.username
        }).catch(err => console.error('Telegram notification failed:', err));
      });
    } catch (error) {
      next(error);
    }
  }

  // Reject savings transaction
  async rejectSavings(req, res, next) {
    try {
      const { id } = req.params;
      const admin_id = req.user.id;
      const { admin_notes } = req.body;

      const savings = await Savings.findById(id);
      if (!savings) {
        throw new ApiError(404, "Savings transaction not found");
      }

      if (savings.status !== 'pending') {
        throw new ApiError(400, "Transaction already processed");
      }

      // Update status to rejected
      await Savings.updateStatus(id, {
        status: 'rejected',
        admin_id,
        admin_notes: admin_notes || 'Rejected'
      });

      const updatedSavings = await Savings.findById(id);

      // Send response immediately
      res.json({
        message: "Savings transaction rejected",
        data: updatedSavings
      });

      // Send Telegram confirmation asynchronously
      setImmediate(() => {
        TelegramService.sendRejectionConfirmation({
          transaction_id: id,
          amount: savings.amount,
          user_name: savings.user_full_name || savings.user_name,
          admin_name: req.user.nama_lengkap || req.user.username,
          reason: admin_notes || 'No reason provided'
        }).catch(err => console.error('Telegram notification failed:', err));
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all pending savings
  async getPendingSavings(req, res, next) {
    try {
      const pendingSavings = await Savings.findAll({ status: 'pending' });
      res.json({
        data: pendingSavings,
        count: pendingSavings.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all savings with filters
  async getAllSavings(req, res, next) {
    try {
      const { status, limit, offset } = req.query;
      const savings = await Savings.findAll({ 
        status, 
        limit: limit || 50, 
        offset: offset || 0 
      });
      
      res.json({
        data: savings,
        count: savings.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
