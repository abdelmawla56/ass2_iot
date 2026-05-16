import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@crop.io' },
    update: {},
    create: {
      email: 'admin@crop.io',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // Create Zones
  const zone1 = await prisma.zone.upsert({
    where: { name: 'Zone 1' },
    update: {},
    create: { name: 'Zone 1', description: 'North Wheat Field', location: '45.123, -75.456' }
  });

  const zone2 = await prisma.zone.upsert({
    where: { name: 'Zone 2' },
    update: {},
    create: { name: 'Zone 2', description: 'South Vineyard', location: '45.125, -75.458' }
  });

  // Create Devices
  for (let i = 1; i <= 10; i++) {
    const deviceId = `device_${i.toString().padStart(2, '0')}`;
    const zoneId = i <= 5 ? zone1.id : zone2.id;
    await prisma.device.upsert({
      where: { deviceId },
      update: {},
      create: {
        deviceId,
        name: `Sensor ${i}`,
        zoneId,
        status: 'OFFLINE'
      }
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
