const express = require('express');
const router = express.Router();
const { createTeam, getTeams } = require('../controllers/teamController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.post('/', ensureAuthenticated, createTeam);
router.get('/', ensureAuthenticated, getTeams);

module.exports = router;