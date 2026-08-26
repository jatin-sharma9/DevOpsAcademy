import dotenv from 'dotenv';
import app from './app.js';
import { migrate } from './src/config/migrate.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database schema and start server
const startServer = async () => {
  try {
    // Run schema migrations if DB connection available
    await migrate();

    app.listen(PORT, () => {
      console.log(`🚀 DevOps Academy Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
