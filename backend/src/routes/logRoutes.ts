import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/security', async (req, res) => {
  const logs = await prisma.securityLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100
  });
  res.json(logs);
});

router.get('/system', async (req, res) => {
  // In a real app, you'd fetch from a log aggregator. Here we'll return some mock system events.
  res.json([
    { id: 1, event: 'System Start', message: 'IoT Platform Initialized', timestamp: new Date() },
    { id: 2, event: 'Database Connection', message: 'PostgreSQL Connected', timestamp: new Date() },
    { id: 3, event: 'MQTT Broker', message: 'Mosquitto Connected', timestamp: new Date() }
  ]);
});

export default router;
