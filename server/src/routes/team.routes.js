const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');

// Public team routes
router.get('/', teamController.getAllTeamMembers.bind(teamController));
router.get('/:id', teamController.getTeamMemberById.bind(teamController));

module.exports = router;
