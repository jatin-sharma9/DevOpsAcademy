import dotenv from 'dotenv';
import app from './app.js';
import { migrate } from './src/config/migrate.js';
import { User } from './src/models/userModel.js';
import { closePool } from './src/config/db.js';
import { validateEnv } from './src/config/validateEnv.js';

dotenv.config();

// Validate critical environment configurations
validateEnv();

const PORT = parseInt(process.env.PORT || '5000', 10);
let server = null;

// Initialize database schema, default admin account, and start server
const startServer = async () => {
  try {
    // Run schema migrations and indexes
    await migrate();

    // Ensure default admin account exists (Username: Jatin_Sharma)
    await User.ensureDefaultAdmin();

    server = app.listen(PORT, () => {
      console.log(`🚀 DevOps Academy Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await closePool();
      console.log('Process terminated gracefully.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds if hanging
    setTimeout(() => {
      console.error('Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  } else {
    await closePool();
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

startServer();
