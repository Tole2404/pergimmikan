const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/team.controller');
const adminAuth = require('../../middleware/adminAuth');
const upload = require('../../config/multer');

// Routes
router.get('/', adminAuth, teamController.getAllTeamMembers);
router.get('/:id', adminAuth, teamController.getTeamMemberById);
router.post('/', adminAuth, upload.single('image'), teamController.createTeamMember);
router.put('/:id', adminAuth, upload.single('image'), teamController.updateTeamMember);
router.delete('/:id', adminAuth, teamController.deleteTeamMember);

module.exports = router;
