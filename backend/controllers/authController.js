const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const passport = require('passport');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'A user with that email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({
        message: 'User registered successfully!',
        user: newUser.rows[0]
    });

  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


const loginUser = (req, res, next) => {
  // We use the Passport configuration we wrote earlier
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(400).json({ message: info.message });

    // If password matches, we log the user in and create the session
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login failed' });
      res.status(200).json({
          message: 'Logged in successfully',
          user: { id: user.id, name: user.name, email: user.email }
      });
    });
  })(req, res, next);
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

module.exports = { registerUser, loginUser, logoutUser };