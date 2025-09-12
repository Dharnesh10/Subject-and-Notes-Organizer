const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const subjectRoutes = require('./routes/subjects');
const {User} = require('./models/user');

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
// connect to db
db();

// API routes

app.get('/', (_req, res) => {
    res.status(200).send('API is running...');
})

//jwt token verification middleware
app.get('/api/me', authMiddleware, async (req, res) => {
    const me = await User.findById(req.user.id).select('-passwordHash');
    if (!me) return res.status(404).send('User not found.');
    res.status(200).send(me);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});