const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

// MUST be first — tells Express to trust the Render proxy so
// req.secure is correct, which makes secure cookies work.
app.set('trust proxy', 1);

require('./config/passport')(passport);

// --- CORS: allow both local dev and the live Render frontend ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://team-task-frontend-hyl0.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  // Required so the browser sends/receives cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SESSION: sameSite:'none' + secure:true lets the cookie cross
//     different Render subdomains (frontend.onrender.com -> backend.onrender.com)
app.use(session({
    store: new pgSession({
      pool: pool,
      tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      // In production (Render) we MUST have secure:true for sameSite:'none' to work
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Team Task Manager API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
