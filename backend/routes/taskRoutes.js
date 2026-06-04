const express = require('express');
const router = express.Router();
const { createTask, getTasksByTeam, updateTask, deleteTask } = require('../controllers/taskController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.post('/', ensureAuthenticated, createTask);
router.get('/team/:teamId', ensureAuthenticated, getTasksByTeam);
router.put('/:id', ensureAuthenticated, updateTask);
router.delete('/:id', ensureAuthenticated, deleteTask);

module.exports = router;