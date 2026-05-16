import express from 'express';
import { PrismaClient } from '@prisma/client';
import mqttService from '../services/mqttService';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/versions', async (req, res) => {
  const versions = await prisma.firmwareVersion.findMany();
  res.json(versions);
});

router.post('/update', async (req, res) => {
  const { deviceId, zoneId, version } = req.body;

  // Find target devices
  let devices: any[] = [];
  if (deviceId) {
    const d = await prisma.device.findUnique({ where: { deviceId } });
    if (d) devices.push(d);
  } else if (zoneId) {
    devices = await prisma.device.findMany({ where: { zoneId } });
  }

  // Send MQTT command for each device
  devices.forEach(d => {
    mqttService.publish('iot/ota/command', {
      deviceId: d.deviceId,
      version: version
    });
  });

  res.json({ message: `OTA update command sent to ${devices.length} devices.` });
});

router.get('/history', async (req, res) => {
  const history = await prisma.oTAUpdate.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50,
    include: { device: true }
  });
  res.json(history);
});

export default router;
