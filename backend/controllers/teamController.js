const pool = require('../config/db');

const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const creatorId = req.user.id; // Passport provides this from the session!

        const newTeam = await pool.query(
            'INSERT INTO teams (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, creatorId]
        );

        await pool.query(
            'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
            [newTeam.rows[0].id, creatorId]
        );

        res.status(201).json({ message: 'Team created!', team: newTeam.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getTeams = async (req, res) => {
    try {
        const userId = req.user.id;
        const teams = await pool.query(
            `SELECT t.* FROM teams t
             JOIN team_members tm ON t.id = tm.team_id
             WHERE tm.user_id = $1`,
            [userId]
        );
        res.status(200).json(teams.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTeam, getTeams };