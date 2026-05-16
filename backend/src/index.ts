import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import mqttService from './services/mqttService';
import authRoutes from './routes/authRoutes';
import combinedRoutes from './routes/combinedRoutes';
import otaRoutes from './routes/otaRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import logRoutes from './routes/logRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', combinedRoutes);
app.use('/api/ota', otaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log('Connected to Database');
    
    // Initialize MQTT Service
    mqttService.init();
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

start();

export { prisma };
