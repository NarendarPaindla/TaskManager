const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Allow React frontend
  credentials: true,              // ✅ Allow cookies/auth headers (if needed)
}));
app.use(cors());
app.get('/', (req, res) => {
  res.send('Task Manager API is running!');
});

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
// Static folder to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// Upload API
app.use('/api/upload', uploadRoutes);
// 🔹 Custom Middleware
app.use(notFound);        // 404 handler
app.use(errorHandler);    // General error handler

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
