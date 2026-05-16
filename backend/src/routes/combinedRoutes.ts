import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Zones
router.get('/zones', async (req, res) => {
  const zones = await prisma.zone.findMany({ include: { _count: { select: { devices: true } } } });
  res.json(zones);
});

// Alerts
router.get('/alerts', async (req, res) => {
  const alerts = await prisma.alert.findMany({
    where: { resolved: false },
    include: { device: true, zone: true },
    orderBy: { timestamp: 'desc' }
  });
  res.json(alerts);
});

router.post('/alerts/:id/resolve', async (req, res) => {
  await prisma.alert.update({
    where: { id: req.params.id },
    data: { resolved: true }
  });
  res.json({ message: 'Alert resolved' });
});

// Telemetry (Real-time stream latest)
router.get('/telemetry/latest', async (req, res) => {
  const telemetry = await prisma.telemetry.findMany({
    orderBy: { timestamp: 'desc' },
    take: 20,
    include: { device: true }
  });
  res.json(telemetry);
});

export default router;
