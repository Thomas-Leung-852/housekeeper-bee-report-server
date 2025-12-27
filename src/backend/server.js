import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import configRoutes from './routes/configRoutes.js';
import rateLimit from 'express-rate-limit';
import https from 'https';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Load SSL certificate and key
const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')), // Path to your private key
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')) // Path to your certificate
};

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));  

// Body parser middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/**------------------------------------------------------------------------------------------------------------- */
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

// Apply rate limiting
app.use('/api/', limiter);

/**------------------------------------------------------------------------------------------------------------- */

// API Routes
app.use('/api', configRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

 app.use(express.static(path.join(__dirname, './public')));

// app.get('/proxy', (req, res) => {
//     const url = 'http://localhost:3005'; // Change this to the actual URL
//     request(url).pipe(res);
// });

/**------------------------------------------------------------------------------------------------------------- */

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/**------------------------------------------------------------------------------------------------------------- */

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`🚀 Backend server running on https://localhost:${PORT}`);
  console.log(`📊 API: https://localhost:${PORT}/api`);
  console.log(`🏥 Health: https://localhost:${PORT}/health`);
});