// app.js
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

require('./config/env');  // Just load the environment variables here, no need for a function call

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/support-tickets', require('./routes/supportTicketRoutes'));
app.use('/api/suspensions', require('./routes/suspensionRoutes'));
app.use('/api/warnings', require('./routes/warningRoutes'));
app.use('/api/auth', authRoutes);
// Error Middleware
app.use(errorHandler);

module.exports = app;
