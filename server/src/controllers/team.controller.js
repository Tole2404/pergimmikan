const Team = require('../models/team.model');
const ApiError = require('../utils/apiError');

class TeamController {
  // Get all team members with optional search and filter
  async getAllTeamMembers(req, res, next) {
    try {
      let members;
      if (req.query.search) {
        members = await Team.search(req.query.search);
      } else if (req.query.status && req.query.status !== 'all') {
        members = await Team.filterByStatus(req.query.status);
      } else {
        members = await Team.findAll();
      }
      res.json(members);
    } catch (error) {
      next(error);
    }
  }

  // Get team member by ID
  async getTeamMemberById(req, res, next) {
    try {
      const member = await Team.findById(req.params.id);
      if (!member) {
        throw new ApiError(404, 'Team member not found');
      }
      res.json(member);
    } catch (error) {
      next(error);
    }
  }

  // Create new team member
  async createTeamMember(req, res, next) {
    try {
      const { name, short_name, role, description, status, linkedin, github, instagram } = req.body;
      const image_url = req.file ? `/images/team/${req.file.filename}` : null;

      // Handle social media data
      let social_media = {};
      
      // Try parsing social media from JSON string
      if (req.body.social) {
        try {
          social_media = typeof req.body.social === 'string' 
            ? JSON.parse(req.body.social)
            : req.body.social;
        } catch (error) {}
      }
      
      // If individual fields are provided, use them instead
      if (linkedin || github || instagram) {
        social_media = {
          linkedin: linkedin || null,
          github: github || null,
          instagram: instagram || null
        };
      }

      const teamId = await Team.create({
        name,
        short_name: short_name || null,
        role,
        image_url,
        description,
        status: status || 'active',
        social_media
      });

      const newMember = await Team.findById(teamId);
      res.status(201).json(newMember);
    } catch (error) {
      next(error);
    }
  }

  // Update team member
  async updateTeamMember(req, res, next) {
    try {
      console.log('=== UPDATE TEAM MEMBER ===');
      console.log('Team ID:', req.params.id);
      console.log('Request body:', req.body);
      console.log('File:', req.file);
      
      const { name, short_name, role, description, status, linkedin, github, instagram } = req.body;
      
      // Handle social media data
      let social_media = {};
      
      // Try parsing social media from JSON string
      if (req.body.social) {
        try {
          social_media = typeof req.body.social === 'string' 
            ? JSON.parse(req.body.social)
            : req.body.social;
        } catch (error) {}
      }
      
      // If individual fields are provided, use them instead
      if (linkedin || github || instagram) {
        social_media = {
          linkedin: linkedin || null,
          github: github || null,
          instagram: instagram || null
        };
      }

      const updates = {
        name,
        short_name: short_name !== undefined ? (short_name || null) : undefined,
        role,
        description,
        status: status || 'active',
        social_media
      };

      if (req.file) {
        updates.image_url = `/images/team/${req.file.filename}`;
      }

      console.log('Updates to apply:', updates);

      await Team.update(req.params.id, updates);
      
      console.log('Update successful!');
      const updatedMember = await Team.findById(req.params.id);
      res.json(updatedMember);
    } catch (error) {
      console.error('=== ERROR UPDATING TEAM ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error code:', error.code);
      console.error('Error SQL:', error.sql);
      next(error);
    }
  }

  // Delete team member
  async deleteTeamMember(req, res, next) {
    try {
      const deleted = await Team.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Team member not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
