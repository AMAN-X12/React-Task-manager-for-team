const pool = require('../config/db');

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, due_date, team_id, assignee_id } = req.body;
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, due_date, team_id, assignee_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, due_date, team_id, assignee_id]
        );
        res.status(201).json({ message: 'Task created!', task: newTask.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all tasks for a specific team
const getTasksByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tasks = await pool.query('SELECT * FROM tasks WHERE team_id = $1', [teamId]);
        res.status(200).json(tasks.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a task (status or assignee)
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignee_id } = req.body;
        const updatedTask = await pool.query(
            'UPDATE tasks SET status = COALESCE($1, status), assignee_id = COALESCE($2, assignee_id) WHERE id = $3 RETURNING *',
            [status, assignee_id, id]
        );
        res.status(200).json({ message: 'Task updated!', task: updatedTask.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTask, getTasksByTeam, updateTask, deleteTask };