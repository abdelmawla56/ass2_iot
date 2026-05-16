import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/telemetry-summary', async (req, res) => {
  const { zoneId } = req.query;
  
  // Get last 24 hours of telemetry
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const telemetry = await prisma.telemetry.findMany({
    where: {
      timestamp: { gte: yesterday },
      device: zoneId ? { zoneId: String(zoneId) } : undefined
    },
    orderBy: { timestamp: 'asc' }
  });

  // Group by hour
  const summary: any = {};
  telemetry.forEach(t => {
    const hour = new Date(t.timestamp).getHours();
    if (!summary[hour]) {
      summary[hour] = { hour, temp: [], hum: [], count: 0 };
    }
    summary[hour].temp.push(t.temperature);
    summary[hour].hum.push(t.humidity);
    summary[hour].count++;
  });

  const result = Object.values(summary).map((s: any) => ({
    hour: `${s.hour}:00`,
    temperature: s.temp.reduce((a: number, b: number) => a + b, 0) / s.count,
    humidity: s.hum.reduce((a: number, b: number) => a + b, 0) / s.count
  }));

  res.json(result);
});

router.get('/device-stats', async (req, res) => {
  const total = await prisma.device.count();
  const online = await prisma.device.count({ where: { status: 'ONLINE' } });
  const offline = await prisma.device.count({ where: { status: 'OFFLINE' } });
  const updating = await prisma.device.count({ where: { status: 'UPDATING' } });

  res.json({ total, online, offline, updating });
});

router.get('/risk-distribution', async (req, res) => {
  const alerts = await prisma.alert.groupBy({
    by: ['severity'],
    _count: { severity: true },
    where: { resolved: false }
  });

  res.json(alerts);
});

export default router;
