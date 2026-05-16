import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SecurityService {
  async analyzeTelemetry(deviceId: string, data: any) {
    const { temperature, humidity } = data;

    if (temperature > 60 || temperature < -20 || humidity > 100 || humidity < 0) {
      await prisma.securityLog.create({
        data: {
          eventType: 'SUSPICIOUS_TELEMETRY',
          description: `Device ${deviceId} reported extreme values: Temp ${temperature}, Hum ${humidity}`,
          severity: 'WARN'
        }
      });
    }
  }

  async logAuthFailure(email: string, reason: string) {
    await prisma.securityLog.create({
      data: {
        eventType: 'AUTH_FAILURE',
        description: `Failed login attempt for ${email}: ${reason}`,
        severity: 'LOW'
      }
    });
  }

  async logRogueDevice(deviceId: string) {
    await prisma.securityLog.create({
      data: {
        eventType: 'ROGUE_DEVICE',
        description: `Unrecognized device ${deviceId} attempted to connect.`,
        severity: 'CRITICAL'
      }
    });
  }
}

export default new SecurityService();
