import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const devices = await prisma.device.findMany({
    include: { zone: true }
  });
  res.json(devices);
});

router.get('/:id', async (req, res) => {
  const device = await prisma.device.findUnique({
    where: { id: req.params.id },
    include: { zone: true, alerts: { where: { resolved: false } } }
  });
  res.json(device);
});

router.post('/', async (req, res) => {
  const { deviceId, name, zoneId } = req.body;
  const device = await prisma.device.create({
    data: { deviceId, name, zoneId }
  });
  res.status(201).json(device);
});

export default router;
