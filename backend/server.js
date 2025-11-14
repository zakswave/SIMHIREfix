import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
import authRoutes from './routes/auth.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import simulasiRoutes from './routes/simulasi.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import candidatesRoutes from './routes/candidates.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import backupsRoutes from './routes/backups.routes.js';
import internshipsRoutes from './routes/internships.routes.js';
import internshipApplicationsRoutes from './routes/internship-applications.routes.js';
import { errorHandler, notFound } from './utils/errors.js';
import logger, { requestLogger } from './utils/logger.js';
import { startAutoBackup } from './utils/backup.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http:

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(requestLogger);
}
app.use('/api/', apiLimiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SimHire API is running!',
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/simulasi', simulasiRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/internship-applications', internshipApplicationsRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🚀 SimHire Backend API Server                  ║
║                                                           ║
║   Status: ✅ Running                                      ║
║   Port: ${PORT}                                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Frontend URL: ${process.env.FRONTEND_URL || 'http:
║                                                           ║
║   API Endpoints:                                         ║
║   - Auth:         /api/auth                              ║
║   - Applications: /api/applications                      ║
║   - Jobs:         /api/jobs                              ║
║   - Simulasi:     /api/simulasi                          ║
║   - Portfolio:    /api/portfolio                         ║
║   - Candidates:   /api/candidates                        ║
║   - Dashboard:    /api/dashboard                         ║
║   - Backups:      /api/backups                           ║
║   - Internships:  /api/internships                       ║
║   - Int.Apps:     /api/internship-applications           ║
║   - Candidates:   /api/candidates                        ║
║   - Dashboard:    /api/dashboard                         ║
║   - Backups:      /api/backups                           ║
║                                                           ║
║   Health Check: http:
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  if (process.env.NODE_ENV === 'production') {
    startAutoBackup(24);
  } else {
    logger.info('Auto-backup enabled (development mode: 6 hours interval)');
    startAutoBackup(6);
  }
});
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
  process.exit(1);
});

export default app;
