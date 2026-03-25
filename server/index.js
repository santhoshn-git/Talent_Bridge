require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/db');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { initializeDatabase } = require('./db/init');

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const uploadRoute = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5000;

// Apply security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  },
}));

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://*.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use("/api/upload", uploadRoute);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

async function startServer() {
  try {
    await initializeDatabase();
    const client = await pool.connect();
    const result = await client.query('SELECT current_database()');
    client.release();
    console.log(`✅ PostgreSQL connected → database: "${result.rows[0].current_database}"`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API ready at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:');
    console.error('   ', err.message);
    process.exit(1);
  }
}

startServer();
