const RoleModel = require('../../models/role.model');
const ApiError = require('../../utils/apiError');

class RoleController {
  async getAllRoles(req, res, next) {
    try {
      const roles = await RoleModel.findAll();
      res.json(roles);
    } catch (error) {
      next(new ApiError(500, 'Failed to fetch roles'));
    }
  }

  async createRole(req, res, next) {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        throw new ApiError(400, 'Role name is required');
      }

      const roleExists = await RoleModel.findByName(name);
      if (roleExists) {
        throw new ApiError(400, 'Role with this name already exists');
      }

      const roleId = await RoleModel.create({ name, description });
      res.status(201).json({ 
        message: 'Role created successfully',
        id: roleId 
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name) {
        throw new ApiError(400, 'Role name is required');
      }

      const roleExists = await RoleModel.findById(id);
      if (!roleExists) {
        throw new ApiError(404, 'Role not found');
      }

      const nameExists = await RoleModel.findByName(name);
      if (nameExists && nameExists.id !== parseInt(id)) {
        throw new ApiError(400, 'Role with this name already exists');
      }

      const success = await RoleModel.update(id, { name, description });
      if (success) {
        res.json({ message: 'Role updated successfully' });
      } else {
        throw new ApiError(500, 'Failed to update role');
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req, res, next) {
    try {
      const { id } = req.params;

      const roleExists = await RoleModel.findById(id);
      if (!roleExists) {
        throw new ApiError(404, 'Role not found');
      }

      // Check if role is being used by any users
      const usersWithRole = await RoleModel.countUsers(id);
      if (usersWithRole > 0) {
        throw new ApiError(400, `Cannot delete role. It is assigned to ${usersWithRole} user(s)`);
      }

      const success = await RoleModel.delete(id);
      if (success) {
        res.json({ message: 'Role deleted successfully' });
      } else {
        throw new ApiError(500, 'Failed to delete role');
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();
