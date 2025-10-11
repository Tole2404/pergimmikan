const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/team.controller');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

// Routes
router.get('/', auth, teamController.getAllTeamMembers);
router.get('/:id', auth, teamController.getTeamMemberById);
router.post('/', auth, upload.single('image'), teamController.createTeamMember);
router.put('/:id', auth, upload.single('image'), teamController.updateTeamMember);
router.delete('/:id', auth, teamController.deleteTeamMember);

module.exports = router;
